<template>
  <modal
    :visible="visible"
    title="插入位置"
    ok-text="确认"
    cancel-text="取消"
    :ok-button-props="{ props: { disabled: item === null } }"
    @ok="handleOk"
    @cancel="handleClose"
    :width="964"
  >
    <map-content :onCahnge="handleChange" />
  </modal>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Modal } from "ant-design-vue";
import MapContent, { AddressItem } from "../Map/Content.vue";
import { EngineInterface } from "@aomao/engine";

Modal.install(Vue);
@Component({
  components: {
    MapContent,
    Modal,
  },
})
export default class MapModal extends Vue {
  @Prop(Object) engine!: EngineInterface;
  @Prop(Boolean) visible?: boolean;
  @Prop(Function) onVisibleChange?: (visible: boolean) => void;

  item: AddressItem | null = null;

  handleChange(item: AddressItem | null) {
    this.item = item;
  }

  handleClose() {
    if (this.onVisibleChange) this.onVisibleChange(false);
  }

  handleOk() {
    this.engine.command.execute("map", this.item);
    this.handleClose();
  }
}
</script>
