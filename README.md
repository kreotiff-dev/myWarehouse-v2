# Система управления складом (WMS)

Комплексная система управления складом, построенная на Node.js и MongoDB для управления товарными запасами, заказами и складскими операциями.

## Возможности

- Управление товарами и запасами
- Управление ячейками с отслеживанием вместимости
- Обработка заказов и их выполнение
- Workflow'ы сборки, упаковки и отгрузки
- Аутентификация и авторизация пользователей
- API документация с Swagger и ReDoc

## Установка

```bash
# Клонировать репозиторий
git clone <repository-url>
cd wms-project

# Установить зависимости
npm install

# Создать и настроить .env файл
# Смотри пример ниже

# Запустить сервер
npm run dev
```

## Настройка окружения

Создайте файл `.env` в корне проекта:

```env
# База данных
MONGODB_URI=mongodb://localhost:27017/wms

# Порт сервера
PORT=3001

# JWT секрет
JWT_SECRET=your-secret-key

# Протокол и хост API
API_PROTOCOL=http
API_HOSTNAME=localhost:3001
```

## API Документация

После запуска сервера вы можете получить доступ к API документации по адресам:

- **📚 Swagger UI:** http://localhost:3001/api-docs/swagger
- **📖 ReDoc:** http://localhost:3001/api-docs

**🎯 Идеальный полигон для изучения API тестирования!**

## Разработка

### Управление версиями

Этот проект использует [standard-version](https://github.com/conventional-changelog/standard-version) для версионирования на основе [Conventional Commits](https://www.conventionalcommits.org/).

Для создания нового релиза:

```bash
# Запустить скрипт релиза
npm run release

# Отправить новую версию и теги
git push --follow-tags origin main
```

## Лицензия

Этот проект лицензирован под ISC License.
