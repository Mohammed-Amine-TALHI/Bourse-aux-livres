<?php

namespace Tests\Feature;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BookTest extends TestCase
{
    use RefreshDatabase;

    protected Category $category;

    protected function setUp(): void
    {
        parent::setUp();

        $this->category = Category::create(['name' => 'Novels', 'slug' => 'novels']);
    }

    protected function admin(): User
    {
        $admin = User::factory()->create();
        $admin->role = 'admin';
        $admin->save();

        return $admin;
    }

    protected function asGuest(): void
    {
        $this->app['auth']->forgetGuards();
    }

    protected function payload(array $overrides = []): array
    {
        return array_merge([
            'category_id' => $this->category->id,
            'book_title' => 'Clean Code',
            'author' => 'Robert C. Martin',
            'description' => 'Good condition.',
            'selling_price' => 120,
            'original_price' => 300,
            'qty' => 1,
        ], $overrides);
    }

    protected function createBook(User $seller, int $request = Book::APPROVED): Book
    {
        $book = new Book($this->payload());
        $book->seller_id = $seller->id;
        $book->request = $request;
        $book->save();

        return $book;
    }

    public function test_a_new_listing_stays_private_until_an_admin_approves_it(): void
    {
        $seller = User::factory()->create();

        $id = $this->actingAs($seller)->postJson('/api/books', $this->payload())
            ->assertCreated()
            ->assertJsonPath('book.request', Book::PENDING)
            ->json('book.id');

        $this->actingAs($seller)->getJson('/api/my/books')->assertJsonCount(1, 'books');

        $this->asGuest();
        $this->getJson('/api/books')->assertOk()->assertJsonCount(0, 'books');
        $this->getJson("/api/books/{$id}")->assertNotFound();

        $this->actingAs($this->admin())
            ->patchJson("/api/admin/books/{$id}/request", ['request' => Book::APPROVED])
            ->assertOk();

        $this->asGuest();
        $this->getJson('/api/books')->assertJsonCount(1, 'books');
        $this->getJson("/api/books/{$id}")->assertOk()->assertJsonPath('seller_phone', null);
    }

    public function test_the_seller_phone_is_only_shared_with_logged_in_users(): void
    {
        $seller = User::factory()->create(['phonenumber' => '0611223344']);
        $book = $this->createBook($seller);

        $this->getJson("/api/books/{$book->id}")->assertJsonPath('seller_phone', null);

        $this->actingAs(User::factory()->create())
            ->getJson("/api/books/{$book->id}")
            ->assertJsonPath('seller_phone', '0611223344');
    }

    public function test_book_input_is_validated(): void
    {
        $this->actingAs(User::factory()->create())
            ->postJson('/api/books', $this->payload(['book_title' => '', 'selling_price' => -5, 'category_id' => 999]))
            ->assertStatus(422)
            ->assertJsonValidationErrors(['book_title', 'selling_price', 'category_id']);
    }

    public function test_a_user_cannot_touch_someone_elses_book(): void
    {
        $book = $this->createBook(User::factory()->create());
        $intruder = User::factory()->create();

        $this->actingAs($intruder)->postJson("/api/books/{$book->id}", $this->payload(['book_title' => 'Hacked']))
            ->assertForbidden();
        $this->actingAs($intruder)->patchJson("/api/books/{$book->id}/quantity", ['quantity' => 0])
            ->assertForbidden();
        $this->actingAs($intruder)->deleteJson("/api/books/{$book->id}")
            ->assertForbidden();

        $this->assertSame('Clean Code', $book->fresh()->book_title);
    }

    public function test_the_seller_can_edit_without_uploading_a_new_cover_and_keeps_ownership(): void
    {
        $seller = User::factory()->create();
        $book = $this->createBook($seller);

        $this->actingAs($this->admin())
            ->postJson("/api/books/{$book->id}", $this->payload(['book_title' => 'Clean Code (2nd edition)', 'featured' => true]))
            ->assertOk();

        $book->refresh();
        $this->assertSame('Clean Code (2nd edition)', $book->book_title);
        $this->assertSame($seller->id, $book->seller_id);
        $this->assertTrue($book->featured);
    }

    public function test_only_admins_can_feature_a_book(): void
    {
        $seller = User::factory()->create();

        $this->actingAs($seller)
            ->postJson('/api/books', $this->payload(['featured' => true, 'popular' => true]))
            ->assertCreated()
            ->assertJsonPath('book.featured', false)
            ->assertJsonPath('book.popular', false);
    }

    public function test_admin_routes_are_forbidden_to_regular_users(): void
    {
        $user = User::factory()->create();
        $book = $this->createBook($user, Book::PENDING);

        $this->actingAs($user)->getJson('/api/admin/users')->assertForbidden();
        $this->actingAs($user)->putJson("/api/admin/users/{$user->id}/role", ['role' => 'admin'])->assertForbidden();
        $this->actingAs($user)->patchJson("/api/admin/books/{$book->id}/request", ['request' => Book::APPROVED])->assertForbidden();
        $this->actingAs($user)->postJson('/api/admin/categories', ['name' => 'Comics'])->assertForbidden();

        $this->assertSame('user', $user->fresh()->role);
    }

    public function test_an_admin_can_manage_categories(): void
    {
        $admin = $this->admin();

        $id = $this->actingAs($admin)->postJson('/api/admin/categories', ['name' => 'Sciences & Engineering'])
            ->assertCreated()
            ->assertJsonPath('category.slug', 'sciences-engineering')
            ->json('category.id');

        $this->actingAs($admin)->postJson('/api/admin/categories', ['name' => 'Sciences & Engineering'])
            ->assertStatus(422);

        $this->actingAs($admin)->putJson("/api/admin/categories/{$id}", ['name' => 'Sciences', 'slug' => 'sciences', 'status' => true])
            ->assertOk();

        // Hidden categories disappear from the public list.
        $this->asGuest();
        $this->getJson('/api/categories')->assertJsonCount(1, 'categories');

        // A category that still has books cannot be deleted.
        $this->createBook($admin);
        $this->actingAs($admin)->deleteJson("/api/admin/categories/{$this->category->id}")->assertStatus(409);
        $this->actingAs($admin)->deleteJson("/api/admin/categories/{$id}")->assertOk();
    }

    public function test_wishlist_flow(): void
    {
        $book = $this->createBook(User::factory()->create());
        $user = User::factory()->create();

        $this->actingAs($user)->postJson('/api/wishlist', ['book_id' => $book->id])->assertCreated();
        $this->actingAs($user)->postJson('/api/wishlist', ['book_id' => $book->id])->assertOk();

        $this->actingAs($user)->getJson('/api/wishlist')
            ->assertJsonCount(1, 'books')
            ->assertJsonPath('books.0.id', $book->id);

        $this->actingAs($user)->getJson("/api/books/{$book->id}")->assertJsonPath('in_wishlist', true);

        $this->actingAs($user)->deleteJson("/api/wishlist/{$book->id}")->assertOk();
        $this->actingAs($user)->getJson('/api/wishlist')->assertJsonCount(0, 'books');
    }
}
