<template>
	<FrameBox class="center-bottom" size="short-white">
		<img
			:src="getUrl('home/preview-icon.png')"
			class="projectLifecycle-btn"
			@click="DefaultDialogRef?.show()"
		/>
		<TitleSelect :list="list" v-model="active" class="title">
			<!-- <RoundRectTabs
				v-if="active === 1"
				v-model="curTab"
				:tabsList="['100亿+项目', '10亿+项目', '工业项目', '外资项目']"
			>
				<template #default="{ index }">
					<span
						class="tips-icon"
						@click.stop="handleTipsDialog(`tipsDialog${index + 1}`)"
					></span>
				</template>
			</RoundRectTabs> -->
			<el-cascader
				v-if="active !== 1"
				v-model="regionName"
				:options="options"
				@change="selectRegion"
				:props="{ value: 'name', label: 'name', emitPath: false }"
				:show-all-levels="false"
				clearable
				popper-class="center-bottom-region"
			/>
		</TitleSelect>
		<HighEnergyList class="main-content" :curTab="curTab" v-if="active === 1" @handleTipsDialog="handleTipsDialog"/>
		<EnterpriseOverview
			class="main-content"
			:regionName="regionName"
			:mapMode="Number(store.mapMode)"
			v-else
		/>
	</FrameBox>

	<DefaultDialog ref="DefaultDialogRef" title="广州市“大招商”“招大商”工作流程图" width="18rem">
		<img :src="getUrl('home/preview-img.png')" class="preview-img" />
	</DefaultDialog>
	<!-- 100亿+项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于100亿+项目"
		:ref="(el: any) => setDialogRef(el, 'tipsDialog1')"
		width="10.1rem"
	>
		<div class="tips-content fx-c">
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类、大宗贸易类和
					登记注册类型带“分公司”，且预计总投资<span class="blue-text"
						>大于等于100亿元</span
					>；
				</span>
			</div>
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类、大宗贸易类和
					登记注册类型带“分公司”，且<span class="blue-text"
						>达产年营收/产值大于等于100亿元</span
					>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span>
					已完成注册或者已完成迁入，且注册资本<span class="blue-text"
						>大于等于100亿元的项目</span
					>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span
					>已增资，且增资金额<span class="blue-text">大于等于100亿元</span>的项目。</span
				>
			</div>
		</div>
	</TipsDialog>
	<!-- 10亿+项目 -->
	<TipsDialog
		title="符合以下任一条件的均属于10亿+项目：（包含100亿+项目）"
		:ref="(el: any) => setDialogRef(el, 'tipsDialog2')"
		width="10.1rem"
	>
		<div class="tips-content fx-c">
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类和大宗贸易类，
					且预计总投资<span class="blue-text">大于等于10亿元</span>；
				</span>
			</div>
			<div class="items">
				<span>
					基于满足新注册（备案）高质量产业招商项目条件下，不属于产业园区类和大宗贸易类，
					且<span class="blue-text">达产年营收/产值大于等于10亿元</span>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span>
					已注册或者已完成迁入，且注册资本<span class="blue-text"
						>大于等于10亿元的项目</span
					>；
				</span>
			</div>
			<div class="items fx-al-c">
				<span>已增资，且增资金额<span class="blue-text">大于等于10亿元的项目</span>。</span>
			</div>
		</div>
	</TipsDialog>
	<!-- 工业项目 -->
	<TipsDialog
		title="工业项目"
		:ref="(el: any) => setDialogRef(el, 'tipsDialog3')"
	>
		<div class="tips-content fx-c">
			<div class="items fx-al-c">
				<span> 基于新注册（备案）高质量产业招商项目中筛取行业门类属于“工业项目”； </span>
			</div>
		</div>
	</TipsDialog>
	<!-- 外资项目 -->
	<TipsDialog
		title="外资项目"
		:ref="(el: any) => setDialogRef(el, 'tipsDialog4')"
	>
		<div class="tips-content fx-c">
			<div class="items fx-al-c">
				<span> 基于新注册（备案）高质量产业招商项目中筛取项目性质属于“外资项目”； </span>
			</div>
		</div>
	</TipsDialog>
</template>
<script lang="ts" setup>
import useUserStore from '@/stores/user';
import { getUrl } from '@/utils';
import {
	// sixContinents,
	chinaProvinces,
} from '@/views/RunByEnterprise/components/map/chinaProvinces';
import DefaultDialog from '@/components/DefaultDialog.vue';
import EnterpriseOverview from '@/views/RunByEnterprise/Center/components/EnterpriseOverview.vue';
import TipsDialog from '@/views/OverallSituation/components/TipsDialog.vue';
import { getAreaSelectAll } from '@/api/runByEnterprise';
import { mainCountries } from '@/views/OverallSituation/components/map/worldCountries';
import TitleSelect from './components/TitleSelect.vue';
import HighEnergyList from './components/HighEnergyList.vue';

