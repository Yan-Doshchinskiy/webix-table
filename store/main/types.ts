import type { ActionContext } from 'vuex';
import type { MODAL_TYPE, IModalOptions, IStoreModalOptions } from '~/store/types/main';

export enum MainMutationTypes {
  addNewModal = 'addNewModal',
  closeModal = 'closeModal',
}

export interface MainState {
  _modalsArray: Array<IStoreModalOptions<MODAL_TYPE>>,
}

export interface MainGetters<S = MainState> {
  isShow(state: S): boolean,
  modalsArray(state: S): Array<IStoreModalOptions<MODAL_TYPE>>,
  getModalData(state: S): (id: number) => IStoreModalOptions<MODAL_TYPE> | undefined,
}

export interface MainMutations<S = MainState> {
  [MainMutationTypes.addNewModal]<K extends MODAL_TYPE>(state: S, options: IModalOptions<K>): void,
  [MainMutationTypes.closeModal](state: S, id?: number): void,
}

export type MainAugmentedActionContext = {
  commit<K extends keyof MainMutations>(
    key: K,
    payload: Parameters<MainMutations[K]>[1]
  ): ReturnType<MainMutations[K]>
} & Omit<ActionContext<MainState, MainState>, 'commit'>

export interface MainActions<AC = MainAugmentedActionContext> {
  showNewModal<K extends MODAL_TYPE>(context: AC, payload: IModalOptions<K>): void,
  showCoverModal<K extends MODAL_TYPE>(context: AC, payload: IModalOptions<K>): void,
  hideModal(context: AC, id?: number): void,
  hideLastModal(context: AC): void,
}
