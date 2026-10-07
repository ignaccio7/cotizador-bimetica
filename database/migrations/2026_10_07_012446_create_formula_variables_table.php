<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('formula_variables', function (Blueprint $table) {
            $table->foreignId('formula_id')->constrained()->cascadeOnDelete();
                $table->foreignId('variable_id')->constrained()->cascadeOnDelete();
                $table->primary(['formula_id', 'variable_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('formula_variables');
    }
};
