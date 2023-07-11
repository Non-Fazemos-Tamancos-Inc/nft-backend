export const PASSWORD_REGEX = /^.*(?=.{6,})(?=.*[a-zA-Z])(?=.*\d).*$/g

export function isPasswordValid(password: string): boolean {
  return PASSWORD_REGEX.test(password)
}
