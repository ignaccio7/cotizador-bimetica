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
        Schema::create('initial_forms', function (Blueprint $table) {
            $table->id();
                $table->foreignId('quote_id')->unique()->constrained()->cascadeOnDelete();
                $table->text('project_address');
                $table->string('payment_method', 100);
                $table->decimal('discount_applied', 15, 2)->default(0);
                $table->decimal('agreed_amount', 15, 2);
                $table->jsonb('extra_data')->nullable();
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('initial_forms');
    }
};
