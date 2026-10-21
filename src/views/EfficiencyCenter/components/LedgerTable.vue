<template>
	<TitleBody name="全市招商工作任务指标台账">
		<template #extra>
			<SelectDate2 class="date-wrapper" :modelValue="dateValue" @change="handleDateChange" />
		</template>
		<div class="ledger-table">
			<LedgerTableContent :selectDate="dateValue" ref="tableContentRef" v-bind="$attrs" />
			<div class="more" @click="handleJump">查看更多</div>
		</div>
	</TitleBody>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import TitleBody from '@/components/TitleBody.vue';
import useUserStore from '@/stores/user';
import LedgerTableContent from './LedgerTableContent.vue';

const tableContentRef = ref<any>();
const router = useRouter();

const store = useUserStore();

const dateValue = ref(store.dateSelect);

const handleDateChange = (val: any) => {
	dateValue.value = val;
};

const getTableData = () => {
	tableContentRef.value?.getTableData();
};

defineExpose({ getTableData });

const handleJump = () => {
	router.push({
		name: 'indicator-ledger',
	});
};
</script>

<style scoped lang="less">
:deep(.header) {
	align-items: center;
	position: relative;
}
.date-wrapper {
	width: 2.36rem;
	top: 0;
}

.ledger-table {
	height: 100%;
	width: 100%;
	background: #fff;
	padding: 0.24rem;
	box-sizing: border-box;
	border-radius: 0.14rem;
	border: 0.01rem solid;
	position: relative;
}

:deep(.force-native-scroll) {
	height: 73vh;
}

.more {
	width: 5rem;
	height: 0.38rem;
	position: absolute;
	bottom: 0rem;
	left: 50%;
	background: linear-gradient(
		315deg,
		rgba(91, 143, 249, 0.59) 0%,
		#2f6bef 51%,
		rgba(49, 119, 236, 0.48) 100%
	);
	border-radius: 36px 36px 0px 0px;
	text-align: center;
	line-height: 0.38rem;
	font-family:
		PingFangSC,
		PingFang SC;
	font-weight: 500;
	font-size: 0.24rem;
	color: #fff;
	margin-left: -2.5rem;
	cursor: pointer;
	z-index: 99;
}
/*
:deep(.header .name) {
	margin-top: 0.1rem;
	background: url('@/assets/images/EfficiencyCenter/title-icon.png') no-repeat;
	&::before {
		content: '';
		position: absolute;
		width: 0.05rem;
		height: 0.2rem;
		background: #2f6bef;
		top: 0.24rem;
	}
	span {
		font-family:
			PingFangSC,
			PingFang SC;
		font-weight: 600;
		font-size: 0.22rem;
		color: rgba(0, 0, 0, 0.85);
		background: none;
		-webkit-text-fill-color: rgba(0, 0, 0, 0.85);
	}
}
*/
</style>
