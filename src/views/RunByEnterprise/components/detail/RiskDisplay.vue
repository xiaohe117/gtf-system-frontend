<template>
	<div class="risk-section" v-if="shouldShowRisk(riskType)">
		<div class="dot-title fx-r">
			<span class="dot">·</span>
			<span class="title">{{ riskConfigs[riskType].label }}</span>
		</div>
		<div class="desc-box">
			<el-descriptions :column="2" :border="true" label-width="1.35rem">
				<el-descriptions-item
					v-for="[field, config] in getFieldEntries(riskType)"
					:key="field"
					:label="config.label"
					:span="config.span || 1"
				>
					<span :class="config.extraClass">
						{{ formatValue(riskData[riskType][field], config) }}
					</span>
				</el-descriptions-item>
			</el-descriptions>
		</div>

		<!-- <div v-else class="empty-tip">暂无相关数据</div> -->
	</div>
</template>

<script setup lang="ts">
import riskConfigs from './riskConfigs';

const props = defineProps<{
	riskType: any;
	riskData: any;
}>();

const hasValue = (value: any) => value !== undefined && value !== null && value !== '';

const getFieldEntries = (riskType: string): any[] => Object.entries(riskConfigs[riskType].fields);

const shouldShowRisk = (riskType: string) => {
	const config = riskConfigs[riskType];
	if (config.showIfEmpty) return true;
	return getFieldEntries(riskType).some(([field]) => hasValue(props.riskData[riskType]?.[field]));
};

const formatValue = (value: any, config: any) => {
	if (!hasValue(value)) return '-';
	return config.formatter?.(value) ?? value;
};
</script>

<style lang="less" scoped>
.dot-title {
	align-items: center;
	margin-bottom: 0.08rem;
	.dot {
		font-weight: 400;
		font-size: 0.24rem;
		color: #111111;
		line-height: 0.24rem;
	}
	.title {
		padding-left: 0.05rem;
		font-weight: 600;
		font-size: 0.14rem;
		color: #111111;
		line-height: 0.24rem;
	}
}
.desc-box {
	margin-bottom: 0.12rem;
	// height: 3.2rem;
	.el-descriptions {
		--el-descriptions-table-border: 0.01rem solid #aaccff;
	}

	:deep(.el-descriptions__cell) {
		height: 0.4rem;
		padding: 0;
		&.el-descriptions__label {
			background: #e4f1ff;
			padding-left: 0.18rem;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.85);
			line-height: 0.2rem;
		}
		&.el-descriptions__content {
			padding-left: 0.18rem;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.6);
			line-height: 0.18rem;
			.company {
				color: #165dff;
			}
		}
	}
}
.empty-tip {
	text-align: center;
	padding: 0.1rem;
	border: 0.01rem solid #aaccff;
}
</style>
