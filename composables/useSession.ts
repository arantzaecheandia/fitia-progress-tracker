/**
 * useSession – manages user session via localStorage.
 * Session persists across page refreshes but is cleared when the tab is closed
 * (we use sessionStorage) or kept indefinitely (localStorage). Per the spec
 * we keep it open until the tab is fully closed, so we use sessionStorage.
 */
export const useSession = () => {
  const SESSION_KEY = 'fitia_user_id'

  const userId = useState<string | null>('userId', () => null)

  /** Restore session from sessionStorage on first call (client-only). */
  const restoreSession = () => {
    if (import.meta.client) {
      const stored = sessionStorage.getItem(SESSION_KEY)
      if (stored) userId.value = stored
    }
  }

  /** Persist userId and navigate to dashboard. */
  const login = (id: string) => {
    userId.value = id.trim()
    if (import.meta.client) {
      sessionStorage.setItem(SESSION_KEY, userId.value)
    }
  }

  /** Clear session. */
  const logout = () => {
    userId.value = null
    if (import.meta.client) {
      sessionStorage.removeItem(SESSION_KEY)
    }
  }

  return { userId, login, logout, restoreSession }
}
