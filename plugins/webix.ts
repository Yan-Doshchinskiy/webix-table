import * as webix from '~/libs/webix/webix';

import type { Context, Inject } from '@nuxt/types/app';

export default (_: Context, inject: Inject): void => {
  inject('webix', webix);
};
