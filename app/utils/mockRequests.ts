import type {
  RequestComment,
  RequestPriority,
  RequestStatus,
  SupportRequest,
  TimelineEvent,
} from '~/types'
import { calculateDueAt } from '~/utils/requests'

interface SeedComment {
  author: string
  role: string
  createdAt: string
  text: string
}

interface RequestSeed {
  number: number
  title: string
  client: string
  assignee: string | null
  status: RequestStatus
  priority: RequestPriority
  category: string
  description: string
  createdAt: string
  comments?: SeedComment[]
}

const seeds: RequestSeed[] = [
  {
    number: 1042,
    title: 'Не работает доступ к CRM',
    client: 'АО «Вектор»',
    assignee: null,
    status: 'new',
    priority: 'high',
    category: 'Доступ',
    description:
      'Сотрудники не могут войти в раздел «Сделки» с 9:00. Ошибка появляется у всех пользователей роли «Менеджер».',
    createdAt: '2026-11-17T09:12:00+03:00',
    comments: [
      {
        author: 'Мария Соколова',
        role: 'АО «Вектор»',
        createdAt: '2026-11-17T09:18:00+03:00',
        text: 'С утра у сотрудников не открывается раздел «Сделки». Перезапуск браузера не помог.',
      },
      {
        author: 'Анна Ковалёва',
        role: 'Оператор',
        createdAt: '2026-11-17T09:44:00+03:00',
        text: 'Приняла обращение, проверяю права роли и журнал доступа.',
      },
    ],
  },
  {
    number: 1041,
    title: 'Ошибка выгрузки отчёта',
    client: 'ООО «Сфера»',
    assignee: null,
    status: 'new',
    priority: 'critical',
    category: 'Отчётность',
    description:
      'При выгрузке отчёта за октябрь система возвращает ошибку 500 и не формирует файл.',
    createdAt: '2026-11-17T08:45:00+03:00',
    comments: [
      {
        author: 'Илья Морозов',
        role: 'ООО «Сфера»',
        createdAt: '2026-11-17T08:50:00+03:00',
        text: 'Отчёт нужен сегодня до конца дня для отправки в банк.',
      },
    ],
  },
  {
    number: 1040,
    title: 'Подключить нового сотрудника',
    client: 'АО «Вектор»',
    assignee: 'Брунгильда Б.',
    status: 'assigned',
    priority: 'normal',
    category: 'Онбординг',
    description:
      'Нужно создать учётные записи для нового менеджера по продажам и выдать доступы к CRM и почте.',
    createdAt: '2026-11-16T17:20:00+03:00',
    comments: [
      {
        author: 'Ольга Верещагина',
        role: 'АО «Вектор»',
        createdAt: '2026-11-16T17:25:00+03:00',
        text: 'Сотрудник выходит в понедельник, доступы нужны заранее.',
      },
      {
        author: 'Брунгильда Б.',
        role: 'Специалист поддержки',
        createdAt: '2026-11-16T17:40:00+03:00',
        text: 'Собираю список доступов, уточняю у руководителя набор ролей.',
      },
    ],
  },
  {
    number: 1039,
    title: 'Обновить сертификат',
    client: 'ООО «Пульс»',
    assignee: 'Брунгильда Б.',
    status: 'waiting',
    priority: 'high',
    category: 'Безопасность',
    description:
      'Истекает срок действия SSL-сертификата основного домена. Нужно обновить и проверить цепочку.',
    createdAt: '2026-11-16T14:05:00+03:00',
    comments: [
      {
        author: 'Брунгильда Б.',
        role: 'Специалист поддержки',
        createdAt: '2026-11-16T14:20:00+03:00',
        text: 'Запросила у клиента подтверждение владения доменом.',
      },
    ],
  },
  {
    number: 1038,
    title: 'Настроить резервное копирование',
    client: 'ООО «Сфера»',
    assignee: 'Олег С.',
    status: 'in-progress',
    priority: 'normal',
    category: 'Инфраструктура',
    description:
      'Настроить ежедневное резервное копирование базы и хранение копий в течение 30 дней.',
    createdAt: '2026-11-16T11:40:00+03:00',
    comments: [
      {
        author: 'Олег С.',
        role: 'Специалист поддержки',
        createdAt: '2026-11-16T12:10:00+03:00',
        text: 'Проверяю свободное место в хранилище и текущее расписание бэкапов.',
      },
    ],
  },
  {
    number: 1037,
    title: 'Сбой печати документов',
    client: 'ООО «Пульс»',
    assignee: 'Брунгильда Б.',
    status: 'resolved',
    priority: 'low',
    category: 'Оборудование',
    description: 'При печати счетов некоторые документы выходят с обрезанным колонтитулом.',
    createdAt: '2026-11-15T16:30:00+03:00',
  },
  {
    number: 1036,
    title: 'Изменить права доступа',
    client: 'АО «Вектор»',
    assignee: null,
    status: 'new',
    priority: 'normal',
    category: 'Права доступа',
    description:
      'Руководитель просит ограничить доступ к разделу «Финансы» для группы стажёров.',
    createdAt: '2026-11-15T12:10:00+03:00',
  },
  {
    number: 1035,
    title: 'Ошибка авторизации в кабинете',
    client: 'ООО «Пульс»',
    assignee: 'Олег С.',
    status: 'assigned',
    priority: 'high',
    category: 'Авторизация',
    description:
      'После сброса пароля пользователь не может авторизоваться в личном кабинете — ошибка «Неверный токен».',
    createdAt: '2026-11-14T18:25:00+03:00',
  },
  {
    number: 1034,
    title: 'Подключить почтовый ящик',
    client: 'ООО «Сфера»',
    assignee: 'Брунгильда Б.',
    status: 'closed',
    priority: 'low',
    category: 'Коммуникации',
    description: 'Подключить корпоративный почтовый ящик для нового отдела маркетинга.',
    createdAt: '2026-11-14T10:15:00+03:00',
  },
  {
    number: 1033,
    title: 'Недоступен файловый сервер',
    client: 'АО «Вектор»',
    assignee: 'Брунгильда Б.',
    status: 'in-progress',
    priority: 'critical',
    category: 'Инфраструктура',
    description: 'Файловый сервер недоступен из офисной сети, сетевые диски не открываются.',
    createdAt: '2026-11-13T09:05:00+03:00',
    comments: [
      {
        author: 'Анна Ковалёва',
        role: 'Оператор',
        createdAt: '2026-11-13T09:20:00+03:00',
        text: 'Подключаю дежурного инженера, проверяем доступность из разных подсетей.',
      },
    ],
  },
  {
    number: 1032,
    title: 'Изменить контакты компании',
    client: 'ООО «Пульс»',
    assignee: 'Олег С.',
    status: 'closed',
    priority: 'low',
    category: 'Данные',
    description: 'Обновить юридический адрес и телефон компании в реквизитах личного кабинета.',
    createdAt: '2026-11-12T15:45:00+03:00',
  },
  {
    number: 1031,
    title: 'Проверить интеграцию',
    client: 'ООО «Сфера»',
    assignee: 'Брунгильда Б.',
    status: 'waiting',
    priority: 'normal',
    category: 'Интеграции',
    description: 'Проверить обмен данными между CRM и сайтом после обновления.',
    createdAt: '2026-11-12T11:20:00+03:00',
  },
  {
    number: 1030,
    title: 'Повысить лимит API',
    client: 'АО «Вектор»',
    assignee: null,
    status: 'new',
    priority: 'high',
    category: 'API',
    description: 'Увеличить лимит запросов к API для интеграции с партнёрским сервисом.',
    createdAt: '2026-11-11T16:50:00+03:00',
  },
  {
    number: 1029,
    title: 'Не приходит SMS-код',
    client: 'ООО «Пульс»',
    assignee: null,
    status: 'new',
    priority: 'critical',
    category: 'Авторизация',
    description: 'Пользователь не получает SMS с кодом входа после смены номера телефона.',
    createdAt: '2026-11-11T10:30:00+03:00',
  },
  {
    number: 1028,
    title: 'Перенести данные из старой CRM',
    client: 'ООО «Сфера»',
    assignee: 'Брунгильда Б.',
    status: 'waiting',
    priority: 'normal',
    category: 'Миграция',
    description: 'Перенести контакты, сделки и историю переписки из старой CRM.',
    createdAt: '2026-11-10T14:15:00+03:00',
  },
  {
    number: 1027,
    title: 'Проверить права в админке',
    client: 'АО «Вектор»',
    assignee: null,
    status: 'new',
    priority: 'normal',
    category: 'Права доступа',
    description: 'Проверить, что новые роли не получили лишних прав в административной панели.',
    createdAt: '2026-11-10T09:40:00+03:00',
  },
  {
    number: 1026,
    title: 'Настроить уведомления в Slack',
    client: 'ООО «Пульс»',
    assignee: 'Олег С.',
    status: 'resolved',
    priority: 'low',
    category: 'Интеграции',
    description: 'Настроить уведомления о критических заявках в канал Slack службы поддержки.',
    createdAt: '2026-11-09T17:05:00+03:00',
  },
  {
    number: 1025,
    title: 'Восстановить удалённые записи',
    client: 'ООО «Сфера»',
    assignee: 'Брунгильда Б.',
    status: 'waiting',
    priority: 'critical',
    category: 'Восстановление данных',
    description:
      'Клиент случайно удалил записи в справочнике и просит восстановить их из резервной копии.',
    createdAt: '2026-11-09T12:35:00+03:00',
  },
  {
    number: 1024,
    title: 'Дублируются счета',
    client: 'АО «Вектор»',
    assignee: 'Олег С.',
    status: 'closed',
    priority: 'low',
    category: 'Биллинг',
    description: 'В личном кабинете за один период отображаются два одинаковых счёта.',
    createdAt: '2026-11-08T15:20:00+03:00',
  },
  {
    number: 1023,
    title: 'Не открывается личный кабинет',
    client: 'ООО «Пульс»',
    assignee: 'Брунгильда Б.',
    status: 'escalated',
    priority: 'critical',
    category: 'Доступ',
    description: 'Личный кабинет не открывается у части пользователей, ошибка 502.',
    createdAt: '2026-11-08T10:10:00+03:00',
  },
  {
    number: 1022,
    title: 'Добавить нового администратора',
    client: 'ООО «Сфера»',
    assignee: 'Олег С.',
    status: 'closed',
    priority: 'normal',
    category: 'Права доступа',
    description: 'Выдать роль администратора новому руководителю отдела.',
    createdAt: '2026-11-07T16:45:00+03:00',
  },
  {
    number: 1021,
    title: 'Ошибка в мобильном приложении',
    client: 'АО «Вектор»',
    assignee: 'Брунгильда Б.',
    status: 'closed',
    priority: 'high',
    category: 'Мобильное приложение',
    description: 'В мобильном приложении не загружается список обращений.',
    createdAt: '2026-11-06T13:25:00+03:00',
  },
  {
    number: 1020,
    title: 'Потерялись вложения в письме',
    client: 'ООО «Пульс»',
    assignee: 'Брунгильда Б.',
    status: 'escalated',
    priority: 'high',
    category: 'Коммуникации',
    description: 'Вложения в письме не отображаются у получателей.',
    createdAt: '2026-11-05T11:55:00+03:00',
  },
  {
    number: 1019,
    title: 'Запросить закрывающие документы',
    client: 'ООО «Сфера»',
    assignee: null,
    status: 'closed',
    priority: 'low',
    category: 'Документы',
    description: 'Подготовить закрывающие документы за октябрь и отправить клиенту.',
    createdAt: '2026-11-05T09:30:00+03:00',
  },
]

