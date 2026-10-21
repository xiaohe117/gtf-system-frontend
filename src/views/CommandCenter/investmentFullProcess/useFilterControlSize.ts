import { getSize } from '@/utils';

/** 设计稿高度 42px，等价 0.42rem（1920 宽、html fontSize=100） */
export const FILTER_CONTROL_DESIGN_PX = 42;
/** 设计稿字号 18px，等价 0.18rem */
export const FILTER_CONTROL_FONT_DESIGN_PX = 18;

/**
 * 与页面 rem 同一套算法算出尺寸。
 * 浏览器缩放会改变 clientWidth → getSize 同步变化；
 * 写成 px 内联，避免被 Element Plus 默认 32px / 14px 盖掉。
 */
export function syncFilterControlHeightPx() {
	return `${Math.max(1, Math.round(getSize(FILTER_CONTROL_DESIGN_PX)))}px`;
}

export function syncFilterControlFontPx() {
	return `${Math.max(1, Math.round(getSize(FILTER_CONTROL_FONT_DESIGN_PX)))}px`;
}

export function useFilterControlSize() {
	const height = ref(syncFilterControlHeightPx());
	const fontSize = ref(syncFilterControlFontPx());

	const sync = () => {
		height.value = syncFilterControlHeightPx();
		fontSize.value = syncFilterControlFontPx();
	};

	onMounted(() => {
		sync();
		window.addEventListener('resize', sync);
	});

	onUnmounted(() => {
		window.removeEventListener('resize', sync);
	});

	return { height, fontSize, sync };
}
