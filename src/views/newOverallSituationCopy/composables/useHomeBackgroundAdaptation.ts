import { onBeforeUnmount, onMounted } from 'vue';

const appBgClassName = 'new-overall-situation-app-bg';

export default function useHomeBackgroundAdaptation() {
	let appBgResizeObserver: ResizeObserver | null = null;
	let appBgMutationObserver: MutationObserver | null = null;
	let appBgInitTimer: number | undefined;
	let appBgTimer: number | undefined;

	const getAppContainer = () => document.querySelector<HTMLElement>('.app-container');

	const updateAppBgHeight = () => {
		const appContainer = getAppContainer();

		if (!appContainer) {
			return;
		}

		const page = document.querySelector<HTMLElement>('.dept-overview');
		const pageTop = page ? page.getBoundingClientRect().top + window.scrollY : 0;
		const pageHeight = page ? page.scrollHeight : 0;
		const bgHeight = Math.ceil(Math.max(window.innerHeight, pageTop + pageHeight));

		appContainer.style.setProperty('--new-overall-situation-bg-height', `${bgHeight}px`);
	};

	const scheduleAppBgHeightUpdate = () => {
		if (appBgTimer) {
			window.clearTimeout(appBgTimer);
		}

		appBgTimer = window.setTimeout(() => {
			appBgTimer = undefined;
			updateAppBgHeight();
		});
	};

	const enableAppBgStretch = () => {
		const appContainer = getAppContainer();
		const page = document.querySelector<HTMLElement>('.dept-overview');

		if (!appContainer) {
			return;
		}

		appContainer.classList.add(appBgClassName);
		scheduleAppBgHeightUpdate();
		window.addEventListener('resize', scheduleAppBgHeightUpdate);

		if (typeof ResizeObserver !== 'undefined' && page) {
			appBgResizeObserver = new ResizeObserver(scheduleAppBgHeightUpdate);
			appBgResizeObserver.observe(page);
		}

		if (typeof MutationObserver !== 'undefined' && page) {
			appBgMutationObserver = new MutationObserver(scheduleAppBgHeightUpdate);
			appBgMutationObserver.observe(page, {
				attributes: true,
				childList: true,
				subtree: true,
			});
		}
	};

	const disableAppBgStretch = () => {
		const appContainer = getAppContainer();

		if (appBgInitTimer) {
			window.clearTimeout(appBgInitTimer);
			appBgInitTimer = undefined;
		}

		if (appBgTimer) {
			window.clearTimeout(appBgTimer);
			appBgTimer = undefined;
		}

		window.removeEventListener('resize', scheduleAppBgHeightUpdate);
		appBgResizeObserver?.disconnect();
		appBgMutationObserver?.disconnect();
		appBgResizeObserver = null;
		appBgMutationObserver = null;

		if (!appContainer) {
			return;
		}

		appContainer.classList.remove(appBgClassName);
		appContainer.style.removeProperty('--new-overall-situation-bg-height');
	};

	onMounted(() => {
		appBgInitTimer = window.setTimeout(() => {
			appBgInitTimer = undefined;
			enableAppBgStretch();
			window.dispatchEvent(new Event('resize'));
		});
	});

	onBeforeUnmount(() => {
		disableAppBgStretch();
	});
}
