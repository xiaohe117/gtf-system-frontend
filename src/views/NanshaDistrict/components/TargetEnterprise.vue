<template>
	<div class="enterprise-info">
		<div class="progress-stats">
			<div class="progress-item">
				<span class="progress-name">目标企业活动覆盖率</span>
				<span class="progress-value">80%</span>
			</div>
			<div class="progress-item">
				<span class="progress-name">目标企业在建有项目比率</span>
				<span class="progress-value">80%</span>
			</div>
		</div>
		<LineTabs :tabList="tabList" @changeTab="changeTab" />
	</div>
</template>

<script setup lang="ts">
const emits = defineEmits(['changeTab']);

const tabList = ['国内跟进', '重点产业企业', '重点榜单企业'];
const changeTab = (index: number) => {
	// eslint-disable-next-line no-console
	emits('changeTab', index);
};
</script>

<style lang="less" scoped>
.enterprise-info {
	margin-bottom: 0.16rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
}
.progress-stats {
	display: flex;
	gap: 0.16rem;
}

.progress-item {
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #fff;
	width: 3.09rem;
	height: 0.56rem;
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 0 0.18rem;
	box-sizing: border-box;
}

.progress-name {
	font-family:
		PingFangSC,
		PingFang SC;
	color: #000;
	font-size: 0.18rem;
	font-weight: 400;
}

.progress-value {
	font-size: 0.25rem;
	font-weight: bold;
	color: #409eff;
	font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan';
}
</style>
