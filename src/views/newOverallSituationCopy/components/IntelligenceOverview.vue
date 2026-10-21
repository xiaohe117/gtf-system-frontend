<template>
	<FrameBox class="module-frame intelligence-frame">
		<section class="module intelligence-overview">
			<header class="module-header compact-header">
				<div
					class="tabs-item"
					:class="{ active: activeHeaderTab === 'intelligence' }"
					@click="activeHeaderTab = 'intelligence'"
				>
					<span class="module-title">招商情报</span>
					<div v-show="activeHeaderTab === 'intelligence'" class="title-bg"></div>
				</div>
				<div
					@click="goIndustryOverview"
					class="tabs-item tabs-item-industry"
					:class="{ active: activeHeaderTab === 'industry' }"
				>
					<span class="module-title">按产业分</span>
					<div v-show="activeHeaderTab === 'industry'" class="title-bg"></div>
				</div>
				<div class="go-btn">
					<img
						@click="clickParent('intelligenceOverview')"
						src="@/views/newOverallSituationCopy/image/more.png"
						alt=""
					/>
				</div>
			</header>

			<div class="info-tabs">
				<span
					class="info-tabs-item"
					:class="{ active: activeInfoTab === 'meeting' }"
					@click="handleInfoTabClick('meeting')"
					>高层会见</span
				>
				<span
					class="info-tabs-item"
					:class="{ active: activeInfoTab === 'news' }"
					@click="handleInfoTabClick('news')"
					>企业资讯</span
				>
			</div>
			<div
				class="info-list"
				:class="{ 'meeting-info-list': activeInfoTab === 'meeting' }"
				v-loading="activeInfoTab === 'news' && isInfoLoading"
				element-loading-background="rgba(255, 255, 255, 0.72)"
				element-loading-text="加载中..."
			>
				<template v-if="activeInfoTab === 'meeting'">
					<!-- 广东省：独立 loading / 空态 -->
					<div class="meeting-group">
						<div class="info-source-label">广东省</div>
						<div
							class="meeting-list"
							v-loading="guangdongLoading"
							element-loading-background="rgba(255, 255, 255, 0.72)"
							element-loading-text="加载中..."
						>
							<div
								v-if="
									!otherProvinceLoading && otherProvinceMeetingList.length === 0
								"
								class="module-empty meeting-empty"
							>
								<img
									src="@/assets/images/IntelligenceOverview/emty.webp"
									class="module-empty-image"
									alt=""
								/>
								<div class="module-empty-text">暂无数据</div>
							</div>
							<a
								v-for="(item, index) in guangdongMeetingList"
								:key="item.id || `guangdong-${item.title}-${index}`"
								class="info-item"
								:href="item.link"
								target="_blank"
							>
								<el-tooltip
									:content="item.tag"
									placement="top"
									:show-after="500"
									popper-class="my-tip"
								>
									<span class="info-tag">
										{{ truncateTag(item.tag) }}
									</span>
								</el-tooltip>
								<el-tooltip
									:content="item.title"
									placement="top"
									:show-after="500"
									popper-class="my-tip"
								>
									<p class="title-text">{{ item.title }}</p>
								</el-tooltip>
								<time class="date-text">{{ item.date }}</time>
							</a>
						</div>
					</div>

					<!-- 其他省市：独立 loading / 空态 -->
					<div class="meeting-group">
						<div class="info-source-label secondary">其他省市</div>
						<div
							class="meeting-list"
							v-loading="otherProvinceLoading"
							element-loading-background="rgba(255, 255, 255, 0.72)"
							element-loading-text="加载中..."
						>
							<div
								v-if="
									!otherProvinceLoading && otherProvinceMeetingList.length === 0
								"
								class="module-empty meeting-empty"
							>
								<img
									src="@/assets/images/IntelligenceOverview/emty.webp"
									class="module-empty-image"
									alt=""
								/>
								<div class="module-empty-text">暂无数据</div>
							</div>
							<a
								v-for="(item, index) in otherProvinceMeetingList"
								:key="item.id || `other-${item.title}-${index}`"
								class="info-item"
								:href="item.link"
								target="_blank"
							>
								<el-tooltip
									:content="item.tag"
									placement="top"
									:show-after="500"
									popper-class="my-tip"
								>
									<span class="info-tag">{{ truncateTag(item.tag) }}</span>
								</el-tooltip>
								<el-tooltip
									:content="item.title"
									placement="top"
									:show-after="500"
									popper-class="my-tip"
								>
									<p class="title-text">{{ item.title }}</p>
								</el-tooltip>
								<time class="date-text">{{ item.date }}</time>
							</a>
						</div>
					</div>
				</template>

				<template v-else>
					<div v-if="!isInfoLoading && infoList.length === 0" class="module-empty">
						<img
							src="@/assets/images/IntelligenceOverview/emty.webp"
							class="module-empty-image"
							alt=""
						/>
						<div class="module-empty-text">暂无数据</div>
					</div>
					<a
						:href="item.url"
						target="_blank"
						v-for="(item, index) in infoList"
						:key="item.id || `${item.title}-${index}`"
						class="info-item"
					>
						<el-tooltip
							:content="item.tag"
							placement="top"
							:show-after="500"
							popper-class="my-tip"
						>
							<span class="info-tag">
								{{ truncateTag(item.tag) }}
							</span>
						</el-tooltip>
						<el-tooltip
							:content="item.title"
							placement="top"
							:show-after="500"
							popper-class="my-tip"
						>
							<p class="title-text">{{ item.title }}</p>
						</el-tooltip>
					</a>
				</template>
			</div>
		</section>
	</FrameBox>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
	getleadervisitGDList,
	getleadervisitNGDList,
	getsentimentdynamiclList,
} from '@/api/Intelligence/index';
import { onMounted, ref } from 'vue';
import useClickParent from '../composables/useClickParent';

