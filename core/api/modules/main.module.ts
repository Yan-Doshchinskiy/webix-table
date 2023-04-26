import ApiModule from './api.module';
import WebixController from '../controllers/webix.controller';

import type { IApiModuleOptions } from '../types';

export interface IMainControllers {
  WebixController: WebixController,
}

interface IMainModuleOptions extends IApiModuleOptions {

}

enum CONTROLLER_URL {
  MAIN_WEBIX = '/webix',
}

class MainModule extends ApiModule<IMainControllers, IMainModuleOptions> {
  constructor(baseURL: string, options: IMainModuleOptions) {
    super(baseURL, options, { });

    this.controllers = {
      WebixController: new WebixController(this.apiClient, {
        controllerUrl: CONTROLLER_URL.MAIN_WEBIX
      })
    };
  }
}

export default MainModule;
