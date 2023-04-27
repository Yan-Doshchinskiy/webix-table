import Vue from 'vue';

export type TLoadingStatus = 'loading' | 'none'

interface IData {
  loadingStatusLocal: TLoadingStatus
}

export default Vue.extend({
  data(): IData {
    return {
      loadingStatusLocal: 'none'
    };
  },
  computed: {
    IsLoadingLocal(): boolean {
      return this.loadingStatusLocal === 'loading';
    }
  },
  methods: {
    StartLoadingLocal():void {
      this.loadingStatusLocal = 'loading';
    },
    FinishLoadingLocal():void {
      this.loadingStatusLocal = 'none';
    },
    ChangeLoadingStatusLocal(status: TLoadingStatus):void {
      if (status === 'loading') {
        this.StartLoadingLocal();
      } else {
        this.FinishLoadingLocal();
      }
    }
  }

});