// 页面路由实例
const router = useRouter();

// 父级菜单跳转方法
const { clickParent } = useClickParent();

// 标签过长时截断展示
const truncateTag = (tag: string) => {
	if (!tag) return '';
	return tag.length > 4 ? `${tag.slice(0, 4)}...` : tag;
};

// 情报列表 tab 类型
type InfoTabKey = 'news' | 'meeting';

// 页面统一展示的情报项
type InfoItem = {
	id?: number | string;
	tag: string;
	title: string;
	date: string;
	url?: string;
	link?: string;
};

// 兼容不同接口返回的列表包装结构
type ApiListData<T> =
	| T[]
	| {
			records?: T[];
			rows?: T[];
			list?: T[];
	  };

// 企业资讯接口原始字段
type SentimentDynamicApiItem = {
	id?: number | string;
	pubTime?: string;
	title?: string;
};

// 高层会见接口原始字段
type LeaderVisitApiItem = {
	id?: number | string;
	authorName?: string;
	title?: string;
	createdAt?: string;
	link: string;
};

// 顶部主 tab 选中状态
const activeHeaderTab = ref('intelligence');
// 情报列表 tab 选中状态
const activeInfoTab = ref<InfoTabKey>('meeting');
// 企业资讯列表
const infoList = ref<InfoItem[]>([]);
// 广东省高层会见列表
const guangdongMeetingList = ref<InfoItem[]>([]);
// 其他省市高层会见列表
const otherProvinceMeetingList = ref<InfoItem[]>([]);
// 企业资讯加载状态
const isInfoLoading = ref(false);
// 广东省 / 其他省市各自独立 loading（不共用）
const guangdongLoading = ref(false);
const otherProvinceLoading = ref(false);
// 企业资讯请求序号，防止旧请求覆盖新数据
let infoRequestId = 0;
// 高层会见请求序号，防止切换 tab 时旧请求回写
let meetingRequestId = 0;

// 进入按产业分类页面
const goIndustryOverview = () => {
	router.push({ name: 'classifiedByIndustry'});
};

// 接口列表统一转成数组（兼容 data 直接是数组，或 records/rows/list 包装）
function getApiList<T>(data: ApiListData<T> | null | undefined): T[] {
	if (Array.isArray(data)) return data;
	if (data && typeof data === 'object') {
		return data.records || data.rows || data.list || [];
	}
	return [];
}

