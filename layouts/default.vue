<template>
  <div class="default-layout">
    <main class="default-layout__content">
      <nuxt />
    </main>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
  name: 'DefaultLayout'
});

</script>

<style lang="scss" scoped>
.default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  &__content {
    @include container;
  }
}
</style>
