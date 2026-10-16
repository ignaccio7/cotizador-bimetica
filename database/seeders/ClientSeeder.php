<?php

namespace Database\Seeders;

use App\Models\Client;
use Illuminate\Database\Seeder;

class ClientSeeder extends Seeder
{
    /**
     * Seed example clients with official Bimetica correlative codes NNN/YYYY.
     */
    public function run(): void
    {
        $clients = [
            [
                'code'        => '001/2026',
                'full_name'   => 'JANETH / EUNICE MIRANDA NAVIA',
                'ci'          => '76734409 LP',
                'phone'       => '76734409',
                'address'     => 'BAJO SAN ANTONIO, AV. PRINCIPAL #450',
                'occupation'  => 'COMERCIANTE',
            ],
            [
                'code'        => '002/2026',
                'full_name'   => 'CARLOS ALBERTO MAMANI FLORES',
                'ci'          => '4839201 LP',
                'phone'       => '71548923',
                'address'     => 'ACHUMANI, CALLE 22 #105',
                'occupation'  => 'INGENIERO CIVIL',
            ],
            [
                'code'        => '003/2026',
                'full_name'   => 'MARIA ELENA GUTIERREZ ROCHA',
                'ci'          => '5938204 LP',
                'phone'       => '72034981',
                'address'     => 'SOPOCACHI, CALLE ASPUAZU #88',
                'occupation'  => 'ARQUITECTA',
            ],
        ];

        foreach ($clients as $c) {
            Client::updateOrCreate(
                ['code' => $c['code']],
                $c
            );
        }
    }
}
