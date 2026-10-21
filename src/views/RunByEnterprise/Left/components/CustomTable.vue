<!--
 * @Descripttion: 自定义表格-#header #empty
 * @Author: zhaochao
 * @Date: 2025-09-08 09:31:21
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-08 19:25:35
-->
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
				:width="getSize(48)"
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
					:align="column.align || 'center'"
					:header-align="column.headerAlign || 'center'"
					:sortable="column.sortable"
					:show-overflow-tooltip="column.showToolTip !== false"
				>
					<template v-for="child in column.children" :key="child.prop">
						<el-table-column
							v-if="column.children && column.children.length > 0"
							:prop="child.prop"
							:label="child.label"
							:width="child.width"
							:sortable="child.sortable"
							:align="child.align || 'center'"
							:show-overflow-tooltip="child.showToolTip !== false"
						>
							<template #header>
								<div v-html="child.label"></div>
							</template>
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
					:sortable="column.sortable"
					:align="column.align || 'center'"
					:show-overflow-tooltip="column.showToolTip !== false"
				>
					<template #header>
						<div v-html="column.label"></div>
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
			<template #empty>
				<DefaultEmptyContainer :height="'3rem'" />
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
}
const props = defineProps<Props>();

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
	() => props.current,
	() => {
		page.pageNum = props.current as number;
	}
);
const handleSizeChange = (size: number) => {
	emit('handleSizeChange', size);
	emit('handleCurrentChange', 1);
};
const handleCurrentChange = (currentPage: number) => {
	emit('handleCurrentChange', currentPage);
};
</script>

<style lang="less" scoped>
.table-container {
	width: 100%;
	height: 100%;
	.el-table {
		// height: calc(100% - 0.6rem) !important;
		border-radius: 0;
		overflow: hidden;
		background: transparent !important;
		:deep(thead) {
			tr {
				background: transparent !important;
				min-height: 0.4rem;
				th.is-sortable.el-table__cell{
					.cell{
						padding-right: 0.1rem;
						display: flex;
						align-items: center;
					}
				}
				th.el-table__cell {
					min-height: 0.3rem;
					padding: 0 0 0.04rem 0;
					background: none;
					font-family:
						PingFangSC,
						PingFang SC;
					font-weight: 500;
					font-size: @g-font-size-base;
					color: rgba(0, 0, 0, 0.86);
					border: none;
					background: transparent !important;

					.cell {
						line-height: 0.2rem;
						padding: 0 0 0 0.04rem;
						
					}
					&:first-child {
						.cell {
							padding-left: 0.04rem;
						}
					}
					&:nth-of-type(3) {
						text-align: center;
					}
				}
			}
		}
		:deep(tbody) {
			tr {
				td.el-table__cell {
					background: rgba(169, 181, 255, 0.2) !important;
					color: rgba(0, 0, 0, 0.65);
					font-family:
						PingFangSC,
						PingFang SC;
					font-size: @g-font-size-base;
					padding: 0.04rem 0;
					border: none;
					border-bottom: 0.06rem solid rgba(255, 255, 255, 0.5);
					border-top: 0.01rem solid #fff;
					.cell {
						padding: 0 0 0 0.04rem;
					}
					&:first-child {
						border-radius: 1rem 0 0 1rem;
						border-left: 0.01rem solid #fff;

						.cell {
							padding-left: 0.04rem;
						}
					}
					&:last-child {
						border-radius: 0 1rem 1rem 0;
						.cell {
							padding-right: 0.04rem;
						}
					}
				}
			}
		}
		.cell {
			padding: 0 0.16rem;
		}
		:deep(.el-table__inner-wrapper) {
			&::before {
				background: none;
			}
		}
		:deep(.caret-wrapper) {
			width: 0.18rem;
			height: 0.14rem;
			--el-text-color-placeholder:rgba(0,0,0,0.65);
			--el-color-primary:#165dff;
			.sort-caret {
				border-width: 0.06rem;
				left: 0.02rem;
			}
			.sort-caret.ascending {
				top: -0.06rem;
				
			}
			.sort-caret.descending {
				bottom: -0.06rem;
			}
		}
	}
}
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
