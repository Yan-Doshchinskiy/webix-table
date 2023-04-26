<template>
  <div class="main-page">
    <h2>Товары в категории</h2>
    <div class="main-page__filters">
      <div class="main-page__controls">
        <UiInput
          id="item-table-search"
          v-model="search"
          data-selector="ITEM-TABLE-SEARCH"
          class="main-page__search"
          placeholder="Поиск"
        >
          <template #iconRight>
            <i v-if="!search" class="icon-search" />
            <i v-else class="icon-close" @click="handleClearSearch" />
          </template>
        </UiInput>
        <div class="main-page__favorites">
          Mock
        </div>
      </div>
      <div class="main-page__settings">
        Mock
      </div>
    </div>
    <WebixDataTable
      :search="search"
      :search-fields="searchFields"
      :headers="immutableHeaders"
      :fetch-function="fetchTableItems"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import clone from 'lodash.clonedeep';

import WebixDataTable from '~/components/webix/WebixDataTable.vue';
import UiInput from '~/components/ui/UiInput.vue';

import { getTableImageCellTemplate } from '~/core/webix/TableImageCell';
import { getTableBadgeCellTemplate } from '~/core/webix/TableBadgeCell';
import { getTableLinkCellTemplate } from '~/core/webix/TableLinkCell';

import type { IWebixTableHeader } from '~/components/webix/WebixDataTable.vue';
import type { IWebixTableItem, TWebixTableItemsArray, ITrend } from '~/core/api/types/webix';

interface IData {
  headers: Array<IWebixTableHeader<IWebixTableItem>>,
  search: string,
  searchFields: Array<keyof IWebixTableItem>
}

export default Vue.extend({
  name: 'IndexPage',
  components: {
    WebixDataTable,
    UiInput
  },
  data(): IData {
    return {
      headers: [],
      search: '',
      searchFields: ['productWbId', 'name', 'subject', 'supplier']
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
    handleClearSearch(): void {
      this.search = '';
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
          tooltip: ({ name }) => name,
          sort: 'string'
        },
        {
          id: 'supplier',
          header: [{ text: 'Поставщик', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ supplier, wbOrgNameId }) => getTableLinkCellTemplate(supplier, `/suppliers/${wbOrgNameId}`),
          tooltip: ({ supplier }) => supplier,
          sort: 'string'
        },
        {
          id: 'productWbId',
          header: [{ text: 'Артикул WB', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ productWbId }) => productWbId,
          sort: 'int'
        },
        {
          id: 'positionNumber',
          header: [{ text: 'Позиция', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ positionNumber, positionNumberChange }) => getTableBadgeCellTemplate(positionNumber || 0, positionNumberChange || 0),
          tooltip: ({ positionNumber }) => positionNumber || 0,
          sort: 'int'
        },
        {
          id: 'subject',
          header: [{ text: 'Категория', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ subject, subjectId }) => getTableLinkCellTemplate(subject, `/categories/${subjectId}`),
          tooltip: ({ subject }) => subject,
          sort: 'string'
        },
        {
          id: 'trend',
          header: [{ text: 'Тренд', css: 'custom-table-header', height: 85 }],
          width: 250,
          // webix available on client side only
          template: (cell, common, value, header, index): string => {
            const formattedTrend = (value as Array<ITrend>).map(({ orders }) => orders);
            // @ts-ignore
            return this.$webix?.Sparklines.getTemplate({ // TODO update types if it possible
              type: 'bar',
              color: '#1f73ed'
            })(cell, common, formattedTrend, header, index);
          },
          tooltip: (it, common, value: ITrend): string => {
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
          tooltip: ({ orders }) => orders,
          sort: 'int'
        },
        {
          id: 'ordersSum',
          header: [{ text: 'Выручка, ₽', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ orders }) => orders,
          sort: 'int'
        },
        {
          id: 'loosesPercent',
          header: [{ text: 'Потери %', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ loosesPercent }) => loosesPercent,
          sort: 'int'
        },

        {
          id: 'lastRemains',
          header: [{ text: 'Остатки, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastRemains }) => lastRemains,
          sort: 'int'
        },
        {
          id: 'lastPrice',
          header: [{ text: 'Цена, ₽', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastPrice }) => lastPrice,
          sort: 'int'
        },
        {
          id: 'lastDiscountPercent',
          header: [{ text: 'Скидка, %', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastDiscountPercent }) => lastDiscountPercent,
          sort: 'int'
        },
        {
          id: 'positionRating',
          header: [{ text: 'Рейтинг', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ positionRating }) => positionRating,
          sort: 'int'
        },
        {
          id: 'reviewsRating',
          header: [{ text: 'Рейтинг по отзывам', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ reviewsRating }) => reviewsRating,
          sort: 'int'
        },
        {
          id: 'reviewsCount',
          header: [{ text: 'Отзывы, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ reviewsCount }) => reviewsCount,
          sort: 'int'
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
  &__title {

  }
  &__filters {
    display: grid;
    grid-template-columns: 1fr max-content;
    justify-content: space-between;
    align-items: center;
  }
  &__controls {
    display: flex;
    align-items: center;
    grid-column-gap: 12px;
  }

  &__search {
    max-width: 400px;
  }
  &__favorites {

  }
  &__settings {

  }
}
</style>
