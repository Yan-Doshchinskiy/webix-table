import type { Module } from '@nuxt/types';
import serverLoggerMiddleware from './server-logger';

/**
 * Модуль создания серверного логера через serverMiddleware
 */
const serverLogger: Module = async function serverLogger(moduleOptions = {}) {
  const { enabled } = moduleOptions;
  if (!enabled) {
    return;
  }

  this.addServerMiddleware({
    path: '/',
    handler: serverLoggerMiddleware
  });
};

export default serverLogger;