function addMinutes(iso: string, minutes: number): string {
  return new Date(new Date(iso).getTime() + minutes * 60 * 1000).toISOString()
}

function buildTimeline(seed: RequestSeed, comments: RequestComment[]): TimelineEvent[] {
  const events: TimelineEvent[] = []
  let offset = 0

  const push = (
    type: TimelineEvent['type'],
    title: string,
    description: string | undefined,
    author: string | undefined,
    minutes: number,
  ) => {
    events.push({
      id: `${seed.number}-event-${events.length + 1}`,
      type,
      title,
      description,
      author,
      createdAt: addMinutes(seed.createdAt, minutes),
    })
  }

  push('created', 'Заявка создана', `${seed.client} · ${seed.category}`, seed.client, offset)

  if (seed.assignee) {
    offset += 20
    push(
      'assigned',
      'Назначен исполнитель',
      seed.assignee,
      'Анна Ковалёва',
      offset,
    )
  }

  if (
    seed.status === 'in-progress' ||
    seed.status === 'waiting' ||
    seed.status === 'escalated' ||
    seed.status === 'resolved' ||
    seed.status === 'closed'
  ) {
    offset += 40
    push('status', 'Заявка взята в работу', seed.assignee ?? 'Анна Ковалёва', seed.assignee ?? undefined, offset)
  }

  if (seed.status === 'waiting') {
    offset += 50
    push(
      'status',
      'Ожидание ответа клиента',
      'Запрошена дополнительная информация',
      seed.assignee ?? undefined,
      offset,
    )
  }

  if (seed.status === 'escalated') {
    offset += 70
    push(
      'status',
      'Заявка эскалирована',
      'Передана старшему специалисту для ускоренного решения',
      'Система',
      offset,
    )
  }

  if (seed.status === 'resolved') {
    offset += 120
    push('resolved', 'Заявка решена', 'Решение подтверждено клиентом', seed.assignee ?? undefined, offset)
  }

  if (seed.status === 'closed') {
    offset += 150
    push('closed', 'Заявка закрыта', 'Клиент подтвердил решение', seed.assignee ?? undefined, offset)
  }

  for (const comment of comments) {
    const minutes = Math.max(
      0,
      Math.round((new Date(comment.createdAt).getTime() - new Date(seed.createdAt).getTime()) / 60000),
    )
    events.push({
      id: `${seed.number}-event-${events.length + 1}`,
      type: 'comment',
      title: 'Комментарий',
      description: comment.text,
      author: comment.author,
      createdAt: comment.createdAt,
    })
    offset = Math.max(offset, minutes)
  }

  return events.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )
}

function buildRequest(seed: RequestSeed): SupportRequest {
  const comments: RequestComment[] = (seed.comments ?? []).map((comment, index) => ({
    id: `${seed.number}-comment-${index + 1}`,
    ...comment,
  }))
  const timeline = buildTimeline(seed, comments)
  const updatedAt = timeline.at(-1)?.createdAt ?? seed.createdAt

  return {
    id: String(seed.number),
    number: seed.number,
    title: seed.title,
    client: seed.client,
    assignee: seed.assignee,
    status: seed.status,
    priority: seed.priority,
    category: seed.category,
    description: seed.description,
    createdAt: seed.createdAt,
    updatedAt,
    dueAt: calculateDueAt(seed.createdAt, seed.priority),
    comments,
    timeline,
  }
}

export const mockRequests: SupportRequest[] = seeds.map(buildRequest)
