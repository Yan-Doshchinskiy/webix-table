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
import { getTableBadgeCellTemplate } from '~/core/webix/TableBadgeCell';
import { getTableLinkCellTemplate } from '~/core/webix/TableLinkCell';

import type { IWebixTableHeader } from '~/components/webix/WebixDataTable.vue';
import type { IWebixTableItem, TWebixTableItemsArray, ITrend } from '~/core/api/types/webix';

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
      headers: []
    };
  },
  computed: {
    immutableHeaders(): Array<IWebixTableHeader<IWebixTableItem>> {
      // We should create deep copy, because  webix mutates component props
      return clone(this.headers);
    }

  },
  mounted() {
    this.initializeHeaders();
  },
  methods: {
    async fetchTableItems(): Promise<TWebixTableItemsArray> {
      return this.$api.WebixController.fetchTableItems();
    },
    initializeHeaders(): void {
      this.headers = [
        {
          id: 'image',
          header: [{ text: 'Фото', css: 'custom-table-header', height: 85 }],
          width: 80,
          template: ({ image, productWbId }) => getTableImageCellTemplate(image, productWbId),
          tooltip: false
        },
        {
          id: 'name',
          header: [{ text: 'Товар', css: 'custom-table-header', height: 85 }],
          width: 200,
          template: ({ name, productWbId }) => getTableLinkCellTemplate(name, `/products/${productWbId}`),
          tooltip: ({ name }) => name
        },
        {
          id: 'supplier',
          header: [{ text: 'Поставщик', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ supplier, wbOrgNameId }) => getTableLinkCellTemplate(supplier, `/suppliers/${wbOrgNameId}`),
          tooltip: ({ supplier }) => supplier
        },
        {
          id: 'productWbId',
          header: [{ text: 'Артикул WB', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ productWbId }) => productWbId
        },
        {
          id: 'positionNumber',
          header: [{ text: 'Позиция', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ positionNumber, positionNumberChange }) => getTableBadgeCellTemplate(positionNumber || 0, positionNumberChange || 0),
          tooltip: ({ positionNumber }) => positionNumber || 0
        },
        {
          id: 'subject',
          header: [{ text: 'Категория', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ subject, subjectId }) => getTableLinkCellTemplate(subject, `/categories/${subjectId}`),
          tooltip: ({ subject }) => subject
        },
        {
          id: 'trend',
          header: [{ text: 'Тренд', css: 'custom-table-header', height: 85 }],
          width: 250,
          axis: {
            start: false
          },
          // webix available on client side only
          template: (cell, common, value: Array<ITrend>, header, index) => {
            const formattedTrend = value.map(({ orders }) => orders);
            return this.$webix?.Sparklines.getTemplate({
              type: 'bar',
              color: '#1f73ed',
              axis: {
                start: false
              }
            })(cell, common, formattedTrend, header, index);
          },
          tooltip: (it, common, value: ITrend) => {
            if (!value) {
              return '';
            }
            const initialDate = new Date(value.date);
            const date = this.$webix?.Date.dateToStr('%d %M %Y', false)(initialDate) || '';
            return `${date} <br /> ${value.orders} шт`;
          }
        },
        {
          id: 'orders',
          header: [{ text: 'Заказы, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ orders }) => orders
        },
        {
          id: 'ordersSum',
          header: [{ text: 'Выручка, ₽', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ orders }) => orders
        },
        {
          id: 'loosesPercent',
          header: [{ text: 'Потери %', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ loosesPercent }) => loosesPercent
        },

        {
          id: 'lastRemains',
          header: [{ text: 'Остатки, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastRemains }) => lastRemains
        },
        {
          id: 'lastPrice',
          header: [{ text: 'Цена, ₽', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastPrice }) => lastPrice
        },
        {
          id: 'lastDiscountPercent',
          header: [{ text: 'Скидка, %', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastDiscountPercent }) => lastDiscountPercent
        },
        {
          id: 'positionRating',
          header: [{ text: 'Рейтинг', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ positionRating }) => positionRating
        },
        {
          id: 'reviewsRating',
          header: [{ text: 'Рейтинг по отзывам', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ reviewsRating }) => reviewsRating
        },
        {
          id: 'reviewsCount',
          header: [{ text: 'Отзывы, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ reviewsCount }) => reviewsCount
        }
      ];
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
