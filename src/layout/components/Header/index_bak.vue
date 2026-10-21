<template>
	<header class="header">
		<div class="logo-section">
			<span class="logo-text">招商引资联合指挥平台-指挥中枢</span>
		</div>
		<div class="tab-section">
			<img
				v-if="!arrowShow"
				class="arrow-icon"
				@click="handleClick"
				src="@/assets/images/header/arrow-circle.png"
				alt=""
			/>
			<div
				v-for="(tab, index) in tabs.slice(0, 4)"
				:key="tab.id"
				:class="['first-tab', { active: index === activeIndex }]"
				@click="handleTabClick(tab, index)"
			>
				<div :class="['tab-font', { 'font-active': index === activeIndex }]">
					{{ tab.label }}
				</div>
				<img
					class="construction"
					v-if="index !== activeIndex"
					src="data:image/png;base64,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"
					alt=""
				/>
			</div>
		</div>
		<div class="right-section">
			<div class="area-section">
				<span class="text">广州市</span>
				<el-icon class="down-arrow"><ArrowDown /></el-icon>
			</div>
			<div class="area-section user-section" @click="toggleUserMenu">
				<span class="text">{{ currentUser }}</span>
				<el-icon class="down-arrow"><ArrowDown /></el-icon>
				<div v-if="showUserMenu" class="user-dropdown">
					<div class="dropdown-item" @click.stop="handleLogout">
						<el-icon><SwitchButton /></el-icon>
						<span>退出登录</span>
					</div>
				</div>
			</div>
		</div>
	</header>
	<div :class="['subTab-box', { 'subTab-box_collapse': !arrowShow }]">
		<img
			class="img"
			src="@/assets/images/header/arrow-circle.png"
			alt=""
			@click="handleClick"
		/>
		<div :class="['subTab-tab', { show: !arrowShow }]">
			<div
				v-for="(tab, index) in tabs.slice(4, 8)"
				:key="tab.id"
				:class="['subTab-item', { 'active-item': tabSubSelect === tab.path }]"
				@click="handleSubTabClick(tab, index)"
			>
				<div :class="['sub-font', { 'sub-font-active': tabSubSelect === tab.path }]">
					{{ tab.label }}
				</div>
				<img
					class="construction"
					v-if="index === 0 || index === 1"
					src="data:image/png;base64,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"
					alt=""
				/>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import useUserStore from '@/stores/user';
import { tabs } from '@/config/tabs';
import type { TabConfig } from '@/types/menu';
import { authService } from '@/services/auth';

const router = useRouter();
const route = useRoute();

const store = useUserStore();
const tabSubSelect = ref(store.tabSubSelect);
const arrowShow = ref(true);
const activeIndex = ref(0);

const showUserMenu = ref(false);

const currentUser = computed(() => {
	const userInfo = authService?.getUserInfo() as any;
	return userInfo?.username || '系统管理员';
});

const handleTabClick = (tab: TabConfig, index: number) => {
	// eslint-disable-next-line no-console
	console.log('tab:', tab);
	// eslint-disable-next-line no-console
	console.log('index:', index);
	/*
	activeIndex.value = index;
	if (index !== 0) {
		router.push(tab.path);
	}
	*/
};
const handleSubTabClick = (tab: TabConfig, index: number) => {
	/*
	tabSubSelect.value = tab.path;
	store.setTabSubSelect(tab.path);
	router.push(tab.path);
	*/
	if (index === 2 || index === 3) {
		tabSubSelect.value = tab.path;
		store.setTabSubSelect(tab.path);
		router.push(tab.path);
	}
};
const handleClick = () => {
	arrowShow.value = !arrowShow.value;
};

const toggleUserMenu = () => {
	showUserMenu.value = !showUserMenu.value;
};

const handleLogout = async () => {
	authService.logout();
};

watch(
	() => route.path,
	(path) => {
		store.setTabSubSelect(path);
		tabSubSelect.value = path;
	}
);
</script>

