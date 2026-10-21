import { ref, onUnmounted, nextTick, type Ref } from 'vue';

export interface TextLineClampOptions {
	containerRef: Ref<HTMLElement | null>;
	itemSelector: string;
	bodySelector: string;
	topSectionSelector: string;
	bottomSectionSelector: string;
}

interface SectionMetrics {
	chromeHeight: number;
	lineHeight: number;
	naturalHeight: number;
}

const parseCssNumber = (value: string) => {
	const parsed = Number.parseFloat(value);
	return Number.isFinite(parsed) ? parsed : 0;
};

const getCssLengthInPx = (value: string, context: HTMLElement) => {
	const trimmedValue = value.trim();
	const numericValue = parseCssNumber(trimmedValue);
	if (!numericValue) return 0;
	if (trimmedValue.endsWith('rem')) {
		return (
			numericValue *
			parseCssNumber(window.getComputedStyle(document.documentElement).fontSize)
		);
	}
	if (trimmedValue.endsWith('em')) {
		return numericValue * parseCssNumber(window.getComputedStyle(context).fontSize);
	}
	return numericValue;
};

const getVerticalPadding = (element: HTMLElement) => {
	const style = window.getComputedStyle(element);
	return parseCssNumber(style.paddingTop) + parseCssNumber(style.paddingBottom);
};

const getTextLineHeight = (element: HTMLElement) => {
	const style = window.getComputedStyle(element);
	const lineHeight = parseCssNumber(style.lineHeight);
	if (lineHeight) return lineHeight;
	return (parseCssNumber(style.fontSize) || 13) * 1.6;
};

const getNormalSectionGap = (element: HTMLElement) => {
	const style = window.getComputedStyle(element);
	const gapValue = style.getPropertyValue('--section-gap') || style.rowGap || style.gap;
	return getCssLengthInPx(gapValue, element);
};

const getLineClamp = (height: number, lineHeight: number) =>
	Math.max(1, Math.floor((height + 1) / lineHeight));

const measureFullTextHeight = (textElement: HTMLElement) => {
	const { width } = textElement.getBoundingClientRect();
	if (width <= 0) return textElement.scrollHeight;

	const clone = textElement.cloneNode(true) as HTMLElement;
	clone.removeAttribute('style');
	clone.style.position = 'absolute';
	clone.style.visibility = 'hidden';
	clone.style.pointerEvents = 'none';
	clone.style.left = '0';
	clone.style.top = '0';
	clone.style.width = `${width}px`;
	clone.style.height = 'auto';
	clone.style.maxHeight = 'none';
	clone.style.overflow = 'visible';
	clone.style.display = 'block';
	clone.style.setProperty('-webkit-line-clamp', 'unset');
	clone.style.setProperty('line-clamp', 'unset');
	clone.style.setProperty('-webkit-box-orient', 'initial');

	textElement.parentElement?.appendChild(clone);
	const fullHeight = clone.scrollHeight;
	clone.remove();
	return fullHeight;
};

const getSectionMetrics = (section: HTMLElement): SectionMetrics | null => {
	const titleElement = section.querySelector<HTMLElement>('.section-title');
	const listElement = section.querySelector<HTMLElement>('.section-list');
	const textElement = section.querySelector<HTMLElement>('.item-text');
	if (!titleElement || !listElement || !textElement) return null;

	const chromeHeight = titleElement.offsetHeight + getVerticalPadding(listElement);
	const lineHeight = getTextLineHeight(textElement);
	const textHeight = measureFullTextHeight(textElement);

	return {
		chromeHeight,
		lineHeight,
		naturalHeight: chromeHeight + textHeight,
	};
};

const isSameRecord = <T extends number | boolean>(
	oldRecord: Record<string, T>,
	newRecord: Record<string, T>
) => {
	const oldKeys = Object.keys(oldRecord);
	const newKeys = Object.keys(newRecord);
	return (
		oldKeys.length === newKeys.length &&
		newKeys.every((key) => oldRecord[key] === newRecord[key])
	);
};

export function useTextLineClamp(options: TextLineClampOptions) {
	const { containerRef, itemSelector, bodySelector, topSectionSelector, bottomSectionSelector } =
		options;

	const lineClampValues = ref<Record<string, number>>({});
	const bottomHiddenValues = ref<Record<string, boolean>>({});

	let resizeObserver: ResizeObserver | null = null;
	let calcRaf = 0;

	const calcFunc = () => {
		const root = containerRef.value;
		if (!root) return;

		const nextLineClampValues: Record<string, number> = {};
		const nextBottomHiddenValues: Record<string, boolean> = {};

		root.querySelectorAll<HTMLElement>(itemSelector).forEach((element) => {
			const bodyElement = element.querySelector<HTMLElement>(bodySelector);
			const topSection = element.querySelector<HTMLElement>(topSectionSelector);
			const bottomSection = element.querySelector<HTMLElement>(bottomSectionSelector);
			if (!bodyElement || !topSection || !bottomSection) return;

			const topKey = topSection.dataset.key || '';
			const bottomKey = bottomSection.dataset.key || '';
			if (!topKey || !bottomKey) return;

			const bodyHeight = bodyElement.clientHeight;
			const topMetrics = getSectionMetrics(topSection);
			const bottomMetrics = getSectionMetrics(bottomSection);
			if (bodyHeight <= 0 || !topMetrics || !bottomMetrics) return;

			const sectionGap = getNormalSectionGap(bodyElement);
			const bottomMinHeight = bottomMetrics.chromeHeight + bottomMetrics.lineHeight;
			const shouldHideBottom =
				topMetrics.naturalHeight + sectionGap + bottomMinHeight > bodyHeight;
			const topHeight = shouldHideBottom ? bodyHeight : topMetrics.naturalHeight;
			const topContentHeight = Math.max(0, topHeight - topMetrics.chromeHeight);

			nextLineClampValues[topKey] = getLineClamp(topContentHeight, topMetrics.lineHeight);
			nextBottomHiddenValues[bottomKey] = shouldHideBottom;

			if (!shouldHideBottom) {
				const bottomHeight = Math.max(0, bodyHeight - topHeight - sectionGap);
				const bottomContentHeight = Math.max(
					0,
					bottomHeight - bottomMetrics.chromeHeight
				);
				nextLineClampValues[bottomKey] = getLineClamp(
					bottomContentHeight,
					bottomMetrics.lineHeight
				);
			}
		});

		if (!isSameRecord(lineClampValues.value, nextLineClampValues)) {
			lineClampValues.value = nextLineClampValues;
		}
		if (!isSameRecord(bottomHiddenValues.value, nextBottomHiddenValues)) {
			bottomHiddenValues.value = nextBottomHiddenValues;
		}
	};

	const scheduleCalc = () => {
		nextTick(() => {
			if (calcRaf) {
				window.cancelAnimationFrame(calcRaf);
			}
			calcRaf = window.requestAnimationFrame(() => {
				calcRaf = 0;
				calcFunc();
			});
		});
	};

	const initResizeObserver = () => {
		if (!containerRef.value) return;
		resizeObserver?.disconnect();
		resizeObserver = new ResizeObserver(() => {
			scheduleCalc();
		});
		resizeObserver.observe(containerRef.value);
	};

	const destroy = () => {
		if (calcRaf) {
			window.cancelAnimationFrame(calcRaf);
		}
		if (resizeObserver) {
			resizeObserver.disconnect();
		}
	};

	onUnmounted(() => {
		destroy();
	});

	return {
		lineClampValues,
		bottomHiddenValues,
		initResizeObserver,
		scheduleCalc,
		destroy,
	};
}