<template>
  <modal-box
    data-selector="TABLE-SETTINGS-MODAL"
    :is-unclosable="modal.isUnclosable"
    :title="$tc('modals.tableSettings.title')"
    size="small"
    @close="CloseCurrentModal"
  >
    <template #content>
      WALLET SETTINGS MODAL
    </template>
  </modal-box>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import ModalWindow from '~/mixins/ModalWindow';

import { MODAL_TYPE, TModalWindowVue } from '~/store/types/main';
import type { IStoreModalOptions } from '~/store/types/main';

export default (Vue as TModalWindowVue).extend({
  name: 'TableSettings',
  components: {

  },
  mixins: [ModalWindow],
  props: {
    modal: {
      type: Object as PropType<IStoreModalOptions<MODAL_TYPE.tableSettings>>,
      required: true
    }
  },
  mounted() {
    console.log(this.modal);
  }

});
</script>

<style scoped lang="scss">
.debit-modal {

}
</style>
