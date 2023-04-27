import Vue from 'vue';

import type { VueConstructor } from 'vue';
import type ModalWindow from '~/mixins/ModalWindow';

export enum MODAL_TYPE {
  tableSettings = 'tableSettings'
}

export type TModalType = typeof MODAL_TYPE[keyof typeof MODAL_TYPE]

export interface IModalHandlers {
  // onSuccess?: <D = any>(data?: D) => void | Promise<void>,
  // onReject?: <E = any>(e?: E) => void | Promise<void>,
  onClose?: () => void | Promise<void>,
}

export interface IModalPropsDefault extends IModalHandlers {
  isUnclosable?: boolean,
}

export interface IModalHandlersPayload extends Record<TModalType, Record<string, any>>{
  [MODAL_TYPE.tableSettings]: { },
}

export interface IModalProps extends Record<TModalType, Record<string, any>>{
  [MODAL_TYPE.tableSettings]: {

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