// 是否业务成功（兼容 code 为 number/string）
const isSuccessCode = (code: unknown) => Number(code) === 0;

// 日期只展示年月日（兼容 null / 非字符串，避免 .slice 抛错导致整表清空）
const formatDate = (value?: string | null) => String(value ?? '').slice(0, 10);

// 企业资讯接口数据转页面字段
const normalizeSentimentInfo = (item: any): InfoItem => ({
	id: item.id,
	tag: item.source || '-',
	title: item.title || '-',
	date: formatDate(item.pubTime),
	url: item.url,
});

// 高层会见接口数据转页面字段（单条转换做空值兜底，避免脏数据导致整表不显示）
const normalizeLeaderVisitInfo = (item: LeaderVisitApiItem | null | undefined): InfoItem | null => {
	if (!item || typeof item !== 'object') return null;
	return {
		id: item.id,
		tag: item.authorName || '-',
		title: item.title || '-',
		date: formatDate(item.createdAt),
		link: item.link || '',
	};
};

// 1）先完整接收接口 data 并归一化  2）再对结果取前 30 条
const buildLeaderVisitList = (res: {
	code?: unknown;
	data?: ApiListData<LeaderVisitApiItem>;
}): InfoItem[] => {
	// 业务失败直接空列表
	if (!isSuccessCode(res?.code)) return [];

	// 第一步：完整接收接口返回的列表数据
	const rawList = getApiList(res.data);

	// 第二步：逐条归一化（过滤无效项，保证不因单条脏数据中断）
	const fullList = rawList
		.map((item) => normalizeLeaderVisitInfo(item))
		.filter((item): item is InfoItem => item !== null);

	// 第三步：只取前 30 条给页面展示
	return fullList.slice(0, 30);
};

// 获取广东省高层会见列表（独立 loading）
const getLeaderVisitGDInfoList = async (requestId: number) => {
	guangdongLoading.value = true;
	try {
		const res = await getleadervisitGDList<ApiListData<LeaderVisitApiItem>>();
		if (requestId !== meetingRequestId || activeInfoTab.value !== 'meeting') return;

		// 先拿到完整处理后的前 30 条，再赋值，避免链式操作中间态导致不显示
		const list = buildLeaderVisitList(res);
		guangdongMeetingList.value = list;
	} catch {
		if (requestId !== meetingRequestId || activeInfoTab.value !== 'meeting') return;
		guangdongMeetingList.value = [];
	} finally {
		if (requestId === meetingRequestId) {
			guangdongLoading.value = false;
		}
	}
};

// 获取其他省市高层会见列表（独立 loading）
const getLeaderVisitNGDInfoList = async (requestId: number) => {
	otherProvinceLoading.value = true;
	try {
		const res = await getleadervisitNGDList<ApiListData<LeaderVisitApiItem>>();
		if (requestId !== meetingRequestId || activeInfoTab.value !== 'meeting') return;

		// 先拿到完整处理后的前 30 条，再赋值，避免链式操作中间态导致不显示
		const list = buildLeaderVisitList(res);
		otherProvinceMeetingList.value = list;
	} catch {
		if (requestId !== meetingRequestId || activeInfoTab.value !== 'meeting') return;
		otherProvinceMeetingList.value = [];
	} finally {
		if (requestId === meetingRequestId) {
			otherProvinceLoading.value = false;
		}
	}
};

// 并行请求两组高层会见（各自 loading，互不影响）
const getMeetingInfoList = async () => {
	meetingRequestId += 1;
	const requestId = meetingRequestId;
	await Promise.all([getLeaderVisitGDInfoList(requestId), getLeaderVisitNGDInfoList(requestId)]);
};

// 获取企业资讯列表
const getSentimentInfoList = async () => {
	const res = await getsentimentdynamiclList<ApiListData<SentimentDynamicApiItem>>({
		pageNum: 1,
		pageSize: 30,
	});
	return isSuccessCode(res.code) ? getApiList(res.data).map(normalizeSentimentInfo) : [];
};

