<?php

use App\Http\Controllers\Admin\ContractTemplateController as AdminContractTemplateController;
use App\Http\Controllers\Admin\ParameterController as AdminParameterController;
use App\Http\Controllers\Admin\ServiceController as AdminServiceController;
use App\Http\Controllers\Admin\UserController as AdminUserController;
use App\Http\Controllers\Admin\VariableController as AdminVariableController;
use App\Http\Controllers\ClientController;
use App\Http\Controllers\ContractController;
use App\Http\Controllers\DesignationController;
use App\Http\Controllers\InitialFormController;
use App\Http\Controllers\QuoteController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return redirect()->route('quotes.index');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Comercial & Ventas (Vendedor)
    Route::get('/quotes', [QuoteController::class, 'index'])->name('quotes.index');
    Route::get('/quotes/create', [QuoteController::class, 'create'])->name('quotes.create');
    Route::get('/initial-forms', [InitialFormController::class, 'index'])->name('initial-forms.index');
    Route::get('/contracts', [ContractController::class, 'index'])->name('contracts.index');
    Route::get('/designations', [DesignationController::class, 'index'])->name('designations.index');
    Route::get('/clients', [ClientController::class, 'index'])->name('clients.index');

    // Administración & Catálogo (Admin)
    Route::prefix('admin')->name('admin.')->group(function () {
        Route::get('/services', [AdminServiceController::class, 'index'])->name('services.index');
        Route::get('/variables', [AdminVariableController::class, 'index'])->name('variables.index');
        Route::get('/parameters', [AdminParameterController::class, 'index'])->name('parameters.index');
        Route::get('/contract-templates', [AdminContractTemplateController::class, 'index'])->name('contract-templates.index');
        Route::get('/users', [AdminUserController::class, 'index'])->name('users.index');
    });
});

// Dev helper para cambiar rol e iniciar sesión en local con 1 click
if (app()->environment('local')) {
    Route::get('/dev-login/{role}', function (string $role) {
        $targetRole = $role === 'admin' ? 'admin' : 'seller';
        $user = \App\Models\User::firstOrCreate(
            ['email' => $targetRole === 'admin' ? 'admin@bimetica.bo' : 'nestorignaciorg@gmail.com'],
            [
                'name' => $targetRole === 'admin' ? 'Administrador BIMETICA' : 'Nestor Ignacio Rojas Guarachi',
                'password' => bcrypt('password'),
                'role' => $targetRole,
                'email_verified_at' => now(),
            ]
        );
        $user->update(['role' => $targetRole]);
        auth()->login($user);
        return redirect()->route($targetRole === 'admin' ? 'admin.services.index' : 'quotes.index');
    })->name('dev.login');
}

require __DIR__.'/settings.php';
