import type { IMainControllers } from '../modules/main.module';

export type IAppApiControllers = IMainControllers

export enum RESPONSE_STATUS {
  UNAUTHORIZED = 401
}

export interface IApiModuleOptions {
}

export interface IApiModuleConfig {
  defaultResponseInterceptor?: boolean,
  defaultRequestInterceptor?: boolean,
}

export interface IApiControllerOptions {
  controllerUrl?: string,
}

export interface IMainModuleResponse<T = any> {
  success: boolean,
  result: T
}