// 加载企业资讯 tab 数据
const getInfoList = async () => {
	// 每次请求前递增序号，用来识别最新请求
	infoRequestId += 1;
	const requestId = infoRequestId;

	// 切换 tab 时先清空旧列表并展示 loading
	isInfoLoading.value = true;
	infoList.value = [];

	try {
		const list = await getSentimentInfoList();

		// 只允许最新请求写回当前 tab
		if (requestId === infoRequestId && activeInfoTab.value === 'news') {
			infoList.value = list;
		}
	} catch {
		// 接口异常时也只处理最新请求
		if (requestId === infoRequestId && activeInfoTab.value === 'news') {
			infoList.value = [];
		}
	} finally {
		// loading 也只由最新请求关闭
		if (requestId === infoRequestId && activeInfoTab.value === 'news') {
			isInfoLoading.value = false;
		}
	}
};

// 处理情报列表 tab 切换：点击高层会见时重新请求 GD / NGD 两个接口
const handleInfoTabClick = (tabKey: InfoTabKey) => {
	activeInfoTab.value = tabKey;
	if (tabKey === 'news') {
		getInfoList();
	} else {
		getMeetingInfoList();
	}
};

// 默认加载高层会见两组列表
onMounted(() => {
	getMeetingInfoList();
});
</script>

<style lang="less" scoped>
@import './moduleCommon.less';

a {
	text-decoration: none;
	color: inherit;
}

