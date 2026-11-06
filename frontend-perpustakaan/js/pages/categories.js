
import { categoriesApi } from '../api.js';
import { showToast, confirmAction, escapeHtml } from '../utils.js';

export async function renderCategoriesPage(container) {
    container.innerHTML = `
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 page-enter">
            <div>
                <h2 class="text-2xl font-bold text-gray-800">Manajemen Kategori</h2>
                <p class="text-gray-500">Kelola kategori buku perpustakaan</p>
            </div>
            <button id="btn-add" class="bg-primary hover:bg-blue-800 text-white px-5 py-2.5 rounded-lg font-medium transition flex items-center gap-2 shadow">
                <span class="text-xl leading-none">+</span> Tambah Kategori
            </button>
        </div>
        <div id="table-container" class="bg-white rounded-xl shadow overflow-hidden">
            <div class="p-8 text-center text-gray-500">Memuat data...</div>
        </div>
    `;

    document.getElementById('btn-add').onclick = () => openModal();
    await loadCategories();
}

async function loadCategories() {
    const container = document.getElementById('table-container');

    try {
        const { data: categories } = await categoriesApi.list();

        if (categories.length === 0) {
            container.innerHTML = `
                <div class="p-12 text-center">
                    <div class="text-5xl mb-4">🏷️</div>
                    <p class="text-gray-500 mb-4">Belum ada kategori</p>
                    <button onclick="document.getElementById('btn-add').click()"
                            class="text-primary hover:underline font-medium">
                        Tambah kategori pertama &rarr;
                    </button>
                </div>
            `;
            return;
        }

        container.innerHTML = `
            <div class="overflow-x-auto">
                <table class="w-full">
                    <thead class="bg-gray-50 border-b">
                        <tr>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">ID</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Nama</th>
                            <th class="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Deskripsi</th>
                            <th class="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Aksi</th>
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-100">
                        ${categories.map(cat => `
                            <tr class="hover:bg-gray-50">
                                <td class="px-6 py-4 text-sm text-gray-500">${cat.id}</td>
                                <td class="px-6 py-4 text-sm font-medium text-gray-800">${escapeHtml(cat.nama)}</td>
                                <td class="px-6 py-4 text-sm text-gray-600">${escapeHtml(cat.deskripsi || '-')}</td>
                                <td class="px-6 py-4 text-right">
                                    <button data-edit="${cat.id}" class="text-blue-600 hover:text-blue-800 mr-3 font-medium">Edit</button>
                                    <button data-delete="${cat.id}" class="text-red-600 hover:text-red-800 font-medium">Hapus</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        container.querySelectorAll('[data-edit]').forEach(btn => {
            btn.onclick = () => openModal(Number(btn.dataset.edit));
        });

        container.querySelectorAll('[data-delete]').forEach(btn => {
            btn.onclick = () => deleteCategory(Number(btn.dataset.delete));
        });

    } catch (error) {
        container.innerHTML = `
            <div class="p-8 text-center text-red-600">
                Gagal memuat kategori: ${escapeHtml(error.message)}
            </div>
        `;
    }
}

async function openModal(id = null) {
    let category = { nama: '', deskripsi: '' };

    if (id) {
        try {
            const response = await categoriesApi.detail(id);
            category = response.data;
        } catch (error) {
            showToast(error.message, 'error');
            return;
        }
    }

    const oldModal = document.getElementById('category-modal');
    if (oldModal) oldModal.remove();

    const modal = document.createElement('div');
    modal.id = 'category-modal';
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4';

    modal.innerHTML = `
        <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 class="text-xl font-bold text-gray-800 mb-5">
                ${id ? 'Edit Kategori' : 'Tambah Kategori'}
            </h3>
            <form id="category-form" class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Nama Kategori</label>
                    <input type="text" name="nama" required maxlength="100"
                        value="${escapeHtml(category.nama)}"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                    <textarea name="deskripsi" rows="3"
                        class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none">${escapeHtml(category.deskripsi || '')}</textarea>
                </div>
                <div class="flex justify-end gap-3 pt-2">
                    <button type="button" id="btn-cancel"
                        class="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50">Batal</button>
                    <button type="submit"
                        class="px-4 py-2 rounded-lg bg-primary text-white hover:bg-blue-800">Simpan</button>
                </div>
            </form>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btn-cancel').onclick = () => modal.remove();

    document.getElementById('category-form').onsubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const data = {
            nama: formData.get('nama').trim(),
            deskripsi: formData.get('deskripsi').trim()
        };

        try {
            if (id) {
                await categoriesApi.update(id, data);
                showToast('Kategori berhasil diperbarui');
            } else {
                await categoriesApi.create(data);
                showToast('Kategori berhasil ditambahkan');
            }

            modal.remove();
            await loadCategories();

        } catch (error) {
            showToast(error.message, 'error');
        }
    };
}

async function deleteCategory(id) {
    const confirmed = await confirmAction(
        'Apakah Anda yakin ingin menghapus kategori ini?'
    );

    if (!confirmed) return;

    try {
        await categoriesApi.destroy(id);
        showToast('Kategori berhasil dihapus');
        await loadCategories();
    } catch (error) {
        showToast(error.message, 'error');
    }
}
