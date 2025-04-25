import jwt from 'jsonwebtoken';

/**
 * Middleware для проверки JWT токена
 */
export const authMiddleware = (req, res, next) => {
  try {
    // Получаем заголовок авторизации
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    
    // Извлекаем токен
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Токен не предоставлен' });
    }
    
    // Верифицируем токен
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Добавляем данные пользователя в объект запроса
    req.user = decoded;
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Срок действия токена истек' });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Недействительный токен' });
    }
    
    res.status(500).json({ message: 'Ошибка сервера', error: error.message });
  }
};

/**
 * Middleware для проверки роли
 * @param {Array} roles - массив разрешенных ролей
 */
export const roleMiddleware = (roles) => {
  return (req, res, next) => {
    // Предполагаем, что authMiddleware уже выполнился и req.user установлен
    if (!req.user) {
      return res.status(401).json({ message: 'Необходима авторизация' });
    }
    
    // Проверяем роль пользователя
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'У вас нет прав для выполнения этого действия' 
      });
    }
    
    next();
  };
};

/**
 * Middleware для проверки рабочих ролей (worker и admin)
 * 
 * Админы имеют полный доступ ко всем эндпоинтам
 * Workers имеют доступ к рабочим функциям
 */
export const workerRoleMiddleware = (req, res, next) => {
  // Предполагаем, что authMiddleware уже выполнился и req.user установлен
  if (!req.user) {
    return res.status(401).json({ message: 'Необходима авторизация' });
  }
  
  // Проверка роли - admin и worker имеют доступ
  if (req.user.role !== 'admin' && req.user.role !== 'worker') {
    return res.status(403).json({ 
      message: 'У вас нет прав для выполнения рабочих операций' 
    });
  }
  
  next();
};