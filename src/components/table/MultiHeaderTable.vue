<template>
	<div class="table-container">
		<el-table
			:data="tableData"
			style="width: 100%"
			v-bind="$attrs"
			@sort-change="handleSortChange"
		>
			<el-table-column
				label="序号"
				v-if="hasOrder"
				type="index"
				:width="getSize(75)"
				align="center"
			>
				<template #default="{ $index }">
					{{ $index + 1 + page.pageSize * (page.pageNum - 1) }}
				</template>
			</el-table-column>
			<template v-for="column in columns" :key="column.prop">
				<el-table-column
					v-if="column.children && column.children.length > 0"
					:prop="column.prop"
					:label="column.label"
					:width="column.width"
					:align="column.align || 'left'"
					:header-align="column.headerAlign || 'left'"
					:show-overflow-tooltip="column.showToolTip !== false"
				>
					<template v-for="child in column.children" :key="child.prop">
						<el-table-column
							v-if="column.children && column.children.length > 0"
							:prop="child.prop"
							:label="child.label"
							:width="child.width"
							:align="child.align || 'left'"
							:header-align="child.headerAlign || 'left'"
							:show-overflow-tooltip="child.showToolTip !== false"
						>
							<template #default="scope">
								<template v-if="child.type === 'custom'">
									<div
										v-if="child.prop === 'companyName'"
										class="enterprise-name-cell"
									>
										<div class="company-name">
											{{ scope.row[child.prop] }}
											<el-tag
												v-for="tag in scope.row.tags"
												:key="tag.name"
												:type="tag.type"
												size="small"
												class="tag-item"
											>
												{{ tag.name }}
											</el-tag>
										</div>
									</div>
									<!-- 状态灯 -->
									<div
										v-else-if="child.prop === 'status'"
										class="status-indicator"
									>
										<div
											class="status-light"
											:class="'status-' + scope.row[child.prop]"
										></div>
									</div>
									<!-- 亮灯 -->
									<div
										v-else-if="child.prop === 'lampStatus'"
										class="lamp flex-x-center"
									>
										<div
											class="status-light-lamp flex-x-center"
											:class="'status-' + scope.row[child.prop]"
										>
											<img src="@/assets/images/gtf/lamp.png" alt="" />
										</div>
									</div>
									<!-- 百分比 -->
									<div
										v-else-if="child.prop === 'completion'"
										class="completion-cell"
									>
										{{ formatNumber(scope.row[child.prop], 1, 1) }}%
									</div>
									<!-- 黄灯数量 -->
									<div
										v-else-if="child.prop === 'yellowCount'"
										class="light-count yellow-count"
									>
										{{ scope.row[child.prop] }}
									</div>
									<!-- 其他自定义 -->
									<div v-else class="one-row-ellipsis">
										{{ scope.row[child.prop] || '--' }}
									</div>
								</template>
								<template v-else-if="child.type === 'amount'">
									{{ formatNumber(scope.row[child.prop], 2)
									}}{{ scope.row[child.unit] }}
								</template>
								<template v-if="child.type === 'slot'">
									<slot
										:name="child.slotName"
										:row="scope.row"
										:index="scope.$index"
										:col="child"
									></slot>
								</template>
							</template>
						</el-table-column>
					</template>
				</el-table-column>
				<el-table-column
					v-else
					:prop="column.prop"
					:label="column.label"
					:width="column.width"
					:align="column.align || 'left'"
					:header-align="column.headerAlign || 'left'"
					:show-overflow-tooltip="column.showToolTip !== false"
				>
					<!-- ✅ 表头插槽：优先使用 #xxxHeader，否则用默认 label -->
					<template #header>
						<!-- 插槽名约定：`${column.prop}Header` -->
						<slot
							:name="getHeaderSlotName(column)"
							:column="column"
							:filters="currentFilters"
							:onFilterChange="handleFilterChange"
						>
							{{ column.label }}
						</slot>
					</template>
					<template #default="scope">
						<template v-if="column.type === 'custom'">
							<div v-if="column.prop === 'companyName'" class="enterprise-name-cell">
								<div class="company-name">
									{{ scope.row[column.prop] }}
									<el-tag
										v-for="tag in scope.row.tags"
										:key="tag.name"
										:type="tag.type"
										size="small"
										class="tag-item"
									>
										{{ tag.name }}
									</el-tag>
								</div>
							</div>
							<!-- 状态灯 -->
							<div v-else-if="column.prop === 'status'" class="status-indicator">
								<div
									class="status-light"
									:class="'status-' + scope.row[column.prop]"
								></div>
							</div>
							<!-- 亮灯 -->
							<div
								v-else-if="column.prop === 'lampStatus'"
								class="lamp flex-x-center"
							>
								<div
									class="status-light-lamp flex-x-center"
									:class="'status-' + scope.row[column.prop]"
								>
									<img src="@/assets/images/gtf/lamp.png" alt="" />
								</div>
							</div>
							<!-- 百分比 -->
							<div v-else-if="column.prop === 'completion'" class="completion-cell">
								{{ formatNumber(scope.row[column.prop], 1, 1) }}%
							</div>
							<!-- 黄灯数量 -->
							<div
								v-else-if="column.prop === 'yellowCount'"
								class="light-count yellow-count"
							>
								{{ scope.row[column.prop] }}
							</div>
							<!-- 其他自定义 -->
							<div v-else class="one-row-ellipsis">
								{{ scope.row[column.prop] || '--' }}
							</div>
						</template>
						<template v-else-if="column.type === 'amount'">
							{{ formatNumber(scope.row[column.prop], 2)
							}}{{ scope.row[column.unit] }}
						</template>
						<template v-if="column.type === 'slot'">
							<slot
								:name="column.slotName"
								:row="scope.row"
								:index="scope.$index"
								:col="column"
							></slot>
						</template>
					</template>
				</el-table-column>
			</template>
		</el-table>
		<div v-if="isPage" class="pagination-container">
			<div class="pagination-left">
				<slot name="paginationLeft" />
			</div>
			<el-pagination
				class="custom-class"
				v-model:current-page="page.pageNum"
				v-model:page-size="page.pageSize"
				:page-sizes="[10, 50, 100, 200]"
				layout="total, prev, pager, next"
				:total="total"
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { formatNumber, getSize } from '@/utils';

