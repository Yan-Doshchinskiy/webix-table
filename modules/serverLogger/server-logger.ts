import type http from 'http';

/**
 * тип сообщения для logger
 */
type LoggerMessageType = 'ServerLogger';

/**
 * Сообщение logger
 */
interface LoggerMessage {
    /**
     * тип сообщения для logger
     */
    type: LoggerMessageType;

    /**
     * дата и время запроса
     */
    date: string;

    /**
     * ip адрес пользователя
     */
    ip: string;

    /**
     * статус
     */
    status: string;

    /**
     * мутод
     */
    method: string;

    /**
     * путь
     */
    route: string;

    /**
     * хост
     */
    host: string;

    /**
     * query параметры
     */
    query: string;
}

/**
 * Server middleware для логирования
 */
function serverLoggerMiddleware(
  req: http.IncomingMessage,
  res: http.ServerResponse,
  next: (err?: any) => void
): void {
  // получаем ip пользователя
  const ip = req.socket.remoteAddress || '';

  // парсим url
  const fullPath = `https://${req.headers.host}${req.url}`;
  const url = new URL(fullPath);

  const message = _createLogMessage(ip, url, res.statusCode, req.method);
  const formattedMessage = _formatMessage(message);

  // логируем нужную информацию
  console.log(formattedMessage);

  // логируем в читаемом виде
  console.table(message);

  // переходим к следующей serverMiddleware
  return next();
}

/**
 * Создает сообщение для логирования
 */
function _createLogMessage(
  ip: string,
  url: URL,
  status?: number,
  method?: string
): LoggerMessage {
  // текущая дата
  const date = new Date().toDateString();

  return {
    type: 'ServerLogger',
    date,
    ip,
    status: String(status) || '',
    method: method?.toUpperCase() || '',
    route: url.pathname,
    host: url.host,
    query: url.search
  };
}

/**
 * форматирует сообщение для вывода stdout
 */
function _formatMessage(
  message: LoggerMessage
): string {
  return Object.entries(message).reduce((acc, rec) => {
    const [key, value] = rec;
    const item = `[${key}]: {${value}} `;
    return `${acc}${item}`;
  }, '');
}

export default serverLoggerMiddleware;
