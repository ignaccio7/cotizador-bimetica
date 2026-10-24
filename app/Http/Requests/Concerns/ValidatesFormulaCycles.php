<?php

namespace App\Http\Requests\Concerns;

use App\Models\Formula;
use App\Models\Service;
use Illuminate\Validation\Validator;

trait ValidatesFormulaCycles
{
    /**
     * Valida que la fórmula no introduzca dependencias circulares directas o indirectas.
     */
    protected function validateFormulaCycles(Validator $validator): void
    {
        $code = $this->input('code');
        $expression = $this->input('expression');

        if (!$code || !$expression) {
            return;
        }

        $service = $this->route('service');
        $serviceId = $service instanceof Service ? $service->id : $service;

        $formula = $this->route('formula');
        $currentFormulaId = $formula instanceof Formula ? $formula->id : $formula;

        // Fórmulas existentes del mismo servicio (excluyendo la actual en caso de edición)
        $otherFormulas = Formula::where('service_id', $serviceId)
            ->when($currentFormulaId, fn ($query) => $query->where('id', '!=', $currentFormulaId))
            ->get(['id', 'code', 'expression']);

        // Códigos disponibles en este servicio
        $availableCodes = $otherFormulas->pluck('code')->push($code)->unique()->values()->all();

        // Construir grafo de adyacencia
        $graph = [];
        foreach ($otherFormulas as $f) {
            $graph[$f->code] = $this->extractReferencedCodes($f->expression, $availableCodes);
        }
        $graph[$code] = $this->extractReferencedCodes($expression, $availableCodes);

        // Detectar si el nuevo nodo forma un ciclo consigo mismo o con otros
        $cyclePath = $this->findCyclePath($code, $graph);

        if ($cyclePath) {
            $validator->errors()->add(
                'expression',
                'La fórmula genera una dependencia circular: ' . implode(' → ', $cyclePath) . '.'
            );
        }
    }

    /**
     * Extrae los códigos de fórmulas disponibles referenciadas en una expresión.
     *
     * @param string $expression
     * @param string[] $availableCodes
     * @return string[]
     */
    private function extractReferencedCodes(string $expression, array $availableCodes): array
    {
        if (empty($availableCodes) || trim($expression) === '') {
            return [];
        }

        usort($availableCodes, fn ($a, $b) => strlen($b) - strlen($a));
        $escaped = array_map(fn ($c) => preg_quote($c, '/'), $availableCodes);
        $pattern = '/\b(' . implode('|', $escaped) . ')\b/';

        if (preg_match_all($pattern, $expression, $matches)) {
            return array_values(array_unique($matches[1]));
        }

        return [];
    }

    /**
     * Busca un camino cíclico que comience y termine en $targetCode mediante DFS.
     *
     * @param string $targetCode
     * @param array<string, string[]> $graph
     * @return string[]|null
     */
    private function findCyclePath(string $targetCode, array $graph): ?array
    {
        $visited = [];
        $path = [$targetCode];

        $hasCycle = function ($current) use (&$hasCycle, &$visited, &$path, $targetCode, $graph) {
            foreach ($graph[$current] ?? [] as $next) {
                if ($next === $targetCode) {
                    $path[] = $next;
                    return true;
                }

                if (!isset($visited[$next])) {
                    $visited[$next] = true;
                    $path[] = $next;

                    if ($hasCycle($next)) {
                        return true;
                    }

                    array_pop($path);
                }
            }

            return false;
        };

        return $hasCycle($targetCode) ? $path : null;
    }
}
