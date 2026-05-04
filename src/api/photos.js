import { apiFetch } from './client';
import { getToken } from './client';

const BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001/api/v1';

function toFrontend(p) {
  return {
    id:        p.id,
    src:       p.url,
    alt:       p.caption ?? p.originalFilename ?? 'Photo',
    caption:   p.caption ?? '',
    albumId:   p.albumId ?? null,
    takenAt:   p.takenAt ?? null,
    uploadedBy: p.uploadedByName ?? '',
  };
}

export async function listPhotos(albumId, page = 1, limit = 50) {
  const params = new URLSearchParams({ page, limit });
  if (albumId) params.set('albumId', albumId);
  const result = await apiFetch(`/photos?${params}`);
  // result may be paginated: { data: [], meta: { total, page, limit } }
  // or a plain array depending on service version
  if (Array.isArray(result)) return result.map(toFrontend);
  return (result.data ?? result).map(toFrontend);
}

export async function addPhoto({ url, caption, albumId, originalFilename, takenAt }) {
  const photo = await apiFetch('/photos', {
    method: 'POST',
    body:   JSON.stringify({ url, caption, albumId, originalFilename, takenAt }),
  });
  return toFrontend(photo);
}

export async function deletePhoto(id) {
  return apiFetch(`/photos/${id}`, { method: 'DELETE' });
}

/**
 * Upload a photo file via multipart/form-data.
 * @param {File} file — browser File object
 * @param {string} [albumId] — optional album UUID
 */
export async function uploadPhoto(file, albumId) {
  const form = new FormData();
  form.append('file', file);
  if (albumId) form.append('albumId', albumId);
  const token = getToken();
  const res = await fetch(`${BASE}/photos/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.error ?? 'Upload failed');
  return toFrontend(json.data);
}

export async function listAlbums() {
  return apiFetch('/photos/albums');
}

export async function createAlbum(name) {
  return apiFetch('/photos/albums', {
    method: 'POST',
    body:   JSON.stringify({ name }),
  });
}

export async function deleteAlbum(id) {
  return apiFetch(`/photos/albums/${id}`, { method: 'DELETE' });
}
