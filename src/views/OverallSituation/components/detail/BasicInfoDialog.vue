<template>
	<el-dialog
		v-model="dialogVisible"
		width="13.84rem"
		:append-to-body="true"
		class="basic-info-dialog"
	>
		<TitleBody name="基本信息">
			<div class="top-box fx-r">
				<div class="left-wrap"></div>
				<div class="right-wrap">
					<div class="one fx-r">
						<span class="bold-text">{{ entInfo.companyName?.split('-')[0] }}</span>
						<span class="icon-bg" v-if="false">曾用名</span>
						<span class="icon-bg" v-if="entInfo.status">{{ entInfo.status }}</span>
					</div>
					<!-- <div class="two fx-r">
						<span
							class="tag-items"
							:class="item.color"
							v-for="(item, index) in tagArr"
							:key="index"
						>
							{{ item.name }}
						</span>
					</div> -->
				</div>
			</div>
			<div class="bottom-box fx-c">
				<div class="desc-box">
					<div class="items-box fx-r" v-for="(item, index) in descList" :key="index">
						<span class="dot">·</span>
						<span class="label">{{ item.label }}：</span>
						<span class="value">{{ item.value ?? '-' }}</span>
					</div>
				</div>
				<div class="introduction-box fx-r">
					<div class="introduction-title fx-r">
						<span class="dot">·</span>
						<span class="label">简介：</span>
					</div>
					<div class="introduction-main fx-c">
						<div
							class="main-item"
							v-for="(item, index) in introductionDesc"
							:key="index"
						>
							<span class="label">{{ item.label }}:</span>
							<span class="value">{{ item.value ?? '-' }}</span>
						</div>
					</div>
				</div>
			</div>
		</TitleBody>
	</el-dialog>
</template>
<script setup lang="ts">
const props = defineProps<{
	entInfo: any;
}>();
const dialogVisible = ref(false);
const show = () => {
	dialogVisible.value = true;
};

/* const tagArr = [
	{
		name: '央企母公司',
		color: 'blue',
	},
	{
		name: '规模以上服务业',
		color: 'blue',
	},
	{
		name: '发债企业',
		color: 'orange',
	},
	{
		name: '被执行人',
		color: 'red',
	},
]; */

const descList = ref([
	{
		label: '法定代表人',
		value: '-',
	},
	{
		label: '企业规模',
		value: '-',
	},
	{
		label: '官网',
		value: '-',
	},
	{
		label: '统一社会信用代码',
		value: '-',
	},
	{
		label: '行业',
		value: '-',
	},
	{
		label: '邮箱',
		value: '-',
	},
	{
		label: '成立日期',
		value: '-',
	},
	{
		label: '社保人数',
		value: '-',
	},
	{
		label: '电话',
		value: '-',
	},
	{
		label: '注册资本',
		value: '-',
	},
	{
		label: '类型',
		value: '-',
	},
	{
		label: '住所',
		value: '-',
	},
	{
		label: '实缴资本',
		value: '-',
	},
	{
		label: '营业期限',
		value: '-',
	},
	{
		label: '核准日期',
		value: '-',
	},
	{
		label: '企业年报',
		value: '-',
	},
]);

const introductionDesc = [
	{
		label: '基本信息',
		value: '-',
	},
	{
		label: '资本运作',
		value: '-',
	},
	{
		label: '行业地位',
		value: '-',
	},
	{
		label: '客商属性',
		value: '-',
	},
	{
		label: '科创能力',
		value: '-',
	},
	{
		label: '风险状况',
		value: '-',
	},
];

watch(
	() => props.entInfo,
	(newVl) => {
		descList.value[0].value = newVl.legalName;
		descList.value[1].value = newVl.scale;
		descList.value[2].value = newVl.domain;
		descList.value[3].value = newVl.sccode;
		descList.value[5].value = newVl.email;
		descList.value[6].value = newVl.registeredTime;
		descList.value[7].value = newVl.social;
		descList.value[8].value = newVl.tel;
		descList.value[9].value = newVl.registeredAmount + newVl.registeredAmountType;
		descList.value[10].value = newVl.enterpriseType;
		descList.value[11].value = newVl.registeredAddress;
		descList.value[12].value = `${newVl.payAmount}万元`;
		descList.value[13].value = `${newVl.startDate}至${newVl.endDate}`;
		descList.value[14].value = newVl.apprdate;
	},
	{
		immediate: true,
	}
);
defineExpose({ show });
</script>

