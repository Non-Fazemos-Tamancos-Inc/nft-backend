export const PASSWORD_REGEX = /^.*(?=.{3,})(?=.*[a-zA-Z]).*$/g

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
