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
				{{ formatCityName(item.cityName) }}
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

const formatCityName = (name: string) => (name || '').replace(/市$/, '');

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
	top: 0.1rem;
	left: 0.04rem;
	z-index: 3;
	width: 0.86rem;
	overflow: hidden;
	pointer-events: auto;
	background: rgba(255, 255, 255, 0.92);
	border: 0.01rem solid #8eb8ff;
	border-radius: 0.06rem;
	box-shadow: 0 0.04rem 0.12rem rgba(24, 74, 143, 0.12);
	box-sizing: border-box;

	.title {
		margin: 0;
		height: 0.36rem;
		padding: 0;
		font-family: SourceHanSansCN-Bold;
		font-size: 0.16rem;
		line-height: 0.36rem;
		color: #ffffff;
		text-align: center;
		background: linear-gradient(180deg, #4f98ff 0%, #266fe8 100%);
	}

	ul {
		margin: 0;
		padding: 0;
		list-style: none;

		li {
			width: 100%;
			height: 0.34rem;
			padding-left: 0;
			font-family: SourceHanSansCN-Bold;
			font-size: 0.14rem;
			line-height: 0.34rem;
			color: #000000;
			text-align: center;
			cursor: pointer;
			box-sizing: border-box;

			&:not(:last-child) {
				border-bottom: 0.01rem solid rgba(188, 210, 255, 0.55);
			}

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
