import type webix from 'webix/types/webix';

export interface IAppWebix {
  $$: typeof webix.$$,
  ui: typeof webix.ui,
  event: typeof webix.event,
  eventRemove: typeof webix.eventRemove,
}
