<?php

namespace App\Services;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use InvalidArgumentException;

class CategoryService
{
    public function __construct(
        private CategoryRepositoryInterface $repo
    ) {}

    public function list(): array
    {
        return array_map(
            fn(Category $category) => $category->toArray(),
            $this->repo->findAll()
        );
    }

    public function detail(int $id): array
    {
        $category = $this->repo->findById($id);

        if ($category === null) {
            throw new InvalidArgumentException(
                "Kategori dengan ID $id tidak ditemukan",
                404
            );
        }

        return $category->toArray();
    }

    public function create(array $data): array
    {
        $this->validate($data);

        $category = new Category(
            null,
            $data['nama'],
            $data['deskripsi'] ?? null
        );

        $id = $this->repo->save($category);

        return $this->detail($id);
    }

    public function update(int $id, array $data): array
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException(
                "Kategori dengan ID $id tidak ditemukan",
                404
            );
        }

        $this->validate($data);

        $category = new Category(
            $id,
            $data['nama'],
            $data['deskripsi'] ?? null
        );

        $this->repo->update($category);

        return $this->detail($id);
    }

    public function delete(int $id): void
    {
        if ($this->repo->findById($id) === null) {
            throw new InvalidArgumentException(
                "Kategori dengan ID $id tidak ditemukan",
                404
            );
        }

        $this->repo->delete($id);
    }

    private function validate(array $data): void
    {
        if (empty(trim($data['nama'] ?? ''))) {
            throw new InvalidArgumentException(
                "Nama kategori wajib diisi"
            );
        }
    }
}