/**
 * Серверное хранилище данных в памяти. Имитирует БД: справочники +
 * заявки в «проволочном» формате API (ссылки по id, допускает null).
 * Мутирует между запросами в рамках жизни процесса — этого достаточно
 * для демо-уровня; при подключении реальной БД меняется только этот файл.
 */
import type {
  ApiCategory,
  ApiCustomer,
  ApiRequest,
  ApiUser,
} from '~~/shared/types/api'
import { calculateDueAt } from '~~/shared/utils/due'

export interface RequestSeed {
  number: number
  title: string | null
  customerId: string
  assigneeId: string | null
  status: ApiRequest['status']
  priority: ApiRequest['priority']
  categoryId: string
  description: string | null
  createdAt: string
  comments?: { author: string, role: string, createdAt: string, text: string }[]
}

export const apiUsers: ApiUser[] = [
  { id: 'u1', name: 'Брунгильда Б.', role: 'Специалист поддержки' },
  { id: 'u2', name: 'Олег С.', role: 'Специалист поддержки' },
  { id: 'u3', name: 'Анна Ковалёва', role: 'Оператор' },
]

export const apiCustomers: ApiCustomer[] = [
  { id: 'c1', name: 'АО «Вектор»' },
  { id: 'c2', name: 'ООО «Сфера»' },
  { id: 'c3', name: 'ООО «Пульс»' },
]

export const apiCategories: ApiCategory[] = [
  { id: 'cat1', name: 'Доступ' },
  { id: 'cat2', name: 'Отчётность' },
  { id: 'cat3', name: 'Онбординг' },
  { id: 'cat4', name: 'Безопасность' },
  { id: 'cat5', name: 'Инфраструктура' },
  { id: 'cat6', name: 'Оборудование' },
  { id: 'cat7', name: 'Права доступа' },
  { id: 'cat8', name: 'Авторизация' },
  { id: 'cat9', name: 'Коммуникации' },
  { id: 'cat10', name: 'Данные' },
  { id: 'cat11', name: 'Интеграции' },
  { id: 'cat12', name: 'API' },
  { id: 'cat13', name: 'Миграция' },
  { id: 'cat14', name: 'Восстановление данных' },
  { id: 'cat15', name: 'Биллинг' },
  { id: 'cat16', name: 'Документы' },
  { id: 'cat17', name: 'Мобильное приложение' },
]

