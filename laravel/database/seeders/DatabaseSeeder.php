<?php

namespace Database\Seeders;

use App\Models\Book;
use App\Models\Category;
use App\Models\User;
use App\Models\Wish;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with demo accounts and a small catalogue.
     *
     * Every demo account uses the password "password".
     */
    public function run(): void
    {
        $admin = $this->user('Amine Talhi', 'admin@bourse.test', '0661000001', 'admin');
        $salma = $this->user('Salma Bennani', 'salma@bourse.test', '0661000002');
        $youssef = $this->user('Youssef El Idrissi', 'youssef@bourse.test', '0661000003');
        $ines = $this->user('Ines Chraibi', 'ines@bourse.test', '0661000004');

        $categories = collect([
            'Sciences & Engineering' => 'Maths, physics, computer science and engineering textbooks.',
            'Preparatory Classes' => 'MPSI, PCSI, MP, PSI: course books, exercises and past exam papers.',
            'Business & Finance' => 'Economics, management, investing and entrepreneurship.',
            'Personal Development' => 'Habits, productivity, negotiation and mindset.',
            'Novels' => 'Fiction and romance to take a break between two exams.',
            'Languages' => 'English, French, Spanish and German learning material.',
        ])->map(fn ($description, $name) => Category::create([
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => $description,
        ]));

        $books = [
            // title, author, category, seller, price, original, qty, cover, school, flags
            ['Atomic Habits', 'James Clear', 'Personal Development', $salma, 90, 180, 1, 'atomic-habits.jpg', null, ['popular', 'featured']],
            ['Never Split the Difference', 'Chris Voss', 'Personal Development', $youssef, 85, 170, 1, 'never-split-the-difference.jpg', null, ['popular']],
            ['Think and Grow Rich', 'Napoleon Hill', 'Business & Finance', $ines, 60, 120, 2, 'think-and-grow-rich.jpg', null, ['popular']],
            ['Rich Dad Poor Dad', 'Robert T. Kiyosaki', 'Business & Finance', $salma, 70, 140, 1, 'rich-dad-poor-dad.jpg', null, ['popular', 'featured']],
            ['It Ends with Us', 'Colleen Hoover', 'Novels', $ines, 75, 150, 1, 'it-ends-with-us.jpg', null, ['popular', 'featured']],
            ['Confess', 'Colleen Hoover', 'Novels', $ines, 65, 130, 1, 'confess.jpg', null, ['featured']],
            ['Hopeless', 'Colleen Hoover', 'Novels', $youssef, 60, 130, 0, 'hopeless.jpg', null, []],
            ['One True Loves', 'Taylor Jenkins Reid', 'Novels', $salma, 70, 145, 1, 'one-true-love.jpg', null, ['popular']],
            ['The Trouble with Hating You', 'Sajni Patel', 'Novels', $youssef, 55, 120, 1, 'the-trouble-with-hating-you.jpg', null, []],
            ['The Beginning of Everything', 'Robyn Schneider', 'Novels', $ines, 50, 110, 1, 'beginning.jpg', null, ['featured']],
            ['Introduction to Algorithms', 'Cormen, Leiserson, Rivest, Stein', 'Sciences & Engineering', $youssef, 450, 950, 1, null, 'EMINES - UM6P', ['featured']],
            ['Signals and Systems', 'Alan V. Oppenheim', 'Sciences & Engineering', $salma, 320, 700, 1, null, 'EMINES - UM6P', ['popular']],
            ['Engineering Mechanics: Dynamics', 'J. L. Meriam', 'Sciences & Engineering', $ines, 280, 650, 2, null, 'EMINES - UM6P', []],
            ['Maths MPSI - Tout-en-un', 'Claude Deschamps', 'Preparatory Classes', $youssef, 150, 390, 3, null, 'CPGE Moulay Youssef', ['popular', 'featured']],
            ['Physique PCSI - Tout-en-un', 'Bernard Salamito', 'Preparatory Classes', $salma, 140, 390, 1, null, 'CPGE Ibn Timiya', []],
            ['Principles of Corporate Finance', 'Brealey, Myers, Allen', 'Business & Finance', $ines, 300, 720, 1, null, 'Africa Business School', []],
            ['English Grammar in Use', 'Raymond Murphy', 'Languages', $salma, 110, 260, 2, null, null, ['featured']],
            ['Le Petit Prince', 'Antoine de Saint-Exupery', 'Languages', $youssef, 30, 60, 4, null, null, []],
        ];

        foreach ($books as [$title, $author, $category, $seller, $price, $original, $qty, $cover, $school, $flags]) {
            $this->book($title, $author, $categories[$category], $seller, $price, $original, $qty, $cover, $school, $flags);
        }

        // Two listings still waiting for the admin, so the review queue is not empty.
        $this->book('Clean Code', 'Robert C. Martin', $categories['Sciences & Engineering'], $salma, 220, 480, 1, null, 'EMINES - UM6P', [], Book::PENDING);
        $this->book('Chimie MPSI - Exercices corriges', 'Pierre Grecias', $categories['Preparatory Classes'], $ines, 95, 250, 1, null, 'CPGE Moulay Youssef', [], Book::PENDING);

        foreach ([[$salma, 'Introduction to Algorithms'], [$salma, 'It Ends with Us'], [$youssef, 'Atomic Habits'], [$admin, 'Signals and Systems']] as [$user, $title]) {
            Wish::create([
                'user_id' => $user->id,
                'book_id' => Book::where('book_title', $title)->value('id'),
            ]);
        }
    }

    protected function user(string $name, string $email, string $phone, string $role = 'user'): User
    {
        $user = new User([
            'name' => $name,
            'email' => $email,
            'phonenumber' => $phone,
            'password' => 'password',
        ]);
        $user->role = $role;
        $user->save();

        return $user;
    }

    protected function book(
        string $title,
        string $author,
        Category $category,
        User $seller,
        float $price,
        float $original,
        int $qty,
        ?string $cover,
        ?string $school,
        array $flags,
        int $request = Book::APPROVED,
    ): Book {
        $book = new Book([
            'category_id' => $category->id,
            'book_title' => $title,
            'author' => $author,
            'isbn' => '978'.str_pad((string) crc32($title), 10, '0', STR_PAD_LEFT),
            'school_name' => $school,
            'genre' => $category->name,
            'description' => "Second-hand copy of \"{$title}\" by {$author}, in good condition: "
                .[
                    'no missing pages, a few pencil annotations in the first chapters.',
                    'read once, cover slightly worn on the corners.',
                    'like new, kept covered during the whole school year.',
                    'some highlighted passages, otherwise very clean.',
                ][strlen($title) % 4]
                .' Hand-to-hand delivery on campus.',
            'selling_price' => $price,
            'original_price' => $original,
            'qty' => $qty,
        ]);

        $book->seller_id = $seller->id;
        $book->request = $request;
        $book->featured = in_array('featured', $flags);
        $book->popular = in_array('popular', $flags);
        $book->cover_image = $cover ? $this->publishCover($cover) : null;
        // Spread the listings over the last weeks so "Just added" is not in insertion order.
        $book->created_at = now()->subHours(crc32($title) % 600);
        $book->save();

        return $book;
    }

    /**
     * Copy a demo cover next to the user uploads so it is served like any other cover.
     */
    protected function publishCover(string $filename): string
    {
        File::ensureDirectoryExists(public_path(Book::COVER_DIR));
        File::copy(database_path('seeders/covers/'.$filename), public_path(Book::COVER_DIR.'/seed-'.$filename));

        return Book::COVER_DIR.'/seed-'.$filename;
    }
}
