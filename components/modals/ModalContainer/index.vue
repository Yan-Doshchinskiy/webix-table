<template>
  <transition name="fade">
    <div
      v-if="isShow"
      class="base-modal"
    >
      <div
        v-for="modal in modalsArray"
        :key="modal.modalId"
        :class="getSingleModalStyle(modal)"
        @mousedown.self="handleCloseModal(modal)"
      >
        <component
          :is="modal.key"
          :key="modal.key"
          :modal="modal"
          @loading="ChangeLoadingStatusLocal"
          @close="handleCloseModal(modal)"
        />
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import Vue from 'vue';

import TableSettings from '~/components/modals/TableSettings.vue';

import LoadingLocal from '~/mixins/LoadingLocal';
import DocumentStyleControl from '~/mixins/DocumentStyleControl';

import { MODAL_TYPE } from '~/store/types/main';
import { KEYBOARD_CODE } from '~/types/ui';

import type { VueConstructor } from 'vue';
import type { TComputedStyle } from '~/types/ui';
import type { IStoreModalOptions } from '~/store/types/main';

type TModalContainer = VueConstructor<Vue & InstanceType<typeof DocumentStyleControl> & InstanceType<typeof LoadingLocal>>

export default (Vue as TModalContainer).extend({
  name: 'ModalContainer',
  components: {
    [MODAL_TYPE.tableSettings]: TableSettings
  },
  mixins: [DocumentStyleControl, LoadingLocal],
  computed: {
    modalsArray(): Array<IStoreModalOptions<MODAL_TYPE>> {
      return this.$store.getters['main/modalsArray'];
    },
    isShow(): boolean {
      return this.$store.getters['main/isShow'];
    }
  },
  watch: {
    modalsArray: {
      handler(value: Array<IStoreModalOptions<MODAL_TYPE>>):void {
        this.ToggleBodyScroll(!value.length);
        this.FinishLoadingLocal();
      }
    }
  },

  mounted(): void {
    document.addEventListener('keydown', this.handleKeydownEscape);
  },

  beforeDestroy(): void {
    document.removeEventListener('keydown', this.handleKeydownEscape);
  },
  methods: {
    getSingleModalStyle(modal: IStoreModalOptions<MODAL_TYPE>): TComputedStyle {
      const isLastModal = this.modalsArray[this.modalsArray.length - 1] === modal;
      return [
        'base-modal__single',
        {
          'base-modal__single_hidden': !isLastModal
        }
      ];
    },
    handleCloseModal(modal: IStoreModalOptions<MODAL_TYPE>): void {
      if (!modal.isUnclosable && !this.IsLoadingLocal) {
        this.$store.dispatch('main/hideModal', modal.modalId);
      }
    },
    handleKeydownEscape(e: KeyboardEvent): void {
      if (e.code === KEYBOARD_CODE.Escape) {
        this.$store.dispatch('main/hideLastModal');
      }
    }
  }

});
</script>

<style lang="scss" scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity ease-out 250ms;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.base-modal {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100%;
  z-index: 100;

  &__single {
    position: absolute;
    width: 100vw;
    height: 100%;
    max-height: 100vh;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(#000000, .9);
    padding: 20px 0;
    margin: auto;
    overflow: auto;
    &_hidden {
      visibility: hidden;
    }
  }
}

@include _576 {
  .base-modal {
    padding: 0;

    &__single {
      padding: 0;
      align-items: flex-start;
    }
  }
}
</style>
