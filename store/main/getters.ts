import { MainGetters } from './types';

const getters: MainGetters = {
  isShow: (state) => !!state._modalsArray.length,
  modalsArray: (state) => state._modalsArray,
  getModalData: (state) => (id) => state._modalsArray.find(modal => modal.modalId === id)
};

export default getters;
