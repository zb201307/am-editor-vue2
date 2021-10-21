<template>
    <div :class="['toolbar-dropdown','colorpicker-button', {'toolbar-dropdown-right': isRight}]" ref="buttonRef">
        <div
        :class="['toolbar-dropdown-trigger colorpicker-button-group',
            { 'colorpicker-button-group-active': visible },
        ]"
        >
            <am-button
            class="colorpicker-button-text"
            :name="name"
            :title="buttonTitle"
            :on-click="triggerClick"
            :disabled="disabled"
            >
                <span v-html="buttonContent"></span>
            </am-button>
            <am-button
            class="colorpicker-button-dropdown toolbar-dropdown-trigger-arrow"
            :name="name"
            :title="dropdownTitle"
            :on-click="toggleDropdown"
            :disabled="disabled"
            >
                <template #icon>
                    <span class="colorpicker-button-dropdown-empty" />
                </template>
                <span class="data-icon data-icon-arrow" />
            </am-button>
        </div>
        <div v-if="visible" class="toolbar-dropdown-list" data-element="ui">
            <am-color-picker
            :engine="engine"
            :colors="colors"
            :default-active-color="currentColor"
            :default-color="defaultColor"
            :on-select="triggerSelect"
            :set-stroke="setStroke"
            />
        </div>
    </div>
</template>
<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { EngineInterface, isMobile } from "@aomao/engine";
import AmButton from '../button.vue'
import AmColorPicker from './picker/picker.vue'
import Palette from './picker/palette';
import { Command } from '../../types'

@Component({
    components: {
        AmButton,
        AmColorPicker
    },
})
export default class AmColor extends Vue {
    @Prop({ type: Object}) engine?: EngineInterface
	@Prop({ type: String, required: true}) name!: string
    @Prop({ type: [String, Function], required: true}) content!: string
			| ((color: string, stroke: string, disabled?: boolean) => string)
    @Prop(String) buttonTitle?: string
    @Prop(String) dropdownTitle?: string
    @Prop({ type: Object}) command?: Command
    @Prop({ type: [Boolean, Object], default: undefined}) autoExecute?: boolean
    @Prop({ type: [Boolean, Object], default: undefined}) disabled?: boolean
    @Prop(Array) colors?: string[][]
    @Prop({ type: String, required: true}) defaultColor!: string
    @Prop({ type: String, required: true}) defaultActiveColor!: string
    @Prop({ type: [Boolean, Object], default: undefined}) setStroke?: boolean
    @Prop(Function) onSelect?: (color: string, event: MouseEvent) => void

    visible = false
    buttonRef: HTMLDivElement | null = null
    isRight = false
    currentColor = ""
    buttonContent?: string = ''

    mounted(){
        if (this.buttonRef && isMobile) {
			const rect = this.buttonRef.getBoundingClientRect();
			this.isRight = rect.left > window.visualViewport.width / 2;
		}
        this.currentColor = this.defaultActiveColor
    }

    unmounted(){
        document.removeEventListener('click', this.hideDropdown)
    }

    @Watch("$props.disabled", { immediate: true, deep: true })
    getContent(){
        this.buttonContent = typeof this.content === 'string'
            ? this.content
            : this.content(
                    this.currentColor,
                    Palette.getStroke(this.currentColor),
                    this.disabled
            )
    }

    toggleDropdown(event: MouseEvent){
        event.preventDefault();
        if (this.visible) {
            this.hideDropdown();
        } else {
            this.showDropdown();
        }
    };

    showDropdown(){
        setTimeout(() => {
            document.addEventListener('click', this.hideDropdown);
        }, 10);
        this.visible = true
    };

    hideDropdown(event?: MouseEvent){
        if (event && (event.target as Element).closest('.toolbar-dropdown-list'))
            return;
        document.removeEventListener('click', this.hideDropdown);
        this.visible = false
    };

    triggerClick(event:MouseEvent){
        this.triggerSelect(this.currentColor,event)
    }

    triggerSelect (color: string, event: MouseEvent){
        this.currentColor = color;
        this.buttonContent = typeof this.content === 'string'
                ? this.content
                : this.content(color, Palette.getStroke(color), this.disabled)

        if (this.autoExecute !== false) {
            let commandName = this.name;
            let commandArgs = [color, this.defaultColor];
            if (this.command) {
                if (!Array.isArray(this.command)) {
                    commandName = this.command.name;
                    commandArgs = this.command.args;
                } else {
                    commandArgs = this.command;
                }
            }
            this.engine?.command.execute(commandName, ...commandArgs);
        }
        if (this.onSelect) this.onSelect(color, event);
    };
}
</script>
<style>
.editor-toolbar .colorpicker-button .colorpicker-button-group {
    padding: 0 2px;
}

.colorpicker-button-group .toolbar-button {
    padding: 0;
}

.colorpicker-button-group .colorpicker-button-text {
    height: 32px;
    margin-right: 0;
    min-width: 26px;
    border-radius: 3px 0 0 3px;
}

.colorpicker-button-group .colorpicker-button-text:active {
    background-color: #e8e8e8;
}

.colorpicker-button-group .colorpicker-button-dropdown {
    height: 32px;
    margin-left: -1px;
    min-width: 17px;
    text-align: center;
    padding: 0 0;
    border-radius: 0 3px 3px 0;
}
  
.colorpicker-button-group .colorpicker-button-dropdown:hover,
.colorpicker-button-group .colorpicker-button-dropdown:active {
    background-color: #e8e8e8;
}

.colorpicker-button-group .colorpicker-button-dropdown .colorpicker-button-dropdown-empty {
    display: inline-block;
}

.colorpicker-button-group:hover .toolbar-button {
    border: 1px solid #e8e8e8;
}
.colorpicker-button-group-active .toolbar-button,
.colorpicker-button-group-active:hover .toolbar-button {
    border: 1px solid #e8e8e8;
}
</style>