<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-12-17 17:00:28
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 10:48:58
-->
<template>
	<div class="hot-city">
		<div class="title">热门城市</div>
		<ul>
			<li
				v-for="item in hotCityList"
				:key="item.cityName"
				@mouseenter="handleMouseEnter(item)"
				@mouseleave="handleMouseLeave"
			>
				{{ item.cityName }}
			</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
import type { HotVisitCityItem } from './mapConfig';

interface Props {
	hotCityList: HotVisitCityItem[];
}

withDefaults(defineProps<Props>(), {
	hotCityList: () => [],
});

const emit = defineEmits<{
	hotCityHover: [cityName: string | null];
}>();

const handleMouseEnter = (item: HotVisitCityItem) => {
	emit('hotCityHover', item.cityName);
};

const handleMouseLeave = () => {
	emit('hotCityHover', null);
};
</script>
<style lang="less" scoped>
.hot-city {
	position: absolute;
	left: 0;
	bottom: 0;
	z-index: 3;
	// background-image: url('@/assets/images/runByEnterprise/center/region-count-bg.png');
	background-image: url('@/assets/images/map/rmcs-bg.png');
	background-size: 100% 100%;
	padding-top: 0.12rem;
	box-sizing: border-box;
	width: 1.06rem;
	height: 2.28rem;
	.title {
		margin: 0;
		padding-left: 0.12rem;
		font-size: 0.18rem;
		line-height: 0.22rem;
		color: #ffffff;
		font-family: AlimamaShuHeiTi, AlimamaShuHeiTi;
		font-weight: bold;
	}
	ul {
		margin-top: 0.12rem;
		li {
			cursor: pointer;
			width: 100%;
			height: 0.36rem;
			line-height: 0.36rem;
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 500;
			font-size: 0.15rem;
			color: #000000;
			padding-left: 0.12rem;
			&:hover {
				color: #165dff;
				background: linear-gradient(
					270deg,
					rgba(216, 216, 216, 0.15) 0%,
					rgba(90, 140, 252, 0.23) 87.18%,
					rgba(22, 93, 255, 0.08) 100%
				);
			}
		}
	}
}
</style>
