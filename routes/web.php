<?php

use App\Http\Controllers\QuoteController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServiceFormulaController;
use App\Http\Controllers\VariableController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('services', ServiceController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::put('services/{service}/formulas', [ServiceFormulaController::class, 'update'])->name('services.formulas.update');
    Route::resource('variables', VariableController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('quotes', QuoteController::class)->only(['index', 'create', 'store', 'show']);
});


require __DIR__.'/settings.php';
