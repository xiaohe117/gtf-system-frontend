<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-12-17 17:00:28
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 10:48:58
-->
<template>
	<div class="hot-city">
		<h5>热门城市</h5>
		<ul>
			<li
				v-for="item in list"
				:key="item"
				@click="selectCity(item)"
				:class="{ active: currentCity === item && mapMode === 1 }"
			>
				{{ item }}
			</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
import useUserStore from '@/stores/user';
// import { chinaProvinces } from '@/views/RunByEnterprise/components/map/chinaProvinces';

const store = useUserStore();
// const currentCity = ref('');
const currentCity = computed(() => store.selectedHotCity);
// const list = ['北京', '上海', '广东'];
const list: any = ['北京', '上海', '广州', '深圳', '杭州', '重庆'];
// const citys: any = chinaProvinces.filter((ele) => list.find((i) => i === ele.shortName));

const mapMode = computed(() => store.mapMode);
const selectCity = (v: any) => {
	store.setMapMode(1);
	// currentCity.value = v;
	// 清空省份选择，只保留热门城市选择
	store.setProvinceName('');
	store.setSelectedHotCity(v);
};
</script>
<style lang="less" scoped>
.hot-city {
	position: absolute;
	right: 0;
	top: calc(100% + 0.18rem);
	color: #4e5969;
	font-family: YouSheBiaoTiHei;
	z-index: 3;
	background: url('@/assets/images/runByEnterprise/center/hot-city-bg.png');
	background-size: 100% 100%;
	padding: 0.12rem 0.12rem 0.45rem 0.14rem;
	box-sizing: border-box;
	h5 {
		margin: 0;
		font-size: @g-font-size-large;
		line-height: 0.26rem;
		font-weight: 400;
		letter-spacing: 0.01rem;
	}
	ul {
		font-size: @g-font-size-base;
		line-height: 0.24rem;
		padding-left: 0.04rem;
		li {
			cursor: pointer;
			margin-top: 0.08rem;
			&:hover,
			&.active {
				color: #165dff;
				font-size: @g-font-size-base;
			}
		}
	}
}
</style>
