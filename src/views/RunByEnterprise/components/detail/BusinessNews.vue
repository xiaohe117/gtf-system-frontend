<template>
	<div class="business-news fx-r">
		<TitleBody name="企业关联关系">
			<div class="relation-rect">
				<p class="one">
					<span class="white">集团公司</span>
					<span class="black">集团母公司</span>
				</p>
				<p class="two">
					{{ relationObj.groupName ?? '-' }}<br />
					<span v-if="!isEmpty(relationObj.groupNum)">
						成员：{{ relationObj.groupNum }}家
					</span>
				</p>
			</div>
			<div class="relation-rect">
				<p class="one">
					<span class="white">受益所有人</span>
					<span class="black">受益所有人</span>
				</p>
				<p class="two">{{ relationObj.benefitOwner ?? '-' }}</p>
			</div>
			<div class="relation-rect">
				<p class="one">
					<span class="white">实际控制</span>
					<span class="black">疑似实际控制人</span>
				</p>
				<p class="two">{{ relationObj.ctrlPerson ?? '-' }}</p>
			</div>
			<div class="relation-graph-box fx-r">
				<p class="items">
					<span class="text">企业图谱</span>
				</p>
				<p class="items">
					<span class="text">股权穿透</span>
				</p>
				<p class="items">
					<span class="text">工商信息</span>
				</p>
				<p class="items">
					<span class="text">知识产权</span>
				</p>
			</div>
		</TitleBody>
		<TitleBody name="企业风险" class="risk-box">
			<template #extra>
				<div class="enter-icon" @click="handleRiskDialog">查看更多</div>
			</template>
			<ChartContainer :chartOption="pieOption" :isEmpty="isEmptyChart" class="chart-style" />
		</TitleBody>
		<TitleBody name="企业经营" class="business-operation">
			<div class="top-wrap">
				<div
					class="rect-box fx-r"
					:class="{ active: activeIndex === index }"
					v-for="(item, index) in enterpriseArr"
					:key="index"
					@click="handleClick(index)"
				>
					<p class="one fx-c">
						<span class="bold">{{ item.name }}</span>
						<span class="number-font">{{ item.value ?? '-' }}</span>
					</p>
				</div>
			</div>
			<DynamicTable
				:table-data="tableData"
				:columns="columns"
				class="table-style"
				:hasOrder="true"
			>
			</DynamicTable>
		</TitleBody>
		<div class="bottom-box fx-r">
			<p class="left fx-c">
				<span class="bold">在穗业务情况</span>
				<span class="normal"
					>{{ guangzhouBusinessObj.reportTime }}
					{{ guangzhouBusinessObj.reportUnit }}更新</span
				>
			</p>
			<el-tooltip effect="dark" :content="guangzhouBusinessObj.businessDescription" placement="top">
				<p class="right text-ellipsis2">
					{{ guangzhouBusinessObj.businessDescription }}
				</p>
			</el-tooltip>
			<div class="history-btn" @click="handleFillBusiness">
				在穗业务填报<span class="arrow"></span>
			</div>
		</div>
	</div>
	<RiskDialog ref="riskDialogRef" />
	<EnterpriseBusinessDialog ref="businessDialogRef" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getSize, isEmpty } from '@/utils/index';
import RiskDialog from '@/views/RunByEnterprise/components/detail/RiskDialog.vue';
import EnterpriseBusinessDialog from '@/views/FormFillPage/dialog/EnterpriseBusinessDialog.vue';
import {
	entRelation,
	riskSummary,
	guangzhouBusiness,
	topStatistic,
	landTransactionList,
	investmentList,
	supplierCooperationList,
	customerCooperationList,
} from '@/api/runByEnterprise/detail';
import pieChartOption from './chartOption';

const route = useRoute();
const sccode = computed(() => route?.query?.sccode);

const businessDialogRef = ref();
const handleFillBusiness = () => {
	businessDialogRef.value.show();
};

// 企业关联关系
const relationObj = ref<any>({});
const getEntRelation = () => {
	const params = {
		sccode: sccode.value,
	};
	entRelation({ params }).then((res) => {
		const { data } = res;
		relationObj.value = data || {};
	});
};
getEntRelation();

// 企业风险
const pieOption = ref({});
const riskDialogRef = ref<any>();
const isEmptyChart = ref(false);
const getRiskSummary = () => {
	isEmptyChart.value = true;
	const params = {
		sccode: sccode.value,
	};
	riskSummary({ params }).then((res: any) => {
		const { code, data } = res;
		if (code === 0 && data.length > 0) {
			isEmptyChart.value = false;
			const newData = data.map((item: any) => ({
				name: item.riskType,
				value: item.count,
				rate: item.rate,
			}));
			pieOption.value = pieChartOption(newData);
		}
	});
};
getRiskSummary();
const handleRiskDialog = () => {
	nextTick(() => {
		riskDialogRef.value.show();
	});
};

