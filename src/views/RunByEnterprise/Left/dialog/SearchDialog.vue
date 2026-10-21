<!--
 * @Descripttion: 企业搜索dialog
 * @Author: zhaochao
 * @Date: 2025-08-12 09:23:35
 * @LastEditors: ycyun
 * @LastEditTime: 2026-03-30 11:10:38
-->
<template>
	<el-dialog
		v-model="dialogVisible"
		:before-close="handleClose"
		width="19rem"
		top="7.6vh"
		class="runby-enterprise-search-dialog"
		append-to-body
	>
		<div class="content-box">
			<TitleBody name="企业查找" />
			<!-- 搜索框 -->
			<div class="search-box fx-r fx-sp-b">
				<div class="input-box fx-r">
					<el-input
						v-model="companyName"
						placeholder="请输入企业名称"
						clearable
						@clear="handleSearch"
						@keyup.enter="handleSearch"
					/>
					<div class="search-btn" @click="handleSearch">
						<el-icon><Search /></el-icon>
						查一下
					</div>
				</div>
				<div
					:class="['advance-search', { open: openedAdvanceSearch }]"
					@click="openedAdvanceSearch = !openedAdvanceSearch"
				>
					{{ openedAdvanceSearch ? '收起高级搜索' : '展开高级搜索' }}
					<img
						v-if="!openedAdvanceSearch"
						src="@/assets/images/runByEnterprise/left/arrow-down.png"
						alt=""
					/>
					<img v-else src="@/assets/images/runByEnterprise/left/arrow-up.png" alt="" />
				</div>
			</div>
			<!-- 最近搜索词条 -->
			<div class="recent-search fx-r">
				<div class="fx-r fx-al-end">热门搜索：</div>
				<div
					class="search-item"
					v-for="(item, index) in recentSearchList"
					:key="index"
					@click="goEnterpriseDetail(item)"
				>
					{{ item.companyName }}
				</div>
			</div>
			<div :class="['search-main-content', { 'show-advanced-search': openedAdvanceSearch }]">
				<!-- 高级搜索 -->
				<div class="advanced-search" v-show="openedAdvanceSearch">
					<SmallTitle title="高级搜索">
						<div class="clear-search" @click="() => (searchForm = {})">
							清除搜索条件
						</div>
					</SmallTitle>
					<CustomForm class="search-from" :form="searchForm" :config="searchConfig">
						<template #followUnit>
							<SelectDept
								data-type="other"
								:label="'责任市级单位'"
								v-model="searchForm.followUnit"
								placeholder="全部"
								:props="deptProps"
							/>
						</template>
					</CustomForm>
				</div>

				<!-- 热门搜索、推荐企业 -->
				<div class="recommend-company fx-r" v-if="showRecommendCompany">
					<CompanyList
						class="fx-1"
						:title="'热门搜索企业'"
						:data-list="hotSearchCompanyList"
					/>
					<CompanyList
						class="fx-1"
						:title="'推荐企业'"
						:data-list="recommendCompanyList"
					/>
				</div>
				<!-- 搜索结果 -->
				<div class="search-company-list" v-loading="loading" v-else>
					<SmallTitle
						:title="
							total < initTotal ? `搜索到${total}家相关企业` : `全部企业${total}家`
						"
					/>
					<template v-if="searchCompanyList.length">
						<MultiHeaderTable
							class="compony-list"
							:tableData="searchCompanyList"
							:columns="columns"
							:height="'calc(100% - 0.6rem)'"
							:hasOrder="true"
							:isPage="true"
							:row-style="rowStyle"
							:total="total"
							@handleSizeChange="handleSizeChange"
							@handleCurrentChange="handleCurrentChange"
						>
							<template #companyName="{ row }">
								<div class="company-name" @click="goDetail(row)">
									{{ row.companyName }}
								</div>
							</template>
						</MultiHeaderTable>
						<!-- <div class="page-box">
							<el-pagination
								v-model:current-page="page.current"
								v-model:page-size="page.size"
								:page-sizes="[10, 50, 100, 200]"
								layout="total, prev, pager, next"
								:total="total"
								@size-change="handlePageChange"
								@current-change="handlePageChange"
							/>
						</div> -->
					</template>
					<template v-else>
						<div class="empty-box compony-list">
							<default-empty-container class="empty-left" />
							<div class="empty-right" v-if="companyName">
								<p class="text">
									该企业暂未纳入全市目标企业库，可点击下方链接检索该企业信息。
								</p>
								<div class="system-list">
									<div
										class="system-item"
										v-for="item in externalLink"
										:key="item.name"
										@click="handlerOpenLink(item)"
									>
										<img
											src="@/assets/images/runByEnterprise/left/search-system.png"
											alt=""
										/>
										<span class="name">{{ item.name }}</span>
										<span class="sub-name">{{ item.subName }}</span>
									</div>
								</div>
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script setup lang="ts">
import ServiceUrl from '@/utils/url'
import {
	getRecentSearch,
	getHotSearch,
	getRecommendEnterprise,
	queryPublicEnterpriseByParams,
	getCompanyQuality,
	getHasPlanning,
	getIndustryCategory,
	getMaturity,
	getRegion,
	getUnit,
	getIndustryTypeList,
} from '@/api/runByEnterprise/index';
import { externalLink } from '@/config/tabs';
import SelectDept from '@/views/WallMapTable/components/SelectDept.vue';
import { getSize } from '@/utils';
import CompanyList from '../components/CompanyList.vue';
import CustomForm from '../components/CustomForm.vue';

