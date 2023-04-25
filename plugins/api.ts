import type { Context, Inject } from '@nuxt/types/app';
import MainModule from '~/core/api/modules/main.module';

export default (_: Context, inject: Inject): void => {
  const apiModule = new MainModule('https://http-test-two.vercel.app/api/v1', {});
  inject('api', apiModule.controllers);
};
