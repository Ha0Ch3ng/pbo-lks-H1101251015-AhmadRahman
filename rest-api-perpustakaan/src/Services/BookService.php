<?php

namespace App\Services;

use App\Contracts\BookRepositoryInterface;
use App\Models\Book;

class BookService
{
    public function __construct(
        private BookRepositoryInterface $repository
    ) {}

    public function list(): array
    {
        return array_map(
            fn(Book $book) => $book->toArray(),
            $this->repository->findAll()
        );
    }

    public function create(array $data): array
    {
        if (empty(trim($data['judul'] ?? ''))) {
            throw new \InvalidArgumentException('Judul wajib diisi');
        }

        $book = new Book(
            null,
            $data['judul'],
            $data['penulis'] ?? '',
            (int) ($data['tahun'] ?? 0),
            (int) ($data['stok'] ?? 0)
        );

        $id = $this->repository->save($book);

        return [
            'id' => $id,
            'judul' => $book->getJudul()
        ];
    }
}
