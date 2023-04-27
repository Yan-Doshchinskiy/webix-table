import { MainMutationTypes } from './types';
import type { MainActions } from './types';

const actions: MainActions = {
  showNewModal({ commit }, payload) {
    commit(MainMutationTypes.closeModal, undefined);
    commit(MainMutationTypes.addNewModal, payload);
  },
  showCoverModal({ commit }, payload) {
    commit(MainMutationTypes.addNewModal, payload);
  },
  async hideModal({ commit, getters }, id) {
    const modal = getters.getModalData(id);
    try {
      if (!modal) {
        while (getters.modalsArray.length) {
          const [currentModal] = getters.modalsArray;
          if (currentModal.onClose) {
            await currentModal.onClose();
          }
          commit(MainMutationTypes.closeModal, currentModal.modalId);
        }
      } else {
        if (modal?.onClose) {
          await modal.onClose();
        }
        commit(MainMutationTypes.closeModal, modal.modalId);
      }
    } catch (e) {
      console.error('CloseModal error', e);
    }
  },
  async hideLastModal({ getters }) {
    const modal = getters.modalsArray.at(-1);
    if (modal) {
      await this.hideModal(modal.modalId);
    }
  }
};

export default actions;
