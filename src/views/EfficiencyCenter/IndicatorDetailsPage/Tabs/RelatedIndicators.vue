<template>
	<SmallTitle :title="`${attrs.indicatorData.indicatorName}指标-相关指标`" class="fx-1">
		<template v-if="!tableData.length">
			<div style="height: 5.7rem">
				<default-empty-container />
			</div>
		</template>
		<template v-else>
			<div class="fx-r content">
				<div class="graph-box">
					<Graph :graphApiData="graphApiData" />
				</div>
				<div class="table-box">
					<simple-table
						:hideOrder="true"
						:tableData="tableData"
						:columns="columns"
						:height="'5.6rem'"
						@handle-sort-change="handleSortChange"
					>
						<template #index="{ index }">
							{{ index + 1 }}
						</template>
						<template #totalRate="{ row }">
							<span
								:class="[
									{
										green_arrow: Number(row.totalRate) > 0,
										red_arrow: Number(row.totalRate) < 0,
									},
								]"
								><i class="bg_grow" v-if="row.rate"></i
								>{{ formatValue(row.totalRate) }}
							</span>
						</template>
					</simple-table>
				</div>
			</div>
		</template>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { useAttrs } from 'vue';
import { getSize } from '@/utils/';
import { EmptyConst } from '@/constanst/BaFormConstanst';
import Graph from '@/views/EfficiencyCenter/Development/Graph.vue';
import { indicatorTree } from '@/api/EfficiencyCenter';
import SmallTitle from '../components/SmallTitle.vue';

const attrs: any = useAttrs();

const graphApiData = ref<any>({});
const tableData = ref<any>([]);

const columns = computed(() => [
	{
		prop: 'index',
		label: '序号',
		type: 'slot',
		slotName: 'index',
		width: getSize(80),
	},
	{
		prop: 'indicatorName',
		label: '指标名称',
		align: 'left',
		width: getSize(150),
	},
	{
		prop: 'monthDone',
		label: `当月完成数\n（${graphApiData.value.unit}）`,
		align: 'right',
		width: getSize(110),
	},
	{
		prop: 'totalTarget',
		label: '目标',
		align: 'right',
		width: getSize(110),
	},
	{
		prop: 'totalDone',
		label: `累计完成数\n（${graphApiData.value.unit}）`,
		align: 'right',
		width: getSize(110),
	},
	{
		prop: 'totalRate',
		label: '完成率',
		visible: true,
		type: 'slot',
		slotName: 'totalRate',
		sortable: false,
		align: 'right',
		width: getSize(140),
	},
]);

const getData = () => {
	graphApiData.value = {};
	tableData.value = [];
	const params = {
		indicatorCode: attrs.indicatorData?.indicatorCode,
		yearMonth: attrs.defaultDate,
		tabType: attrs.tagId,
	};
	indicatorTree(params).then((res: any) => {
		if (res.code === 0) {
			const data = res.data || {};
			graphApiData.value = data;
			tableData.value = data.childrenList;
		}
	});
};

const formatValue = (vl: any) => {
	const value = vl ?? '--';
	return value === '--' ? EmptyConst : `${value}%`;
};

const handleSortChange = ({ prop, order }: any) => {
	if (order === 'asc') {
		tableData.value = tableData.value.sort((a: any, b: any) => a[prop] - b[prop]);
	} else {
		tableData.value = tableData.value.sort((a: any, b: any) => b[prop] - a[prop]);
	}
};

onMounted(() => {
	getData();
});

watch(
	() => attrs.defaultDate,
	() => {
		getData();
	}
);
</script>
<style lang="less" scoped>
.content {
	overflow: hidden;
	.graph-box {
		position: relative;
		width: 45%;
		.relation-graph {
			height: 5.7rem !important;
		}
	}
	.table-box {
		width: 50%;
		position: absolute;
		right: 0;
		background: #fff;
		z-index: 99;
	}
}
.bg_common_light {
	background-size: 100% 100%;
	background-repeat: no-repeat;
	width: 0.24rem;
	height: 0.24rem;
	margin-right: 0.05rem;
}
.name {
	i {
		display: inline-block;
		position: absolute;
		bottom: 0.14rem;
		left: -0.1rem;
	}
	vertical-align: middle;
	text-align: left;
}
.red .bg_light {
	background-image: url('@/assets/images/dailyMonitoring/statistics/stat_icon_2.png');
}
.yellow .bg_light {
	background-image: url('@/assets/images/dailyMonitoring/statistics/stat_icon_3.png');
}
.green .bg_light {
	background-image: url('@/assets/images/dailyMonitoring/statistics/stat_icon_4.png');
}

.green,
.green_arrow {
	font-family: @number-font;
	display: flex;
	color: #53a064;
	justify-content: flex-end;
	align-items: center;
}
.green_arrow {
	.bg_grow {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 0.18rem;
		height: 0.16rem;
		background-image: url('@/assets/images/dailyMonitoring/statistics/asc.png');
	}
}
.red,
.red_arrow {
	font-family: @number-font;
	display: flex;
	justify-content: flex-end;
	align-items: center;
	color: #df5953;
}
.red_arrow {
	.bg_grow {
		background-size: 100% 100%;
		background-repeat: no-repeat;
		width: 0.18rem;
		height: 0.16rem;
		background-image: url('@/assets/images/dailyMonitoring/statistics/desc.png');
	}
}
:deep(.el-table) {
	th {
		background-color: #ecf2fe;
		color: @table-header-text-color;
		line-height: 0.22rem;
		font-size: @table-font-size;
	}
}
:deep(.c-rg-line-text) {
	font-size: 0.22rem !important;
	font-family: Bebas;
	font-weight: 600;
}
:deep(.el-table) {
	th.is-sortable.is-right {
		.cell {
			padding-right: 0;
			.caret-wrapper {
				margin-left: 0.04rem;
			}
		}
	}
}
</style>
