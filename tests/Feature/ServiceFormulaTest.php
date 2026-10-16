<?php

use App\Models\Formula;
use App\Models\Service;
use App\Models\User;
use App\Models\Variable;

test('authenticated user can view services with formulas and available variables', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get(route('services.index'));

    $response->assertOk();
    $response->assertInertia(fn ($page) => $page
        ->component('services/index')
        ->has('services')
        ->has('availableVariables')
    );
});

test('user can update formulas and link variables for a service', function () {
    $user = User::factory()->create();

    $service = Service::create([
        'name' => 'SERVICIO PRUEBA',
        'description' => 'Descripción de prueba',
    ]);

    $var1 = Variable::create([
        'name' => 'm2',
        'type' => 'dynamic',
        'value_type' => 'decimal',
        'default_value' => '100',
    ]);

    $var2 = Variable::create([
        'name' => 'cambiodolar',
        'type' => 'static',
        'value_type' => 'decimal',
        'default_value' => '12.11',
    ]);

    $response = $this->actingAs($user)->put(route('services.formulas.update', $service), [
        'formulas' => [
            [
                'name' => 'BS /M2',
                'expression' => '56',
                'is_visible' => true,
                'variable_ids' => [$var1->id],
            ],
            [
                'name' => 'INVERSIÓN BS.',
                'expression' => 'm2 * 56',
                'is_visible' => true,
                'variable_ids' => [$var1->id, $var2->id],
            ],
        ],
    ]);

    $response->assertRedirect(route('services.index', ['selected' => $service->id]));

    expect($service->formulas()->count())->toBe(2);

    $formula1 = $service->formulas()->where('name', 'BS /M2')->first();
    expect($formula1)->not->toBeNull();
    expect($formula1->is_visible)->toBeTrue();
    expect($formula1->variables()->count())->toBe(1);

    $formula2 = $service->formulas()->where('name', 'INVERSIÓN BS.')->first();
    expect($formula2)->not->toBeNull();
    expect($formula2->variables()->count())->toBe(2);
});
