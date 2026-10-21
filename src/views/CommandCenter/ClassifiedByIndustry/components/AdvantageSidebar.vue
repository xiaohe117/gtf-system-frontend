<template>
	<div class="advantage-sidebar">
		<div class="sidebar-scroll">
			<div class="group">
				<ul class="group-list">
					<li
						v-for="item in items"
						:key="item.id"
						class="group-item"
						:class="{ active: item.id === activeKey }"
						@click="onItemClick(item)"
					>
						<span class="item-label">{{ item.label }}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="sidebar-footer">
			<template v-if="!isCustomized">
				<div class="action-btn btn-primary" @click="emit('custom')">定制优势内容</div>
			</template>
			<template v-else>
				<div class="action-btn btn-primary" @click="emit('custom')">更新定制</div>
				<ExportReportButton />
				<div class="action-btn btn-outline" @click="onExitCustom">退出定制</div>
			</template>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ElMessageBox } from 'element-plus';
import { resetCustomize } from '@/api/industry';
import ExportReportButton from './ExportReportButton.vue';
import type { NavItem } from '../type';

defineProps({
	items: {
		type: Array as () => NavItem[],
		required: true,
	},
	activeKey: {
		type: String,
		required: true,
	},
	/** 是否已进入定制模式（定制后展示更新定制/导出/退出，定制前仅展示定制优势内容） */
	isCustomized: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits<{
	select: [id: string];
	custom: [];
	'exit-custom': [];
}>();

const onItemClick = (item: NavItem) => {
	emit('select', item.id);
};

const onExitCustom = () => {
	ElMessageBox.confirm('退出定制后，将返回初始未定制内容，本定制内容不保存，是否确定退出？', {
		confirmButtonText: '确定',
		cancelButtonText: '取消',
		type: 'warning',
		cancelButtonClass: 'exit-custom-cancel-btn',
		customClass: 'exit-custom-messagebox',
		customStyle: {
			position: 'fixed',
			top: '50%',
			left: '50%',
			transform: 'translate(-50%, -50%)',
			margin: '0',
		},
		appendTo: document.body,
	})
		.then(async () => {
			// 调用退出定制接口，成功后再触发 exit-custom 事件
			try {
				const res = await resetCustomize<{ code: number }>({});
				if (res.code === 0) {
					emit('exit-custom');
				}
			} catch {
				// 接口失败不触发退出
			}
		})
		.catch(() => {});
};
</script>

<style lang="less" scoped>
.advantage-sidebar {
	width: 2.6rem;
	min-width: 2.6rem;
	height: 100%;
	border-radius: 0.08rem;
	padding: 0;
	box-sizing: border-box;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.sidebar-scroll {
	flex: 1;
	min-height: 0;
	overflow-y: auto;
	padding: 0 0.2rem 0.16rem 0;
	box-sizing: border-box;
}

.group {
	display: flex;
	flex-direction: column;
	gap: 0.16rem;

	.group-list {
		display: flex;
		flex-direction: column;
		gap: 0.08rem;

		.group-item {
			position: relative;
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 0.38rem;
			padding: 0 0.14rem;
			background: #d9ebff;
			border-radius: 0.04rem;
			cursor: pointer;
			transition: all 0.2s ease;
			box-sizing: border-box;

			.item-label {
				font-family: MicrosoftYaHei;
				font-size: 0.16rem;
				color: rgba(0, 0, 0, 0.6);
			}

			&.active {
				background-color: unset;
				background-image: url('@/assets/images/industry/side-bg.webp');
				background-size: 100% 100%;
				background-repeat: no-repeat;
				background-position: center;
				width: calc(100% + 0.2rem);

				.item-label {
					font-family: MicrosoftYaHei;
					font-weight: 600;
					font-size: 0.16rem;
					color: #fff;
				}
			}
		}
	}
}

.sidebar-footer {
	flex-shrink: 0;
	padding: 0.08rem 0.24rem 0.16rem 0rem;
	display: flex;
	flex-direction: column;
	gap: 0.12rem;
	background: transparent;
}

.action-btn {
	height: 0.42rem;
	display: flex;
	align-items: center;
	justify-content: center;
	border-radius: 0.21rem;
	font-family: MicrosoftYaHei;
	font-size: 0.16rem;
	font-weight: bold;
	cursor: pointer;
	transition: all 0.2s ease;
	flex-shrink: 0;

	&.btn-primary {
		background: linear-gradient(90deg, #256eff, #6ba3ff);
		color: #fff;
		box-shadow: 0 0.02rem 0.1rem rgba(37, 110, 255, 0.3);
		&:hover {
			opacity: 0.9;
			transform: translateY(-0.01rem);
		}
	}

	&.btn-outline {
		background: rgba(255, 255, 255, 0.9);
		color: #256eff;
		border: 0.02rem solid #256eff;
		&:hover {
			background: rgba(37, 110, 255, 0.05);
		}
	}
}
</style>

<style lang="less">
.exit-custom-cancel-btn {
	&:hover,
	&:focus {
		background-color: var(--el-button-bg-color, #fff) !important;
		border-color: var(--el-border-color, #dcdfe6) !important;
		color: var(--el-button-text-color, #606266) !important;
	}
}
</style>
