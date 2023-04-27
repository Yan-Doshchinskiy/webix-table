import type { Context, Inject } from '@nuxt/types/app';
import MainModule from '~/core/api/modules/main.module';

import type { IMainModuleResponse } from '~/core/api/types';

export default (_: Context, inject: Inject): void => {
  const apiModule = new MainModule('https://http-test-two.vercel.app/api/v1', {});
  // const apiModule = new MainModule('http://localhost:5000/api/v1', {});
  apiModule.addResponseInterceptor<IMainModuleResponse>((response) => response.data.result);
  inject('api', apiModule.controllers);
};
