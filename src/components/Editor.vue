<template>
  <div class="amEditorVue2">
    <am-loading :loading="loading">
      <am-toolbar v-if="engine" :engine="engine" :items="items" />
      <div :class="['editor-wrapper', { 'editor-mobile': mobile }]">
        <div class="editor-container">
          <div class="editor-content">
            <div ref="container"></div>
          </div>
        </div>
      </div>
      <!-- <div ref="view"></div> -->
    </am-loading>
    <map-modal
      v-if="engine"
      :engine="engine"
      :visible="mapModalVisible"
      :onVisibleChange="handleMapModalVisibleChange"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import Engine, {
  $,
  EngineInterface,
  isMobile,
  View,
  ViewInterface,
} from "@aomao/engine";
import { message, Modal } from "ant-design-vue";
import AmLoading from "./Loading.vue";
import AmToolbar from "../../packages/toolbar/src";
import { plugins, cards, pluginConfig } from "./config";
import { GroupItemProps } from "packages/toolbar/src/types";
import MapModal from "./Map/Modal.vue";

@Component({
  components: {
    AmLoading,
    AmToolbar,
    MapModal,
  },
})
export default class Editor extends Vue {
  loading = true;
  engine?: EngineInterface | null = null;
  view?: ViewInterface | null = null;
  mobile = isMobile;
  items: GroupItemProps[] = [];
  mapModalVisible = false;
  value = "";

  handleMapModalVisibleChange(visible: boolean) {
    this.mapModalVisible = visible;
  }

