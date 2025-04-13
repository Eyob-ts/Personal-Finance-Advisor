<?php

namespace App\Models\Finance;

use App\Models\account;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'target_amount',
        'current_amount',
        'deadline',
        'status',
        'user_id',
        'account_id', // Link to account
    ];

    // Relationship with the User model
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship with the Account model
    public function account()
    {
        return $this->belongsTo(account::class);
    }

    // Automatically update current_amount based on account balance
    public function updateCurrentAmountFromAccount()
    {
        // Set current_amount to be the same as the linked account balance
        $this->current_amount = $this->account->balance; // Linked to the account balance
        $this->save();
    }

    // Update goal status based on current amount and target amount
    public function updateStatus()
    {
        if ($this->current_amount >= $this->target_amount) {
            $this->status = 'completed';
            $this->save();
        }
    }
}
