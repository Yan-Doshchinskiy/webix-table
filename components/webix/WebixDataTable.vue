<template>
  <div class="webix-data-table" />
</template>

<script lang="ts">
import Vue from 'vue';
import type { PropType } from 'vue';

import type webix from 'webix/types/webix';

interface IEvents {
  resizeEventId: string | number | null,
}

interface IData {
  webixElement: webix.ui.datatable | undefined,
  events: IEvents
}

export interface IWebixTableHeader<K extends Record<string, any> = Record<string, any>> {
  id: keyof K,
  header: Array<{ text: string }>,
  width?: number,
  fillspace?: number | boolean,
  template?: string | ((obj: K) => string | number),
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
    }
  }

});
</script>

<style lang="scss" scoped>
.webix-data-table {
  max-width: 100%;
}
</style>
