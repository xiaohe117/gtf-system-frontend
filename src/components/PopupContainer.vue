<template>
	<div class="popup" v-drag>
		<div class="top"></div>
		<div class="content">
			<div class="title">
				<SubTitle v-if="!needCustomTitle" :title="title" size="middle" />
				<slot v-else name="custom-title"></slot>
				<img @click="closePopup" src="@/assets/images/common/closeBtn.png" alt="" />
			</div>
			<slot></slot>
		</div>
		<div class="bottom"></div>
	</div>
</template>

<script setup lang="ts">
import SubTitle from '@/components/SubTitle.vue';
/**
 * @param title     	弹窗标题
 * @param width      	弹窗宽度
 * @param height 		弹窗高度
 * @param top     		弹窗距离顶部的绝对定位，支持百分比和确定的值
 * @param left			弹窗距离左侧的绝对定位，支持百分比和确定的值
 * @param closePopup	关闭弹窗的回调
 * @param enabledrag	弹窗是否可拖拽
 */
const props = withDefaults(
	defineProps<{
		title?: string;
		width?: number;
		height?: number;
		top?: string;
		left?: string;
		closePopup?: () => void;
		enabledrag?: boolean;
		needCustomTitle?: boolean;
	}>(),
	{
		title: '',
		width: 650,
		height: 760,
		top: '',
		left: '',
		closePopup: () => {},
		enabledrag: true,
		showDefaultTitle: false,
	}
);

const vDrag = {
	mounted(el: HTMLDivElement) {
		if (props.enabledrag) {
			// eslint-disable-next-line no-param-reassign
			el.onmousedown = (ev) => {
				ev.stopPropagation();
				// 鼠标按下的位置
				const mouseXStart = ev.clientX;
				const mouseYStart = ev.clientY;

				// 当前滑块位置
				const rectLeft = el.offsetLeft;
				const rectTop = el.offsetTop;
				document.onmousemove = (e) => {
					// 鼠标移动的位置
					const mouseXEnd = e.clientX;
					const mouseYEnd = e.clientY;
					const moveX = mouseXEnd - mouseXStart + rectLeft;
					const moveY = mouseYEnd - mouseYStart + rectTop;
					// eslint-disable-next-line no-param-reassign
					el.style.margin = 'auto';
					// eslint-disable-next-line no-param-reassign
					el.style.top = `${moveY / 100}rem`;
					// eslint-disable-next-line no-param-reassign
					el.style.left = `${moveX / 100}rem`;
				};
				document.onmouseup = () => {
					// 取消事件
					document.onmousemove = null;
				};
			};
		}
	},
};

const pWidth = computed(() => `${props.width / 100}rem`);
const pHeight = computed(() => `${props.height / 100}rem`);
const left = computed(() => (props.left ? props.left : '50%'));
const top = computed(() => (props.top ? props.top : '50%'));
const halfWidth = computed(() => (props.left ? '0rem' : `-${props.width / 100 / 2}rem`));
const halfHeight = computed(() => (props.top ? '0rem' : `-${props.height / 100 / 2}rem`));
</script>

<style lang="less" scoped>
.common {
	width: 100%;
	height: 0.12rem;
	background-size: 100% 100%;
}
.popup {
	width: v-bind(pWidth);
	height: v-bind(pHeight);
	position: absolute;
	left: v-bind(left);
	top: v-bind(top);
	margin-top: v-bind(halfHeight);
	margin-left: v-bind(halfWidth);
	z-index: 1;
	background: rgba(7, 28, 55, 0.9);
	box-shadow:
		0px 0px 10px 0px rgba(79, 158, 253, 0.4),
		inset 0px 0px 40px 0px rgba(41, 123, 221, 0.4);
	border: 0.02rem solid;
	border-image: linear-gradient(
			230deg,
			rgba(72, 164, 243, 0),
			rgba(60, 165, 255, 1),
			rgba(72, 164, 243, 0)
		)
		2 2;
	display: flex;
	flex-direction: column;
	box-sizing: border-box;
	.top {
		.common();
		background-image: url('@/assets/images/common/popupTopBg.png');
	}
	.bottom {
		.common();
		background-image: url('@/assets/images/common/popupBottomBg.png');
	}
	.content {
		flex: 1;
		padding: 0.12rem 0.22rem;
		box-sizing: border-box;
		.title {
			color: #eff5ff;
			font-size: 0.24rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			img {
				width: 0.3rem;
				height: 0.3rem;
				cursor: pointer;
			}
		}
	}
}
</style>
