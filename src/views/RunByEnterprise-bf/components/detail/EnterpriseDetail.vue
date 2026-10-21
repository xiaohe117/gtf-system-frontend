<template>
	<div class="runByEnterprise-Details">
		<div class="btn-back" @click="handleBack"></div>
		<div class="runByEnterprise-Details-Top">
			<el-tooltip :disabled="!isTitleOverflow" :content="tooltipContent">
				<div ref="titleBox" class="yellow-title-box" @mouseenter="checkTitleOverflow">
					<span class="prefix-title">{{ companyNameParts[0] }}-</span>
					<span class="suffix-title">{{ companyNameParts[1] || '招商档案' }}</span>
				</div>
			</el-tooltip>
			<div class="tabs-box">
				<span class="tabs-item" v-for="(item, index) in entInfo.tagList" :key="index">{{
					item
				}}</span>
			</div>
			<div class="bottom-con-box">
				<div class="basic-box">
					<div class="left-icon">基 本 信 息</div>
					<div class="right-con">
						<div class="fx-r">
							<p class="items">
								<span class="bold-text">法定代表人：</span>
								<span class="normal-text">{{ entInfo.legalName ?? '-' }}</span>
							</p>
							<p class="items">
								<span class="bold-text">注册资本：</span>
								<span class="normal-text"
									>{{ entInfo.registeredAmount ?? '-' }}万元</span
								>
							</p>
							<p class="items">
								<span class="bold-text">成立日期：</span>
								<span class="normal-text">{{ entInfo.registeredTime ?? '-' }}</span>
							</p>
						</div>
						<div class="fx-r right-two">
							<p class="items">
								<span class="bold-text">产业体系：</span>
								<span class="normal-text">{{ entInfo.industryList ?? '-' }}</span>
							</p>
							<p class="items">
								<span class="bold-text">地址：</span>
								<span class="normal-text">{{
									entInfo.registeredAddress ?? '-'
								}}</span>
							</p>
						</div>
					</div>
					<div class="more-icon" @click="handleBasicInfoDialog">
						<span class="text">查看更多</span>
						<span class="arrow" />
					</div>
				</div>
				<div class="basic-box follow">
					<div class="left-icon">跟进信息</div>
					<div class="right-con">
						<div class="fx-r">
							<p class="items">
								<span class="bold-text">跟进单位：</span>
								<span class="normal-text">{{
									followRecord.followUnitCN ?? '-'
								}}</span>
							</p>
							<p class="items">
								<span class="bold-text">目标企业来源：</span>
								<span class="normal-text">{{
									entFollowSourceMap[followRecord.entFollowSource] ?? '-'
								}}</span>
							</p>
						</div>
						<div class="fx-r right-two">
							<p class="items">
								<span class="bold-text">跟进负责：</span>
								<span class="normal-text">{{
									followRecord.followPerson ?? '-'
								}}</span>
							</p>
							<p class="items">
								<span class="bold-text">入库时间：</span>
								<span class="normal-text">{{
									followRecord.insertTime ?? '-'
								}}</span>
							</p>
						</div>
					</div>
					<div class="more-icon">
						<span class="text">查看更多</span>
						<span class="arrow" />
					</div>
				</div>
				<div class="purple-box">
					<p class="up">
						<span class="text">招商成熟度</span>
						<span class="rules-box">规则说明</span>
					</p>
					<p class="down">
						<el-rate v-model="maturity" disabled text-color="#ff9900" />
						<span class="text">{{
							investMaturityMap?.[entInfo.investMaturity]?.label ?? '-'
						}}</span>
					</p>
					<span class="build-icon"></span>
				</div>
			</div>
		</div>
		<div class="runByEnterprise-Details-Bottom fx-r">
			<div class="tabs-expand-shrink-box">
				<div class="tab-item">
					<span class="left-text">企业潜力</span>
					<span class="right-text">广规经济产业大平台</span>
				</div>
				<div class="tab-item">
					<span class="left-text">投融资</span>
					<span class="right-text">清科私募通</span>
				</div>
			</div>

			<div class="left-con">
				<div class="tabs-box">
					<span
						class="tab-item"
						:class="{ active: tabActive2 === item }"
						@click="tabClick2(item)"
						v-for="(item, index) in tabsArr2"
						:key="index"
						>{{ item }}</span
					>
				</div>
				<InvestmentWork v-if="tabActive2 === '企业招商工作'"></InvestmentWork>
				<BusinessNews v-if="tabActive2 === '企业情报'"></BusinessNews>
			</div>
			<div class="right-con">
				<div class="right-con-top">
					<TitleBody name="企业资讯" class="right-con-top-one">
						<div class="plan-main">
							<template v-if="planList.length">
								<div
									class="list-item"
									v-for="(item, index) in planList"
									:key="index"
								>
									<div class="content-wrap">
										<span
											class="sign-icon"
											:class="`sign-${progressMap[item?.newsType?.split(',')?.[0] || item.newsType]}`"
										>
											{{ item?.newsType?.split(',')?.[0] || item.newsType }}
										</span>
										<el-tooltip
											:content="item.title"
											placement="bottom"
											:disabled="item.title.length <= 43"
										>
											<span>{{ truncateText(item.title) }}</span>
										</el-tooltip>
										<span class="right-info">
											<span class="text">{{ item.source }}</span>
											<span class="text twoText">{{ item.publishTime }}</span>
										</span>
									</div>
								</div>
							</template>
							<default-empty-container v-else />
						</div>
					</TitleBody>
				</div>
				<div class="right-con-bottom">
					<TitleBody name="数据联动" class="data-linkage">
						<template #extra>
							<RoundRectTabs
								v-model="projectTab"
								:tabsList="projectTypes"
								@change="changeTab"
							></RoundRectTabs>
						</template>
						<DynamicTable :table-data="tableData" :columns="columns" :hasOrder="true">
							<template #progressLevel="{ row }">
								<div>{{ progressLevelMap[row.progressLevel] }}</div>
							</template>
							<template #activityType="{ row }">
								<div>{{ activityTypeMap[row.activityType] }}</div>
							</template>
						</DynamicTable>
					</TitleBody>
				</div>
			</div>
		</div>
	</div>
	<BasicInfoDialog ref="BasicInfoDialogRef" :entInfo="entInfo" />
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { getSize } from '@/utils/index';
import BasicInfoDialog from '@/views/RunByEnterprise/components/detail/BasicInfoDialog.vue';
import {
	queryEntDetail,
	newsByEnterpriseId,
	projectQueryList,
	activityQueryList,
} from '@/api/runByEnterprise/detail';
import InvestmentWork from './InvestmentWork.vue';
import BusinessNews from './BusinessNews.vue';

