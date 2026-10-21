<template>
	<aside class="sidebar">
		<el-menu
			:default-active="''"
			:router="true"
			class="el-menu-vertical-demo"
			background-color="#333"
			text-color="#fff"
			active-text-color="#ffd04b"
		>
			<template v-for="item in menuList">
				<el-sub-menu
					v-if="item.children && item.children.length > 0"
					:key="item.path"
					:index="item.path"
				>
					<template #title>
						<i :class="item.meta.icon"></i>
						<span>{{ item.meta.title }}</span>
					</template>
					<el-menu-item
						v-for="subItem in item.children"
						:key="subItem.path"
						:index="subItem.path"
					>
						<i :class="subItem.meta.icon"></i>
						{{ subItem.meta.title }}
					</el-menu-item>
				</el-sub-menu>
				<el-menu-item v-else :key="item.name" :index="item.path">
					<i :class="item.meta.icon"></i>
					{{ item.meta.title }}
				</el-menu-item>
			</template>
		</el-menu>
	</aside>
</template>

<script setup lang="ts">
import { menuList } from '@/config/tabs';

const props = withDefaults(
	defineProps<{
		tabId: string;
	}>(),
	{
		tabId: 'daily-monitoring',
	}
);
// eslint-disable-next-line no-console
console.log(props);
</script>

<style lang="less" scoped>
.sidebar {
	transition: width 0.28s;
	width: 2rem;
	background-color: rgba(0, 0, 0, 0.05);
	position: fixed;
	top: 0;
	left: 0;
	z-index: 1001;
	overflow: hidden;
	height: calc(100% - 0.6rem);
	padding-top: 0.6rem;
}

.sidebar.collapsed {
	width: 50px;
}

.collapse-button {
	position: absolute;
	right: -12px;
	top: 20px;
	width: 24px;
	height: 24px;
	border-radius: 50%;
	background-color: white;
	border: 1px solid #e8e8e8;
	cursor: pointer;
	z-index: 1;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
