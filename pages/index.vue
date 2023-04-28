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
      :ref="TABLE_REF_KEY"
      :listeners="tableListeners"
      :headers="headers"
      :table-data="tableData"
      :config="tableConfig"
      @column-visibility="syncHeaderVisibility"
      @column-sort="handleSortTable"
      @reset-table="syncTableReset"
    />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiCheckbox from '~/components/ui/UiCheckbox.vue';
import UiInputSearch from '~/components/ui/UiInputSearch.vue';
import WebixDataTable, { TTableSortDirection } from '~/components/webix/WebixDataTable.vue';

import Debouncer from '~/mixins/Debouncer';
import LoadingAdditional from '~/mixins/LoadingAdditional';
import ModalControl from '~/mixins/ModalControl';

import { getTableImageCellTemplate } from '~/core/webix/TableImageCell';
import { getTableBadgeCellTemplate } from '~/core/webix/TableBadgeCell';
import { getTableLinkCellTemplate } from '~/core/webix/TableLinkCell';
import { getTableFavoriteCellTemplate } from '~/core/webix/TableFavoritesCell';

import { MODAL_TYPE } from '~/store/types/main';

import type { VueConstructor } from 'vue';
import type {
  TTableConfigProps,
  ITableListeners,
  IWebixTableHeader,
  TTableElementVisibility
} from '~/components/webix/WebixDataTable.vue';
import type { ICheckboxOptions, TCheckboxOptionsArray } from '~/components/ui/UiCheckbox.vue';
import type {
  ITableFetchOptions,
  ITrend,
  IWebixTableItem,
  TTableItemFavorite,
  TWebixTableItemsArray
} from '~/core/api/types/webix';

const TABLE_REF_KEY = 'items-table-component';