const store = useUserStore();
const DefaultDialogRef = ref<InstanceType<typeof DefaultDialog> | null>(null);
const curTab = ref(0);
const list = [
	{ name: '高能级项目清单', value: 1 },
	{ name: '目标企业概况', value: 2 },
];
const active = ref(list[0].value);
const regionName = ref('');

const chinaProvincesData: any = ref([]);
const worldCountriesData: any = ref([]);
const specialCity: any = ref([
	{ shortName: '广州', name: '广州市' },
	{ shortName: '深圳', name: '深圳市' },
	{ shortName: '杭州', name: '杭州市' },
]);

const options: any = ref([
	{ name: '世界', children: worldCountriesData, mode: 0 },
	{ name: '中国', children: chinaProvincesData, mode: 1 },
]);

// 注释说明弹窗
const dialogRefs = {
	tipsDialog1: ref<any>(),
	tipsDialog2: ref<any>(),
	tipsDialog3: ref<any>(),
	tipsDialog4: ref<any>(),
};

const handleTipsDialog = (name: string) => {
	const dialogRef = (dialogRefs as any)[name];
	dialogRef.value?.show?.();
};

// 模板引用需要绑定
const setDialogRef = (el: any, name: keyof typeof dialogRefs) => {
	dialogRefs[name].value = el;
};

const addCitySuffix = (city: any) => {
	const listItem: any = ['北京', '上海', '广州', '深圳', '杭州', '重庆'];
	return listItem.includes(city) ? `${city}市` : city;
};

watch(
	() => [store.provinceName,store.continentName,store.selectedHotCity,store.mapMode],
	() => {
		if (
			store.provinceName !== '' ||
			store.continentName !== '' ||
			store.selectedHotCity !== ''
		) {
			active.value = 2;
		}
		if (store.mapMode === 0) {
			regionName.value = store.continentName;
		} else if (store.selectedHotCity) {
			// 如果选中了热门城市，直接使用城市名称
			// regionName.value = store.selectedHotCity;
			regionName.value = addCitySuffix(store.selectedHotCity);
		} else {
			// 否则使用省份名称
			const prov: any =
				chinaProvinces.find((item: any) => item.shortName === store.provinceName) || {};
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
.tips-icon {
	cursor: pointer;
	display: inline-block;
	width: 0.2rem;
	height: 0.2rem;
	background-image: url('@/assets/images/OverallSituation/tips-icon.png');
	background-size: 100% 100%;
}
:deep(.tabs-control_item) {
	display: flex;
	align-items: center;
}
.tips-content {
	gap: 0.22rem;
	.items {
		display: flex;
		font-weight: 400;
		font-size: 0.18rem;
		color: #111111;
		line-height: 0.24rem;
		.blue-text {
			color: #165dff;
		}
		&::before {
			flex-shrink: 0;
			content: '';
			display: inline-block;
			width: 0.52rem;
			height: 0.55rem;
			background-size: 100% 100%;
			margin-right: 0.15rem;
		}
		&:nth-child(1) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/01.png');
			}
		}
		&:nth-child(2) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/02.png');
			}
		}
		&:nth-child(3) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/03.png');
			}
		}
		&:nth-child(4) {
			&::before {
				background-image: url('@/assets/images/OverallSituation/04.png');
			}
		}
	}
	.dialog-con-bg {
		width: 8.65rem;
		height: 2.45rem;
		background-image: url('@/assets/images/OverallSituation/dialog-con-bg.png');
		background-size: 100% 100%;
	}
}
:deep(.title-select .right-box) {
	padding-right: 0;
}
:deep(.tabs-control) {
	gap: 0.08rem;
	> div {
		padding: 0 0.06rem;
	}
}
:deep(.outside-content) {
	padding: 0.1rem 0.2rem !important;
}
.center-bottom {
	position: relative;
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
		padding-bottom: 0.025rem;
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
			// width: calc(100% - 1.86rem);
			flex: 1;
		}
	}
	:deep(.el-cascader) {
		width: 1.15rem;
		// 0.4跟el-input__wrapper保持一样高度
		box-shadow: 0px 0.03rem 0.05rem 0 rgba(162, 169, 213, 0.66);
		border-radius: 0.23rem;
		backdrop-filter: blur(0.15rem);

		.el-input {
			border-radius: 0.23rem;
			backdrop-filter: blur(0.15rem);
			box-shadow: none;
			font-size: 0.16rem;
			.el-input__wrapper {
				box-shadow: none;
				background: transparent;
				padding: 0.01rem 0.11rem;
			}
			.el-input__inner {
				color: #898989;
			}

			.el-icon {
				font-size: 0.18rem;
				margin-left: 0.08rem;
			}
		}
	}
}

.projectLifecycle-btn {
	z-index: 9;
	position: absolute;
	cursor: pointer;
	object-fit: contain;
	width: 1.8rem;
	left: -0.01rem;
	top: -0.6rem;
}

.preview-img {
	width: 100%;
	object-fit: contain;
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
		font-size: 0.18rem;
		font-weight: 400;
		font-family:
			PingFangSC,
			PingFang SC;
	}
	.el-icon {
		font-size: 0.18rem;
	}
}
</style>
