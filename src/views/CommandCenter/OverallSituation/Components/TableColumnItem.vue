<template>
	<el-table-column
		v-if="hasChildren"
		:prop="column.prop"
		:label="column.label"
		:min-width="column.width"
		:width="column.fixWidth"
		:align="column.align || 'center'"
		:header-align="column.headerAlign || column.align || 'center'"
		:class-name="column.className"
		:label-class-name="column.labelClassName"
	>
		<TableColumnItem v-for="child in column.children" :key="child.prop" :column="child">
			<template v-for="(_, slotName) in $slots" #[slotName]="slotProps: Record<string, unknown>">
				<slot :name="slotName" v-bind="slotProps" />
			</template>
		</TableColumnItem>
	</el-table-column>
	<el-table-column
		v-else
		:prop="column.prop"
		:label="column.label"
		:min-width="column.width"
		:width="column.fixWidth"
		:align="column.align || 'center'"
		:header-align="column.headerAlign || column.align || 'center'"
		:class-name="column.className"
		:label-class-name="column.labelClassName"
	>
		<template #default="scope">
			<template v-if="column.type === 'slot'">
				<slot
					:name="column.slotName"
					:row="scope.row"
					:index="scope.$index"
					:col="column"
				></slot>
			</template>
			<template v-else>
				<EllipsisText :text="!isEmpty(scope.row[column.prop]) ? scope.row[column.prop] : EmptyConst" :lines="1"/>
			</template>
		</template>
	</el-table-column>
</template>
<script setup lang="ts">
import { isEmpty, EmptyConst } from '@/utils';
import { computed } from 'vue';
// import {getNumberStr} from '../DeptOverview/data'

interface Props {
	column: any;
}
const props = defineProps<Props>();

const hasChildren = computed(() => props.column.children && props.column.children.length > 0);
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
	font-family: PingFangSC, PingFang SC;
	font-weight: 400;
	font-size: 0.12rem;
	color: #faad14;
	margin-right: 0.08rem;
	padding: 0 0.08rem;
}

::deep(.el-tag--warning) {
	background: #fffbe6;
	border-radius: 0.02rem;
	border: 0.01rem solid #ffe58f;
}

::deep(div.el-table) {
	border-radius: 0;
	border: 0.02rem solid #d4d4d4;
	overflow: hidden;
	thead th.el-table__cell {
		padding: 0.1rem 0;
		border-right: 0.02rem solid #d4d4d4;
		border-bottom: 0.02rem solid #d4d4d4;
		background: #165dff;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: @g-font-size-base;
		color: #fff;
	}
	td.el-table__cell {
		color: rgba(0, 0, 0, 0.65);
		font-family: PingFangSC, PingFang SC;
		font-size: @g-font-size-base;
		padding: 0.08rem 0;
		border-right: 0.02rem solid #d4d4d4;
		border-bottom: 0.02rem solid #d4d4d4;
	}
	tr {
		background: #fff;
		&:nth-child(even) {
			background: #fff;
		}
	}
	.cell {
		padding: 0 0.16rem;
		box-sizing: border-box;
	}
	thead .cell {
		white-space: pre-line;
	}
	.el-table__header tr:nth-child(2) th {
		border-top: 0.02rem solid #d4d4d4;
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
			font-family: PingFangSC, PingFang SC;
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
			font-family: PingFangSC, PingFang SC;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.65);
		}
	}
}
</style>
