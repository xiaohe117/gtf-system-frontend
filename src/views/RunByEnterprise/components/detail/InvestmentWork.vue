<template>
	<div class="investment-work">
		<div class="top">
			<div class="main fx-r">
				<p class="left fx-c c-pointer">
					<span class="bold">投资合作建议</span>
					<span class="normal">{{ adviceList.fillTime }} {{ adviceList.fillUnit }}</span>
				</p>
				<el-tooltip effect="dark" :content="adviceList.adviceContent">
					<p class="right text-ellipsis2">
						{{ adviceList.adviceContent }}
					</p>
				</el-tooltip>

				<!--				<div class="history-btn" @click="handleFillInvestment">-->
				<!--					投资合作建议填报 <span class="arrow"></span>-->
				<!--				</div>-->
				<div class="history-btn two">历史建议<span class="arrow"></span></div>
			</div>
			<div class="pdf-box one">招商项目策划.PDF</div>
			<div class="pdf-box two">招商项目策划.PDF</div>
		</div>
		<div class="bottom fx-r">
			<TitleBody name="招商对接情况" class="bottom-left">
				<!--				<template #extra>-->
				<!--					<div class="enter-icon" @click="goToFillPage">-->
				<!--						工作记录填报<span class="arrow"></span></div-->
				<!--				></template>-->
				<DynamicTable :table-data="tableData" :columns="columns" :hasOrder="true">
					<template #contactDetails="{ row }">
						<div class="txtBox">
							<span class="txt">
								{{ row.contactDetails }}
							</span>
							<span
								class="sign"
								:class="`sign-${row.signLevel}`"
								v-if="row.signLevel"
								>{{ signMap[row.signLevel] }}</span
							>
						</div>
					</template>
					<template #contactType="{ row }">
						<div>{{ contactTypeMap[row.contactType] }}</div>
					</template>
				</DynamicTable>
			</TitleBody>
			<TitleBody name="招商工作进展" class="bottom-right">
				<template #extra>
					<div class="fill-in-part fx-r">
						<!--						<div class="fill-in" @click="handleDialog(0)">-->
						<!--							进展或交办事项填报<span class="arrow"></span>-->
						<!--						</div>-->
						<!--						<div class="fill-in two" @click="handleDialog(1)">-->
						<!--              问题反馈<span class="arrow"></span>-->
						<!--						</div>-->
						<div class="fill-in" @click="handleDialog">
							跟进信息填报<span class="arrow"></span>
						</div>
					</div>
				</template>
				<div class="plan-top fx-r">
					<div
						class="rect-box fx-r"
						:class="{ active: activeIndex === index }"
						v-for="(item, index) in planArr"
						:key="index"
						@click="handleClick(index)"
					>
						<p class="one fx-c">
							<span class="bold">{{ item.name }}</span>
							<!-- <span class="normal">{{ item.desc }}</span> -->
						</p>
						<!-- <p class="two number-font">{{ item.value }}</p> -->
					</div>
				</div>
				<div class="plan-main" v-if="planList.length || problemList.length">
					<template v-if="activeIndex === 0">
						<div class="list-item" v-for="(item, index) in planList" :key="index">
							<p class="one" v-if="false">
								<span class="sign-icon" :class="`sign-${item.progressType}`">{{
									progressMap[item.progressType]
								}}</span>
								<span class="date"
									>{{ item.progressType === '2' ? '实际' : '计划' }}完成时间：{{
										item.progressType === '2'
											? item.actualDate
											: item.plannedDate
									}}</span
								>
							</p>
							<p class="two">{{ item.content }}</p>
							<p class="three">
								<span class="text">跟进单位：{{ item.followUnit }}</span>
								<span class="text">记录时间：{{ item.recordTime }}</span>
							</p>
						</div>
					</template>
					<template v-else>
						<div class="list-item" v-for="(item, index) in problemList" :key="index">
							<p class="one">
								<span
									class="sign-icon nobefore"
									:class="`problem-${item.problemStatus}`"
									>{{ problemMap[item.problemStatus] }}</span
								>
								<span class="date">责任单位：{{ item.responsibleUnit }}</span>
							</p>
							<p class="two">{{ item.problemDescription }}</p>
							<p class="three">
								<span class="text">反馈单位：{{ item.proposingUnit }}</span>
								<span class="text">反馈时间：{{ item.feedbackDate }}</span>
							</p>
						</div>
					</template>
				</div>
				<default-empty-container class="plan-main" v-else />
			</TitleBody>
		</div>
	</div>
	<workProgressDialog v-model="dialogVisible" @confirm="handleConfirm" @cancel="handleCancel" />
	<ProblemFeedbackDialog
		v-model="dialogVisible2"
		@confirm="handleConfirm2"
		@cancel="handleCancel2"
	/>
	<FillEnteranceDialog
		v-model="enteranceDialogVisible"
		@confirm="handleConfirm"
		@cancel="handleCancel"
	/>
	<EnterpriseInvestmentDialog ref="investDialogRef" />
	<InfoRecordDialog ref="infoRecordRef"></InfoRecordDialog>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import { getSize } from '@/utils/index';
