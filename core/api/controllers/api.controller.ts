import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import type { IApiControllerOptions } from '../types';

abstract class ApiController<O extends IApiControllerOptions = IApiControllerOptions> {
  protected readonly apiClient: AxiosInstance;
  protected readonly options: O;
  protected readonly controllerUrl: string;

  constructor(apiClient: AxiosInstance, options: O) {
    this.apiClient = apiClient;
    this.options = options;
    this.controllerUrl = options.controllerUrl || '';
  }

  protected get<R, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.apiClient.get<any, R, D>(this._getFullUrl(url), config);
  }

  protected post<R = any, D = any>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.apiClient.post<any, R, D>(this._getFullUrl(url), data, config);
  }

  protected put<R = any, D = any>(url: string, data: D, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.apiClient.put<any, R, D>(this._getFullUrl(url), data, config);
  }

  protected delete<R = any, D = any>(url: string, config?: AxiosRequestConfig<D>): Promise<R> {
    return this.apiClient.delete<any, R, D>(this._getFullUrl(url), config);
  }

  private _getFullUrl(url: string): string {
    return `${this.controllerUrl}${url}`;
  }
}

export default ApiController;
