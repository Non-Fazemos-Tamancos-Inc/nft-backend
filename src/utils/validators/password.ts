export const PASSWORD_REGEX = /^.*(?=.{8,})(?=.*[a-zA-Z])(?=.*\d)(?=.*[!#$%&? "]).*$/g

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
