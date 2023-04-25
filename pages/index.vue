<template>
  <div class="main-page">
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
import { TWebixTableItemsArray } from '~/core/api/types/webix';

interface IData {
  model: number,
  webixTableItems: TWebixTableItemsArray
}

export default Vue.extend({
  name: 'IndexPage',
  components: {
    WebixSlider
  },
  data(): IData {
    return {
      model: 0,
      webixTableItems: []
    };
  },
  async mounted() {
    await this.fetchTableData();
  },
  methods: {
    async fetchTableData(): Promise<void> {
      try {
        this.webixTableItems = await this.$api.WebixController.fetchTableItems();
      } catch (e) {
        console.error('fetchTableData', e);
      }
    }
  }
});
</script>

<style lang="scss" scoped>
.main-page {
  @include page;

}
</style>