// 在穗情况
const guangzhouBusinessObj = ref<any>({});
const getGuangzhouBusiness = () => {
	const params = {
		sccode: sccode.value,
		number: 1,
	};
	guangzhouBusiness({ params }).then((res: any) => {
		const { data } = res;
		const [first] = data;
		guangzhouBusinessObj.value = first || {};
	});
};
getGuangzhouBusiness();

// 企业经营-统计数
const enterpriseArr = ref<any[]>([
	{
		name: '企业购地',
		value: 0,
	},
	{
		name: '企业融资',
		value: 0,
	},
	{
		name: '供应商信息',
		value: 0,
	},
	{
		name: '主要客户',
		value: 0,
	},
]);
const getTopStatistic = () => {
	const params = {
		sccode: sccode.value,
	};
	topStatistic({ params }).then((res: any) => {
		const { data = {} } = res;
		enterpriseArr.value[0].value = data.landTransactionNum;
		enterpriseArr.value[1].value = data.investmentEventNum;
		enterpriseArr.value[2].value = data.supplierCooperationNum;
		enterpriseArr.value[3].value = data.customerCooperationNum;
	});
};
getTopStatistic();

// 企业经营-列表
const columns1 = [
	{
		prop: 'signingDate',
		label: '签订日期',
		width: getSize(127),
	},
	{
		prop: 'transVolume',
		label: '成交价款(万元)',
		width: getSize(140),
	},
	{
		prop: 'district',
		label: '行政区',
	},
];
const columns2 = [
	{
		prop: 'invdate',
		label: '公告',
		width: getSize(115),
	},
	{
		prop: 'invamt',
		label: '融资金额(万元)',
		width: getSize(127),
	},
	{
		prop: 'invnatureName',
		label: '融资类型',
		width: getSize(140),
	},
	{
		prop: 'finname',
		label: '融资单位',
	},
];
const columns3 = [
	{
		prop: 'supplierName',
		label: '供应商名称',
		width: getSize(127),
	},
	{
		prop: 'amount',
		label: '合作金额(万元)',
		width: getSize(140),
	},
	{
		prop: 'coopCount',
		label: '合作次数',
	},
];
const columns4 = [
	{
		prop: 'custName',
		label: '客户名称',
		width: getSize(127),
	},
	{
		prop: 'amount',
		label: '合作金额(万元)',
		width: getSize(140),
	},
	{
		prop: 'coopCount',
		label: '合作次数',
	},
];
const tableConfig: any = [
	{ columns: columns1, api: landTransactionList },
	{ columns: columns2, api: investmentList },
	{ columns: columns3, api: supplierCooperationList },
	{ columns: columns4, api: customerCooperationList },
];
const activeIndex = ref(0);
const columns = ref<any[]>(tableConfig[0].columns);
const tableData = ref<any[]>([]);

const getTableData = (index: number) => {
	const { api } = tableConfig[index];
	api({ params: { sccode: sccode.value } }).then((res: any) => {
		tableData.value = res.data || [];
	});
};
const handleClick = (index: number) => {
	activeIndex.value = index;
	columns.value = tableConfig[index].columns;
	getTableData(index);
};
getTableData(0);
</script>

