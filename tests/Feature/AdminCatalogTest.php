<?php

use App\Models\Service;
use App\Models\User;
use App\Models\Variable;

beforeEach(function () {
    $this->admin = User::factory()->create([
        'role' => 'admin',
    ]);
});

test('admin can view variables index', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.variables.index'));

    $response->assertOk();
});

test('admin can create and update a variable', function () {
    $createResponse = $this->actingAs($this->admin)->post(route('admin.variables.store'), [
        'name' => 'test_factor',
        'type' => 'dynamic',
        'default_value' => 1.5,
    ]);

    $createResponse->assertRedirect(route('admin.variables.index'));
    $this->assertDatabaseHas('variables', ['name' => 'test_factor', 'type' => 'dynamic']);

    $variable = Variable::where('name', 'test_factor')->first();

    $updateResponse = $this->actingAs($this->admin)->put(route('admin.variables.update', $variable), [
        'name' => 'test_factor_updated',
        'type' => 'static',
        'default_value' => 2.0,
    ]);

    $updateResponse->assertRedirect(route('admin.variables.index'));
    $this->assertDatabaseHas('variables', ['name' => 'test_factor_updated', 'type' => 'static']);
});

test('admin can view services index', function () {
    $response = $this->actingAs($this->admin)->get(route('admin.services.index'));

    $response->assertOk();
});

test('admin can create and update a service with multiple formulas', function () {
    $var = Variable::create([
        'name' => 'm2_test',
        'type' => 'dynamic',
        'default_value' => 100,
    ]);

    $createResponse = $this->actingAs($this->admin)->post(route('admin.services.store'), [
        'name' => 'SERVICIO TEST DE PRUEBA',
        'description' => "1) Primer punto\n2) Segundo punto\nNo incluye Visado.",
        'formulas' => [
            [
                'name' => 'BS /M2',
                'expression' => '25',
                'is_visible' => true,
                'variable_ids' => [],
            ],
            [
                'name' => 'INVERSIÓN BS.',
                'expression' => 'm2_test * 25',
                'is_visible' => true,
                'variable_ids' => [$var->id],
            ],
        ],
    ]);

    $createResponse->assertRedirect(route('admin.services.index'));
    $this->assertDatabaseHas('services', ['name' => 'SERVICIO TEST DE PRUEBA']);

    $service = Service::where('name', 'SERVICIO TEST DE PRUEBA')->first();
    expect($service->formulas()->count())->toBe(2);

    $updateResponse = $this->actingAs($this->admin)->put(route('admin.services.update', $service), [
        'name' => 'SERVICIO TEST MODIFICADO',
        'description' => "1) Punto modificado\nNo incluye Visado.",
        'formulas' => [
            [
                'name' => 'TARIFA FINAL',
                'expression' => 'm2_test * 30',
                'is_visible' => true,
                'variable_ids' => [$var->id],
            ],
        ],
    ]);

    $updateResponse->assertRedirect(route('admin.services.index'));
    $this->assertDatabaseHas('services', ['name' => 'SERVICIO TEST MODIFICADO']);
    expect($service->fresh()->formulas()->count())->toBe(1);
});
