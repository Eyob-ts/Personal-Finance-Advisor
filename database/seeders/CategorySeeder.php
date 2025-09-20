<?php

namespace Database\Seeders;

use App\Models\category;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $user = User::firstOrCreate(
            ['email' => 'test@example.com'],
            [
                'name' => 'Test User',
                'password' => bcrypt('password')
            ]
        );

        // Create default categories that match your enum values
        $defaultCategories = [
            ['user_id' => $user->id, 'name' => 'Food', 'type' => 'expense'],
            ['user_id' => $user->id, 'name' => 'Transportation', 'type' => 'expense'],
            ['user_id' => $user->id, 'name' => 'Salary', 'type' => 'income'],
            ['user_id' => $user->id, 'name' => 'Rent', 'type' => 'expense'],
            ['user_id' => $user->id, 'name' => 'Bonus', 'type' => 'income'],
        ];

        foreach ($defaultCategories as $category) {
            Category::create($category);
        }

        // Create additional random categories for existing users
        $users = User::all();

        foreach ($users as $user) {
            Category::factory()->count(5)->create([
                'user_id' => $user->id
            ]);
        }
    }
}
