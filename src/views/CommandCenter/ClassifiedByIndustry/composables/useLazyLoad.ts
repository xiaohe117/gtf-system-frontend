import { ref, onUnmounted, type Ref } from 'vue';

interface LazyLoadOptions {
	/** 滚动容器，默认为 viewport */
	root?: Ref<HTMLElement | null>;
	/** 提前预加载距离，默认 '200px 0px' */
	rootMargin?: string;
	/** 可见比例阈值，默认 0（进入即触发） */
	threshold?: number;
}

/**
 * 通用延迟加载：基于 IntersectionObserver 监听元素是否进入可视区域。
 * 一旦元素进入可视区域，对应 key 会被加入 visibleSet 且不再移除。
 *
 * @example
 * const { visibleSet, observe, disconnect } = useLazyLoad({ root: scrollRef })
 * // nextTick 后调用 observe
 * observe('item-1', el)
 * // 模板中：v-if="visibleSet.has('item-1')"
 */
export default function useLazyLoad(options: LazyLoadOptions = {}) {
	const { root, rootMargin = '200px 0px', threshold = 0 } = options;

	/** 已进入可视区域的 key 集合 */
	const visibleSet = ref<Set<string>>(new Set());
	let observer: IntersectionObserver | null = null;

	const ensureObserver = () => {
		if (observer) return observer;
		observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						const key = (entry.target as HTMLElement).dataset.lazyKey || '';
						if (key && !visibleSet.value.has(key)) {
							visibleSet.value = new Set(visibleSet.value);
							visibleSet.value.add(key);
						}
					}
				});
			},
			{ root: root?.value || null, rootMargin, threshold }
		);
		return observer;
	};

	/** 注册元素到观察列表 */
	const observe = (key: string, el: HTMLElement) => {
		el.dataset.lazyKey = key;
		ensureObserver().observe(el);
	};

	/** 重置：清空已加载集合并断开观察 */
	const reset = () => {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
		visibleSet.value = new Set();
	};

	onUnmounted(() => {
		if (observer) {
			observer.disconnect();
			observer = null;
		}
	});

	return { visibleSet, observe, reset };
}