interface IData {
  tableConfig: TTableConfigProps
  headers: Array<IWebixTableHeader<IWebixTableItem>>,
  search: string,
  searchFields: Array<keyof IWebixTableItem>,
  tableData: TWebixTableItemsArray,
  favoriteCheckboxModel: TCheckboxOptionsArray<TTableItemFavorite>,
  favoriteCheckboxOptions: ICheckboxOptions<TTableItemFavorite>,
  TABLE_REF_KEY: typeof TABLE_REF_KEY,
  hiddenHeaders: Array<keyof IWebixTableItem>,
  sortField: keyof IWebixTableItem,
  sortDirection: TTableSortDirection
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
      tableConfig: {
        tooltip: true,
        dragColumn: true,
        resizeColumn: true,
        css: 'custom-items-table'
      },
      headers: [],
      search: '',
      searchFields: ['productWbId', 'name', 'subject', 'supplier'],
      tableData: [],
      favoriteCheckboxModel: [],
      favoriteCheckboxOptions: {
        label: 'Избранное',
        value: 'f'
      },
      TABLE_REF_KEY,
      hiddenHeaders: [],
      sortField: 'positionNumber',
      sortDirection: 'asc'
    };
  },
  computed: {
    fetchOptions(): ITableFetchOptions {
      return {
        searchFields: this.searchFields,
        search: this.search,
        favorites: this.favoriteCheckboxModel.some(({ value }) => value === 'f') ? 'f' : 'n',
        sortField: this.sortField,
        sortDirection: this.sortDirection
      };
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
    },
    columnCheckboxes(): TCheckboxOptionsArray<keyof IWebixTableItem> {
      return this.headers.reduce((
        acc: TCheckboxOptionsArray<keyof IWebixTableItem>,
        { id, header }
      ): TCheckboxOptionsArray<keyof IWebixTableItem> => {
        const item: ICheckboxOptions<keyof IWebixTableItem> = {
          label: header[0]?.text || '',
          value: id
        };
        acc.push(item);
        return acc;
      }, []);
    }
  },
  async mounted() {
    this.initializeHeaders();
    await this.fetchTableItems({});
  },
  methods: {
    async fetchTableItems(options: Partial<ITableFetchOptions>): Promise<void> {
      const ref = this.$refs[TABLE_REF_KEY];
      try {
        // @ts-ignore // TODO add ref types
        ref.switchTableLoading('loading');
        this.StartLoadingLocal();
        this.tableData = await this.$api.WebixController.fetchTableItems({
          ...this.fetchOptions,
          ...options
        });
      } catch (e) {
        console.error('fetchTableItems error', e);
      } finally {
        this.FinishLoadingLocal();
        // @ts-ignore // TODO add ref types
        ref.switchTableLoading('none');
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
    async handleSortTable(key: keyof IWebixTableItem, direction: TTableSortDirection): Promise<void> {
      this.sortField = key;
      this.sortDirection = direction;
      await this.fetchTableItems({ // TODO add sorting lock logic during fetching
        sortField: key,
        sortDirection: direction
      });
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
        options: {
          checkboxes: this.columnCheckboxes,
          hiddenHeaders: this.hiddenHeaders, // must be immutable, because hiddenHeaders changes after handler call
          handler: ({ toHide, toShow }) => {
            try {
              this.StartLoadingLocal();
              // it is necessary to place the "closeModal" function at the beginning.
              // When executing the current function, the this array is changed.hiddenHeaders,
              // which is why the 'props' of the modal window change and an error occurs.
              // Either the modal window closes at the very beginning, or the hiddenHeaders array should be made immutable.
              this.CloseModal();
              const ref = this.$refs[TABLE_REF_KEY];
              const maxLength = Math.max(toHide.length, toShow.length);

              for (let i = 0; i < maxLength; i += 1) {
                const showItem = toShow[i];
                const hideItem = toHide[i];
                if (showItem) {
                  // @ts-ignore // TODO add ref types
                  ref.showColumn(showItem);
                }
                if (hideItem) {
                  // @ts-ignore // TODO add ref types
                  ref.hideColumn(hideItem);
                }
              }
            } catch (e) {
              console.error('tableSettings modal handler error', e);
            } finally {
              this.FinishLoadingLocal();
            }
          },
          resetHandler: () => {
            try {
              this.StartLoadingLocal();
              // it is necessary to place the "closeModal" function at the beginning.
              // When executing the current function, the this array is changed.hiddenHeaders,
              // which is why the 'props' of the modal window change and an error occurs.
              // Either the modal window closes at the very beginning, or the hiddenHeaders array should be made immutable.
              this.CloseModal();
              const ref = this.$refs[TABLE_REF_KEY];
              // @ts-ignore // TODO add ref types
              ref.resetTable();
            } catch (e) {
              console.error('tableSettings modal handler error', e);
            } finally {
              this.FinishLoadingLocal();
            }
          }
        }
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
          header: [{
            text: 'Товар',
            css: 'custom-table-header',
            height: 85
          },
          {
            content: 'excelFilter',
            css: 'custom-table-header'
            // filterConfig: {}
          }],
          width: 200,
          template: ({ name, productWbId }) => getTableLinkCellTemplate(name, `/products/${productWbId}`),
          tooltip: ({ name }) => name,
          sort: 'server'
        },
        {
          id: 'supplier',
          header: [{ text: 'Поставщик', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ supplier, wbOrgNameId }) => getTableLinkCellTemplate(supplier, `/suppliers/${wbOrgNameId}`),
          tooltip: ({ supplier }) => supplier,
          sort: 'server'
        },
        {
          id: 'productWbId',
          header: [{ text: 'Артикул WB', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ productWbId }) => productWbId,
          sort: 'server'
        },
        {
          id: 'positionNumber',
          header: [{ text: 'Позиция', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({
            positionNumber,
            positionNumberChange
          }) => getTableBadgeCellTemplate(positionNumber || 0, positionNumberChange || 0),
          tooltip: ({ positionNumber }) => positionNumber || 0,
          sort: 'server'
        },
        {
          id: 'subject',
          header: [{ text: 'Категория', css: 'custom-table-header', height: 85 }],
          width: 150,
          template: ({ subject, subjectId }) => getTableLinkCellTemplate(subject, `/categories/${subjectId}`),
          tooltip: ({ subject }) => subject,
          sort: 'server'
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
          sort: 'server'
        },
        {
          id: 'ordersSum',
          header: [{ text: 'Выручка, ₽', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ orders }) => orders,
          sort: 'server'
        },
        {
          id: 'loosesPercent',
          header: [{ text: 'Потери %', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ loosesPercent }) => loosesPercent,
          sort: 'server'
        },

        {
          id: 'lastRemains',
          header: [{ text: 'Остатки, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastRemains }) => lastRemains,
          sort: 'server'
        },
        {
          id: 'lastPrice',
          header: [{ text: 'Цена, ₽', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastPrice }) => lastPrice,
          sort: 'server'
        },
        {
          id: 'lastDiscountPercent',
          header: [{ text: 'Скидка, %', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ lastDiscountPercent }) => lastDiscountPercent,
          sort: 'server'
        },
        {
          id: 'positionRating',
          header: [{ text: 'Рейтинг', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ positionRating }) => positionRating,
          sort: 'server'
        },
        {
          id: 'reviewsRating',
          header: [{ text: 'Рейтинг по отзывам', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ reviewsRating }) => reviewsRating,
          sort: 'server'
        },
        {
          id: 'reviewsCount',
          header: [{ text: 'Отзывы, шт', css: 'custom-table-header', height: 85 }],
          width: 100,
          tooltip: ({ reviewsCount }) => reviewsCount,
          sort: 'server'
        }
      ];
    },
    syncHeaderVisibility(key: keyof IWebixTableItem, status: TTableElementVisibility): void {
      if (status === 'visible') {
        this.hiddenHeaders = this.hiddenHeaders.filter((it) => it !== key);
      } else {
        this.hiddenHeaders.push(key);
      }
    },
    syncTableReset(): void {
      this.hiddenHeaders = [];
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
    grid-row-gap: 8px;
    justify-content: space-between;
    align-items: center;
  }

  &__controls {
    display: flex;
    align-items: center;
    grid-column-gap: 12px;
    grid-row-gap: 8px;
  }

  &__search {
    max-width: 400px;
  }

  &__favorites {
    width: max-content;
  }

  &__settings {

  }

  @include _576 {
    &__filters {
      display: flex;
      align-items: flex-end;
    }
    &__controls {
      flex-direction: column;
      align-items: flex-start;
    }
    &__settings {
      width: max-content;
    }
  }
}
</style>
