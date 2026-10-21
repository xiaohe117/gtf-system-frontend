<template>
	<div class="breadcrumb-container">
		<div v-if="showBack" type="text" @click="handleBack" class="back-btn">
			<el-icon><ArrowLeft /></el-icon>
			返回
		</div>
		<!-- <el-button type="text" @click="toggleSidebar" class="collapse-btn">
			<el-icon size="20">
				<Expand v-if="sidebarCollapsed" />
				<Fold v-else />
			</el-icon>
		</el-button> -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item
				v-for="(item, index) in breadcrumbList"
				:key="item.path"
				:to="index === breadcrumbList.length - 1 || index === 0 ? '' : { path: item.path }"
				class="breadcrumb-item"
			>
				{{ item.title }}
			</el-breadcrumb-item>
		</el-breadcrumb>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
// import { useAppStore } from '@/stores/app';
import { ArrowLeft } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

// const appStore = useAppStore();
// const sidebarCollapsed = computed(() => appStore.sidebarCollapsed);

withDefaults(
	defineProps<{
		showBack?: boolean;
	}>(),
	{
		showBack: true,
	}
);

interface BreadcrumbItem {
	title: string;
	path: string;
}

// const toggleSidebar = () => {
// 	appStore.toggleSidebar();
// };

const breadcrumbList = computed(() => {
	const breadcrumbs: BreadcrumbItem[] = [];
	const matched = route.matched.filter((item) => item.meta && item.meta.title);

	matched.forEach((item, index) => {
		const title = item.meta.title as string;
		const prevTitle = index > 0 ? matched[index - 1]?.meta?.title : null;

		if (title !== prevTitle) {
			breadcrumbs.push({
				title,
				path: item.path,
			});
		}
	});

	return breadcrumbs;
});

const handleBack = () => {
	const backUrl = window.history.state?.back;
	if (window.history.length <= 2 || backUrl === null) {
		const path =
			backUrl || (breadcrumbList.value.length > 1 ? breadcrumbList.value[0].path : '/');
		router.replace(path);
	} else {
		router.go(-1);
	}
};
</script>

<style lang="less" scoped>
.breadcrumb-container {
	height: 0.48rem;
	// padding: 0 0.2rem;
	display: flex;
	align-items: center;
}

:deep(.el-breadcrumb) {
	.el-breadcrumb__item {
		font-size: 0.19rem;
		.el-breadcrumb__inner {
			font-weight: normal;
			color: #666;

			&:hover {
				// color: @primary-color;
			}
		}

		&:last-child .el-breadcrumb__inner {
			font-weight: 500;
			// color: rgba(22, 93, 255, 1);
			color: #165dff;
		}
	}
}

.collapse-btn {
	padding: 0;
	margin: 0;
	color: #666;
	&.el-button {
		padding: 0 !important;
	}

	&:hover {
		color: #165dff;
	}
}

.back-btn {
	padding: 0 0.1rem;
	margin-right: 0.1rem;
	color: #666;
	font-size: 0.18rem;
	display: flex;
	align-items: center;
	gap: 0.04rem;
	cursor: pointer;
	background-color: #fff;
	border-radius: 8px;
	&:hover {
		color: #165dff;
	}
}
</style>
