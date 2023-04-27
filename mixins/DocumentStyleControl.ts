import Vue from 'vue';

export default Vue.extend({
  methods: {
    DisableBodyScroll(): void {
      if (typeof document !== 'undefined') {
        document.body.style.overflowY = 'hidden';
        document.body.style.position = 'fixed';
      }
    },
    EnableBodyScroll(): void {
      if (typeof document !== 'undefined') {
        document.body.style.overflowY = 'unset';
        document.body.style.position = 'relative';
      }
    },
    ToggleBodyScroll(isVisible: boolean): void {
      if (isVisible) {
        this.EnableBodyScroll();
      } else {
        this.DisableBodyScroll();
      }
    }
  }
});
