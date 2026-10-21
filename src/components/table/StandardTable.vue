<!-- 标准表格 对应设计稿 0-7-1, 0-7-2 -->
<template>
	<div class="standard-table">
		<div class="standard-table_thead common-row">
			<span v-if="needIndexCell" class="common-cell order-cell">序号</span>
			<span v-if="needRankCell" class="common-cell order-cell">排名</span>
			<span
				v-for="(thead, theadIndex) in tableHead"
				:key="theadIndex"
				class="common-cell"
				:style="{
					width: `${thead.width / 100}rem`,
					flex: `${thead.isMaxCell ? 1 : ''}`,
					textAlign: thead.align,
				}"
			>
				<slot :name="`${thead.name}-head`" :item="thead" />
				<span v-if="!thead.needCustomHead">{{ thead.label }}</span>
			</span>
		</div>
		<div v-if="dataList.length" ref="tableBody" class="standard-table_tbody">
			<p
				v-for="(row, rowIndex) in dataList"
				:key="rowIndex"
				class="standard-table_tbody_tr common-row"
				:class="{ 'bold-tr': bodyStyle === 2 }"
				@click="clickRow(row)"
			>
				<span v-if="needIndexCell" class="common-cell order-cell index-cell">
					<span class="order-cell_inner index-cell_inner number-font">
						{{ handleOrderNumber(rowIndex + 1) }}
					</span>
				</span>
				<span v-if="needRankCell" class="common-cell order-cell rank-cell">
					<span class="order-cell_inner rank-cell_inner number-font">
						{{ handleOrderNumber(rowIndex + 1) }}
					</span>
				</span>
				<span
					v-for="(cell, cellIndex) in tableHead"
					:key="cellIndex"
					class="common-cell"
					:class="{
						'number-font': cell.isNumberFont,
						'btn-cell': cell.type === 'btn',
					}"
					:style="{
						width: `${cell.width / 100}rem`,
						flex: `${cell.isMaxCell ? 1 : ''}`,
						textAlign: cell.align,
					}"
				>
					<span v-if="cell.type === 'btn'" class="btn-cell_inner" @click="viewMore(row)">
						{{ btnText }}
					</span>
					<span v-if="cell.type === 'data'">
						{{ formatNumber(row[cell.name] || '--') || '--' }}
					</span>
					<template v-else-if="cell.type === 'custom'">
						<slot :name="cell.name" :item="row[cell.name]">
							{{ row[cell.name] }}
						</slot>
					</template>
					<template v-else>
						<Tooltips
							v-if="cell.needTooltips"
							:tips-content="(row[cell.name] as string) || ''"
							:showAfter="300"
						>
							{{ row[cell.name] }}
						</Tooltips>
						<template v-else>
							{{ row[cell.name] }}
						</template>
					</template>
				</span>
			</p>
		</div>
		<DefaultEmptyContainer v-else :height="tBodyHeight" />
	</div>
</template>

<!-- eslint-disable no-param-reassign -->
<script lang="ts" setup>
import { formatNumber } from '@/utils';
import Tooltips from '../widget/Tooltips.vue';

const props = withDefaults(
	defineProps<{
		tableHead: any[];
		dataList: { [key: string]: string | number }[];
		// 根据设计稿定义一屏最多展示行数(不含表头)
		maxRows: number;
		// 是否需要'序号'列
		needIndexCell?: boolean;
		// 是否需要'排名'列
		needRankCell?: boolean;
		// 分别对应设计稿 0-7-1, 0-7-2 样式
		bodyStyle?: 1 | 2;
		// 按键文案
		btnText?: string;
		// 是否需要支持宽表格（横向滚动）
		isWideTable?: boolean;
		// 主体是否需要自动滚动
		autoScrollBody?: boolean;
	}>(),
	{
		needIndexCell: false,
		needRankCell: false,
		bodyStyle: 1,
		btnText: '详情',
		isWideTable: false,
		autoScrollBody: false,
	}
);

const handleOrderNumber = (orderNum: number) => String(orderNum).padStart(2, '0');

const tableWidth = computed(() => {
	if (!props.isWideTable) {
		return `100%`;
	}
	const endPadding = 16 * 2;
	let totalWidth = props.tableHead.reduce((total, { width }) => total + width, 0);

	totalWidth += endPadding;
	if (props.needIndexCell) {
		totalWidth += 70;
	}
	if (props.needRankCell) {
		totalWidth += 70;
	}
	return `${totalWidth / 100}rem`;
});
const tBodyHeight = computed(() => {
	const rowHeight = props.bodyStyle * 42;
	return `${(props.maxRows * rowHeight) / 100}rem`;
});

const emit = defineEmits(['viewMore', 'clickRow']);
// 按钮单元格事件
const viewMore = (rowItem: { [key: string]: string | number }) => {
	emit('viewMore', rowItem);
};

