<template>
	<div class="indicator-ledger fx-r">
		<div class="tab-container">
			<div type="text" @click="handleBack" class="back-btn">
				<el-icon><ArrowLeft /></el-icon>
				返回
			</div>
			<div
				v-for="(item, index) in regionList"
				:key="item.value"
				class="tab-item"
				:class="{ selected: activeTab === index }"
				@click="changeTab(index)"
			>
				{{ item.label }}
			</div>
		</div>

		<div class="right-container">
			<ProvinceLedger :dataSource="regionList[activeTab]?.value" v-bind="$attrs" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import ProvinceLedger from './ProvinceLedger.vue';

withDefaults(
	defineProps<{
		query?: any;
	}>(),
	{
		query: {},
	}
);
const route = useRoute();
const router = useRouter();

const activeTab = ref(0);
activeTab.value = Number(route.query.tableType || 0);

const changeTab = (index: number) => {
	activeTab.value = index;
};

const regionList = [
	{ label: '省内资', value: 'province' },
	{ label: '全市', value: 'city' },
	{ label: '各区', value: 'district' },
	{ label: '市直部门', value: 'department' },
	{ label: '国企', value: 'enterprise' },
	{ label: '办内', value: 'inside' },
];

interface BreadcrumbItem {
	title: string;
	path: string;
}

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

defineExpose({});
</script>

<style lang="less" scoped>
.indicator-ledger {
	gap: 0.2rem;
	padding-top: 0.2rem;

	.right-container {
		flex: 1;
		// background: #fff;
		height: 9rem;
		width: 10.6rem;
		border-radius: 0.18rem;
		overflow: hidden;
	}

	@base-font-size: 100px;
	@primary-color: #4a90e2;
	@primary-gradient: linear-gradient(90deg, #006fff 0%, #7cb4fe 100%);
	@inactive-bg: linear-gradient(90deg, #fbfefc 0%, #eaf0fb 100%);
	@inactive-color: #4a90e2;
	@arrow-img: '@/assets/images/EfficiencyCenter/arrow-line.png';

	.tab-container {
		display: flex;
		flex-direction: column;
		gap: 0.16rem;
		// padding-right: 0.2rem;
		height: 9rem;
		overflow-y: auto;
		overflow-x: hidden;
		align-items: baseline;
	}

	.tab-item {
		padding-left: 0.15rem;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		height: 1.24rem;
		width: 0.69rem;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 0.12rem 0 0 0.12rem;
		writing-mode: vertical-rl;
		text-orientation: upright;
		letter-spacing: 0.2em;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 600;
		font-size: 0.2rem;
		color: #fff;

		// background: @inactive-bg;
		background-image: url('@/assets/images/EfficiencyCenter/ledger_tab.png');
		background-size: contain;
		background-repeat: no-repeat;
		color: @inactive-color;
		// text-shadow: -0.06rem 0 0.1rem rgba(10, 65, 208, 0.2);

		&.selected {
			text-shadow:
				-0.06rem 0 0.1rem rgba(10, 65, 208, 0.2),
				0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			background-image: url('@/assets/images/EfficiencyCenter/ledger_tab_selected.png');
			color: #ffffff;

			&::after {
				content: '';
				position: absolute;
				right: 0.1rem;
				top: 50%;
				transform: translate(75%, -50%);
				background-image: url('@/assets/images/EfficiencyCenter/arrow-line.png');
				background-size: 100% 100%;
				width: 0.3rem;
				height: 0.4rem;
				border: none;
			}
		}
	}

	.back-btn {
		padding: 0.04rem 0.1rem;
		// margin-right: 0.1rem;
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
}
</style>