const props = defineProps({
	needRecommendCompany: {
		type: Boolean,
		default: false,
	},
	clickGoDetail: {
		type: Boolean,
		default: false,
	},
});
const deptProps = ref({
	value: 'departmentId',
	label: 'name',
	emitPath: false,
	checkStrictly: true,
});
const dialogVisible = ref(false);
const loading = ref(false);
const openedAdvanceSearch = ref(false); // 展开高级搜索
const searchForm = ref<any>({});
const companyName = ref<string>(''); // 搜索企业名称
const recentSearchList = ref<any>([]);
const showRecommendCompany = ref(true); // 显示推荐企业
const hotSearchCompanyList = ref<any>([]); // 热门搜索企业列表
const recommendCompanyList = ref<any>([]); // 推荐企业列表
const searchCompanyList = ref<any>([]); // 搜索企业列表
const total = ref<number>(0);
const initTotal = ref<number>(0);
const page = ref<any>({
	size: 10,
	current: 1,
	total: 0,
});
// const scrollContainerRef = ref<any>();
const dictItems = ref<any>({}); // 字典列表

const searchConfig = computed(() => [
	{
		type: 'input',
		label: '企业代码',
		prop: 'sccode',
		span: 5,
	},
	{
		type: 'select',
		label: '所在地',
		prop: 'areaCode',
		placeholder: '全国',
		options: dictItems.value.region,
		span: 5,
	},
	{
		type: 'select',
		label: '产业体系',
		prop: 'industryTypeInfo',
		placeholder: '全部',
		options: dictItems.value.industryType,
		span: 5,
	},
	{
		type: 'select',
		label: '企业性质',
		prop: 'companyQuality',
		placeholder: '全部',
		options: dictItems.value.companyQuality,
		span: 5,
	},
	// {
	// 	type: 'select',
	// 	label: '有无策划项目',
	// 	prop: 'hasPlan',
	// 	placeholder: '全部',
	// 	options: dictItems.value.hasPlanning,
	// 	span: 4,
	// },
	{
		label: '责任市级单位',
		prop: 'followUnit',
		placeholder: '全部',
		options: dictItems.value.unit,
		span: 5,
	},
	// {
	// 	type: 'select',
	// 	label: '招商成熟度',
	// 	prop: 'investMaturity',
	// 	placeholder: '全部',
	// 	options: dictItems.value.maturity,
	// 	span: 4,
	// },
]);
// const companyTags = ref<any>({
// 	在穗产业: '1',
// 	国企: '2',
// 	重点产业: '3',
// });
const emit = defineEmits(['handleClickEnterprise']);
const columns = ref([
	{
		prop: 'companyName',
		label: '企业名称',
		align: 'left',
		type: 'slot',
		slotName: 'companyName',
		showToolTip: true,
	},
	{
		prop: 'sccode',
		label: '统一社会信用代码',
		align: 'left',
		showToolTip: true,
		width: getSize(240),
	},
	{
		prop: 'registeredAddress',
		label: '所在地',
		align: 'left',
		showToolTip: true,
	},
	{
		prop: 'industry12218',
		label: '产业分类',
		align: 'left',
		showToolTip: true,
	},
	{
		prop: 'enterpriseType',
		label: '企业性质',
		align: 'left',
		showToolTip: true,
		width: getSize(250),
	},
	{
		prop: 'followUnit',
		label: '责任市级单位',
		align: 'left',
		showToolTip: true,
		width: getSize(350),
	},
]);
watch(
	() => props.needRecommendCompany,
	(val) => {
		showRecommendCompany.value = val;
	},
	{
		immediate: true,
	}
);

