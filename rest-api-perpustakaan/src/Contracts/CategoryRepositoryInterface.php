<?php

namespace App\Contracts;

use App\Models\Category;

interface CategoryRepositoryInterface
{
    public function findAll(): array;

    public function findById(int $id): ?Category;

    public function save(Category $category): int;

    public function update(Category $category): void;

    public function delete(int $id): void;
}