<template>
	<template v-if="paginatedData.length || showEmptyHeader">
		<el-table
			:data="paginatedData"
			:height="props.height"
			ref="tableRef"
			:empty-text="'暂无数据'"
			v-loading="loading"
			@row-click="handleClickRow"
			@sort-change="handleSortChange"
			v-bind="$attrs"
		>
			<template v-for="(col, colIndex) in props.tableColumns">
				<el-table-column
					v-if="col.visible !== false"
					:key="colIndex"
					:prop="col.prop"
					:label="col.label"
					:sortable="col.sortable"
					:min-width="col.width"
					:width="col.fixWidth"
					:align="col.align || 'center'"
					:header-align="col.headerAlign || col.align || 'center'"
					:show-overflow-tooltip="col.showToolTip !== false"
				>
					<template #header>
						<span>{{ col.label }}</span>
						<el-tooltip
							v-if="col.showHeaderTooltip"
							content="完成率≥100%时，进度条按100%展示。"
							placement="top"
						>
							<el-icon class="header-tooltip-icon"><QuestionFilled /></el-icon>
						</el-tooltip>
					</template>
					<template #default="{ row, $index }">
						<!-- 索引 -->
						<template v-if="col.type === 'index'">
							<span
								:class="[
									'index',
									{
										'special-index':
											row[props.specialProp] === props.specialLabel,
									},
								]"
							>
								{{ $index + 1 + (props.currentPage - 1) * props.pageSize }}
							</span>
						</template>
						<!-- 百分比柱状图 -->
						<template v-else-if="col.type === 'percent'">
							<div class="percent-bar" :style="`height: ${props.labelHeight}`">
								<div
									:class="[
										'aim-bar',
										{
											'special-bar':
												row[props.specialProp] === props.specialLabel &&
												row[col.prop] > 0,
										},
									]"
								></div>
								<div
									:class="[
										'real-bar',
										{
											'up-bar':
												Number(row[col.prop]) >= Number(row[col.lineProp]),
										},
										{
											'low-bar':
												Number(row[col.prop]) < Number(row[col.lineProp]),
										},
										{
											'special-bar':
												row[props.specialProp] === props.specialLabel,
										},
									]"
									:style="`width:${row[col.prop]}%;max-width:100%`"
								></div>
								<!-- 基线 -->
								<div
									v-if="col.lineProp"
									class="baseline-bar"
									:style="`left:  ${Number(row[col.lineProp]) < 0 ? '0%' : row[col.lineProp] >= 100 ? `calc(100% - 0.04rem)` : `${row[col.lineProp]}%`}`"
								></div>
							</div>
						</template>
						<!-- 箭头百分比 -->
						<template v-else-if="col.type === 'growRate'">
							<span
								:class="{
									'grow-rate-green text-green': row[col.prop] > 0,
									'grow-rate-red text-red': row[col.prop] < 0,
								}"
							>
								<el-icon v-if="Number(row[col.prop])"><CaretTop /></el-icon>
								<span class="grow-rate-num">{{
									isEmpty(row[col.prop]) ? EmptyConst : `${row[col.prop]}%`
								}}</span>
							</span>
						</template>
						<!-- 亮灯百分比（无箭头，颜色根据亮灯状态） -->
						<template v-else-if="col.type === 'lightingGrowRate'">
							<span :style="`color: ${getLightingColor(row.lightStatus)}`">
								{{ isEmpty(row[col.prop]) ? EmptyConst : `${row[col.prop]}%` }}
							</span>
						</template>
						<!-- 相对排名 -->
						<template v-else-if="col.type === 'relativeRank'">
							<span v-if="row[col.prop] === null || row[col.prop] === undefined">{{
								EmptyConst
							}}</span>
							<span
								v-else
								:class="{
									'text-green': row[col.prop] < 0,
									'text-red': row[col.prop] > 0,
								}"
							>
								<span v-if="Number(row[col.prop]) === 0">持平</span>
								<span v-else>{{
									`${row[col.prop] < 0 ? `升${Math.abs(row[col.prop])}位` : `降${Math.abs(row[col.prop])}位`}`
								}}</span>
							</span>
						</template>
						<!-- 正负百分比 -->
						<template v-else-if="col.type === 'iconPercent'">
							<span v-if="Number(row[col.prop]) > 0">+{{ row[col.prop] }}%</span>
							<span v-else-if="Number(row[col.prop]) < 0">{{ row[col.prop] }}%</span>
							<span v-else>{{
								isEmpty(row[col.prop]) ? EmptyConst : `${row[col.prop]}%`
							}}</span>
						</template>
						<template v-else-if="col.type === 'slot'">
							<slot :name="col.slotName" :row="row" :index="$index"></slot>
						</template>
						<template v-else-if="col.type === 'num'">
							{{ isEmpty(row[col.prop]) ? EmptyConst : formatNumber2(row[col.prop]) }}
						</template>
						<!-- 灯光类型 -->
						<template v-else-if="col.type === 'lighting'">
							<div
								class="lighting-wrapper"
								:class="[
									{
										'special-row':
											row[props.specialProp] === props.specialLabel,
									},
								]"
							>
								<img
									v-if="lightingMap[row[col.lightingType]]"
									:src="lightingMap[row[col.lightingType]]"
									class="lighting-icon"
								/>
								<span class="lighting-value">{{
									row[col.prop] || EmptyConst
								}}</span>
							</div>
						</template>
						<!-- 日期类型（格式：YYYY-MM-DD） -->
						<template v-else-if="col.type === 'startTime'">
							{{ formatDate(row[col.prop]) }}
						</template>
						<template v-else>
							{{ row[col.prop] || EmptyConst }}
						</template>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<el-pagination
			v-if="props.showPagination"
			class="table-pagination"
			:current-page="props.currentPage"
			:page-size="props.pageSize"
			:page-sizes="[10, 20, 50, 100]"
			:layout="'total, sizes, prev, pager, next, jumper'"
			:total="props.total || props.tableData.length"
			@size-change="handleSizeChange"
			@current-change="handleCurrentChange"
		/>
	</template>
	<template v-else>
		<div :style="{ height: props.height }">
			<default-empty-container />
		</div>
	</template>
