# Развертывание на Netlify

## Пошаговая инструкция

### Шаг 1: Push код в GitHub

```bash
git push origin main
```

### Шаг 2: Подключить репо на Netlify

1. Перейдите на https://netlify.com
2. Нажмите **"Sign up"** или **"Log in"** (используйте GitHub аккаунт)
3. После входа, нажмите **"Add new site"** → **"Import an existing project"**
4. Выберите **GitHub** в качестве Git провайдера
5. Авторизуйте Netlify доступ к вашим репо
6. Найдите репо `mm5974412-pixel/8-marta-quest`
7. Нажмите на него

### Шаг 3: Конфигурация

На экране конфигурации:
- **Owner**: выберите ваш account
- **Branch to deploy**: `main`
- **Build command**: оставьте пусто (Netlify автоматически прочитает из `netlify.toml`)
- **Publish directory**: оставьте пусто (указано в `netlify.toml`)

### Шаг 4: Переменные окружения (важно!)

Нажмите **"Show advanced"** и добавьте переменные:

```
NEXT_PUBLIC_SUPABASE_URL = https://vkuzzbdlbnacsfvpmdir.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrdXp6YmRsYm5hY3NmdnBtZGlyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1ODcwMzUsImV4cCI6MjA4NzE2MzAzNX0.qG8nmI15bhK42P_FoI0yDTG2VGl5ex5a18jFA81ssTQ
```

### Шаг 5: Deploy

Нажмите **"Deploy"** и ждите!

## Детали конфигурации

- `netlify.toml` - конфигурация сборки
- `.nvmrc` - Node.js версия 20
- `.netlifyignore` - файлы для игнорирования
- `@netlify/plugin-nextjs` - автоматически установится при deploy

## После успешного deploy

Netlify предоставит URL вида `https://your-site.netlify.app`

Каждый push в `main` будет автоматически запускать новый deploy.
