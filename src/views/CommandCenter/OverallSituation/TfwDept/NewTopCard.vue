<template>
	<ul class="special-top-card">
		<li v-for="(item, index) in list" :key="index">
			<InfoCard
				v-bind="item"
				:item="item"
				:selected="selectedIndex === Number(index)"
				@click="handleClick(item, Number(index))"
			/>
		</li>
	</ul>
</template>
<script lang="ts" setup>
import type { PropType } from 'vue';
import { isEmpty } from '@/utils';
import { queryOneDeptOneCard } from '@/api/commandCenter/deptOverview';
import InfoCard from './InfoCard.vue';
import { cardData } from './data';

const props = defineProps({
	modelValue: {
		type: String,
		default: '',
	},
	dateValue: {
		type: Object as PropType<{ startTimeStr: string; endTimeStr: string }>,
		default: () => ({ startTimeStr: '', endTimeStr: '' }),
	},
});
const emit = defineEmits(['update:modelValue']);
const list: any = ref([]);

const selectedIndex = ref(0);
const handleClick = (val: any, index: number) => {
	selectedIndex.value = index;
	emit('update:modelValue', val.typeCode);
};

const fillCardData = (resData: any[]) => {
	list.value = cardData.map((ele: any) => {
		const matchedItem = resData.find((r) => r.cardKey === ele.cardKey) || {};
		const onlyCount = ele.cardKey === 'project';
		// 未完成时序目标，显示红色，已完成时序目标，显示绿色，数据缺省样式，用绿色
		let color = 'blue';
		if (!onlyCount && isEmpty(matchedItem.rate)) {
			// 数据缺省
			color = 'green';
		} else if (!onlyCount) {
			// 未完成时序目标，显示红色,已完成时序目标，显示绿色
			color = matchedItem.rate >= 100 ? 'green' : 'red';
		}
		return {
			...ele,
			...matchedItem,
			type: onlyCount ? 'onlyCount' : 'compare',
			subTitle: ele.name,
			typeCode: ele.type,
			color,
		};
	});
	handleClick(list.value[selectedIndex.value], selectedIndex.value);
};
// 初始化卡片
fillCardData([]);

// 防止接口速度慢渲染上个参数接口数据
let requestId = 0;

const getData = () => {
	requestId += 1;
	const currentRequestId = requestId;
	const params = {
		...props.dateValue,
	};
	queryOneDeptOneCard(params)
		.then((res: any) => {
			if (currentRequestId !== requestId) return;
			fillCardData(res.data?.cards || []);
		})
		.catch(() => {
			if (currentRequestId !== requestId) return;
			fillCardData([]);
		});
};
watch(
	() => props.dateValue,
	() => {
		if (!props.dateValue.startTimeStr || !props.dateValue.endTimeStr) return;
		getData();
	},
	{ immediate: true, deep: true }
);
</script>
<style lang="less" scoped>
.special-top-card {
	display: flex;
	height: 1.54rem;
	gap: 0.12rem;
	li {
		flex: 1;
		min-width: 0;
		height: 100%;
		max-width: calc(100% / 5);
		cursor: pointer;
		&:hover {
			transform: translateY(-0.04rem);
			box-shadow: 0 0.08rem 0.2rem rgba(0, 0, 0, 0.1);
			border-radius: 0.08rem;
		}
	}
}
</style>