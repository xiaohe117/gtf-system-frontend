<template>
	<FrameBox class="main-content" ref="frameBoxRef">
		<TitleBody :name="curTab.specialName">
			<template #extra>
				<RoundRectTabs
					v-if="curTab.specialName === '重点央企'"
					v-model="typeTab"
					:tabsList="tabsList.map((item: any) => item.label)"
					@change="getList"
				></RoundRectTabs>
				<div class="search">
					<div class="input">
						<img
							src="@/assets/images/RecruitmentByProject/icon-left.png"
							alt=""
							class="img-left"
						/>
						<el-input
							v-model.trim="search.companyName"
							placeholder="输入企业名称查找"
							@input="debouncedSearch"
							maxlength="100"
						>
							<template #suffix>
								<img
									class="icon-rigth"
									src="@/assets/images/RecruitmentByProject/icon-rigth.png"
									alt=""
								/>
							</template>
						</el-input>
					</div>
					<div
						class="more-search"
						@click="moreFunc"
						:class="{ show: showMore, default: !showMore }"
					>
						{{ showMore ? '收起' : '展开' }}高级搜索<el-icon><DArrowLeft /></el-icon>
					</div>
				</div>
			</template>
			<MoreSearch
				v-model="search"
				v-show="showMore"
				:tableData="tableData"
				@search="getList"
				style="margin-bottom: 0.08rem"
			/>
			<Title v-if="showSearchNum" :title="`搜索到 ${tableData.length} 家相关企业`" />
			<div class="table-box" ref="tableRef" v-loading="listLoading">
				<MultiHeaderTable
					:tableData="tableData"
					:columns="columns"
					:max-height="maxHeight"
					:row-class-name="rowClassName"
					hasOrder
					@row-click="expandedFunc"
				>
					<template #companyName="scope">
						<div class="company-name">
							<span
								@click.stop="checkDetail(scope.row)"
								class="name"
								:class="{ 'text-ellipsis': expandCode !== scope.row.id }"
								>{{ scope.row.companyName }}</span
							>
							<span
								class="right-icon"
								@click.stop="expandedFunc(scope.row)"
								:class="{ 'is-expanded': expandCode === scope.row.id }"
							>
								<el-icon><ArrowRightBold /></el-icon>
							</span>
						</div>
					</template>
					<template #text="scope">
						<CellTooltip
							:value="scope.row[scope.col.prop]"
							:col="scope.col"
							:row="scope.row"
							:isExpanded="expandCode === scope.row.id"
						/>
					</template>
				</MultiHeaderTable>
			</div>
		</TitleBody>
	</FrameBox>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url'
import { queryList } from '@/api/wallMapTable';
import { debounce } from 'lodash-es';
// import dayjs from 'dayjs';
import { validatenull } from '@/utils/form';
import MoreSearch from '../components/MoreSearch.vue';
import { columns } from './data';
import CellTooltip from '../components/CellTooltip.vue';
import Title from '../components/Title.vue';

// interface DateRange {
// 	start: Date;
// 	end: Date;
// }

const props = defineProps({
	curTab: {
		type: Object,
		default: () => ({}),
	},
	dateRange: {
		type: Object as () => any,
		default: () => ({}),
	},
});

const frameBoxRef = ref();
const typeTab = ref(0);
const tableData: any = ref([]);
const listLoading = ref(false);
const search: any = ref({});
const tableRef = ref();
const maxHeight: any = ref('4rem');
const tabsList: any = [
	{ label: '全部', value: null },
	{ label: '已对接到总部', value: '1' },
	{ label: '未对接到总部', value: '0' },
];
const getMaxHeight = () => {
	nextTick(() => {
		if (!frameBoxRef.value || !tableRef.value) {
			return;
		}
		const fatherEl = frameBoxRef.value.$el.getBoundingClientRect();
		const el = tableRef.value.getBoundingClientRect();
		maxHeight.value = `${fatherEl.height - (el.top - fatherEl.top) - 12}px`;
	});
};
const showSearchNum = computed(() => {
	let hasSearch = false;
	Object.keys(search.value).forEach((key) => {
		if (!validatenull(search.value[key])) {
			hasSearch = true;
		}
	});
	return hasSearch;
});
watch(
	() => showSearchNum.value,
	() => {
		getMaxHeight();
	}
);
const getList = () => {
	const isConnected = tabsList[typeTab.value].value;
	const params = {
		...search.value,
		specialName: props.curTab.specialName,
		sort: 1, // 排序 1-按央企 2-按高层 3-按工作
		isConnected, // 是否对接总部 0 未对接 1 已经对接
		// 传isConnected参数默认带当前时间
		// startTime:  isConnected ?  dayjs().format('YYYY-MM-DD') : null
		// startTime: dayjs(props.dateRange?.start).format('YYYY-MM-DD'),
	};
	listLoading.value = true;
	queryList(params)
		.then((res: any) => {
			res.data?.forEach((ele: any, index: any) => {
				ele.id = (ele.scCode || '') + index;
			});
			tableData.value = res.data || [];
			getMaxHeight();
		})
		.finally(() => {
			listLoading.value = false;
		});
};
if (props.curTab.specialName) {
	getList();
}
const debouncedSearch = debounce(getList, 500);

