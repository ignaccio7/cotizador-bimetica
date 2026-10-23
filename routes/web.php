<?php

use App\Http\Controllers\FormulaController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VariableController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('services', ServiceController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('services.formulas', FormulaController::class)->only(['store', 'update', 'destroy']);
    Route::resource('variables', VariableController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::inertia('quotes/create', 'quotes/create')->name('quotes.create');
});

require __DIR__.'/settings.php';
