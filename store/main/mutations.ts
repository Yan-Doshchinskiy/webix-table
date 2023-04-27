import initialState from '~/store/main/state';
import { MainMutationTypes } from './types';

import type { MainMutations } from './types';

const mutations: MainMutations = {
  [MainMutationTypes.addNewModal](state, options) {
    const biggestId = state._modalsArray.reduce((acc, { modalId }) => (modalId > acc ? modalId : acc), 0);
    const payload = {
      modalId: biggestId + 1,
      ...options
    };
    state._modalsArray.push(payload);
  },
  [MainMutationTypes.closeModal](state, id) {
    const isIdExist = typeof id !== 'undefined';
    // eslint-disable-next-line no-param-reassign
    state._modalsArray = isIdExist
      ? state._modalsArray.filter(({ modalId }) => modalId !== id)
      : initialState()._modalsArray;
  }
};

export default mutations;