<style lang="less" scoped>
.top-box {
	align-items: center;
	width: 13.2rem;
	height: 1.06rem;
	background-size: 100% 100%;
	background-image: url('@/assets/images/runByEnterprise/newDetail/basic-dialog-top-bg.png');
	margin-bottom: 0.16rem;
	.left-wrap {
		width: 0.56rem;
		height: 0.56rem;
		background-size: 100% 100%;
		background-image: url('@/assets/images/runByEnterprise/newDetail/basic-dialog-top-icon.png');
		margin: 0.24rem 0.36rem 0.26rem 0.38rem;
	}
	.one {
		align-items: center;
		.bold-text {
			font-weight: 500;
			font-size: 0.24rem;
			color: rgba(0, 0, 0, 0.9);
			line-height: 0.24rem;
			margin-right: 0.26rem;
		}
		.icon-bg {
			display: inline-block;
			width: 0.97rem;
			height: 0.3rem;
			background-size: 100% 100%;
			margin-right: 0.1rem;
			font-weight: bold;
			font-size: 0.14rem;
			color: #ffffff;
			text-align: center;
			line-height: 0.3rem;
			letter-spacing: 0.01rem;
			text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			&:nth-child(2) {
				background-image: url('@/assets/images/runByEnterprise/newDetail/basic-dialog-top-icon1.png');
			}
			&:nth-child(3) {
				background-image: url('@/assets/images/runByEnterprise/newDetail/basic-dialog-top-icon2.png');
			}
		}
	}
	.two {
		margin-top: 0.16rem;
		gap: 0.16rem;
		.tag-items {
			height: fit-content;
			display: inline-block;
			padding: 0.01rem 0.08rem;
			font-weight: 400;
			font-size: 0.14rem;
			line-height: 0.2rem;
			border-radius: 0.02rem;
			&.blue {
				color: #165dff;
				background: #e4f1ff;
				border: 0.01rem solid rgba(22, 93, 255, 0.5);
			}
			&.orange {
				color: #ed7b2f;
				background: #fef3e6;
				border: 0.01rem solid rgba(237, 123, 47, 0.5);
			}
			&.red {
				color: #ff4d4f;
				background: #fff2f2;
				border: 0.01rem solid rgba(255, 77, 79, 0.5);
			}
		}
	}
}
.bottom-box {
	padding: 0.16rem 0.26rem 0.01rem 0.33rem;
	width: 13.2rem;
	height: 4.66rem;
	background: #ffffff;
	box-shadow: 0rem 0.04rem 0.2rem 0rem rgba(0, 26, 70, 0.03);
	border-radius: 0.08rem;
	.dot {
		font-weight: 400;
		font-size: 0.24rem;
		color: #111111;
		line-height: 0.24rem;
		margin-right: 0.05rem;
	}
	.label {
		min-width: 0.86rem;
		white-space: nowrap;
		font-weight: 600;
		font-size: 0.14rem;
		color: #111111;
		line-height: 0.24rem;
	}
	.value {
		margin-left: 0.04rem;
		font-weight: 400;
		font-size: 0.14rem;
		color: #111111;
		line-height: 0.2rem;
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.desc-box {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 0.1rem;
		.items-box {
			flex: 1;
			flex-shrink: 0;
			align-items: center;
			height: fit-content;
			span {
				flex-shrink: 0;
			}
		}
	}

	.introduction-box {
		flex: 1;
		// height: 2.25rem;
		.introduction-main {
			gap: 0.03rem;
			.main-item {
				.label {
					min-width: auto;
					margin-top: -0.05rem;
				}
				.value {
					line-height: 0.15rem;
				}
			}
		}
	}
}
</style>

<style lang="less">
.basic-info-dialog {
	&.el-dialog {
		background: linear-gradient(180deg, #eef2ff 0%, #f8fcff 100%);
		box-shadow: 0rem 0rem 0.08rem 0rem rgba(25, 43, 138, 0.34);
		border-radius: 0.09rem;
		border: 0.02rem solid;
		border-image: linear-gradient(180deg, rgba(238, 242, 255, 1), rgba(162, 196, 255, 1)) 2 2;
		backdrop-filter: blur(0.04rem);
	}
}
</style>
