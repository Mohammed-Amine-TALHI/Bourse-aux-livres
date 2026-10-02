<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AuthTest extends TestCase
{
    use RefreshDatabase;

    public function test_a_visitor_can_register_and_is_logged_in(): void
    {
        $response = $this->postJson('/api/register', [
            'name' => 'Test Student',
            'email' => 'student@example.com',
            'phonenumber' => '0612345678',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['access_token', 'user' => ['id', 'name', 'email', 'role']])
            ->assertJsonPath('user.role', 'user');

        $this->assertNotSame('secret-password', User::first()->password);
    }

    public function test_registration_is_validated(): void
    {
        User::factory()->create(['email' => 'taken@example.com']);

        $this->postJson('/api/register', [
            'name' => '',
            'email' => 'taken@example.com',
            'phonenumber' => 'abc',
            'password' => 'short',
            'password_confirmation' => 'different',
        ])->assertStatus(422)->assertJsonValidationErrors(['name', 'email', 'phonenumber', 'password']);
    }

    public function test_a_user_cannot_register_as_admin(): void
    {
        $this->postJson('/api/register', [
            'name' => 'Sneaky',
            'email' => 'sneaky@example.com',
            'phonenumber' => '0612345678',
            'password' => 'secret-password',
            'password_confirmation' => 'secret-password',
            'role' => 'admin',
        ])->assertCreated()->assertJsonPath('user.role', 'user');
    }

    public function test_login_returns_a_token_and_rejects_bad_credentials(): void
    {
        $user = User::factory()->create();

        $this->postJson('/api/login', ['email' => $user->email, 'password' => 'wrong'])
            ->assertStatus(401);

        $token = $this->postJson('/api/login', ['email' => $user->email, 'password' => 'password'])
            ->assertOk()
            ->json('access_token');

        $this->withToken($token)->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('email', $user->email);
    }

    public function test_protected_routes_require_a_token(): void
    {
        $this->getJson('/api/me')->assertStatus(401);
        $this->getJson('/api/my/books')->assertStatus(401);
        $this->getJson('/api/wishlist')->assertStatus(401);
        $this->getJson('/api/admin/users')->assertStatus(401);
    }
}
