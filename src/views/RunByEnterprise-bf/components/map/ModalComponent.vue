<template>
	<div class="modal-overlay" @click="handleOverlayClick">
		<div class="modal-container" @click.stop>
			<div class="modal-header">
				<h3 class="modal-title">{{ title }}</h3>
				<span class="total-count">共{{ total }}家</span>
				<!--<span class="view-details-btn" @click="handleViewDetails">查看详情</span>-->
				<span class="view-details-btn" @click="handleViewDetails">&nbsp;</span>
				<span class="close-btn" @click.stop="handleClose"></span>
			</div>

			<div class="modal-content">
				<div class="list-container">
					<div
						v-for="(item, index) in items"
						:key="index"
						class="list-item"
						@click="handleClick(item)"
					>
						<div class="first-row">
							<div class="name-wrapper">
								<span class="name" :title="item.name">{{ item.name }}</span>
							</div>
							<div class="tags">
								<span class="tag country-tag" v-if="item.country !== ''">{{
									item.country
								}}</span>
								<span class="tag category-tag" v-if="item.category !== ''">{{
									item.category
								}}</span>
							</div>
						</div>

						<div class="description" :title="item.description">
							{{ item.description }}
						</div>

						<div class="department-row">
							<span class="department-label"
								><i>对接部门：</i><b>{{ item.department }}</b></span
							>
							<span class="department-invest"
								><i>是否在穗投资：</i><b>{{ item.hasPlan }}</b></span
							>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface ListItem {
	name: string;
	country: string;
	category: string;
	description: string;
	department: string;
	hasPlan: string;
}

withDefaults(
	defineProps<{
		title?: string;
		total?: number;
		items?: ListItem[];
		visible?: boolean;
	}>(),
	{
		title: '',
		total: 0,
		items: () => [],
		visible: false,
	}
);

const emit = defineEmits(['close', 'view-details', 'handleClick']);

const handleClose = () => {
	emit('close');
};

const handleOverlayClick = () => {
	emit('close');
};

const handleViewDetails = () => {
	emit('view-details');
};

const handleClick = (item: any) => {
	emit('handleClick', item);
};
</script>

<style scoped lang="less">
.modal-overlay {
	position: absolute;
	left: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
	animation: fadeIn 0.3s ease;
}

.modal-container {
	background-color: rgba(255, 255, 255, 0.8);
	border-radius: 0.08rem 0.08rem 0 0;
	width: 100%;
	box-shadow: 0 0.1rem 0.25rem rgba(0, 0, 0, 0.1);
	transition:
		transform 0.3s ease,
		opacity 0.3s ease;
	transform: translateY(0);
	opacity: 1;
	position: relative;
}

.modal-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	line-height: 0.39rem;
	background: rgba(142, 197, 255, 0.5);
	border-radius: 0.08rem 0.08rem 0 0;
	border-bottom: 0.01rem solid #aaccff;
	padding: 0 0.2rem 0 0.16rem;
	font-family: PingFangSC-Medium;
	font-size: 0.16rem;
	color: #333;
	font-weight: 700;
	position: relative;

	.modal-title {
		white-space: nowrap;
	}

	.total-count {
		font-size: 0.18rem;
		white-space: nowrap;
		margin-left: auto;
	}

	.view-details-btn {
		color: #2f71ff;
		cursor: pointer;
		margin-left: 0.2rem;
	}

	.close-btn {
		position: absolute;
		right: -0.1rem;
		top: -0.1rem;
		background: none;
		border: none;
		color: #64748b;
		width: 0.3rem;
		height: 0.3rem;
		cursor: pointer;
		transition: color 0.2s ease;
		background-image: url('@/assets/images/gtf/close.png');
		background-size: 100% 100%;
	}
}

.modal-content {
	overflow-y: auto;
	width: 4rem;
	height: 2rem;
}

.list-container {
	display: flex;
	flex-direction: column;
}

.list-item {
	padding: 0.1rem;
	background-color: white;
	border-bottom: 0.01rem dashed #78a8ef;
	transition: box-shadow 0.2s ease;
	cursor: pointer;
}

.first-row {
	display: flex;
	align-items: center;
	margin-bottom: 0.08rem;

	.name-wrapper {
		flex: 1;
		min-width: 0;

		.name {
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 500;
			font-size: 0.16rem;
			color: #333;
			white-space: nowrap;
			overflow: hidden;
			text-overflow: ellipsis;
			display: inline-block;
			max-width: 95%;
		}
	}

	.tags {
		display: flex;
		gap: 0.04rem;
		flex-shrink: 0;

		.tag {
			padding: 0.02rem 0.06rem;
			white-space: nowrap;
			border-radius: 0.02rem;
			font-family:
				PingFangSC,
				PingFang SC;
			font-weight: 400;
			font-size: 0.12rem;
		}

		.country-tag {
			background: #e9f2ff;
			border: 0.01rem solid #3489ff;
			color: #3489ff;
		}

		.category-tag {
			background: #e0fff5;
			border: 1px solid #69dbb5;
			color: #45c99d;
		}
	}
}

.description {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	font-size: 0.14rem;
	color: #666;
	margin-bottom: 0.04rem;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	line-clamp: 1;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	line-height: 1.5;
}

.department-row {
	display: flex;
	justify-content: space-between;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 400;
	font-size: 0.13rem;
	color: #666;
	.department-label,
	.department-invest {
		i {
			color: rgb(52, 137, 255);
			font-weight: bold;
			font-style: normal;
		}
		b {
			font-weight: normal;
			color: #333;
		}
	}
}

@keyframes fadeIn {
	from {
		opacity: 0;
	}
	to {
		opacity: 1;
	}
}

:deep(.modal-container.hidden) {
	transform: translateY(20px);
	opacity: 0;
}
</style>
