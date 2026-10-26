<?php

namespace App\Models;

use Database\Factories\AppUserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AppUser extends Model
{
    /** @use HasFactory<AppUserFactory> */
    use HasFactory;

    protected $table = 'app_users';

    protected $fillable = [
        'external_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'avatar',
        'company_name',
        'city',
    ];

    protected function casts(): array
    {
        return [
            'external_id' => 'integer',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    /**
     * Setiap kata kunci harus cocok dengan salah satu kolom identitas.
     */
    public function scopeSearch($query, string $term)
    {
        $words = preg_split('/\s+/', trim($term), -1, PREG_SPLIT_NO_EMPTY) ?: [];

        foreach ($words as $word) {
            $escaped = addcslashes($word, '%_\\');

            $query->where(function ($inner) use ($escaped) {
                $inner->where('first_name', 'like', "%{$escaped}%")
                    ->orWhere('last_name', 'like', "%{$escaped}%")
                    ->orWhere('email', 'like', "%{$escaped}%");
            });
        }

        return $query;
    }
}
