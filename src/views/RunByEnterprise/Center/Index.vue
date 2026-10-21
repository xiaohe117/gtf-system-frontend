<!--
 * @Author: ycyun
 * @Date: 2025-10-27 10:35:22
 * @LastEditors: ycyun
 * @LastEditTime: 2026-01-05 14:24:19
-->
<template>
	<FrameBox class="center-bottom" size="short-white">
		<TitleSelect :list="list" v-model="active" class="title">
			<el-cascader
				v-model="regionName"
				:options="options"
				@change="selectRegion"
				:props="{ value: 'name', label: 'name', emitPath: false }"
				:show-all-levels="false"
				clearable
				popper-class="center-bottom-region"
			/>
		</TitleSelect>
		<EnterpriseOverview
			class="main-content"
			v-if="active === 1"
			:regionName="regionName"
			:mapMode="Number(store.mapMode)"
		/>
		<TargetEnterprise class="main-content" v-else />
	</FrameBox>
</template>

<script lang="ts" setup>
import useUserStore from '@/stores/user';
import { chinaProvinces } from '@/views/RunByEnterprise/components/map/chinaProvinces';
import { getAreaSelectAll } from '@/api/runByEnterprise';
import { mainCountries } from '@/views/RunByEnterprise/components/map/worldCountries';
import TitleSelect from './components/TitleSelect.vue';
import EnterpriseOverview from './components/EnterpriseOverview.vue';
import TargetEnterprise from './targetEnterprise/Index.vue';

const store = useUserStore();

const list = [
	{ name: '目标企业概况', value: 1 },
	{ name: '目标企业分析', value: 2 },
];
const active = ref(list[0].value);
const regionName = ref('');
const chinaProvincesData: any = ref([]);
const worldCountriesData: any = ref([]);
const options: any = ref([
	{ name: '世界', children: worldCountriesData, mode: 0 },
	{ name: '中国', children: chinaProvincesData, mode: 1 },
]);
const specialCity: any = ref([
	{ shortName: '广州', name: '广州市' },
	{ shortName: '深圳', name: '深圳市' },
	{ shortName: '杭州', name: '杭州市' },
]);
const addCitySuffix = (city: any) => {
	const listItem: any = ['北京', '上海', '广州', '深圳', '杭州', '重庆'];
	return listItem.includes(city) ? `${city}市` : city;
};

watch(
	() => store,
	() => {
		if (store.mapMode === 0) {
			regionName.value = store.continentName;
		} else if (store.selectedHotCity) {
			// 如果选中了热门城市，直接使用城市名称
			// const list: any = ['北京', '上海', '广州', '深圳', '杭州', '重庆'];
			regionName.value = addCitySuffix(store.selectedHotCity);
		} else {
			// 否则使用省份名称
			const prov: any =
				chinaProvincesData.value.find(
					(item: any) => item.shortName === store.provinceName
				) || {};
			regionName.value = prov.name;
		}
	},
	{ immediate: true, deep: true }
);
const hotCityList = ['北京市', '上海市', '重庆市', '广州市', '深圳市', '杭州市'];

const removeCitySuffix = (cityName: string) =>
	cityName.endsWith('市') ? cityName.slice(0, -1) : cityName;

const selectRegion = () => {
	const isHotCity = hotCityList.includes(regionName.value);

	if (isHotCity) {
		store.setMapMode(1);
		store.setProvinceName('');
		store.setSelectedHotCity(removeCitySuffix(regionName.value));
		return;
	}

	store.setSelectedHotCity('');

	if (regionName.value) {
		const parent: any = options.value.find((ele: any) =>
			ele.children.find((c: any) => c.name === regionName.value)
		);
		store.setMapMode(parent.mode);
	}
	if (store.mapMode === 0) {
		store.setContinentName(regionName.value);
		return;
	}
	const prov: any =
		chinaProvincesData.value.find((item: any) => item.name === regionName.value) || {};
	store.setProvinceName(prov.shortName);
};

