<template>
  <UiInput
    v-bind="$props"
    @input="emitInput"
  >
    <template #iconRight>
      <i v-if="!value" class="icon-search search-input-icon" />
      <i v-else class="icon-close search-input-icon" @click="emitClear" />
    </template>
  </UiInput>
</template>

<script lang="ts">

import UiInput from '~/components/ui/UiInput.vue';

export default UiInput.extend({
  name: 'UiInputSearch',
  components: {
    UiInput
  },
  methods: {
    emitInput(value: string): void {
      this.$emit('input', value);
    },
    emitClear(): void {
      this.$emit('clear');
    }

  }
});
</script>
<style lang="scss" scoped>
.search-input-icon {
  display: flex;
  align-items: center;
  &:before {
    font-size: 12px;
  }
}
</style>
