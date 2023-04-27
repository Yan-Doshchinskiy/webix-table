<template>
  <div class="webix-data-table" />
</template>

<script lang="ts">
import Vue from 'vue';
import clone from 'lodash.clonedeep';

import type { PropType } from 'vue';
import type webix from 'webix/types/webix';
import { getTableLoaderTemplate } from '~/core/webix/TableLoader';
import { TLoadingStatus } from '~/mixins/LoadingLocal';

interface IEvents {
  resizeEventId: string | number | null,
  columnHideId: string | number | null,
  columnShowId: string | number | null,
  columnSortId: string | number | null,
}

interface ICell {
  column: string,
  row: number
}

export interface ISingleListener<D = any> {
  [key: string]: (obj: D) => boolean | void | Promise<boolean | void>
}

interface IWebixListener {
  [key: string]: (e: PointerEvent, cell: ICell, target: Element) => boolean | void | Promise<boolean | void>
}

export interface ITableListeners<D = any> {
  onClick?: ISingleListener<D>
}

type TTableSortingType = 'int' | 'date' | 'string' | 'string_strict' | 'text' | 'string_locale' | 'string_locale_strict' | 'text_locale' | 'server' | 'raw'
export type TTableSortDirection = 'asc' | 'desc'

export interface IWebixTableHeader<K extends Record<string, any> = Record<string, any>> {
  id: keyof K,
  header: Array<{ text: string, css?: string, height?: number }>,
  sort?: TTableSortingType,
  width?: number,
  fillspace?: number | boolean,
  template?: string | ((obj: K, common: Record<string, any>, value: K[keyof K], header: IWebixTableHeader<K>, index: number) => string | number),
  tooltip?: string | ((obj: K, common: Record<string, any>, value: any) => string | number) | boolean,
}

interface IData {
  webixElement: webix.ui.datatable | undefined,
  events: IEvents,
  localHeaders: Array<IWebixTableHeader>
}

type TTableItemsArray<T extends Record<string, any> = Record<string, any>> = Array<T>

export interface ITableConfig {
  height: number,
  rowHeight: number,
  tooltip: boolean,
  dragColumn: boolean,
  resizeColumn: boolean,
  css: string
}

export type TTableConfigProps = Partial<ITableConfig>

export type TTableElementVisibility = 'visible' | 'hidden'

