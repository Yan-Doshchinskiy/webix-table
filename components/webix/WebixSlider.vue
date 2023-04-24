<template>
  <div />
</template>

<script lang="ts">
import Vue from 'vue';
import type webix from 'webix/types/webix';

interface IData {
  sliderElement: webix.ui.slider | undefined
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
      sliderElement: undefined
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
    this.sliderElement = this.$webix.ui({
      container: this.$el,
      $scope: this,
      view: 'slider',
      value: this.value
    }) as webix.ui.slider;

    this.sliderElement?.attachEvent('onChange', (val: number) => {
      this.$emit('input', val);
    });

    this.sliderElement?.attachEvent('onSliderDrag', () => {
      const value = this.sliderElement?.getValue() || '0';
      // you can use a custom event here
      this.$emit('input', value);
    });
  },
  destroyed() {
    this.sliderElement?.destructor();
  }

});
</script>

<style scoped>

</style>
