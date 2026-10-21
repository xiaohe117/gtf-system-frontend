<template>
	<div class="internet-big-data" ref="mainRef">
		<ul class="menu-list">
			<li v-if="showBack" class="back-btn" @click="goBack">返回</li>
			<li
				v-for="item in menuList"
				:key="item.key"
				:class="{ active: isActiveMenu(item) }"
				class="menu-item"
				@click.stop="selectMenu(item)"
				@mouseenter="openSubMenu(item)"
				@mouseleave="closeSubMenu(item)"
			>
				<div class="menu-item-content">
					<SvgIcon :name="item.icon" size="0.18rem" />
					<span>{{ item.name }}</span>
					<SvgIcon
						v-if="item.children"
						name="arrow-down"
						size="0.16rem"
						class="arrow-icon"
						:class="{ rotated: expandedMenu === item.key }"
					/>
				</div>
				<ul v-if="item.children" v-show="expandedMenu === item.key" class="sub-menu">
					<li
						v-for="sub in item.children"
						:key="sub.key"
						:class="{ active: activeMenu.key === sub.key }"
						@click.stop="selectSubMenu(sub)"
					>
						{{ sub.name }}
					</li>
				</ul>
			</li>
			<li class="full-screen" @click.stop="toggleFullScreen">
				<SvgIcon name="fullscreen" size="0.22rem" />
				<span>全屏</span>
			</li>
		</ul>
		<IframeView :key="iframeKey" :src="url" class="iframe-content" />
	</div>
</template>
<script lang="ts" setup>
import { getQxbToken } from '@/api/industry';

interface MenuItem {
	key: string;
	name: string;
	icon?: string;
	url?: string;
	children?: MenuItem[];
}

const menuList = ref<MenuItem[]>([
	{ key: '1', name: '企业画像', icon: 'ent-profile', url: '/enterprise-valuation/dashbord' },
	{ key: '2', name: '高级搜索', icon: 'more-search', url: '/search/advance' },
	{ key: '3', name: '产业洞察', icon: 'insight', url: '/industrial-insight/portal-home' },
	{
		key: '4',
		name: '产业资讯',
		icon: 'ic-news',
		url: '/recommend/company-recommend-real-time/meeting-dynamic',
	},
	{
		key: '5',
		name: '精准招商',
		icon: 'investment',
		children: [
			{ key: '5-1', name: '招商推荐', url: '/recommend/company-recommend/clue' },
			{ key: '5-2', name: '供应链招商', url: '/supply-chain/dashboard/supply-dashboard' },
			{ key: '5-3', name: '资本招商', url: '/capital-investment/capital/financing-dynamic' },
			{ key: '5-4', name: '地图招商', url: '/regional/regional-investment/map-search' },
			{ key: '5-5', name: '榜单招商', url: '/promotion-investment/promotion-group' },
			{ key: '5-6', name: '园区招商', url: '/park-module/park-search' },
			{ key: '5-7', name: '招商智达', url: '/relation/touch-relation/direct-contact' },
		],
	},
]);

const activeMenu = ref<MenuItem>(menuList.value[0]);
const expandedMenu = ref<string>('');
const url = ref('');
const iframeKey = ref(0);

// 切换菜单后强制重建 iframe，清空 iframe 内部的 history
const resetIframe = () => {
	iframeKey.value += 1;
};

const isActiveMenu = (item: MenuItem): boolean => {
	if (activeMenu.value.key === item.key) return true;
	if (item.children?.some((c) => c.key === activeMenu.value.key)) return true;
	return false;
};

const getUrl = async (): Promise<string> => {
	try {
		const res = await getQxbToken<string>({});
		if (res.code !== 0 || !res.data) return '';
		const BASE_URL = 'https://z-plugin.qixin.com/third-login?tenant=gd_gdyt1';
		const returnUrl = encodeURIComponent(activeMenu.value.url || '');
		const target = `${BASE_URL}&token=${res.data}&returnUrl=${returnUrl}`;
		url.value = target;
		return target;
	} catch {
		return '';
	}
};
getUrl();
const showBack = ref(false);
const selectMenu = (item: MenuItem) => {
	if (item.children?.length) return;
	activeMenu.value = item;
	showBack.value  = false
	expandedMenu.value = '';
	resetIframe();
	getUrl();
};

const openSubMenu = (item: MenuItem) => {
	if (item.children?.length) expandedMenu.value = item.key;
};

const closeSubMenu = (item: MenuItem) => {
	if (expandedMenu.value === item.key) expandedMenu.value = '';
};

const selectSubMenu = (sub: MenuItem) => {
	activeMenu.value = sub;
	expandedMenu.value = '';
	resetIframe();
	getUrl();
};

const toggleFullScreen = async () => {
	const target = await getUrl();
	if (target) window.open(target, '_blank');
};

const goBack = () => {
	window.history.back();
};

const listenPageMessage = (e: any) => {
	if (e.origin.indexOf('z-plugin.qixin.com') > -1 && e.data.path) {
		showBack.value = activeMenu.value.url?.indexOf(e.data.path) === -1;
	}
};
onMounted(() => {
	// 父页面：监听 message 事件
	window.addEventListener('message', listenPageMessage);
});
onBeforeUnmount(() => {
	window.removeEventListener('message', listenPageMessage);
});
</script>
<style lang="less" scoped>
.internet-big-data {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	&.fullscreen {
		background: #eaf0fa;
		padding-bottom: 0.24rem;
	}
	.menu-list {
		position: relative;
		background: #fff;
		height: 0.5rem;
		font-size: 0.18rem;
		padding: 0 0.24rem;
		border-radius: 0.08rem;
		display: flex;
		align-items: center;
		margin-bottom: 0.08rem;
		.icon {
			margin-right: 0.08rem;
		}
		.menu-item {
			position: relative;
			cursor: pointer;
			color: rgba(0, 0, 0, 0.85);
			padding: 0 0.16rem;
			height: 100%;
			display: flex;
			align-items: center;

			&.active {
				color: #165dff;
				.arrow-icon {
					color: #165dff;
				}
			}
			.menu-item-content {
				display: flex;
				align-items: center;
			}
			.arrow-icon {
				margin-left: 0.06rem;
				transition: transform 0.2s;
				&.rotated {
					transform: rotate(180deg);
				}
			}
			.sub-menu {
				position: absolute;
				top: 100%;
				left: 0;
				min-width: 1.4rem;
				background: #fff;
				box-shadow: 0 0.04rem 0.16rem rgba(0, 0, 0, 0.12);
				border-radius: 0.04rem;
				padding: 0.04rem 0;
				z-index: 10;
				li {
					padding: 0.08rem 0.24rem;
					color: rgba(0, 0, 0, 0.85);
					white-space: nowrap;
					cursor: pointer;
					&:hover {
						background: #f0f4ff;
					}
					&.active {
						color: #165dff;
						background: #f0f4ff;
					}
				}
			}
		}
		.full-screen {
			margin-left: auto;
			color: #165dff;
			cursor: pointer;
			display: flex;
			align-items: center;
		}
		.back-btn {
			color: #165dff;
			border: 0.01rem solid #165dff;
			border-radius: 0.04rem;
			padding: 0.04rem 0.24rem;
			cursor: pointer;
		}
	}
	.iframe-content {
		flex: 1;
		min-height: 0;
		overflow: hidden;
		:deep(.iframe-content) {
			height: 100%;
		}
	}
}
</style>
