<!-- 自定义栏目 -->
<template>
	<div class="module-config">
		<div class="setting-trigger" @click="handleOpen">
			<div class="img-box">
				<img src="@/assets/images/DeptOverview/moudle-setting.svg" alt="" />
			</div>
			<span>自定义栏目</span>
		</div>

		<el-dialog
			v-model="visible"
			title="自定义栏目"
			width="6.4rem"
			class="module-config-dialog"
			:close-on-click-modal="false"
		>
			<div class="dialog-content">
				<div class="content-header">
					<span class="tip">开启后，该栏目卡片将在页面顶部展示</span>
					<div class="show-all">
						<el-checkbox v-model="showAll" @change="handleShowAll" />
						<span>全部显示</span>
					</div>
				</div>

				<el-scrollbar class="group-scrollbar">
					<div class="group-list">
						<div v-for="group in menuList" :key="group.key" class="group-item">
							<div class="group-header" @click="toggleExpand(group.key)">
								<div class="group-title">
									<el-icon
										class="expand-icon"
										:class="{ 'is-expand': expandedMap[group.key] }"
									>
										<ArrowRight />
									</el-icon>
									<span>{{ group.name }}</span>
								</div>
								<el-checkbox
									v-model="group.enabled"
									:true-label="1"
									:false-label="0"
									:indeterminate="group.indeterminate"
									@change="handleGroupChange(group)"
									@click.stop
								/>
							</div>
							<div v-show="expandedMap[group.key]" class="group-children">
								<div
									v-for="item in group.children"
									:key="item.id"
									class="child-item"
								>
									<span class="child-name">{{ item.name }}</span>
									<el-checkbox
										v-model="item.checked"
										:true-label="1"
										:false-label="0"
										@change="() => handleChildChange(group)"
									/>
								</div>
							</div>
						</div>
					</div>
				</el-scrollbar>
			</div>

			<template #footer>
				<div class="dialog-footer">
					<el-button @click="visible = false">取消</el-button>
					<el-button type="primary" :loading="saveLoading" @click="handleSave"
						>保存配置</el-button
					>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" setup>
import { ref, reactive, nextTick } from 'vue';
import { ElMessage } from 'element-plus';
import {
	getOneDeptOneMenuList,
	saveOneDeptOneMenuRelBatch,
} from '@/api/commandCenter/deptOverview';

defineOptions({ name: 'ModuleConfig' });

const emit = defineEmits(['refresh']);
const props = defineProps({
	deptCode: {
		type: String,
		default: '',
	},
});

interface MenuItem {
	id: number;
	key: string;
	name: string;
	enabled: number;
	isSelect: boolean;
	checked: number;
}

interface MenuGroup {
	key: string;
	name: string;
	children: MenuItem[];
	enabled: number;
	indeterminate: boolean;
}

const visible = ref(false);
const menuList = ref<MenuGroup[]>([]);
const expandedMap = reactive<Record<string, boolean>>({});
const saveLoading = ref(false);
const syncingFromChild = ref(false);
const showAll = ref(false);

const transformData = (data: any[]): MenuGroup[] => {
	if (!Array.isArray(data)) return [];
	return data.map((group) => {
		const children = (group.children || []).map((item: any) => ({
			...item,
			checked: item.isSelect ? 1 : 0,
		}));
		const groupEnabled = children.some((item: MenuItem) => item.checked === 1) ? 1 : 0;
		const groupIndeterminate =
			!children.every((item: MenuItem) => item.checked === 1) &&
			children.some((item: MenuItem) => item.checked === 1);
		return {
			key: group.key,
			name: group.name,
			children,
			enabled: groupEnabled,
			indeterminate: groupIndeterminate,
		};
	});
};
/** 同步“全部显示”复选框状态：所有子项都选中时置为勾选 */
const syncShowAll = () => {
	showAll.value = menuList.value.every((group) =>
		group.children.every((item) => item.checked === 1)
	);
};