const router = useRouter();
const route = useRoute();
const sccode = computed(() => route.query.sccode);

function truncateText(text: any, maxLength = 43) {
	return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}
const handleBack = () => {
	const { history } = window;
	// 花智会app中初始化页面length为2时，返回无效果
	const backUrl = history.state && history.state.back;
	if (history.length <= 1 || backUrl === null) {
		const path = backUrl || '/';
		router.replace(path);
	} else {
		router.go(-1);
	}
};

// 目标企业基础表
const entInfo = ref<any>({});
const followRecord = ref<any>({});
const entFollowSourceMap: any = {
	'1': '分派新增',
	'2': '主动认领',
	'3': '手动新增',
};
const investMaturityMap: any = {
	五星非常成熟: { label: '非常成熟', value: 5 },
	四星潜力高培育: { label: '潜力高培育', value: 4 },
	三星需持续培育: { label: '需持续培育', value: 3 },
};
const maturity = ref<any>(0);

const getQueryEntDetail = () => {
	const params = {
		sccode: sccode.value,
	};
	queryEntDetail({ params }).then((res: any) => {
		const { gtfEntInfo, gtfFollowRecord } = res.data;
		entInfo.value = gtfEntInfo || {};
		/* entInfo.value.companyName =
			'深圳星迹国际餐饮管理有限公司（orbitone奥彼文星球食研所）-招商档案'; */
		maturity.value = investMaturityMap[gtfEntInfo?.investMaturity]?.value;
		followRecord.value = gtfFollowRecord || {};
	});
};
getQueryEntDetail();

// 处理标题文字过长
const titleBox = ref<any>(null);
const isTitleOverflow = ref(false);
const companyNameParts = computed(() => entInfo.value.companyName?.split('-') || []);
const tooltipContent = computed(
	() => `${companyNameParts.value[0]}-${companyNameParts.value[1] || '招商档案'}`
);

