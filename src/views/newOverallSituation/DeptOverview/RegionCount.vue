<template>
	<div class="region-count">
		<p class="title"><span>区域走访次数</span></p>
		<ul>
			<li v-for="(item, index) in countConfig" :key="index">
				<span class="box" :style="{ background: item.color }"></span>
				<span class="label">{{ item.label }}</span>
			</li>
		</ul>
	</div>
</template>
<script lang="ts" setup>
const countConfig = [
	{ label: '<0 次', level: 4, color: '#DDF2FF' },
	{ label: '1-5 次', level: 3, color: '#87C8FF' },
	{ label: '6-10 次', level: 2, color: '#408DFB' },
	{ label: '10-50 次', level: 1, color: '#165DFF' },
	{ label: '≥50 次', level: 0, color: '#3B60A5' },
];
</script>
<style lang="less" scoped>
.region-count {
	position: absolute;
	right: 0;
	bottom: 0;
	z-index: 3;
	width: 1.42rem;
	padding: 0.1rem 0.12rem 0.08rem 0.14rem;
	background: rgba(255, 255, 255, 0.88);
	border: 0.01rem solid #8eb8ff;
	border-radius: 0.08rem;
	box-shadow: 0 0.04rem 0.12rem rgba(24, 74, 143, 0.12);
	box-sizing: border-box;

	.title {
		margin: 0;

		span {
			font-family: SourceHanSansCN-Bold;
			font-size: 0.16rem;
			color: #000;
			line-height: 0.22rem;
		}
	}

	ul {
		margin: 0.08rem 0 0;
		padding: 0;
		list-style: none;

		li {
			display: flex;
			align-items: center;
			margin-bottom: 0.06rem;
			font-family: SourceHanSansCN;
			font-size: 0.14rem;
			line-height: 0.2rem;
			color: #000;

			&:last-child {
				margin-bottom: 0;
			}

			.box {
				width: 0.1rem;
				height: 0.1rem;
				margin-right: 0.08rem;
				border-radius: 0.01rem;
				box-shadow: 0 0.01rem 0.03rem 0 rgba(0, 78, 151, 0.25);
				flex-shrink: 0;
			}

			.label {
				flex: 1;
			}
		}
	}
}
</style>