.intelligence-frame {
	min-height: 0;
	overflow: hidden;

	:deep(.outside-content) {
		min-height: 0;
		overflow: hidden;
		box-shadow: none;
		padding: clamp(0.07rem, 0.9vh, 0.12rem) clamp(0.09rem, 0.9vw, 0.16rem)
			clamp(0.1rem, 1.2vh, 0.2rem) clamp(0.12rem, 1.2vw, 0.2rem);
	}

	:deep(.outside-content > div) {
		min-height: 0;
		overflow: hidden;
	}

	.intelligence-overview {
		min-height: 0;
		overflow: hidden;

		.compact-header {
			display: flex;
			align-items: center;
			gap: clamp(0.08rem, 0.8vw, 0.12rem);

			.tabs-item {
				position: relative;
				--info-title-tab-height: clamp(0.36rem, 4.4vh, 0.46rem);

				width: clamp(1.45rem, 9vw, 1.8rem);
				height: var(--info-title-tab-height);
				cursor: pointer;

				&.active {
					background: url('../image/step-base.png') left top / 1rem 74% no-repeat;
				}

				.module-title {
					font-family: AlimamaShuHeiTi;
					font-weight: bold;
					font-size: clamp(0.18rem, 2.3vh, 0.24rem);
					line-height: var(--info-title-tab-height);
					text-align: left;
					padding-left: 0.22rem;
					margin-right: 0;
					color: rgba(78, 89, 105, 0.51);
					text-shadow: 2px 2px 0px #ffffff;
					background: unset;
				}

				&.active .module-title,
				&:hover .module-title {
					background: linear-gradient(180deg, #4f98ff 0%, #1936a9 100%);
					-webkit-background-clip: text;
					background-clip: text;
					color: transparent;
					text-shadow: none;
				}

				.title-bg {
					position: absolute;
					inset: 0;
					pointer-events: none;
				}
			}
			.tabs-item-industry {
				margin-left: -0.72rem;
			}
			.go-btn {
				width: clamp(0.82rem, 5.3vw, 1rem);
				height: clamp(0.2rem, 2.4vh, 0.26rem);
				cursor: pointer;
				img {
					width: 100%;
					height: 100%;
					object-fit: contain;
				}
			}
		}
	}
	.info-tabs {
		display: flex;
		align-items: center;
		gap: 0.12rem;
		flex-shrink: 0;
		margin: 0.02rem 0;
		.info-tabs-item {
			display: flex;
			align-items: center;
			justify-content: center;
			width: clamp(1.08rem, 7vw, 1.28rem);
			height: clamp(0.26rem, 3.2vh, 0.3rem);
			background-image: url('../image/pill-gray-mask.png');
			background-size: 100% 100%;
			background-position: center;
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 600;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.65);
			cursor: pointer;
			&.active {
				color: #fff;
				background-image: url('../image/pill-blue-mask.png');
			}
		}
	}

	.info-list {
		position: relative;
		display: flex;
		flex-direction: column;
		gap: clamp(0.04rem, 1.3vh, 0.04rem);
		flex: 1 1 0;
		height: 0;
		min-height: 0;
		overflow-y: auto;
		overflow-x: hidden;

		&.meeting-info-list {
			overflow: hidden;
		}

		.module-empty {
			display: flex;
			flex: 1 1 0;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 0.08rem;
			min-height: 1.2rem;
		}

		.meeting-empty {
			flex: 1 1 auto;
			width: 100%;
			min-height: 100%;
			height: 100%;
			box-sizing: border-box;
		}

		.module-empty-image {
			width: 0.72rem;
			height: 0.72rem;
			object-fit: contain;
		}

		.module-empty-text {
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.45);
		}
		.meeting-group {
			display: grid;
			grid-template-columns: 0.3rem minmax(0, 1fr);
			align-items: stretch;
			flex: 1 1 0;
			min-width: 0;
			min-height: 0;
		}
		.info-source-label {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 0.3rem;
			min-height: 100%;
			border-radius: 0.07rem 0 0 0.07rem;
			background: #1598ff;
			color: #fff;
			font-family:
				PingFangSC,
				PingFang SC;
			font-size: clamp(0.13rem, 1.55vh, 0.16rem);
			font-weight: 700;
			line-height: 1.05;
			letter-spacing: 0;
			text-align: center;
			writing-mode: vertical-rl;
			text-orientation: upright;
			white-space: nowrap;
		}
		.info-source-label.secondary {
			background: #9fc4fb;
		}
		.meeting-list {
			position: relative;
			display: flex;
			flex-direction: column;
			gap: 0.06rem;
			min-width: 0;
			min-height: 0;
			padding: 0.02rem 0;
			border: 0.01rem solid #168dff;
			border-left: 0;
			border-radius: 0 0.08rem 0.08rem 0;
			overflow-y: auto;
			overflow-x: hidden;

			// loading 整体上移 0.5rem
			:deep(.el-loading-spinner) {
				margin-top: -0.4rem;
			}
		}
		.info-item {
			display: flex;
			align-items: center;
			flex-shrink: 0;
			padding: 0.02rem 0.08rem;
			background: rgba(169, 181, 255, 0.1);
			border-radius: 1rem 0.18rem 0.18rem 1rem;
			.info-tag {
				display: flex;
				justify-content: center;
				width: 0.76rem;
				height: 0.24rem;
				font-family:
					PingFangSC,
					PingFang SC;
				font-size: 0.12rem;
				color: #266fe8;
				padding-top: 0.02rem;
				border: 0.01rem solid #1982ff;
				border-radius: 0.12rem;
				flex-shrink: 0;
			}
			.title-text {
				flex: 1 1 auto;
				min-width: 0;
				font-family:
					PingFangSC,
					PingFang SC;
				font-size: 0.14rem;
				color: #4b4b4b;
				padding: 0 0.1rem 0 0.08rem;
				overflow: hidden;
				text-overflow: ellipsis;
				white-space: nowrap;
			}
			.date-text {
				flex: 0 0 0.92rem;
				margin-left: auto;
				font-family: PingFangHK;
				font-size: 0.14rem;
				color: #5e5e5e;
				text-align: right;
				white-space: nowrap;
			}
		}
	}
}
:global(.el-popper.my-tip) {
	background: #ffffff !important;
	color: #000000 !important;
	border: 0.01rem solid rgba(0, 0, 0, 0.12) !important;
	box-shadow: 0 0.04rem 0.12rem rgba(0, 0, 0, 0.12) !important;
}
:global(.el-popper.my-tip .el-popper__arrow::before) {
	background: #ffffff !important;
	border-color: rgba(0, 0, 0, 0.12) !important;
}
</style>