<style lang="less" scoped>
:deep(.title-container) {
	width: fit-content;
}
.business-operation {
	:deep(&.title-container) {
		width: 5.04rem;
	}
}
.chart-style {
	margin-top: 0.2rem;
	height: 4.1rem;
}
.table-style {
	margin-top: 0.3rem;
	height: 2.5rem;
}
.risk-box {
	flex: 1;
	.enter-icon {
		margin-right: 0.16rem;
		cursor: pointer;
		width: 1.6rem;
		height: 0.38rem;
		background-image: url('@/assets/images/runByEnterprise/newDetail/left-main-enter-icon.png');
		background-size: 100% 100%;
		font-size: 0.14rem;
		color: #165dff;
		text-align: center;
		line-height: 0.38rem;
	}
}
.business-news {
	height: calc(100% - 0.44rem);
	padding: 0.3rem 0.29rem 0.16rem 0.23rem;
	position: relative;
}
.relation-rect {
	margin-bottom: 0.08rem;
	width: 3rem;
	height: 1.13rem;
	background-size: 100% 100%;
	background-image: url('@/assets/images/runByEnterprise/newDetail/business-rect.png');
	.one {
		.white {
			display: inline-block;
			width: 1.5rem;
			height: 0.37rem;
			text-align: center;
			font-weight: bold;
			font-size: 0.14rem;
			color: #ffffff;
			line-height: 0.37rem;
			text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
		}
		.black {
			padding-left: 0.12rem;
			font-family: MicrosoftYaHei;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.85);
			line-height: 0.37rem;
		}
	}
	.two {
		text-align: center;
		margin: 0.08rem 0.35rem 0.1rem 0.17rem;
		font-size: 0.16rem;
		color: #408fff;
		line-height: 0.24rem;
		display: -webkit-box;
		-webkit-line-clamp: 2; /* 限制显示的行数 */
		-webkit-box-orient: vertical;
		overflow: hidden;
		text-overflow: ellipsis;
	}
}
.relation-graph-box {
	margin-top: 0.22rem;
	width: 2.92rem;
	flex-wrap: wrap;
	gap: 0.1rem;
	.items {
		width: 1.41rem;
		height: 0.7rem;
		background-size: 100% 100%;
		background-image: url('@/assets/images/runByEnterprise/newDetail/relation-graph-bg.png');
		box-shadow: 0rem 0.03rem 0.1rem 0rem rgba(0, 0, 0, 0.15);
		border-radius: 0.08rem;
		.text {
			margin-top: 0.4rem;
			display: inline-block;
			width: 100%;
			text-align: center;
			height: 0.26rem;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.6);
			line-height: 0.26rem;
		}
		&:hover {
			cursor: pointer;
			border: 0.02rem solid #96bbf8;
			.text {
				background: #176bf9;
				color: #ffffff;
			}
		}
	}
}
.top-wrap {
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, 1fr);
	gap: 0.16rem;
	.rect-box {
		cursor: pointer;
		align-items: center;
		width: 2.44rem;
		height: 0.77rem;
		background-image: url('@/assets/images/runByEnterprise/newDetail/rect-box-bg.png');
		background-size: 100% 100%;
		.one {
			.bold {
				font-weight: bold;
				font-size: 0.16rem;
				color: rgba(0, 0, 0, 0.6);
				line-height: 0.21rem;
			}
			.number-font {
				padding-top: 0.04rem;
				font-weight: bold;
				font-size: 0.24rem;
				color: #165dff;
				line-height: 0.32rem;
			}
		}
		&::before {
			margin: 0.1rem 0.16rem 0.1rem 0.08rem;
			content: '';
			display: block;
			width: 0.56rem;
			height: 0.56rem;
			background-image: url('@/assets/images/runByEnterprise/newDetail/business-icon1.png');
			background-size: 100% 100%;
		}
		&:nth-child(2) {
			&::before {
				background-image: url('@/assets/images/runByEnterprise/newDetail/business-icon2.png');
			}
		}
		&:nth-child(3) {
			&::before {
				background-image: url('@/assets/images/runByEnterprise/newDetail/business-icon3.png');
			}
		}
		&:nth-child(4) {
			&::before {
				background-image: url('@/assets/images/runByEnterprise/newDetail/business-icon4.png');
			}
		}
		&.active {
			background-image: url('@/assets/images/runByEnterprise/newDetail/rect-box-bg2.png');
			.one {
				.bold,
				.number-font {
					color: #ffffff;
				}
			}
		}
	}
}
.bottom-box {
	position: absolute;
	right: 0.42rem;
	bottom: 0.16rem;
	width: 9.52rem;
	height: 1.12rem;
	background-size: 100% 100%;
	background-image: url('@/assets/images/runByEnterprise/newDetail/business-new-bottom-bg.png');
	.left {
		flex-shrink: 0;
		padding-top: 0.27rem;
		padding-left: 1rem;
		.bold {
			font-family: YouSheBiaoTiHei;
			font-size: 0.22rem;
			color: #ffffff;
			line-height: 0.22rem;
			text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
		}
		.normal {
			padding-top: 0.03rem;
			font-weight: 400;
			font-size: 0.14rem;
			color: #ffffff;
			line-height: 0.22rem;
		}
	}
	.right {
		margin: 0.33rem 0rem 0.32rem 1.2rem;
		font-size: 0.14rem;
		color: rgba(0, 0, 0, 0.6);
		line-height: 0.22rem;
	}
	.history-btn {
		cursor: pointer;
		position: absolute;
		bottom: 0;
		right: -0.13rem;
		width: 1.7rem;
		height: 0.28rem;
		background-size: 100% 100%;
		background-image: url('@/assets/images/runByEnterprise/newDetail/fillin-icon.png');
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 0.14rem;
		color: #165dff;
		line-height: 0.18rem;
		.arrow {
			margin-left: 0.08rem;
			display: inline-block;
			width: 0.16rem;
			height: 0.16rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/double-arrow.png');
		}
	}
}
</style>
