<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['initial_form_id', 'technical_instructions', 'designation_date'])]
class Designation extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'designation_date' => 'date',
        ];
    }

    public function initialForm(): BelongsTo
    {
        return $this->belongsTo(InitialForm::class);
    }
}