const checkTitleOverflow = () => {
	if (titleBox.value) {
		isTitleOverflow.value = titleBox.value.scrollWidth > titleBox.value.clientWidth;
	}
};

// tab切换
const tabActive2 = ref('企业招商工作');
const tabsArr2 = ['企业招商工作', '企业情报'];
const tabClick2 = (item: string) => {
	tabActive2.value = item;
};

// 基本信息弹窗
const BasicInfoDialogRef = ref<any>();
const handleBasicInfoDialog = () => {
	nextTick(() => {
		BasicInfoDialogRef.value.show();
	});
};

// 企业资讯
const progressMap: any = {
	市场交易: 1,
	企业经营: 2,
	企业管理: 3,
	项目工程: 4,
	抵押担保: 5,
	EFFECT: 6,
	产品业务: 7,
	政府监察: 8,
	其他方面: 9,
	企业财务: 10,
	企业信用: 11,
	机构监管: 12,
};
const planList = ref<any[]>([]);
const getNewsByEnterpriseId = () => {
	const params = {
		sccode: sccode.value,
	};
	newsByEnterpriseId({ params }).then((res: any) => {
		const { data } = res;
		planList.value = data;
	});
};
getNewsByEnterpriseId();

// 数据联动
const projectTab = ref(0);
const projectTypes = ref(['招商项目', '招商活动']);
const progressLevelMap: any = {
	0: '注册',
	1: '在谈',
	2: '签约',
	3: '开工',
	4: '投产',
	5: '纳统纳税',
};
const activityTypeMap: any = {
	1: '拜访活动',
	2: '会见活动',
	3: '重大活动',
};

const columns1 = [
	{
		prop: 'projectName',
		label: '项目名称',
		width: getSize(210),
	},
	{
		prop: 'progressLevel',
		label: '项目阶段',
		width: getSize(90),
		type: 'slot',
		slotName: 'progressLevel',
	},
	{
		prop: 'createUnit',
		label: '跟进单位',
	},
];

const columns2 = [
	{
		prop: 'activityName',
		label: '活动名称',
	},
	{
		prop: 'activityType',
		label: '活动类型',
		type: 'slot',
		slotName: 'activityType',
	},
];

const columns = ref<any[]>(columns1);
const tableData = ref<any[]>([]);
const initData = async () => {
	const params = {
		sccode: sccode.value,
	};
	const [projectRes, activityRes] = (await Promise.all([
		projectQueryList({ params }),
		activityQueryList({ params }),
	])) as any;
	projectTypes.value = [
		projectRes.data.count ? `招商项目(${projectRes.data.count})` : '招商项目',
		activityRes.data.count ? `招商活动(${activityRes.data.count})` : '招商活动',
	];
	tableData.value = projectRes.data.list;
};
initData();
const changeTab = (index: number) => {
	projectTab.value = index;
	const params = {
		sccode: sccode.value,
	};
	if (index === 0) {
		columns.value = columns1;
		projectQueryList({ params }).then((res: any) => {
			tableData.value = res.data.list;
		});
	} else {
		columns.value = columns2;
		activityQueryList({ params }).then((res: any) => {
			tableData.value = res.data.list;
		});
	}
};
</script>

