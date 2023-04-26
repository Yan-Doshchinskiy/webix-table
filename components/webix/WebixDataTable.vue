<template>
  <div class="webix-data-table" />
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';

import type webix from 'webix/types/webix';

import type { IWebixTableItem } from '~/core/api/types/webix';

interface IEvents {
  resizeEventId: string | number | null,
}

interface IData {
  webixElement: webix.ui.datatable | undefined,
  events: IEvents,
}

type TTableSorting = 'int' | 'date' | 'string' | 'string_strict' | 'text' | 'string_locale' | 'string_locale_strict' | 'text_locale' | 'server' | 'raw'

export interface IWebixTableHeader<K extends Record<string, any> = Record<string, any>> {
  id: keyof K,
  header: Array<{ text: string, css?: string, height?: number }>,
  sort?: TTableSorting,
  width?: number,
  fillspace?: number | boolean,
  template?: string | ((obj: K, common: Record<string, any>, value: K[keyof K], header: IWebixTableHeader<K>, index: number) => string | number),
  tooltip?: string | ((obj: K, common: Record<string, any>, value: any) => string | number) | boolean,
}

type TTableItemsArray<T extends Record<string, any> = Record<string, any>> = Array<T>

export default Vue.extend({
  name: 'WebixDataTable',
  props: {
    headers: {
      type: Array as PropType<Array<IWebixTableHeader>>,
      required: true
    },
    fetchFunction: {
      type: Function as PropType<() => Promise<TTableItemsArray>>,
      required: true
    },
    search: {
      type: String,
      default: ''
    },
    searchFields: {
      type: Array as PropType<Array<keyof IWebixTableItem>>,
      default: () => ([])
    }
  },
  data(): IData {
    return {
      webixElement: undefined,
      events: {
        resizeEventId: null
      }
    };
  },
  watch: {
    headers: {
      handler(value: Array<IWebixTableHeader>) {
        if (!this.webixElement) {
          return;
        }
        this.webixElement.config.columns = value;
        this.webixElement.refreshColumns();
      }
    },
    search: {
      handler(value: string) {
        this.handleSearch(value);
      }
    }
  },
  mounted() {
    this.initTableElement();
    this.subscribeResizeEvent();
  },
  destroyed() {
    this.unsubscribeResizeEvent();
    this.destroyTableElement();
  },
  methods: {
    initTableElement(): void {
      this.webixElement = this.$webix.ui({
        container: this.$el,
        $scope: this,
        view: 'datatable',
        height: 800,
        columns: this.headers,
        rowHeight: 40,
        tooltip: true,
        dragColumn: true,
        resizeColumn: true,
        css: 'custom-items-table',
        url: {
          $proxy: true,
          load: this.fetchFunction.bind(this)
        }
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
    unsubscribeResizeEvent(): void {
      if (this.events.resizeEventId === null) {
        return;
      }
      this.$webix.eventRemove(this.events.resizeEventId);
      this.events.resizeEventId = null;
    },
    handleSearch(value: string): void {
      try {
        this.webixElement?.filter((obj) => this.searchFields.some((key) => obj[key]?.includes(value)));
      } catch (e) {
        console.error('webix table handleSearch error', e);
      }
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
