export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: { total?: number; page?: number; limit?: number };
}

export function ok<T>(data: T, meta?: ApiResponse<T>['meta']): ApiResponse<T> {
  return { success: true, data, ...(meta ? { meta } : {}) };
}

export function paginated<T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
): ApiResponse<T[]> {
  return { success: true, data, meta: { total, page, limit } };
}
