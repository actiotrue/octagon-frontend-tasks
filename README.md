# WorkFlow — поддержка без потерь

Демо-интерфейс службы поддержки по макету из Figma: публичные страницы, вход, обзорная панель, список и карточка заявки, профиль оператора. Данные отдаются серверными API-ручками Nuxt (хранилище в памяти).

## Стек

- **Nuxt 4** (SSR), Vue 3, TypeScript, Pinia (состояние)

## Запуск

```bash
pnpm install
pnpm dev
```

Приложение откроется на `http://localhost:3000`.

## Демо-вход

В демо-режиме пользователь уже авторизован как **Анна Ковалёва, оператор**, поэтому `/dashboard`, `/requests` и `/profile` доступны сразу.

Чтобы проверить страницу входа:

1. Выйдите через меню пользователя или кнопку в профиле.
2. Откроется `/login`; введите любой корректный e-mail и пароль от 4 символов.
3. После входа произойдёт возврат на защищённую страницу из параметра `redirect`.

Регистрация в демо не реализована — показывается поясняющее сообщение.

## Маршруты

| Путь | Описание |
| --- | --- |
| `/` | Лендинг: hero с графикой Octagon, 3 шага, возможности, FAQ |
| `/login` | Вход с валидацией и показом пароля |
| `/dashboard` | Обзор: 4 показателя и последние заявки |
| `/requests` | Список заявок: поиск, фильтры, сортировка, пагинация |
| `/requests/:id` | Карточка заявки: описание, комментарии, история, параметры (статус/приоритет/исполнитель с optimistic update и Undo) |
| `/profile` | Профиль: данные, настройки интерфейса, выход |

## Структура проекта

```text
app/
  assets/css/main.css        дизайн-токены макета (--octagon-*), тема, анимации
  components/                UI-компоненты и блоки страниц
  composables/               useDirectories (справочники), useDebounce, auth, focus trap
  layouts/                   default (app) и public (лендинг/вход)
  middleware/auth.global.ts  защита приватных маршрутов
  pages/                     страницы приложения
  stores/                    Pinia: requests (server state), preferences (app state), requestUi (баннеры)
  types/                     доменные типы
  utils/                     apiMappers (API → доменные модели), форматирование
  error.vue                  кастомная страница 404/500
server/
  api/                       requests (GET/POST/PATCH, :id, comments), users, customers, categories, stats
  utils/                     db (хранилище в памяти), priority
shared/
  types/api.ts               TypeScript-модели API (контракт клиент ⇆ сервер)
  utils/due.ts               SLA-сроки (общее для клиента и сервера)
public/images/               графика из макета (octagon-hero.png)
nuxt.config.ts               шрифты, head, transitions, tailwind vite-плагин
```

