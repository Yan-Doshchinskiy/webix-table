import Vue from 'vue';

import ModalBox from '~/components/modals/ModalBox/index.vue';

import LoadingLocal from '~/mixins/LoadingLocal';
import ModalControl from '~/mixins/ModalControl';

import type { PropType, VueConstructor } from 'vue';
import type { TLoadingStatus } from '~/mixins/LoadingLocal';
import type { IStoreModalOptions, MODAL_TYPE } from '~/store/types/main';

type TModalWindowMixin = VueConstructor<Vue & InstanceType<typeof LoadingLocal> & InstanceType<typeof ModalControl>>

export default (Vue as TModalWindowMixin).extend({
  name: 'ModalWindow',
  components: {
    ModalBox
  },
  mixins: [LoadingLocal, ModalControl],
  props: {
    modal: {
      type: Object as PropType<IStoreModalOptions<MODAL_TYPE>>,
      required: true
    }
  },
  methods: {
    StartLoadingModal(): void {
      this.StartLoadingLocal();
      this.emitModalLoading('loading');
    },

    FinishLoadingModal(): void {
      this.FinishLoadingLocal();
      this.emitModalLoading('none');
    },

    async HandleLoading(cb: () => void | Promise<void>, {
      onError,
      onSuccess
    }: {
      onError?: () => void | Promise<void>,
      onSuccess?: (result: any) => void | Promise<void>,
    } = {}): Promise<void> {
      try {
        this.StartLoadingModal();
        const result = await cb();
        if (onSuccess) {
          await onSuccess(result);
        }
      } catch (e) {
        console.error('save wallet error', e);
        if (onError) {
          await onError();
        }
      } finally {
        this.FinishLoadingModal();
      }
    },

    CloseCurrentModal(): void {
      this.$emit('close');
    },
    emitModalLoading(status: TLoadingStatus): void {
      this.$emit('loading', status);
    }

  }

});
