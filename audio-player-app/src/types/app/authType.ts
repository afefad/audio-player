export type AuthMode = 'login' | 'register'

export type AuthCardOptions = {
  mode: AuthMode
  onToggleMode: () => void
}
