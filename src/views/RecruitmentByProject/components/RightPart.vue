<template>
	<div class="right-part">
		<FrameBox size="up" class="up">
			<template #first>
				<TitleBlue name="联动分析">
					<template #extra>
						<RoundRectTabs
							v-model="investmentTab"
							:tabsList="['招商项目', '招商活动']"
						></RoundRectTabs
					></template>
					<SmallTitle
						:title="
							investmentTab === 0
								? `相关招商项目(${tableData?.length})`
								: `相关招商活动(${tableData?.length})`
						"
					/>
					<DynamicTable
						:hasOrder="true"
						:tableData="tableData"
						:columns="columns"
						:max-height="'2.0rem'"
					></DynamicTable>
				</TitleBlue>
			</template>
		</FrameBox>
		<FrameBox size="down" class="down">
			<template #first>
				<TitleBlue name="招商作战">
					<div class="right-bottom-box fx-r fx-sp-b">
						<div
							class="right-bottom fx-r fx-al-c fx-sp-b"
							v-for="(item, index) in listData"
							:key="index"
							:style="{ backgroundImage: `url(${item.bg})` }"
						>
							<div class="title">
								<span class="mark">{{ item.mark }}</span>
								<span> {{ item.title }}</span>
							</div>
							<div class="content">
								<div class="top-box fx-1">
									<template v-if="item.data?.length > 0">
										<div class="data" v-for="(it, x) in item.data" :key="x">
											<div class="label fx-r">
												<img
													class="light-icon fx-1"
													:src="item.lightIcon"
													alt=""
												/>
												<div class="right">
													<div
														class="text two-row-ellipsis"
														:title="it.content"
													>
														{{ it.content || '--' }}
													</div>
													<div class="unit">
														<span
															class="icon"
															:style="{
																backgroundImage: `url(${item.unitIcon})`,
															}"
														></span>
														{{ it.unit }}
													</div>
													<div class="time">
														<span
															class="icon"
															:style="{
																backgroundImage: `url(${item.clockIcon})`,
															}"
														></span>
														{{ it.date }}
													</div>
												</div>
											</div>
										</div>
									</template>
									<template v-else>
										<div v-if="item.name" class="name fx-r fx-al-c">
											{{ item.name }}
										</div>
										<div
											class="text six-row-ellipsis"
											:class="item.className"
											:title="item.text"
										>
											{{ item.text }}
										</div>
										<div class="unit" v-if="item.unit">
											<span
												class="icon"
												:style="{
													backgroundImage: `url(${item.unitIcon})`,
												}"
											></span>
											跟进单位：{{ item.unit }}
										</div>
									</template>
								</div>
								<div class="btn" @click="handleGoMore(index)">
									查看更多（{{ item.total }}）<el-icon color="#3A73DE"
										><ArrowDown
									/></el-icon>
								</div>
							</div>
						</div>
					</div>
				</TitleBlue>
			</template>
		</FrameBox>
		<TableDialog ref="tableDialogRef" />
	</div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import DynamicTable from '@/components/table/DynamicTable.vue';
import { getUrl } from '@/utils';
import { projectColumns, activityColumns, entList } from '@/views/RunByEnterprise/components/data';
import TableDialog from '@/views/RunByEnterprise/components/TableDialog.vue';
import RoundRectTabs from './RoundRectTabs.vue';
// import lamp from "@/assets/images/gtf/lamp.jpg"

const investmentTab = ref(0);

const tableData = ref<any>([]);
const columns = computed<any[]>(() => {
	console.log(44);
	return investmentTab.value === 0 ? projectColumns : activityColumns;
});
const listData = ref<any>([
	{
		bg: getUrl('runByEnterprise/detail/blue-bg.png'),
		mark: 'P',
		title: '招商方向',
		name: '当期重点',
		text: ' 1、推动中石油将原油等大宗商品进口实现在穗纳统1.中石油燃料油有限责任公司广东销售分公司已于2024年第三季度落地天河发展，2025年3月初成功纳统，预计实现年营收30-70亿元',
	},
	{
		bg: getUrl('runByEnterprise/detail/green-bg.png'),
		mark: 'D',
		title: '目标进展',
		text: ' 中石油燃料油有限责任公司广东销售分公司已于2024年第三季度落地天河发展，在市区统计部门联合支持下，2025年3月初成功纳统，中石油燃料油有限责任公司广东销售分公司已于2024年…',
		unitIcon: getUrl('runByEnterprise/detail/home-green.png'),
		unit: '广州市工信局',
	},
	{
		bg: getUrl('runByEnterprise/detail/orange-bg.png'),
		title: '主要问题',
		mark: 'C',
		unitIcon: getUrl('runByEnterprise/detail/home-orange.png'),
		clockIcon: getUrl('runByEnterprise/detail/clock.png'),
		lightIcon: getUrl('runByEnterprise/detail/light.png'),
		data: [
			{
				content: '知识产权管理条例缺失，无法对专利产品有效保护。',
				unit: '跟进部门：广州市工信局',
				date: '2024/09/30 14:00',
			},
			{
				content: '知识产权管理条例缺失，无法对专利产品有效保护。',
				unit: '跟进部门：广州市工信局',
				date: '2024/09/30 14:00',
			},
		],
	},
	{
		bg: getUrl('runByEnterprise/detail/purple-bg.png'),
		title: '工作计划',
		mark: 'A',
		className: 'seven-row-ellipsis',
		text: '【已完成】跟进中石有国际事业公司于中石油天然气集团、北京市西城区政府的沟通协调有国际事业公司于中石油天然气有国际事业公司于中石油天然气有国际事业公司于中石油天然气有国际事业公司于中石油天然气有国际事业公司于中石油天然气有国际事业公司于中石油天然气',
		unitIcon: getUrl('runByEnterprise/detail/home-purple.png'),
		unit: '广州市工信局',
	},
]);

