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
        Schema::create('quote_services', function (Blueprint $table) {
            $table->id();
                $table->foreignId('quote_id')->constrained()->cascadeOnDelete();
                $table->foreignId('service_id')->constrained()->cascadeOnDelete();
                $table->foreignId('quote_floor_group_id')->nullable()->constrained()->cascadeOnDelete();
                $table->jsonb('filled_variables')->nullable();
                $table->decimal('subtotal', 15, 2)->default(0);
                $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quote_services');
    }
};
