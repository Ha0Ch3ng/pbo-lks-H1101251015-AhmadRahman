<?php

namespace App\Models;

class Category
{
    public function __construct(
        private ?int $id,
        private string $nama,
        private ?string $deskripsi
    ) {}

    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'nama' => $this->nama,
            'deskripsi' => $this->deskripsi
        ];
    }
}