const emit = defineEmits(['handleSizeChange', 'handleCurrentChange', 'handleSortChange']);

interface Tag {
	name: string;
	type: string;
}

export interface TableColumn {
	prop: string;
	label: string;
	width?: string | number;
	align?: 'left' | 'center' | 'right';
	type?: 'default' | 'custom';
}

interface TableRow {
	[key: string]: any;
	tags?: Tag[];
}

interface Props {
	tableData: TableRow[];
	columns: any[];
	hasOrder?: boolean;
	isPage?: boolean;
	total?: number;
	current?: number;
	size?: number;
}
const props = defineProps<Props>();

// 筛选值存储
const currentFilters = ref<Record<string, any>>({});

// 获取表头插槽名，例如 projectName → projectNameHeader
function getHeaderSlotName(column: TableColumn): string {
	return `${column.prop}Header`;
}

// 提供给父组件的筛选更新方法
function handleFilterChange(prop: string, value: any) {
	currentFilters.value[prop] = value;
}
const page = reactive<{
	pageNum: number;
	pageSize: number;
}>({
	pageNum: 1,
	pageSize: 10,
});

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	let order1 = '';
	if (order && order === 'ascending') {
		order1 = 'asc';
	}
	if (order && order === 'descending') {
		order1 = 'desc';
	}
	emit('handleSortChange', { prop, order: order1 });
};

watch(
  () => ({
    current: props.current,
    size: props.size
  }),
  (newVal) => {
    const current = Number(newVal.current)
    const size = Number(newVal.size)

    if (!Number.isNaN(current)) {
      page.pageNum = current
    }
    if (!Number.isNaN(size)) {
      page.pageSize = size
    }
  },
  { immediate: true }
)
const handleSizeChange = (size: number) => {
	emit('handleSizeChange', size);
	emit('handleCurrentChange', 1);
};
const handleCurrentChange = (currentPage: number) => {
	emit('handleCurrentChange', currentPage);
};
</script>