export default Vue.extend({
  name: 'WebixDataTable',
  props: {
    headers: {
      type: Array as PropType<Array<IWebixTableHeader>>,
      required: true
    },
    config: {
      type: Object as PropType<TTableConfigProps>,
      default: () => ({})
    },
    tableData: {
      type: Array as PropType<TTableItemsArray>,
      default: () => ([])
    },
    listeners: {
      type: Object as PropType<ITableListeners>,
      default: () => ({
        onClick: {}
      })
    }
  },
  data(): IData {
    return {
      webixElement: undefined,
      events: {
        resizeEventId: null,
        columnHideId: null,
        columnShowId: null,
        columnSortId: null
      },
      localHeaders: []
    };
  },
  computed: {
    tableConfig(): ITableConfig {
      return {
        height: 800,
        rowHeight: 40,
        tooltip: false,
        dragColumn: false,
        resizeColumn: false,
        css: '',
        ...this.config
      };
    },
    onClickListener(): IWebixListener {
      if (!this.listeners?.onClick) {
        return {};
      }
      const array = Object.entries(this.listeners.onClick);
      const result: IWebixListener = {};
      for (let i = 0; i < array.length; i += 1) {
        const [key, cb] = array[i];
        result[key] = async (_: PointerEvent, cell: ICell): Promise<void> => {
          const data = this.webixElement?.getItem(cell.row);
          await cb(data);
        };
      }

      return result;
    }
  },
  watch: {
    headers: {
      deep: true,
      handler(value: Array<IWebixTableHeader>) {
        this.resetColumns(value);
      }
    },
    tableData: {
      deep: true,
      handler(value: TTableItemsArray) {
        this.resetRows(value);
      }
    }
  },
  mounted() {
    this.initTableElement();
    this.subscribeResizeEvent();
    this.subscribeColumnsEvents();
  },
  destroyed() {
    this.unsubscribeResizeEvent();
    this.destroyTableElement();
    this.unsubscribeColumnsEvents();
  },
  methods: {
    initTableElement(): void {
      this.webixElement = this.$webix.ui({
        container: this.$el,
        $scope: this,
        view: 'datatable',
        columns: this.localHeaders,
        data: this.tableData,
        onClick: this.onClickListener,
        ...this.tableConfig
      }) as webix.ui.datatable;
    },
    destroyTableElement(): void {
      this.webixElement?.destructor();
    },
    subscribeResizeEvent(): void {
      // @ts-ignore
      this.events.resizeEventId = this.$webix.event(window, 'resize', () => {
        this.webixElement?.adjust();
      });
    },
    subscribeColumnsEvents(): void {
      if (!this.webixElement) {
        return;
      }
      this.events.columnHideId = this.webixElement.attachEvent('onAfterColumnHide', (key: string) => {
        this.emitColumnVisibility(key, 'hidden');
      });
      this.events.columnShowId = this.webixElement.attachEvent('onAfterColumnShow', (key: string) => {
        this.emitColumnVisibility(key, 'visible');
      });
      this.events.columnSortId = this.webixElement.attachEvent('onBeforeSort', (key: string, direction: TTableSortDirection) => {
        this.emitColumnSort(key, direction);
      });
    },
    unsubscribeResizeEvent(): void {
      if (this.events.resizeEventId === null) {
        return;
      }
      this.$webix.eventRemove(this.events.resizeEventId);
      this.events.resizeEventId = null;
    },
    unsubscribeColumnsEvents():void {
      if (!this.webixElement) {
        return;
      }
      if (typeof this.events.columnHideId === 'string') {
        this.webixElement.detachEvent(this.events.columnHideId);
      }
      if (typeof this.events.columnShowId === 'string') {
        this.webixElement.detachEvent(this.events.columnShowId);
      }
      if (typeof this.events.columnSortId === 'string') {
        this.webixElement.detachEvent(this.events.columnSortId);
      }
    },
    showColumn(key: string) {
      try {
        this.webixElement?.showColumn(key);
      } catch (e) {
        console.error('showColumn error', e);
      }
    },
    hideColumn(key: string) {
      try {
        this.webixElement?.hideColumn(key);
      } catch (e) {
        console.error('hideColumn error', e);
      }
    },
    resetTable() {
      try {
        this.resetColumns(this.headers);
        this.resetRows(this.tableData);
        this.emitResetTable();
      } catch (e) {
        console.error('resetTable error', e);
      }
    },
    resetColumns(value: Array<IWebixTableHeader>) {
      if (!this.webixElement) {
        return;
      }
      // We should clone input values,because webix mutates options
      this.localHeaders = clone(value);
      this.webixElement.config.columns = this.localHeaders;
      this.webixElement.refreshColumns();
    },
    resetRows(value: TTableItemsArray) {
      if (!this.webixElement) {
        return;
      }
      this.webixElement.clearAll();
      this.webixElement.parse(value, 'json');
    },
    switchTableLoading(status: TLoadingStatus) {
      if (!this.webixElement) {
        return;
      }
      if (status === 'loading') {
        this.webixElement.showOverlay(getTableLoaderTemplate());
        this.webixElement.disable();
      } else {
        this.webixElement.hideOverlay();
        this.webixElement.enable();
      }
    },
    emitColumnVisibility(key: string, status: TTableElementVisibility) {
      this.$emit('column-visibility', key, status);
    },
    emitResetTable() {
      this.$emit('reset-table');
    },
    emitColumnSort(key: string, direction: TTableSortDirection) {
      this.$emit('column-sort', key, direction);
    }
  }
});
</script>

<style lang="scss" scoped>
.webix-data-table {
  max-width: 100%;
  overflow-x: auto;
}
</style>
