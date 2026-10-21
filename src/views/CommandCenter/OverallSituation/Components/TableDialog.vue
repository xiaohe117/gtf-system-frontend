<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-08-15 17:01:12
 * @LastEditors: ycyun
 * @LastEditTime: 2026-05-15 10:55:42
-->
<template>
	<el-dialog
		v-model="dialogVisible"
		width="13.84rem"
		:append-to-body="true"
		:before-close="handleClose"
		:title="title"
	>
		<template #header>
			<TitleBody name="市属国企">
				<template #extra>
					<div class="search-box">
						<el-input
							v-model.trim="search.companyName"
							placeholder="请输入市属国企搜索"
							@input="debouncedSearch"
							clearable
							maxlength="100"
						>
							<template #prefix>
								<el-icon><Search /></el-icon>
							</template>
						</el-input>
						<el-select
							suffix-icon="CaretBottom"
							v-model="search.type"
							placeholder="请选择类型"
							@change="searchFunc"
							clearable
						>
							<el-option
								v-for="o in typeList"
								:key="o.code"
								:label="o.name"
								:value="o.code"
							/>
						</el-select>
					</div>
				</template>
			</TitleBody>
		</template>

		<MultiHeaderTable
			:isPage="true"
			hasOrder
			v-loading="listLoading"
			:tableData="tableData"
			:columns="columns"
			:total="page.total"
			:current="page.current"
			@handleSizeChange="handleSizeChange"
			@handleCurrentChange="handleCurrentChange"
			height="5.4rem"
		>
		</MultiHeaderTable>
	</el-dialog>
</template>
<script lang="ts" setup>
import { getSize } from '@/utils';
import { debounce } from 'lodash-es';
import { getEntList } from '@/api/commandCenter/deptOverview';

interface TypeItem {
	code: string;
	name: string;
}

interface SearchParams {
	companyName?: string;
	type?: string;
}

defineProps({
	typeList: {
		type: Array as () => TypeItem[],
		default: () => [],
	},
});
const dialogVisible: any = ref(false);

const emit = defineEmits(['close']);

const handleClose = () => {
	dialogVisible.value = false;
	emit('close');
};
const tableData = ref([]) as any;

const columns: any = ref([
	{
		prop: 'companyName',
		label: '市属国企',
		align: 'left',
	},
	{
		prop: 'type',
		label: '类型',
		width: getSize(449),
		align: 'left',
	},
]);
const search = ref<SearchParams>({});
const page = ref<any>({
	size: 10,
	current: 1,
	total: 0,
});
const listLoading = ref(false)
const getList = () => {
	const params = {
		page: page.value.current,
		pageSize: page.value.size,
		...search.value,
	};
	listLoading.value = true
	getEntList(params).then((res: any) => {
		tableData.value = res.data?.records || [];
		page.value.total = res.data?.total;
	}).finally(() => {
		listLoading.value = false
	})
};
const searchFunc = () => {
	page.value.current = 1;
	getList();
};
const debouncedSearch = debounce(searchFunc, 500);
const handleSizeChange = (size: number) => {
	page.value.size = size;
	getList();
};
const handleCurrentChange = (current: number) => {
	page.value.current = current;
	getList();
};
const title = ref('');
const show = () => {
	page.value.current = 1;
	page.value.total = 0;
	search.value = {}
	getList();
	dialogVisible.value = true;
};

defineExpose({ show });
</script>
<style lang="less" scoped>
.search-box {
	display: flex;
	gap: 0.16rem;
	.el-input,
	.el-select {
		width: 2.32rem;
	}
	:deep(.el-select__prefix),
	:deep(.el-select__wrapper),
	:deep(.el-input__wrapper) {
		font-family: PingFangSC, PingFang SC;
		font-weight: 400;
		color: rgba(0, 0, 0, 0.65);
		font-size: @g-font-size-base;
		height: 0.36rem;
		line-height: 0.36rem;
		min-height: 0.36rem;
		border-radius: 0.02rem;
	}
	:deep(.el-input__inner),
	:deep(.el-input__prefix-inner) {
		font-size: @g-font-size-base;
		height: 0.34rem;
		line-height: 0.34rem;
		color: rgba(0, 0, 0, 0.65);
	}
}
</style>