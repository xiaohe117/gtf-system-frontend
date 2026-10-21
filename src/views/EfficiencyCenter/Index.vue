<template>
	<div class="fx-r home-container">
		<div class="left-tab">
			<div
				:class="['tab-item', { active: activeTab === 'dashboard' }]"
				@click="changeTab('dashboard')"
			>
				<span class="text">指标仪表盘</span>
			</div>
			<div
				:class="['tab-item', { active: activeTab === 'ledgerTable' }]"
				@click="changeTab('ledgerTable')"
			>
				<span class="text">指标台账</span>
			</div>
		</div>
		<div class="right-content">
			<IndicatorDashboard v-if="activeTab === 'dashboard'" />
			<LedgerTable ref="ledgerTableRef" v-else />
		</div>
	</div>
</template>

<script setup lang="ts">
// import { useRouter } from 'vue-router';
import IndicatorDashboard from './components/IndicatorDashboard.vue';
import LedgerTable from './components/LedgerTable.vue';

// const router = useRouter();

const activeTab = ref('dashboard');
const ledgerTableRef = ref<any>(null);

const changeTab = (tab: string) => {
	activeTab.value = tab;

	if (tab === 'ledgerTable') {
		nextTick(() => {
			ledgerTableRef.value?.getTableData({});
		});
	}
};

/*
const getDateDropDown = () => {
	EcoOperationNormal<string[]>().then((res) => {
		if (res.code === 200) {
			if (store.dateSelect !== '' && res.data?.includes(store.dateSelect)) {
				date.value = store.dateSelect;
			} else {
				[date.value] = res.data;
				store.setDateSelect(date.value);
			}
			dateOption.value = res.data;

			invokeFunc(date.value);
		} else {
			console.log('获取数据失败');
		}
	});
};
*/

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
	// getDateDropDown();
});
</script>

<style lang="less" scoped>
.home-container {
	height: 100%;
	// padding: 0.29rem 0 0.22rem 0.34rem;
	padding-left: 0.16rem;
	.left-tab {
		padding: 1.14rem 0 1.63rem;
		display: grid;
		grid-template-rows: 1fr 1fr;
		.tab-item {
			display: flex;
			flex-direction: column; /* 垂直排列子元素 */
			justify-content: center; /* 垂直居中（可选） */
			align-items: center; /* 水平居中（可选） */
			width: 0.5rem; /* 保持窄宽度 */
			text-align: center; /* 强制文字水平居中 */
			cursor: pointer;
			background: #ffffff;
			box-shadow: 0rem 0.02rem 0.1rem 0rem rgba(10, 65, 208, 0.2);
			border-image: linear-gradient(107deg, rgba(22, 93, 255, 0.45), rgba(44, 115, 245, 0.49))
				1 1;
			.text {
				font-weight: 500;
				font-size: 0.26rem;
				color: #165dff;
				line-height: 0.3rem;
				// text-shadow: 0rem 0.02rem 0.1rem rgba(10, 65, 208, 0.2);
			}
			&:first-child {
				border-radius: 0.08rem 0rem 0rem 0rem;
			}
			&:last-child {
				border-radius: 0rem 0rem 0rem 0.08rem;
			}
			&.active {
				position: relative;
				background: linear-gradient(315deg, #5b8ff9 0%, #165dff 100%);
				border: 0.01rem solid #ffffff;
				.text {
					color: #ffffff;
				}
				&::after {
					content: '';
					display: block;
					width: 0.38rem;
					height: 0.48rem;
					background-image: url('@/assets/images/EfficiencyCenter/arrow-line.png');
					background-size: 100% 100%;
					position: absolute;
					left: 79%;
					top: 37%;
				}
			}
		}
	}
	.right-content {
		flex: 1;
		overflow-x: auto;
		margin-left: 0.2rem;
	}
}
</style>
