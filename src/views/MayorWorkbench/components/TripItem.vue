<template>
	<div class="trip-item" @click="goEntDetail">
		<div class="header-row">
			<el-checkbox @click.stop v-model="checked" @change="handleCheck" />
			<span class="company-name">
				<EllipsisText :text="emptyPlaceholder(item.companyName)" :lines="1" />
			</span>
			<template v-if="file.fileUrl">
				<a class="pdf-link" @click.stop="openFile" :href="file.fileUrl" target="_blank">
					<img src="@/assets/images/mayorWorkbench/file-icon.png" alt="" />
					<span class="file-name">
						<EllipsisText :text="file.fileName" :lines="1" />
					</span>
				</a>
			</template>
			<span class="status-tag" :class="statusClass">{{ statusLabel }}</span>
		</div>

		<div class="detail-grid">
			<div class="detail-cell">
				<div class="label">提请：</div>
				<div class="value">
					<EllipsisText :text="emptyPlaceholder(item.submitUnit)" :lines="1" />
				</div>
			</div>

			<div class="detail-cell">
				<div class="label">所属产业：</div>
				<div class="value">
					<EllipsisText :text="emptyPlaceholder(item.industry)" :lines="1" />
				</div>
			</div>

			<div class="detail-cell">
				<div class="label">最新对接：</div>
				<div class="value">
					<EllipsisText :text="emptyPlaceholder(item.latestDockContent)" :lines="1" />
				</div>
			</div>
		</div>
		<div class="detail-grid">
			<div class="detail-cell">
				<div class="label">招商线索：</div>
				<div class="value">
					<span class="highlight">{{ emptyPlaceholder(item.clueCount) }}</span> 条<span
						class="amount"
						>（
						<span class="highlight">{{ emptyPlaceholder(item.clueAmount) }}</span>
						亿元）</span
					>
				</div>
			</div>
			<div class="detail-cell">
				<div class="label">落地项目：</div>
				<div class="value">
					<span class="highlight">{{ emptyPlaceholder(item.projectCount) }}</span> 条<span
						class="amount"
						>（
						<span class="highlight">{{ emptyPlaceholder(item.projectAmount) }}</span>
						亿元）
					</span>
				</div>
			</div>
			<div class="detail-cell">
				<div class="label">议定事项：</div>
				<div class="value">
					<span class="highlight">{{ emptyPlaceholder(item.agreedCount) }}</span> 个<span
						class="amount"
						>（ 已完成：<span class="highlight">{{
							emptyPlaceholder(item.agreedDoneCount)
						}}</span>
						个）</span
					>
				</div>
			</div>
		</div>

		<!-- 已重点督办标签-->
		<div v-if="isHandled" class="handled-mark">
			<img src="@/assets/images/mayorWorkbench/key-supervision.png" alt="" />
		</div>
	</div>
</template>

<script lang="ts" setup>
import { emptyPlaceholder } from '@/utils/form';
import ServiceUrl from '@/utils/url';
import type { TripItem } from '../types';

const props = defineProps<{
	item: TripItem;
	modelValue?: boolean;
}>();

const emit = defineEmits<{
	'update:modelValue': [val: boolean];
}>();

const checked = computed({
	get: () => props.modelValue ?? false,
	set: (val) => emit('update:modelValue', val),
});

const handleCheck = (val: boolean | string | number) => {
	emit('update:modelValue', Boolean(val));
};

// 是否已重点督办
const isHandled = computed(() => props.item.tagNames && props.item.tagNames.length > 0);

const statusMap: Record<string, { label: string; cls: string }> = {
	pending: { label: '待确认', cls: 'blue' },
	unvisited: { label: '未走访', cls: 'orange' },
	visited: { label: '已走访', cls: 'green' },
};

const statusLabel = computed(() => statusMap[props.item.status]?.label || '');
const statusClass = computed(() => statusMap[props.item.status]?.cls || '');

const file: any = computed(() => (props.item.attachments && props.item.attachments[0]) || {});
const openFile = () => {
	if (file.value?.fileUrl) {
		window.open(file.value.fileUrl, '_blank');
	}
};
const goEntDetail = () => {
	const obj: any = props.item || {};
	const params = new URLSearchParams({
		name: obj.enterpriseName || '',
		sccode: obj.creditCode || '',
	});
	window.open(`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?${params}`, '_blank');
};
</script>

<style lang="less" scoped>
.trip-item {
	position: relative;
	border-bottom: 0.01rem solid #cbd5e1;
	padding: 0.12rem 0.2rem;
	font-family: PingFangSC, PingFang SC;
	position: relative;
	cursor: pointer;
	&:hover .header-row .company-name {
		color: #165dff;
	}
	.header-row {
		display: flex;
		align-items: center;
		gap: 0.12rem;
		margin-bottom: 0.12rem;

		.company-name {
			font-size: 0.16rem;
			line-height: 0.24rem;
			font-weight: 500;
			color: rgba(0, 0, 0, 0.9);

			flex-shrink: 1;
			min-width: 0;
		}
		.pdf-link {
			flex-shrink: 0;
			display: flex;
			align-items: center;
			font-size: 0.16rem;
			color: #165dff;
			text-decoration: none;
			border-radius: 0.04rem;
			line-height: 0.2rem;
			padding: 0 0.08rem;
			img {
				width: 0.18rem;
				height: 0.18rem;
				margin-right: 0.04rem;
			}
			.file-name {
				display: inline-block;
				max-width: 3rem;
			}
		}
		.status-tag {
			flex-shrink: 0;
			display: inline-block;
			padding: 0.02rem 0.1rem;
			border-radius: 0.02rem;
			font-size: 0.14rem;
			line-height: 0.2rem;
			font-weight: 500;
			&.blue {
				background: #e4f1ff;
				color: #165dff;
				border: 0.01rem solid rgba(22, 93, 255, 0.5);
			}
			&.orange {
				background: #fef3e6;
				color: #ed7b2f;
				border: 0.01rem solid #ed7b2f;
			}
			&.green {
				background: #e8f8f2;
				color: #00a870;
				border: 0.01rem solid #00a870;
			}
		}
	}

	.detail-grid {
		display: flex;
		gap: 0.08rem 0.24rem;
		font-size: 0.14rem;

		.detail-cell {
			display: flex;
			gap: 0.04rem;
			line-height: 0.24rem;
			width: 30%;
			&:last-child {
				width: 40%;
			}
			.label {
				color: rgba(0, 0, 0, 0.5);
				white-space: nowrap;
			}
			.value {
				color: rgba(0, 0, 0, 0.85);
				flex: 1;
				.highlight {
					// color: #165dff;
					// font-weight: 500;
				}
			}
		}
	}

	.handled-mark {
		position: absolute;
		right: 0;
		top: 0;

		img {
			width: 0.92rem;
			height: 0.92rem;
		}
	}
}
</style>