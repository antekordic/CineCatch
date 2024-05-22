export abstract class StorageService {
  public get length(): number {
    return this.api.length;
  }

  public constructor(
    protected readonly api: Storage,
    protected readonly prefix: string
  ) {}

  private prefixKey(plainKey: string): string {
    if (this.prefix) {
      return `[${this.prefix}]${plainKey}`;
    }

    return plainKey;
  }

  public setItem(key: string, value: any): void {
    this.api.setItem(this.prefixKey(key), JSON.stringify({ value }));
  }

  public getItem<T>(key: string): T | null;
  public getItem<T>(key: string, otherwise: T): T;
  public getItem<T>(key: string, otherwise?: T): T | null {
    const data: string | null = this.api.getItem(this.prefixKey(key));

    if (data !== null) {
      return JSON.parse(data).value;
    }

    if (otherwise) {
      return otherwise;
    }

    return null;
  }

  public removeItem(key: string): void {
    this.api.removeItem(this.prefixKey(key));
  }

  public clear(): void {
    this.api.clear();
  }

  public key(index: number): string | null {
    return this.api.key(index);
  }
}

