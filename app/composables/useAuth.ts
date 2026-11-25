import type { UserProfile } from '~/types'
import { getInitials } from '~/utils/format'

const DEMO_USER: UserProfile = {
  name: 'Анна Ковалёва',
  email: 'operator@workflow.demo',
  role: 'Оператор',
  initials: 'АК',
}

export function useAuth() {
  const userCookie = useCookie<UserProfile | null>('wf_user', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    default: () => null,
  })
  const loggedOutCookie = useCookie<boolean>('wf_logged_out', {
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30,
    default: () => false,
  })

  const user = useState<UserProfile | null>('wf_user_state', () => {
    const storedUser = userCookie.value
    if (storedUser && typeof storedUser === 'object' && 'name' in storedUser) {
      return { ...storedUser, initials: getInitials(storedUser.name) }
    }
    if (loggedOutCookie.value) return null
    return { ...DEMO_USER }
  })

  const isAuthenticated = computed(() => user.value !== null)

  function login(email: string): void {
    user.value = {
      name: DEMO_USER.name,
      email: email.trim() || DEMO_USER.email,
      role: DEMO_USER.role,
      initials: getInitials(DEMO_USER.name),
    }
    userCookie.value = user.value
    loggedOutCookie.value = false
  }

  function updateProfile(patch: Partial<Pick<UserProfile, 'name' | 'email'>>): void {
    if (!user.value) return
    const name = patch.name?.trim() || user.value.name
    user.value = {
      ...user.value,
      ...patch,
      name,
      initials: getInitials(name),
    }
    userCookie.value = user.value
  }

  function logout(): void {
    user.value = null
    userCookie.value = null
    loggedOutCookie.value = true
  }

  return {
    user,
    isAuthenticated,
    login,
    logout,
    updateProfile,
  }
}