import ServiceUrl from '@/utils/url'
import DynamicTable from '@/components/table/DynamicTable.vue';
import workProgressDialog from '@/views/FormFillPage/dialog/workProgressDialog.vue';
import ProblemFeedbackDialog from '@/views/FormFillPage/dialog/ProblemFeedbackDialog.vue';
import FillEnteranceDialog from '@/views/FormFillPage/dialog/FillEnteranceDialog.vue';
import EnterpriseInvestmentDialog from '@/views/FormFillPage/dialog/EnterpriseInvestmentDialog.vue';
import InfoRecordDialog from '@/views/RunByEnterprise/components/InvestmentEnterprise/dialog/InfoRecordDialog.vue';

import {
	investAdviceList,
	investContactLogList,
	workProgressList,
	investIssueList,
} from '@/api/runByEnterprise/detail';

const route = useRoute();
const sccode = computed(() => route.query.sccode);

const enteranceDialogVisible = ref(false);

// const goToFillPage = () => {
// 	enteranceDialogVisible.value = true;
// };
// 投资合作建议
const adviceList = ref<any>({});
const getInvestAdviceList = () => {
	const params = {
		sccode: sccode.value,
		number: '1',
	};
	investAdviceList({ params }).then((res: any) => {
		const [first] = res.data;
		adviceList.value = first || {};
	});
};
getInvestAdviceList();

const investDialogRef = ref();
// const handleFillInvestment = () => {
// 	investDialogRef.value.show();
// };
// 招商对接情况
const columns = ref<any[]>([
	{
		prop: 'contactDetails',
		label: '最新信息',
		width: getSize(310),
		type: 'slot',
		slotName: 'contactDetails',
	},
	{
		prop: 'contactType',
		label: '类型',
		type: 'slot',
		slotName: 'contactType',
	},
	{
		prop: 'contactDate',
		label: '时间',
	},
	{
		prop: 'interntionLevel',
		label: '企业意向',
		width: getSize(90),
	},
]);
const tableData = ref<any[]>([]);
const contactTypeMap: any = {
	1: '企业来访',
	2: '主动拜访',
	3: '重大活动',
};
const signMap: any = {
	1: '有线索',
	2: '领导',
	3: '市领导',
};
const getInvestContactLogList = () => {
	const params = {
		sccode: sccode.value,
	};
	investContactLogList({ params }).then((res: any) => {
		tableData.value = res.data || [];
	});
};
getInvestContactLogList();

// 招商工作进展
const activeIndex = ref(0);
const planArr = ref<any[]>([
	{ name: '跟进记录', desc: '其中工作计划', value: '-' },
	{ name: '问题反馈', desc: '其中待解決', value: '-' },
]);
const dialogVisible = ref(false);
const dialogVisible2 = ref(false);

