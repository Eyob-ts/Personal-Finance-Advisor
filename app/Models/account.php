<?php

namespace App\Models;

use App\Models\Finance\Goal;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class account extends Model
{
    use HasFactory;
    protected $table = 'accounts';

    protected $fillable = ['user_id', 'name', 'type', 'balance'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function transactions()
    {
        return $this->hasMany(Transaction::class);
    }

    public function goals()
    {
        return $this->hasMany(Goal::class); // Account can have many goals
    }

    // When balance changes, update all related goals' current_amount
    public function updateBalance($amount)
    {
        $this->balance += $amount;
        $this->save();

        // Update related goals based on the new balance
        foreach ($this->goals as $goal) {
            $goal->updateCurrentAmountFromAccount(); // Sync the goal's current_amount with account balance
            $goal->updateStatus(); // Check if the goal is completed
        }
    }
}


