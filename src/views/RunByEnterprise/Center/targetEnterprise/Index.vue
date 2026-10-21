<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-10-27 16:58:07
 * @LastEditors: ycyun
 * @LastEditTime: 2025-10-28 11:48:04
-->
<template>
	<div class="target-enterprise">
		<div class="left-box">
			<div
				class="type-item"
				v-for="(item, index) in typeList"
				:key="index"
				:class="{ active: curType === item.prop }"
				@click="selectType(item)"
			>
				{{ item.name }}
			</div>
		</div>
		<div class="right-box">
			<LocationChart class="content" v-if="curType === 1" />
			<NatureChart class="content" v-if="curType === 2" />
			<IndustryChart class="content" v-if="curType === 3" />
			<div class="investment">
				<img
					v-if="curType === 4"
					:src="getUrl('runByEnterprise/center/attract-investment.png')"
					alt=""
				/>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { getUrl } from '@/utils';
import LocationChart from './LocationChart.vue';
import NatureChart from './NatureChart.vue';
import IndustryChart from './IndustryChart.vue';

const typeList = ref([
	{ name: '企业所在地', prop: 1 },
	{ name: '企业性质', prop: 2 },
	{ name: '所属产业', prop: 3 },
	{ name: '招商成熟度', prop: 4 },
]);
const curType = ref(typeList.value[0].prop);
const selectType = (val: any) => {
	curType.value = val.prop;
};
</script>
<style lang="less" scoped>
.target-enterprise {
	.left-box {
		.type-item {
			height: 0.76rem;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
	.right-box {
		position: relative;
		.content {
			height: 100%;
		}
		.investment {
			width: 100%;
			height: 100%;
			padding-top: 0.04rem;
			img{
				width: 100%;
				height: 100%;
			}
		}
	}
}
</style>