<template>
	<SmallTitle :title="`${attrs.indicatorData.indicatorName}指标-${attrs.specialLabel}`">
		<GrowthRateTable
			:height="'5.6rem'"
			:tableData="areaData"
			:tableColumns="tableColumns"
			:special-label="attrs.specialLabel || ''"
			:special-prop="'deptName'"
			@handleSortChange="handleSortChange"
		>
			<template #btn>
				<div class="detail-btn" @click="handleClick">详情</div>
			</template>
			<template #entTags="{ row }">
				<EntTagsView :value="row.entTags" />
			</template>
		</GrowthRateTable>
	</SmallTitle>
</template>
<script lang="ts" setup>
import { ref, useAttrs } from 'vue';
import EntTagsView from '@/components/EntTagsView.vue';
import SmallTitle from '../components/SmallTitle.vue';
import GrowthRateTable from '../components/GrowthRateTable.vue';

const attrs: any = useAttrs();
const areaData = ref<any>([]); // 各区对标数据
const orderProp = ref<string>(''); // 排序字段

// 使用传入的表格字段配置，如果没有则使用默认配置
// eslint-disable-next-line vue/return-in-computed-property, consistent-return
const tableColumns = computed(() => {
	// 如果从 props 传入了 tableColumns，则使用传入的配置
	if (attrs.tableColumns && attrs.tableColumns.length > 0) {
		return attrs.tableColumns;
	}
});

// 获取各区对标数据
const getTabData = async (defaultDate: any) => {
	if (!defaultDate) return;
	areaData.value = [];
};

const getData = () => {
	getTabData(attrs.defaultDate);
};

const handleSortChange = ({ order, prop }: { order: string; prop: string }) => {
	orderProp.value = prop;
	areaData.value = areaData.value.sort((a: any, b: any) => {
		if (order === 'asc') {
			return Number(a[prop]) - Number(b[prop]);
		}
		return Number(b[prop]) - Number(a[prop]);
	});
};

const handleClick = () => {
	console.log('click');
};

watch(
	() => attrs.indicatorData,
	() => {
		getData();
	},
	{
		immediate: true,
		deep: true,
	}
);

watch(
	() => attrs.defaultDate,
	() => {
		getData();
	}
);
</script>
<style lang="less" scoped>
.small-title-wrapper {
	padding-bottom: 0;
	width: 0;
}
.tips {
	color: #202741;
	float: right;
	margin-top: -0.16rem;
}
.detail-btn {
	color: #2d8cf0;
	cursor: pointer;
}
</style>
