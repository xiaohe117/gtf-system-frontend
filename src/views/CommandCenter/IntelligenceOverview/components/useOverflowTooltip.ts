import { nextTick, onMounted, onUnmounted, ref } from 'vue';

type OverflowKey = string | number;

const useOverflowTooltip = () => {
	const overflowKeys = ref<Set<OverflowKey>>(new Set());
	const textRefs = new Map<OverflowKey, HTMLElement>();
	let frameId = 0;

	const updateOverflow = () => {
		const nextKeys = new Set<OverflowKey>();

		textRefs.forEach((el, key) => {
			if (!el.isConnected) {
				textRefs.delete(key);
				return;
			}

			if (el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight) {
				nextKeys.add(key);
			}
		});

		overflowKeys.value = nextKeys;
	};

	const refreshOverflowTooltip = () => {
		nextTick(() => {
			if (frameId) {
				window.cancelAnimationFrame(frameId);
			}

			frameId = window.requestAnimationFrame(() => {
				updateOverflow();
				frameId = 0;
			});
		});
	};

	const setOverflowTooltipRef = (key: OverflowKey) => (el: unknown) => {
		if (el instanceof HTMLElement) {
			textRefs.set(key, el);
			return;
		}

		textRefs.delete(key);
	};

	const isOverflowTooltip = (key: OverflowKey) => overflowKeys.value.has(key);

	onMounted(() => {
		window.addEventListener('resize', refreshOverflowTooltip);
		refreshOverflowTooltip();
	});

	onUnmounted(() => {
		if (frameId) {
			window.cancelAnimationFrame(frameId);
		}

		window.removeEventListener('resize', refreshOverflowTooltip);
		textRefs.clear();
		overflowKeys.value = new Set();
	});

	return {
		isOverflowTooltip,
		refreshOverflowTooltip,
		setOverflowTooltipRef,
	};
};

export default useOverflowTooltip;
