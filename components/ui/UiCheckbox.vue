<template>
  <label
    class="checkbox"
    :for="id"
  >
    <input
      :id="id"
      :disabled="disabled"
      :value="option.value"
      type="checkbox"
      class="checkbox__input"
      hidden
      :checked="isChecked"
      @input="handleInput"
    >
    <span :class="checkboxStyle">
      <i v-if="isChecked" class="checkbox__icon icon-checkmark" />
    </span>
    <span
      v-if="option.label"
      class="checkbox__label"
    >
      {{ option.label }}
    </span>
  </label>
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';
import type { TComputedStyle } from '~/types/ui';

export interface ICheckboxOptions<V = string> {
  value: V,
  label: string
}

export type TCheckboxOptionsArray<V = string> = Array<ICheckboxOptions<V>>

export default Vue.extend({
  name: 'BaseCheckbox',
  props: {
    id: {
      type: String,
      required: true
    },
    option: {
      type: Object as PropType<ICheckboxOptions>,
      required: true
    },
    value: {
      type: Array as PropType<TCheckboxOptionsArray>,
      required: true
    },
    multiple: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    isChecked():boolean {
      return this.value.some((it: ICheckboxOptions) => this.option.value === it.value);
    },
    checkboxStyle(): TComputedStyle {
      return [
        'checkbox__custom',
        {
          checkbox__custom_disabled: this.disabled
        }];
    }
  },
  methods: {
    handleInput():void {
      if (this.multiple) {
        const result = !this.isChecked
          ? [...this.value, this.option]
          : this.value.filter((it: ICheckboxOptions) => it.value !== this.option.value);
        this.$emit('input', result);
      } else {
        const result = !this.isChecked ? [this.option] : [];
        this.$emit('input', result);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.checkbox {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 7px 12px;
  cursor: pointer;
  grid-column-gap: 12px;
  &:hover {
    .checkbox__custom {
      background-color: $gray-100;
    }
  }
  &__label {
    font-size: 16px;
    line-height: 20px;
  }
  &__input {

  }

  &__custom {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 14px;
    min-width: 14px;
    border-radius: 4px;
    border: 2px solid $main-black;
    transition: $transition;

    &_disabled {
      background-color: $gray-100;
      border: 2px solid $gray-600;
    }
  }

  &__icon {
    display: flex;

    &:before {
      font-size: 8px;
    }
  }

}
</style>
