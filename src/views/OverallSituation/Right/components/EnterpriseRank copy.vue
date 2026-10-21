<!--
 * @Descripttion: 企业榜单表格
 * @Author: zhaochao
 * @Date: 2025-09-08 09:31:21
 * @LastEditors: zhaochao
 * @LastEditTime: 2026-01-06 09:52:26
-->
<template>
	<div class="rank-list-box">
		<div class="list-items header fx-r">
			<p v-for="(item, index) in headers" :key="index" class="list-common-item">
				{{ item.label }}
				<!-- 只对指定字段显示排序按钮 -->
				<template v-if="item.prop === 'projectCount' || item.prop === 'totalInvestment'">
					<div class="sort-box">
						<button
							class="sort-btn"
							@click="handleSort(item.prop, 'asc')"
							title="升序"
						>
							<el-icon size="12px"><CaretTop /></el-icon>
						</button>

						<button
							class="sort-btn"
							@click="handleSort(item.prop, 'desc')"
							title="降序"
						>
							<el-icon size="12px"><CaretBottom /></el-icon>
						</button>
					</div>
				</template>
			</p>
		</div>
		<div class="body-content" v-if="listData.length > 0">
			<div
				class="list-items body-items fx-r"
				v-for="(item, index) in listData"
				:key="(currentPage - 1) * pageSize + index"
				@click="goEnterpriseDetail(item)"
			>
				<div
					class="list-common-item text-ellipsis"
					v-for="(h, hIndex) in headers"
					:key="hIndex"
					:title="item[h.prop]"
				>
					<template v-if="h.type === 'index'">
						{{ (currentPage - 1) * pageSize + index + 1 }}
					</template>
					<template v-else-if="h.type === 'orderTags'">
						<div class="rank-desc">
							<div v-if="item.isPlan === '1'">有策划</div>
							<div v-if="item.isVisit === '1'" class="yellow">有拜访</div>
						</div>
					</template>
					<template v-else>
						{{ item[h.prop] || '0' }}
					</template>
				</div>
			</div>
			<div class="page-box">
				<el-pagination
					:page-size="pageSize"
					layout="prev, pager, next"
					:total="total"
					:current-page="currentPage"
					@current-change="handleCurrentChange"
				/>
			</div>
		</div>
		<default-empty-container :height="'3.2rem'" v-else />
	</div>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router';

const emit = defineEmits(['changePage', 'sortChange']);
const router = useRouter();
// 添加当前页码状态
const currentPage = ref(1);
const pageSize = 5;
const props = defineProps({
	rankList: {
		type: Object,
		default: () => ({
			header: [],
			listData: [],
			total: 0,
		}),
	},
});
const headers = computed(() => props.rankList.header);
const listData = computed(() => props.rankList.listData);
const total = computed(() => props.rankList.total);

// 计算当前页数据
// const paginatedData = computed(() => {
//   const start = (currentPage.value - 1) * pageSize;
//   const end = start + pageSize;
//   return listData.value.slice(start, end);
// });

// 处理页码变更
const handleCurrentChange = (page: any) => {
	currentPage.value = page;
	emit('changePage', { page, pageSize });
};
const goEnterpriseDetail = (item: any) => {
	router.push({
		name: 'enterpriseDetail',
		query: {
			sccode: item.sccode,
		},
	});
};

// ----------------------- 排序-------------------------
const sortConfig = ref<Record<string, { direction: 'asc' | 'desc' }>>({
	projectCount: { direction: 'asc' },
	totalInvestment: { direction: 'asc' },
});
const handleSort = (prop: string, direction: 'asc' | 'desc') => {
	if (sortConfig.value[prop]) {
		sortConfig.value[prop].direction = direction;
	}
	emit('sortChange', { prop, direction });
};
// ----------------------- 排序-------------------------

onMounted(() => {
	handleCurrentChange(1);
	//   currentPage.value = 1; // 初始化页码
});

defineExpose({
	handleCurrentChange,
});	
</script>
<style lang="less" scoped>
.rank-list-box {
	height: 100%;
	width: 100%;
	overflow-y: auto;
	.body-content {
		height: 2.55rem;
		overflow-y: auto;
		.page-box {
			display: flex;
			justify-content: center;
			margin-top: 0.1rem;
			padding: 0 0.1rem;
			box-sizing: border-box;

      :deep(.el-pagination){
        font-size: @g-font-size-base;
        color: rgba(0,0,0,0.6);
        background-color: transparent;
        --el-pagination-bg-color: transparent;
        --el-pagination-button-disabled-bg-color: transparent;
        .el-pager{
          gap: 0.08rem;
          li{
            width: 0.32rem;
            height: 0.3rem;
            line-height: 0.3rem;
            border-radius: 0.03rem;
            background: rgba(255,255,255,0.9);
            border: 0.01rem solid #DCDCDC;
            padding: 0;
            font-size: @g-font-size-base;
            min-width: 0.32rem;
            &.is-active{
              font-weight: 400;
              border: 0.01rem solid #165DFFFF;
              color: #165DFF;
            }
          }
        }
      }
    }
	}
	.list-items {
		.list-common-item {
			display: flex;
			align-items: flex-start;
			height: 0.36rem;
			line-height: 0.36rem;
			font-weight: 500;
			font-size: @g-font-size-base;
			color: rgba(0, 0, 0, 0.7);
			padding: 0 0.016rem 0 0.16rem;
			&:nth-child(1) {
				width: 0.6rem;
			}
			&:nth-child(2) {
				flex: 1;
			}
			//&:nth-child(3) {
			//	text-align: center !important;
			//}
			&:nth-child(n + 3) {
				flex: 1;
				text-align: center !important;
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
					font-size: @g-font-size-x-small;
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
					//color: #176bf9 !important;
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

.sort-box {
	display: flex;
	flex-direction: column;
	.sort-btn {
		// margin-left: 0.1rem;
		width: 0.2rem;
		height: 0.2rem;
		background: none;
		border: none;
		cursor: pointer;
		font-size: 0.14rem;
		color: #666;
		&:hover {
			color: #165dff;
		}
	}
}
</style>