  mounted() {
    this.items = isMobile
      ? [
          ["undo", "redo"],
          {
            icon: "text",
            items: ["bold", "italic", "strikethrough", "underline", "moremark"],
          },
          [
            {
              type: "button",
              name: "image-uploader",
              icon: "image",
            },
            "link",
            "tasklist",
            "heading",
          ],
          {
            icon: "more",
            items: [
              {
                type: "button",
                name: "video-uploader",
                icon: "video",
              },
              {
                type: "button",
                name: "file-uploader",
                icon: "attachment",
              },
              {
                type: "button",
                name: "table",
                icon: "table",
              },
              {
                type: "button",
                name: "math",
                icon: "math",
              },
              {
                type: "button",
                name: "codeblock",
                icon: "codeblock",
              },
              {
                type: "button",
                name: "orderedlist",
                icon: "orderedlist",
              },
              {
                type: "button",
                name: "unorderedlist",
                icon: "unorderedlist",
              },
              {
                type: "button",
                name: "hr",
                icon: "hr",
              },
            ],
          },
        ]
      : [
          [
            {
              type: "collapse",
              groups: [
                {
                  items: [
                    "image-uploader",
                    "codeblock",
                    "table",
                    "file-uploader",
                    "video-uploader",
                    "math",
                    "status",
                    {
                      name: "map",
                      icon: '<span style="width:23px;height:23px;display: inline-block;border:1px solid #E8E8E8;"><svg style="top: 2px;position: relative;" t="1636128261742" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="25559" width="16" height="16"><path d="M524.665263 1001.633684l-285.642105-285.642105c-75.452632-75.452632-118.568421-177.852632-118.568421-285.642105s43.115789-210.189474 118.568421-285.642106c75.452632-75.452632 177.852632-118.568421 285.642105-118.568421s210.189474 43.115789 285.642105 118.568421c156.294737 156.294737 156.294737 414.989474 0 571.284211l-285.642105 285.642105z m0-921.6c-94.315789 0-180.547368 37.726316-247.915789 102.4s-102.4 153.6-102.4 247.91579c0 94.315789 37.726316 180.547368 102.4 247.915789l247.915789 247.91579 247.91579-247.91579c137.431579-137.431579 137.431579-358.4 0-495.831579-67.368421-64.673684-153.6-102.4-247.91579-102.4z" p-id="25560"></path><path d="M524.665263 592.033684c-88.926316 0-161.684211-72.757895-161.68421-161.68421s72.757895-161.684211 161.68421-161.684211 161.684211 72.757895 161.684211 161.684211-72.757895 161.684211-161.684211 161.68421z m0-269.473684c-59.284211 0-107.789474 48.505263-107.789474 107.789474s48.505263 107.789474 107.789474 107.789473 107.789474-48.505263 107.789474-107.789473-48.505263-107.789474-107.789474-107.789474z" p-id="25561"></path></svg><span>',
                      search: "地图,map",
                      title: "地图",
                      autoExecute: false,
                      onClick: () => {
                        this.mapModalVisible = true;
                      },
                    },
                    {
                      name: "audio-uploader",
                      icon: '<span style="width:23px;height:23px;display: inline-block;border:1px solid #E8E8E8;"><svg style="top: 2px;position: relative;" t="1636128560405" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="28042" width="16" height="16"><path d="M877.854 269.225l-56.805-56.806-121.726-123.079c-24.345-21.64-41.928-27.050-68.978-27.050h-451.737c-31.108 0-55.453 24.345-55.453 55.453v789.865c0 29.755 24.345 54.1 55.453 54.1h666.787c31.108 0 55.453-24.345 55.453-54.1v-584.284c0-24.345-8.115-35.165-22.993-54.1v0zM830.516 289.513h-156.891v-156.891l156.891 156.891zM856.213 907.609c0 5.409-4.057 10.821-10.821 10.821h-666.787c-6.762 0-12.172-5.409-12.172-10.821v-789.865c0-6.762 5.409-12.172 12.172-12.172 0 0 451.737 0 451.737 0v205.582c0 12.173 9.468 21.64 21.64 21.64h204.229v574.816zM723.668 413.943c-117.668-1.353-246.157 22.993-363.825 59.511-9.468 4.058-10.821 5.409-10.821 14.877v210.991c-12.172-5.409-27.050-6.762-41.927-5.409-45.985 1.353-82.503 29.755-82.503 60.862 0 31.108 36.517 55.453 82.503 52.748 45.985-2.706 82.503-29.755 82.503-60.863v-193.409c109.553-25.698 209.638-43.28 312.429-51.395v150.128c-12.173-5.409-25.698-6.762-40.576-6.762-45.985 2.706-82.503 29.755-82.503 62.215 0 31.108 36.517 55.453 82.503 52.748 44.632-2.706 82.503-29.755 82.503-60.863v-267.797c0-13.525-6.762-16.23-20.287-17.583z" p-id="28043"></path></svg><span>',
                      title: "音频",
                      search: "音频,audio",
                    },
                  ],
                },
              ],
            },
          ],
          ["undo", "redo", "paintformat", "removeformat"],
          ["heading", "fontfamily", "fontsize"],
          ["bold", "italic", "strikethrough", "underline", "moremark"],
          ["fontcolor", "backcolor"],
          ["alignment"],
          ["unorderedlist", "orderedlist", "tasklist", "indent", "line-height"],
          ["link", "quote", "hr"],
        ];

    // 容器加载后实例化编辑器引擎
    const container = this.$refs.container;
    if (container) {
      //实例化引擎
      const engine = new Engine(container as Element, {
        // 启用的插件
        plugins,
        // 启用的卡片
        cards,
        // 所有的卡片配置
        config: pluginConfig,
      });
      // 设置显示成功消息UI，默认使用 console.log
      engine.messageSuccess = (type: string, msg: string, ...args: any[]) => {
        console.error(type, msg, ...args);
        message.success(msg);
      };
      // 设置显示错误消息UI，默认使用 console.error
      engine.messageError = (type: string, error: string, ...args: any[]) => {
        console.error(type, error, ...args);
        message.error(error);
      };
      // 设置显示确认消息UI，默认无
      engine.messageConfirm = (type: string, msg: string, ...args: any[]) => {
        console.error(type, msg, ...args);
        return new Promise<boolean>((resolve, reject) => {
          Modal.confirm({
            content: msg,
            onOk: () => resolve(true),
            onCancel: () => reject(),
          });
        });
      };
      //卡片最大化时设置编辑页面样式
      engine.on("card:maximize", () => {
        $(".editor-toolbar").css("z-index", "9999").css("top", "55px");
      });
      engine.on("card:minimize", () => {
        $(".editor-toolbar").css("z-index", "").css("top", "");
      });
      // 默认编辑器值，为了演示，这里初始化值写死，正式环境可以请求api加载
      const value =
        '<strong>Hello</strong>,<span style="color:red">am-editor</span>';
      // 非协同编辑，设置编辑器值，异步渲染后回调
      engine.setValue(value, () => {
        this.loading = false;
      });

      // 监听编辑器值改变事件
      engine.on("change", () => {
        const value = engine.getValue();
        this.value = value;
        console.log("value", value);
        console.log("html:", engine.getHtml());
      });
      engine.on("mention:default", () => {
        return [
          {
            key: "1",
            name: "User1",
            avatar: "https://avatars.githubusercontent.com/u/17873876?v=4",
          },
          {
            key: "2",
            name: "User2",
            avatar: "https://avatars.githubusercontent.com/u/55792257?v=4",
          },
        ];
      });

      this.engine = engine;
    }
    const viewContainer = this.$refs.view;
    if (viewContainer) {
      const view = new View(viewContainer as Element, {
        // 启用的插件
        plugins,
        // 启用的卡片
        cards,
        // 所有的卡片配置
        config: pluginConfig,
      });
      this.view = view;
    }
  }
  @Watch("value", { immediate: true, deep: true })
  watch(value: string) {
    if (this.view) this.view.render(value);
  }

  onUnmounted() {
    if (this.engine) this.engine.destroy();
  }
}
</script>
<style scoped lang="less">
#app {
  padding: 0;
}
#nav {
  position: relative;
}

.editor-toolbar {
  position: fixed;
  width: 100%;
  background: #ffffff;
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.02);
  z-index: 1000;
}
.editor-wrapper {
  position: relative;
  width: 100%;
  min-width: 1440px;
}

.editor-wrapper.editor-mobile {
  min-width: auto;
  padding: 0 12px;
}

.editor-container {
  background: #fafafa;
  background-color: #fafafa;
  padding: 62px 0 64px;
  height: calc(100vh);
  width: 100%;
  margin: 0 auto;
  overflow: auto;
  position: relative;
}

.editor-mobile .editor-container {
  padding: 0;
  height: auto;
  overflow: hidden;
}

.editor-content {
  position: relative;
  width: 812px;
  margin: 0 auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  min-height: 800px;
}

.editor-mobile .editor-content {
  width: auto;
  min-height: calc(100vh - 68px);
  border: 0 none;
}

.editor-content .am-engine {
  padding: 40px 60px 60px;
}

.editor-mobile .editor-content .am-engine {
  padding: 18px 0 0 0;
}
</style>
