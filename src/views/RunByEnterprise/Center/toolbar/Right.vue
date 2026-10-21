<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-28 10:22:01
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-30 10:53:31
-->
<template>
	<ul class="toolbar-right">
		<el-tooltip
			popper-class="toolbar-right-tooltip"
			effect="light"
			:content="item.name"
			placement="left"
			v-for="(item, index) in list"
			:key="index"
		>
			<li @click="openDialog(item)">
				<img
					class="icon-img default"
					:src="getUrl(`runByEnterprise/center/${item.icon}`)"
					alt=""
				/>
				<img
					class="icon-img active"
					:src="getUrl(`runByEnterprise/center/${item.activeIcon}`)"
					alt=""
				/>
			</li>
		</el-tooltip>
	</ul>
	<!-- <info-record-dialog ref="infoRecordRef"></info-record-dialog>
	<EnterpriseBusinessDialog ref="businessDialogRef"/> -->
</template>
<script lang="ts" setup>
import { getUrl } from '@/utils';
import ServiceUrl from '@/utils/url'

// import InfoRecordDialog from '@/views/RunByEnterprise/components/InvestmentEnterprise/dialog/InfoRecordDialog.vue';
// import EnterpriseBusinessDialog from '@/views/FormFillPage/dialog/EnterpriseBusinessDialog.vue';

// const infoRecordRef = ref()
// const businessDialogRef = ref()
const list = computed(() => [
	{
		name: '跟进记录',
		prop: '1',
		icon: 'record-icon.png',
		activeIcon: 'record-icon-active.png',
		url: 'enterprise-form/business-records/BusinessRecordsDetails?type=Add',
	},
	{
		name: '招商方向',
		prop: '2',
		icon: 'inve-icon.png',
		activeIcon: 'inve-icon-active.png',
		url: 'enterprise-form/business-direction/BusinessDirectionDetails?type=Add',
	},
	{
		name: '在穗业务',
		prop: '3',
		icon: 'buz-icon.png',
		activeIcon: 'buz-icon-active.png',
		url: 'enterprise-form/guangzhou-business/GuangzhouBusinessDetails?type=Add',
	},
]);
const openDialog = (item: any) => {
	window.open(ServiceUrl.adminUrl + item.url, '_blank');
};
</script>
<style lang="less" scoped>
.toolbar-right {
	position: absolute;
	bottom: 0.16rem;
	right: 0;
	width: 0.66rem;
	height: 1.9rem;
	background: rgba(255, 255, 255, 0.4);
	box-shadow: 0px 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
	border-radius: 0.16rem;
	border: 0.01rem solid #ffffff;
	backdrop-filter: blur(0.15rem);
	padding: 0.04rem;
	li {
		width: 0.58rem;
		height: 0.58rem;
		border-radius: 0.16rem;
		display: flex;
		align-items: center;
		justify-content: center;
		margin-bottom: 0.04rem;
		cursor: pointer;
		.icon-img {
			width: 0.36rem;
		}
		.active {
			display: none;
		}
		.default {
			display: inline-block;
		}
		&:hover {
			background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
			.default {
				display: none;
			}
			.active {
				display: inline-block;
			}
		}
		&:last-child {
			margin-bottom: 0;
		}
	}
}
</style>
<style lang="less">
.toolbar-right-tooltip {
	font-family: PingFangSC, PingFang SC;
	--el-bg-color-overlay: #ecf2fe;
	color: #0052d9;
	box-shadow: 0 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
	padding: 0.09rem 0.12rem;
	min-width: 1.11rem;
	border-radius: 0.02rem;
	font-size: 0.16rem;
}
</style>