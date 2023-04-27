<template>
  <ModalBox
    data-selector="TABLE-SETTINGS-MODAL"
    :is-unclosable="modal.isUnclosable"
    :title="$tc('modals.tableSettings.title')"
    @close="CloseCurrentModal"
  >
    <template #content>
      <form
        class="table-settings-modal"
        @submit.prevent="handleSaveSettings"
      >
        <div class="table-settings-modal__panel">
          <UiCheckbox
            v-for="item in modal.options.checkboxes"
            :id="`column-${item.value}`"
            :key="item.value"
            v-model="checkboxModel"
            class="table-settings-modal__checkbox"
            mode="multi"
            :option="item"
          />
        </div>
        <div class="table-settings-modal__buttons">
          <UiButton
            data-selector="SAVE-TABLE-SETTINGS"
            size="big"
            variant="danger"
            @click="handleResetTable"
          >
            {{ $tc('buttons.reset') }}
          </UiButton>
          <div class="table-settings-modal__controls">
            <UiButton
              data-selector="SAVE-TABLE-SETTINGS"
              variant="secondary"
              size="big"
              @click="CloseCurrentModal"
            >
              {{ $tc('buttons.cancel') }}
            </UiButton>
            <UiButton
              data-selector="SAVE-TABLE-SETTINGS"
              type="submit"
              size="big"
            >
              {{ $tc('buttons.save') }}
            </UiButton>
          </div>
        </div>
      </form>
    </template>
  </ModalBox>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue';

import UiButton from '~/components/ui/UiButton.vue';
import UiCheckbox from '~/components/ui/UiCheckbox.vue';

import ModalWindow from '~/mixins/ModalWindow';

import { MODAL_TYPE } from '~/store/types/main';

import type { TCheckboxOptionsArray } from '~/components/ui/UiCheckbox.vue';
import type { TModalWindowVue, IStoreModalOptions } from '~/store/types/main';
import type { IWebixTableItem } from '~/core/api/types/webix';

interface IData {
  checkboxModel: TCheckboxOptionsArray<keyof IWebixTableItem>,
  initialModel: TCheckboxOptionsArray<keyof IWebixTableItem>,
}

export interface IColumnsDifference {
  toHide: Array<keyof IWebixTableItem>,
  toShow: Array<keyof IWebixTableItem>,
}

export default (Vue as TModalWindowVue).extend({
  name: 'TableSettings',
  components: {
    UiButton,
    UiCheckbox
  },
  mixins: [ModalWindow],
  props: {
    modal: {
      type: Object as PropType<IStoreModalOptions<MODAL_TYPE.tableSettings>>,
      required: true
    }
  },
  data(): IData {
    return {
      checkboxModel: [],
      initialModel: []
    };
  },
  computed: {
    columnDifference(): IColumnsDifference {
      const toHide: Array<keyof IWebixTableItem> = [];
      const toShow: Array<keyof IWebixTableItem> = [];
      for (let i = 0; i < this.modal.options.checkboxes.length; i += 1) {
        const element = this.modal.options.checkboxes[i];
        const isInitialChecked = this.initialModel.includes(element);
        const isCurrentChecked = this.checkboxModel.includes(element);
        if (isInitialChecked && !isCurrentChecked) {
          toHide.push(element.value);
        }
        if (!isInitialChecked && isCurrentChecked) {
          toShow.push(element.value);
        }
      }
      return { toHide, toShow };
    }
  },
  mounted() {
    this.initCheckboxesModel();
  },
  methods: {
    initCheckboxesModel(): void {
      for (let i = 0; i < this.modal.options.checkboxes.length; i += 1) {
        const current = this.modal.options.checkboxes[i];
        const isHidden = this.modal.options.hiddenHeaders.includes(current.value);
        if (!isHidden) {
          this.checkboxModel.push(current);
        }
      }
      this.initialModel = [...this.checkboxModel];
    },

    async handleSaveSettings(): Promise<void> {
      await this.HandleLoading(this.modal.options.handler.bind(this, this.columnDifference));
    },
    async handleResetTable(): Promise<void> {
      await this.HandleLoading(this.modal.options.resetHandler);
    }
  }

});
</script>

<style scoped lang="scss">
.table-settings-modal {
  display: flex;
  flex-direction: column;
  grid-row-gap: 25px;
  width: 100%;
  &__panel {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  &__checkbox {

  }

  &__buttons {
    display: grid;
    grid-template-columns: auto max-content;
    grid-column-gap: 12px;
    grid-row-gap: 12px;
    justify-content: space-between;
  }
  &__controls {
    display: flex;
    grid-column-gap: 12px;
  }

  @include _576 {
    &__buttons {
      margin-top: auto;
      display: flex;
      flex-direction: column-reverse;
    }
  }
}
</style>