const handleConfirm = () => {
	console.log('用户点击了确认');
	// 执行确认操作
};
const handleConfirm2 = () => {
	console.log('用户点击了确认');
	// 执行确认操作
};

const handleCancel = () => {
	console.log('用户点击了取消');
	// 执行取消操作
};
const handleCancel2 = () => {
	console.log('用户点击了取消');
	// 执行取消操作
};
const handleClick = (index: number) => {
	activeIndex.value = index;
};
const infoRecordRef = ref();
const handleDialog = () => {
	window.open(
		`${ServiceUrl.adminUrl}enterprise-form/business-records/BusinessRecordsDetails?type=Add`,
		'_blank'
	);
	/*
	if (index === 0) {
		// 工作进展弹窗
		dialogVisible.value = true;
	} else {
    console.log(sccode.value);
    console.log(55454);
    infoRecordRef.value.show(sccode.value)
		// 问题弹窗
		// dialogVisible2.value = true;
	}
	*/
};
// 工作进展
const planList = ref<any[]>([]);
const progressMap: any = {
	1: '工作计划',
	2: '已完成进展',
	3: '已关闭',
};
const getWorkProgressList = () => {
	const params = {
		sccode: sccode.value,
	};
	workProgressList({ params }).then((res: any) => {
		const { data = {} } = res;
		if (!data.planingTotal && !data.total) {
			planArr.value[0].value = '-';
		} else {
			planArr.value[0].value = `${data.planingTotal ?? '-'}/${data.total ?? '-'}`;
		}
		planList.value = data.dataList || [];
	});
};
getWorkProgressList();

// 问题反馈
const problemList = ref<any[]>([]);
const problemMap: any = {
	1: '待解决',
	2: '处理中',
	3: '已解决',
	4: '已关闭',
};
const getInvestIssueList = () => {
	const params = {
		sccode: sccode.value,
	};
	investIssueList({ params }).then((res: any) => {
		const { data = {} } = res;
		if (!data.unSolvedTotal && !data.total) {
			planArr.value[1].value = '-';
		} else {
			planArr.value[1].value = `${data.unSolvedTotal ?? '-'}/${data.total ?? '-'}`;
		}
		problemList.value = data.dataList || [];
	});
};
getInvestIssueList();
</script>

<style lang="less" scoped>
:deep(.el-table) {
	th.el-table__cell,
	td.el-table__cell {
		padding: 0 !important;
		height: 0.41rem;
	}
}

