<!-- 纯文字列表 对应设计稿 1-1-1, 1-1-2, 1-1-3 -->
<template>
	<div class="pure-text-list">
		<div
			v-for="(item, index) in dataList"
			:key="item.label"
			class="p-t-l_item main-color-bg"
			:class="`${item?.bgColor || 'blue'}-01`"
		>
			<div class="line main-color-bg" :class="item?.bgColor || 'blue'" v-if="showLine"></div>
			<div class="item_content">
				<p class="main-color-font" :class="item?.bgColor || 'blue'">
					<span class="number-font">{{ item.num }}</span>
					<span>{{ item.unit }}</span>
				</p>
				<p class="item_content_label">
					<span class="item_content_label_left">
						<span>{{ item.label }}</span>
						<slot :name="`labelSub${index}`" />
					</span>
					<slot :name="`secondLabel${index}`" />
				</p>
			</div>
			<div class="item_content" v-if="$slots.subItem">
				<slot class="item_content" name="subItem" :item="item" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
withDefaults(
	defineProps<{
		// 兼容最少长度为1，最大为3
		dataList: any[];
		showLine?: boolean;
	}>(),
	{
		showLine: true,
	}
);
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

.pure-text-list {
	height: 1.06rem;
	display: flex;
	gap: 0.08rem;
}
.p-t-l_item {
	flex: 1;
	display: flex;
	font-size: 0.16rem;

	.number-font {
		font-size: 0.28rem;
		margin-right: 0.06rem;
	}
}
.line {
	width: 0.02rem;
	height: 100%;
}
.item_content {
	padding: 0 0.14rem;
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: flex-start;
}
.item_content_label {
	display: flex;
	justify-content: space-between;
}
.item_content_label_left {
	min-width: 1.29rem;
	display: flex;
	align-items: center;
}
</style>
