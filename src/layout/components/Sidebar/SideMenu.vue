<!--
 * @Descripttion: 侧边二级菜单栏组件
 * @Author: ycyun
 * @Date: 2026-03-24 10:16:32
 * @LastEditors: ycyun
 * @LastEditTime: 2026-04-15 17:22:00
-->
<template>
	<div class="side-menu" :class="{ 'is-expand': isExpand }">
		<ul class="menus">
			<li class="menus-item" v-for="(item, index) in showMenus" :key="index">
				<div
					class="menu-parent"
					@click="clickParent(item)"
					:class="{ active: parentActive === item.path }"
				>
					<span>{{ item.label }}</span>
				</div>
				<Transition name="drawer">
					<ul
						class="child-menus"
						v-if="
							parentActive === item.path && item.children && item.children.length > 0
						"
					>
						<li
							v-for="(child, cIndex) in item.children"
							:key="cIndex"
							:class="{ active: activeMenu === child.path }"
							@click.stop="clickMenu(child)"
						>
							<span>{{ child.label }}</span>
						</li>
					</ul>
				</Transition>
			</li>
		</ul>
		<div class="toggle-btn" @click="toggleExpand"></div>
	</div>
</template>
<script lang="ts" setup>
import useUserStore from '@/stores/user';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const store = useUserStore();
const menus: any = computed(() => store.sideMenus);
// 递归过滤掉 meta.hidden 为 true 的菜单（树结构，需处理子级）
const filterHiddenMenus = (menuList: any[]): any[] =>
	menuList
		.filter((item: any) => item.meta?.hidden !== 'true')
		.map((item: any) => {
			if (item.children && item.children.length > 0) {
				return { ...item, children: filterHiddenMenus(item.children) };
			}
			return item;
		});
const showMenus: any = computed(() => filterHiddenMenus(menus.value));
const activeMenu: any = computed(() => route.path);

// 父级高亮
const parentActive = computed(() => {
	if (menus.value.find((ele: any) => ele.path === activeMenu.value)) {
		return activeMenu.value;
	}
	const obj =
		menus.value.find(
			(ele: any) =>
				ele.children && ele.children.find((child: any) => child.path === activeMenu.value)
		) || {};
	return obj.path;
});

const clickMenu = (item: any) => {
	router.push({ path: item.path, query: item.query });
};
const clickParent = (item: any) => {
	console.log(item)
	if (item.path.indexOf('http') === 0) {
		window.open(item.path, '_blank');
		return;
	}
	// 按项目招临时需求，点击跳转到操作中心-项目
	// if (item.name === 'recruitmentByProject') {
	// 	router.push({
	// 		path: '/operationCenter/project',
	// 	});
	// 	return;
	// }
	// 展开第一级，并显示第一个菜单
	if (item.children && item.children.length > 0) {
		clickMenu(item.children[0]);
	} else {
		clickMenu(item);
	}
};
const isExpand = ref(store.sideMenusIsExpand);
const toggleExpand = () => {
	isExpand.value = !isExpand.value;
	store.setSideMenusIsExpand(isExpand.value);
};
</script>
<style lang="less" scoped>
.side-menu {
	position: relative;
	&::after {
		content: '';
		display: inline-block;
		position: absolute;
		right: -0.01rem;
		top: 0;
		height: 100%;
		width: 0.01rem;
		background: url('@/assets/images/menuLayout/side-menu-line.png');
		background-size: 100% 100%;
	}
	&.is-expand {
		.toggle-btn {
			background: url('@/assets/images/menuLayout/side-menu-collapse.png');
			background-size: 100% 100%;
		}
	}
	.toggle-btn {
		position: absolute;
		width: 0.41rem;
		height: 1.52rem;
		right: -0.41rem;
		top: 50%;
		transform: translateY(-50%);
		background: url('@/assets/images/menuLayout/side-menu-expand.png');
		background-size: 100% 100%;
		cursor: pointer;
		z-index: 2;
	}
}
ul.menus {
	padding-right: 0.08rem;
	font-weight: 400;
	overflow: auto;
	height: 100%;
	li.menus-item {
		margin-bottom: 0.16rem;

		.menu-parent {
			width: 100%;
			padding: 0.13rem 0 0.13rem 0.24rem;
			font-family: PingFangSC, PingFang SC;
			font-weight: 400;
			font-size: 0.18rem;
			line-height: 0.22rem;
			color: rgba(0, 0, 0, 0.8);
			z-index: 1;
			position: relative;
			cursor: pointer;
			background: url('@/assets/images/menuLayout/side-menu-bg.png');
			background-size: 100% 100%;

			span {
				z-index: 3;
				position: relative;
			}
			&.active {
				font-weight: 500;
				color: #ffffff;
				text-shadow: 0 0 .02rem rgba(44, 118, 226, 0.6), 0 .02rem .04rem rgba(0, 0, 0, 0.5);
				&::after {
					content: '';
					position: absolute;
					top: -0.02rem;
					left: -0.02rem;
					right: -0.02rem;
					bottom: -0.02rem;
					background: url('@/assets/images/menuLayout/side-menu-active.png');
					background-size: 100% 100%;
					z-index: 2;
					border-radius: 0.02rem;
				}
			}
		}
		.child-menus {
			width: 100%;
			background: #f2f6ff;
			border-radius: 0.08rem;
			backdrop-filter: blur(0.02rem);
			padding: 0.5rem 0.08rem 0.08rem 0.08rem;
			margin-top: -0.45rem;
			z-index: 0;
			position: relative;
			border: 0.01rem solid #cde3fe;
			li {
				font-family: PingFangSC, PingFang SC;
				font-weight: 400;
				font-size: 0.16rem;
				color: rgba(0, 0, 0, 0.9);
				line-height: 0.22rem;
				position: relative;
				cursor: pointer;
				padding: 0.09rem 0.08rem 0.09rem  0.15rem;
				border-radius: 0.03rem;
				&:last-child {
					margin-bottom: 0;
				}
				&.active {
					background: #d1e0ff;
					color: #0052d9;
				}
			}
		}
	}
}

// 子菜单抽屉动画
.drawer-enter-active {
	transition: opacity 0.3s ease, transform 0.3s ease;
}
.drawer-leave-active {
	transition: opacity 0.25s ease, transform 0.25s ease;
}
.drawer-enter-from {
	opacity: 0;
	transform: translateY(-0.16rem);
}
.drawer-leave-to {
	opacity: 0;
	transform: translateY(-0.16rem);
}
</style>