<template>
	<div v-if="visible" class="ent-detail-panel" :style="{ top: top }">
		<GTFMdTitle :title="detailTitle"></GTFMdTitle>
		<div class="close-btn" @click="close"></div>
		<div class="detail-body">
			<!-- 搜索区 -->
			<div class="search-bar">
				<template v-for="item in searchItems" :key="item.key">
					<el-input
						v-model="search[item.key]"
						:placeholder="item.placeholder"
						class="search-input"
						clearable
						v-if="item.type === 'input'"
					/>
					<el-select
						v-model="search[item.key]"
						:placeholder="item.placeholder"
						class="search-select"
						placement="bottom"
						v-if="item.type === 'select'"
					>
						<el-option
							v-for="o in item.options"
							:key="o.value"
							:label="o.label"
							:value="o.value"
						/>
					</el-select>
				</template>
				<el-button @click="handleReset">重置</el-button>
				<el-button type="primary" @click="handleSearch">搜索</el-button>
			</div>
			<div class="table-box">
				<!-- 表格 -->
				<ComplexTable
					:tableData="sortedData"
					:columns="columns"
					:loading="loading"
					:hasOrder="config[searchType]?.hasOrder ?? false"
					:isPage="true"
					:total="page.total"
					:size="page.pageSize"
					:current="page.pageNum"
					:span-method="spanMethod"
					@pageChange="pageChange"
				>
					<template #companyName="{ row, col }">
						<div class="company-name">
							<div @click.stop="clickDetail(row)" class="name">
								<template v-if="expandCode === row.id">{{
									row[col.prop]
								}}</template>
								<EllipsisText v-else class="single-line-ellipsis" :text="row[col.prop]" :lines="1" />
							</div>
							<span
								class="right-icon"
								@click.stop="expandedFunc(row)"
								:class="{ 'is-expanded': expandCode === row.id }"
							>
								<el-icon><ArrowRightBold /></el-icon>
							</span>
						</div>
					</template>
					<template #text="{ row, col }">
						<div class="all-content" v-if="expandCode === row.id">
							{{ emptyPlaceholder(row[col.prop], col.unit) }}
						</div>
						<EllipsisText v-else class="single-line-ellipsis" :text="emptyPlaceholder(row[col.prop], col.unit)" :lines="1" />
					</template>
					<template #spanText="{ row, col }">
						<div class="span-text" v-if="isAgendaMerged(row) || expandCode === row.id">
							{{ emptyPlaceholder(row[col.prop], col.unit) }}
						</div>
						<EllipsisText v-else class="single-line-ellipsis"
							:text="emptyPlaceholder(row[col.prop], col.unit)"
							:lines="1"
						/>
					</template>
					<template #tags="{ row }">
						<TagsTableView :value="getTagText(row.entTags, row.id)" />
					</template>
					<template #matterStatus="{ row }">
						<span>{{
							agendaStatusOptions.find(
								(item) => row.matterStatus && item.value === row.matterStatus
							)?.label || EmptyConst
						}}</span>
					</template>
				</ComplexTable>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { EmptyConst } from '@/utils';
import { emptyPlaceholder } from '@/utils/form';
import EllipsisText from '@/components/EllipsisText.vue';
import ComplexTable from '@/views/CommandCenter/OverallSituation/Components/ComplexTable.vue';
import TagsTableView from '@/components/table/TagsTableView.vue';
import { config, agendaStatusOptions } from './EntDetailData';

const props = defineProps<{
	leaderName?: string;
}>();

const visible = ref(false);
const search: any = ref({});
const page = reactive<{
	pageNum: number;
	pageSize: number;
	total: number;
}>({
	pageNum: 1,
	pageSize: 20,
	total: 0,
});

const searchType = ref(''); // 搜索类型，ent: 企业，clue:线索，project:项目

const detailTitle = computed(() => config[searchType.value]?.title || '企业明细');

const columns = computed(() => config[searchType.value]?.columns || config.ent.columns);

const idKey = computed(() => config[searchType.value]?.idKey || 'id');

const filteredData = ref<any[]>([]);

