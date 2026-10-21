<!--
 * @Descripttion: 所属产业
 * @Author: ycyun
 * @Date: 2025-10-28 09:48:09
 * @LastEditors: ycyun
 * @LastEditTime: 2025-10-28 10:09:38
-->
<template>
	<div class="industry-chart">
		<RoundRectTabs v-model="curTab" :tabsList="tabsList" @change="getRightTabData" />
		<div class="chart-box">
			<template v-if="rightTableList.length > 0">
				<div v-for="(item, index) in rightTableList" :key="index" class="custom-list-item">
					<el-popover :disabled="true" popper-class="custom-popover">
						<template #reference>
							<div class="fx-r fx-al-c item">
								<div class="index">{{ index + 1 }}</div>
								<div class="label overflow-ellipsis">
									{{ item.name }}
								</div>
								<div class="value fx-r fx-1">
									<div
										class="value-item"
										v-for="(legend, legendIndex) in customLegend"
										:key="legendIndex"
										:style="{
											background: legend.color,
											width: (item[legend.prop] / maxTableValue) * 100 + '%',
										}"
									/>
								</div>
								<div class="number">
									{{ item.industryCount }}
									<span class="unit">家</span>
								</div>
							</div>
						</template>
						<div class="custom-list-popover">
							<div class="label">{{ item.name }}</div>
							<div class="value">
								<div
									v-for="(legend, legendIndex) in customLegend"
									:key="legendIndex"
									class="item"
								>
									<i
										v-show="customLegend.length > 1"
										:style="{ borderColor: legend.color }"
									></i>
									{{ legend.label }} {{ item[legend.prop] }}
								</div>
							</div>
						</div>
					</el-popover>
				</div>
			</template>
			<default-empty-container :height="'100%'" v-else />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { queryIndustryCategory, queryIndustryCount } from '@/api/index';

const listData = ref([]) as any;
const tabsList = computed<any>(() =>
	listData.value.map((item: any) => `${item.title}（${item.count}家)`)
);
const curTab = ref(0);
const customLegend = computed(() => [
	{
		label: '所属产业',
		prop: 'industryCount',
		color: '#408FFF',
	},
]);
const rightTableList = ref<any[]>([]);
const maxTableValue = ref<number>(0);

const getRightTabData = async () => {
	const params = {
		category: listData.value[curTab.value].title,
		sort: 1, // 默认按数量排
	};
	try {
		const res = await queryIndustryCount<any>(params);
		rightTableList.value = res?.data.map((item: any) => ({
			...item,
			name: item.label,
			industryCount: item.count,
		}));
		let maxValue: any = 0;
		if (rightTableList.value.length > 0) {
			// 遍历所有数据项，找出各项属性的最大值总和
			rightTableList.value.forEach((item: any) => {
				let itemTotal = 0;
				customLegend.value.forEach((legend: any) => {
					itemTotal += item[legend.prop] || 0;
				});
				if (itemTotal > maxValue) {
					maxValue = itemTotal;
				}
			});
		}

		// 如果没有数据或最大值为0，设置一个默认值避免除以0
		maxTableValue.value = maxValue > 0 ? maxValue : 1;
	} catch (error) {
		rightTableList.value = [];
	}
};

const getIndustryCategory = async () => {
	try {
		const res = await queryIndustryCategory<any>();
		const data = res?.data || [];
		listData.value = data.map((item: any) => ({
			title: item.label,
			count: item.totalCount,
			percent: item.ratio,
		}));
		await getRightTabData();
	} catch (error) {
		listData.value = [];
	}
};
getIndustryCategory();
</script>
<style lang="less" scoped>
.industry-chart {
	display: flex;
	flex-direction: column;
	:deep(.tabs-control) {
		width: 100%;
		> div {
			padding: 0 0.12rem;
		}
	}
	.chart-box {
		height: calc(100% - 0.34rem - 0.12rem);
		flex: 1;
		overflow-y: auto;
        margin-top: 0.12rem;
		.custom-list-item {
			margin-bottom: 0.1rem;
			cursor: pointer;
			.item {
				gap: 0.12rem;
			}
			.index {
				width: 0.2rem;
				height: 0.2rem;
				line-height: 0.2rem;
				border-radius: 50%;
				background: #4787f0;
				color: #fff;
				text-align: center;
				font-size: 0.12rem;
				margin-right: 0.12rem;
			}
			&:nth-of-type(1) {
				.index {
					background: #ff7a0d;
				}
			}
			&:nth-of-type(2) {
				.index {
					background: #ffb20d;
				}
			}
			&:nth-of-type(3) {
				.index {
					background: #00bbc4;
				}
			}
			.label {
				font-family: MicrosoftYaHei;
				width: 1.4rem;
				font-size: 0.14rem;
				text-align: left;
				color: #000;
				margin-right: 0.12rem;
			}
			.value {
				background: #c7daff;
				.value-item {
					height: 0.08rem;
				}
			}
			.number {
				font-family: @number-font;
				font-weight: 400;
				font-size: 0.17rem;
				color: #000000;
				margin-right: 0.05rem;
				.unit {
					font-size: 0.14rem;
					color: rgba(0, 0, 0, 0.7);
				}
			}
		}
	}
}
</style>