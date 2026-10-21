<!--
 * @Descripttion: 招商情报聚合搜索
 * @Author: opencode
 * @Date: 2026-08-18
-->
<template>
	<div class="search-header">
		<div class="search-content">
			<div class="search-main">
				<div class="search-title">招商情报聚合搜索</div>
				<div class="search-box">
					<el-input
						v-model="keyword"
						class="search-input"
						clearable
						placeholder="高层动态/企业资讯/融资动态/企业舆情/展会动态/政策动态"
						@keyup.enter="handleSearch"
					/>
					<div class="search-btn" :class="{ disabled: !canSearch }" @click="handleSearch">
						<img
							src="@/assets/images/IntelligenceOverview/searchicon.png"
							class="search-btn-icon"
							alt=""
						/>
						<span>查一下</span>
					</div>
				</div>
			</div>
			<div class="hot-row">
				<span class="hot-label">
					<span class="hot-flame"></span>
					热词搜索：
				</span>
				<div class="hot-list">
					<span
						v-for="word in hotWords"
						:key="word"
						class="hot-item"
						@click="handleHotClick(word)"
					>
						{{ word }}
					</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { gethotWord } from '@/api/Intelligence/index';
import { useRoute, useRouter } from 'vue-router';

defineProps<{
	getQxbToken: () => Promise<string>;
}>();

const emit = defineEmits<{
	search: [keyword: string];
}>();

type HotWordApiItem = {
	word?: string;
};

const router = useRouter();
const route = useRoute();
const keyword = ref(String(route.query.keyword || ''));
const hotWords = ref<string[]>([]);
const canSearch = computed(() => Boolean(keyword.value.trim()));
const isSearchPage = computed(() => route.name === 'intelligenceSearch');

const handleSearch = () => {
	if (!canSearch.value) return;
	const value = keyword.value.trim();
	const target = {
		name: 'intelligenceSearch',
		query: { keyword: value },
	};
	if (isSearchPage.value) {
		emit('search', value);
		const resolved = router.resolve(target);
		window.history.replaceState(window.history.state, '', resolved.href);
		return;
	}
	router.push(target);
};

const handleHotClick = (word: string) => {
	keyword.value = word;
	handleSearch();
};

const loadHotWords = async () => {
	try {
		const res = await gethotWord<HotWordApiItem[]>();
		const list = res.code === 0 && Array.isArray(res.data) ? res.data : [];
		hotWords.value = list
			.map((item) => item.word || '')
			.filter(Boolean)
			.slice(0, 15);
	} catch {
		hotWords.value = [];
	}
};

watch(
	() => route.query.keyword,
	(value) => {
		keyword.value = String(value || '');
	}
);

onMounted(() => {
	loadHotWords();
});
</script>

<style lang="less" scoped>
.search-header {
	flex-shrink: 0;
	width: 100%;
	min-width: 0;
	height: 1.12rem;
	padding: 0.1rem 0.2rem 0.08rem 0.2rem;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	background: url('@/assets/images/IntelligenceOverview/searchbigback.png') no-repeat center /
		100% 100%;
	border-radius: 0.12rem;
	overflow: hidden;
}

.search-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.08rem;
	min-width: 0;
}

.search-main {
	display: flex;
	align-items: center;
	gap: 0.2rem;
	min-width: 0;
}

.search-title {
	flex-shrink: 0;
	font-size: 0.28rem;
	font-weight: 800;
	line-height: 0.38rem;
	color: #fff;
	letter-spacing: 0.01rem;
	white-space: nowrap;
	text-shadow: 0 0.02rem 0.06rem rgba(20, 80, 180, 0.28);
	font-family: AlimamaShuHeiTi;
	font-size: 0.28rem;
	color: #ffffff;
	line-height: 0.42rem;
	text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
	text-align: left;
	font-style: normal;
}

.search-box {
	position: relative;
	flex: 0 0 6.8rem;
	width: 6.8rem;
	height: 0.44rem;
	display: flex;
	align-items: center;
	padding: 0 0.08rem 0 0.22rem;
	box-sizing: border-box;
}

.search-input {
	position: relative;
	z-index: 1;
	flex: 1;
	min-width: 0;
	height: 100%;
	background-color: white;
	border-radius: 0.26rem;
	padding-left: 0.2rem;
	:deep(.el-input__wrapper) {
		height: 100%;
		padding: 0;
		background: transparent;
		box-shadow: none;
		border: none;
	}

	:deep(.el-input__inner) {
		height: 100%;
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 400;
		font-size: 0.16rem;
		color: #356cf4;
		line-height: 0.3rem;
		font-style: normal;

		&::placeholder {
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 400;
			font-size: 0.16rem;
			color: #356cf4;
			line-height: 0.3rem;
			font-style: normal;
		}
	}

	:deep(.el-input__suffix) {
		display: flex;
		align-items: center;
		margin-right: 0.3rem;
		color: #080808;
	}

	:deep(.el-input__clear) {
		font-size: 0.16rem;
		color: #b7c6e0;
	}
}

.search-btn {
	position: relative;
	z-index: 1;
	flex-shrink: 0;
	display: flex;
	width: 1.5rem;
	left: -0.3rem;
	// top: 0.01rem;
	align-items: center;
	justify-content: center;
	gap: 0.04rem;
	height: 100%;
	padding: 0 0.16rem 0 0.08rem;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.18rem;
	color: #165dff;
	line-height: 0.24rem;
	font-style: normal;
	cursor: pointer;
	white-space: nowrap;
	background: url('@/assets/images/IntelligenceOverview/searchback.png') no-repeat center / 100%
		100%;

	&.disabled {
		cursor: not-allowed;
	}
}

.search-btn-icon {
	width: 0.18rem;
	height: 0.18rem;
	object-fit: contain;
}

.hot-row {
	display: flex;
	align-items: center;
	min-width: 0;
	height: 0.22rem;
}

.hot-label {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	font-size: 0.14rem;
	font-weight: 600;
	color: #fff;
	white-space: nowrap;
}

.hot-flame {
	width: 0.2rem;
	height: 0.2rem;
	margin-right: 0.04rem;
	background: url('@/assets/images/IntelligenceOverview/hot-icon.png') no-repeat center / 100%
		100%;
}

.hot-list {
	flex: 1;
	min-width: 0;
	display: flex;
	align-items: center;
	justify-content: space-around;
	overflow: hidden;
	margin: 0 0.01rem;
}

.hot-item {
	flex-shrink: 0;
	font-size: 0.13rem;
	line-height: 0.2rem;
	color: rgba(255, 255, 255, 0.92);
	cursor: pointer;
	white-space: nowrap;

	&:hover {
		color: #fff;
		text-decoration: underline;
	}
}
</style>
