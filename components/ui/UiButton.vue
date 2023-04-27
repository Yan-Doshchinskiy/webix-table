<template>
  <button
    :data-selector="`ACTION-${dataSelector}`"
    :disabled="disabled"
    :class="`ui-button ui-button_${variant} ui-button_${size}`"
    :type="type"
    @click="$emit('click')"
    @submit="$emit('submit')"
  >
    <div
      v-if="$slots.iconLeft"
      class="ui-button__icon"
    >
      <slot name="iconLeft" />
    </div>
    <slot class="ui-button__content" />
    <div
      v-if="$slots.iconRight"
      class="ui-button__icon"
    >
      <slot name="iconRight" />
    </div>
  </button>
</template>

<script lang="ts">
import Vue from 'vue';

import type { PropType } from 'vue';

type TButtonVariant = 'primary' | 'secondary'
type TButtonSize = 'big' | 'regular' | 'small'

export default Vue.extend({
  name: 'UiButton',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    variant: {
      type: String as PropType<TButtonVariant>,
      default: 'primary'
    },
    size: {
      type: String as PropType<TButtonSize>,
      default: 'regular'
    },
    type: {
      type: String,
      default: 'button'
    },
    dataSelector: {
      type: String,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
.ui-button {
  position: relative;
  width: 100%;
  border-radius: 8px;
  font-weight: 500;
  overflow: hidden;
  transition: $transition;
  display: flex;
  justify-content: center;
  align-items: center;
  grid-column-gap: 6px;
  white-space: nowrap;
  border: 2px solid transparent;
  &_primary {
    color: $main-white;
    background: $main-black;
    &:hover {
      background: $gray-700;
    }
    &:active {
      background: $gray-800;
    }
  }
  &_secondary {
    color: $main-black;
    background: transparent;
    border: 2px solid $main-black;
    &:hover {
      background: $gray-100;
      border: 2px solid $gray-600;
    }
    &:active {
      background: $gray-200;
    }
  }
  &:disabled {
    color:  $gray-600;
    background: $gray-200;
    border-color:  $gray-200;
    &:hover {
      cursor: default;
    }
  }
  &_regular {
    padding: 5px 10px;
    font-size: 14px;
    line-height: 18px;
  }
  &_big {
    padding: 8px 20px;
    font-size: 16px;
    line-height: 20px;
  }
  &_small {
    padding: 5px 10px;
    min-width: 48px;
    font-size: 12px;
    line-height: 12px;
    font-weight: 400;
    border-radius: 4px;
  }
  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
  }
  &__icon {
    display: flex;
    align-items: center;
  }

}
</style>
