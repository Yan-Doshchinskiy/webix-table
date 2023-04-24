import type webix from 'webix/types/webix';

export interface IAppWebix {
  $$: typeof webix.$$,
  ui: typeof webix.ui
}
