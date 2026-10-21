<template>
	<div ref="rootRef" v-loading="loading" class="analysis-suggest">
		<div class="left-col">
			<div class="section-block">
				<BlockTitle>产业重点招引方向</BlockTitle>
				<div class="block-content">
					<RichText
						v-if="analySuggestData.detechTeam"
						:html="analySuggestData.detechTeam"
						class="rich-text"
					></RichText>
					<EmptyData v-else />
				</div>
			</div>
			<div class="section-block">
				<BlockTitle>产业材料（{{ materialList.length }}）</BlockTitle>
				<div class="block-content">
					<el-table :data="materialList" class="material-table" stripe>
						<el-table-column
							type="index"
							label="序号"
							:min-width="columnWidths.index"
							align="center"
						/>
						<el-table-column label="材料名称" :min-width="columnWidths.name">
							<template #default="{ row }">
								<el-tooltip
									:content="row.fileName + '.' + row.fileSuffix"
									placement="top"
									effect="dark"
									:disabled="!overflowingIds.has(row.id)"
								>
									<a
										@click="() => handlePre(row.previewUrl)"
										class="name-link"
										:data-id="row.id"
									>
										{{ row.fileName }}.{{ row.fileSuffix }}
									</a>
								</el-tooltip>
							</template>
						</el-table-column>
						<el-table-column label="上传时间" :min-width="columnWidths.time">
							<template #default="{ row }">
								{{ formatDate(row.createTime) }}
							</template>
						</el-table-column>
					</el-table>
				</div>
			</div>
		</div>
		<div class="right-col">
			<div class="section-block">
				<BlockTitle>产业分析建议</BlockTitle>
				<div class="block-content">
					<div class="sub-block">
						<div class="sub-label">
							<span class="vertical-text">存在问题</span>
						</div>
						<div class="sub-body">
							<RichText
								v-if="analySuggestData.existingProblem"
								:html="analySuggestData.existingProblem"
								class="rich-text"
							></RichText>
							<EmptyData v-else />
						</div>
					</div>
					<div class="sub-block">
						<div class="sub-label">
							<span class="vertical-text">下一步计划</span>
						</div>
						<div class="sub-body">
							<RichText
								v-if="analySuggestData.nextPlan"
								:html="analySuggestData.nextPlan"
								class="rich-text"
							></RichText>
							<EmptyData v-else />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue';
import dayjs from 'dayjs';
import ServiceUrl from '@/utils/url';
import { analySuggestList, analySuggestMaterialList } from '@/api/industry';
import BlockTitle from '@/views/CommandCenter/ClassifiedByIndustry/components/BlockTitle.vue';
import EmptyData from '@/views/CommandCenter/ClassifiedByIndustry/components/EmptyData.vue';
import RichText from './RichText.vue';
import type { MaterialItem, AnalySuggestItem } from '../type';

const props = defineProps({
	industryCode: {
		type: String,
		default: '',
	},
});
/* 表格宽度适配 start */
const rootRef = ref<HTMLElement | null>(null);
const windowWidth = ref(window.innerWidth);

const materialList = ref<MaterialItem[]>([]);
const overflowingIds = ref<Set<string>>(new Set());

const measureNameOverflow = () => {
	const ids = new Set<string>();
	const links = rootRef.value?.querySelectorAll<HTMLElement>('.material-table .name-link');
	links?.forEach((link) => {
		if (link.scrollWidth > link.clientWidth) {
			const { id } = link.dataset;
			if (id) {
				ids.add(id);
			}
		}
	});
	overflowingIds.value = ids;
};

let resizeRaf = 0;

const onResize = () => {
	if (resizeRaf) window.cancelAnimationFrame(resizeRaf);
	resizeRaf = window.requestAnimationFrame(() => {
		resizeRaf = 0;
		windowWidth.value = window.innerWidth;
		measureNameOverflow();
	});
};

const columnWidths = computed(() => {
	const w = windowWidth.value;
	const ratio = w <= 1440 ? 1 : w / 1440;
	return {
		index: Math.round(80 * ratio),
		name: Math.round(250 * ratio),
		time: Math.round(120 * ratio),
	};
});
/* 表格宽度适配 end */

const formatDate = (val: string) => {
	if (!val) return '';
	const d = dayjs(val);
	return d.isValid() ? d.format('YYYY-MM-DD') : val;
};

const analySuggestDataList = ref<AnalySuggestItem[]>([]);
const analySuggestData = computed<AnalySuggestItem>(
	() => analySuggestDataList.value[0] || ({} as AnalySuggestItem)
);

const loading = ref(false);
let loadingCount = 0;

const startLoading = () => {
	loadingCount += 1;
	loading.value = true;
};

const stopLoading = () => {
	loadingCount -= 1;
	if (loadingCount <= 0) {
		loadingCount = 0;
		loading.value = false;
	}
};

const fetchAnalySuggest = async () => {
	if (!props.industryCode) {
		analySuggestDataList.value = [];
		return;
	}
	startLoading();
	try {
		const res = await analySuggestList({
			industryCode: props.industryCode,
		});
		if (res.code === 0) {
			analySuggestDataList.value = (res.data as AnalySuggestItem[]) || [];
		} else {
			analySuggestDataList.value = [];
		}
	} finally {
		stopLoading();
	}
};