const getAreaList = () => {
	const params = {};
	getAreaSelectAll({ params }).then((res: any) => {
		if (res.code === 0) {
			const chinaData = res?.data?.china || [];
			const worldData = res?.data?.other || [];
			let retData: any = [];
			retData = chinaData.map((item: any) => {
				if (item.areaCodeName.includes('直辖市')) {
					item.name = item.areaCodeName.replace('(直辖市)', '').replace('（直辖市）', '');
				} else {
					item.name = item.areaCodeName;
				}
				return item;
			});
			// eslint-disable-next-line arrow-body-style
			chinaProvinces.forEach((it: any) => {
				return retData.forEach((item: any) => {
					if (item.name === it.name) {
						chinaProvincesData.value.push(it);
					}
				});
			});
			worldData.forEach((item: any) => {
				worldCountriesData.value.push({
					name: item.areaCodeName,
					isMainCountry: mainCountries.includes(item.areaCodeName),
				});
			});
			worldCountriesData.value.push({
				name: '中国',
				isMainCountry: true,
			});
			chinaProvincesData.value.push(...specialCity.value);
		}
	});
};

onMounted(() => {
	getAreaList();
});
</script>

<style lang="less" scoped>
.center-bottom {
	font-family:
		PingFangSC,
		PingFang SC;
	width: 100%;
	height: 4.52rem;
	display: flex;
	flex-direction: column;
	.title {
		position: relative;
		z-index: 3;
	}
	.main-content {
		flex: 1;
		position: relative;
		z-index: 3;
		height: calc(100% - 0.44rem - 0.16rem);
		margin-top: 0.16rem;
		display: flex;
		:deep(.left-box) {
			display: flex;
			flex-direction: column;
			justify-content: space-between;
			width: 1.86rem;
			height: 100%;
			padding-right: 0.24rem;
			.type-item {
				cursor: pointer;

				color: rgba(0, 0, 0, 0.6);
				border-radius: 0.08rem;
				padding: 0.12rem 0.16rem;
				background: url('@/assets/images/runByEnterprise/center/box-bg.png');
				background-size: 100% 100%;
				position: relative;
				&.active {
					color: #ffffff;
					text-shadow: 0 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
					background: linear-gradient(0deg, #1b4df4 0%, #5dc9fc 100%);
					&::after {
						content: '';
						display: inline-block;
						width: 0.1rem;
						height: 0.35rem;
						background: url('@/assets/images/runByEnterprise/center/arrow.png');
						background-size: 100% 100%;
						position: absolute;
						top: 50%;
						right: -0.15rem;
						transform: translateY(-50%);
					}
				}
			}
		}
		:deep(.right-box) {
			width: calc(100% - 1.86rem);
			flex: 1;
		}
	}
	:deep(.el-cascader) {
		width: 1.15rem;
		.el-input {
			border-radius: 0.23rem;
			box-shadow: none;
			font-size: @g-font-size-base;
			.el-input__wrapper {
				box-shadow: 0px 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
				border-radius: 0.23rem;
				backdrop-filter: blur(0.15rem);
				background: transparent;
				padding: 0.01rem 0.11rem;
				height: 0.4rem;
				line-height: 0.4rem;
				// 加上阴影后视觉文字不居中，手动调整
				padding-top: 0.04rem;
			}
			.el-input__inner {
				color: #898989;
			}

			.el-icon {
				font-size: @g-font-size-base;
				margin-left: 0.08rem;
			}
		}
	}
}
</style>
<style lang="less">
.center-bottom-region {
	.el-cascader-node {
		height: 0.4rem;
		line-height: 0.4rem;
		padding: 0 0.3rem 0 0.2rem;
	}
	.el-cascader-node__label {
		font-size: @g-font-size-base;
		font-weight: 400;
		font-family:
			PingFangSC,
			PingFang SC;
	}
	.el-icon {
		font-size: @g-font-size-base;
	}
}
</style>
