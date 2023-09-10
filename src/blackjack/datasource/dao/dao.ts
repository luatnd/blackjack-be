export interface Dao<DTO> {
  insert(item: DTO): DTO;
  get(id: string): DTO | undefined;
  update(item: DTO): DTO;
  delete(id: string): boolean;
}
