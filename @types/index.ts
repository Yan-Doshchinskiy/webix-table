import type { IAppWebix } from '~/types/webix';
import type { IMainControllers } from '~/core/api/modules/main.module';

export interface IAppContextExtended {
  $webix: IAppWebix,
  $api: IMainControllers
}
