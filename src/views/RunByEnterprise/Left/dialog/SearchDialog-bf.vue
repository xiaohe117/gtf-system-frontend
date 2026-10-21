<!--
 * @Descripttion: 企业搜索dialog
 * @Author: zhaochao
 * @Date: 2025-08-12 09:23:35
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-11-25 14:41:25
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

			<div :class="['search-main-content', { 'show-advanced-search': openedAdvanceSearch }]">
				<!-- 最近搜索词条 -->
				<div class="recent-search fx-r">
					<div class="fx-r fx-al-end">最近搜索：</div>
					<div
						class="search-item"
						v-for="(item, index) in recentSearchList"
						:key="index"
						@click="goEnterpriseDetail(item)"
					>
						{{ item.companyName }}
					</div>
				</div>
				<!-- 高级搜索 -->
				<div class="advanced-search" v-show="openedAdvanceSearch">
					<SmallTitle title="高级搜索">
						<div class="clear-search" @click="() => (searchForm = {})">
							清除搜索条件
						</div>
					</SmallTitle>
					<CustomForm :form="searchForm" :config="searchConfig" />
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
				<div class="search-company-list" v-else>
					<SmallTitle :title="(total<initTotal) ?`搜索到${total}家相关企业`:`全部企业${total}家`" />
					<template v-if="searchCompanyList.length">
						<div
							class="compony-list fx-r"
							ref="scrollContainerRef"
							v-infinite-scroll="scrollLoad"
							:infinite-scroll-distance="10"
							:infinite-scroll-immediate="false"
						>
							<div
								v-for="(item, index) in searchCompanyList"
								:key="index"
								class="list-item"
								@click="goEnterpriseDetail(item)"
							>
								<div class="label overflow-ellipsis">{{ item.companyName }}</div>
								<div class="tags fx-r">
									<div v-for="(tag, index2) in item.tagList" :key="index2">
										<div :class="`tag${companyTags[tag.listEntTag]}`">
											{{ tag.listEntTag }}
										</div>
									</div>
								</div>
								<div class="overflow-ellipsis">
									跟进单位：
									{{
										item.companyFollow
											.map((item: any) => item.followUnit)
											.join('、')
									}}
								</div>
								<div class="overflow-ellipsis">
									注册地： {{ item.registeredAddress }}
								</div>
								<div class="overflow-ellipsis">
									企业性质： {{ item.enterpriseType }}
								</div>
								<div class="tips" v-show="clickGoDetail">点击进入企业详情页</div>
							</div>
						</div>
					</template>
					<default-empty-container :height="'4.4rem'" v-else />
				</div>
			</div>
		</div>
	</el-dialog>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router';
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
} from '@/api/runByEnterprise/index';
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

const router = useRouter();
const dialogVisible = ref(false);
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
	size: 24,
	current: 1,
});
const scrollContainerRef = ref<any>();
const dictItems = ref<any>({}); // 字典列表

const searchConfig = computed(() => [
	{
		type: 'select',
		label: '产业分类',
		prop: 'industryCode',
		placeholder: '全部',
		options: dictItems.value.industryCategory,
		span: 4,
	},
	{
		type: 'select',
		label: '全部地区',
		prop: 'areaCode',
		placeholder: '全国',
		options: dictItems.value.region,
		span: 4,
	},
	{
		type: 'select',
		label: '企业性质',
		prop: 'companyQuality',
		placeholder: '全部',
		options: dictItems.value.companyQuality,
		span: 4,
	},
	{
		type: 'select',
		label: '有无策划项目',
		prop: 'hasPlan',
		placeholder: '全部',
		options: dictItems.value.hasPlanning,
		span: 4,
	},
	{
		type: 'select',
		label: '跟进单位',
		prop: 'followUnit',
		placeholder: '全部',
		options: dictItems.value.unit,
		span: 4,
	},
	{
		type: 'select',
		label: '招商成熟度',
		prop: 'investMaturity',
		placeholder: '全部',
		options: dictItems.value.maturity,
		span: 4,
	},
]);
const companyTags = ref<any>({
	在穗产业: '1',
	国企: '2',
	重点产业: '3',
});
const emit = defineEmits(['handleClickEnterprise']);

