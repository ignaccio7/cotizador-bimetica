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
        Schema::create('quotes', function (Blueprint $table) {
            $table->id();
                $table->foreignId('client_id')->constrained()->cascadeOnDelete();
                $table->foreignId('seller_id')->constrained('users')->cascadeOnDelete();
                $table->string('status', 50)->default('Draft');
                $table->jsonb('filled_parameters')->nullable();
                $table->decimal('total_amount', 15, 2)->default(0);
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quotes');
    }
};
