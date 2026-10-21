<template>
	<div class="enterprise-visit-footprint">
		<p class="title">企业走访足迹图</p>
		<div class="content">
			<div class="stat-item">
				<div class="stat-label">累计走访次数</div>
				<div class="stat-value-wrapper">
					<span class="stat-value">{{ totalVisitCount }}</span>
					<span class="stat-unit">次</span>
				</div>
			</div>
			<div class="divider"></div>
			<div class="stat-item">
				<div class="stat-label">热门走访城市 TOP5</div>
				<ul class="city-list">
					<li v-if="hotVisitCityTop5.length > 0">
						{{ hotVisitCityTop5.map((item) => item.cityName).join('、') }}
					</li>
				</ul>
			</div>
			<div class="divider"></div>
			<div class="stat-item">
				<div class="stat-label">主要产业分布 TOP5</div>
				<ul class="city-list">
					<li>
						{{ industryDistributionTop5.map((item) => item.industryName).join('、') }}
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
withDefaults(
	defineProps<{
		totalVisitCount?: number;
		hotVisitCityTop5?: { cityName: string; visitCount: number }[];
		industryDistributionTop5?: { industryName: string; visitCount: number }[];
	}>(),
	{
		totalVisitCount: 0,
		hotVisitCityTop5: () => [],
		industryDistributionTop5: () => [],
	}
);
</script>

<style lang="less" scoped>
.enterprise-visit-footprint {
	position: absolute;
	width: 1.5rem;
	height: 2.5rem;
	background-image: url('@/assets/images/map/qyzfzj.png');
	background-size: 100% 100%;
	left: 0rem;
	bottom: 0rem;
	padding: 0.1rem 0.05rem;
	z-index: 3;

	.title {
		font-family: AlimamaShuHeiTi, AlimamaShuHeiTi;
		font-size: 0.18rem;
		color: #fff;
		line-height: 0.36rem;
		font-weight: bold;
	}

	.content {
		padding-top: 0.04rem;
		.stat-item {
			margin-bottom: 0.02rem;

			.stat-label {
				display: block;
				font-size: 0.15rem;
				color: rgba(0, 0, 0, 1);
				margin-bottom: 0.01rem;
				font-family:
					PingFangSC,
					PingFang SC;
				font-weight: 500;
			}

			.stat-value-wrapper {
				display: flex;
				align-items: baseline;
			}

			.stat-value {
				font-weight: bold;
				font-size: 0.14rem;
				color: #165dff;
				font-family: DINAlternate, DINAlternate;
			}

			.stat-unit {
				font-size: 0.12rem;
				color: rgba(0, 0, 0, 0.65);
				margin-left: 0.04rem;
				font-weight: 600;
			}

			.city-list {
				margin-top: 0.02rem;

				li {
					font-size: 0.14rem;
					color: #165dff;
					line-height: 0.16rem;
				}
			}
		}

		.divider {
			height: 0.01rem;
			background: linear-gradient(
				90deg,
				transparent 0%,
				rgba(24, 144, 255, 0.4) 50%,
				transparent 100%
			);
			margin: 0.01rem 0;
		}
	}
}
</style>
