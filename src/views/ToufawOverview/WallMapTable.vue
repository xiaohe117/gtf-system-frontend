<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-06-22 11:15:58
 * @LastEditors: ycyun
 * @LastEditTime: 2025-07-01 10:07:07
-->
<template>
	<div class="wall-map-table">
		<header>
			<div class="btn" @click="goBack">
				<span class="content">
					<el-icon><ArrowLeftBold /></el-icon>返回
				</span>
			</div>
		</header>
		<FrameBox class="main-content">
			<div class="title">
				<div class="text">央企招商挂图作战</div>
			</div>
			<DynamicTable
				class="table-box"
				:tableData="tableData"
				:columns="columns"
				:max-height="'8.8rem'"
			>
			<template #companyName="scope">
				<span v-if="scope.row.companyName !== '中国南方电网有限责任公司'">{{scope.row.companyName}}</span>
				<span class="link" v-else @click="checkDetail(scope.row)">{{scope.row.companyName}}</span>
			</template>
			</DynamicTable>
		</FrameBox>
	</div>
</template>
<script lang="ts" setup>
import { ArrowLeftBold } from '@element-plus/icons-vue';
import { useRouter } from 'vue-router';
import { wallColumns,getExcelData } from './data';

const tableData = ref([]) as any;

const router = useRouter();

const goBack = () => {
	const { query }:any = router.currentRoute.value
	if (query.bRoute) {
		router.replace({ path:query. bRoute });
		return;
	}
	router.go(-1);
};
const columns = wallColumns;
onMounted(() => {
	getExcelData('./excel/wallMapTable.xlsx',0).then((res:any) => {
		const arr = res.sort((a:any, b:any) => a.index - b.index)
		tableData.value = arr
	})
})
const checkDetail = (vl: any) => {
	router.push({
		path: '/runByEnterprise/enterpriseDetail',
		query: {
			name: vl.companyName || '',
		},
	});
};
</script>
<style lang="less" scoped>
.wall-map-table {
	font-weight: 400;
	font-family: PingFangSC, PingFang SC;
	header {
		padding: 0.16rem;
	}
	.btn {
		display: inline-block;
		cursor: pointer;
		.content {
			display: flex;
			align-items: center;
			line-height: 0.22rem;
			background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
			color: #fff;
			border-radius: 0.23rem;
			padding: 0.08rem 0.22rem;
			font-size: 0.14rem;
		}
	}
	:deep(.outside > div) {
		padding-top: 0 !important;
	}
	.main-content {
		width: 100%;
		height: 9.8rem;
		max-height:9.8rem !important;
		max-width: 100% !important;
		.title {
			display: flex;
			justify-content: center;
			.text {
				width: 4.6rem;
				height: 0.52rem;
				color: #ffffff;
				text-align: center;
				font-size: 0.4rem;
				line-height: 0.46rem;
				font-family: PangMenZhengDaoBiaoTiTiMianFeiBan;
				// src/assets/images/toufawOverview/title-bg.png
				background: url('@/assets/images/toufawOverview/title-bg.png') center / 100% 100%
					no-repeat;
				letter-spacing: 0.05rem;
			}
		}
        .table-box{
            margin-top: 0.24rem;
        }
	}
}
:deep(div.el-table th.el-table__cell),:deep(div.el-table td.el-table__cell){
	font-size: 0.15rem;
}
.link:hover{
	color: #1b4df4;
	text-decoration: underline;
	cursor: pointer;
}
</style>