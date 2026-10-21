<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-03-23 14:07:57
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-02 16:52:15
-->
<template>
	<div class="top-header">
		<div class="left-text">
			<img src="@/assets/images/menuLayout/sys-logo.png" alt="" />
			<h4>招商引资联合指挥平台</h4>
		</div>
		<div class="right-menu">
			<ul class="menu">
				<li
					v-for="(item, index) in menuItems"
					@click="clickMenu(item)"
					:key="index"
					class="menu-item"
					:class="{ active: activeMenu.path === item.path }"
				>
					{{ item.label }}
				</li>
			</ul>
			<div class="right-btn">
				<div v-if="activeMenu?.redirect?.includes('/operationCenter/enterprise')" class="manual-btn btn" @click="downloadPdf">
					<img src="@/assets/images/menuLayout/manual-btn.png" alt="" />
					<span>操作手册</span>
				</div>
				<el-popover
					:visible="todoVisible"
					ref="popoverRef"
					trigger="click"
					placement="bottom"
					persistent
					popper-class="todo-popper"
					:popper-style="{ padding: '0', width: '10.74rem', maxWidth: 'none' }"
				>
					<template #reference>
						<div class="btn todo-btn" @click="openTodo">
							<img src="@/assets/images/menuLayout/alarm.svg" alt="" />
							<span>{{ `个人事项` }}</span>
						</div>
					</template>
					<MayorWorkbench v-if="todoVisible" />
					<div class="close-btn" @click="todoVisible = false"></div>
				</el-popover>
				<div class="btn ai-btn" @click="goPage" v-has-permission="['AI_Link_Btn']">
					<img src="@/assets/images/menuLayout/ai-logo.gif" alt="" />
					<span>AI助手</span>
				</div>
				<el-dropdown @command="handleCommand">
					<div class="btn user-btn">
						<img src="@/assets/images/common/admin-avatar.png" alt="" />
						<span class="name">{{ userName || '管理员' }}</span>
						<el-icon class="icon"><ArrowDown /></el-icon>
					</div>
					<template #dropdown>
						<el-dropdown-menu>
							<el-dropdown-item command="logout">退出登录</el-dropdown-item>
						</el-dropdown-menu>
					</template>
				</el-dropdown>
			</div>
		</div>
		<DefaultDialog ref="defaultDialogRef" class="my-dialog">
			<IframeView
				src="https://model.rzwit.com/ProductModeling/storage/201703240001/449150819/trunk/DEMO/file/hbys-07-2/gmrk.html"
				title="智能谈参演"
			/>
		</DefaultDialog>
	</div>
</template>
<script lang="ts" setup>
import usePermissionStore from '@/stores/permission';
import useUserStore from '@/stores/user';
import authService from '@/services/auth';
import DefaultDialog from '@/components/DefaultDialog.vue';
import { useRouter, useRoute } from 'vue-router';
import IframeView from '@/components/IframeView.vue';
import MayorWorkbench from '@/views/MayorWorkbench/Index.vue';
// import { getVisitCount } from '@/api/leaderWorkbench';
// import menus from './menu';

const store = useUserStore();
const permissionStore = usePermissionStore();
const menuItems = computed(() =>
	(permissionStore.menus || [])
);
const userName = computed(() => authService.getUserInfo()?.username);
const router = useRouter();
const route = useRoute();

const handleCommand = (command: string) => {
	switch (command) {
		case 'logout':
			authService.logout();
			break;
		default:
			break;
	}
};

// ------------------------------------- 个人事项------------------------------------------------

const todoVisible = ref<any>(false);
// const todoCount = ref(0);

// /** 获取待办数量 */
// const fetchTodoCount = async () => {
// 	const permission: any = authService.getUserInfo()?.permission || [];
// 	// 没有权限不显示数量
// 	if (!permission.includes('Mayor_Workbench')) {
// 		return;
// 	}
// 	try {
// 		const res = await getVisitCount<number>({
// 			submitLeader: authService.getUserInfo()?.username,
// 		});
// 		// eslint-disable-next-line no-console
// 		todoCount.value = res.data ?? 0;
// 	} catch {
// 		todoCount.value = 0;
// 	}
// };

// onMounted(() => {
// 	fetchTodoCount();
// });

const openTodo = () => {
	const permission: any = authService.getUserInfo()?.permission || [];
	// 没有权限不显示工作台
	if (!permission.includes('Mayor_Workbench')) {
		return;
	}
	todoVisible.value = !todoVisible.value;
};

// ------------------------------------- 顶部ai图标按钮相关模块------------------------------------------------

const findMenuByPath = (data: any[], parent?: any): any => {
	// eslint-disable-next-line no-restricted-syntax
	for (const ele of data) {
		if (ele.path === route.path) {
			return parent || ele;
		}
		if (ele.children && ele.children.length > 0) {
			const found = findMenuByPath(ele.children, parent || ele);
			if (found) {
				return found;
			}
		}
	}
	return null;
};

