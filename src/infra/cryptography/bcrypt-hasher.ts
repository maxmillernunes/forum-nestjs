import { hash, compare } from 'bcryptjs'
import type { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer'
import type { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator'

export class BcryptHasher implements HashGenerator, HashComparer {
  private HASH_SALT_LENGTH = 8

  async hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH)
  }

  async compare(plain: string, hash: string): Promise<boolean> {
    return compare(plain, hash)
  }
}
