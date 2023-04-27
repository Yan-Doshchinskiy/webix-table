import type { TWebixTableItemsArray, ITableFetchOptions } from '~/core/api/types/webix';
import type { IApiControllerOptions } from '../types';

import ApiController from './api.controller';

interface IFavrotesRequest {
  productId: string
}

class WebixController extends ApiController<IApiControllerOptions> {
  public async fetchTableItems(payload: ITableFetchOptions): Promise<TWebixTableItemsArray> {
    return this.get<TWebixTableItemsArray>('/table', {
      params: payload
    });
  }

  public async addFavorites(productId: string): Promise<void> {
    await this.post<{}, IFavrotesRequest>('/table/favorites', {
      productId
    });
  }

  public async deleteFavorites(productId: string): Promise<void> {
    await this.delete('/table/favorites', {
      params: {
        productId
      }
    });
  }
}

export default WebixController;