<style lang="less" scoped>
:deep(.el-table) {
	th.el-table__cell,
	td.el-table__cell {
		padding: 0 !important;
		height: 0.41rem;
	}
}
.data-linkage {
	padding: 0.19rem 0.35rem 0.2rem 0.19rem;
	:deep(.title-body-content) {
		flex-grow: 1;
		height: 0;
		.table-container {
			height: 100%;
		}
	}
}
.runByEnterprise-Details {
	position: relative;
	height: 100%;
	padding-top: 0.22rem;
}
.btn-back {
	position: fixed;
	z-index: 2;
	cursor: pointer;
	left: 0;
	top: 50%;
	transform: translateY(-50%);
	width: 0.41rem;
	height: 1.52rem;
	background-size: 100% 100%;
	background-image: url('@/assets/images/runByEnterprise/newDetail/back-btn.png');
}
.runByEnterprise-Details-Top {
	height: 2.06rem;
	background-image: url('@/assets/images/runByEnterprise/newDetail/top-part.png');
	background-size: 100% 100%;
	position: relative;
	.yellow-title-box {
		position: absolute;
		left: 0.76rem;
		top: 0.17rem;
		width: 8.65rem;
		white-space: nowrap;
		text-overflow: ellipsis;
		overflow: hidden;
		line-height: normal;
		.prefix-title,
		.suffix-title {
			font-family: YouSheBiaoTiHei;
			font-size: 0.28rem;
			color: #ffffff;
			line-height: 1.2;
			text-shadow: 0.02rem 0.02rem 0rem #165dff;
		}
		&::after {
			position: absolute;
			right: 0.45rem;
			content: '';
			display: inline-block;
			width: 1.61rem;
			height: 0.39rem;
			background-image: url('@/assets/images/gtf/water-proof.png');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			opacity: 0.4;
			top: 50%;
			transform: translateY(-50%);
		}
	}
	.tabs-box {
		position: absolute;
		left: 11.79rem;
		top: 0.23rem;
		.tabs-item {
			display: inline-block;
			text-align: center;
			font-weight: bold;
			font-size: 0.16rem;
			color: #ffffff;
			line-height: 0.3rem;
			letter-spacing: 0.01rem;
			text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			width: 0.97rem;
			height: 0.3rem;
			background-size: 100% 100%;
			&:nth-child(1) {
				background-image: url('@/assets/images/runByEnterprise/newDetail/tab1.png');
				margin-right: 0.1rem;
			}
			&:nth-child(2) {
				background-image: url('@/assets/images/runByEnterprise/newDetail/tab2.png');
			}
		}
	}
	.bottom-con-box {
		position: absolute;
		left: 0.44rem;
		right: 0.13rem;
		top: 0.88rem;
		display: flex;
		justify-content: space-between;
		.basic-box {
			display: flex;
			align-items: center;
			.left-icon {
				margin-right: 0.24rem;
				width: 0.45rem;
				height: 0.96rem;
				background-size: 100% 100%;
				background-image: url('@/assets/images/runByEnterprise/newDetail/basic-bg.png');
				display: flex;
				justify-content: center;
				align-items: center;
				writing-mode: vertical-rl;
				font-weight: 600;
				font-size: 0.14rem;
				color: #ffffff;
				line-height: 0.12rem;
				text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				text-align: left;
				font-style: normal;
			}
			.right-con {
				width: 5.58rem;
				row-gap: 0.2rem;
				.right-two {
					margin-top: 0.2rem;
				}
				.items {
					flex: 1;
					font-size: 0.14rem;
					color: #000000;
					line-height: 0.22rem;
					.normal-text {
						color: #4b4b4b;
					}
				}
			}
			.more-icon {
				cursor: pointer;
				margin-left: 0.26rem;
				width: 0.44rem;
				height: 1rem;
				background-size: 100% 100%;
				background-image: url('@/assets/images/runByEnterprise/newDetail/more-bg.png');
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				padding-left: 0.1rem;
				.text {
					writing-mode: vertical-rl;
					font-weight: 400;
					font-size: 0.14rem;
					color: #5b8ff9;
					line-height: 0.12rem;
					text-shadow: 0.01rem 0.01rem 0rem rgba(255, 255, 255, 0.6);
					letter-spacing: 0.02rem;
				}
				.arrow {
					margin-top: 0.07rem;
					display: inline-block;
					width: 0.14rem;
					height: 0.15rem;
					background-size: 100% 100%;
					background-image: url('@/assets/images/runByEnterprise/newDetail/arrow-down.png');
				}
			}
			&.follow {
				.left-icon {
					background-image: url('@/assets/images/runByEnterprise/newDetail/follow-bg.png');
				}
				.right-con {
					width: 5.24rem;
				}
			}
		}
		.purple-box {
			padding: 0.16rem 0 0.1rem 0.32rem;
			width: 4.06rem;
			height: 0.98rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/purple-bg.png');
			position: relative;
			.build-icon {
				position: absolute;
				right: -0.11rem;
				top: -0.16rem;
				display: inline-block;
				width: 0.58rem;
				height: 0.35rem;
				background-image: url('@/assets/images/runByEnterprise/newDetail/build-icon.png');
				background-size: 100% 100%;
			}
			.up {
				display: flex;
				align-items: center;
				.text {
					font-family: YouSheBiaoTiHei;
					font-size: 0.22rem;
					color: #ffffff;
					line-height: 0.22rem;
					text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
					white-space: nowrap;
				}
				.rules-box {
					margin-left: 1.38rem;
					display: inline-block;
					width: 1.39rem;
					height: 0.3rem;
					background-size: 100% 100%;
					background-image: url('@/assets/images/runByEnterprise/newDetail/rules.png');
					font-size: 0.12rem;
					color: #ffffff;
					line-height: 0.3rem;
					padding-left: 0.35rem;
				}
			}
			.down {
				margin-top: 0.08rem;
				display: flex;
				align-items: center;
				justify-content: space-between;
				.text {
					font-family: YouSheBiaoTiHei;
					font-size: 0.26rem;
					color: #ffffff;
					line-height: 0.22rem;
					text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
					padding-right: 0.43rem;
				}
			}
		}
	}
}

