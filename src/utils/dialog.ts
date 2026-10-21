/* 
	@parmas { isAlone } 独立的弹窗，不会覆盖前面的弹窗
	@params { cb } 关闭弹窗的回调
*/
import { createVNode, render, App } from 'vue';

const divDom = document.createElement('div');
document.body.appendChild(divDom);

const dialogPlguin = (component: Component, option: any) =>
	new Promise(() => {
		let pDom: HTMLDivElement;
		pDom = divDom;
		if (option?.isAlone) {
			pDom = document.createElement('div');
			document.body.appendChild(pDom);
		}
		const closePopup = () => {
			if (option?.isAlone) {
				document.body.removeChild(pDom);
			} else {
				render(null, pDom);
			}
			if (option?.cb) {
				option.cb()
			}
		};
		const vNode = createVNode(component, { ...option, closePopup });
		render(vNode, pDom);
	});

export default {
	install(app: App) {
		// eslint-disable-next-line no-param-reassign
		app.config.globalProperties.$dialog = dialogPlguin;
	},
};