</template>
<script lang="ts" setup>
import { formatNumber2, isEmpty } from '@/utils/';
import { EmptyConst } from '@/constanst/BaFormConstanst';
import { QuestionFilled } from '@element-plus/icons-vue';
import dayjs from 'dayjs';

// 灯光类型映射
const lightingMap: Record<string, string> = {
	'01': new URL('@/assets/images/EfficiencyCenter/red_light.png', import.meta.url).href,
	'02': new URL('@/assets/images/EfficiencyCenter/yellow_light.png', import.meta.url).href,
	'03': new URL('@/assets/images/EfficiencyCenter/green_light.png', import.meta.url).href,
	'04': new URL('@/assets/images/EfficiencyCenter/grey_light.png', import.meta.url).href,
};

// 亮灯颜色映射
const getLightingColor = (lightStatus: string) => {
	const colorMap: Record<string, string> = {
		'01': '#df5953', // 红色
		'02': '#f8c529', // 黄色
		'03': '#52c41a', // 绿色
		'04': '#999', // 灰色
	};
	return colorMap[lightStatus] || '#2f6bef'; // 默认蓝色
};

// 日期格式化函数（格式：YYYY-MM-DD）
const formatDate = (dateStr: string | null | undefined) => {
	
	if (!dateStr) return EmptyConst;
	// 如果已经是 YYYY-MM-DD 格式，直接返回
	if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
		return dateStr;
	}
	// 如果是 YYYY-MM-DD HH:mm:ss 格式，截取日期部分
	if (/^\d{4}-\d{2}-\d{2}\s+\d{2}:\d{2}$/.test(dateStr)) {
		return dateStr.split(' ')[0];
	}
	if(!Number.isNaN(Date.parse(dateStr))){
		return dayjs(dateStr).format('YYYY-MM-DD')
	}
	return dateStr;
};

const tableRef = ref<any>(null);
const props = withDefaults(
	defineProps<{
		tableData: Array<any>;
		tableColumns: Array<any>;
		height: string;
		specialProp?: string;
		specialLabel?: string;
		labelWidth?: string;
		labelHeight?: string;
		showPagination?: boolean;
		serverPageData?: boolean; // 分页由接口参数控制，组件不再对数据进行二次切片
		currentPage?: number;
		pageSize?: number;
		total?: number;
		showEmptyHeader?: boolean; // 数据为空时是否显示表头
		loading?: boolean; 
	}>(),
	{
		tableData: () => [],
		tableColumns: () => [],
		height: 'auto',
		specialProp: '',
		specialLabel: '',
		labelWidth: '1rem',
		labelHeight: '0.4rem',
		showPagination: false,
		serverPageData: false,
		currentPage: 1,
		pageSize: 20,
		total: 0,
		showEmptyHeader:false,
		loading: false,
	}
);

const paginatedData = computed(() => {
	if (!props.showPagination || props.serverPageData) return props.tableData;
	const start = (props.currentPage - 1) * props.pageSize;
	const end = start + props.pageSize;
	return props.tableData.slice(start, end);
});

const emits = defineEmits(['click-row', 'handleSortChange', 'page-change']);

