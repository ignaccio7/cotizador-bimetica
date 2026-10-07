<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('guests are redirected to login when accessing quotes or admin routes', function () {
    $this->get('/quotes')->assertRedirect('/login');
    $this->get('/admin/services')->assertRedirect('/login');
});

test('seller can access commercial quotes index', function () {
    $seller = User::factory()->seller()->create();

    $this->actingAs($seller)
        ->get('/quotes')
        ->assertOk();
});

test('seller receives 403 forbidden when attempting to access admin routes', function () {
    $seller = User::factory()->seller()->create();

    $this->actingAs($seller)
        ->get('/admin/services')
        ->assertForbidden();
});

test('admin can access admin services catalog', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/admin/services')
        ->assertOk();
});

test('admin can also access commercial quotes index as supervisor', function () {
    $admin = User::factory()->admin()->create();

    $this->actingAs($admin)
        ->get('/quotes')
        ->assertOk();
});

test('root url redirects according to user role', function () {
    $admin = User::factory()->admin()->create();
    $seller = User::factory()->seller()->create();

    $this->actingAs($admin)
        ->get('/')
        ->assertRedirect('/admin/services');

    $this->actingAs($seller)
        ->get('/')
        ->assertRedirect('/quotes');
});
