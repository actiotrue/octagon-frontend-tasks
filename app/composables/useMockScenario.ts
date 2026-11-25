import type { MockScenario } from '~/types'

const SCENARIOS: MockScenario[] = ['normal', 'loading', 'empty', 'error']

export function useMockScenario() {
  const route = useRoute()
  const router = useRouter()

  const scenario = computed<MockScenario>(() => {
    const value = route.query.state
    return typeof value === 'string' && SCENARIOS.includes(value as MockScenario)
      ? (value as MockScenario)
      : 'normal'
  })

  async function setScenario(next: MockScenario): Promise<void> {
    const query = { ...route.query }

    if (next === 'normal') {
      delete query.state
    } else {
      query.state = next
    }

    await router.replace({ query })
  }

  return {
    scenario,
    setScenario,
  }
}
