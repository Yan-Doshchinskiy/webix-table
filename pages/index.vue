<template>
  <div class="main-page">
    Index page
    <h2>Товары в категории</h2>
    <WebixSlider
      v-model.number="model"
    />
    {{ model }}
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import WebixSlider from '~/components/webix/WebixSlider.vue';

export default Vue.extend({
  name: 'IndexPage',
  components: {
    WebixSlider
  },
  data() {
    return {
      model: 0
    };
  }
});
</script>

<style lang="scss" scoped>
.main-page {
  @include page;

}
</style>
