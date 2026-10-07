<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable(['initial_form_id', 'contract_template_id', 'final_html_content', 'issue_date'])]
class Contract extends Model
{
    use HasFactory;

    protected function casts(): array
    {
        return [
            'issue_date' => 'date',
        ];
    }

    public function initialForm(): BelongsTo
    {
        return $this->belongsTo(InitialForm::class);
    }

    public function template(): BelongsTo
    {
        return $this->belongsTo(ContractTemplate::class, 'contract_template_id');
    }
}
