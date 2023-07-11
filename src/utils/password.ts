import { compare, genSalt, hash } from 'bcryptjs'

export async function hashPassword(password: string): Promise<string> {
  const salt = await genSalt()
  return await hash(password, salt)
}

export async function checkPassword(password: string, passwordHash: string): Promise<boolean> {
  return await compare(password, passwordHash)
}
