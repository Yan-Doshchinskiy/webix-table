import type { TWebixTableItemsArray } from '~/core/api/types/webix';
import type { IApiControllerOptions } from '../types';

import ApiController from './api.controller';

class WebixController extends ApiController<IApiControllerOptions> {
  public async fetchTableItems(): Promise<TWebixTableItemsArray> {
    return this.get<TWebixTableItemsArray>('/table');
  }
}

export default WebixController;
