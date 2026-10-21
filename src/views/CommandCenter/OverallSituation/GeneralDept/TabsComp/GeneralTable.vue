<template>
	<div class="general-table">
		<ComplexTable
			class="project-table"
			:tableData="tableData"
			:columns="columns"
			:hasOrder="false"
			:isPage="false"
			:span-method="spanMethod"
			:cell-class-name="cellClassName"
			:row-class-name="tableRowClassName"
			v-loading="loading"
		>
			<template #clueDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openClueDetail(row, col)"
				/>
			</template>
			<template #sceneDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openSceneDetail(row, col)"
				/>
			</template>
			<template #entDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openEntDetail(row, col)"
				/>
			</template>
			<template #visitDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openVisitDetail(row, col)"
				/>
			</template>
			<template #activityDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openActivityDetail(row, col)"
				/>
			</template>
			<!-- 有效线索 -->
			<template #effectiveClue="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openEffectiveClueDetail(row, col)"
				/>
			</template>
			<!-- 走访对接--项目详情 -->
			<template #projectDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openProjectDetail(row)"
				/>
			</template>
			<!-- 项目推进-项目详情 -->
			<template #projectProcessDetail="{ row, col }">
				<Link
					:row="row"
					:col="col"
					:canClick="isOwnDept(row)"
					@click="openProjectProcessDetail(row,col)"
				/>
			</template>
			<template #rate="{ row, col }">
				<div>
					{{
						!isEmpty(row[col.prop])
							? parseFloat(Number(row[col.prop]).toFixed(1)) + '%'
							: EmptyConst
					}}
				</div>
			</template>
			<template #append>
				<div class="note-box" v-if="noteList.length > 1">
					<p>注：</p>
					<p v-for="(note, idx) in noteList" :key="idx">{{ note }}</p>
				</div>
				<div class="note-box" v-if="noteList.length === 1">注：{{ noteList[0] }}</div>
			</template>
		</ComplexTable>
		<ClueDetail ref="clueDetailRef" :defaultDate="dateValue" />
		<SceneDetail ref="sceneDetailRef" :defaultDate="dateValue" />
		<EntDetail ref="entDetailRef" :defaultDate="dateValue" />
		<VisitDetail ref="visitDetailRef" :defaultDate="dateValue" />
		<ActivityDetail ref="activityDetailRef" :defaultDate="dateValue" />
		<ProjectDetail ref="projectDetailRef" :defaultDate="dateValue" />
		<EffectiveClueDetail ref="effectiveClueDetailRef" :defaultDate="dateValue" />
		<ProjectProcessDetail ref="ProjectProcessDetailRef" :defaultDate="dateValue" />
	</div>
</template>
<script lang="ts" setup>
import { EmptyConst, isEmpty } from '@/utils';
import ComplexTable from '@/views/CommandCenter/OverallSituation/Components/ComplexTable.vue';
import ClueDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/ClueDetail.vue';
import SceneDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/SceneDetail.vue';
import EntDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/EntDetail.vue';
import VisitDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/VisitDetail.vue';
import ActivityDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/ActivityDetail.vue';
import ProjectDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/ProjectDetail.vue';
import ProjectProcessDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/ProjectProcessDetail.vue';
import EffectiveClueDetail from '@/views/CommandCenter/OverallSituation/TfwDept/Dialog/EffectiveClueDetail.vue';

import Link from '@/views/CommandCenter/OverallSituation/Components/Link.vue';

const props = defineProps({
	curTab: {
		type: Object,
		default: () => ({}),
	},
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
	deptCode: {
		type: String,
		default: '',
	},
});

// 行数据是否是当前部门的数据，是则可以高亮和下钻
const isOwnDept = (row: any) => {
	const unitCode = (row.unitCode && row.unitCode.split('、')) || [];
	return unitCode.includes(props.deptCode);
};
const year = computed(() => (props.dateValue.startTimeStr?.match(/^\d{4}/) || ['2026'])[0]);
const noteList = ref<string[]>([]);
const tableData: any = ref([]);
const columns = computed(() => {
	const c = props.curTab || {};
	if (typeof c.cols === 'function') {
		return c.cols(year.value);
	}
	return c.cols || [];
});
const loading = ref(false);
// 合计行合并 + 类别列合并
// 扁平化列，获取叶子列
const flattenCols = (cols: any[]): any[] =>
	cols.reduce((acc: any[], col: any) => {
		if (col.children) {
			acc.push(...flattenCols(col.children));
		} else {
			acc.push(col);
		}
		return acc;
	}, []);

