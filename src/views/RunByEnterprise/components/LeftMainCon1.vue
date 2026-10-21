<!-- 榜单企业、市领导会见企业 -->
<template>
	<div class="left-box fx-c">
		<SmallTitle title="榜单企业">
			<LineTabs :tabList="tabList" @changeTab="changeTab" />
		</SmallTitle>
		<DynamicTable :table-data="tableData" :columns="columns" class="fx-h" />
	</div>
	<div class="right-box fx-c">
		<SmallTitle title="市领导会见企业" />
		<div class="descriptions-container fx-h ov-y">
			<div class="descriptions-panel" v-for="(item, index) in descListData" :key="index">
				<p class="desc-title">{{ item.title }}</p>
				<el-tooltip
					effect="dark"
					:content="item.text"
					placement="top-start"
					:disabled="!item.isOverflow"
					popper-class="custom-tooltip"
				>
					<p
						class="desc-text main-desc"
						:ref="
							(el) => {
								textElements[index] = el;
							}
						"
						@mouseenter="checkOverflow(index)"
					>
						<span class="ellipsis-2-lines">{{ item.text }}</span>
					</p>
				</el-tooltip>

				<p class="desc-text dot">拜访企业: {{ item.enterprise }}</p>
				<p class="desc-text dot">相关市领导: {{ item.leader }}</p>
				<p class="desc-text dot">{{ item.date }}</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getSize, excelToFormattedDate } from '@/utils/index';
import SmallTitle from '@/components/SmallTitle.vue';
import LineTabs from '@/components/LineTabs.vue';
import DynamicTable from '@/components/table/DynamicTable.vue';
import { getExcelData } from '@/views/ToufawOverview/data';

const tabList = ['央企', '世界500强', '民企100强'];

const columns = ref<any[]>([
	{
		prop: 'id',
		label: '序号',
		width: getSize(57),
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '企业名称',
		width: getSize(240),
		type: 'custom',
	},
	{
		prop: 'followUnit',
		label: '跟进单位',
		align: 'center',
	},
]);
// 获取榜单企业列表
const tableData = ref<any[]>([]);
const getRankingCompaniesData = (type: string) => {
	tableData.value = [];
	getExcelData('./excel/runByEnterprise/rankingCompanies.xlsx', 0).then((res: any) => {
		const arr = res
			.sort((a: any, b: any) => a.index - b.index)
			.filter((item: any) => item.companType === type);
		tableData.value = arr.map((item: any, index: number) => ({
			id: index + 1,
			companyName: item.companyName,
			followUnit: item.followUnit,
		}));
	});
};
getRankingCompaniesData('央企');

const changeTab = (index: number) => {
	getRankingCompaniesData(tabList[index]);
};

const descListData: any = ref<any[]>([]);
// 获取市领导会见企业
const getDescListData = () => {
	descListData.value = [];
	getExcelData('./excel/runByEnterprise/leadersMeetEnterprises.xlsx', 0).then((res: any) => {
		// 按 date 降序排序（最新日期在前）
		const sortData = res.sort((a: any, b: any) => b.date - a.date);
		sortData.forEach((el: any) => {
			el.date = excelToFormattedDate(el.date);
		});
		descListData.value = sortData;
	});
};
getDescListData();

// 处理el-tooltip（有省略号，才出现浮窗）
const textElements = ref<any[]>([]);
const checkOverflow = (index: number) => {
	nextTick(() => {
		const element = textElements.value[index];
		if (element) {
			const span = element.querySelector('.ellipsis-2-lines');
			descListData.value.forEach((item: any) => {
				item.isOverflow =
					span.scrollHeight > span.clientHeight || span.scrollWidth > span.clientWidth;
			});
		}
	});
};
</script>

<style lang="less" scoped>
.left-box {
	width: 5.89rem;
	.el-table {
		background: #f5f7fa;
		border: 1px solid #e4e7ed;
		border-radius: 4px;

		.el-table__header {
			background: #f0f2f5;
		}

		.el-table__row {
			&:hover {
				background: #ecf5ff;
			}
		}
	}
}
.right-box {
	width: 5.89rem;
	.descriptions-panel {
		padding: 0.16rem;
		height: 1.74rem;
		background: rgba(169, 181, 255, 0.1);
		border-radius: 0.08rem;
		border: 0.01rem solid #ffffff;
		&:not(:last-child) {
			margin-bottom: 0.16rem;
		}
		.desc-title {
			font-weight: 500;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.85);
			line-height: 0.22rem;
			padding-bottom: 0.08rem;
		}
		.desc-text {
			display: flex;
			align-items: center;
			font-weight: 400;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.85);
			line-height: 0.22rem;
			&.main-desc {
				width: 100%;
				max-width: 100%;
				padding-bottom: 0.04rem;
			}
			&.dot {
				line-height: 0.24rem;
				color: rgba(0, 0, 0, 0.65);
				&::before {
					margin-right: 0.08rem;
					content: '';
					display: inline-block;
					width: 0.12rem;
					height: 0.12rem;
					background-color: #ffffff;
					border-radius: 50%;
					border: 0.02rem solid rgba(64, 143, 255, 1);
				}
			}
		}
	}
}
</style>
<style lang="less">
.custom-tooltip {
	&.el-popper {
		max-width: 5.4rem;
	}
}
</style>
