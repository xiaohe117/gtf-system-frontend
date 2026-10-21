<!-- 文字+小图标列表 对应设计稿 1-2-2, 1-2-3, 1-2-4 -->
<template>
	<div class="small-icon-list">
		<div
			v-for="item in dataList"
			:key="item.label"
			class="s-i-l_item main-color-bg"
			:class="`${item?.bgColor || 'blue'}-01`"
		>
			<div class="icon" :style="`background-image: url(${item.iconUrl})`"></div>
			<div class="item_content">
				<p class="main-color-font" :class="item?.bgColor || 'blue'">
					<span class="number-font">{{ item.num }}</span>
					<span>{{ item.unit }}</span>
				</p>
				<p class="item_content_label">
					{{ item.label }}
				</p>
			</div>
			<div class="item_content" v-if="item.subNum">
				<p class="main-color-font" :class="item?.bgColor || 'blue'">
					<span class="number-font">{{ item.subNum }}</span>
					<span>{{ item.subUnit }}</span>
				</p>
				<p class="item_content_label">
					{{ item.subLabel }}
				</p>
			</div>
			<div class="item_content" v-if="item.yoy">
				<p class="main-color-font" :class="getClass(item.yoy)">
					<span class="number-font">{{ Math.abs(Number(item.yoy)) }}%</span>
				</p>
				<p class="item_content_label">同比</p>
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	// 兼容最少长度为1，最大为3
	dataList: any[];
}>();

const getClass = (num: number | string) => (Number(num) >= 0 ? 'up' : 'down');
</script>

<style lang="less" scoped>
.number-font {
	font-family: @number-font;
}
.main-color-font {
	&.blue {
		color: @blue;
	}
	&.yellow {
		color: @yellow;
	}
	&.orange {
		color: @orange;
	}
	&.red {
		color: @red;
	}
	&.flu-blue {
		color: @flu-blue;
	}
	&.green {
		color: @green;
	}
	&.purple {
		color: @purple;
	}
}
.main-color-bg {
	&.blue {
		background-color: @blue;
	}
	&.yellow {
		background-color: @yellow;
	}
	&.orange {
		background-color: @orange;
	}
	&.red {
		background-color: @red;
	}
	&.flu-blue {
		background-color: @flu-blue;
	}
	&.green {
		background-color: @green;
	}
	&.purple {
		background-color: @purple;
	}
	&.blue-01 {
		background-color: @blue-01;
	}
	&.yellow-01 {
		background-color: @yellow-01;
	}
	&.orange-01 {
		background-color: @orange-01;
	}
	&.red-01 {
		background-color: @red-01;
	}
	&.flu-blue-01 {
		background-color: @flu-blue-01;
	}
	&.green-01 {
		background-color: @green-01;
	}
	&.purple-01 {
		background-color: @purple-01;
	}
}

.small-icon-list {
	height: 1.06rem;
	display: flex;
	gap: 0.08rem;
}
.s-i-l_item {
	flex: 1;
	display: flex;
	font-size: 0.16rem;
	align-items: center;
	padding-left: 0.16rem;

	.number-font {
		font-size: 0.28rem;
		margin-right: 0.06rem;
	}
}
.icon {
	width: 0.48rem;
	height: 0.48rem;
	background-size: 100% 100%;
}
.item_content {
	margin-left: 0.12rem;
	flex: 1;
	.up {
		color: #1dd87c;
		&::before {
			display: inline-block;
			content: '';
			width: 0.12rem;
			height: 0.12rem;
			background-image: url('@/assets/images/common/data-up-arrow_icon.svg');
			margin-right: 0.04rem;
		}
	}
	.down {
		color: #fc5a5a;
		&::before {
			display: inline-block;
			content: '';
			width: 0.12rem;
			height: 0.12rem;
			background-image: url('@/assets/images/common/data-down-arrow_icon.svg');
			margin-right: 0.04rem;
		}
	}
}
</style>
