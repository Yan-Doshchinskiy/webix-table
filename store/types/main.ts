import Vue from 'vue';

import type ModalWindow from '~/mixins/ModalWindow';
import type { VueConstructor } from 'vue';
import type { TCheckboxOptionsArray } from '~/components/ui/UiCheckbox.vue';
import type { IWebixTableItem } from '~/core/api/types/webix';
import type { IColumnsDifference } from '~/components/modals/TableSettings.vue';

export enum MODAL_TYPE {
  tableSettings = 'tableSettings'
}

export interface IModalHandlers {
  // onSuccess?: <D = any>(data?: D) => void | Promise<void>,
  // onReject?: <E = any>(e?: E) => void | Promise<void>,
  onClose?: () => void | Promise<void>,
}

export interface IModalPropsDefault extends IModalHandlers {
  isUnclosable?: boolean,
}

export interface IModalHandlersPayload extends Record<MODAL_TYPE, Record<string, any>>{
  [MODAL_TYPE.tableSettings]: IColumnsDifference,
}

export interface IModalProps extends Record<MODAL_TYPE, Record<string, any>>{
  [MODAL_TYPE.tableSettings]: {
    checkboxes: TCheckboxOptionsArray<keyof IWebixTableItem>,
    hiddenHeaders: Array<keyof IWebixTableItem>,
    handler: (difference: IModalHandlersPayload[MODAL_TYPE.tableSettings]) => Promise<void> | void
    resetHandler: () => Promise<void> | void
  }
}

export interface IModalOptions<K extends MODAL_TYPE> extends IModalPropsDefault {
  key: K,
  options: IModalProps[K],
}

export interface IStoreModalOptions<K extends MODAL_TYPE> extends IModalOptions<K> {
  modalId: number,
}

export type TModalWindowVue = VueConstructor<Vue & InstanceType<typeof ModalWindow>>
