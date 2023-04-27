import Vue from 'vue';

interface IData {
  timeout: ReturnType<typeof setTimeout> | null
}

export default Vue.extend({
  data(): IData {
    return {
      timeout: null
    };
  },
  methods: {
    DebounceFunction(cb: () => void | Promise<void>, time = 1000) {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(async () => {
        await cb();
      }, time);
    }
  }

});
