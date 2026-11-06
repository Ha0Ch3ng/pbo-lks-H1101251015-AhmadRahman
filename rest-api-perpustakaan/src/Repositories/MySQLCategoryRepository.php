<?php

namespace App\Repositories;

use App\Contracts\CategoryRepositoryInterface;
use App\Models\Category;
use PDO;

class MySQLCategoryRepository implements CategoryRepositoryInterface
{
    public function __construct(private PDO $pdo) {}

    public function findAll(): array
    {
        $stmt = $this->pdo->query(
            "SELECT * FROM categories ORDER BY id DESC"
        );

        return array_map(
            fn($row) => new Category(
                (int) $row['id'],
                $row['nama'],
                $row['deskripsi']
            ),
            $stmt->fetchAll(PDO::FETCH_ASSOC)
        );
    }

    public function findById(int $id): ?Category
    {
        $stmt = $this->pdo->prepare(
            "SELECT * FROM categories WHERE id = ?"
        );
        $stmt->execute([$id]);

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return null;
        }

        return new Category(
            (int) $row['id'],
            $row['nama'],
            $row['deskripsi']
        );
    }

    public function save(Category $category): int
    {
        $stmt = $this->pdo->prepare(
            "INSERT INTO categories (nama, deskripsi) VALUES (?, ?)"
        );

        $stmt->execute([
            $category->toArray()['nama'],
            $category->toArray()['deskripsi']
        ]);

        return (int) $this->pdo->lastInsertId();
    }

    public function update(Category $category): void
    {
        $data = $category->toArray();

        $stmt = $this->pdo->prepare(
            "UPDATE categories SET nama = ?, deskripsi = ? WHERE id = ?"
        );

        $stmt->execute([
            $data['nama'],
            $data['deskripsi'],
            $data['id']
        ]);
    }

    public function delete(int $id): void
    {
        $stmt = $this->pdo->prepare(
            "DELETE FROM categories WHERE id = ?"
        );

        $stmt->execute([$id]);
    }
}