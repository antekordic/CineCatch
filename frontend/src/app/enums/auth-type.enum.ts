export type AuthType = Record<'Protected' | 'Unprotected' | 'Public', any[]>;

export const AuthType: AuthType = {
  Protected: ['/login'],
  Unprotected: ['/'],
  Public: ['.'],
}
