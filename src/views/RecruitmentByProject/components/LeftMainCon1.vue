<template>
	<div class="left-box fx-c">
		<template v-for="parentItem in menuItems" :key="parentItem.id">
			<SmallTitle :title="parentItem.category" style="margin-bottom: 0.1rem" />
			<div
				v-for="childItem in parentItem.list"
				:key="childItem.id"
				:class="['menu-btn', { 'menu-btn--active': activeId === childItem.industryCode }]"
				@click="handelLeftget(childItem)"
			>
				{{ childItem.industryType }}
			</div>
		</template>
	</div>
	<div class="right-box fx-c">
		<div class="input-box">
			<IconInput
				v-model="inputName"
				placeholder="输入查找招商策划项目"
				@input="hadnelInput"
			/>
		</div>
		<DynamicTable
			:table-data="tableData"
			:max-height="'7.25rem'"
			:columns="columns"
			class="fx-h"
		>
			<template #companyName="{ row }">
				<div class="txtBox" @click="handelRouter(row, '0')">
					<div class="over-ellipsis">
						{{ row.planProjName }}
					</div>
					<img
						class="right-circle"
						src="@/assets/images/RecruitmentByProject/right-circle.png"
					/>
				</div>
			</template>
			<template #followUnit="{ row }">
				<div class="blue-name over-ellipsis" @click="handelRouter(row, '1')">
					{{ row.companyName }}
				</div>
			</template>
		</DynamicTable>
	</div>
	<dialogForm ref="dialogRef" :data="ProjectInfo" />
</template>

<script setup lang="ts">
import { getSize } from '@/utils/index';
import ServiceUrl from '@/utils/url'
import { queryProjectListByIndustryCode, queryProjectInfoById } from '@/api/RecruitmentByProject';
// import { useRouter } from 'vue-router';
import SmallTitle from '@/components/SmallTitle.vue';
import IconInput from '@/views/RecruitmentByProject/components/IconInput.vue';
import DynamicTable from '@/components/table/DynamicTable.vue';
import dialogForm from './dialog.vue';

// 首先定义接口
interface IndustryItem {
	id: number;
	industryCode: number;
	industryType: string;
}

interface MenuItem {
	id: number;
	category: string;
	list: IndustryItem[];
}

interface TableItem {
	id: number;
	planProjName: string;
	planProjDesc: string;
	companyName: string;
	createUnit: string;
	sccode: string;
}

// const router = useRouter();
const props = defineProps({
	projectTab: {
		type: String,
		default: '0',
	},
	leftmenuArr: {
		type: Array as () => MenuItem[],
		default: () => [],
	},
});

const menuItems = ref<MenuItem[]>([]);
const activeId = ref<number>(0);
const inputName = ref<string>('');
const tableData = ref<TableItem[]>([]);
const ProjectInfo = ref<any>({});
const dialogRef = ref<InstanceType<typeof dialogForm> | null>(null);
const isInitialized = ref(false);

const columns = ref([
	{
		prop: 'planProjName',
		label: '策划项目名称',
		width: getSize(240),
		type: 'slot',
		slotName: 'companyName',
	},
	{
		prop: 'planProjDesc',
		label: '策划项目概述',
		align: 'center',
	},
	{
		prop: 'companyName',
		label: '相关企业',
		align: 'center',
		type: 'slot',
		slotName: 'followUnit',
	},
	{
		prop: 'createUnit',
		label: '策划单位',
		align: 'center',
	},
]);

// 查询列表industryCode企业id,projectName名称模糊查询
const getqueryProjectListByIndustryCode = async (industryCode: number, projectName: string) => {
	try {
		const res = await queryProjectListByIndustryCode({ industryCode, projectName });
		const resData: any = res?.data;

		if (resData) {
			tableData.value = resData.map((item: any) => ({
				id: item.id,
				planProjName: item.planProjName,
				planProjDesc: item.planProjDesc,
				companyName: item.companyName,
				createUnit: item.createUnit,
				sccode: item.sccode,
			}));
		}
	} catch (error) {
		console.error('获取项目列表失败:', error);
	}
};

