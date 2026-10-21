<!--
 * @Descripttion: 地方一般公共预算税收收入-全年增速走势
 * @Author: ycyun
 * @Date: 2025-06-19 10:17:45
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-07-05 12:18:56
-->
<template>
	<SmallTitle>
		<template #title>
			<TextRotation :text="`地方一般公共预算税收收入-全年增速走势`" />
			<el-radio-group class="mg-l" v-model="dataType" @change="getData" size="small">
				<el-radio-button
					v-for="item in tabs"
					:key="item.value"
					:label="item.label"
					:value="item.value"
				/>
			</el-radio-group>
		</template>
		<BaseChart :chartOption="chartOption" :isEmpty="isChartEmpty" width="100%" height="4rem" />
	</SmallTitle>
</template>
<script lang="ts" setup>
import { queryTrendList } from '@/api/dailyMonitoring/indicatorDetailsPage';
import { useAttrs } from 'vue';
import TextRotation from '@/components/widget/TextRotation.vue';
import { getSize } from '@/utils';
import SmallTitle from '../components/SmallTitle.vue';
import { barLineOption } from '../components/chartOptions';

const attrs: any = useAttrs();

const chartData = ref({
	dataXName: [],
	dataYbar: [],
	dataYbar2: [],
	dataYline: [],
	dataYline2: [],
	dataYline3: [],
	legendArr: ['当年总量', '上年总量', '当年增速', '上年增速', '当年目标增速'],
	unitArr: ['亿元', '亿元', '%', '%', '%'],
	yAxisName: ['', '增速'],
	categoryArr: [],
	lastCategoryArr: [],
}) as any;
const chartOption = computed(() => {
	const option: any = barLineOption(chartData.value);
	try {
		option.grid.top = getSize(80);
	} catch (error) {
		console.log(error);
	}
	return option;
});

// 1:单月，2:单季度，3:累计，默认是3
const tabs = [
	{ label: '累计月', value: '3' },
	{ label: '单月', value: '1' },
];
const dataType = ref(tabs[0].value);

const isChartEmpty = ref(true);
const getData = async () => {
	const params = {
		indexId: 'IND0000052', // 税收收入指标
		deptId: attrs.indicatorData.deptId,
		timeScale: attrs.timeScale,
		dataType: dataType.value,
	};
	try {
		const res = await queryTrendList({ params });
		if (res.code === 200) {
			const { data } = res as any;
			if (!data.length) {
				isChartEmpty.value = true;
				return;
			}
			isChartEmpty.value = false;
			const unitMeasurement =
				data.find((item: any) => item.unitMeasurement)?.unitMeasurement || ''; // 总量单位
			chartData.value.unitArr[0] = unitMeasurement;
			chartData.value.unitArr[1] = unitMeasurement;
			chartData.value.yAxisName[0] = `${unitMeasurement ? `总量/${unitMeasurement}` : '总量'}`;
			chartData.value.dataXName = data.map((el: any) => el.month);
			chartData.value.dataYbar = data.map((el: any) => el.total);
			chartData.value.dataYbar2 = data.map((el: any) => el.lastTotal);
			chartData.value.dataYline = data.map((el: any) => el.growRate);
			chartData.value.dataYline2 = data.map((el: any) => el.lastGrowRate);
			chartData.value.dataYline3 = data.map((el: any) => el.targetGrow);
			chartData.value.categoryArr = data.map((el: any) => ({
				name: el.month,
				value: el.category,
			}));
			chartData.value.lastCategoryArr = data.map((el: any) => ({
				name: el.month,
				value: el.lastCategory,
			}));
		} else {
			isChartEmpty.value = true;
		}
	} catch (error) {
		console.error('Error fetching data:', error);
		isChartEmpty.value = true;
	}
};

watch(
	() => attrs.timeScale,
	() => {
		getData();
	}
);
watch(
	() => attrs.indicatorData,
	() => {
		getData();
	},
	{
		immediate: true,
	}
);
</script>
<style lang="less" scoped>
.date-part {
	display: flex;
	margin-left: 0.24rem;

	.item {
		font-size: 0.14rem;
		padding: 0.05rem 0.16rem;
		border: 1px solid rgb(159.5, 206.5, 255);
		cursor: pointer;
		color: #2f6bef;
		background: rgb(235.9, 245.3, 255);
		&.active {
			background: #2f6bef;
			color: #fff;
		}
		&:last-child {
			border-left: 0;
			border-radius: 0 0.02rem 0.02rem 0;
		}
		&:first-child {
			border-right: 0;
			border-radius: 0.02rem 0 0 0.02rem;
		}
	}
}
:deep(.tooltips-part) {
	padding: 0.2rem;
	box-sizing: border-box;
	background: rgba(255, 255, 255, 0.8);
	box-shadow: 0rem 0.02rem 0.1rem 0.04rem rgba(0, 0, 0, 0.08);
	border-radius: 0.08rem;
	border: 0.02rem solid;
	border-image: linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(255, 255, 255, 1)) 2 2;
	backdrop-filter: blur(0.07rem);
	.title {
		font-weight: 500;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.85);
	}
	.tag {
		margin-left: 0.08rem;
		padding: 0.01rem 0.08rem;
		background: #e6f7ff;
		border-radius: 0.02rem;
		border: 0.01rem solid #91d5ff;
		font-weight: 400;
		font-size: 0.12rem;
		color: #1890ff;
		line-height: 0.2rem;
	}
	.items {
		padding-top: 0.16rem;
		.icon {
			width: 0.14rem;
			height: 0.14rem;
			background: #0769ff;
			border-radius: 0.02rem;
			margin-right: 0.08rem;
			&.line {
				width: 0.14rem;
				height: 0.04rem;
				background: #0769ff;
				border-radius: 0.02rem;
			}
		}
		.label,
		.value {
			font-weight: 400;
			font-size: 0.16rem;
			color: #202741;
		}
		.label {
			padding-right: 0.16rem;
		}
	}
}
</style>
