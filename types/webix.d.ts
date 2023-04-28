import type webix from '~/libs/webix/types/webix';

export interface IAppWebix {
  $$: typeof webix.$$,
  ui: typeof webix.ui,
  event: typeof webix.event,
  eventRemove: typeof webix.eventRemove,
  Sparklines: typeof webix.Sparklines,
  Date: typeof webix.Date,
}
