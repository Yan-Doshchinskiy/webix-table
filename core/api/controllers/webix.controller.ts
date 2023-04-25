import type { IWebixTableResponse, TWebixTableItemsArray } from '~/core/api/types/webix';
import type { IApiControllerOptions } from '../types';

import ApiController from './api.controller';

class WebixController extends ApiController<IApiControllerOptions> {
  public async fetchTableItems(): Promise<TWebixTableItemsArray> {
    const { items } = await this.get<IWebixTableResponse>('/table');
    return items;
  }
}

export default WebixController;