const rowStyle = ({ rowIndex }: { rowIndex: number }) => {
	if (rowIndex % 2 === 0) {
		return 'background: #FFFFFF;';
	}
	return 'background: #F8FCFF;';
};
// 获取字典列表
const getDictItems = () => {
	getCompanyQuality().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.companyQuality = res.data.map((item: any) => ({
				value: item && item.code,
				label: item && item.name,
			}));
		}
	});
	getHasPlanning().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.hasPlanning = res.data.map((item: any) => ({
				value: item.code,
				label: item.name,
			}));
		}
	});
	getIndustryCategory().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.industryCategory = res.data.map((item: any) => ({
				value: item.industryCode,
				label: item.industryName,
			}));
		}
	});
	getIndustryTypeList().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.industryType = res.data.map((item: any) => ({
				value: item.industryType,
				label: item.industryType,
			}));
		}
	});
	getMaturity().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.maturity = res.data.map((item: any) => ({
				value: item.code,
				label: item.name,
			}));
		}
	});
	getRegion().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.region = res.data.map((item: any) => ({
				value: item.code,
				label: item.name,
			}));
		}
	});
	getUnit().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.unit = res.data.map((item: any) => ({
				value: item.code,
				label: item.name,
			}));
		}
	});
};
// 获取最近搜索列表
const getRecentSearchData = () => {
	recentSearchList.value = [];
	const params = {
		page: 1,
		size: 3,
	};
	getRecentSearch({ params }).then((res: any) => {
		if (res.code === 0) {
			recentSearchList.value = res.data.records;
		}
	});
};
// 获取推荐企业列表
const getRecommendCompanyList = () => {
	recommendCompanyList.value = [];
	const params = {
		page: 1,
		size: 10,
	};
	getRecommendEnterprise({
		params,
	}).then((res: any) => {
		if (res.code === 0) {
			recommendCompanyList.value = res.data.records;
		}
	});
};

// 获取热门搜索企业列表
const getHotSearchCompanyList = () => {
	hotSearchCompanyList.value = [];
	const params = {
		page: 1,
		size: 10,
	};
	getHotSearch({ params }).then((res: any) => {
		if (res.code === 0) {
			hotSearchCompanyList.value = res.data.records;
		}
	});
};