// 对议程数据进行排序（按关联企业名称排序，使相同名称相邻以便合并）
const sortedData = computed(() => {
	if (searchType.value !== 'agenda') return filteredData.value;
	return [...filteredData.value].sort((a, b) => {
		const nameA = a.companyName || '';
		const nameB = b.companyName || '';
		return nameA.localeCompare(nameB, 'zh-CN');
	});
});

// 议程表关联企业名称相同名称合并
const spanMethod = computed(() => {
	if (searchType.value !== 'agenda') return undefined;
	return ({ row, rowIndex, columnIndex }: any) => {
		// 只合并第一列（关联企业名称）
		if (columnIndex !== 0) return [1, 1];

		const data = sortedData.value;
		const currentName = row.companyName || '';

		// 向前查找：如果上一行名称相同，则当前行隐藏
		if (rowIndex > 0) {
			const prevName = data[rowIndex - 1].companyName || '';
			if (prevName === currentName) {
				return [0, 0];
			}
		}

		// 计算需要向下合并的行数
		let rowspan = 1;
		for (let i = rowIndex + 1; i < data.length; i += 1) {
			if ((data[i].companyName || '') === currentName) {
				rowspan += 1;
			} else {
				break;
			}
		}

		return [rowspan, 1];
	};
});

// 判断该行是否为合并行（相同companyName在其他行也出现）
const isAgendaMerged = (row: any) => {
	if (searchType.value !== 'agenda') return false;
	const data = sortedData.value;
	const currentName = row.companyName || '';
	return data.filter((item) => (item.companyName || '') === currentName).length > 1;
};


const loading = ref(false);

const top = ref('1.2rem');

const calcTop = () => {
	const el = document.getElementById('mayorWorkbench');
	if (el) {
		top.value = `${el.getBoundingClientRect().top}px`;
	}
};
const fetchData = async () => {
	const currentConfig = config[searchType.value];
	if (!currentConfig?.getFunc) {
		filteredData.value = [];
		page.total = 0;
		return;
	}
	loading.value = true;
	try {
		const params = {
			...search.value,
			leaderName: props.leaderName,
			pageNum: page.pageNum,
			pageSize: page.pageSize,
		};
		const transArr = ['taskType'];
		transArr.forEach((key) => {
			if (params[key] && params[key].length > 0) {
				params[key] = params[key].split(',');
			} else {
				delete params[key];
			}
		});
		const res: any = await currentConfig.getFunc(params);
		const records: any = res.data?.records || [];
		filteredData.value = records.map((item: any, index: any) => ({
			...item,
			id: `${item[idKey.value]}-${index}`,
		}));
		page.total = res.data?.total || 0;
	} catch {
		filteredData.value = [];
		page.total = 0;
	} finally {
		loading.value = false;
	}
};

const searchItems = computed(() => config[searchType.value]?.searchItems || []);

const handleReset = () => {
	search.value.keyword = '';
	search.value.entType = '';
	search.value.taskType = '';
	search.value.followStatus = '';
	search.value.matterStatus = '';
	page.pageNum = 1;
	fetchData();
};

const handleSearch = () => {
	page.pageNum = 1;
	fetchData();
};

watch(
	() => props.leaderName,
	() => {
		// 改变领导名称时，重新请求数据
		if (visible.value) {
			handleSearch();
		}
	}
);
const expandCode = ref('');

const getTagText = (entTags: string, rowId: any) => {
	if (expandCode.value === rowId) {
		return entTags;
	}
	const tags: any = (entTags && entTags.split(',')) || [];
	return tags[0] || '';
};

const expandedFunc = (row: any) => {
	if (row.id === expandCode.value) {
		expandCode.value = '';
		return;
	}
	expandCode.value = row.id;
};

// eslint-disable-next-line
const clickDetail = (row: any) => {
	// TODO: 跳转企业详情页
	const clickFunc = config[searchType.value]?.clickDetail;
	if (clickFunc) {
		clickFunc(row);
	}
};

