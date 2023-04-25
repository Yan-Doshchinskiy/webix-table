<template>
  <div style="max-width: 100%" />
</template>

<script lang="ts">
import Vue from 'vue';

import type webix from 'webix/types/webix';

interface IEvents {
  resizeEventId: string | number | null,
  changeEventId: string | number | null,
  dragEventId: string | number | null,
}

interface IData {
  sliderElement: webix.ui.slider | undefined,
  events: IEvents
}

export default Vue.extend({
  name: 'WebixSlider',
  props: {
    value: {
      type: Number,
      required: true
    }
  },
  data(): IData {
    return {
      sliderElement: undefined,
      events: {
        resizeEventId: null,
        changeEventId: null,
        dragEventId: null
      }
    };
  },
  watch: {
    value: {
      handler(value) {
        this.sliderElement?.setValue(value);
      }
    }
  },
  mounted() {
    this.initSliderElement();
    this.subscribeModelEvents();
    this.subscribeResizeEvent();
  },
  destroyed() {
    this.unsubscribeModelEvents();
    this.unsubscribeResizeEvent();
    this.destroySliderElement();
  },
  methods: {
    initSliderElement(): void {
      this.sliderElement = this.$webix.ui({
        container: this.$el,
        $scope: this,
        view: 'slider',
        value: this.value
      }) as webix.ui.slider;
    },
    destroySliderElement(): void {
      this.sliderElement?.destructor();
    },
    subscribeResizeEvent(): void {
      this.events.resizeEventId = this.$webix.event(window, 'resize', () => {
        this.sliderElement?.adjust();
      });
    },
    unsubscribeResizeEvent(): void {
      if (this.events.resizeEventId === null) {
        return;
      }
      this.$webix.eventRemove(this.events.resizeEventId);
      this.events.resizeEventId = null;
    },
    subscribeModelEvents():void {
      if (!this.sliderElement) {
        return;
      }
      this.events.changeEventId = this.sliderElement.attachEvent('onChange', (val: number) => {
        this.$emit('input', val);
      });
      this.events.dragEventId = this.sliderElement.attachEvent('onSliderDrag', () => {
        const value = this.sliderElement?.getValue() || '0';
        this.$emit('input', Number(value));
      });
    },
    unsubscribeModelEvents():void {
      if (!this.sliderElement) {
        return;
      }
      if (typeof this.events.changeEventId === 'string') {
        this.sliderElement.detachEvent(this.events.changeEventId);
      }
      if (typeof this.events.dragEventId === 'string') {
        this.sliderElement.detachEvent(this.events.dragEventId);
      }
    }
  }

});
</script>

<style scoped>

</style>
