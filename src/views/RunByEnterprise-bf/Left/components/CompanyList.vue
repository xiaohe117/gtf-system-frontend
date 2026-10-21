<!--
 * @Descripttion: 
 * @Author: zhaochao
 * @Date: 2025-08-15 16:39:52
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-08-18 10:26:18
-->
<template>
	<div class="company-list-wrap">
		<SmallTitle :title="props.title" />
		<template v-if="dataList.length">
			<div class="compony-list">
				<div
					class="list-item overflow-ellipsis"
					v-for="(item, index) in props.dataList"
					:key="index"
					@click="goEnterpriseDetail(item)"
				>
					<span>{{ index + 1 }}</span>
					{{ item.companyName }}
				</div>
			</div>
		</template>
		<default-empty-container :height="'4.2rem'" v-else />
	</div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const props = defineProps({
	title: {
		type: String,
		default: '',
	},
	dataList: {
		type: Array as any,
		default: () => [],
	},
});

const goEnterpriseDetail = (item: any) => {
	router.push({
		name: 'enterpriseDetail',
		query: {
			sccode: item.sccode,
		},
	});
};
</script>
<style lang="less" scoped>
.company-list-wrap {
	width: 100%;
	min-width: 0;
	flex-shrink: 0;
	.compony-list {
		height: 4.2rem;
		overflow-y: auto;
		.list-item {
			width: 100%;
			height: 0.36rem;
			font-size: 0.14rem;
			color: rgba(0, 0, 0, 0.6);
			line-height: 0.36rem;
			padding: 0 0.15rem;
			background: linear-gradient(
				270deg,
				rgba(212, 219, 255, 0) 0%,
				rgba(169, 181, 255, 0.1) 100%
			);
			border-radius: 1rem 0.18rem 0.18rem 1rem;
			border: 0.01rem solid #ffffff;
			margin-bottom: 0.06rem;
			cursor: pointer;
			span {
				margin-right: 0.2rem;
				width: 0.3rem;
				display: inline-block;
				font-size: 0.16rem;
			}
			&:nth-of-type(1) {
				span {
					color: #f4333c;
				}
			}
			&:nth-of-type(2) {
				span {
					color: #fe793b;
				}
			}
			&:nth-of-type(3) {
				span {
					color: #ffb637;
				}
			}
		}
	}
	.empty-container {
		margin-right: 0.06rem;
	}
}
</style>
