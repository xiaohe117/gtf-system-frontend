<template>
	<StageCardShell title="线索">
		<LeadsMetricsPanel :items="metrics" />

		<div class="top-section">
			<div class="top-title">高价值线索 TOP5</div>
			<div class="project-list">
				<CardEmptyState v-if="highValueLeads.length === 0" />
				<div
					v-for="(item, index) in highValueLeads"
					:key="`${item.name}-${index}`"
					@click="goToDetail(item)"
					class="project-item"
					:class="{ even: index % 2 === 1 }"
				>
					<div class="rank-wrap">
						<img
							v-if="index < 3"
							class="rank-medal"
							:src="rankIcons[index]"
							alt=""
						/>
						<span v-else class="rank-num">{{ index + 1 }}</span>
					</div>
					<div class="project-content">
						<EllipsisTooltip :content="item.name" flex>
							<span class="project-name">{{ item.name }}</span>
						</EllipsisTooltip>
					</div>
					<div class="project-district">{{ item.district }}</div>
				</div>
			</div>
		</div>
	</StageCardShell>
</template>

<script setup lang="ts">
import ServiceUrl from '@/utils/url';
import { queryClueCard } from '@/api/commandCenter/investmentFullProcess';
import rankIcon1 from '@/assets/images/investmentFullProcess/first.png';
import rankIcon2 from '@/assets/images/investmentFullProcess/second.png';
import rankIcon3 from '@/assets/images/investmentFullProcess/third.png';
import { formatDisplayValue, formatLabeledPercent } from '../format';
import { toQueryDept } from '../deptTree';
import LeadsMetricsPanel from './LeadsMetricsPanel.vue';
import StageCardShell from './StageCardShell.vue';
import CardEmptyState from './CardEmptyState.vue';
import EllipsisTooltip from './EllipsisTooltip.vue';

const queryDateRange = inject<any>('investmentQueryDateRange');
const dept = inject<any>('investmentDept');

type MetricItem = {
	label: string;
	value: string;
	unit?: string;
	change?: string;
};

const defaultMetrics: MetricItem[] = [
	{ label: '总线索', value: '-', unit: '条' },
	{ label: '有效', value: '-', unit: '条' },
	{ label: '本周新增有效线索', value: '-', unit: '条' },
	{ label: '意向投资额', value: '-', unit: '亿元' },
];

const metrics = ref<MetricItem[]>([...defaultMetrics]);
const highValueLeads = ref<any[]>([]);

const rankIcons = [rankIcon1, rankIcon2, rankIcon3];

const mapTopList = (list: any[] = []) =>
	(list ?? [])
		.filter((item) => item != null)
		.map((item) => ({
			name: item.name ?? '',
			district: item.street ?? '',
			clueId: item.clueId ?? '',
		}));

const fetchData = async () => {
	const range = queryDateRange?.value;
	if (!range) return;

	try {
		const res: any = await queryClueCard({
			startTime: range[0],
			endTime: range[1],
			dept: toQueryDept(dept?.value),
		});
		const data = res?.data ?? {};

		metrics.value = [
			{ label: '总线索', value: formatDisplayValue(data.allClueTimes), unit: '条' },
			{
				label: '有效',
				value: formatDisplayValue(data.validClueTimes),
				unit: '条',
				change: formatLabeledPercent(data.rate, '占比'),
			},
			{
				label: '本周新增有效线索',
				value: formatDisplayValue(data.weekClueTimes),
				unit: '条',
				change: formatLabeledPercent(data.weekRate, '环比'),
			},
			{ label: '意向投资额', value: formatDisplayValue(data.investAmount), unit: '亿元' },
		];
		highValueLeads.value = mapTopList(data.tops);
	} catch {
		metrics.value = [...defaultMetrics];
		highValueLeads.value = [];
	}
};

// 跳转齐明线索详情
const goToDetail = (item: any) => {
	window.open(
		`${ServiceUrl.getLoginUrl()}/pc/projectManage/clue/create?pageAction=view&clueId=${item.clueId}`,
		'_blank'
	);
};

watch([queryDateRange, dept], fetchData, { immediate: true, deep: true });
</script>

<style lang="less" scoped>
:deep(.leads-metrics) {
	flex-shrink: 0;
}

.top-section {
	display: flex;
	flex: 1;
	flex-direction: column;
	min-width: 0;
	min-height: 0;
}

.top-title {
	flex-shrink: 0;
	margin-bottom: 0.02rem;
	font-weight: 600;
	font-size: 0.17rem;
	line-height: 0.27rem;
	color: rgba(0, 0, 0, 0.88);
}

.project-list {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
	gap: 0.02rem;
	overflow-x: hidden;
	overflow-y: auto;

	&::-webkit-scrollbar {
		width: 0.04rem;
	}

	&::-webkit-scrollbar-thumb {
		background: rgba(22, 93, 255, 0.35);
		border-radius: 0.02rem;
	}

	&::-webkit-scrollbar-track {
		background: transparent;
	}
}

.project-item {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	gap: 0.06rem;
	height: 0.28rem;
	padding: 0 0.06rem;
	border-radius: 0.02rem;
	background: rgba(245, 248, 255, 0.9);

	&.even {
		background: transparent;
	}
}

.rank-wrap {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	justify-content: center;
	width: 0.18rem;
	height: 0.18rem;
}

.rank-medal {
	width: 0.18rem;
	height: 0.18rem;
	object-fit: contain;
}

.rank-num {
	font-weight: bold;
	font-size: 0.12rem;
	line-height: 0.18rem;
	color: #165dff;
}

.project-content {
	display: flex;
	align-items: center;
	flex: 1;
	min-width: 0;
	overflow: hidden;
}

.project-name {
	display: block;
	width: 100%;
	overflow: hidden;
	font-weight: 400;
	font-size: 0.13rem;
	line-height: 0.2rem;
	color: #333333;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.project-district {
	flex-shrink: 0;
	font-weight: 400;
	font-size: 0.12rem;
	line-height: 0.18rem;
	color: rgba(0, 0, 0, 0.45);
}
</style>