const getList = () => {
	const params = {
		current: page.value.current,
		size: page.value.size,
		companyName: companyName.value,
		...searchForm.value,
	};
	loading.value = true;
	queryPublicEnterpriseByParams({ data: params })
		.then((res: any) => {
			if (res.code === 0) {
				searchCompanyList.value = res.data.records || [];
				try {
					searchCompanyList.value.forEach((ele: any) => {
						ele.followUnit =
							ele.companyFollow?.map((item: any) => item.followUnit).join('、') || '';
					});
				} catch (error) {
					console.log(error);
				}
				total.value = res.data.total;
				initTotal.value = res.data.dataTotal;
			} else {
				searchCompanyList.value = [];
			}
		})
		.catch(() => {
			searchCompanyList.value = [];
		})
		.finally(() => {
			loading.value = false;
		});
};
const handleSizeChange = (size: number) => {
	page.value.size = size;
	getList();
};
const handleCurrentChange = (current: number) => {
	page.value.current = current;
	getList();
};
// 搜索
const handleSearch = () => {
	showRecommendCompany.value = false;
	total.value = 0;
	page.value.current = 1;
	getList();
};
// 滚动加载更多
// const scrollLoad = () => {
// 	if (!showRecommendCompany.value) {
// 		if (page.value.current * page.value.size < total.value) {
// 			page.value.current += 1;
// 			const params = {
// 				current: page.value.current,
// 				size: page.value.size,
// 				companyName: companyName.value,
// 				...searchForm.value,
// 			};
// 			queryPublicEnterpriseByParams({ data: params }).then((res: any) => {
// 				if (res.code === 0) {
// 					searchCompanyList.value = searchCompanyList.value.concat(res.data.records);
// 				}
// 			});
// 		}
// 	}
// };

const handleClose = () => {
	dialogVisible.value = false;
	if (props.needRecommendCompany) {
		showRecommendCompany.value = true;
	}
	openedAdvanceSearch.value = false;
	companyName.value = '';
	searchForm.value = {};
};

const goEnterpriseDetail = (item: any) => {
	if (props.clickGoDetail) {
		window.open(
			`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${item.companyName}&sccode=${item.sccode}`,
			'_blank'
		);
	} else {
		emit('handleClickEnterprise', item);
		handleClose();
	}
};
const goDetail = (vl: any) => {
	/*
	router.push({
		path: '/runByEnterprise/enterpriseDetail',
		query: {
			name: vl.companyName || '',
			sccode: vl.sccode,
		},
	});
	*/
	window.open(
		`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${vl.companyName}&sccode=${vl.sccode}`,
		'_blank'
	);
};

const handlerOpenLink = (item: any) => {
	if (item.path) {
		window.open(item.path, '_blank');
	}
};
const show = () => {
	dialogVisible.value = true;
	getRecentSearchData();
	getDictItems();
	if (props.needRecommendCompany) {
		getRecommendCompanyList();
		getHotSearchCompanyList();
	} else {
		handleSearch(); // 不需要推荐企业，直接查找企业列表
	}
};
defineExpose({ show });