<style lang="less" scoped>
.header {
	display: flex;
	align-items: center;
	width: 100%;
	height: 0.9rem;
	background: linear-gradient(180deg, #f1f7ff 0%, #c5dcfb 100%);
	box-shadow: inset 0rem -0.03rem 0.2rem 0rem rgba(70, 152, 234, 0.2);
	border: 0.01rem solid #b8d2ff;
}
.show {
	display: none !important;
}
.logo-section {
	width: 6.2rem;
	height: 0.9rem;
	background-image: url('@/assets/images/header/left-title-bg.png');
	background-size: 100% 100%;
	display: flex;
	align-items: center;
	padding-left: 0.26rem;
	flex-shrink: 0;
	.logo-text {
		font-family: YouSheBiaoTiHei;
		font-size: 0.4rem;
		color: #ffffff;
		line-height: 0.52rem;
		text-shadow: 0rem 0.04rem 0.04rem rgba(7, 21, 154, 0.7);
	}
}

.tab-section {
	display: flex;
	align-items: center;
	flex: 1;
	justify-content: space-between;
	.arrow-icon {
		transform: rotate(180deg);
		cursor: pointer;
		width: 0.3rem;
		height: 0.3rem;
		position: absolute;
		z-index: 100;
	}
	.first-tab {
		cursor: pointer;
		display: flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		height: 0.52rem;
		background-image: url('@/assets/images/header/first-tab.png');
		background-size: 100% 100%;
		position: relative;
		.construction {
			width: 0.5rem;
			height: 0.35rem;
			position: absolute;
			transform: translateX(-15%);
			top: 0.05rem;
			right: -0.1rem;
		}
		&:nth-of-type(1) {
			margin-left: 0.3rem;
		}
		.tab-font {
			font-family: YouSheBiaoTiHei;
			font-size: 0.26rem;
			color: #ffffff;
			line-height: 0.34rem;
			letter-spacing: 0.02rem;
			text-overflow: ellipsis;
			text-shadow: 0.02rem 0.02rem 0.03rem rgba(44, 73, 182, 0.5);
			overflow: hidden;
			text-align: center;
			font-style: normal;
		}
		&.active {
			background-size: cover;
			width: 2.33rem;
			height: 0.62rem;
			line-height: 0.62rem;
			background-image: url('@/assets/images/header/first-tab-active.png');
			.font-active {
				font-size: 0.32rem;
				letter-spacing: 0.03rem;
				line-height: 0.42rem;
				padding-bottom: 0.04rem;
			}
		}
	}
}

.right-section {
	margin: 0 0.2rem 0 0.3rem;
	display: flex;
	align-items: center;
	gap: 0.23rem;

	.area-section {
		position: relative;
		width: 1.52rem;
		height: 0.42rem;
		background: linear-gradient(180deg, #f1f7ff 0%, #dfecff 100%);
		box-shadow: 0rem 0rem 0.06rem 0rem rgba(44, 118, 226, 0.4);
		border-radius: 0.25rem;
		border: 0.01rem solid #4ab3fb;
		display: flex;
		align-items: center;
		.text {
			font-weight: 500;
			font-size: 0.16rem;
			color: #3489ff;
			line-height: 0.22rem;
			padding-left: 0.49rem;
		}
		&::before {
			content: '';
			width: 0.59rem;
			height: 0.61rem;
			background-image: url('@/assets/images/header/area-icon.png');
			background-size: 100% 100%;
			position: absolute;
			top: -0.1rem;
			left: -0.2rem;
		}
		.down-arrow {
			margin-left: 0.23rem;
			font-size: 0.18rem;
			color: #3489ff;
		}

		.user-dropdown {
			position: absolute;
			top: 100%;
			right: 0;
			margin-top: 0.1rem;
			background: #ffffff;
			border: 0.01rem solid #e4e7ed;
			border-radius: 0.08rem;
			box-shadow: 0rem 0.04rem 0.16rem rgba(0, 0, 0, 0.12);
			min-width: 1.2rem;
			z-index: 1000;
			.dropdown-item {
				display: flex;
				align-items: center;
				padding: 0.12rem 0.16rem;
				font-size: 0.16rem;
				color: #606266;
				cursor: pointer;
				transition: all 0.2s;
				&:hover {
					background-color: #f5f7fa;
					color: #409eff;
				}
				.el-icon {
					margin-right: 0.08rem;
					font-size: 0.16rem;
				}
			}
		}
	}
	.user-section {
		.text {
			padding-left: 0.4rem;
		}
		&::before {
			content: '';
			width: 0.29rem;
			height: 0.29rem;
			background-image: url('@/assets/images/header/admin-icon.png');
			background-size: 100% 100%;
			position: absolute;
			top: 0.07rem;
			left: 0.06rem;
		}
		.down-arrow {
			margin-left: 0.08rem;
		}
	}
}

.subTab-box {
	position: absolute;
	z-index: 1001;
	left: 50%;
	transform: translate(-50%);
	display: flex;
	flex-direction: row;
	align-items: center;
	margin-top: 1.04rem;
	transition: transform 0.5s ease;
	&.subTab-box_collapse {
		transform: translate(-50%, -160%);
		transition: transform 0.5s ease;
		opacity: 0;
	}
	.img {
		cursor: pointer;
		width: 0.3rem;
		hheight: 0.3rem;
	}
	.subTab-tab {
		display: flex;
		align-items: center;
		justify-content: space-between;
		.subTab-item {
			cursor: pointer;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 2.02rem;
			height: 0.47rem;
			background-size: cover;
			background-image: url('@/assets/images/header/second-tab.png');
			background-size: 100% 100%;
			position: relative;
			.construction {
				width: 0.5rem;
				height: 0.35rem;
				position: absolute;
				transform: translateX(-15%);
				top: 0.05rem;
				right: -0.07rem;
			}
			.sub-font {
				font-family: YouSheBiaoTiHei;
				font-size: 0.28rem;
				line-height: 0.36rem;
				color: rgba(255, 255, 255, 0.8);
				letter-spacing: 0.04rem;
				text-shadow: 0rem 0.02rem 0.04rem #075aa9;
				overflow: hidden;
				text-overflow: ellipsis;
				padding-bottom: 0.04rem;
			}
			&.active-item {
				background-size: cover;
				background-image: url('@/assets/images/header/second-tab-active.png');
				.sub-font-active {
					font-size: 0.3rem;
					color: #ffffff;
					line-height: 0.39rem;
					letter-spacing: 0.02rem;
				}
			}
		}
	}
}
</style>