const handelLeftget = (item: IndustryItem) => {
	getqueryProjectListByIndustryCode(item.industryCode, '');
	activeId.value = item.industryCode;
	inputName.value = '';
};

// 输入模糊查询
const hadnelInput = () => {
	getqueryProjectListByIndustryCode(activeId.value, inputName.value);
};

// 优秀策划详情
const getqueryProjectInfoById = async (id: number) => {
	try {
		const res = await queryProjectInfoById({ id });
		const resData = res?.data;

		if (resData) {
			ProjectInfo.value = resData;
		}
	} catch (error) {
		console.error('获取项目详情失败:', error);
	}
};

const handelRouter = (item: TableItem, type: string) => {
	if (type === '1') {
		/*
		router.push({
			path: '/runByEnterprise/enterpriseDetail',
			query: {
				sccode: item.sccode || '',
			},
		});
		*/
		window.open(
			`${ServiceUrl.adminUrl}enterprise-form/enterprise-details?name=${item.companyName}&sccode=${item.sccode}`,
			'_blank'
		);
	} else {
		dialogRef.value?.show();
		getqueryProjectInfoById(item.id);
	}
};

watch(
	() => props.leftmenuArr,
	(newVal: MenuItem[]) => {
		// 只有当leftmenuArr有数据且包含有效的list时才执行
		const hasValidData = newVal?.length > 0 && newVal[0]?.list?.length > 0;

		if (hasValidData) {
			// 如果是首次初始化，设置默认选中项
			if (!isInitialized.value || activeId.value !== newVal[0].list[0].industryCode) {
				const firstIndustryCode = newVal[0].list[0].industryCode;
				activeId.value = firstIndustryCode;
				getqueryProjectListByIndustryCode(firstIndustryCode, '');
				isInitialized.value = true;
			}

			menuItems.value = newVal;
		}
	},
	{ immediate: true, deep: true }
);
</script>

<style lang="less" scoped>
.left-box {
	width: 2.8rem;

	.menu-btn {
		position: relative;
		height: 0.38rem;
		line-height: 0.38rem;
		font-size: @g-font-size-base;
		padding: 0 0.16rem;
		cursor: pointer;
		user-select: none;
		transition: all 0.3s ease;
		box-sizing: border-box;
		margin-bottom: 0.08rem;
		width: 2.5rem;
		color: rgba(0, 0, 0, 0.6);
		background: url('@/assets/images/RecruitmentByProject/no.png') no-repeat;
		background-size: 100% 100%;

		&--active {
			width: 2.7rem;
			color: #fff;
			background: url('@/assets/images/RecruitmentByProject/yes.png') no-repeat;
			background-size: 100% 100%;
		}

		&:not(.menu-btn--active):hover {
			opacity: 0.9;
			transform: translateX(0.05rem);
		}
	}
}

.right-box {
	width: calc(100% - 2.8rem);
	flex: 1;
	padding: 0 0.2rem;
	box-shadow: 0px 0px 0.08rem 0px rgba(25, 43, 138, 0.34);
	border-radius: 0.14rem 0px 0.14rem 0.14rem;
	border: 0.02rem solid;
	background: url('../../../assets//images//RecruitmentByProject/qy.png') no-repeat;
	background-size: cover;

	.input-box {
		width: 2.94rem;
		margin: 0.32rem 0;
	}
}
.blue-name{
	color: #165dff;
}
.txtBox {
	display: flex;
	align-items: center;
	color: #165dff;
	cursor: pointer;

	div {
		width: 95%;
		overflow: hidden;
	}

	.right-circle {
		width: 0.175rem;
		height: 0.175rem;
		position: absolute;
		right: 0.08rem;
	}
}
</style>
