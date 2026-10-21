<template>
	<div class="enterprise-overview">
		<div class="left-box">
			<div
				class="type-item"
				v-for="(item, index) in typeList"
				:key="index"
				:class="{ active: curType === item.prop }"
				@click="selectType(item)"
			>
				<p class="name">{{ item.name }}</p>
				<div class="number-box">
					<p class="total">
						<span class="number">{{ getNumberStr(item.total) }}</span
						><span class="unit">家</span>
					</p>
					<!-- <p class="sub-number">
						<span class="text">{{ item.rateText }}</span
						><span class="number">{{ getNumberStr(item.subNumber, item.unit,1) }}</span>
					</p> -->
				</div>
			</div>
		</div>
		<div class="right-box">
			<!-- <RoundRectTabs
				v-model="curTab"
				:tabsList="tabsList"
				v-if="curType === 'growthEnterpriseArrayVO'"
			/> -->
			<MultiHeaderTable
				class="table-box"
				:tableData="tableData"
				:columns="columns"
				height="100%"
				:hasOrder="true"
			>
				<template #companyName="{ row }">
					<div class="company-name" @click="goDetail(row)">
						{{ row.companyName }}
					</div>
				</template>
				<template #isFollow="{ row }">
					{{ row.isDj ? '是' : '否' }}
				</template>
				<template #intoDbUnitName="{ row }">
					{{ showUnitName(row) }}
				</template>
			</MultiHeaderTable>
			<div class="wall-map" @click="goToWallMap" v-if="curType !== 'targetEnterprise'">
				进入专项挂图作战
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import ServiceUrl from '@/utils/url';
import { formatNumber, getSize } from '@/utils/index';
import { useRouter } from 'vue-router';
import { getCompanyTable } from '@/api/runByEnterprise';
import { validatenull } from '@/utils/form';
// import { fakeData, fakeYqData,filterForeignCompanies } from './fakeData';

const getNumberStr = (num: any, unit?: any, minimumFractionDigits?: any) => {
	if (validatenull(num)) {
		return '-';
	}
	const min = minimumFractionDigits || 0;
	return unit ? formatNumber(num, min, 1) + unit : formatNumber(num, min, 1);
};
const showUnitName = (row: any) => {
	const isNullName = validatenull(row.intoDbUnitName);
	const isNullDistrict = validatenull(row.districtCode);
	if (!isNullName && !isNullDistrict) {
		return `${row.districtCode.replace(/^\s+/, '')}、${row.intoDbUnitName}`;
	}
	return row.intoDbUnitName || (row.districtCode && row.districtCode.replace(/^\s+/, '')) || '';
};
const router = useRouter();
const props = defineProps({
	regionName: {
		type: String,
		default: '',
	},
	mapMode: {
		type: Number,
		default: 1,
	},
});

// const curTab = ref(0);
const typeList = ref([
	{
		name: '重点央企',
		prop: 'centralEnterprise',
		total: null,
		rateText: '已对接',
		subNumber: null,
		unit: '%',
		totalProp: 'total',
		subProp: 'rate',
	},
	{
		name: '重点外资企业',
		prop: 'foreignEnterprise',
		total: null,
		rateText: '已对接',
		subNumber: null,
		unit: '%',
		totalProp: 'entNum',
		subProp: 'proNum',
	},
	{
		name: '重点民营企业',
		prop: 'privateEnterprise',
		total: null,
		rateText: '已对接',
		subNumber: null,
		unit: '%',
		totalProp: 'entNum',
		subProp: 'proNum',
	},
	{
		name: '省属国企',
		prop: 'provincialEnterprise',
		total: null,
		rateText: '已对接',
		subNumber: null,
		unit: '%',
		totalProp: 'entNum',
		subProp: 'proNum',
	},
	{
		name: '目标企业(全部)',
		prop: 'targetEnterprise',
		total: null,
		rateText: '本年新增',
		subNumber: null,
		unit: '%',
		totalProp: 'total',
		subProp: 'addByNowYearTotal',
	},
]);
const curType = ref(typeList.value[0].prop);