const activeMenu: any = computed(() => {
	const obj = findMenuByPath(menuItems.value);
	if (!obj) {
		return store.activeMenus;
	}
	return obj || {};
});
watch(
	() => activeMenu.value,
	() => {
		store.setSideMenus(activeMenu.value?.children || []);
		console.log('activeMenu.value', activeMenu.value);
		store.setActiveMenus(activeMenu.value);
	},
	{ deep: true, immediate: true }
);

const clickMenu = (item: any) => {
	if (item.path.indexOf('http') === 0) {
		window.open(item.path, '_blank');
		return;
	}
	router.push({ path: item.path });
};

const goPage = () => {
	const url = router.resolve({ path: '/iframeOnlyHeader/assistant' });
	window.open(url.href, '_blank');
};

const downloadPdf = () => {
	window.open('./static/广州市招商引资联合指挥平台操作指引.pdf', '_blank');
};
</script>
<style lang="less" scoped>
.top-header {
	height: 0.87rem;
	background: url('@/assets/images/menuLayout/top-bg.png');
	background-size: 100% 100%;
	background-position-y: -0.01rem;
	background-position-x: -0.01rem;
	display: flex;
	.left-text {
		height: 100%;
		display: flex;
		align-items: center;
		width: 6.84rem;
		padding-left: 0.21rem;
		img {
			width: 1.15rem;
			height: 0.39rem;
		}
		h4 {
			margin: 0;
			margin-left: 0.3rem;
			font-family: YouSheBiaoTiHei;
			font-size: 0.42rem;
			color: #ffffff;
			font-weight: 400;
			line-height: 0.42rem;
			text-shadow: 0px 0.04rem 0.04rem rgba(7, 21, 154, 0.7);
			text-align: left;
			font-style: normal;
		}
	}
	.right-menu {
		flex: 1;
		height: 100%;
		width: calc(100% - 13.68rem);
		display: flex;
		.menu {
			flex: 1;
			height: 100%;
			display: flex;
			align-items: flex-end;
			li {
				background-image: url('@/assets/images/common/menu_normal.png');
				background-size: 100% 100%;
				width: 1.51rem;
				height: 0.59rem;
				line-height: 0.59rem;
				font-family: YouSheBiaoTiHei;
				font-size: 0.22rem;
				color: #fff;
				letter-spacing: 0.01rem;
				text-shadow: 0 0.04rem 0.07rem rgba(0, 0, 0, 0.5);
				text-decoration: none;
				text-align: center;
				cursor: pointer;
				margin-right: 0.2rem;
				&:hover,
				&.active {
					background-image: url('@/assets/images/common/menu_hover.png');
					background-size: 100% 100%;
				}
			}
		}
		.right-btn {
			display: flex;
			position: relative;
			padding-top: 0.26rem;
			padding-right: 0.2rem;
			.btn {
				white-space: nowrap;
				height: 0.42rem;
				display: flex;
				align-items: center;
				justify-content: center;
				background: linear-gradient(180deg, #f1f7ff 0%, #dfecff 100%);
				box-shadow: 0 0 0.06rem 0 rgba(44, 118, 226, 0.4);
				border-radius: 0.25rem;
				border: 0.01rem solid #4ab3fb;
				font-family:
					PingFangSC,
					PingFang SC;
				font-weight: 400;
				font-size: 0.16rem;
				color: #3489ff;
				margin-right: 0.23rem;
				cursor: pointer;
				outline: none !important;
				&:last-child {
					margin-right: 0;
				}
				&.ai-btn {
					width: 1.2rem;
					position: relative;
					&:hover {
						background: #2d5cf6;
						color: #ffffff;
					}
					img {
						position: absolute;
						width: 0.64rem;
						height: 0.57rem;
						left: -0.32rem;
						top: -0.11rem;
					}
				}
				&.manual-btn {
					width: 1.5rem;
					padding: 0 0.16rem 0 0.08rem;
					&:hover {
						background: #2d5cf6;
						color: #ffffff;
					}
					img {
						width: 0.36rem;
						height: 0.44rem;
					}
				}
				&.user-btn {
					padding: 0 0.16rem 0 0.08rem;
					img {
						width: 0.29rem;
						height: 0.29rem;
						margin-right: 0.05rem;
					}
					.icon {
						font-size: 0.15rem;
						margin-left: 0.08rem;
					}
				}
				&.todo-btn {
					padding: 0 0.16rem 0 0.08rem;
					margin-right: 0.32rem;
					&:hover {
						background: #2d5cf6;
						color: #ffffff;
					}
					img {
						width: 0.3rem;
						height: 0.3rem;
						margin-right: 0.08rem;
					}
				}
			}
		}
	}
}
:deep(.my-dialog) {
	margin: 0.2rem auto !important ;
	height: 908px;
	width: 1170px;
}
.close-btn {
	background: url('@/assets/images/gtf/dialog-close.png') no-repeat center center;
	background-size: 100%;
	width: 0.72rem;
	height: 0.63rem;
	position: absolute;
	top: -0.02rem;
	right: -0.01rem;
	cursor: pointer;
}
</style>