watch(
	() => searchForm.value,
	() => {
		if (dialogVisible.value) {
			handleSearch();
		}
	},
	{
		deep: true,
	}
);
</script>
<style lang="less">
.runby-enterprise-search-dialog {
	.content-box {
		padding: 0 0.2rem;
		.search-box {
			margin-top: 0.3rem;
			width: 9.2rem;
			margin: 0 auto;
			.input-box {
				width: 5.7rem;
				height: 0.52rem;
				border: 0.01rem solid #2f6bef;
				border-radius: 0.26rem;
				background: rgba(255, 255, 255, 0.9);
				backdrop-filter: blur(0.15rem);
				padding: 0 0.2rem;
				position: relative;
				.el-input {
					.el-input__wrapper {
						box-shadow: none;
						height: 0.5rem;
						padding: 0.01rem 0.11rem;
					}
					.el-input__inner {
						color: rgba(0, 0, 0, 0.6);
						font-size: @g-font-size-medium;
					}
				}
				.search-btn {
					width: 1.68rem;
					height: 0.52rem;
					line-height: 0.52rem;
					color: rgba(255, 255, 255, 0.9);
					font-size: @g-font-size-base;
					background: url('@/assets/images/runByEnterprise/left/search-btn.png') no-repeat;
					background-size: 100%;
					cursor: pointer;
					position: absolute;
					right: -1.4rem;
					top: -0.01rem;
					text-align: center;
					.el-icon {
						width: 0.18rem;
						height: 0.18rem;
						vertical-align: sub;
					}
				}
			}
			.advance-search {
				color: #4b4b4b;
				font-size: @g-font-size-base;
				width: 2.3rem;
				height: 0.52rem;
				line-height: 0.52rem;
				text-align: center;
				background: url('@/assets/images/runByEnterprise/left/advance-search-close.png')
					no-repeat;
				background-size: 100% 100%;
				cursor: pointer;

				img {
					width: 0.14rem;
					height: 0.14rem;
					vertical-align: sub;
				}
				&.open {
					background: url('@/assets/images/runByEnterprise/left/advance-search-open.png')
						no-repeat;
					background-size: 100% 100%;
					color: #fff;
				}
			}
		}
		.recent-search {
			width: 9.2rem;
			margin: 0 auto;
			color: #266fe8;
			font-size: @g-font-size-base;
			flex-wrap: wrap;
			margin-top: 0.08rem;
			margin-bottom: 0.2rem;
			font-family:
				PingFangSC,
				PingFang SC;
			.search-item {
				background: #dce9ff;
				padding: 0 0.16rem;
				margin-right: 0.16rem;
				color: rgba(0, 0, 0, 0.6);
				font-size: @g-font-size-small;
				height: 0.24rem;
				line-height: 0.24rem;
				margin-top: 0.16rem;
				cursor: pointer;
			}
		}
		.search-main-content {
			height: 6.1rem;
			overflow-y: auto;
			overflow-x: hidden;

			.advanced-search {
				background: #fff;
				// margin-top: 0.15rem;
				.search-from {
					.el-col-5 {
						max-width: 20%;
						flex: 0 0 20%;
					}
					.select-dept {
						.el-cascader {
							width: 100%;
							--el-border-color-hover: transparent;
							.el-input.is-focus {
								.el-input__wrapper {
									box-shadow: none;
								}
							}
						}
					}
				}
				.clear-search {
					width: 1.84rem;
					height: 0.44rem;
					font-size: @g-font-size-small;
					color: #165dff;
					line-height: 0.44rem;
					cursor: pointer;
					text-indent: 0.16rem;
					background: url('@/assets/images/runByEnterprise/left/clear-bg.png') no-repeat
						left center;
					background-size: 100% 100%;
					&::before {
						content: '';
						display: inline-block;
						width: 0.18rem;
						height: 0.18rem;
						background: url('@/assets/images/runByEnterprise/left/clear-btn.png')
							no-repeat;
						background-size: 100% 100%;
						vertical-align: middle;
						margin-right: 0.1rem;
					}
				}
			}
			.recommend-company {
				gap: 0.76rem;
				margin-top: 0.18rem;
			}
			.search-company-list {
				.compony-list {
					height: 5.4rem;
					// padding-top: 0.1rem;
					flex-wrap: wrap;
					overflow-y: auto;
					.list-item {
						width: 2.9rem;
						max-height: 2.1rem;
						margin: 0 0.05rem 0.08rem 0.05rem;
						background: url('@/assets/images/runByEnterprise/left/company-card-bg.png')
							no-repeat;
						background-size: 100% 100%;
						box-shadow: 0 0.02rem 0.08rem 0 rgba(0, 0, 0, 0.25);
						border-radius: 0.08rem;
						padding: 0.16rem 0 0.08rem 0;
						cursor: pointer;
						color: rgba(0, 0, 0, 0.65);
						font-size: @g-font-size-base;
						position: relative;
						&:hover {
							background: url('@/assets/images/runByEnterprise/left/company-card-active-bg.png')
								no-repeat;
							background-size: 100% 100%;
						}

						> div {
							line-height: 0.22rem;
							margin-bottom: 0.06rem;
							padding: 0 0.16rem;
						}
						.label {
							color: rgba(0, 0, 0, 0.9);
							font-size: @g-font-size-base;
							font-weight: 500;
							line-height: 0.24rem;
						}
						.tags {
							height: 0.2rem;
							.tag1,
							.tag2,
							.tag3 {
								height: 0.18rem;
								font-size: @g-font-size-small;
								width: 0.64rem;
								height: 100%;
								line-height: 0.2rem;
								border-radius: 0.03rem;
								text-align: center;
								margin-right: 0.1rem;
							}
							.tag1 {
								color: #ff7a0d;
								background: #fef3ec;
							}
							.tag2 {
								color: #2e79f8;
								background: #ecf2fe;
							}
							.tag3 {
								color: #00a870;
								background: #e8f8f2;
							}
						}
						.tips {
							color: #266fe8;
							font-weight: 500;
							font-size: @g-font-size-base;
							text-align: center;
							height: 0.4rem;
							margin-bottom: 0;
							line-height: 0.5rem;
							border-top: 0.01rem solid #e7e7e7;
						}
					}
				}
				.el-table {
					border: none;
					th.el-table__cell {
						border-right: none;
						font-size: @g-font-size-medium;
						height: 0.56rem;
						line-height: 0.56rem;
						background: #e4f1ff;
						color: rgba(0, 0, 0, 0.85);
						border-bottom-color: rgba(0, 0, 0, 0.06);
					}
					td.el-table__cell {
						border-right: none;
						font-size: @g-font-size-base;
						height: 0.53rem;
						line-height: 0.53rem;
						color: rgba(0, 0, 0, 0.85);
						border-bottom-color: #aaccff;
					}
					.el-table__inner-wrapper {
						&::before {
							background-color: transparent;
						}
					}
				}
			}
			&.show-advanced-search {
				.search-company-list {
					.compony-list {
						height: 4.3rem;
					}
				}
				.recommend-company {
					height: 4.5rem;
					overflow-y: auto;
					margin-top: 0.16rem;
				}
			}
		}
	}
	.company-name {
		color: #165dff;
		cursor: pointer;
		width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	.empty-box {
		display: flex;
		height: 100%;
		.empty-left {
			flex: 2;
			height: 100%;
			.empty-container_icon {
				height: 2.6rem;
				max-width: 50rem;
				max-height: 2.6rem;
			}
			.empty-container_text {
				font-size: 0.28rem;
				color: rgba(0, 0, 0, 0.66);
			}
		}
		.empty-right {
			padding-left: 0.36rem;
			display: flex;
			flex-direction: column;
			justify-content: center;
			flex: 1;
			border-left: 0.08rem #ebf4ff solid;

			// padding-top: 1.26rem;
			.text {
				font-family:
					PingFangSC,
					PingFang SC;
				font-weight: 500;
				font-size: 0.22rem;
				color: rgba(0, 0, 0, 0.66);
				line-height: 0.46rem;
				margin-bottom: 0.32rem;
			}
			.system-list {
				.system-item {
					display: flex;
					align-items: center;
					font-family:
						PingFangSC,
						PingFang SC;
					font-size: 0.2rem;
					line-height: 0.46rem;
					background: url('@/assets/images/runByEnterprise/left/system-bottom.png') bottom
						left / 5.97rem 0.21rem no-repeat;
					margin-bottom: 0.24rem;
					padding-left: 0.12rem;
					cursor: pointer;
					img {
						width: 0.46rem;
						height: 0.46rem;
					}
					.name {
						color: #165dff;
						margin-left: 0.24rem;
					}
				}
			}
		}
	}
	.page-box {
		padding-top: 0.15rem;
		display: flex;
		justify-content: flex-end;
		.el-pagination {
			.el-pager li,
			.btn-prev,
			.btn-next {
				color: rgba(0, 0, 0, 0.65);
				padding: 0.05rem 0.1rem;
				font-family:
					PingFangSC,
					PingFang SC;
				font-size: 0.18rem;
				background: #ffffff;
				border-radius: 0.02rem;
				border: 0.01rem solid rgba(0, 0, 0, 0.15);
				margin-left: 0.08rem;
			}
			.el-pager li.is-active {
				color: #165dff;
				border-color: #165dff;
				font-weight: 400;
			}
			.el-pagination__total {
				font-family:
					PingFangSC,
					PingFang SC;
				font-size: 0.18rem;
				color: rgba(0, 0, 0, 0.65);
			}
		}
	}
}
</style>
