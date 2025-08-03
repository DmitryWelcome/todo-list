# To-Do List App

Современное приложение для управления задачами, построенное на Next.js 14, TypeScript, Tailwind CSS и PostgreSQL.

## Возможности

- ✅ Добавление новых задач с описанием
- ✅ Отметка задач как выполненных
- ✅ Редактирование существующих задач
- ✅ Удаление задач
- ✅ Разделение на активные и завершенные задачи
- ✅ Современный и отзывчивый интерфейс
- ✅ Поддержка PostgreSQL (включая Neon)

## Технологии

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL с Prisma ORM
- **Deployment**: Поддержка Vercel, Neon и других платформ

## Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка базы данных

#### Локальная разработка

1. Установите PostgreSQL локально
2. Создайте базу данных:
   ```sql
   CREATE DATABASE todolist;
   ```
3. Настройте `.env` файл:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todolist"
   ```

#### Neon (Рекомендуется для продакшена)

1. Создайте аккаунт на [Neon](https://neon.tech)
2. Создайте новый проект
3. Скопируйте connection string из dashboard
4. Настройте `.env` файл:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/todolist?sslmode=require"
   ```

### 3. Настройка базы данных

```bash
# Генерация Prisma клиента
npx prisma generate

# Применение миграций
npx prisma db push

# (Опционально) Открыть Prisma Studio для просмотра данных
npx prisma studio
```

### 4. Запуск приложения

```bash
# Режим разработки
npm run dev

# Продакшен сборка
npm run build
npm start
```

## Деплой

### Vercel + Neon

1. **Настройка Neon:**
   - Создайте проект в Neon
   - Скопируйте connection string
   - Добавьте переменную окружения `DATABASE_URL` в Vercel

2. **Деплой на Vercel:**
   ```bash
   npm install -g vercel
   vercel
   ```

3. **Настройка переменных окружения в Vercel:**
   - Перейдите в настройки проекта
   - Добавьте `DATABASE_URL` с вашим Neon connection string

### Другие платформы

Приложение поддерживает деплой на любые платформы, поддерживающие Next.js:
- Netlify
- Railway
- Render
- DigitalOcean App Platform

## Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   └── tasks/         # CRUD операции для задач
│   ├── globals.css        # Глобальные стили
│   ├── layout.tsx         # Корневой layout
│   └── page.tsx           # Главная страница
├── components/            # React компоненты
│   ├── AddTaskForm.tsx    # Форма добавления задач
│   ├── TaskItem.tsx       # Компонент отдельной задачи
│   └── TaskList.tsx       # Список задач
└── lib/
    └── db.ts             # Конфигурация Prisma
prisma/
└── schema.prisma         # Схема базы данных
```

## API Endpoints

- `GET /api/tasks` - Получить все задачи
- `POST /api/tasks` - Создать новую задачу
- `PUT /api/tasks/[id]` - Обновить задачу
- `DELETE /api/tasks/[id]` - Удалить задачу

## Разработка

### Добавление новых функций

1. Обновите схему Prisma при необходимости
2. Создайте новые API endpoints
3. Добавьте React компоненты
4. Обновите типы TypeScript

### Линтинг и форматирование

```bash
# Проверка кода
npm run lint

# Форматирование
npm run format
```

## Лицензия

MIT
