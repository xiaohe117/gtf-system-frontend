<template>
	<StageCardShell title="会谈">
		<MeetingMetricsPanel :items="metrics" />

		<div class="section-title">推荐走访企业</div>
		<div class="enterprise-list">
			<CardEmptyState v-if="recommendEnterprises.length === 0" />
			<div
				v-for="(item, index) in recommendEnterprises"
				:key="`${item.name}-${index}`"
				@click="goDetail(item)"
				class="enterprise-item"
			>
				<div class="enterprise-top">
					<img class="enterprise-icon" :src="getIcon(item.icon)" alt="" />
					<div class="enterprise-info">
						<div class="enterprise-row">
							<EllipsisTooltip :content="item.name" flex>
								<div class="enterprise-name">{{ item.name }}</div>
							</EllipsisTooltip>
							<span class="enterprise-tag" :class="item.tagType">{{ item.tag }}</span>
						</div>
						<EllipsisTooltip :content="`所属产业 :${item.industry}`">
							<div class="enterprise-industry">所属产业 :{{ item.industry }}</div>
						</EllipsisTooltip>
					</div>
				</div>
				<EllipsisTooltip :content="item.summary">
					<div class="enterprise-summary">{{ item.summary }}</div>
				</EllipsisTooltip>
			</div>
		</div>
	</StageCardShell>
</template>

<script setup lang="ts">
import ServiceUrl from '@/utils/url';
import { queryTouchCard } from '@/api/commandCenter/investmentFullProcess';
import blueIcon from '@/assets/images/investmentFullProcess/blue-icon.png';
import yellowIcon from '@/assets/images/investmentFullProcess/yellow-icon.png';
import { formatDisplayValue, formatLabeledPercent } from '../format';
import { toQueryDept } from '../deptTree';
import MeetingMetricsPanel from './MeetingMetricsPanel.vue';
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
	{ label: '总走访', value: '-', unit: '家' },
	{ label: '意向', value: '-', unit: '家' },
	{ label: '本周新增走访', value: '-', unit: '家' },
	{ label: '意向', value: '-', unit: '家' },
];

const metrics = ref<MetricItem[]>([...defaultMetrics]);
const recommendEnterprises = ref<any[]>([]);

const iconMap: Record<string, string> = {
	'blue-icon': blueIcon,
	'yellow-icon': yellowIcon,
};

const getIcon = (icon: string) => iconMap[icon] ?? blueIcon;

const getTagType = (tag: string) => (tag.includes('智能推荐') ? 'pink' : 'green');

const mapRecommendList = (list: any[] = []) =>
	(list ?? [])
		.filter((item) => item != null)
		.map((item) => {
			const tag = item.recommendName ?? '';
			const tagType = getTagType(tag);

			return {
				name: item.companyName ?? '',
				industry: formatDisplayValue(item.industryProduct),
				tag,
				tagType,
				icon: tagType === 'pink' ? 'yellow-icon' : 'blue-icon',
				summary: item.recommendReason ?? '',
				sccode: item.sccode ?? '',
			};
		});

const fetchData = async () => {
	const range = queryDateRange?.value;
	if (!range) return;

	try {
		const res: any = await queryTouchCard({
			startTime: range[0],
			endTime: range[1],
			dept: toQueryDept(dept?.value),
		});
		const data = res?.data ?? {};

		metrics.value = [
			{ label: '总走访', value: formatDisplayValue(data.allTouch), unit: '家' },
			{
				label: '意向',
				value: formatDisplayValue(data.allTouchIdea),
				unit: '家',
				change: formatLabeledPercent(data.allRate, '占比'),
			},
			{ label: '本周新增走访', value: formatDisplayValue(data.weekTouch), unit: '家' },
			{
				label: '意向',
				value: formatDisplayValue(data.weekTouchIdea),
				unit: '家',
				change: formatLabeledPercent(data.weekRate, '占比'),
			},
		];
		recommendEnterprises.value = mapRecommendList(data.recommend);
	} catch {
		metrics.value = [...defaultMetrics];
		recommendEnterprises.value = [];
	}
};

const goDetail = (vl: any) => {
	window.open(
		`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${vl.name}&sccode=${vl.sccode}`,
		'_blank'
	);
};

watch([queryDateRange, dept], fetchData, { immediate: true, deep: true });
</script>

<style lang="less" scoped>
:deep(.long-metrics) {
	flex-shrink: 0;
}

.section-title {
	flex-shrink: 0;
	margin-bottom: 0.02rem;
	font-weight: 600;
	font-size: 0.17rem;
	line-height: 0.24rem;
	color: rgba(0, 0, 0, 0.88);
}

.enterprise-list {
	display: flex;
	flex-direction: column;
	flex: 1;
	min-width: 0;
	min-height: 0;
	gap: 0.06rem;
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

.enterprise-item {
	display: flex;
	flex-direction: column;
	flex-shrink: 0;
	justify-content: center;
	width: 100%;
	min-height: 0.76rem;
	height: 0.76rem;
	padding: 0.04rem 0.08rem;
	overflow: hidden;
	background: #f8fbff;
	border: 0.01rem solid #dcdfe6;
	border-radius: 0.05rem;
	box-shadow: 0 0.01rem 0.04rem 0 rgba(220, 223, 230, 0.58);
}

.enterprise-top {
	display: flex;
	align-items: flex-start;
	gap: 0.08rem;
	min-width: 0;
}

.enterprise-icon {
	flex-shrink: 0;
	width: 0.3rem;
	height: 0.32rem;
	object-fit: contain;
}

.enterprise-info {
	flex: 1;
	min-width: 0;
}

.enterprise-row {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 0.06rem;
}

.enterprise-name {
	flex: 1;
	min-width: 0;
	overflow: hidden;
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.22rem;
	color: #333333;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.enterprise-tag {
	flex-shrink: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	height: 0.18rem;
	padding: 0 0.04rem;
	font-weight: 400;
	font-size: 0.11rem;
	line-height: 0.16rem;
	white-space: nowrap;
	border-radius: 0.02rem;

	&.green {
		color: #00a870;
		background: #e8f8f2;
		border: 0.01rem solid rgba(0, 168, 112, 0.5);
	}

	&.pink {
		color: #e34d59;
		background: #fdecee;
		border: 0.01rem solid rgba(227, 77, 89, 0.5);
	}
}

.enterprise-industry {
	overflow: hidden;
	font-weight: 400;
	font-size: 0.13rem;
	line-height: 0.19rem;
	color: rgba(102, 102, 102, 0.51);
	text-overflow: ellipsis;
	white-space: nowrap;
}

.enterprise-summary {
	overflow: hidden;
	font-weight: 400;
	font-size: 0.14rem;
	line-height: 0.22rem;
	color: #165dff;
	text-overflow: ellipsis;
	white-space: nowrap;
}
</style>
