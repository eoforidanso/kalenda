import { apiFetch } from './client';

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

export async function listAlbums() {
  return apiFetch('/albums');
}

export async function createAlbum(name, coverUrl) {
  return apiFetch('/albums', {
    method: 'POST',
    body:   JSON.stringify({ name, coverUrl }),
  });
}
