import Vue from 'vue';
import { mapActions } from 'vuex';

import type { IModalOptions, MODAL_TYPE } from '~/store/types/main';

export default Vue.extend({
  name: 'ModalControl',
  computed: {
    IsModalShown(): boolean {
      return this.$store.getters['main/isShow'];
    }
  },
  methods: {
    ...mapActions({
      showNewModal: 'main/showNewModal',
      showCoverModala: 'main/showCoverModal',
      hideModal: 'main/hideModal'
    }),
    ShowModal<K extends MODAL_TYPE>(payload: IModalOptions<K>): void {
      this.showNewModal(payload);
    },
    ShowCoverModal<K extends MODAL_TYPE>(payload: IModalOptions<K>): void {
      this.showCoverModala(payload);
    },
    async CloseModal(id?: number): Promise<void> {
      await this.hideModal(id);
    }
  }
});