const fetchMaterialList = async () => {
	if (!props.industryCode) {
		materialList.value = [];
		overflowingIds.value = new Set();
		return;
	}
	startLoading();
	try {
		const res = await analySuggestMaterialList({
			industryCode: props.industryCode,
		});
		if (res.code === 0) {
			materialList.value = (res.data as MaterialItem[]) || [];
			nextTick(() => {
				measureNameOverflow();
			});
		} else {
			materialList.value = [];
			overflowingIds.value = new Set();
		}
	} finally {
		stopLoading();
	}
};

const toBase64 = (str: string) => {
	const bytes = new TextEncoder().encode(str);
	let binary = '';
	const chunkSize = 0x8000;
	for (let i = 0; i < bytes.length; i += chunkSize) {
		binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
	}
	return btoa(binary);
};

const handlePre = (previewUrl: string) => {
	window.open(
		`${ServiceUrl.getQmSysUrl()}/view/onlinePreview?url=${encodeURIComponent(toBase64(previewUrl))}`,
		'_blank'
	);
};

watch(
	() => props.industryCode,
	() => {
		fetchAnalySuggest();
		fetchMaterialList();
	},
	{ immediate: true }
);

onMounted(() => {
	window.addEventListener('resize', onResize);
});

onUnmounted(() => {
	window.removeEventListener('resize', onResize);
});
</script>

<style lang="less" scoped>
.analysis-suggest {
	width: 100%;
	height: 100%;
	display: flex;
	gap: 0.16rem;
	padding: 0.16rem;
	box-sizing: border-box;
	overflow: hidden;

	.left-col,
	.right-col {
		flex: 1;
		min-width: 0;
		display: flex;
		flex-direction: column;
		gap: 0.16rem;
	}

	.section-block {
		display: flex;
		flex-direction: column;
		flex: 1;
		min-height: 0;

		.block-content {
			flex: 1;
			min-height: 0;
			display: flex;
			flex-direction: column;
		}
	}

	/* 产业材料 el-table */
	.material-table {
		flex: 1;
		min-height: 0;
		width: 100%;
		:deep(.el-table__header) th.el-table__cell {
			background: #165dff;
			color: #ffffff;
			font-family: MicrosoftYaHei;
			font-weight: bold;
			font-size: 0.16rem;
			border: 0.01rem solid #aaccff;
			height: 0.46rem;
			padding: 0;
		}

		:deep(.el-table__header) th.el-table__cell .cell {
			height: 0.46rem;
			line-height: 0.46rem;
		}

		:deep(.el-table__row) td.el-table__cell {
			background: #ffffff;
			color: rgba(0, 0, 0, 0.7);
			font-family: MicrosoftYaHei;
			font-size: 0.16rem;
			border: 0.01rem solid #aaccff;
			height: 0.36rem;
			padding: 0;
		}

		:deep(.el-table__row) td.el-table__cell .cell {
			height: 0.36rem;
			line-height: 0.36rem;
		}

		:deep(.el-table__row.el-table__row--striped td.el-table__cell) {
			background: #f5f8ff !important;
		}

		:deep(.el-table__row:hover td.el-table__cell) {
			background: #eaf2ff !important;
		}

		:deep(.el-table__inner-wrapper::before) {
			display: none;
		}

		.name-link {
			color: #1e6efb;
			text-decoration: none;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			display: inline-block;
			max-width: 100%;
			vertical-align: middle;
			cursor: pointer;

			&:hover {
				text-decoration: underline;
			}
		}
	}

	.rich-text {
		flex: 1;
		min-height: 0;
		overflow-y: auto;
		word-break: break-word;
		font-family: PingFangSC, 'PingFang SC';
		font-weight: 400;
		font-size: 0.16rem;
		color: rgba(0, 0, 0, 0.74);
		line-height: 0.35rem;
		text-align: justify;
		padding: 0.04rem 0.16rem;
	}

	/* 右侧子块（存在问题 / 下一步计划） */
	.right-col {
		.section-block {
			.block-content {
				gap: 0.16rem;
			}
		}

		.sub-block {
			display: flex;
			flex: 1;
			min-height: 0;
			gap: 0.08rem;
			background-image: url('@/assets/images/industry/suggest-content-bg.webp');
			background-size: 100% 100%;
			background-repeat: no-repeat;
			background-position: 0 0;
		}

		.sub-label {
			width: 0.36rem;
			flex-shrink: 0;
			display: flex;
			align-items: center;
			justify-content: center;
			border-radius: 0.06rem 0 0 0.06rem;

			.vertical-text {
				font-family: MicrosoftYaHei;
				font-weight: bold;
				font-size: 0.18rem;
				color: #ffffff;
				writing-mode: vertical-rl;
				text-orientation: upright;
				letter-spacing: 0.06rem;
				text-shadow: 0.01rem 0.01rem 0.02rem rgba(0, 0, 0, 0.3);
			}
		}

		.sub-body {
			flex: 1;
			min-width: 0;
			overflow-y: auto;
		}
	}
}
</style>
