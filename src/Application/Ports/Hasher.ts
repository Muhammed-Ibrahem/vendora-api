export interface Hasher {
  hash(raw: string): Promise<string>;
  verify(raw: string, hash: string): Promise<boolean>;
}
