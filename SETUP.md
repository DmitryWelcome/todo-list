# Настройка проекта для разработки

## Предварительные требования

- Node.js 18+
- npm или yarn
- PostgreSQL (для локальной разработки)

## Пошаговая настройка

### 1. Клонирование и установка зависимостей

```bash
# Клонирование репозитория (если еще не сделано)
git clone <your-repo-url>
cd to-do-list

# Установка зависимостей
npm install
```

### 2. Настройка базы данных

#### Вариант A: Локальная PostgreSQL

1. Установите PostgreSQL:

   - **Windows**: Скачайте с [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql`
   - **Linux**: `sudo apt-get install postgresql`

2. Создайте базу данных:

   ```sql
   CREATE DATABASE todolist;
   ```

3. Создайте файл `.env` в корне проекта:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/todolist"
   ```

#### Вариант B: Neon (Рекомендуется)

1. Создайте аккаунт на [neon.tech](https://neon.tech)
2. Создайте новый проект
3. Скопируйте connection string из dashboard
4. Создайте файл `.env`:
   ```env
   DATABASE_URL="postgresql://username:password@ep-xxx-xxx-xxx.region.aws.neon.tech/todolist?sslmode=require"
   ```

### 3. Настройка Prisma

```bash
# Генерация Prisma клиента
npx prisma generate

# Применение схемы к базе данных
npx prisma db push

# (Опционально) Открыть Prisma Studio для просмотра данных
npx prisma studio
```

### 4. Запуск приложения

```bash
# Режим разработки
npm run dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Проверка работоспособности

### 1. Проверка API

Откройте браузер и перейдите по адресу:

- http://localhost:3000/api/tasks

Должен вернуться пустой массив `[]` или список задач.

### 2. Проверка интерфейса

1. Откройте http://localhost:3000
2. Попробуйте добавить новую задачу
3. Проверьте редактирование и удаление задач
4. Проверьте отметку задач как выполненных

### 3. Проверка базы данных

```bash
# Открыть Prisma Studio
npx prisma studio
```

Это откроет веб-интерфейс для просмотра данных в базе.

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
├── lib/                   # Утилиты
│   ├── api.ts            # API утилиты
│   └── db.ts             # Конфигурация Prisma
└── types/                # TypeScript типы
    └── index.ts          # Основные типы
prisma/
└── schema.prisma         # Схема базы данных
```

## Полезные команды

```bash
# Проверка кода
npm run lint

# Сборка для продакшена
npm run build

# Запуск продакшен версии
npm start

# Сброс базы данных (осторожно!)
npx prisma db push --force-reset

# Просмотр логов Prisma
npx prisma studio
```

## Troubleshooting

### Ошибка подключения к базе данных

1. Проверьте правильность `DATABASE_URL` в `.env`
2. Убедитесь, что PostgreSQL запущен (для локальной разработки)
3. Проверьте, что база данных существует

### Ошибки TypeScript

```bash
# Проверка типов
npx tsc --noEmit
```

### Ошибки Prisma

```bash
# Пересоздание клиента
npx prisma generate

# Сброс базы данных
npx prisma db push --force-reset
```

### Проблемы с зависимостями

```bash
# Очистка кэша
npm cache clean --force

# Переустановка зависимостей
rm -rf node_modules package-lock.json
npm install
```

## Разработка новых функций

### 1. Добавление новых полей в базу данных

1. Обновите `prisma/schema.prisma`
2. Выполните `npx prisma db push`
3. Обновите типы в `src/types/index.ts`
4. Обновите API endpoints
5. Обновите компоненты

### 2. Добавление новых API endpoints

1. Создайте новый файл в `src/app/api/`
2. Добавьте методы GET, POST, PUT, DELETE
3. Обновите API утилиты в `src/lib/api.ts`

### 3. Добавление новых компонентов

1. Создайте компонент в `src/components/`
2. Добавьте типы в `src/types/index.ts`
3. Импортируйте и используйте в нужных местах

## Git workflow

```bash
# Создание новой ветки
git checkout -b feature/new-feature

# Добавление изменений
git add .

# Коммит
git commit -m "feat: add new feature"

# Пуш
git push origin feature/new-feature
```

## Полезные ссылки

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
