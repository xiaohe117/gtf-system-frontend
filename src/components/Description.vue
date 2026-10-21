<template>
	<div class="description-box">
		<template v-for="(item, index) in contentArray" :key="index">
			<div class="item">
				<template v-if="isObject(item) && item.type === 'img'">
					<img :src="getUrl(item.content)" alt="" class="png" />
				</template>

				<template v-else-if="isObject(item) && item.type === 'list'">
					<div class="listItem">
						<img :src="getUrl(`OverallSituation/0${index + 1}`)" alt="" class="icon" />
						<div class="text" v-html="item.content"></div>
					</div>
				</template>

				<template v-else>
					<div class="text" v-html="item"></div>
				</template>
			</div>
		</template>
	</div>
</template>
<script lang="ts" setup>
import { getUrl } from '@/utils';

type DescriptionItem =
	| string
	| {
			type: 'list';
			content: DescriptionItem[];
	  }
	| {
			type: 'img';
			content: string;
	  };

// props 定义
interface Props {
	contentArray: DescriptionItem[];
}

withDefaults(defineProps<Props>(), {
	contentArray: () => [],
});

// 类型守卫函数
const isObject = (value: any): value is { type: string; content: any } =>
	value !== null &&
	typeof value === 'object' &&
	!Array.isArray(value) &&
	typeof (value as { type: string }).type === 'string';
</script>

<style scoped lang="less">
.description-box {
	flex-direction: column;
	row-gap: 0.2rem;
	.item {
		.listItem {
			display: grid;
			grid-template-columns: auto 1fr;
			column-gap: 0.15rem;
		}
		.png {
			// width: 8.65rem;
			// height: 2.45rem;
			width: 100%;
			object-fit: contain;
		}
		.icon {
			width: 2rem;
			object-fit: contain;
		}
		.text {
			font-size: 0.24rem;
		}
	}
}
</style>
