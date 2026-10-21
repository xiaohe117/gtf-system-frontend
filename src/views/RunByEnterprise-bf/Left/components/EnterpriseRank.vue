<!--
 * @Descripttion: 企业榜单表格
 * @Author: zhaochao
 * @Date: 2025-09-08 09:31:21
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-09-09 14:55:05
-->
<template>
	<div class="rank-list-box">
		<div class="list-items header fx-r">
			<p v-for="(item, index) in headers" :key="index" class="list-common-item">
				{{ item.label }}
			</p>
		</div>
		<template v-if="listData.length > 0">
			<div class="body-content">
				<div
					class="list-items body-items fx-r"
					v-for="(item, index) in listData"
					:key="index"
					@click="goEnterpriseDetail(item)"
				>
					<p
						class="list-common-item text-ellipsis"
						v-for="(h, hIndex) in headers"
						:key="hIndex"
						:title="item[h.prop]"
					>
						<template v-if="h.type === 'index'">
							{{ index + 1 }}
						</template>
						<template v-else-if="h.type === 'orderTags'">
							<div class="rank-desc">
								<div v-if="item.isPlan === '1'">有策划</div>
								<div v-if="item.isVisit === '1'" class="yellow">有拜访</div>
							</div>
						</template>
						<template v-else>
							{{ item[h.prop] || '--' }}
						</template>
					</p>
				</div>
			</div>
		</template>
		<default-empty-container :height="'4.0rem'" v-else />
	</div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
	rankList: {
		type: Object,
		default: () => ({
			header: [],
			listData: [],
		}),
	},
});
const headers = computed(() => props.rankList.header);
const listData = computed(() => props.rankList.listData);

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
.rank-list-box {
	height: 100%;
	width: 100%;
	overflow-y: auto;
	.body-content {
		height: 4rem;
		overflow-y: auto;
	}
	.list-items {
		.list-common-item {
			height: 0.36rem;
			line-height: 0.36rem;
			font-weight: 500;
			font-size: 0.16rem;
			color: rgba(0, 0, 0, 0.7);
			padding: 0 0.08rem 0 0.16rem;
			&:nth-child(1) {
				width: 0.6rem;
			}
			&:nth-child(2) {
				flex: 2 !important;
			}
			&:nth-child(3) {
				text-align: center !important;
			}
			&:nth-child(n + 3) {
				flex: 1;
			}
			&.text-ellipsis {
				text-align: left;
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			.rank-desc {
				display: flex;
				gap: 0.04rem;
				align-items: center;
				justify-content: center;
				height: 100%;
				> div {
					width: 0.55rem;
					height: 0.18rem;
					background: #00c462;
					border-radius: 0.01rem;
					font-family: MicrosoftYaHei;
					font-size: 0.11rem;
					color: #ffffff;
					line-height: 0.18rem;
					&.yellow {
						background: #ffc359;
					}
				}
			}
		}
		&.header {
			margin-bottom: 0.12rem;
			.list-common-item {
				color: rgba(0, 0, 0, 0.7) !important;
			}
		}
		&.body-items {
			position: relative;
			cursor: pointer;
			height: 0.36rem;
			background: rgba(169, 181, 255, 0.1);
			border-radius: 1rem;
			border: 0.01rem solid #ffffff;
			&:not(:last-child) {
				margin-bottom: 0.05rem;
			}
			.list-common-item {
				color: #4b4b4b !important;
				font-weight: 400;
				&:nth-child(2) {
					color: #176bf9 !important;
				}
			}
		}
		&.active {
			background: linear-gradient(180deg, #1b4df4 0%, #5dc9fc 100%);
			.list-common-item {
				color: #ffffff;
			}
			&::after {
				position: absolute;
				right: -0.22rem;
				content: '';
				display: inline-block;
				width: 0;
				height: 0;
				border-top: 0.16rem solid transparent;
				border-bottom: 0.16rem solid transparent;
				border-left: 0.16rem solid #ff8900;
			}
		}
	}
}
</style>
