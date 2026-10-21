<template>
	<FrameBox size="small">
		<TitleBody name="企业招商情况" class="right-big-box">
			<SmallTitle title="企业策划-挂图作战" />
			<div class="right-top fx-r fx-sp-b">
				<div class="right-top-rect fx-r fx-al-c">
					<div class="icon"></div>
					<div class="text-wrap c-pointer" @click="goToSwitch()">
						<p class="text-bold">央企挂图</p>
						<p class="text-normal">制定{{ 133 }}条计划</p>
					</div>
				</div>
				<div class="right-top-rect fx-r fx-al-c">
					<div class="icon icon2"></div>
					<div class="text-wrap">
						<!-- <p class="text-bold">类松山湖园区方案</p> -->
						<p class="text-normal">更多接入中</p>
						<!-- <p class="text-normal">制定{{ 1 }}条计划</p> -->
					</div>
				</div>
			</div>
			<SmallTitle title="企业储备-招商成熟度(建设中)" />
			<ChartContainer :chartOption="barOption" class="bar-chart" />
			<SmallTitle title="协同研判-相关情报" />
			<div class="right-bottom-box fx-r fx-sp-b">
				<div
					class="right-bottom-rect fx-r fx-al-c fx-sp-b"
					:class="{ 'c-pointer': index === 0 }"
					v-for="(item, index) in rightBtRectList"
					:key="index"
					@click="index === 0 && handleOpenUrl()"
				>
					<span class="name fx-r fx-al-c">{{ item.name }}</span>
					<span class="arrow" v-if="item.arrow"></span>
				</div>
			</div>
		</TitleBody>
	</FrameBox>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import SmallTitle from '@/components/SmallTitle.vue';
import { barChartOption } from './chartOption';

const router = useRouter();

const barOption = ref<any>({});

const rightBtRectList = [
	{
		name: '企业投融资',
		arrow: true,
	},
	{
		name: '更多规划中…',
		arrow: false,
	},
	{
		name: '更多规划中…',
		arrow: false,
	},
	{
		name: '更多规划中…',
		arrow: false,
	},
];

// 跳转至央企挂图页面
const goToSwitch = () => {
	router.push('/wallMapTable');
};

// 跳转企业投融资
const handleOpenUrl = () => {
	window.open('https://guangzhou.max.pedata.cn/client/login/');
};
onMounted(() => {
	setTimeout(() => {
		// 定义不同成熟度对应的类别名称、颜色和值
		const chartData = [
			{ name: '非常成熟', color: '#FE793B', value: 9 },
			{ name: '较为成熟', color: '#FFB637', value: 9.5 },
			{ name: '一般成熟', color: '#1EB092', value: 8 },
			{ name: '不太成熟', color: '#3489FF', value: 7 },
			{ name: '不成熟', color: '#37D9FE', value: 6 },
		];
		barOption.value = barChartOption(chartData);
	}, 500);
});
</script>

<style lang="less" scoped>
.right-top {
	margin-bottom: 0.24rem;
	column-gap: 0.16rem;
}
.right-top-rect {
	flex: 1;
	height: 1rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	.icon {
		width: 1.02rem;
		height: 0.9rem;
		background-image: url('@/assets/images/runByEnterprise/right-top-icon.png');
		background-size: 100% 100%;
	}
	&.icon2 {
		background-image: url('@/assets/images/runByEnterprise/right-top-icon2.png');
	}
	.text-bold {
		font-weight: 500;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.85);
		line-height: 0.22rem;
	}
	.text-normal {
		padding-top: 0.08rem;
		font-weight: 400;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.65);
		line-height: 0.22rem;
	}
}
.bar-chart {
	height: 3.29rem;
	margin-bottom: 0.32rem;
}
.right-bottom-box {
	flex-wrap: wrap;
	row-gap: 0.23rem;
	column-gap: 0.16rem;
}
.right-bottom-rect {
	flex-shrink: 0;
	padding: 0.17rem 0.2rem;
	width: calc((100% - 0.16rem) / 2);
	height: 0.74rem;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	.name {
		font-weight: 500;
		font-size: 0.18rem;
		color: rgba(0, 0, 0, 0.85);
		line-height: 0.22rem;
		&::before {
			content: '';
			display: inline-block;
			margin-right: 0.1rem;
			width: 0.36rem;
			height: 0.32rem;
			background-image: url('@/assets/images/runByEnterprise/right-bt-icon.png');
			background-size: 100% 100%;
		}
	}
	&:first-child {
		.name::before {
			background-image: url('@/assets/images/runByEnterprise/logo.svg');
		}
	}
	&:not(:first-child) {
		justify-content: center;
		.name::before {
			content: none;
		}
	}
	.arrow {
		width: 0.09rem;
		height: 0.12rem;
		background-image: url('@/assets/images/runByEnterprise/arrow-right.png');
		background-size: 100% 100%;
	}
}
:deep(.title-body-content) {
	display: flex;
	flex-direction: column;
}
.right-big-box {
	:deep(.title-body-content) {
		padding: 0.08rem 0.14rem 0.12rem;
	}
}
:deep(.small-title) {
	margin-bottom: 0.16rem;
}
</style>
