<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Relations\Pivot;

#[Fillable(['formula_id', 'variable_id'])]
class FormulaVariable extends Pivot
{
    public $timestamps = false;
}