// 找到需要合并的类别列信息
const spanMergeInfo = computed(() => {
	// 把columns树转换成扁平数组
	const flatCols = flattenCols(columns.value);
	// 查找出所有要合并相同值的列
	const mergeColIndex = flatCols.findIndex((col: any) => col.spanMerge);
	return {
		mergeColIndex,
		mergeProp: mergeColIndex >= 0 ? flatCols[mergeColIndex].prop : null,
	};
});
// 第一行显示合计，合计占用的列数
const suffixTotal = computed(() => props.curTab.suffixTotal);
const spanMethod = ({ rowIndex, columnIndex }: any) => {
	// 合计行：合并前 N 列
	if (suffixTotal.value && rowIndex === 0) {
		if (columnIndex === 0) {
			return { rowspan: 1, colspan: suffixTotal.value };
		}
		if (columnIndex < suffixTotal.value) {
			return { rowspan: 0, colspan: 0 };
		}
	}

	// 配置了相同值合并的列(类别列)
	const { mergeColIndex, mergeProp } = spanMergeInfo.value;
	if (mergeProp && columnIndex === mergeColIndex) {
		const offset = suffixTotal.value ? 1 : 0;
		const dataIndex = rowIndex - offset;
		const dataRows = offset ? tableData.value.slice(1) : tableData.value;

		if (dataIndex < 0) return { rowspan: 1, colspan: 1 };

		const currentVal = dataRows[dataIndex]?.[mergeProp];
		const isFirstOfGroup =
			dataIndex === 0 || dataRows[dataIndex - 1]?.[mergeProp] !== currentVal;

		if (isFirstOfGroup) {
			let count = 1;
			for (let i = dataIndex + 1; i < dataRows.length; i += 1) {
				if (dataRows[i]?.[mergeProp] === currentVal) {
					count += 1;
				} else {
					break;
				}
			}
			return { rowspan: count, colspan: 1 };
		}
		return { rowspan: 0, colspan: 0 };
	}

	return { rowspan: 1, colspan: 1 };
};
// 合并单元格添加 class
const cellClassName = ({ rowIndex, columnIndex }: any) => {
	const span = spanMethod({ rowIndex, columnIndex });
	if (span.rowspan > 1 || span.colspan > 1) {
		return 'span-col';
	}
	return '';
};

const getList = () => {
	if (!props.dateValue.startTimeStr || !props.dateValue.endTimeStr) {
		return;
	}
	const { func, searchParams, notes } = props.curTab;

	if (func) {
		const params = {
			...props.dateValue,
			...searchParams,
		};
		loading.value = true;
		func(params)
			.then((res: any) => {
				if (!res.data) {
					tableData.value = [];
					return;
				}
				const dataField = searchParams.merged ? 'mergedRows' : 'rows';
				const data = res.data[dataField] || [];
				const mappedData = data.map((item: any, index: number) => ({
					...item,
					index: index + 1,
				}));
				// 在第一行插入合计行
				if (suffixTotal.value && mappedData.length > 0) {
					const key = columns.value[0]?.prop;
					const sumField = searchParams.merged ? 'mergedSummaries' : 'summaries';
					const summaries = (res.data[sumField] && res.data[sumField][0]) || {};
					const totalRow: any = {
						type: 'total',
						...summaries,
						[key]: '合计',
					};
					tableData.value = [totalRow, ...mappedData];
				} else {
					tableData.value = mappedData;
				}
				noteList.value = [...(res.noteList || []), ...(notes || [])];
			})
			.finally(() => {
				loading.value = false;
			})
			.catch(() => {
				tableData.value = [];
				noteList.value = [];
			});
	}
};
const tableRowClassName = ({ row }: { row: any }) => {
	if (isOwnDept(row)) {
		return 'yellow-row';
	}
	return '';
};

const watchObj = computed(() => [props.curTab, props.dateValue]);
watch(
	() => watchObj.value,
	() => {
		getList();
	},
	{ immediate: true, deep: true }
);

const clueDetailRef = ref();
const sceneDetailRef = ref();
// 线索详情
const openClueDetail = (row: any, col: any) => {
	const obj = { ...row };
	const { searchParams } = props.curTab;
	if (searchParams.merged) {
		const keys = ['receive', 'recommend'];
		keys.forEach((key) => {
			if (col.prop.indexOf(key) > -1) {
				obj.detailScopeId = row[`${key}DetailScopeId`];
			}
		});
	}
	clueDetailRef.value.show({ row: obj, col });
};
// 有效线索明细
const effectiveClueDetailRef = ref();
const openEffectiveClueDetail = (row: any, col: any) => {
	effectiveClueDetailRef.value.show({ row, col });
};
// 场景详情
const openSceneDetail = (row: any, col: any) => {
	sceneDetailRef.value.show({ row, col });
};

const entDetailRef = ref();
const openEntDetail = (row: any, col: any) => {
	const obj = {
		...row,
		columnKey: col.columnKey,
	};
	entDetailRef.value.show(obj, col);
};

const visitDetailRef = ref();
const openVisitDetail = (row: any, col: any) => {
	visitDetailRef.value.show({ row, col });
};

const projectDetailRef = ref();
const openProjectDetail = (row: any) => {
	projectDetailRef.value.show({ row });
};

const ProjectProcessDetailRef = ref()
const openProjectProcessDetail = (row: any,col:any) => {
	ProjectProcessDetailRef.value.show({ row,col });
};

const activityDetailRef = ref();
const openActivityDetail = (row: any, col: any) => {
	activityDetailRef.value.show({ row, col });
};
</script>
<style lang="less" scoped>
.general-table {
	padding-top: 0.24rem !important;
	.note-box {
		padding: 0.08rem 0.24rem;
		font-size: 0.16rem;
		padding-bottom: 0.24rem;
	}
	.project-table {
		height: 100%;
		:deep(.yellow-row) {
			td {
				background-color: #fef9e7 !important;
				&.span-col {
					background-color: transparent !important;
				}
			}
		}
	}
}
</style>