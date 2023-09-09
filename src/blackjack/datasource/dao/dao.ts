interface Dao<DTO> {
  get(id: string): DTO | undefined;
}
