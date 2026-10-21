import { computed } from 'vue';
import { useRouter } from 'vue-router';
import useUserStore from '@/stores/user';

export default function useClickParent() {
	const router = useRouter();
	const store = useUserStore();
	const menus = computed(() => store.sideMenus);

	const clickMenu = (item: any) => {
		router.push({ path: item.path, query: item.query });
	};

	const clickParent = (keyName: string) => {
		const item = menus.value.find((menu: any) => menu.name === keyName);
		if (!item) return;
		if (item.path.indexOf('http') === 0) {
			window.open(item.path, '_blank');
			return;
		}
		if (item.children && item.children.length > 0) {
			clickMenu(item.children[0]);
		} else {
			clickMenu(item);
		}
	};

	return { clickParent };
}
