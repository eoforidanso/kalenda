import { DataSource, Repository } from 'typeorm';
import { List } from './list.entity';
import { ListItem } from './list-item.entity';

function err(msg: string, status: number) {
  return Object.assign(new Error(msg), { statusCode: status });
}

export class ListService {
  private lists: Repository<List>;
  private items: Repository<ListItem>;

  constructor(db: DataSource) {
    this.lists = db.getRepository(List);
    this.items = db.getRepository(ListItem);
  }

  async getLists(familyId: string) {
    return this.lists.find({ where: { familyId }, order: { createdAt: 'ASC' } });
  }

  async createList(familyId: string, createdById: string, name: string, icon = '📝') {
    return this.lists.save(this.lists.create({ familyId, createdById, name, icon }));
  }

  async deleteList(id: string, familyId: string) {
    await this.lists.delete({ id, familyId });
  }

  async getItems(listId: string, familyId: string) {
    // Verify the list belongs to this family before returning items
    const list = await this.lists.findOne({ where: { id: listId, familyId } });
    if (!list) throw err('List not found', 404);
    return this.items.find({ where: { listId }, order: { sortOrder: 'ASC', createdAt: 'ASC' } });
  }

  async addItem(listId: string, familyId: string, text: string, addedByName?: string) {
    const list = await this.lists.findOne({ where: { id: listId, familyId } });
    if (!list) throw err('List not found', 404);
    const count = await this.items.count({ where: { listId } });
    return this.items.save(
      this.items.create({ listId, text, addedByName: addedByName ?? null, sortOrder: count }),
    );
  }

  async updateItem(
    id: string,
    listId: string,
    familyId: string,
    dto: { text?: string; done?: boolean; sortOrder?: number },
  ) {
    // Verify ownership before mutating
    const list = await this.lists.findOne({ where: { id: listId, familyId } });
    if (!list) throw err('List not found', 404);
    const item = await this.items.findOne({ where: { id, listId } });
    if (!item) throw err('Item not found', 404);
    if (dto.done !== undefined && dto.done !== item.done) {
      item.done  = dto.done;
      item.doneAt = dto.done ? new Date() : null;
    }
    if (dto.text      !== undefined) item.text      = dto.text;
    if (dto.sortOrder !== undefined) item.sortOrder = dto.sortOrder;
    return this.items.save(item);
  }

  async removeItem(id: string, listId: string, familyId: string) {
    const list = await this.lists.findOne({ where: { id: listId, familyId } });
    if (!list) throw err('List not found', 404);
    await this.items.delete({ id, listId });
  }

  async clearCompleted(listId: string, familyId: string) {
    const list = await this.lists.findOne({ where: { id: listId, familyId } });
    if (!list) throw err('List not found', 404);
    await this.items.delete({ listId, done: true });
  }
}
