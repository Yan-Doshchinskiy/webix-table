<template>
  <div class="default-layout">
    <main class="default-layout__content">
      <nuxt />
    </main>
    <ModalContainer />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import ModalContainer from '~/components/modals/ModalContainer/index.vue';

export default Vue.extend({
  name: 'DefaultLayout',
  components: {
    ModalContainer
  }
});

</script>

<style lang="scss" scoped>
.default-layout {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  &__content {
    @include container(20px);
  }
}
</style>
