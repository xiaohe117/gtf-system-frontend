import { ref, computed, watch } from 'vue';
import { getQxbToken } from '@/api/industry';

const RETURN_URL_MAP: Record<string, string> = {
	'10101': 'industrial-insight/layout/detail?id=ed8fe005c27e06f33379010d836d14d9&locationFlag=2',
	'10103': 'industrial-insight/layout/detail?id=05436bf0c4d92676f899654c9ad33212&locationFlag=2',
	'10204': 'industrial-insight/layout/detail?id=8f34099884b46667b6110be3c66fb69b&locationFlag=2',
};

const BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';

export default function useEmpowermentUrl(industryCode: () => string | undefined) {
	const token = ref('');
	const loading = ref(false);

	const iframeSrc = computed(() => {
		const code = industryCode();
		const returnUrl = code ? RETURN_URL_MAP[code] : undefined;
		if (!token.value || !returnUrl) return '';
		return `${BASE_URL}&token=${encodeURIComponent(token.value)}&returnUrl=${encodeURIComponent(returnUrl)}`;
	});

	const fetchToken = async () => {
		const code = industryCode();
		if (!code || !RETURN_URL_MAP[code]) {
			token.value = '';
			return;
		}
		loading.value = true;
		try {
			const res = await getQxbToken();
			if (res.code === 0) {
				token.value = (res.data as string) || '';
			} else {
				token.value = '';
			}
		} finally {
			loading.value = false;
		}
	};

	watch(
		industryCode,
		() => {
			token.value = '';
			fetchToken();
		},
		{ immediate: true }
	);

	return { token, loading, iframeSrc };
}
