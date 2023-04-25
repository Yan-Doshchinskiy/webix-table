<template>
  <div class="main-page">
    <h2>Товары в категории</h2>
    <WebixDataTable
      :headers="immutableHeaders"
      :fetch-function="fetchTableItems"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import clone from 'lodash.clonedeep';

import WebixDataTable from '~/components/webix/WebixDataTable.vue';

import { getTableImageCellTemplate } from '~/core/webix/TableImageCell';
import { getTablePositionCellTemplate } from '~/core/webix/TablePositionCell';

import type { IWebixTableHeader } from '~/components/webix/WebixDataTable.vue';
import type { IWebixTableItem, TWebixTableItemsArray } from '~/core/api/types/webix';

interface IData {
  headers: Array<IWebixTableHeader<IWebixTableItem>>
}

export default Vue.extend({
  name: 'IndexPage',
  components: {
    WebixDataTable
  },
  data(): IData {
    return {
      headers: [
        {
          id: 'loosesPercent',
          header: [{ text: 'Упущено %' }],
          fillspace: true
        },
        {
          id: 'positionNumber',
          header: [{ text: 'Позиция' }],
          fillspace: true,
          template: (obj: IWebixTableItem) => getTablePositionCellTemplate(obj.positionNumber || 0, obj.positionNumberChange || 0)
        },
        {
          id: 'image',
          header: [{ text: 'Фото' }],
          fillspace: true,
          template: (obj: IWebixTableItem) => getTableImageCellTemplate(obj.image, obj.productWbId)
        }
      ]
    };
  },
  computed: {
    immutableHeaders(): Array<IWebixTableHeader<IWebixTableItem>> {
      // We should create deep copy, because  webix mutates component props
      return clone(this.headers);
    }
  },
  methods: {
    async fetchTableItems(): Promise<TWebixTableItemsArray> {
      return this.$api.WebixController.fetchTableItems();
    }
  }
});
</script>

<style lang="scss" scoped>
.main-page {
  @include page;
  grid-row-gap: 20px;
}
</style>