onMounted(() => {
	getMaxHeight();
});
const showMore = ref(false);
const moreFunc = () => {
	showMore.value = !showMore.value;
	getMaxHeight();
};
window.addEventListener('resize', getMaxHeight);
onBeforeUnmount(() => {
	window.removeEventListener('resize', getMaxHeight);
});

const expandCode = ref('');
const expandedFunc = (row: any) => {
	if (row.id === expandCode.value) {
		expandCode.value = '';
		return;
	}
	expandCode.value = row.id;
};
const rowClassName = ({ row }: { row: any }) => {
	if (row.id === expandCode.value) {
		return 'is-expanded';
	}
	return '';
};

const checkDetail = (vl: any) => {
	window.open(
		`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${vl.companyName}&sccode=${vl.scCode}`,
		'_blank'
	);
};
const wacthObj = computed(() => [props.curTab, props.dateRange]);

watch(() => wacthObj.value, getList, { deep: true });
</script>
<style lang="less" scoped>
.search {
	display: flex;
	align-items: center;
	height: 0.34rem;
	z-index: 2;
	margin-left: auto;
	.input {
		display: flex;
		position: relative;
		.img-left {
			width: 0.66rem;
			height: 0.66rem;
			position: absolute;
			top: 0;
			top: -0.15rem;
			left: -0.35rem;
			z-index: 2;
		}
	}
	.el-input {
		height: 0.34rem;
		width: 2.94rem;
		z-index: 1;
		:deep(.el-input__wrapper) {
			background: #edf4ff;
			border: 0.01rem solid #ffffff;
			box-shadow: 0 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
			border-radius: 0.08rem;
			backdrop-filter: blur(0.1561708860759495rem);
		}
		.icon-rigth {
			width: 0.16rem;
		}
		:deep(.el-input__inner),
		:deep(.el-input__inner::placeholder) {
			font-family:
				PingFangSC,
				PingFang SC;
			color: #266fe8;
			font-size: @g-font-size-base;
			font-weight: 500;
		}
	}
	.more-search {
		width: 1.8rem;
		font-size: @g-font-size-base;
		line-height: 0.34rem;
		padding-left: 0.16rem;
		font-family: MicrosoftYaHei;
		color: #165dff;
		height: 0.33rem;
		margin-left: 0.1rem;
		cursor: pointer;
		display: flex;
		align-items: center;
		margin-right: 0.18rem;
		&.default {
			// box-shadow: 0.15rem 0rem 0.05rem 0.02rem #e6efff;
			// background: linear-gradient(142deg, rgba(212, 219, 255, 0) 0%, #d7e8fe 100%);
			// border-radius: 0.08rem 0.08rem 0.56rem 0.08rem;
			// border-image: linear-gradient(270deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1)) 1
			// 	1;
			position: relative;
			&::before {
				content: '';
				display: inline-block;
				height: 100%;
				width: 1.9rem;
				background: url('@/assets/images/wallMapTable/search-btn.png') center / 100% 100%
					no-repeat;
				position: absolute;
				left: 0;
				top: 0;
				z-index: -1;
			}
		}
		&.show {
			color: #ffffff;
			background: url('@/assets/images/wallMapTable/search-active-btn.png') center / 100% 100%
				no-repeat;
			box-shadow: none;
			.el-icon {
				transform: rotate(90deg);
			}
		}
		.el-icon {
			transform: rotate(-90deg);
			margin-left: 0.02rem;
			width: 0.2rem;
		}
	}
}
.main-content {
	:deep(.text-ellipsis) {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	:deep(.outside-content) {
		padding: 0.24rem 0.35rem 0.24rem 0.26rem;
	}
	:deep(.header .extra) {
		flex: 1;
		margin-left: 0.69rem;
		display: flex;
		justify-content: space-between;
	}
	.table-box {
		flex: 1;
	}
	.company-name {
		display: flex;
		align-items: flex-start;

		.name {
			// flex: 1;
			line-height: @g-font-size-medium;
			font-size: @g-font-size-base;
			color: #165dff;
			cursor: pointer;
		}
		.right-icon {
			margin-top: 0.02rem;
			width: 0.18rem;
			height: 0.18rem;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #d3e9fe;
			border-radius: 50%;
			margin-left: auto;
			flex-shrink: 0;
			cursor: pointer;
			transform: rotate(-90deg);
			transition: all 0.2s;
			&.is-expanded {
				transform: rotate(90deg);
				background: #165dff;
				.el-icon {
					color: #ffffff;
				}
			}
			.el-icon {
				font-weight: 600;
				color: #266fe8;
				font-size: @g-font-size-x-small;
			}
		}
	}
	:deep(.tabs-control > div) {
		line-height: 0.3rem;
		min-width: 1.9rem;
	}
	:deep(.el-table td.el-table__cell) {
		vertical-align: text-top;
	}

	:deep(.el-table .cell) {
		height: 100%;
	}
	:deep(.el-table__row.is-expanded),
	:deep(.el-table__row.is-expanded:hover > td.el-table__cell) {
		background: #deebff !important;
	}
}
</style>
