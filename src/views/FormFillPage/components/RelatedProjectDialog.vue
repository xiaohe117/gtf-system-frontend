<template>
	<el-dialog
		v-model="dialogVisible"
		:before-close="handleClose"
		width="19rem"
		top="7.6vh"
		class="search-dialog"
	>
		<div class="content-box">
			<TitleBody name="关联项目" />
			<!-- 搜索框 -->
			<div class="search-box fx-r fx-sp-b">
				<div class="input-box fx-r">
					<el-input
						v-model="projectName"
						placeholder="请输入项目名称"
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
						@click="goEnterpriseDetail(item, '最近搜索')"
					>
						{{ item.projectName }}
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

				<!-- 搜索结果 -->
				<div class="search-company-list">
					<SmallTitle :title="`搜索到 ${total}个相关项目`" />
					<template v-if="total">
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
								@click="goEnterpriseDetail(item, '内容')"
							>
								<div class="label overflow-ellipsis">{{ item.projectName }}</div>
								<div class="tags fx-r">
									<div v-for="(tag, index2) in item.tagList" :key="index2">
										<div :class="`tag${companyTags[tag.listEntTag]}`">
											{{ tag.listEntTag }}
										</div>
									</div>
								</div>
								<div class="overflow-ellipsis">
									跟进单位：
									{{ item.creator }}
								</div>
								<div class="overflow-ellipsis">
									进程阶段： {{ item.progressLevel === '1' ? '在谈' : '-' }}
								</div>
								<div class="overflow-ellipsis">
									项目概述： {{ item.projectDesc }}
								</div>
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
import {
	getCompanyQuality,
	getHasPlanning,
	getIndustryCategory,
	getMaturity,
	getRegion,
	getUnit,
} from '@/api/runByEnterprise/index';
import { queryProjectList, queryProjectHistRecordList } from '@/api/formFillPage/dialog';
import CustomForm from '@/views/RunByEnterprise/Left/components/CustomForm.vue';

const dialogVisible = ref(false);
const openedAdvanceSearch = ref(false);
const searchForm = ref<any>({
	id: 0,
	projectDesc: '',
	progressLevel: '',
	createUnit: '',
	creator: '',
	dataSource: '',
	insertTime: '',
	industrySystem: '',
	projectLocation: '',
	projectCategory: '',
});
const projectName = ref<string>('');
const recentSearchList = ref<any>([]);
const searchCompanyList = ref<any>([]);
const total = ref<number>(0);
const page = ref<any>({
	size: 24,
	current: 1,
});
const scrollContainerRef = ref<any>();
const dictItems = ref<any>({
	industrySystem: [],
	projectCategoryning: [],
	projectCategory: [],
	region: [],
});

const searchConfig = computed(() => [
	{
		type: 'select',
		label: '产业体系',
		prop: 'industrySystem',
		placeholder: '全部',
		// options: dictItems.value.industrySystem,
		options: [{ value: '', label: '全部' }], // 待确认
		span: 4,
	},
	{
		type: 'select',
		label: '项目所在地',
		prop: 'projectLocation',
		placeholder: '全国',
		options: dictItems.value.region,
		span: 4,
	},
	{
		type: 'select',
		label: '项目阶段',
		prop: 'progressLevel',
		placeholder: '全部',
		options: [{ value: '1', label: '在谈' }],
		span: 4,
	},
	{
		type: 'select',
		label: '项目类别',
		prop: 'projectCategory',
		placeholder: '全部',
		// options: dictItems.value.projectCategory,
		options: [{ value: '', label: '全部' }], // 待确认
		span: 4,
	},
]);
const companyTags = ref<any>({
	在穗产业: '1',
	国企: '2',
	重点产业: '3',
});
const emit = defineEmits(['handle-click-project']);

const getDictItems = () => {
	getCompanyQuality().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.projectCategory = res.data.map((item: any) => ({
				value: item && item.code,
				label: item && item.name,
			}));
		}
	});
	getHasPlanning().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.projectCategoryning = res.data.map((item: any) => ({
				value: item.code,
				label: item.name,
			}));
		}
	});
	getIndustryCategory().then((res: any) => {
		if (res.code === 0) {
			dictItems.value.industrySystem = res.data.map((item: any) => ({
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
				value: item.name,
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

const queryProjectHistRecordListData = () => {
	recentSearchList.value = [];
	queryProjectHistRecordList().then((res: any) => {
		if (res.code === 0) {
			recentSearchList.value = res.data;
		}
	});
};

const handleSearch = () => {
	total.value = 0;
	page.value.current = 1;
	const params = {
		projectName: projectName.value,
		...searchForm.value,
	};
	queryProjectList(params)
		.then((res: any) => {
			if (res.code === 0) {
				searchCompanyList.value = res.data;
				total.value = res.data.length;
			} else {
				searchCompanyList.value = [];
			}
		})
		.finally(() => {
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

const scrollLoad = () => {
	if (page.value.current * page.value.size < total.value) {
		page.value.current += 1;
		const params = {
			current: page.value.current,
			size: page.value.size,
			projectName: projectName.value,
			...searchForm.value,
		};
		queryProjectList(params).then((res: any) => {
			if (res.code === 0) {
				searchCompanyList.value = searchCompanyList.value.concat(res.data);
			}
		});
	}
};

const handleClose = () => {
	dialogVisible.value = false;
	openedAdvanceSearch.value = false;
	projectName.value = '';
	searchForm.value = {};
};

const goEnterpriseDetail = (item: any, name: string) => {
	if (name === '内容') {
		emit('handle-click-project', item);
		handleClose();
	} else {
		projectName.value = item.projectName;
		handleSearch();
	}
};

const show = () => {
	dialogVisible.value = true;
	queryProjectHistRecordListData();
	getDictItems();
	handleSearch();
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

<style lang="less" scoped>
.search-dialog {
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
			height: 7rem;
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
			.search-company-list {
				.compony-list {
					height: 5.9rem;
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
							.tag1,
							.tag2,
							.tag3 {
								height: 0.18rem;
								font-size: 0.12rem;
								width: 0.64rem;
								height: 0.2rem;
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
					}
				}
			}
			&.show-advanced-search {
				.search-company-list {
					.compony-list {
						height: 4.78rem;
					}
				}
			}
		}
	}
}
</style>