watch(
	() => props.needRecommendCompany,
	(val) => {
		showRecommendCompany.value = val;
	},
	{
		immediate: true,
	}
);

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
// 搜索
const handleSearch = () => {
	showRecommendCompany.value = false;
	total.value = 0;
	page.value.current = 1;
	const params = {
		current: page.value.current,
		size: page.value.size,
		companyName: companyName.value,
		...searchForm.value,
	};
	queryPublicEnterpriseByParams({ data: params })
		.then((res: any) => {
			if (res.code === 0) {
				searchCompanyList.value = res.data.records;
				total.value = res.data.total;
        initTotal.value = res.data.dataTotal;
			} else {
				searchCompanyList.value = [];
			}
		})
		.finally(() => {
			// 滚动到顶部
			nextTick(() => {
				if (scrollContainerRef.value) {
					scrollContainerRef.value.scrollTop = 0;
				}
			});
		})
		.catch(() => {
			searchCompanyList.value = [];
		});
};
// 滚动加载更多
const scrollLoad = () => {
	if (!showRecommendCompany.value) {
		if (page.value.current * page.value.size < total.value) {
			page.value.current += 1;
			const params = {
				current: page.value.current,
				size: page.value.size,
				companyName: companyName.value,
				...searchForm.value,
			};
			queryPublicEnterpriseByParams({ data: params }).then((res: any) => {
				if (res.code === 0) {
					searchCompanyList.value = searchCompanyList.value.concat(res.data.records);
				}
			});
		}
	}
};

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
		router.push({
			name: 'enterpriseDetail',
			query: {
				sccode: item.sccode,
			},
		});
	} else {
		emit('handleClickEnterprise', item);
		handleClose();
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
					:deep(.el-input__wrapper) {
						box-shadow: none;
						height: 0.5rem;
						padding: 0.01rem 0.11rem;
					}
					:deep(.el-input__inner) {
						color: rgba(0, 0, 0, 0.6);
						font-size: 0.2rem;
					}
				}
				.search-btn {
					width: 1.68rem;
					height: 0.52rem;
					line-height: 0.52rem;
					color: rgba(255, 255, 255, 0.9);
					font-size: 0.16rem;
					background: url('@/assets/images/runByEnterprise/left/search-btn.png') no-repeat;
					background-size: 100%;
					cursor: pointer;
					position: absolute;
					right: -1.4rem;
					top: -0.01rem;
					text-align: center;
					.el-icon {
						width: 0.16rem;
						height: 0.16rem;
						vertical-align: sub;
					}
				}
			}
			.advance-search {
				color: #4b4b4b;
				font-size: 0.16rem;
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

		.search-main-content {
			height: 6.8rem;
			overflow-y: auto;
			overflow-x: hidden;
			.recent-search {
				color: #266fe8;
				font-size: 0.18rem;
				flex-wrap: wrap;
				margin-top: 0.08rem;
				margin-bottom: 0.2rem;
				.search-item {
					background: #dce9ff;
					padding: 0.01rem 0.16rem;
					margin-right: 0.16rem;
					color: rgba(0, 0, 0, 0.6);
					font-size: 0.14rem;
					height: 0.24rem;
					line-height: 0.24rem;
					margin-top: 0.16rem;
					cursor: pointer;
				}
			}
			.advanced-search {
				background: #fff;
				margin-top: 0.15rem;
				.clear-search {
					width: 1.84rem;
					height: 0.44rem;
					font-size: 0.14rem;
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
						width: 0.16rem;
						height: 0.16rem;
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
					height: 5.7rem;
					padding-top: 0.1rem;
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
						font-size: 0.14rem;
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
							font-size: 0.16rem;
							font-weight: 500;
							line-height: 0.24rem;
						}
						.tags {
							height: 0.2rem;
							.tag1,
							.tag2,
							.tag3 {
								height: 0.18rem;
								font-size: 0.12rem;
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
							font-size: 0.16rem;
							text-align: center;
							height: 0.4rem;
							margin-bottom: 0;
							line-height: 0.5rem;
							border-top: 0.01rem solid #e7e7e7;
						}
					}
				}
			}
			&.show-advanced-search {
				.search-company-list {
					.compony-list {
						height: 4.58rem;
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
}
</style>