<style lang="less" scoped>
.enterprise-name-cell {
	display: flex;
	flex-direction: column;
	gap: 0.08rem;
}

.company-name {
	font-weight: 500;
	color: #303133;
	line-height: 1.4;
}

.tags-container {
	display: flex;
	flex-wrap: wrap;
	gap: 0.06rem;
}

.tag-item {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	font-size: 0.12rem;
	color: #faad14;
	margin-right: 0.08rem;
	padding: 0 0.08rem;
}

:deep(.el-tag--warning) {
	background: #fffbe6;
	border-radius: 0.02rem;
	border: 0.01rem solid #ffe58f;
}

:deep(div.el-table) {
	// height: calc(100% - 0.6rem) !important;
	border-radius: 0;
	border: 0.01rem solid #aaccff;
	overflow: hidden;
	thead th.el-table__cell {
		padding: 0.1rem 0;
		border-right: 0.01rem solid #aaccff;
		background: #e4f1ff;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: #333;
	}
	td.el-table__cell {
		color: rgba(0, 0, 0, 0.65);
		font-family:
			PingFangSC,
			PingFang SC;
		font-size: @g-font-size-base;
		padding: 0.08rem 0;
		border-right: 0.01rem solid #aaccff;
	}
	tr {
		background: #f8fcff;
		&:nth-child(even) {
			background: #ecf3fd;
		}
	}
	.cell {
		padding: 0 0.16rem;
	}
	.el-table__header tr:nth-child(2) th {
		border-top: 0.01rem solid #aaccff;
	}
}

.lamp {
	.status-light-lamp {
		width: 0.22rem;
		height: 0.22rem;
		border-radius: 0.04rem;

		&.status-red {
			background: linear-gradient(180deg, #f1928b 0%, #df5953 100%);
		}

		&.status-yellow {
			background: linear-gradient(180deg, #ffcf6b 0%, #ffb10d 100%);
		}

		&.status-green {
			background: linear-gradient(180deg, #8bce9d 0%, #53a064 100%);
		}

		img {
			width: 0.16rem;
		}
	}
}
.status-indicator {
	display: flex;
	justify-content: center;
	align-items: center;
}

.status-light {
	width: 16px;
	height: 16px;
	border-radius: 50%;
	box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);

	&.status-red {
		background: linear-gradient(135deg, #ff6b6b, #ee5a52);
		box-shadow: 0 0 8px rgba(255, 107, 107, 0.4);
	}

	&.status-yellow {
		background: linear-gradient(135deg, #ffd93d, #ff9f40);
		box-shadow: 0 0 8px rgba(255, 217, 61, 0.4);
	}

	&.status-green {
		background: linear-gradient(135deg, #51cf66, #40c057);
		box-shadow: 0 0 8px rgba(81, 207, 102, 0.4);
	}
}
.light-count {
	font-weight: 600;
	font-size: 14px;
	text-align: center;
}

.red-count {
	color: #ff4d4f;
}

.yellow-count {
	color: #faad14;
}
.pagination-container {
	padding-top: 0.15rem;
	display: flex;
	justify-content: flex-end;
	:deep(.el-pagination) {
		.el-pager li,
		.btn-prev,
		.btn-next {
			color: rgba(0, 0, 0, 0.65);
			padding: 0.05rem 0.1rem;
			font-family:
				PingFangSC,
				PingFang SC;
			font-size: 0.18rem;
			background: #ffffff;
			border-radius: 0.02rem;
			border: 0.01rem solid rgba(0, 0, 0, 0.15);
			margin-left: 0.08rem;
		}
		.el-pager li.is-active {
			color: #165dff;
			border-color: #165dff;
			font-weight: 400;
		}
		.el-pagination__total,
		.el-pagination__sizes {
			font-family:
				PingFangSC,
				PingFang SC;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}
</style>
<style lang="less">
.el-select-dropdown {
	font-family:
		PingFangSC,
		PingFang SC;
	font-size: 0.18rem;
	color: rgba(0, 0, 0, 0.65);
	.el-select-dropdown__item {
		&.is-selected {
			color: #165dff;
		}
	}
}
</style>
