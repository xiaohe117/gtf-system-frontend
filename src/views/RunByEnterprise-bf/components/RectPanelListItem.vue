<template>
	<div class="rect-panel-list-item" @click="checkDetail(companyList.isDetail)">
		<div class="title">
			<div class="title-top-con fx-r fx-al-c">
				<span class="text">{{ companyList.name }}</span>
				<el-tag v-for="(item, index) in companyList.tags" :key="index" :hit="true">
					{{ item }}
				</el-tag>
			</div>
		</div>
		<div class="bottom-main fx-r fx-al-c">
			<span class="bt-text icon1">跟进单位：{{ companyList.unit }}</span>
			<span class="bt-text icon2">注册地：{{ companyList.location }}</span>
			<span class="bt-text icon3">企业性质：{{ companyList.type }}</span>
		</div>
		<div class="view-btn" v-if="companyList.isDetail">查看企业详情</div>
	</div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const props = withDefaults(
	defineProps<{
		companyList: any;
	}>(),
	{
		companyList: () => {},
	}
);

const router = useRouter();

const checkDetail = (vl: boolean) => {
	if (vl) {
		router.push({
			path: '/runByEnterprise/enterpriseDetail',
			query: {
				name: props.companyList.name || '',
			},
		});
	}
};
</script>

<style lang="less" scoped>
.rect-panel-list-item {
	position: relative;
	padding: 0.16rem;
	min-height: 0.92rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	margin-bottom: 0.16rem;
	.title {
		position: relative;
		margin-bottom: 0.11rem;
		.title-top-con {
			padding: 0 0 0.07rem 0.01rem;
			position: relative;
			z-index: 2;
		}
		.text {
			font-weight: 500;
			font-size: 0.18rem;
			color: rgba(0, 0, 0, 0.85);
			line-height: 0.22rem;
		}
		&::before {
			position: absolute;
			left: 0;
			bottom: 0;
			content: '';
			display: inline-block;
			width: 4.06rem;
			height: 0.1rem;
			background-image: url('@/assets/images/runByEnterprise/rect-panel-title-bg.png');
			background-size: 100% 100%;
		}
		.el-tag {
			margin-left: 0.08rem;
			padding: 0.01rem 0.08rem;
			background: #fffbe6;
			border-radius: 0.02rem;
			border: 0.01rem solid #ffe58f;
			font-weight: 400;
			font-size: 0.12rem;
			color: #faad14;
			line-height: 0.2rem;
		}
	}
	.bottom-main {
		.bt-text {
			flex: 1;
			display: flex;
			align-items: center;
			font-weight: 400;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.65);
			line-height: 0.22rem;
			&::before {
				margin-right: 0.04rem;
				content: '';
				display: inline-block;
				width: 0.14rem;
				height: 0.14rem;
				background-size: 100% 100%;
			}
			&.icon1 {
				&::before {
					background-image: url('@/assets/images/runByEnterprise/list-icon1.png');
				}
			}
			&.icon2 {
				&::before {
					background-image: url('@/assets/images/runByEnterprise/list-icon2.png');
				}
			}
			&.icon3 {
				&::before {
					background-image: url('@/assets/images/runByEnterprise/list-icon3.png');
				}
			}
		}
	}
	.view-btn {
		// display: none;
		cursor: pointer;
		position: absolute;
		right: 0.16rem;
		top: 50%;
		transform: translateY(-50%);
		width: fit-content;
		height: fit-content;
		padding: 0.08rem 0.16rem;
		background: linear-gradient(180deg, #5dc9fc 0%, #1b4df4 100%);
		border-radius: 0.23rem;
		font-weight: 500;
		font-size: 0.14rem;
		color: #ffffff;
		line-height: 0.2rem;
		text-align: center;
	}
	&:hover {
		cursor: pointer;
		background: rgba(255, 255, 255, 0.2);
		border: 0.01rem solid #3489ff;
		/* .view-btn {
			display: block;
		} */
	}
}
</style>
