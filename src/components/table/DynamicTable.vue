<template>
	<div class="table-container">
		<el-table :data="tableData" style="width: 100%" v-bind="$attrs">
			<el-table-column label="序号" v-if="hasOrder" type="index" :width="getSize(75)" align="center" />
			<el-table-column
				v-for="column in columns"
				:key="column.prop"
				:prop="column.prop"
				:label="column.label"
				:width="column.width"
				:align="column.align || 'left'"
				:show-overflow-tooltip="column.showToolTip !== false"
			>
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
						<div v-else-if="column.prop === 'lampStatus'" class="lamp flex-x-center">
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
							{{ scope.row[column.prop] ?? '--' }}
						</div>
					</template>
          <template v-else-if="column.type === 'amount'">
            {{formatNumber(scope.row[column.prop], 2)}}{{scope.row[column.unit]}}
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
		</el-table>
	</div>
</template>

<script setup lang="ts">
import { formatNumber, getSize } from '@/utils';

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
}

defineProps<Props>();
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
	height: 100%;
	border-radius: 0;
	border: 0.01rem solid #aaccff;
	overflow: hidden;
	th.el-table__cell {
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
		color: #666;
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
</style>