const pageChange = ({ type, value }: { type: string; value: number }) => {
	if (type === 'page') {
		page.pageNum = value;
	} else if (type === 'size') {
		page.pageSize = value;
		page.pageNum = 1;
	}
	fetchData();
};
const emit = defineEmits(['close']);
const close = () => {
	visible.value = false;
	emit('close');
};
defineExpose({
	show: ({ searchParams, searchColType }: any) => {
		// 默认查询参数
		search.value = searchParams;
		// 搜索类型，切换搜索字段和列表字段
		searchType.value = searchColType;
		page.pageNum = 1;
		calcTop();
		visible.value = true;
		fetchData();
	},
});
</script>

<style lang="less" scoped>
.ent-detail-panel {
	width: 8rem;
	height: calc(100vh - 1.2rem);
	position: fixed;
	left: 0.16rem;
	z-index: 2000;
	display: flex;
	flex-direction: column;
	background: #f7f9fe;
	box-shadow: 0 0 0.12rem rgba(0, 0, 0, 0.12);
	border-radius: 0.14rem;
	.close-btn {
		background: url('@/assets/images/gtf/dialog-close.png') no-repeat center center;
		background-size: 100%;
		width: 0.72rem;
		height: 0.63rem;
		position: absolute;
		top: -0.01rem;
		right: -0.01rem;
		cursor: pointer;
	}

	.detail-body {
		flex: 1;
		min-height: 0;
		padding: 0.16rem 0.2rem;
		display: flex;
		flex-direction: column;
		.search-bar {
			display: flex;
			margin-bottom: 0.16rem;

			.search-input {
				flex: 1;
				max-width: 3.6rem;
				margin-right: 0.12rem;
			}
			.search-select {
				width: 1.6rem;
				margin-right: 0.12rem;
			}
		}
		.table-box {
			flex: 1;
			min-height: 0;
		}
	}
	:deep(div.el-table thead th.el-table__cell),
	:deep(div.el-table td.el-table__cell) {
		.cell {
			line-height: 0.24rem !important;
			padding: 0.04rem 0.08rem;
		}
	}
	:deep(div.el-table td.el-table__cell) {
		vertical-align: baseline;
		position: relative;
	}
	:deep(.tags-table-view) {
		.el-tag {
			margin-bottom: 0.04rem;
			&:last-child {
				margin-bottom: 0;
			}
		}
	}
}

.el-input {
	font-size: 0.16rem;
	--el-input-height: 0.36rem;
	:deep(.el-input__inner),
	:deep(.el-input__wrapper) {
		font-size: 0.16rem;
	}
	:deep(.el-input__wrapper) {
		padding: 0.01rem 0.11rem;
		height: 0.36rem;
	}
}

.el-select {
	:deep(.el-select__wrapper) {
		min-height: 0.36rem;
		font-size: 0.16rem;
		line-height: 0.36rem;
		padding: 0.04rem 0.11rem;
	}

	.el-input__suffix {
		.el-icon {
			font-size: 0.16rem;
		}
	}
}

.el-button {
	height: 0.36rem;
	padding: 0 0.16rem;
	font-size: 0.16rem;
}
.text-ellipsis {
	display: inline-block;
	width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.company-name {
	display: flex;
	align-items: flex-start;

	.name {
		line-height: 0.22rem;
		font-size: 0.16rem;
		color: #165dff;
		cursor: pointer;
		flex-shrink: 1;
		width: calc(100% - 0.16rem);
	}

	.right-icon {
		flex-shrink: 0;
		width: 0.16rem;
		height: 0.16rem;
		margin-top: 0.02rem;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #d3e9fe;
		border-radius: 50%;
		margin-left: auto;
		flex-shrink: 0;
		cursor: pointer;
		font-size: 0.12rem;
		transition: transform 0.2s;

		&.is-expanded {
			// background: #165dff;

			.el-icon {
				// color: #ffffff;
				transform: rotate(90deg);
			}
		}

		.el-icon {
			font-weight: 600;
			color: #266fe8;
		}
	}
}

.tag-item {
	margin-right: 0.04rem;
}
.tag-blue {
	background: #e6f7ff;
	border-color: #91d5ff;
	color: #1890ff;
}
.span-text {
	word-break: break-all;
}
</style>
