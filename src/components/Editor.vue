<template>
    <div class="amEditorVue2">
        <am-loading :loading="loading">
            <div :class="['editor-wrapper',{'editor-mobile': mobile}]">
                <div class="editor-container">
                    <div class="editor-content">
                        <div ref="container"></div>
                    </div>
                </div>
            </div>
        </am-loading>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Engine, { $, EngineInterface, isMobile } from "@aomao/engine"
import { message, Modal } from 'ant-design-vue'
import AmLoading from './Loading.vue'
import { plugins, cards, pluginConfig } from './config'

@Component({
    components:{
        AmLoading,
    }
})
export default class Editor extends Vue {
    loading = true
    engine?: EngineInterface
    mobile = isMobile

    mounted(){
        // 容器加载后实例化编辑器引擎
        const container = this.$refs.container
        if(container){
            //实例化引擎
            const engine = new Engine(container as Element,{
                // 启用的插件
                plugins,
                // 启用的卡片
                cards,
                // 所有的卡片配置
                config: pluginConfig,
            });
            // 设置显示成功消息UI，默认使用 console.log
            engine.messageSuccess = (msg) => {
                message.success(msg);
            };
            // 设置显示错误消息UI，默认使用 console.error
            engine.messageError = (error) => {
                message.error(error);
            };
            // 设置显示确认消息UI，默认无
            engine.messageConfirm = (msg) => {
                return new Promise<boolean>((resolve, reject) => {
                    Modal.confirm({
                        content: msg,
                        onOk: () => resolve(true),
                        onCancel: () => reject(),
                    });
                });
            };
            //卡片最大化时设置编辑页面样式
            engine.on('card:maximize', () => {
                $('.editor-toolbar').css('z-index', '9999').css('top', '55px');
            });
            engine.on('card:minimize', () => {
                $('.editor-toolbar').css('z-index', '').css('top', '');
            });
            // 默认编辑器值，为了演示，这里初始化值写死，正式环境可以请求api加载
            const value = '<strong>Hello</strong>,<span style="color:red">am-editor</span>'
            // 非协同编辑，设置编辑器值，异步渲染后回调
            engine.setValue(value, () => {
                this.loading = false
            })
            
            // 监听编辑器值改变事件
            engine.on('change', value => {
                console.log('value', value);
                console.log('html:', engine.getHtml());
            });
            
            this.engine = engine
        }
    }
    onUnmounted(){
        this.engine?.destroy()
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
  height: calc(100vh - 56px);
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