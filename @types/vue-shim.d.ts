import Vue from 'vue';
import type { IAppContextExtended } from '~/@types/index';

declare module '*.vue' {
  export default Vue;
}

declare module 'vue/types/vue' {
  interface Vue extends IAppContextExtended{
  }
}

declare module '@nuxt/types' {
  interface Context extends IAppContextExtended{
  }
}

export {};
