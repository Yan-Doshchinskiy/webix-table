import axios from 'axios';

import type { AxiosInstance, AxiosInterceptorOptions, AxiosRequestConfig, AxiosResponse } from 'axios';
import type { IApiModuleOptions, IApiModuleConfig } from '../types';

abstract class ApiModule<S, O extends IApiModuleOptions = IApiModuleOptions> {
  protected readonly apiClient: AxiosInstance;
  protected readonly options: O;
  public controllers: S;

  protected constructor(baseURL: string, options: O, config?: IApiModuleConfig) {
    this.apiClient = axios.create({
      baseURL,
      headers: {
        'Content-type': 'application/json'
      }
    });
    this.options = options;
    this.controllers = <S>{};

    if (config?.defaultResponseInterceptor) {
      this._addDefaultResponseInterceptor();
    }
    if (config?.defaultRequestInterceptor) {
      this._addDefaultRequestInterceptor();
    }
  }

  public addResponseInterceptor<T = null, D = null>(
    onFulfilled: (response: AxiosResponse<T, D>) => any | Promise<any>,
    onRejected?: (error: any) => any,
    options?: AxiosInterceptorOptions
  ): void {
    this.apiClient.interceptors.response.use<AxiosResponse<T, D>>(onFulfilled, onRejected, options);
  }

  public addRequestInterceptor<D = null>(
    onFulfilled: (config: AxiosRequestConfig<D>) => AxiosRequestConfig<D> | Promise<AxiosRequestConfig<D>>,
    onRejected?: (error: any) => any,
    options?: AxiosInterceptorOptions
  ): void {
    this.apiClient.interceptors.request.use<AxiosRequestConfig<D>>(onFulfilled, onRejected, options);
  }

  private _addDefaultRequestInterceptor(): void {

  }

  private _addDefaultResponseInterceptor(): void {
    this.addResponseInterceptor<any>(
      response => response.data
    );
  }

  public sendRequest(config: AxiosRequestConfig): Promise<any> {
    return this.apiClient(config);
  }
}

export default ApiModule;