.investment-work {
	padding-left: 0.24rem;
	padding-right: 0.33rem;
	.top {
		display: flex;
		justify-content: space-between;
		align-items: flex-end;
		.main {
			position: relative;
			width: 9.13rem;
			height: 1.03rem;
			background-size: 100% 100%;
			background-image: url('@/assets/images/runByEnterprise/newDetail/left-main-top.png');
			.left {
				flex-shrink: 0;
				padding: 0.39rem 1.08rem 0.17rem 1.05rem;
				.bold {
					font-family: YouSheBiaoTiHei;
					font-size: 0.22rem;
					color: #ffffff;
					line-height: 0.22rem;
					text-shadow: 0rem 0.02rem 0.04rem rgba(0, 0, 0, 0.5);
				}
				.normal {
					padding-top: 0.03rem;
					font-weight: 400;
					font-size: 0.14rem;
					color: #ffffff;
					line-height: 0.22rem;
				}
			}
			.right {
				margin: 0.47rem 1.2rem 0.12rem 0rem;
				font-size: 0.14rem;
				color: rgba(0, 0, 0, 0.6);
				line-height: 0.22rem;
			}
			.history-btn {
				cursor: pointer;
				position: absolute;
				top: 0.37rem;
				right: -0.54rem;
				width: 1.7rem;
				height: 0.28rem;
				background-size: 100% 100%;
				background-image: url('@/assets/images/runByEnterprise/newDetail/fillin-icon.png');
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 0.14rem;
				color: #165dff;
				line-height: 0.18rem;
				&.two {
					top: 0.71rem;
				}
				.arrow {
					margin-left: 0.08rem;
					display: inline-block;
					width: 0.16rem;
					height: 0.16rem;
					background-size: 100% 100%;
					background-image: url('@/assets/images/runByEnterprise/newDetail/double-arrow.png');
				}
			}
		}
		.pdf-box {
			display: flex;
			padding-top: 0.1rem;
			width: 1.37rem;
			height: 0.66rem;
			background: #eaf3fd;
			box-shadow: 0rem 0.03rem 0.1rem 0rem rgba(0, 0, 0, 0.15);
			border-radius: 0.08rem;
			border: 0.02rem solid #ffffff;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.6);
			line-height: 0.22rem;
			cursor: pointer;
			&.one {
				margin-left: 0.67rem;
			}
			&.two {
				margin-left: 0.16rem;
			}
			&.active,
			&:hover {
				color: #176bf9;
				border: 0.02rem solid #96bbf8;
			}
			&::before {
				margin: 0.09rem 0.08rem;
				content: '';
				display: inline-block;
				width: 0.28rem;
				height: 0.28rem;
				background-image: url('@/assets/images/runByEnterprise/newDetail/pdf-icon.png');
				background-size: 100% 100%;
			}
		}
	}
	.bottom {
		gap: 0.22rem;
		margin-top: 0.22rem;
		width: 7.07rem;
		height: 5.3rem;
		:deep(.bottom-left .title-body-content) {
			padding-left: 0.23rem;
			flex-grow: 1;
			height: 0;
			overflow-y: auto;
			overflow-x: none;
		}
		.enter-icon {
			cursor: pointer;
			width: 1.75rem;
			height: 0.38rem;
			background-image: url('@/assets/images/runByEnterprise/newDetail/fillin-icon.png');
			background-size: 100% 100%;
			font-size: 0.14rem;
			color: #165dff;
			line-height: 0.18rem;
			display: flex;
			justify-content: center;
			align-items: center;
			.arrow {
				margin-left: 0.08rem;
				display: inline-block;
				width: 0.16rem;
				height: 0.16rem;
				background-size: 100% 100%;
				background-image: url('@/assets/images/runByEnterprise/newDetail/double-arrow.png');
			}
		}
		.txtBox {
			display: flex;
			justify-content: space-between;
			align-items: center;
			.txt {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				flex: 1 1 auto;
				min-width: 0;
			}
			.sign {
				width: 0.55rem;
				height: 0.21rem;
				border-radius: 0.02rem;
				font-size: 0.12rem;
				color: #ffffff;
				text-align: center;
				line-height: 0.21rem;
				&.sign-1 {
					background: #00c462;
				}
				&.sign-2 {
					background: #266fe8;
				}
				&.sign-3 {
					background: #ffc359;
				}
			}
		}
		:deep(.bottom-right .title-body-content) {
			padding-left: 0.16rem;
		}
		.fill-in-part {
			gap: 0.1rem;
			.fill-in {
				cursor: pointer;
				width: 1.9rem;
				height: 0.38rem;
				background-image: url('@/assets/images/runByEnterprise/newDetail/fillin-icon.png');
				background-size: 100% 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 0.14rem;
				color: #165dff;
				line-height: 0.18rem;
				.arrow {
					margin-left: 0.08rem;
					display: inline-block;
					width: 0.16rem;
					height: 0.16rem;
					background-size: 100% 100%;
					background-image: url('@/assets/images/runByEnterprise/newDetail/double-arrow.png');
				}
				&.two {
					width: 1.15rem;
				}
			}
		}

		.plan-top {
			gap: 0.16rem;
			.rect-box {
				cursor: pointer;
				align-items: center;
				width: 2.52rem;
				height: 0.77rem;
				background-image: url('@/assets/images/runByEnterprise/newDetail/rect-box-bg.png');
				background-size: 100% 100%;
				.one {
					.bold {
						font-weight: bold;
						font-size: 0.16rem;
						color: #333333;
						line-height: 0.21rem;
					}
					.normal {
						padding-top: 0.09rem;
						font-size: 0.14rem;
						color: #4b4b4b;
						line-height: 0.22rem;
					}
				}
				.two {
					padding-top: 0.2rem;
					padding-left: 0.28rem;
					font-weight: bold;
					font-size: 0.24rem;
					color: #fe793b;
					line-height: 0.32rem;
				}
				&::before {
					margin: 0.1rem 0.05rem 0.1rem 0.08rem;
					content: '';
					display: block;
					width: 0.6rem;
					height: 0.56rem;
					background-image: url('@/assets/images/runByEnterprise/newDetail/rect-icon1-normal.png');
					background-size: 100% 100%;
				}
				&:nth-child(2) {
					&::before {
						width: 0.64rem;
						height: 0.57rem;
						background-image: url('@/assets/images/runByEnterprise/newDetail/rect-icon2.png');
						background-size: 100% 100%;
					}
				}
				&.active {
					background-image: url('@/assets/images/runByEnterprise/newDetail/rect-box-bg2.png');
					.one {
						.bold,
						.normal {
							color: #ffffff;
						}
					}
					.two {
						color: #ffffff;
					}
					&:nth-child(1) {
						&::before {
							background-image: url('@/assets/images/runByEnterprise/newDetail/rect-icon1.png');
						}
					}
					&:nth-child(2) {
						&::before {
							background-image: url('@/assets/images/runByEnterprise/newDetail/rect-icon2-active.png');
						}
					}
				}
			}
		}
		.plan-main {
			margin-top: 0.14rem;
			width: 5.2rem;
			height: 3.67rem;
			background: rgba(209, 229, 252, 0.3);
			border-radius: 0.04rem;
			padding: 0.16rem 0.17rem 0.09rem 0.13rem;
			overflow-y: auto;
			.list-item {
				border-bottom: 0.01rem solid #aaccff;
				&:not(:first-child) {
					padding-top: 0.08rem;
				}
				.one {
					display: flex;
					justify-content: space-between;
					.sign-icon {
						display: flex;
						align-items: center;
						width: 0.74rem;
						height: 0.2rem;
						background: #266fe8;
						border-radius: 0.03rem;
						font-size: 0.12rem;
						color: rgba(255, 255, 255, 0.9);
						line-height: 0.2rem;
						&.sign-1 {
							width: 0.74rem;
							background: #266fe8;
						}
						&.sign-2 {
							width: 0.86rem;
							background: #00a870;
						}
						&.sign-3 {
							width: 0.74rem;
							background: #4b4b4b;
						}

						&::before {
							content: '';
							display: inline-block;
							width: 0.14rem;
							height: 0.14rem;
							background-image: url('@/assets/images/runByEnterprise/newDetail/plan-icon.png');
							background-size: 100% 100%;
							margin: 0.03rem 0.04rem;
						}
						&.nobefore {
							justify-content: center;
							&.problem-1 {
								width: 0.55rem;
								background: #f04747;
							}
							&.problem-2 {
								background: #ffc359;
							}
							&.problem-3 {
								background: #00c462;
							}
							&.problem-4 {
								background: #4b4b4b;
							}
							&::before {
								display: none;
							}
						}
					}
					.date {
						font-size: 0.14rem;
						color: #000000;
						line-height: 0.22rem;
					}
				}
				.two {
					margin: 0.12rem 0 0.08rem;
					font-size: 0.14rem;
					color: rgba(0, 0, 0, 0.6);
					line-height: 0.22rem;
					display: -webkit-box;
					-webkit-line-clamp: 2; /* 限制显示的行数 */
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}
				.three {
					display: flex;
					justify-content: space-between;
					padding-bottom: 0.08rem;
					.text {
						font-size: 0.14rem;
						color: rgba(0, 0, 0, 0.28);
						line-height: 0.22rem;
					}
				}
			}
		}
	}
}
</style>