const clickRow = (rowItem: { [key: string]: string | number }) => {
	emit('clickRow', rowItem);
};

const tableBody = ref<HTMLElement | null>(null);
const animationId = ref<number>();

const cancelAutoScroll = () => {
	if (animationId.value) {
		cancelAnimationFrame(animationId.value);
	}
};
const autoScroll = (dom: HTMLElement) => {
	cancelAutoScroll();
	let flag = 0;
	const scrollHandler = () => {
		const { clientHeight } = dom;
		const { scrollHeight } = dom;
		let { scrollTop } = dom;
		if (flag < 5) {
			flag += 1;
		} else {
			if (clientHeight + scrollTop + 1 < scrollHeight) {
				const scrollCount = parseFloat((1 / window.devicePixelRatio).toFixed(2)) + 0.01;
				scrollTop += scrollCount < 1 ? 1 : scrollCount;
				dom.scrollTop = scrollTop;
			} else {
				dom.scrollTop = 0;
			}
			flag = 0;
		}
		animationId.value = requestAnimationFrame(scrollHandler);
	};
	animationId.value = requestAnimationFrame(scrollHandler);
};
const startAutoScroll = () => {
	const dom = tableBody?.value;
	if (dom) {
		autoScroll(dom);
		dom.addEventListener('mouseover', () => {
			cancelAutoScroll();
		});
		dom.addEventListener('mouseout', () => {
			autoScroll(dom);
		});
	}
};

watch(
	() => props.autoScrollBody,
	(newVal) => {
		if (newVal) {
			nextTick(startAutoScroll);
		}
	}
);

onBeforeUnmount(cancelAutoScroll);
</script>

<style lang="less" scoped>
@thead-bg-color: linear-gradient(90deg, #4f9efd2e 0%, #2488ff7a 51%, #4f9efd24 100%);
@tbody-bg-color: #539cf31a;

.number-font {
	font-family: @number-font;
}
.common-row {
	height: 0.42rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
	font-size: @second-font-size;
	padding: 0 0.16rem;
	box-sizing: border-box;
}
.order-cell {
	width: 0.7rem;
	display: flex;
	justify-content: center;
}
.common-cell.number-font {
	font-size: 0.22rem;
}
.common-cell {
	padding: 0 0.14rem;
	box-sizing: border-box;

	&:first-child {
		padding-left: 0;
	}
	&:last-child {
		padding-right: 0;
	}
}

.standard-table {
	overflow-x: auto;
	padding-bottom: 0.08rem;

	&::-webkit-scrollbar {
		height: 0.05rem;
		background: #35445e;
	}
	&::-webkit-scrollbar-thumb {
		background: @blue;
	}
}
.standard-table_thead {
	color: @normal-color;
	background: @thead-bg-color;
	width: v-bind(tableWidth);
}
.standard-table_tbody {
	color: @normal-color;
	width: v-bind(tableWidth);
	height: v-bind(tBodyHeight);
	overflow-y: auto;
	background-color: @tbody-bg-color;
}
.standard-table_tbody_tr {
	width: 100%;
	cursor: pointer;

	&:nth-child(2n) {
		background-color: rgba(255, 255, 255, 0.06);
	}
	&:hover {
		background-color: rgba(79, 158, 253, 0.4);
	}
	&:not(.bold-tr) {
		.common-cell:not(.btn-cell):not(.order-cell) {
			.one-row-ellipsis();

			:deep(.el-tooltip__trigger) {
				width: 100%;
				display: block;
				.one-row-ellipsis();
			}
		}
	}
	&.bold-tr {
		height: 0.84rem;
		.common-cell:not(.btn-cell):not(.order-cell) {
			.two-row-ellipsis();
		}
	}
	.order-cell_inner {
		width: 0.24rem;
		height: 0.2rem;
		border-radius: 0.02rem;
		box-sizing: border-box;
		line-height: 0.2rem;
		text-align: center;
	}
	.index-cell_inner {
		background: #4f9efd4d;
		color: @blue;
	}
	.rank-cell_inner {
		background: #cadcff4d;
	}
	&:first-of-type {
		.rank-cell_inner {
			color: @top-one-color;
			background-color: @top-one-bg;
		}
	}
	&:nth-of-type(2) {
		.rank-cell_inner {
			color: @top-two-color;
			background-color: @top-two-bg;
		}
	}
	&:nth-of-type(3) {
		.rank-cell_inner {
			color: @top-three-color;
			background-color: @top-three-bg;
		}
	}
}
.btn-cell {
	display: flex;
	justify-content: center;
}
.btn-cell_inner {
	display: flex;
	justify-content: center;
	min-width: 0.87rem;
	height: 0.25rem;
	padding: 0 0.08rem;
	background-color: @blue;
	border-radius: 0.04rem;
	color: #fff;
	line-height: 0.25rem;
}
</style>
