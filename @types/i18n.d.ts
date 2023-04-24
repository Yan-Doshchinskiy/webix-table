// eslint-disable-next-line import/no-extraneous-dependencies
import VueI18n, {
  Path, Values, Locale
} from 'vue-i18n/types';

declare module 'vue-i18n/types' {
  export default class VueI18n {
    t(key: Path, locale: Locale, values?: Values): string;
    // eslint-disable-next-line no-dupe-class-members
    t(key: Path, values?: Values): string;
  }
}

declare module 'vue/types/vue' {
  interface Vue {
    $t: typeof VueI18n.prototype.t;
    $tc: typeof VueI18n.prototype.tc;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface VueConstructor<V extends Vue = Vue> {
    i18n: typeof VueI18n.prototype;
  }
}

export {};
