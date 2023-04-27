<template>
  <UiInput
    v-bind="$props"
    @input="emitInput"
  >
    <template #iconRight>
      <i v-if="!value" class="icon-search" />
      <i v-else class="icon-close" @click="emitClear" />
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
