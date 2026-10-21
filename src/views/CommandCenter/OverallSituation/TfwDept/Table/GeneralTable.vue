<template>
	<div class="general-table">
		<ComplexTable
			class="project-table"
			:tableData="tableData"
			:columns="columns"
			:hasOrder="false"
			:isPage="false"
			:span-method="spanMethod"
			v-loading="loading"
		>
			<template #clueDetail="{ row, col }">
				<Link :row="row" :col="col" @click="openClueDetail(row, col)" />
			</template>
			<template #sceneDetail="{ row, col }">
				<Link :row="row" :col="col" @click="openSceneDetail(row, col)" />
			</template>
			<template #entDetail="{ row, col }">
				<Link :row="row" :col="col" @click="openEntDetail(row, col)" />
			</template>
			<template #visitDetail="{ row, col }">
				<Link :row="row" :col="col" @click="openVisitDetail(row, col)" />
			</template>
			<template #activityDetail="{ row, col }">
				<Link :row="row" :col="col" @click="openActivityDetail(row, col)" />
			</template>
			<!-- 有效线索 -->
			<template #effectiveClue="{ row, col }">
				<Link :row="row" :col="col" @click="openEffectiveClueDetail(row, col)" />
			</template>
			<!-- 项目详情 -->
			<template #projectDetail="{ row, col }">
				<Link :row="row" :col="col" @click="openProjectDetail(row)" />
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
	</div>
</template>
<script lang="ts" setup>
import { EmptyConst, isEmpty } from '@/utils';
import type { PropType } from 'vue';
import Link from '@/views/CommandCenter/OverallSituation/Components/Link.vue';
import ComplexTable from '@/views/CommandCenter/OverallSituation/Components/ComplexTable.vue';
import ClueDetail from '../Dialog/ClueDetail.vue';
import SceneDetail from '../Dialog/SceneDetail.vue';
import EntDetail from '../Dialog/EntDetail.vue';
import VisitDetail from '../Dialog/VisitDetail.vue';
import ActivityDetail from '../Dialog/ActivityDetail.vue';
import ProjectDetail from '../Dialog/ProjectDetail.vue';
import EffectiveClueDetail from '../Dialog/EffectiveClueDetail.vue';
import config from './config';

const props = defineProps({
	curTitleTab: { type: [Number, String], default: 1 },
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
});

const year = computed(() => (props.dateValue.startTimeStr?.match(/^\d{4}/) || ['2026'])[0]);

const tableData = ref<any[]>([]);
const columns = computed(() => {
	const c = config[String(props.curTitleTab)] || {};
	if (typeof c.cols === 'function') {
		return c.cols(year.value);
	}
	return c.cols || [];
});
// 第一行显示合计，合计占用的列数
const suffixTotal = computed(() => config[String(props.curTitleTab)]?.suffixTotal);
const noteList = ref<string[]>([]);
const loading = ref(false);

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

// 合计行合并 + 类别列合并
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

const getList = () => {
	if (!props.dateValue.startTimeStr || !props.dateValue.endTimeStr) {
		return;
	}
	const { func, searchParams } = config[String(props.curTitleTab)];

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
				const c = config[String(props.curTitleTab)];
				if (c.suffixTotal && mappedData.length > 0) {
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
				noteList.value = [
					...(res.noteList || []),
					...(c.notes || []),
				];
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
const watchObj = computed(() => [props.curTitleTab, props.dateValue]);
watch(
	() => watchObj.value,
	() => {
		getList();
	},
	{ immediate: true, deep: true }
);

const clueDetailRef = ref();

// 线索详情
const openClueDetail = (row: any, col: any) => {
	const obj = { ...row };
	const { searchParams } = config[String(props.curTitleTab)];
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
const sceneDetailRef = ref();
// 场景详情
const openSceneDetail = (row: any, col: any) => {
	sceneDetailRef.value.show({ row, col });
};

const entDetailRef = ref();
const openEntDetail = (row: any, col: any) => {
	const obj = {
		...row,
		columnKey:col.columnKey
	}
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
	}
}
</style>
