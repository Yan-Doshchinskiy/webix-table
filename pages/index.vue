<template>
  <div class="main-page">
    <h2 class="main-page__title">
      {{ $tc('tables.main.title') }}
    </h2>
    <div class="main-page__filters">
      <div class="main-page__controls">
        <UiInputSearch
          id="item-table-search"
          v-model="search"
          data-selector="ITEM-TABLE-SEARCH"
          class="main-page__search"
          placeholder="Поиск"
          @input="handleSearch"
          @clear="handleClearSearch"
        />
        <UiCheckbox
          id="favorites-checkbox"
          v-model="favoriteCheckboxModel"
          class="main-page__favorites"
          :option="favoriteCheckboxOptions"
          :disabled="IsLoadingLocal"
          @input="handleCheckFavorites"
        />
      </div>
      <UiButton
        data-selector="OPEN-TABLE-SETTINGS"
        class="main-page__settings"
        variant="secondary"
        @click="handleOpenSettingsModal"
      >
        {{ $tc('buttons.tableSettings') }}
        <template #iconRight>
          <i class="icon-cog" />
        </template>
      </UiButton>
    </div>
    <WebixDataTable
      :listeners="tableListeners"
      :headers="immutableHeaders"
      :table-data="tableData"
    />
  </div>
</template>

<script lang="ts">
import type { VueConstructor } from 'vue';
import Vue from 'vue';
import clone from 'lodash.clonedeep';

import UiButton from '~/components/ui/UiButton.vue';
import UiCheckbox from '~/components/ui/UiCheckbox.vue';
import UiInputSearch from '~/components/ui/UiInputSearch.vue';
import WebixDataTable from '~/components/webix/WebixDataTable.vue';

import Debouncer from '~/mixins/Debouncer';
import LoadingAdditional from '~/mixins/LoadingAdditional';
import ModalControl from '~/mixins/ModalControl';

import { getTableImageCellTemplate } from '~/core/webix/TableImageCell';
import { getTableBadgeCellTemplate } from '~/core/webix/TableBadgeCell';
import { getTableLinkCellTemplate } from '~/core/webix/TableLinkCell';
import { getTableFavoriteCellTemplate } from '~/core/webix/TableFavoritesCell';

import { MODAL_TYPE } from '~/store/types/main';

import type { ICheckboxOptions, TCheckboxOptionsArray } from '~/components/ui/UiCheckbox.vue';
import type { ITableListeners, IWebixTableHeader } from '~/components/webix/WebixDataTable.vue';
import type {
  ITableFetchOptions,
  ITrend,
  IWebixTableItem,
  TTableItemFavorite,
  TWebixTableItemsArray
} from '~/core/api/types/webix';

interface IData {
  headers: Array<IWebixTableHeader<IWebixTableItem>>,
  search: string,
  searchFields: Array<keyof IWebixTableItem>,
  tableData: TWebixTableItemsArray,
  favoriteCheckboxModel: TCheckboxOptionsArray<TTableItemFavorite>,
  favoriteCheckboxOptions: ICheckboxOptions<TTableItemFavorite>
}

const FAVORITE_SELECTOR = 'favorite-icon-click';

type TIndexPage = VueConstructor<Vue & InstanceType<typeof Debouncer> & InstanceType<typeof LoadingAdditional> & InstanceType<typeof ModalControl>>

export default (Vue as TIndexPage).extend({
  name: 'IndexPage',
  components: {
    UiButton,
    UiCheckbox,
    UiInputSearch,
    WebixDataTable
  },
  mixins: [Debouncer, LoadingAdditional, ModalControl],
  data(): IData {
    return {
      headers: [],
      search: '',
      searchFields: ['productWbId', 'name', 'subject', 'supplier'],
      tableData: [],
      favoriteCheckboxModel: [],
      favoriteCheckboxOptions: {
        label: 'Избранное',
        value: 'f'
      }
    };
  },
  computed: {
    fetchOptions(): ITableFetchOptions {
      return {
        searchFields: this.searchFields,
        search: this.search,
        favorites: this.favoriteCheckboxModel.some(({ value }) => value === 'f') ? 'f' : 'n'
      };
    },
    immutableHeaders(): Array<IWebixTableHeader<IWebixTableItem>> {
      // We should create deep copy, because  webix mutates component props
      return clone(this.headers);
    },
    tableListeners(): ITableListeners {
      return {
        onClick: {
          [FAVORITE_SELECTOR]: async ({ isFavorite, productWbId }: IWebixTableItem): Promise<void> => {
            if (this.IsLoadingAdditional || this.IsLoadingLocal) {
              return;
            }
            const method = isFavorite ? this.handleDeleteFavorites : this.handleAddFavorites;
            await method(productWbId);
            await this.fetchTableItems({});
          }
        }
      };
    }
  },
  async mounted() {
    this.initializeHeaders();
    await this.fetchTableItems({});
  },
  methods: {
    async fetchTableItems(options: Partial<ITableFetchOptions>): Promise<void> {
      try {
        this.StartLoadingLocal();
        this.tableData = await this.$api.WebixController.fetchTableItems({
          ...this.fetchOptions,
          ...options
        });
      } catch (e) {
        console.error('fetchTableItems error', e);
      } finally {
        this.FinishLoadingLocal();
      }
    },
    async handleAddFavorites(id: string): Promise<void> {
      try {
        this.StartLoadingAdditional();
        await this.$api.WebixController.addFavorites(id);
      } catch (e) {
        console.error('handleAddFavorites error', e);
      } finally {
        this.FinishLoadingAdditional();
      }
    },
    async handleDeleteFavorites(id: string): Promise<void> {
      try {
        this.StartLoadingAdditional();
        await this.$api.WebixController.deleteFavorites(id);
      } catch (e) {
        console.error('handleAddFavorites error', e);
      } finally {
        this.FinishLoadingAdditional();
      }
    },
    async handleCheckFavorites(): Promise<void> {
      await this.fetchTableItems({});
    },
    async handleSearch(): Promise<void> {
      this.DebounceFunction(this.fetchTableItems.bind(this, {}), 1000);
    },
    async handleClearSearch(): Promise<void> {
      this.search = '';
      await this.fetchTableItems({});
    },
    handleOpenSettingsModal() {
      this.ShowModal({
        key: MODAL_TYPE.tableSettings,
        options: {}
      });
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
          id: 'isFavorite',
          header: [{ text: 'Избранное', css: 'custom-table-header', height: 85 }],
          width: 80,
          template: ({ isFavorite }) => getTableFavoriteCellTemplate(isFavorite, FAVORITE_SELECTOR),
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
    width: max-content;
  }
  &__settings {

  }
}
</style>
