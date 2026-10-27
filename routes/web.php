<?php

use App\Http\Controllers\FormulaController;
use App\Http\Controllers\ParameterController;
use App\Http\Controllers\QuoteController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\VariableController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/login')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::get('quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::resource('services', ServiceController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('services.formulas', FormulaController::class)->only(['store', 'update', 'destroy']);
    Route::resource('variables', VariableController::class)->only(['index', 'store', 'update', 'destroy']);
    Route::resource('parameters', ParameterController::class)->only(['index', 'store', 'update', 'destroy']);
});

require __DIR__.'/settings.php';
