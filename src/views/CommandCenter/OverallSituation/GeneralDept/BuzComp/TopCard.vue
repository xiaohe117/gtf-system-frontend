<!--
 * @Descripttion: 通用部门总览 - 顶部卡片列表
 * @Author: ycyun
 * @Date: 2026-08-06
-->
<template>
	<ul class="top-card-list" v-loading="loading">
		<li v-for="card in cardList" :key="card.key" @click="handleClick(card)">
			<div
				class="info-card"
				:class="[card.colorClass, { selected: selectedKey === card.key }]"
			>
				<div class="card-title">
					{{ card.name }}
				</div>
				<div class="card-body">
					<template v-for="item in card.items" :key="item.key">
						<!-- 普通指标 -->
						<div v-if="item.type !== 'progress'" class="normal-item">
							<span class="item-label">{{ item.label }}</span>
							<span class="item-value">{{ getNumberStr(card.data[item.key]) }}</span>
							<span class="item-suffix">{{ card.data[item.unit] }}</span>
						</div>
						<!-- 目标完成率指标 -->
						<div v-else class="progress-item">
							<span class="item-label">{{ item.label }}</span>
							<span :class="card.colorClass" class="item-value value">{{
								getNumberStr(card.data.target)
							}}</span>
							<span class="item-suffix">{{  card.data.targetUnit }}</span>
							<span class="split">/</span>
							<span :class="card.colorClass" class="item-value rate">{{
								getNumberStr(card.data.rate, )
							}}</span>
							<span class="item-suffix" v-if="!isEmpty(card.data.rate)">%</span>
						</div>
					</template>
				</div>
			</div>
		</li>
	</ul>
</template>

<script lang="ts" setup>
import { isEmpty } from '@/utils';
import { getOneDeptOneMenuRelList } from '@/api/commandCenter/deptOverview';
import { getNumberStr } from '../../DeptOverview/data';
import { cardConfig } from '../config';

defineOptions({ name: 'TopCard' });

const props = defineProps({
	modelValue: {
		type: Object as PropType<any>,
		default: () => ({}),
	},
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
	deptCode: {
		type: String,
		default: '',
	},
});

const emit = defineEmits<{
	'update:modelValue': [value: any];
	'getIsEmpty': [value: boolean];
}>();

const selectedKey = ref('');
const cardList = ref<any[]>([]);

/** 点击卡片 */
const handleClick = (card: any) => {
	selectedKey.value = card.key;
	emit('update:modelValue', card);
};
const loading = ref(false);
/** 获取绑定的卡片信息 */
const getCardList = () => {
	const params = {
		deptCode: props.deptCode,
		...props.dateValue,
	};
	loading.value = true;
	getOneDeptOneMenuRelList(params)
		.then((res: any) => {
			cardList.value = [];
			res.data?.forEach((item: any) => {
				const obj = cardConfig[item.key];
				const headCard = item.headCard || {}
				let colorClass = 'blue'
				if (!isEmpty(headCard.rate)) {
					colorClass = headCard.rate >= 100 ? 'green' : 'red'
				}
				if (obj) {
					cardList.value.push({
						...item,
						...obj,
						data: headCard,
						colorClass,
					});
				}
			});
			if (cardList.value.length > 0 && !cardList.value.find((card: any) => card.key === selectedKey.value)) {
				handleClick(cardList.value[0]);
			}
			emit('getIsEmpty', cardList.value.length === 0)
		})
		.finally(() => {
			loading.value = false;
		});
};
// 监听字符串，避免props.dateValue对象指针修改，但实际时间内容是没改动的
const watchDateValue = computed(() => `${props.dateValue.startTimeStr} - ${props.dateValue.endTimeStr}`)
watch(
	() => watchDateValue.value,
	() => {
		if (!props.dateValue.startTimeStr || !props.dateValue.endTimeStr) return;
		getCardList();
	},
	{ immediate: true, deep: true }
);
const refresh = () => {
	getCardList();
};
defineExpose({ refresh });
</script>

<style lang="less" scoped>
@text-red: #df5953;
@text-green: #17ba7f;
@text-blue: #165dff;

.top-card-list {
	display: flex;
	height: 1.54rem;
	gap: 0.12rem;
	font-size: 0.16rem;
	li {
		flex: 1;
		min-width: 0;
		height: 100%;
		cursor: pointer;
		max-width: 4rem;
		&:hover {
			transform: translateY(-0.04rem);
			box-shadow: 0 0.08rem 0.2rem rgba(0, 0, 0, 0.1);
			border-radius: 0.08rem;
		}
	}
}

.info-card {
	width: 100%;
	height: 100%;
	background-color: #ffffff;
	position: relative;
	border-radius: 0.08rem;
	box-shadow: 0 0.02rem 0.08rem rgba(0, 0, 0, 0.08);
	background-image: url(@/assets/images/DeptOverview/card-blue-g.png);
	background-size: 100% 100%;

	.number {
		font-family: DIN-Condensed-Bold;
	}

	&.red {
		background-image: url(@/assets/images/DeptOverview/card-red-g.png);
		.number {
			color: @text-red;
		}
		&.selected {
			border-color: @text-red;
			&::after {
				border-top-color: @text-red;
			}
		}
		.progress-item {
			.rate{
				color: @text-red;
			}
		}
	}

	&.green {
		background-image: url(@/assets/images/DeptOverview/card-green-g.png);
		.number {
			color: @text-green;
		}
		&.selected {
			border-color: @text-green;
			&::after {
				border-top-color: @text-green;
			}
		}
		.progress-item {
			.rate{
				color: @text-green;
			}
		}
	}

	&.blue {
		.number {
			color: @text-blue;
		}
	}

	&.selected {
		border: 0.03rem solid @text-blue;
		box-sizing: border-box;
		border-radius: 0.16rem;

		&::after {
			content: '';
			position: absolute;
			bottom: -0.16rem;
			left: 50%;
			transform: translateX(-50%);
			width: 0;
			height: 0;
			border-left: 0.16rem solid transparent;
			border-right: 0.16rem solid transparent;
			border-top: 0.16rem solid @text-blue;
		}
	}

	.card-title {
		height: 0.54rem;
		font-family: PingFangSC, PingFang SC, SourceHanSansCN-Bold, SourceHanSansCN;
		font-weight: 600;
		color: #ffffff;
		line-height: 0.46rem;
		padding-left: 0.32rem;
		font-size: 0.2rem;
	}

	.card-body {
		padding: 0.08rem 0.16rem;
	}

	.normal-item,
	.progress-item {
		display: flex;
		align-items: baseline;
		color: rgba(0, 0, 0, 0.66);
		margin-bottom: 0.08rem;
		font-size: 0.16rem;
		white-space: nowrap;

		.item-label {
			flex: 1;
			margin-right: 0.08rem;
			white-space: nowrap;
		}

		.item-value {
			font-family: DIN-Condensed-Bold;
			color: #595959;
			font-size: 0.24rem;
			line-height: 0.32rem;
			&.value{
				color: #3F84FF;
			}
		}
		.split{
			margin: 0 0.04rem;
			font-family: DIN-Condensed-Bold;
			color: #595959;
			font-size: 0.24rem;
			line-height: 0.32rem;
		}
		.item-suffix {
			color: rgba(0, 0, 0, 0.6);
			margin-left: 0.04rem;
			font-size: 0.14rem;
		}
	}
}
</style>
