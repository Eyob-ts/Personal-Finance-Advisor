<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\account>
 */
class accountFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['bank', 'cash', 'credit_card'];

        return [
            'user_id' => User::factory(),
            'name' => $this->faker->word . ' Account',
            'type' => $this->faker->randomElement($types),
            'balance' => $this->faker->randomFloat(2, 0, 100000),
        ];
    }
}
