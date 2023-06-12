import { compare, hash, genSalt } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt()
  const passwordHash = await hash(password, salt)
  return passwordHash
}

export async function checkPassword(password: string, passwordHash: string): Promise<boolean> {
  return await compare(password, passwordHash)
}
