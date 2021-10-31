import { $, Card, CardToolbarItemOptions, CardType, CardValue, isEngine, isMobile, ToolbarItemOptions } from '@aomao/engine'
import './index.less'

export interface MapValue extends CardValue {
    title: string
    address: string
    url?: string
    province?: string
    city?: string
    staticUrl?: string
    point: {
        lat: number
        lng: number
    }
}

class MapComponent extends Card<MapValue> {
    
    static get cardName () {
        return 'map'
    }

    static get cardType () {
        return CardType.BLOCK
    }

    static get autoSelected() {
		return false;
	}

	static get singleSelectable(){
		return false
	}

    toolbar(): Array<CardToolbarItemOptions | ToolbarItemOptions> {
		if (!isEngine(this.editor) || this.editor.readonly) return [];

		const items: Array<CardToolbarItemOptions | ToolbarItemOptions> = [
			{
				type: 'copy',
			},
			{
				type: 'delete',
			},
		];

		return items.concat([
			{
				type: 'button',
				content: 'block',
				title: '独占一行',
				onClick: () => {
					this.type = CardType.BLOCK;
				},
			},
			{
				type: 'button',
				content: 'inline',
				title: '嵌入行内',
				onClick: () => {
					this.type = CardType.INLINE;
				},
			},
		]);
	}

    render(){
        const value = this.getValue()
        const container = this.type === CardType.BLOCK ? $(`<div class="map-container">
            <div class="title">${value?.title}</div>
            <div class="address">${value?.address}</div>
            <div class="img"><img src=${value?.staticUrl} /></div>
        </div>`) : $(`<span class="map-container-inline"><a>${value?.title}</a></span>`)
        return container
    }

    didRender(){
        super.didRender()
        if(this.type === CardType.BLOCK) this.toolbarModel?.setOffset([-120,0])
        else this.toolbarModel?.setOffset([0,0])
    }
}

export default MapComponent