<template>
	<el-dialog v-model="dialogVisible" width="13.84rem" :append-to-body="true" class="risk-dialog">
		<TitleBody name="企业风险">
			<div class="main-con fx-r">
				<div class="risk-list-box">
					<div class="list-items header fx-r">
						<p
							v-for="(item, index) in riskListHeader"
							:key="index"
							class="list-common-item"
						>
							{{ item }}
						</p>
					</div>
					<div class="body-box" v-if="riskListData.length">
						<div
							class="list-items body-items fx-r"
							:class="{ active: activeIndex === index }"
							v-for="(item, index) in riskListData"
							:key="index"
							@click="handleClick(item, index)"
						>
							<p class="list-common-item">{{ index + 1 }}</p>
							<p class="list-common-item">{{ item.description ?? '-' }}</p>
							<p class="list-common-item">{{ item.riskTypeName ?? '-' }}</p>
							<p class="list-common-item">{{ item.riskTime ?? '-' }}</p>
						</div>
					</div>
					<default-empty-container class="body-box no-data" v-else />
				</div>

				<div class="details-box fx-c">
					<SmallTitle title="关联失信被执行人详情" class="title-margin" />
					<div class="big-box fx-1 ov-y" :class="{ 'no-data': isAllNull }">
						<div class="risk-display-box" v-if="!isAllNull">
							<RiskDisplay
								v-for="(riskType, index) in enabledRiskTypes"
								:key="index"
								:risk-data="riskData"
								:riskType="riskType"
							/>
						</div>
						<default-empty-container v-else />
					</div>
				</div>
			</div>
		</TitleBody>
	</el-dialog>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { riskArray, riskDetail } from '@/api/runByEnterprise/detail';
import RiskDisplay from './RiskDisplay.vue';
import riskConfigs from './riskConfigs';

const route = useRoute();
const sccode = computed(() => route.query.sccode);
console.log(sccode.value);

const enabledRiskTypes = computed(() => Object.keys(riskConfigs));

const dialogVisible = ref(false);
const show = () => {
	dialogVisible.value = true;
};

// 失信被执行人
const riskData = ref<any>({});
const isAllNull = computed(() => Object.values(riskData.value).every((value) => value === null));
const getRiskDetail = (riskId: any, riskType: any) => {
	const params = {
		riskId,
		riskType,
	};
	riskDetail({ params }).then((res: any) => {
		const { data } = res;
		riskData.value = data;
	});
};

// 查询风险列表
const activeIndex = ref(0);
const riskListHeader = ['序号', '风险概要', '风险类型', '时间'];
const riskListData = ref<any[]>([]);
const getRiskArray = () => {
	const params = {
		sccode: sccode.value,
		// sccode: '1',
	};
	riskArray({ params }).then((res: any) => {
		riskListData.value = res.data || [];
		getRiskDetail(riskListData.value[0]?.id || '', riskListData.value[0]?.riskType || '');
	});
};
getRiskArray();
const handleClick = (item: any, index: number) => {
	activeIndex.value = index;
	getRiskDetail(item.id, item.riskType);
};

defineExpose({ show });
</script>

<style lang="less" scoped>
.main-con {
	gap: 0.09rem;
	height: 5.75rem;
}
.risk-list-box {
	height: 100%;
	width: 5.66rem;
	display: flex;
	flex-direction: column;
	.body-box {
		flex-grow: 1;
		height: 0;
		overflow-y: auto;
		&.no-data {
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.list-items {
		width: 5.39rem;
		align-items: center;
		.list-common-item {
			text-align: center;
			font-weight: 500;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.7);
			line-height: 0.22rem;
			flex: 1;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			&:nth-child(1) {
				flex: 0.5;
			}
			&:nth-child(2) {
				flex: 2;
			}
		}
		&.header {
			margin-bottom: 0.11rem;
		}
		&.body-items {
			position: relative;
			cursor: pointer;
			height: 0.36rem;
			background: rgba(169, 181, 255, 0.1);
			border-radius: 1rem;
			border: 0.01rem solid #ffffff;
			&:not(:last-child) {
				margin-bottom: 0.05rem;
			}
		}
		&.active {
			background: linear-gradient(180deg, #1b4df4 0%, #5dc9fc 100%);
			.list-common-item {
				color: #ffffff;
			}
			&::after {
				position: absolute;
				right: -0.22rem;
				content: '';
				display: inline-block;
				width: 0;
				height: 0;
				border-top: 0.16rem solid transparent;
				border-bottom: 0.16rem solid transparent;
				border-left: 0.16rem solid #ff8900;
			}
		}
	}
}
.details-box {
	padding: 0.32rem 0.15rem 0.16rem 0.16rem;
	width: 7.22rem;
	height: 5.75rem;
	background-image: url('@/assets/images/runByEnterprise/newDetail/risk-dialog-bg.png');
	background-size: 100% 100%;
	.title-margin {
		margin-left: 0.06rem;
	}
	.big-box {
		margin-right: -0.15rem;
		&.no-data {
			display: flex;
			justify-content: center;
			align-items: center;
		}
		.risk-display-box {
			padding-right: 0.15rem;
		}
	}
}
</style>
<style lang="less">
.risk-dialog {
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