// Заявка 1042 специально без названия — проверка устойчивости списка (макет 2.06).
export const requestSeeds: RequestSeed[] = [
  {
    number: 1042,
    title: null,
    customerId: 'c1',
    assigneeId: null,
    status: 'new',
    priority: 'high',
    categoryId: 'cat1',
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
    customerId: 'c2',
    assigneeId: null,
    status: 'new',
    priority: 'critical',
    categoryId: 'cat2',
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
    customerId: 'c1',
    assigneeId: 'u1',
    status: 'assigned',
    priority: 'normal',
    categoryId: 'cat3',
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
    customerId: 'c3',
    assigneeId: 'u1',
    status: 'waiting',
    priority: 'high',
    categoryId: 'cat4',
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
    customerId: 'c2',
    assigneeId: 'u2',
    status: 'in-progress',
    priority: 'normal',
    categoryId: 'cat5',
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
    customerId: 'c3',
    assigneeId: 'u1',
    status: 'resolved',
    priority: 'low',
    categoryId: 'cat6',
    description: 'При печати счетов некоторые документы выходят с обрезанным колонтитулом.',
    createdAt: '2026-11-15T16:30:00+03:00',
  },
  {
    number: 1036,
    title: 'Изменить права доступа',
    customerId: 'c1',
    assigneeId: null,
    status: 'new',
    priority: 'normal',
    categoryId: 'cat7',
    description:
      'Руководитель просит ограничить доступ к разделу «Финансы» для группы стажёров.',
    createdAt: '2026-11-15T12:10:00+03:00',
  },
  {
    number: 1035,
    title: 'Ошибка авторизации в кабинете',
    customerId: 'c3',
    assigneeId: 'u2',
    status: 'assigned',
    priority: 'high',
    categoryId: 'cat8',
    description:
      'После сброса пароля пользователь не может авторизоваться в личном кабинете — ошибка «Неверный токен».',
    createdAt: '2026-11-14T18:25:00+03:00',
  },
  {
    number: 1034,
    title: 'Подключить почтовый ящик',
    customerId: 'c2',
    assigneeId: 'u1',
    status: 'closed',
    priority: 'low',
    categoryId: 'cat9',
    description: 'Подключить корпоративный почтовый ящик для нового отдела маркетинга.',
    createdAt: '2026-11-14T10:15:00+03:00',
  },
  {
    number: 1033,
    title: 'Недоступен файловый сервер',
    customerId: 'c1',
    assigneeId: 'u1',
    status: 'in-progress',
    priority: 'critical',
    categoryId: 'cat5',
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
    customerId: 'c3',
    assigneeId: 'u2',
    status: 'closed',
    priority: 'low',
    categoryId: 'cat10',
    description: 'Обновить юридический адрес и телефон компании в реквизитах личного кабинета.',
    createdAt: '2026-11-12T15:45:00+03:00',
  },
  {
    number: 1031,
    title: 'Проверить интеграцию',
    customerId: 'c2',
    assigneeId: 'u1',
    status: 'waiting',
    priority: 'normal',
    categoryId: 'cat11',
    description: 'Проверить обмен данными между CRM и сайтом после обновления.',
    createdAt: '2026-11-12T11:20:00+03:00',
  },
  {
    number: 1030,
    title: 'Повысить лимит API',
    customerId: 'c1',
    assigneeId: null,
    status: 'new',
    priority: 'high',
    categoryId: 'cat12',
    description: 'Увеличить лимит запросов к API для интеграции с партнёрским сервисом.',
    createdAt: '2026-11-11T16:50:00+03:00',
  },
  {
    number: 1029,
    title: 'Не приходит SMS-код',
    customerId: 'c3',
    assigneeId: null,
    status: 'new',
    priority: 'critical',
    categoryId: 'cat8',
    description: 'Пользователь не получает SMS с кодом входа после смены номера телефона.',
    createdAt: '2026-11-11T10:30:00+03:00',
  },
  {
    number: 1028,
    title: 'Перенести данные из старой CRM',
    customerId: 'c2',
    assigneeId: 'u1',
    status: 'waiting',
    priority: 'normal',
    categoryId: 'cat13',
    description: 'Перенести контакты, сделки и историю переписки из старой CRM.',
    createdAt: '2026-11-10T14:15:00+03:00',
  },
  {
    number: 1027,
    title: 'Проверить права в админке',
    customerId: 'c1',
    assigneeId: null,
    status: 'new',
    priority: 'normal',
    categoryId: 'cat7',
    description: 'Проверить, что новые роли не получили лишних прав в административной панели.',
    createdAt: '2026-11-10T09:40:00+03:00',
  },
  {
    number: 1026,
    title: 'Настроить уведомления в Slack',
    customerId: 'c3',
    assigneeId: 'u2',
    status: 'resolved',
    priority: 'low',
    categoryId: 'cat11',
    description: 'Настроить уведомления о критических заявках в канал Slack службы поддержки.',
    createdAt: '2026-11-09T17:05:00+03:00',
  },
  {
    number: 1025,
    title: 'Восстановить удалённые записи',
    customerId: 'c2',
    assigneeId: 'u1',
    status: 'waiting',
    priority: 'critical',
    categoryId: 'cat14',
    description:
      'Клиент случайно удалил записи в справочнике и просит восстановить их из резервной копии.',
    createdAt: '2026-11-09T12:35:00+03:00',
  },
  {
    number: 1024,
    title: 'Дублируются счета',
    customerId: 'c1',
    assigneeId: 'u2',
    status: 'closed',
    priority: 'low',
    categoryId: 'cat15',
    description: 'В личном кабинете за один период отображаются два одинаковых счёта.',
    createdAt: '2026-11-08T15:20:00+03:00',
  },
  {
    number: 1023,
    title: 'Не открывается личный кабинет',
    customerId: 'c3',
    assigneeId: 'u1',
    status: 'escalated',
    priority: 'critical',
    categoryId: 'cat1',
    description: 'Личный кабинет не открывается у части пользователей, ошибка 502.',
    createdAt: '2026-11-08T10:10:00+03:00',
  },
  {
    number: 1022,
    title: 'Добавить нового администратора',
    customerId: 'c2',
    assigneeId: 'u2',
    status: 'closed',
    priority: 'normal',
    categoryId: 'cat7',
    description: 'Выдать роль администратора новому руководителю отдела.',
    createdAt: '2026-11-07T16:45:00+03:00',
  },
  {
    number: 1021,
    title: 'Ошибка в мобильном приложении',
    customerId: 'c1',
    assigneeId: 'u1',
    status: 'closed',
    priority: 'high',
    categoryId: 'cat17',
    description: 'В мобильном приложении не загружается список обращений.',
    createdAt: '2026-11-06T13:25:00+03:00',
  },
  {
    number: 1020,
    title: 'Потерялись вложения в письме',
    customerId: 'c3',
    assigneeId: 'u1',
    status: 'escalated',
    priority: 'high',
    categoryId: 'cat9',
    description: 'Вложения в письме не отображаются у получателей.',
    createdAt: '2026-11-05T11:55:00+03:00',
  },
  {
    number: 1019,
    title: 'Запросить закрывающие документы',
    customerId: 'c2',
    assigneeId: null,
    status: 'closed',
    priority: 'low',
    categoryId: 'cat16',
    description: 'Подготовить закрывающие документы за октябрь и отправить клиенту.',
    createdAt: '2026-11-05T09:30:00+03:00',
  },
]

export function buildApiRequest(seed: RequestSeed): ApiRequest {
  return {
    id: String(seed.number),
    number: seed.number,
    title: seed.title,
    customerId: seed.customerId,
    assigneeId: seed.assigneeId,
    status: seed.status,
    priority: seed.priority,
    categoryId: seed.categoryId,
    description: seed.description,
    createdAt: seed.createdAt,
    updatedAt: seed.createdAt,
    dueAt: calculateDueAt(seed.createdAt, seed.priority),
  }
}

/** Заявки в формате API. В памяти процесса, чтобы мутации жили между запросами. */
export const apiRequests: ApiRequest[] = requestSeeds.map(buildApiRequest)

export interface StoredComment {
  requestId: string
  id: string
  author: string
  role: string
  createdAt: string
  text: string
}

export interface StoredEvent {
  requestId: string
  id: string
  type: string
  title: string
  description?: string
  author?: string
  createdAt: string
}

export const apiComments: StoredComment[] = []
export const apiEvents: StoredEvent[] = []

// Первичные комментарии и события из seed-данных.
for (const seed of requestSeeds) {
  const requestId = String(seed.number)
  for (const [index, comment] of (seed.comments ?? []).entries()) {
    apiComments.push({
      requestId,
      id: `${requestId}-comment-${index + 1}`,
      ...comment,
    })
  }
}

export function nextRequestNumber(): number {
  return Math.max(1042, ...apiRequests.map(request => request.number)) + 1
}
