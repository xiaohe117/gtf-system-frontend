<template>
	<div class="layout-header">
		<div class="header-left">
			<div class="logo-container">
				<h1 class="logo-title">招商引资联合指挥平台-指挥中枢</h1>
				<div class="home-btn common-btn">
					<ul class="home_menu">
						<li v-for="(it, index) in homeItems" :key="index" @click="handleHome(it)">
							{{ it.label }}
						</li>
					</ul>
				</div>
			</div>

			<div class="menu-container">
				<div
					v-for="item in menuItems"
					:key="item.path"
					class="menu-item"
					:class="{
						'menu-item--active': activeMenu === item.path,
						'menu-item--disabled': item.path === '/classifiedByIndustry',
					}"
					@mouseenter="handleMouseEnter(item)"
					@mouseleave="handleMouseLeave"
				>
					<div
						class="menu-link"
						:class="{ 'menu-link--disabled': item.path === '/classifiedByIndustry' }"
						@click="handleClick(item, '0')"
					>
						{{ item.label }}
					</div>
					<!-- 二级菜单 -->
					<div
						v-if="item.children && hoverMenuPath === item.path"
						class="submenu level-2"
						@mouseenter="keepSubmenuOpen"
						@mouseleave="handleMouseLeave"
					>
						<div
							v-for="subItem in item.children"
							:key="subItem.path"
							class="submenu-item"
							@mouseenter="handleSubMouseEnter(subItem)"
						>
							<div class="submenu-link" @click="handleClick(subItem, '1')">
								{{ subItem.label }}
							</div>

							<!-- 三级菜单 -->
							<div
								v-if="subItem.children && activeSubMenu === subItem.path"
								class="submenu level-3"
								@mouseenter="keepSubmenuOpen"
							>
								<div
									v-for="thirdItem in subItem.children"
									:key="thirdItem.path"
									class="submenu-item"
								>
									<div class="submenu-link" @click="handleClick(thirdItem, '2')">
										<span class="maintitle">{{ thirdItem.label }}</span>
										<span v-if="thirdItem.subtitle" class="subtitle">
											{{ thirdItem.subtitle }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="header-right">
			<!-- icon图标 -->
			<img
				class="ai-icon"
				:src="getUrl(`home/ai-icon.png`)"
				@click="DefaultDialogRef?.show"
			/>

			<el-dropdown @command="handleCommand">
				<div class="admin-info">
					<span class="admin-avatar"></span>
					<span class="admin-name">{{ userName || '管理员' }}</span>
					<el-icon class="arrow-icon"><ArrowDown /></el-icon>
				</div>
				<template #dropdown>
					<el-dropdown-menu>
						<el-dropdown-item command="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</template>
			</el-dropdown>
		</div>

		<DefaultDialog ref="DefaultDialogRef" class="my-dialog">
			<IframeView
				src="https://model.rzwit.com/ProductModeling/storage/201703240001/449150819/trunk/DEMO/file/hbys-07-2/gmrk.html"
				title="智能谈参演"
			/>
		</DefaultDialog>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import authService from '@/services/auth';
import router from '@/router';
import { getUrl } from '@/utils';
import DefaultDialog from '@/components/DefaultDialog.vue';
// import IframeView from '@/components/IframeView.vue';
// src\components\IframeView.vue
import IframeView from '@/components/IframeView.vue';
// import { downloadFile } from '@/api/upload.ts';
import ServiceUrl from '@/utils/url'

const route = useRoute();
const userName = computed(() => authService.getUserInfo()?.username);

const handleCommand = (command: string) => {
	switch (command) {
		case 'logout':
			authService.logout();
			break;
		default:
			break;
	}
};

/*
const downloadPdf = async () => {
	downloadFile('1983827969429229570');
};
*/

const homeItems: any[] = [
	{
		label: '指挥中枢',
		path: '',
	},
	{
		label: '项目中心',
		path: `${ServiceUrl.getQmSysUrl()}/pc/login?redirect=/index/workbenches`,
	},
	{
		label: '目标企业中心',
		path: '',
	},
];

const menuItems: any[] = [
	{
		path: '/overallSituation',
		label: '整体情况',
	},
	{
		path: '/classifiedByIndustry',
		label: '按产业分',
	},
	{
		path: '/runByEnterprise',
		label: '按企业跑',
		children: [
			{
				path: '/runByEnterprise',
				label: '目标企业',
				children: [
					{
						path: '/',
						label: '管理后台',
						subtitle: '',
					},
				],
			},
			{
				path: '',
				label: '企业研判',
				children: [
					{
						path: '',
						label: '企业发展潜力评估',
						subtitle: '(广州市城规院企业分析平台)',
					},
					{
						path: 'https://max.pedata.cn',
						label: '企业投融资信息',
						subtitle: '（清科私募通）',
					},
					{
						path: 'https://app.wanlou.com',
						label: '大数据招商',
						subtitle: '(万楼数据)',
					},
				],
			},
		],
	},
	{
		path: '/recruitmentByProject',
		label: '按项目招',
	},
];

const activeMenu = ref<string | null>(null);
const hoverMenuPath = ref<string | null>(null);
const activeSubMenu = ref<string | null>(null);
let leaveTimeout: ReturnType<typeof setTimeout> | null = null;

const updateActiveMenuByRoute = () => {
	const currentPath = route.path;

	const matchedMenu = menuItems.find((item) => {
		if (item.path && currentPath.startsWith(item.path)) {
			return true;
		}
		if (item.children) {
			const matched = item.children.some(
				(child: any) => child.path && currentPath.startsWith(child.path)
			);
			return matched;
		}
		return false;
	});

	if (matchedMenu && matchedMenu.path) {
		activeMenu.value = matchedMenu.path;
		activeSubMenu.value = null;
	}
};

onMounted(() => {
	updateActiveMenuByRoute();
});

watch(
	() => route.path,
	() => {
		updateActiveMenuByRoute();
	}
);

const handleHome = (item: any) => {
	if (item.label === '目标企业中心') {
		window.open(ServiceUrl.adminUrl, '_blank');
	} else if (item.label === '项目中心') {
		window.open(item.path, '_blank');
	}
};

const handleClick = (item: any, level: string) => {
	if (level === '0' || level === '1') {
		if (item.path) {
			if (item.path === '/classifiedByIndustry') {
				return;
			}
			activeMenu.value = item.path;
			activeSubMenu.value = null;
			router.push(item.path);
		}
	} else if (level === '2') {
		if (item.path) {
			if (item.label === '管理后台') {
				window.open(ServiceUrl.adminUrl, '_blank');
			} else {
				window.open(item.path, '_blank');
			}
		}
	}
};

const handleMouseEnter = (item: any) => {
	// 按产业分菜单不触发hover高亮和子菜单显示
	if (item.path === '/classifiedByIndustry') {
		return;
	}

	if (leaveTimeout) {
		clearTimeout(leaveTimeout);
		leaveTimeout = null;
	}
	hoverMenuPath.value = item.path;
	activeSubMenu.value = null;
};

const handleSubMouseEnter = (subItem: any) => {
	if (leaveTimeout) {
		clearTimeout(leaveTimeout);
		leaveTimeout = null;
	}
	activeSubMenu.value = subItem.path;
};

const handleMouseLeave = () => {
	leaveTimeout = setTimeout(() => {
		hoverMenuPath.value = null;
		activeSubMenu.value = null;
	}, 100);
};

const keepSubmenuOpen = () => {
	if (leaveTimeout) {
		clearTimeout(leaveTimeout);
		leaveTimeout = null;
	}
};
// ------------------------------------- 顶部ai图标按钮相关模块------------------------------------------------
const DefaultDialogRef = ref<InstanceType<typeof DefaultDialog> | null>(null);
// ------------------------------------- 顶部ai图标按钮相关模块------------------------------------------------
</script>

<style lang="less" scoped>
.layout-header {
	height: 0.96rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.2rem;
	position: relative;
	z-index: 100;
	background-image: url('@/assets/images/common/header_bg.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	background-color: #deebfe;
	background-position-y: -0.01rem;
	background-position-x: -0.01rem;
}

.header-left {
	display: flex;
	align-items: center;
}

.logo-container {
	display: flex;
	align-items: center;
	margin-right: 20px;

	.logo-title {
		font-family: 'YouSheBiaoTiHei';
		font-size: 0.4rem;
		color: #fff;
		line-height: 0.52rem;
		text-shadow: 0px 0.04rem 0.04rem rgba(7, 21, 154, 0.7);
		font-weight: 400;
		margin-bottom: 0.21rem;
	}
	.common-btn {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		display: inline-block;
		cursor: pointer;
		margin-top: 0.25rem;
	}
	.home-btn {
		background-image: url('@/assets/images/common/switch_system_1.png');
		width: 0.72rem;
		height: 0.72rem;
		margin-left: 1.2rem;
		position: relative;
		.home_menu {
			display: none;
		}
		&:hover {
			background-image: url('@/assets/images/common/switch_system_hover_1.png');
			.home_menu {
				display: block;
				position: absolute;
				top: 0.05rem;
				left: -0.05rem;
				width: 2.48rem;
				height: 2.78rem;
				z-index: -1;
				background-image: url('@/assets/images/common/home_submenu_hover.png');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				padding-top: 0.8rem;
				li {
					background-image: url('@/assets/images/common/home_menu_normal.png');
					background-size: 100% 100%;
					background-repeat: no-repeat;
					width: 1.56rem;
					height: 0.42rem;
					display: flex;
					align-items: center;
					justify-content: flex-start;
					padding-left: 0.2rem;
					color: #fff;
					font-family: MicrosoftYaHei, MicrosoftYaHei;
					font-weight: bold;
					font-size: 0.18rem;
					line-height: 0.22rem;
					text-shadow: 0px 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
					text-decoration: none;
					margin-left: 0.2rem;
					margin-bottom: 0.2rem;
					&:hover {
						background-image: url('@/assets/images/common/home_menu_hover.png');
						cursor: pointer;
					}
				}
			}
		}
	}
}

.header-right {
	display: flex;
	align-items: center;
	gap: 0.23rem;
}

.admin-info {
	display: flex;
	align-items: center;
	cursor: pointer;
	padding: 0.06rem 0.08rem;
	border-radius: 0.04rem;
	transition: background-color 0.3s;

	background: linear-gradient(180deg, #f1f7ff 0%, #dfecff 100%);
	box-shadow: 0 0 0.06rem 0 rgba(44, 118, 226, 0.4);
	border-radius: 0.25rem;
	border: 0.01rem solid #4ab3fb;

	&:hover,
	&:focus {
		outline: none;
	}

	.admin-avatar {
		background-image: url('@/assets/images/common/admin-avatar.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 0.29rem;
		height: 0.29rem;
		display: inline-block;
		&:hover,
		&:focus {
			outline: none;
		}
	}

	.admin-name {
		margin-right: 0.04rem;
		margin-left: 0.04rem;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 500;
		font-size: 0.16rem;
		color: #3489ff;
	}

	.arrow-icon {
		font-size: 12px;
		color: #909399;
		svg {
			color: #3489ff;
		}
	}
}
.manual {
	background-image: url('@/assets/images/common/manual.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 1.97rem;
	height: 0.82rem;
	display: inline-block;
	text-indent: -9999px;
	cursor: pointer;
}

// menu
.menu-container {
	display: flex;
	align-items: center;
	justify-content: flex-start;
	margin-top: 0.3rem;
}

.menu-item {
	position: relative;
	margin-right: 0.2rem;

	&.menu-item--active .menu-link {
		background-image: url('@/assets/images/common/menu_hover.png');
	}
}

.menu-link {
	display: flex;
	align-items: center;
	justify-content: center;
	transition: all 0.3s ease;
	position: relative;
	background-image: url('@/assets/images/common/menu_normal.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 1.51rem;
	height: 0.59rem;
	font-family: YouSheBiaoTiHei;
	font-size: 0.22rem;
	color: #fff;
	letter-spacing: 0.01rem;
	text-shadow: 0 0.04rem 0.07rem rgba(0, 0, 0, 0.5);
	text-decoration: none;
	text-align: center;
	z-index: 1000;

	&:hover {
		background-image: url('@/assets/images/common/menu_hover.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		cursor: pointer;
	}

	// 按产业分菜单禁用hover高亮效果
	&.menu-link--disabled {
		&:hover {
			background-image: url('@/assets/images/common/menu_normal.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			cursor: default;
		}
	}
}

.submenu {
	// animation: slideDown 0.3s ease;
}

.submenu.level-2 {
	position: absolute;
	top: -0.05rem;
	left: -0.05rem;
	width: 1.63rem;
	height: 2.11rem;
	background-image: url('@/assets/images/common/submenu_hover.png');
	background-size: 100% 100%;
	background-repeat: no-repeat;
	padding-top: 0.8rem;
	.submenu-link {
		background-image: url('@/assets/images/common/home_menu_normal.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 1.4rem;
		height: 0.48rem;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding-left: 0.2rem;
		color: #fff;
		font-family: MicrosoftYaHei, MicrosoftYaHei;
		font-weight: bold;
		font-size: 0.18rem;
		line-height: 0.22rem;
		text-shadow: 0px 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
		text-decoration: none;
		&:hover {
			background-image: url('@/assets/images/common/home_menu_hover.png');
			cursor: pointer;
		}
	}
	.submenu-item {
		position: relative;
		margin-bottom: 0.2rem;
		margin-left: 0.1rem;
	}
}

.submenu.level-3 {
	position: absolute;
	top: 0;
	left: 100%;
	margin-top: 0;
	margin-left: 10px;
	.submenu-item {
		margin-left: 0.3rem;
		&::before {
			content: '';
			top: -0.45rem;
			left: -0.25rem;
			width: 0.2rem;
			height: 0.8rem;
			position: absolute;
			background-image: url(/src/assets/images/common/second_submenu.png);
			background-size: 100% 100%;
			background-repeat: no-repeat;
		}
		&:first-child {
			&::before {
				top: 0.15rem;
				left: -0.55rem;
				width: 0.51rem;
				height: 0.16rem;
				background-image: url(/src/assets/images/common/first_submenu.png);
			}
		}
	}
	.submenu-link {
		background-image: url('@/assets/images/common/submenu_level3_normal.png');
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 2.36rem;
		height: 0.58rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		text-shadow: none;
		justify-content: center;
		&:hover {
			background-image: url('@/assets/images/common/submenu_level3_hover.png');
			cursor: pointer;
			span {
				color: #fff;
			}
		}
		span {
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 500;
			font-size: 0.16rem;
			color: #165dff;
			white-space: nowrap;
		}
		.subtitle {
			color: #999;
		}
	}
}

@keyframes slideDown {
	from {
		opacity: 0;
		transform: translateY(-10px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

:deep(.my-dialog) {
	margin: 0.2rem auto !important ;
	height: 908px;
	width: 1170px;
}
.ai-icon {
	height: 0.8rem;
}
</style>
