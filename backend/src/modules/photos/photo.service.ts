import { DataSource, Repository } from 'typeorm';
import { Photo } from './photo.entity';
import { Album } from './album.entity';
import { parsePagination } from '../../shared/pagination';

export interface CreatePhotoDto {
  url: string;
  thumbnailUrl?: string;
  originalFilename?: string;
  mimeType: string;
  sizeBytes: number;
  width?: number;
  height?: number;
  takenAt?: string;
  albumId?: string;
  metadata?: Record<string, unknown>;
}

export class PhotoService {
  private photos: Repository<Photo>;
  private albums: Repository<Album>;

  constructor(db: DataSource) {
    this.photos = db.getRepository(Photo);
    this.albums = db.getRepository(Album);
  }

  async listPhotos(familyId: string, albumId?: string, page = 1, limit = 20) {
    const { skip } = parsePagination({ page, limit });
    const where: any = { familyId };
    if (albumId) where.albumId = albumId;
    const [data, total] = await this.photos.findAndCount({
      where,
      order: { takenAt: 'DESC', createdAt: 'DESC' },
      skip,
      take: limit,
      relations: ['uploadedBy'],
    });
    return { data, total, page, limit };
  }

  async create(familyId: string, uploadedById: string, dto: CreatePhotoDto) {
    return this.photos.save(
      this.photos.create({
        ...dto,
        takenAt:      dto.takenAt ? new Date(dto.takenAt) : null,
        thumbnailUrl: dto.thumbnailUrl ?? null,
        familyId,
        uploadedById,
      }),
    );
  }

  async remove(id: string, familyId: string) {
    await this.photos.delete({ id, familyId });
  }

  async listAlbums(familyId: string) {
    return this.albums.find({ where: { familyId }, order: { createdAt: 'DESC' } });
  }

  async createAlbum(familyId: string, createdById: string, name: string) {
    return this.albums.save(this.albums.create({ familyId, createdById, name }));
  }
}
