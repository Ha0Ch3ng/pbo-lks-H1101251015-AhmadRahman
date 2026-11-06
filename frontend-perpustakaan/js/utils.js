/**
 * Menampilkan notifikasi sederhana.
 */
export function showToast(message, type = 'success') {
    const colors = {
        success: 'bg-green-600',
        error: 'bg-red-600',
        info: 'bg-blue-600',
    };

    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 right-4 ${colors[type] || colors.info} text-white px-4 py-3 rounded-lg shadow-lg z-50`;
    toast.textContent = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

/**
 * Konfirmasi sebelum melakukan tindakan.
 */
export function confirmAction(message) {
    return window.confirm(message);
}

/**
 * Menghindari kode HTML berbahaya.
 */
export function escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value ?? '';
    return div.innerHTML;
}