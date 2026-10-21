<template>
	<div class="side-toobar">
		<ul id="silderBar">
			<li class="active-box" ref="activeBoxRef" :style="{ top: activeTop,height:activeHeight }"></li>
			<template v-for="(item, index) in menus" :key="index">
				<el-tooltip
					effect="dark"
					content="接入中"
					placement="right"
					:disabled="item.iframeUrl"
				>
					<li :class="{ active: activeMenu === item.path }" @click="clickMenu(item)">
						<div
							class="img"
							:style="{
								maskImage: `url(${getUrl(
									`menuLayout/side-icon-${item.icon}.svg`
								)})`,
							}"
						></div>
						<div class="label">{{ item.label }}</div>
					</li>
				</el-tooltip>
			</template>
		</ul>
		<div class="icon-bg"></div>
		<!--<div class="manual-btn" @click="downloadPdf">
			<img src="@/assets/images/menuLayout/manual-btn.png" alt="" />
			<p>操作</p>
			<p>手册</p>
		</div>-->
	</div>
</template>
<script lang="ts" setup>
import useUserStore from '@/stores/user';
import { getUrl } from '@/utils';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();
const store = useUserStore();
const menus = computed(() => store.sideMenus);

const activeMenu = computed(() => route.path);

const clickMenu = (item: any) => {
	if (item.windowUrl) {
		window.open(item.windowUrl, '_blank');
		return;
	}
	router.push({
		path: item.path
	});
};
const activeBoxRef = ref();
const activeTop: any = ref('');
const activeHeight = ref('0.67rem')
const getActiveTop = () => {
	nextTick(() => {
		const el: any = document.getElementById('silderBar')?.querySelector('.active');
		if (!el) return;
		activeHeight.value = `${el.offsetHeight}px`
		activeTop.value = `${el.offsetTop}px`;
	});
};

watch(
	() => activeMenu.value,
	() => {
		getActiveTop();
	},
	{ immediate: true, deep: true }
);

/*
const downloadPdf = () => {
	window.open('./static/广州市招商引资联合指挥平台操作指引.pdf', '_blank');
};
*/
</script>
<style lang="less" scoped>
.side-toobar {
	width: 0.7rem;
	color: #202741;
	font-size: 0.18rem;
	font-family: PingFangSC, PingFang SC;
	line-height: 0.25rem;
	position: relative;
	border-radius: 0.14rem;
	background: #ffffff;
	backdrop-filter: blur(0.04rem);
	&:before {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		border-radius: 0.14rem;
		padding: 0.01rem; /* 边框宽度 */
		background: linear-gradient(180deg, rgba(238, 242, 255, 1), rgba(162, 196, 255, 1));
		-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
		-webkit-mask-composite: xor;
		mask-composite: exclude;
		pointer-events: none; /* 让边框不干扰点击事件 */
	}
	ul {
		padding: 0.25rem 0.07rem;
		position: relative;
	}
	li {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin-bottom: 0.18rem;
		cursor: pointer;
		padding: 0.08rem 0;
		position: relative;
		z-index: 2;
		&.active-box {
			background: linear-gradient(180deg, #3196ff 0%, #165dff 100%);
			border-radius: 0.03rem;
			position: absolute;
			height: 0.67rem;
			width: calc(100% - 0.14rem);
			z-index: 1;
			transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
		}
		&.active {
			color: #ffffff;
			.img {
				background-color: #ffffff;
			}
		}
		.img {
			width: 0.24rem;
			height: 0.24rem;
			margin-bottom: 0.04rem;
			background-color: #202741; /* 默认颜色 */
			opacity: 0.9;
			mask-size: contain;
			mask-repeat: no-repeat;
			mask-position: center;
			-webkit-mask-size: contain; /* 兼容 WebKit */
			img {
				width: 100%;
				height: 100%;
			}
		}
		.label{
			padding: 0 0.08rem;
			text-align: center;
		}
	}
	.icon-bg {
		position: absolute;
		height: 5.13rem;
		width: 100%;
		background: url('@/assets/images/menuLayout/side-toolbar-bg.png');
		background-size: 100% 100%;
		bottom: 0;
		pointer-events: none;
	}
	.manual-btn {
		position: absolute;
		bottom: 1.05rem;
		left: 50%;
		transform: translateX(-50%);
		width: 0.56rem;
		height: 0.77rem;
		// background: linear-gradient( 45deg, rgba(145,196,255,0.4) 0%, rgba(145,196,255,0.8) 100%);
		background: rgba(194, 226, 254, 1);
		box-shadow: 0 0 0.1rem 0 rgba(47, 107, 239, 0.2);
		border-radius: 0.14rem;
		backdrop-filter: blur(0.04rem);
		cursor: pointer;
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		font-size: 0.14rem;
		color: #165dff;
		line-height: 0.2rem;
		text-shadow: 0 0 0.1rem rgba(47, 107, 239, 0.2);
		padding-top: 0.3rem;
		::before {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: 0.14rem;
			padding: .01rem; /* 边框宽度 */
			background: linear-gradient(180deg, rgba(159, 207, 255, 0), rgba(255, 255, 255, 1));
			mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			pointer-events: none; /* 让伪元素不干扰点击 */
		}
		p{
			text-align: center;
		}
		&:hover {
			background: linear-gradient(180deg, #3196ff 0%, #165dff 100%);
			color: #FFFFFF;
		}
		img {
			width: 0.56rem;
			height: 0.64rem;
			position: absolute;
			bottom: 0.4rem;
			left: 0;
		}
	}
}
</style>