const route = useRoute();
const list = ref<any>([]);
const getEntInfo = () => {
	const entName = route.query.name;
	const entInfo = entList.filter((item) => item.entName === entName)?.[0]?.entInfo ?? {};
	tableData.value = investmentTab.value === 0 ? entInfo?.zsxmData || [] : entInfo?.zshdData || [];
	const zszzData = entInfo?.zszzData || [];
	list.value = zszzData.reduce((acc: any, item: any) => {
		const key = item.type;
		if (!acc[key]) {
			acc[key] = []; // 如果该 type 不存在，初始化一个空数组
		}
		acc[key].push(item); // 将当前项推入对应的 type 数组
		return acc as any;
	}, {});
	listData.value = [
		{
			...listData.value[0],
			text: list.value[1]?.[0]?.content || '',
			total: list.value[1]?.length || 0,
		},
		{
			...listData.value[1],
			text: list.value[2]?.[0]?.content || '',
			unit: list.value[2]?.[0]?.unit || '',
			total: list.value[2]?.length || 0,
		},
		{ ...listData.value[2], data: list.value[3] || [], total: list.value[3]?.length || 0 },
		{
			...listData.value[3],
			text: list.value[4]?.[0]?.content || '',
			unit: list.value[4]?.[0]?.unit || '',
			total: list.value[4]?.length || 0,
		},
	];
};
const tableDialogRef = ref();
const handleGoMore = (index: number) => {
	tableDialogRef.value.show(list.value[index + 1], index);
};
onMounted(() => {});
watch(
	() => investmentTab.value,
	() => {
		getEntInfo();
	},
	{ immediate: true }
);
</script>

<style lang="less" scoped>
.right-part {
	display: flex;
	flex-direction: column;
	flex: 1;
	width: 6rem;
	.up {
		margin-bottom: 0.24rem;
		height: 3.28rem;
		.small-title {
			margin-bottom: 0.16rem;
		}
	}
	.down {
		flex: 1;
		height: calc(100% - 0.24rem - 3.28rem);
		.right-bottom-box {
			flex-wrap: wrap;
			row-gap: 0.16rem;
			column-gap: 0.12rem;
			.right-bottom {
				flex-shrink: 0;
				//padding: 0.17rem 0.2rem;
				width: calc((100% - 0.16rem) / 2);
				height: 2.18rem;
				//background: rgba(169, 181, 255, 0.1);
				background-image: url('@/assets/images/runByEnterprise/detail/blue-bg.png');
				background-size: 100% 100%;
				border-radius: 0.08rem;
				border: 0.01rem solid #ffffff;
				&:nth-of-type(3),
				&:nth-of-type(4) {
					height: 2.41rem;
				}
				.title {
					font-size: 0.2rem;
					width: 0.32rem;
					text-align: center;
					//padding: 0 0.08rem;
					color: #fff;
					height: 100%;
					.mark {
						font-family: Kingsoft_Cloud_Font;
						font-size: 0.32rem;
						margin: 0.1rem 0 0.16rem;
						display: inline-block;
					}
				}
				.content {
					flex: 1;
					padding: 0.1rem;
					height: 100%;
					display: flex;
					flex-direction: column;
					.name {
						font-family:
							PingFangSC,
							PingFang SC;
						font-weight: 500;
						font-size: 0.18rem;
						color: rgba(0, 0, 0, 0.85);
						line-height: 0.22rem;
						position: relative;
						margin-bottom: 0.1rem;
						&::after {
							content: '';
							position: absolute;
							display: inline-block;
							margin-right: 0.1rem;
							bottom: -0.08rem;
							width: 0.7rem;
							height: 0.1rem;
							background-image: url('@/assets/images/runByEnterprise/rect-panel-title-bg.png');
							background-size: 100% 100%;
							//background: linear-gradient( 180deg, #B7DCFF 0%, rgba(209,229,252,0) 100%)
						}
					}
					.text {
						font-family:
							PingFangSC,
							PingFang SC;
						font-weight: 400;
						font-size: 0.14rem;
						color: rgba(0, 0, 0, 0.85);
						line-height: 0.22rem;
					}
					.unit {
						margin-top: 0.08rem;
						font-size: 0.12rem;
						color: rgba(0, 0, 0, 0.45);
						line-height: 0.17rem;
					}
					.data {
						&:first-child {
							margin-bottom: 0.12rem;
						}
						.label {
							font-family:
								PingFangSC,
								PingFang SC;
							font-weight: 500;
							font-size: 0.14rem;
							color: rgba(0, 0, 0, 0.85);
							line-height: 0.22rem;
							.light-icon {
								margin-right: 0.07rem;
								width: 0.2rem;
								height: 0.2rem;
								margin-right: 0.07rem;
								background-size: contain; /* 保持图片比例 */
							}
							.right {
								width: calc(100% - 0.27rem);
								.text {
									height: 0.44rem;
								}
							}
						}
						.time {
							margin-top: 0.04rem;
							font-size: 0.12rem;
							color: rgba(0, 0, 0, 0.45);
							line-height: 0.12rem;
						}
					}
					.icon {
						display: inline-block;
						width: 0.12rem;
						height: 0.12rem;
						background-size: 100% 100%;
					}
					.btn {
						width: 100%;
						font-weight: 400;
						font-size: 0.14rem;
						color: #3a73de;
						margin-top: 0.1rem;
						text-align: center;
						cursor: pointer;
						display: inline-flex; /* 行内 flex 布局 */
						align-items: center; /* 垂直居中 */
						justify-content: center;
					}
				}
			}
		}
	}
}
</style>
