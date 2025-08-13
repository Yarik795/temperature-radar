# 🚀 Deployment Guide - Temperature Radar

## 🌐 **GitHub Pages (Рекомендуется)**

### **Автоматический деплой:**

1. **Настройте GitHub Pages:**
   - Перейдите в Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Folder: / (root)
   - Нажмите Save

2. **GitHub Actions автоматически:**
   - При каждом push в main ветку
   - Создается gh-pages ветка
   - Сайт доступен по адресу: `https://yarik795.github.io/temperature-radar`

### **Ручной деплой:**

```bash
# Создайте gh-pages ветку
git checkout -b gh-pages

# Добавьте все файлы
git add .

# Зафиксируйте изменения
git commit -m "Deploy to GitHub Pages"

# Отправьте на GitHub
git push origin gh-pages

# Вернитесь в main ветку
git checkout main
```

## 🔧 **Альтернативные платформы:**

### **Netlify (БЕСПЛАТНО):**
1. Подключите GitHub репозиторий
2. Build command: оставьте пустым
3. Publish directory: `.`
4. Автоматический деплой при каждом push

### **Vercel (БЕСПЛАТНО):**
1. Импортируйте GitHub репозиторий
2. Framework Preset: Other
3. Root Directory: `.`
4. Автоматический деплой

### **Firebase Hosting:**
```bash
# Установите Firebase CLI
npm install -g firebase-tools

# Войдите в аккаунт
firebase login

# Инициализируйте проект
firebase init hosting

# Деплой
firebase deploy
```

## 📁 **Структура для деплоя:**

```
temperature-radar/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions
├── index.html                  # Главная страница
├── script.js                   # JavaScript логика
├── styles.css                  # CSS стили
├── dataexport_20250813T194724.csv  # Данные
├── package.json                # Метаданные проекта
├── .gitignore                  # Исключения Git
└── README.md                   # Документация
```

## 🚀 **Команды для быстрого деплоя:**

```bash
# Добавьте новые файлы
git add .

# Зафиксируйте изменения
git commit -m "Add deployment configuration"

# Отправьте на GitHub
git push origin main

# GitHub Actions автоматически задеплоит на Pages!
```

## ✅ **Проверка деплоя:**

1. **GitHub Actions:**
   - Перейдите в Actions вкладку
   - Убедитесь, что workflow выполнился успешно

2. **GitHub Pages:**
   - Проверьте Settings → Pages
   - Должно быть: "Your site is published at..."

3. **Сайт:**
   - Откройте `https://yarik795.github.io/temperature-radar`
   - Убедитесь, что все работает

## 🐛 **Устранение проблем:**

### **Проблема: Actions не запускаются**
**Решение:** Проверьте, что файл `.github/workflows/deploy.yml` добавлен в репозиторий

### **Проблема: Сайт не обновляется**
**Решение:** Подождите 5-10 минут, GitHub Pages обновляется не мгновенно

### **Проблема: Ошибки в Actions**
**Решение:** Проверьте логи в Actions вкладке, исправьте ошибки

## 🌟 **Преимущества GitHub Pages:**

- ✅ **Бесплатно** - без ограничений
- ✅ **Автоматически** - при каждом push
- ✅ **SSL сертификат** - HTTPS включен
- ✅ **CDN** - быстрая загрузка по всему миру
- ✅ **Интеграция** - с GitHub Actions

---

**🎯 После настройки ваш сайт будет доступен по адресу:**
**https://yarik795.github.io/temperature-radar**
