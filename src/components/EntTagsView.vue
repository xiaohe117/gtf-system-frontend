<template>
	<div class="ent-tags-view">
		<template v-if="list.length > 0">
			<el-tag type="primary">
				{{ list[0] }}
			</el-tag>
			<el-popover v-if="list.length > 1" placement="top" trigger="hover" :width="200">
				<template #reference>
					<span class="more-tags-trigger">+{{ list.length - 1 }}</span>
				</template>
				<div class="hidden-tags">
					<el-tag type="primary" v-for="(item, index) in list.slice(1)" :key="index">
						{{ item }}
					</el-tag>
				</div>
			</el-popover>
		</template>
	</div>
</template>

<script lang="ts" setup>
const props = defineProps({
	value: {
		type: String,
		default: '',
	},
});

const list = computed(() => {
	if (!props.value) {
		return [];
	}
	return props.value.split(',');
});
</script>

<style lang="less" scoped>
.ent-tags-view {
	display: flex;
	align-items: center;
	gap: 0.08rem;

	.el-tag {
		--el-color-primary: #165dff;
		--el-color-primary-light-9: #e4f1ff;
		--el-color-primary-light-8: rgba(22, 93, 255, 0.5);
		margin-right: 0.08rem;
		font-size: 0.14rem;
		padding: 0.01rem 0.08rem;
		border-radius: 0.02rem;
		height: auto;
		max-width: 100%;

		&:first-child {
			margin-top: 0;
		}
		:deep(.el-tag__content) {
			line-height: 0.2rem;
			height: 0.2rem;
			display: inline-block;
			max-width: 100%;
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		&:last-child {
			margin-right: 0;
		}
	}

	.more-tags-trigger {
		color: #165dff;
		cursor: pointer;
		font-weight: bold;
		&:hover {
			color: #0050d8;
		}
	}
}
</style>

<style lang="less">
.hidden-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 0.08rem;
	.el-tag {
		--el-color-primary: #165dff;
		--el-color-primary-light-9: #e4f1ff;
		--el-color-primary-light-8: rgba(22, 93, 255, 0.5);
		font-size: 0.14rem;
		padding: 0.01rem 0.08rem;
		border-radius: 0.02rem;
		height: auto;
	}
}
</style>
