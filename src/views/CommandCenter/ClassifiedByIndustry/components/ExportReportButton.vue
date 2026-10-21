<template>
	<div class="action-btn btn-primary" :class="{ 'is-loading': exportLoading }" @click="onExport">
		导出内容
	</div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { ElMessage, ElLoading } from 'element-plus';
import { exportFile } from '@/utils/file';

/** 导出按钮 loading 状态 */
const exportLoading = ref(false);

/** 导出招商报告 */
const onExport = async () => {
	if (exportLoading.value) return;
	exportLoading.value = true;
	const loading = ElLoading.service({
		lock: true,
		text: '导出中...',
		background: 'rgba(0, 0, 0, 0.45)',
	});
	try {
		const pad = (n: number) => String(n).padStart(2, '0');
		const now = new Date();
		const dateStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
		const ok = await exportFile(
			'/industry-report/export',
			`招商招商引资优势报告_${dateStr}.docx`
		);
		if (!ok) ElMessage.error('导出失败');
	} catch {
		ElMessage.error('导出失败');
	} finally {
		loading.close();
		exportLoading.value = false;
	}
};
</script>

<style lang="less" scoped>
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

	&.is-loading {
		opacity: 0.6;
		cursor: not-allowed;
		pointer-events: none;
	}
}
</style>
