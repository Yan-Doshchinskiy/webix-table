<template>
  <div
    class="ui-input"
    :class="{ 'ui-input_disabled': disabled }"
  >
    <label
      v-if="label"
      class="ui-input__label"
    >
      {{ label }}
    </label>
    <div class="ui-input__wrap">
      <input
        :ref="`ref-${id}`"
        :value="value"
        :placeholder="placeholder"
        :disabled="disabled"
        type="text"
        :data-selector="`ACTION-${dataSelector}`"
        class="ui-input__input"
        :class="{
          'ui-input__input_pr': $slots.iconRight,
        }"
        @input="input"
      >

      <div
        v-if="$slots.iconRight"
        class="ui-input__icon"
        @click="focusIn"
      >
        <slot name="iconRight" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'BaseInput',

  props: {
    value: {
      type: [String, Number],
      required: true
    },
    id: {
      type: String,
      required: true
    },
    label: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'text'
    },
    dataSelector: {
      type: String,
      required: true
    }
  },

  methods: {
    input({ target }: { target: HTMLInputElement }): void {
      const { value } = target;
      this.$emit('input', value);
    },

    focusIn(): void {
      const input = this.$refs[`ref-${this.id}`] as HTMLInputElement;
      input.focus();
    }
  }
});
</script>

<style lang="scss" scoped>
.ui-input {
  width: 100%;
  &_disabled {
    pointer-events: none;
    ::v-deep.ui-input__icon {
      & > i {
        &::before {
          color: $gray-600;
        }
      }
    }
  }
  &__label {
    font-size: 16px;
    line-height: 24px;
    margin-bottom: 8px;
    color: $main-black;
  }

  &__wrap {
    position: relative;
  }

  &__input {
    width: 100%;
    border-radius: 12px;
    padding: 8px 12px;
    font-size: 20px;
    line-height: 28px;
    color: $gray-600;
    background: transparent;
    border: 2px solid $gray-200;
    transition: $transition;
    &::placeholder {
      font-weight: 400;
      color: $gray-200;
      transition: $transition;
    }
    &:hover {
      border-color: $gray-600;
      &::placeholder {
        color: $gray-200;
      }
    }
    &:focus {
      border-color: $main-black;
      color: $main-black;
      &::placeholder {
        color: $gray-200;
      }
    }

    &:disabled {
      background-color: $gray-200;
      border-color: $gray-200;
      &::placeholder {
        color: $gray-600;
      }
    }
    &_pr {
      padding-right: 46px;
    }

  }

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    cursor: pointer;
    height: 100%;
    top: 0;
    right: 14px;
    ::v-deep & > i {
      &::before {
        color: $main-black;
      }
    }
  }

}
</style>
