<?php

namespace App\Http\Requests;

use App\Services\ProductQuery;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProductIndexRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $this->merge(array_filter([
            'q' => is_string($this->q) ? trim($this->q) : $this->q,
            'category' => is_string($this->category) ? trim($this->category) : $this->category,
        ], fn ($value) => $value !== null && $value !== ''));
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'q' => ['sometimes', 'nullable', 'string', 'max:100'],
            'category' => ['sometimes', 'nullable', 'string', 'max:100'],
            'sort' => ['sometimes', Rule::in(ProductQuery::SORTS)],
            'order' => ['sometimes', Rule::in(ProductQuery::ORDERS)],
            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', Rule::in(ProductQuery::PER_PAGE)],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'q.string' => 'Kata kunci pencarian tidak valid.',
            'q.max' => 'Kata kunci maksimal 100 karakter.',
            'category.string' => 'Kategori tidak valid.',
            'category.max' => 'Kategori maksimal 100 karakter.',
            'sort.in' => 'Kolom pengurutan tidak dikenali.',
            'order.in' => 'Arah pengurutan harus asc atau desc.',
            'page.integer' => 'Halaman harus berupa angka.',
            'page.min' => 'Halaman minimal 1.',
            'per_page.integer' => 'Jumlah per halaman harus berupa angka.',
            'per_page.in' => 'Jumlah per halaman harus 10, 20, atau 50.',
        ];
    }
}