.runByEnterprise-Details-Bottom {
	position: relative;
	margin-top: 0.27rem;
	gap: 0.12rem;
	/* 	.tabs-expand-shrink-box {
		position: absolute;
		top: -0.12rem;
		right: 0;
		display: flex;
		gap: 0.24rem;
		.tab-item {
			display: flex;
			align-items: center;
			cursor: pointer;
			width: 1.11rem;
			height: 0.42rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/tabs-shrink.png');
			.left-text {
				flex-shrink: 0;
				white-space: nowrap;
				width: 0.95rem;
				text-align: center;
				font-weight: bold;
				font-size: 0.18rem;
				color: #ffffff;
				line-height: 0.24rem;
				text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
			}
			.right-text {
				display: none;
				width: 1.7rem;
				text-align: center;
				padding-left: 0.2rem;
				font-weight: 500;
				font-size: 0.16rem;
				color: #3489ff;
				line-height: 0.22rem;
			}
			&:hover {
				transition: all 0.3s ease-in-out;
				width: 2.71rem;
				background-image: url('@/assets/images/runByEnterprise/newDetail/tabs-expand.png');
				.right-text {
					display: block;
				}
			}
		}
	} */
	.tabs-expand-shrink-box {
		position: absolute;
		top: -0.12rem;
		right: 0;
		display: flex;
		gap: 0.24rem;

		.tab-item {
			display: flex;
			align-items: center;
			cursor: pointer;
			width: 1.11rem;
			height: 0.42rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/tabs-shrink.png');
			transition:
				width 0.3s ease-out,
				background-image 0.3s ease-out;
			overflow: hidden;

			.left-text {
				flex-shrink: 0;
				white-space: nowrap;
				width: 0.95rem;
				text-align: center;
				font-weight: bold;
				font-size: 0.18rem;
				color: #ffffff;
				line-height: 0.24rem;
				text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				transition: all 0.3s ease-out;
			}

			.right-text {
				white-space: nowrap;
				width: 1.7rem;
				text-align: center;
				padding-left: 0.2rem;
				font-weight: 500;
				font-size: 0.16rem;
				color: #3489ff;
				line-height: 0.22rem;
				opacity: 0; // 初始透明
				transform: translateX(-0.1rem); // 初始向左偏移
				transition:
					opacity 0.2s ease-out 0.1s,
					// 延迟淡入
					transform 0.3s ease-out; // 平滑移动
			}

			&:hover {
				width: 2.71rem;
				background-image: url('@/assets/images/runByEnterprise/newDetail/tabs-expand.png');

				.left-text {
					width: auto;
					padding: 0 0.1rem;
				}

				.right-text {
					opacity: 1; // 完全显示
					transform: translateX(0); // 回到原位
				}
			}
		}
	}
	.left-con {
		width: 13.22rem;
		height: 7.2rem;
		background-image: url('@/assets/images/runByEnterprise/newDetail/left-main-bg.png');
		background-size: 100% 100%;
		flex-shrink: 0;
		.tabs-box {
			padding-left: 0.08rem;
			padding-top: 0.045rem;
			.tab-item {
				cursor: pointer;
				text-align: center;
				line-height: 0.44rem;
				display: inline-block;
				font-weight: 500;
				font-size: 0.18rem;
				color: #898989;
				line-height: 0.44rem;
				width: 1.81rem;
				height: 0.44rem;
				background-size: 100% 100%;
				&.active {
					background-image: url('@/assets/images/runByEnterprise/newDetail/active-tab.png');
					font-weight: 600;
					color: #ffffff;
				}
			}
		}
	}
	.right-con {
		margin-top: 0.48rem;
		.right-con-top {
			width: 5.45rem;
			height: 3.49rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/right-main-bg.png');
			:deep(.right-con-top-one) {
				padding: 0.19rem 0.35rem 0.08rem 0.19rem;
			}
			:deep(.title-body-content) {
				flex-grow: 1;
				height: 0;
			}
			.plan-main {
				height: 100%;
				overflow-y: auto;
				.list-item {
					height: 0.63rem;
					position: relative;
					border-bottom: 0.01rem solid #aaccff;
					&:not(:first-child) {
						margin-top: 0.06rem;
					}

					.sign-icon {
						white-space: nowrap;
						margin-right: 0.1rem;
						text-align: center;
						line-height: 0.2rem;
						padding: 0.04rem 0.08rem;
						font-weight: 400;
						font-size: 0.14rem;
						color: #51e1c4;
						background: #f2fefc;
						border-radius: 0.02rem;
						border: 0.01rem solid rgba(81, 225, 196, 0.5);
						overflow: hidden;
						&.sign-1 {
							color: #165dff;
							background: #e4f1ff;
							border: 0.01rem solid rgba(22, 93, 255, 0.5);
						}
						&.sign-2 {
							color: #00a870;
							background: #e8f8f2;
							border: 0.01rem solid rgba(0, 168, 112, 0.5);
						}
						&.sign-3 {
							color: #ed7b2f;
							background: #fef3e6;
							border: 0.01rem solid rgba(237, 123, 47, 0.5);
						}
						&.sign-4 {
							color: #4b4b4b;
							background: #f0f0f0;
							border: 0.01rem solid rgba(75, 75, 75, 0.5);
						}
						&.sign-5 {
							color: #ff4d4f;
							background: #fff2f2;
							border: 0.01rem solid rgba(255, 77, 79, 0.5);
						}
						&.sign-6 {
							color: #37d9fe;
							background: #f4fdff;
							border: 0.01rem solid rgba(55, 217, 254, 0.7);
						}
						&.sign-7 {
							color: #f5ca45;
							background: #fffbee;
							border: 0.01rem solid rgba(245, 202, 69, 0.5);
						}
						&.sign-8 {
							color: #e16cff;
							background: #fdf5ff;
							border: 0.01rem solid rgba(225, 108, 255, 0.5);
						}
						&.sign-9 {
							color: #51e1c4;
							background: #f2fefc;
							border: 0.01rem solid rgba(81, 225, 196, 0.5);
						}
						&.sign-10 {
							color: #00bbc4;
							background: #e6fbfc;
							border: 0.01rem solid rgba(0, 187, 196, 0.5);
						}
						&.sign-11 {
							color: #c49c00;
							background: #fffcf2;
							border: 0.01rem solid rgba(196, 156, 0, 0.5);
						}
						&.sign-12 {
							color: #c4004d;
							background: #fff4f8;
							border: 0.01rem solid rgba(196, 0, 77, 0.5);
						}
					}

					.content-wrap {
						font-size: 0.14rem;
						color: rgba(0, 0, 0, 0.6);
						line-height: 0.29rem;
						display: -webkit-box;
						-webkit-line-clamp: 2; /* 限制显示的行数 */
						-webkit-box-orient: vertical;
						overflow: hidden;
						text-overflow: ellipsis;
					}
					.right-info {
						/* display: inline-block;
						width: 2.8rem;
						white-space: nowrap; */
						position: absolute;
						bottom: 0.03rem;
						right: 0;
						.text {
							font-size: 0.14rem;
							color: rgba(0, 0, 0, 0.28);
							line-height: 0.29rem;
							&.twoText {
								padding-left: 0.2rem;
							}
						}
					}
					&::after {
						content: '';
						display: table;
						clear: both;
					}
				}
			}
		}
		.right-con-bottom {
			margin-top: 0.16rem;
			width: 5.45rem;
			height: 3.07rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/right-main-bg.png');
			:deep(.tabs-control) {
				margin-right: 0.33rem;
			}
		}
	}
}
</style>