const handleSizeChange = (val: number) => {
	emits('page-change', { type: 'size', value: val });
};

const handleCurrentChange = (val: number) => {
	emits('page-change', { type: 'page', value: val });
};
const handleClickRow = (row: any) => {
	emits('click-row', row);
};
const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	let order1 = '';
	if (order && order === 'ascending') {
		order1 = 'asc';
	}
	if (order && order === 'descending') {
		order1 = 'desc';
	}
	emits('handleSortChange', { prop, order: order1 });
};
defineExpose({ tableRef });
</script>
<style lang="less" scoped>
.el-table {
	
	:deep(.cell) {
		padding: 0.04rem 0.08rem;
		// line-height: 0.23rem; // 该样式会导致就算内容不超出也会显示tooltip
	}
	:deep(.el-table__body-wrapper) {
		td {
			padding: 0;
			height: 0.43rem;
			line-height: 0.43rem;
			color: rgba(0, 0, 0, 0.85);
		}
	}
	:deep(.el-table__header-wrapper) {
		th {
			background-color: #ecf2fe;
			color: #202741;
			font-size: 0.16rem;
			height: 0.4rem;
		}
		th:nth-of-type(1) {
			padding-left: 0.16rem;
		}
	}
	:deep(.el-table__body-wrapper) {
		td {
			padding: 0;
			height: 0.46rem;
			line-height: 0.46rem;
			color: rgba(0, 0, 0, 0.85);
		}
		.el-table__row {
			td:nth-of-type(1) {
				padding-left: 0.16rem;
			}
		}
	}
	/*
	.special-row {
		color: rgba(235, 177, 0, 0.85);
	}
	*/
	.index {
		// color: #2f6bef;
		// border: 1px solid #2f6bef;
		// background-color: rgba(47, 107, 239, 0.2);
		display: inline-block;
		min-width: 0.22rem !important;
		height: 0.22rem;
		line-height: 0.22rem;
		padding: 0 0.04rem;
		box-sizing: border-box;
		text-align: center;
		border-radius: 0 0.04rem 0 0.04rem;
		/*
		&.special-index {
			background-color: rgba(235, 177, 0, 0.12);
			border-color: rgba(235, 177, 0, 0.7);
			color: rgba(235, 177, 0, 0.85);
		}
		*/
	}
	.grow-rate-green,
	.grow-rate-red {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		.el-icon {
			font-size: 0.2rem;
			// margin-right: 0.06rem;
		}
	}
	.grow-rate-num {
		display: inline-block;
		min-width: 0.68rem;
		text-align: left;
	}
	.text-green {
		color: green;
	}
	.text-red {
		color: #df5953;
		.el-icon {
			transform: rotate(180deg);
		}
	}
	.percent-bar {
		position: relative;
		height: 0.4rem;
		line-height: 0.4rem;
		padding-right: 0.04rem;
		box-sizing: border-box;
		margin-left: 0.12rem;
		.aim-bar,
		.real-bar {
			box-sizing: border-box;
			position: absolute;
			left: 0;
			top: 50%;
			transform: translateY(-50%);
			height: 0.16rem;
			margin-right: 0.04rem;
		}
		.aim-bar {
			width: calc(100% - 0.04rem);
			background: rgba(47, 107, 239, 0.08);
			&.special-bar {
				background: rgba(255, 154, 76, 0.08);
			}
		}
		.real-bar {
			max-width: calc(100% - 0.04rem) !important;
			background: #2f6bef;
			// background: linear-gradient(to right, #aed3fb, #76a7f5);
			z-index: 2;
			/*
			&.special-bar {
				// background: linear-gradient(to right, #ffca83, #ff9a4c);
				background: #f8c529 !important;
			}
			*/
			&.up-bar {
				background: #2f6bef;
			}
			&.low-bar {
				background: #76a7f5;
			}
		}
		/*
		.baseline-bar {
			position: absolute;
			top: 0;
			height: 0.4rem;
			border-right: 1px dashed #df5953;
			z-index: 99999 !important;
		}
		*/
	}

	// 灯光样式
	.lighting-wrapper {
		display: flex;
		align-items: center;
		gap: 0.08rem;
	}

	.lighting-icon {
		width: 0.24rem;
		height: 0.24rem;
		object-fit: contain;
	}

	// 表头问号图标样式
	.header-tooltip-icon {
		margin-left: 0.04rem;
		cursor: pointer;
		color: #999;
		vertical-align: middle;
		&:hover {
			color: #2f6bef;
		}
	}
}
.table-pagination {
	margin-top: 0.16rem;
	justify-content: flex-end;
}
::v-deep .el-table__header th .cell {
	white-space: pre-line;
}
</style>
