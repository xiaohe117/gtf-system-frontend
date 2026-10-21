<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2026-02-02 15:10:28
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-31 11:12:51
-->

<template>
	<FrameBox class="fx-w">
		<TitleBody name="产业体系项目策划情况">
			<template #extra>
				<RoundRectTabs v-model="projectTab" :tabsList="projectTypes"></RoundRectTabs>
			</template>
			<div class="main-content fx-r fx-sp-b fx-h">
				<LeftMainCon1 :projectTab="projectTab" :leftmenuArr="leftmenuArr" />
			</div>
		</TitleBody>
	</FrameBox>
</template>

<script setup lang="ts">
import { queryIndustryListByCategory } from '@/api/RecruitmentByProject';

// import RoundRectTabs from './RoundRectTabs.vue';

import LeftMainCon1 from './LeftMainCon1.vue';
// 顶部tab切换
const projectTab: any = ref(0);
const projectTypes = ['15个战略性产业集群', '6个未来产业', '8个现代服务业'];

const leftmenuArr = ref();
const getqueryIndustryListByCategory = (category: any) => {
	queryIndustryListByCategory<any>(category).then((res) => {
		const resData = res?.data;
		if (resData) {
			// console.log(resData);
			leftmenuArr.value = resData;
		}
	});
};

watch(
	() => projectTab.value,
	() => {
		// console.log(projectTab.value, '产业');
		getqueryIndustryListByCategory(projectTab.value + 1);
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
.fx-w {
	// min-width: 13rem;
	width: calc(100% - 5.4rem - 0.16rem);
	flex: 1;
	margin-right: 0.16rem;
}
.fade-enter-active,
.fade-leave-active {
	transition: all 0.3s ease;
	transform: translateY(-0.1rem);
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-0.2rem);
}
.main-content {
	padding: 0 0 0 0.26rem;
}

:deep(.title-body-content) {
	display: flex;
	flex-direction: column;
}
</style>