const fetchMenuList = async () => {
	try {
		const res = await getOneDeptOneMenuList<any>({ deptCode: props.deptCode || undefined });
		if (res.data) {
			menuList.value = transformData(res.data);
			nextTick(() => {
				const firstGroup = menuList.value[0];
				if (firstGroup) {
					expandedMap[firstGroup.key] = true;
				}
			});
			syncShowAll();
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('获取菜单列表失败', error);
	}
};

const handleOpen = () => {
	visible.value = true;
	fetchMenuList();
};

const toggleExpand = (type: string) => {
	expandedMap[type] = !expandedMap[type];
};

const handleShowAll = (val: boolean) => {
	const value = val ? 1 : 0;
	menuList.value.forEach((group) => {
		group.enabled = value;
		group.indeterminate = false;
		group.children.forEach((item) => {
			item.checked = value;
		});
	});
};

/** 父级复选框变更：同步所有子级 */
const handleGroupChange = (group: MenuGroup) => {
	// 来自子级变更触发的父级更新，不需要再次同步子级
	if (syncingFromChild.value) return;
	group.indeterminate = false;
	group.children.forEach((item) => {
		item.checked = group.enabled;
	});
	syncShowAll();
};

/** 子级复选框变更：更新父级状态 */
const handleChildChange = (group: MenuGroup) => {
	syncingFromChild.value = true;
	const checkedCount = group.children.filter((item) => item.checked === 1).length;
	group.enabled = checkedCount === group.children.length ? 1 : 0;
	group.indeterminate = checkedCount > 0 && checkedCount < group.children.length;
	syncShowAll();
	// 通过 nextTick 重置标志，确保父级 @change 在当前微任务周期被拦截
	nextTick(() => {
		syncingFromChild.value = false;
	});
};

const handleSave = async () => {
	// 收集所有已选中的菜单ID
	const menuIds: number[] = [];
	menuList.value.forEach((group) => {
		group.children.forEach((item) => {
			if (item.checked === 1) {
				menuIds.push(item.id);
			}
		});
	});
	if (menuIds.length === 0) {
		ElMessage.error('请至少选择一个菜单');
		return;
	}
	saveLoading.value = true;
	try {
		await saveOneDeptOneMenuRelBatch({
			deptCode: props.deptCode || undefined,
			menuIds,
		});
		ElMessage.success('保存成功');
		emit('refresh');
		visible.value = false;
	} catch {
		ElMessage.error('保存失败');
	} finally {
		saveLoading.value = false;
	}
};
</script>

<style lang="less" scoped>
.module-config {
	width: 1.72rem;
	height: 0.36rem;
	background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 100%);
	border-radius: 0.18rem;
	display: flex;
	align-items: center;
	padding-left: 0.05rem;

	.setting-trigger {
		display: flex;
		align-items: center;
		color: #165dff;
		font-weight: 500;
		font-size: 0.16rem;
		cursor: pointer;
		.img-box {
			width: 0.36rem;
			height: 0.36rem;
			border-radius: 50%;
			text-align: center;
			background: linear-gradient(
				180deg,
				rgba(92, 164, 248, 0.13) 0%,
				rgba(47, 107, 239, 0.13) 100%
			);
			margin-right: 0.12rem;
			position: relative;
			&::before {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				content: '';
				display: block;
				width: 0.28rem;
				height: 0.28rem;
				border-radius: 50%;
				background: linear-gradient(180deg, #5b8ff9 0%, #afcdff 100%);
			}
			img {
				width: 0.12rem;
				height: 0.12rem;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
	}
	&:hover {
		position: relative;
		border-radius: 0.18rem;
		background: linear-gradient(270deg, rgba(255, 255, 255, 0) 0%, #ffffff 100%);
		&::before {
			content: '';
			position: absolute;
			inset: -0.01rem;
			border-radius: 0.18rem;
			padding: 0.02rem;
			background: linear-gradient(270deg, rgba(63, 132, 255, 0), rgba(63, 132, 255, 1));
			-webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
			-webkit-mask-composite: xor;
			mask-composite: exclude;
			pointer-events: none;
		}
		.img-box::before {
			background: linear-gradient(180deg, #4172f6 0%, #2f6bef 100%);
		}
	}
}

.module-config-dialog {
	:deep(.el-dialog__body) {
		padding: 0.2rem 0.24rem;
	}
}

.dialog-content {
	.content-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.16rem;
		.tip {
			font-size: 0.14rem;
			color: #999999;
		}
		.show-all {
			display: flex;
			align-items: center;
			font-size: 0.16rem;
			color: #333333;
			cursor: pointer;
			.el-checkbox {
				margin-right: 0.04rem;
			}
		}
	}
}

.group-scrollbar {
	height: 4.5rem;
}

.group-list {
	display: flex;
	flex-direction: column;
	gap: 0.12rem;
}

.group-item {
	border-radius: 0.06rem;
	overflow: hidden;
	border: 1px solid #f0f0f0;
}

.group-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.12rem 0.24rem 0.12rem 0.16rem;
	background-color: #f5f7fa;
	cursor: pointer;
	.group-title {
		display: flex;
		align-items: center;
		font-size: 0.18rem;
		color: #333333;
		font-weight: 500;
		.expand-icon {
			font-size: 0.14rem;
			margin-right: 0.08rem;
			transition: transform 0.2s;
			&.is-expand {
				transform: rotate(90deg);
			}
		}
	}
}

.group-children {
	padding: 0.08rem 0;
	background-color: #ffffff;
}

.child-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 0.1rem 0.24rem 0.1rem 0.38rem;
	font-size: 0.16rem;
	color: #333333;
	.child-name {
		flex: 1;
	}
}

.dialog-footer {
	display: flex;
	justify-content: flex-end;
	gap: 0.12rem;
}

.el-checkbox {
	height: 0.24rem;
	--el-checkbox-checked-text-color: #165dff;
	--el-checkbox-checked-bg-color: #165dff;
	--el-checkbox-checked-input-border-color: #165dff;
	--el-checkbox-input-border-color-hover: #165dff;
}
</style>
