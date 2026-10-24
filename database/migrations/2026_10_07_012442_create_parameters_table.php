<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('parameters', function (Blueprint $table) {
            $table->id();
            $table->string('group', 50)->index();
            $table->string('group_label', 100)->nullable(); // Ej: "Categoría del Proyecto", "Viáticos por Ciudad"
            $table->string('name', 100);
            $table->string('type', 20)->default('number'); // number, percentage
            $table->decimal('value', 12, 2)->default(0);
            $table->string('description')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            $table->unique(['group', 'name']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parameters');
    }
};