const allTableData = ref({}) as any;
const tableData = computed(() => {
	const arr = allTableData.value[curType.value] || [];
	arr.forEach((ele: any) => {
		ele.districtCode = ele.districtCode?.replace(/^\s+/, '') || '';
	});
	return arr;
});
// 获取数据
const getData = (isInit?: boolean) => {
	console.log('isInit', isInit);
	/*
	let country = props.mapMode === 1 ? 'china' : 'other';
	// 初始化和没有选中区域，切换到世界不能传country
	if (isInit || (props.mapMode === 0 && !props.regionName)) {
		country = '';
	}
	*/
	let country = '';
	if (props.mapMode === 1) {
		if (props.regionName !== '') {
			country = 'china';
		} else {
			country = '';
		}
	} else {
		// eslint-disable-next-line no-nested-ternary
		country = !props.regionName ? '' : props.regionName === '中国' ? 'china' : 'other';
	}
	const params = {
		province: props.regionName,
		country, // 国外：other，国内：china
	};
	getCompanyTable({ params }).then((res: any) => {
		if (res.code !== 0) return;
		typeList.value.forEach((item) => {
			const obj: any = (res.data && res.data[item.prop]) || {};
			allTableData.value[item.prop] = obj.entList || [];
			item.total = obj.entNums;
			item.subNumber = obj.touched;
		});
	});
};
const selectType = (val: any) => {
	curType.value = val.prop;
};

const columns = computed(() => {
	const arr = [
		{
			prop: 'companyName',
			label: '企业名称',
			align: 'left',
			type: 'slot',
			slotName: 'companyName',
			showToolTip: true,
			width: getSize(240),
		},
		{
			prop: 'districtCode',
			label: '所在地',
			align: 'left',
			showToolTip: true,
			width: getSize(120),
		},
		{
			prop: 'industryTypeName',
			label: '产业体系',
			align: 'left',
			showToolTip: true,
			width: getSize(140),
		},
		{
			prop: 'intoDbUnitName',
			label: '跟进部门（区）',
			align: 'left',
			showToolTip: true,
			width: getSize(180),
		},
		{
			prop: 'isDj',
			label: '是否已对接',
			align: 'left',
			showToolTip: true,
			// showType: ['targetEnterprise'],
			type: 'slot',
			slotName: 'isFollow',
			width: getSize(160),
		},
	];
	return arr;
});

const goDetail = (vl: any) => {
	window.open(
		`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${vl.companyName}&sccode=${vl.sccode}`,
		'_blank'
	);
};
watch(
	() => props.regionName,
	() => {
		getData();
	}
);
// 初始化一开始查询世界的所有
getData(true);
const goToWallMap = () => {
	router.push({
		path: '/wallMapTable',
	});
};
</script>

<style lang="less" scoped>
.enterprise-overview {
	display: flex;

	.left-box {
		gap: 0.1rem;
		overflow-y: auto;
		.type-item {
			height: 0.74rem;
			&.active {
				.name {
					color: #ffffff;
				}
			}

			.name {
				font-weight: bold;
				font-size: @g-font-size-base;
				line-height: @g-font-size-medium;
				color: #333333;
			}
			.number-box {
				display: flex;
				// justify-content: space-between;
				align-items: center;
				margin-top: 0.1rem;
			}
			.total {
				flex-shrink: 0;
				width: 0.6rem;
				.number {
					font-family: @number-font;
					font-size: @g-font-size-x-large;
					line-height: @g-font-size-x-large;
					font-weight: bold;
					display: inline-block;
				}
				.unit {
					font-size: @g-font-size-xx-small;
					margin-left: 0.08rem;
				}
			}
			.sub-number {
				font-size: 0.12rem;
				line-height: 0.24rem;
				margin-top: 0.03rem;
				display: flex;
				align-items: flex-start;
				flex-direction: column;
				.number {
					display: inline-block;
					font-family: @number-font;
					font-size: @g-font-size-medium;
					line-height: @g-font-size-x-large;
					margin-top: 0.02rem;
				}
				.text {
					display: inline-block;
					line-height: @g-font-size-small;
					white-space: pre-wrap;
					flex-shrink: 0;
					font-size: @g-font-size-small;
				}
			}
		}
	}
	.right-box {
		width: calc(100% - 1.86rem);
		flex: 1;
		position: relative;
		height: 100%;
		&.has-tab {
			.table-box {
				height: calc(100% - 0.34rem - 0.12rem);
			}
		}
		.table-box {
			height: 100%;
			:deep(.el-table) {
				height: 100% !important;
			}
		}
		.company-name {
			color: #165dff;
			cursor: pointer;
			width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		:deep(.tabs-control) {
			width: 100%;
			.tabs-control_item {
				width: 50%;
			}
			margin-bottom: 0.12rem;
		}
		.wall-map {
			position: absolute;
			bottom: -0.1rem;
			width: 5rem;
			height: 0.38rem;
			text-align: center;
			line-height: 0.38rem;
			background: url('@/assets/images/runByEnterprise/center/btn-bg.png');
			background-size: 100% 100%;
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 500;
			font-size: @g-font-size-medium;
			color: #ffffff;
			letter-spacing: 0.04rem;
			left: 50%;
			transform: translateX(-50%);
			cursor: pointer;
			z-index: 3;
		}
	}
}
</style>
