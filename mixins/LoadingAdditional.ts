import LoadingLocal from '~/mixins/LoadingLocal';
import type { TLoadingStatus } from '~/mixins/LoadingLocal';

interface IData {
  loadingStatusAdditional: TLoadingStatus
}

export default LoadingLocal.extend({
  data(): IData {
    return {
      loadingStatusAdditional: 'none'
    };
  },
  computed: {
    IsLoadingAdditional(): boolean {
      return this.loadingStatusAdditional === 'loading';
    }
  },
  methods: {
    StartLoadingAdditional():void {
      this.loadingStatusAdditional = 'loading';
    },
    FinishLoadingAdditional():void {
      this.loadingStatusAdditional = 'none';
    },
    ChangeLoadingStatusAdditional(status: TLoadingStatus):void {
      if (status === 'loading') {
        this.StartLoadingAdditional();
      } else {
        this.FinishLoadingAdditional();
      }
    }
  }

});
