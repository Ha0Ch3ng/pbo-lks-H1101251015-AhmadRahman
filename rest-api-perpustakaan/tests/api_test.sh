#!/bin/bash

BASE_URL="http://localhost:8000/api/books"

echo "== Test 1: GET semua buku =="
curl -s "$BASE_URL" | jq

echo ""
echo "== Test 2: POST buku baru =="
POST_RESPONSE=$(curl -s -X POST "$BASE_URL" \
-H "Content-Type: application/json" \
-d '{"judul":"Buku Otomatis","penulis":"Penulis Test","tahun":2020,"stok":5}')

echo "$POST_RESPONSE" | jq

NEW_ID=$(echo "$POST_RESPONSE" | jq -r '.data.id')
echo "ID baru: $NEW_ID"

echo ""
echo "== Test 3: GET buku ID $NEW_ID =="
curl -s "$BASE_URL/$NEW_ID" | jq

echo ""
echo "== Test 4: PUT ubah buku =="
curl -s -X PUT "$BASE_URL/$NEW_ID" \
-H "Content-Type: application/json" \
-d '{"judul":"Buku Otomatis Revisi","penulis":"Penulis Test","tahun":2021,"stok":10}' | jq

echo ""
echo "== Test 5: DELETE buku =="
curl -s -X DELETE "$BASE_URL/$NEW_ID" | jq

echo ""
echo "== Test 6: Validasi error =="
curl -s -X POST "$BASE_URL" \
-H "Content-Type: application/json" \
-d '{"judul":""}' | jq