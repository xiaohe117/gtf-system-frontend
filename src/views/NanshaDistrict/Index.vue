<template>
	<div class="dashboard-container">
		<SubPageBackBtn />
		<div class="left-panel">
			<div class="top-section">
				<h2>南沙区招商总览</h2>
				<div class="header-stats">
					<div
						class="stat-item"
						:class="{ active: activeMainTab === 'industry' }"
						@click="activeMainTab = 'industry'"
					>
						<div>
							<img
								src="@/assets/images/nanShaDistrict/icon-1.png"
								alt=""
								class="img"
							/>
						</div>
						<div class="stat-label">主战产业</div>
						<div class="stat-value">3<span>个</span></div>
					</div>
					<div
						class="stat-item"
						:class="{ active: activeMainTab === 'target' }"
						@click="activeMainTab = 'target'"
					>
						<div>
							<img
								src="@/assets/images/nanShaDistrict/icon-1.png"
								alt=""
								class="img"
							/>
						</div>
						<div class="stat-label">目标企业</div>
						<div class="stat-value">102<span>个</span></div>
					</div>
					<div
						class="stat-item"
						:class="{ active: activeMainTab === 'project' }"
						@click="activeMainTab = 'project'"
					>
						<div>
							<img
								src="@/assets/images/nanShaDistrict/icon-1.png"
								alt=""
								class="img"
							/>
						</div>
						<div class="stat-label">招商项目</div>
						<div class="stat-value">763<span>个</span></div>
					</div>
				</div>
			</div>

			<div class="tab-content" v-if="activeMainTab === 'industry'">
				<iframe
					src="http://10.205.25.135:9001/zszh/#/singlePage/cygk/chanye-guihua"
					frameborder="0"
				></iframe>
			</div>

			<div class="tab-content" v-if="activeMainTab === 'target'">
				<FrameBox>
					<TitleBody name="目标企业">
						<TargetEnterprise @changeTab="changeTab" />
						<EnterpriseTable :tabIndex="tabIndex" />
					</TitleBody>
				</FrameBox>
			</div>
			<div class="tab-content" v-else-if="activeMainTab === 'project'">
				<FrameBox>
					<TitleBody name="招商项目">
						<InvestmentDashboard />
					</TitleBody>
				</FrameBox>
			</div>
		</div>

		<div class="right-panel">
			<FrameBox size="small">
				<template #first>
					<TitleBody name="区任务清单">
						<TaskList />
					</TitleBody>
				</template>
				<template #second>
					<TitleBody name="区问题台账">
						<IssueTracker />
					</TitleBody>
				</template>
			</FrameBox>
		</div>
	</div>
</template>

<script setup lang="ts">
import TargetEnterprise from './components/TargetEnterprise.vue';
import EnterpriseTable from './components/EnterpriseTable.vue';
import TaskList from './components/TaskList.vue';
import IssueTracker from './components/IssueTracker.vue';
import InvestmentDashboard from './components/InvestmentDashboard.vue';

const activeMainTab = ref<string>('project');

const tabIndex = ref(0);

const changeTab = (index: number) => {
	tabIndex.value = index;
};

onMounted(() => {
	setTimeout(() => {
		window.dispatchEvent(new Event('resize'));
	});
});
onBeforeMount(() => {});
</script>

<style lang="less" scoped>
.dashboard-container {
	display: flex;
	height: 100%;
	gap: 0.2rem;
}

.left-panel {
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 0.2rem;
	width: 12.5rem;
}

.right-panel {
	width: 6rem;
	display: flex;
	gap: 0.2rem;
	margin-top: 0.65rem;
	height: 9.04rem;
}

.tab-content {
	display: flex;
	height: 7.88rem;
}

.top-section {
	h2 {
		font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan';
		font-size: 0.4rem;
		color: #4f98ff;
		line-height: 0.62rem;
		background-image: linear-gradient(
			180deg,
			rgba(79, 152, 255, 1) 0,
			rgba(25, 54, 169, 1) 100%
		);
		overflow-wrap: break-word;
		font-weight: normal;
		text-align: left;
		white-space: nowrap;
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
	}
}

.header-stats {
	display: flex;
	gap: 0.16rem;
	height: 1rem;
}

.stat-item {
	display: flex;
	align-items: center;
	padding: 0.05rem;
	cursor: pointer;
	transition: all 0.3s ease;
	flex: 1;
	background: rgba(169, 181, 255, 0.1);
	border-radius: 0.08rem;
	border: 0.01rem solid #ffffff;
	box-sizing: border-box;
	position: relative;
	.img {
		width: 1.03rem;
		height: 0.9rem;
	}
}

.stat-item.active {
	background-image: url('@/assets/images/nanShaDistrict/tab_active.png');
	background-size: cover;
	background-repeat: no-repeat;
	&::after {
		content: '';
		position: absolute;
		bottom: -0.1rem;
		left: 50%;
		transform: translate(-50%, -50%) rotate(180deg);
		border-left: 6px solid transparent;
		border-right: 6px solid transparent;
		border-bottom: 6px solid #3a73de;
	}
}

.stat-content {
	display: flex;
	flex-direction: column;
}

.stat-label {
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.2rem;
	color: rgba(0, 0, 0, 0.85);
	width: 1.8rem;
}

.stat-value {
	font-size: 0.48rem;
	color: #4f98ff;
	font-family: 'PangMenZhengDaoBiaoTiTiMianFeiBan';
	display: flex;
	align-items: center;
	justify-content: flex-end;
	width: 1rem;
	span {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 500;
		font-size: 0.2rem;
		color: rgba(0, 0, 0, 0.85);
		margin-top: 0.1rem;
		margin-left: 0.05rem;
	}
}

:deep(.outside) {
	> div > div:not(:last-child) {
		margin: 0;
	}
}

:deep(.outside) {
	.outside-content {
		> div:not(:last-child) {
			margin-bottom: 0.1rem;
		}
	}
}
iframe {
	flex: 1;
}
</style>
