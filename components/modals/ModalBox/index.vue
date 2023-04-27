<template>
  <div
    class="modal-box"
    :class="modalClass"
    :data-selector="`MODAL-${dataSelector}`"
  >
    <div
      v-if="isHeadVisible"
      class="modal-box__header"
    >
      <h3
        v-if="title"
        class="modal-box__title"
      >
        {{ title }}
      </h3>
      <i
        v-if="isCloseIconVisible"
        class="modal-box__close icon-close"
        @click="handleClickClose"
      />
    </div>
    <div class="modal-box__content">
      <slot name="content" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';
// @ts-ignore
import ClickOutside from 'vue-click-outside';

import { TComputedStyle } from '~/types/ui';

type TModalSize = 'large' | 'small'

export default Vue.extend({
  name: 'ModalBox',
  directives: {
    ClickOutside
  },
  props: {
    dataSelector: {
      type: String,
      required: true
    },
    isUnclosable: {
      type: Boolean,
      default: false
    },
    hasCloseIcon: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },
    size: {
      type: String as PropType<TModalSize>,
      default: 'large'
    }
  },
  computed: {
    modalClass(): TComputedStyle {
      const { size } = this;

      return [
        { 'modal-box_small': size === 'small' },
        { 'modal-box_headless': !this.isHeadVisible }
      ];
    },
    isCloseIconVisible(): boolean {
      return !this.isUnclosable && this.hasCloseIcon;
    },
    isHeadVisible(): boolean {
      return Boolean(this.title) || this.isCloseIconVisible;
    }
  },
  methods: {
    handleClickClose(): void {
      this.$emit('close');
    }
  }

});
</script>

<style lang="scss" scoped>
.modal-box {
  background-color: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  &_small {
    max-width: 384px;
    width: 100%;
    .modal-box__header {
      text-align: center;
    }
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 32px;
  }

  &__title {
    font-weight: 700;
    font-size: 20px;
    line-height: 20px;
    color: $main-black;
    text-transform: capitalize;
  }

  &__close {
    font-size: 14px;
    cursor: pointer;
  }

  @include _576 {
    height: max-content;
    min-height: 100%;
    max-height: 100%;
    max-width: 100%;

    border-radius: unset;
    overflow-y: auto;
    padding: 32px 16px;
    display: grid;
    grid-template-rows: max-content 1fr;

    &_headless {
      grid-template-rows: 1fr;
    }

    &__header {
      display: grid;
      grid-template-columns: auto 24px;
      column-gap: 12px;
    }

    &__content {
      width: 100%;

      display: flex;
      flex-grow: 1;
    }

  }
}
</style>
