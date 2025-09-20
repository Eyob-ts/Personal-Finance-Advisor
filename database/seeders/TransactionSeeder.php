<?php

namespace Database\Seeders;

use App\Models\transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    protected $model = Transaction::class;
    public function run(): void
    {
        // Create 10 random transactions
        $users = User::all();

        foreach ($users as $user) {
            $accounts = $user->accounts;
            $categories = $user->categories;

            foreach ($accounts as $account) {
                // Create 5-10 transactions per account
                $transactionCount = rand(5, 10);

                for ($i = 0; $i < $transactionCount; $i++) {
                    $category = $categories->where('type', '!=', 'transfer')->random();

                    Transaction::create([
                        'user_id' => $user->id,
                        'account_id' => $account->id,
                        'category_id' => $category->id,
                        'type' => $category->type, // Will be either 'income' or 'expense'
                        'amount' => $this->generateAmount($category->type),
                        'description' => $this->generateDescription($category),
                        'transaction_date' => now()->subDays(rand(0, 365)),
                    ]);
                }
            }
        }
    }

    protected function generateAmount($type)
    {
        return $type === 'income'
            ? rand(100, 5000) // Larger amounts for income
            : rand(1, 500);   // Smaller amounts for expenses
    }

    protected function generateDescription($category)
    {
        $descriptions = [
            'income' => [
                'Salary payment',
                'Freelance work',
                'Investment returns',
                'Bonus payment'
            ],
            'expense' => [
                'Grocery shopping',
                'Utility bill',
                'Dining out',
                'Transportation'
            ]
        ];

        return $descriptions[$category->type][array_rand($descriptions[$category->type])] .
               " (" . $category->name . ")";
    }
}
