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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
                $table->foreignId('initial_form_id')->unique()->constrained()->cascadeOnDelete();
                $table->foreignId('contract_template_id')->nullable()->constrained()->cascadeOnDelete();
                $table->text('final_html_content');
                $table->date('issue_date')->default(now());
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
