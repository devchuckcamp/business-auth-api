export interface Repository<T, ID> {
  findById(id: ID): Promise<T | null>;
  save(entity: T): Promise<T>;
  delete(id: ID): Promise<void>;
}

export interface Specification<T> {
  isSatisfiedBy(entity: T): boolean;
}