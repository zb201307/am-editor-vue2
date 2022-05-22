import {
	$,
	Plugin,
	isEngine,
	NodeInterface,
	CARD_KEY,
	isServer,
	CARD_VALUE_KEY,
	Parser,
	SchemaInterface,
	unescape,
	CARD_TYPE_KEY,
	READY_CARD_KEY,
	decodeCardValue,
} from '@aomao/engine';
import type MarkdownIt from 'markdown-it';
import CodeBlockComponent, {
	CodeBlockEditor,
	CodeBlockValue,
} from './component';
import locales from './locales';
import { CodeBlockOptions } from './types';

const DATA_SYNTAX = 'data-syntax';
export default class<
	T extends CodeBlockOptions = CodeBlockOptions,
> extends Plugin<T> {
	static get pluginName() {
		return 'codeblock';
	}

	init() {
		this.editor.language.add(locales);
		this.editor.on('parse:html', (node) => this.parseHtml(node));
		this.editor.on('paste:schema', (schema) => this.pasteSchema(schema));
		this.editor.on('paste:each', (child) => this.pasteHtml(child));
		if (isEngine(this.editor)) {
			this.editor.on('markdown-it', this.markdownIt);
		}
	}

	execute(mode: string, value: string) {
		if (!isEngine(this.editor)) return;
		const { card } = this.editor;
		const component = card.insert<
			CodeBlockValue,
			CodeBlockComponent<CodeBlockValue>
		>(CodeBlockComponent.cardName, {
			mode,
			code: value,
		});
		setTimeout(() => {
			component.focusEditor();
		}, 200);
	}

	hotkey() {
		return this.options.hotkey || '';
	}

	pasteSchema(schema: SchemaInterface) {
		schema.add([
			{
				type: 'block',
				name: 'pre',
				attributes: {
					[DATA_SYNTAX]: '*',
					class: '*',
					language: '*',
				},
			},
			{
				type: 'block',
				name: 'code',
				attributes: {
					[DATA_SYNTAX]: {
						required: true,
						value: '*',
					},
				},
			},
			{
				type: 'block',
				name: 'code',
				attributes: {
					language: {
						required: true,
						value: '*',
					},
				},
			},
			{
				type: 'block',
				name: 'code',
				attributes: {
					class: {
						required: true,
						value: '*',
					},
				},
			},
			{
				type: 'block',
				name: 'div',
				attributes: {
					[DATA_SYNTAX]: {
						required: true,
						value: '*',
					},
				},
			},
		]);
	}

	pasteHtml(node: NodeInterface) {
		if (!isEngine(this.editor) || node.isText()) return;
		if (
			node.get<HTMLElement>()?.hasAttribute(DATA_SYNTAX) ||
			node.name === 'pre'
		) {
			let syntax: string | undefined = node.attributes(DATA_SYNTAX);
			if (!syntax) {
				const getSyntaxForClass = (node: NodeInterface) => {
					const classList = node?.get<HTMLElement>()?.classList;
					if (!classList) return;
					for (let i = 0; i < classList.length; i++) {
						const className = classList.item(i);
						if (className && className.startsWith('language-')) {
							const classArray = className.split('-');
							classArray.shift();
							return classArray.join('-');
						}
					}
					return undefined;
				};
				if (node.name === 'pre') {
					syntax = node.attributes('language');
					if (!syntax) {
						syntax = getSyntaxForClass(node);
					}
				}
				const code = node.find('code');
				if (!syntax && code.length > 0) {
					syntax =
						code.attributes(DATA_SYNTAX) ||
						code.attributes('language');
					if (!syntax) {
						syntax = getSyntaxForClass(code);
					}
				}
			}
			let code = new Parser(node, this.editor).toText(
				undefined,
				undefined,
				false,
			);
			code = unescape(code.replace(/\u200b/g, ''));
			this.editor.card.replaceNode<CodeBlockValue>(node, 'codeblock', {
				mode: syntax || 'plain',
				code,
			});
			node.remove();
			return false;
		}
		return true;
	}

	markdownIt = (mardown: MarkdownIt) => {
		if (this.options.markdown !== false) {
			mardown.enable('code');
			mardown.enable('fence');
		}
	};

	parseHtml(root: NodeInterface) {
		if (isServer) return;

		root.find(
			`[${CARD_KEY}="${CodeBlockComponent.cardName}"],[${READY_CARD_KEY}="${CodeBlockComponent.cardName}"]`,
		).each((cardNode) => {
			const node = $(cardNode);
			const card = this.editor.card.find(
				node,
			) as CodeBlockComponent<CodeBlockValue>;
			const value =
				card?.getValue() ||
				decodeCardValue(node.attributes(CARD_VALUE_KEY));
			if (value) {
				node.empty();
				const synatxMap: { [key: string]: string } = {};
				CodeBlockComponent.getModes().forEach((item) => {
					synatxMap[item.value] = item.syntax;
				});
				const codeEditor = new CodeBlockEditor(this.editor, {
					synatxMap,
					styleMap: this.options.styleMap,
				});

				const content = codeEditor.container.find(
					'.data-codeblock-content',
				);
				content.css({
					border: '1px solid #e8e8e8',
					'max-width': '750px',
				});
				codeEditor.render(value.mode || 'plain', value.code || '');
				content.addClass('am-engine-view');
				content.hide();
				document.body.appendChild(content[0]);
				content.traverse((node) => {
					if (
						node.type === Node.ELEMENT_NODE &&
						(node.get<HTMLElement>()?.classList?.length || 0) > 0
					) {
						const element = node.get<HTMLElement>()!;
						const style = window.getComputedStyle(element);
						['color', 'margin', 'padding', 'background'].forEach(
							(attr) => {
								(element.style as any)[attr] =
									style.getPropertyValue(attr);
							},
						);
					}
				});
				content.show();
				content.css('background', '#f9f9f9');
				node.append(content);
				node.removeAttributes(CARD_KEY);
				node.removeAttributes(CARD_TYPE_KEY);
				node.removeAttributes(CARD_VALUE_KEY);
				node.attributes(DATA_SYNTAX, value.mode || 'plain');
				content.removeClass('am-engine-view');
			} else node.remove();
		});
	}
}
export { CodeBlockComponent };
export type { CodeBlockValue };
