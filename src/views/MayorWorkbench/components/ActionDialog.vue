<template>
	<el-dialog
		v-model="dialogVisible"
		:title="currentConfig.title"
		width="5.2rem"
		:close-on-click-modal="false"
	>
		<!-- 同意走访：仅提示文本，无表单 -->
		<div v-if="!currentConfig.hasForm" class="agree-tip">确认同意走访？</div>
		<el-form
			v-else
			ref="formRef"
			:model="form"
			:rules="rules"
			:validate-on-rule-change="false"
			label-position="top"
		>
			<el-form-item
				v-for="(item, index) in currentConfig.formItems"
				:key="index"
				:prop="item.prop"
				:label="item.label"
				required
			>
				<el-date-picker
					v-if="item.type === 'month'"
					v-model="form[item.prop]"
					type="month"
					placeholder="请选择月份"
					format="YYYY年MM月"
					value-format="YYYY-MM"
					:teleported="false"
					:disabled-date="disabledDate"
					style="width: 100%"
				/>
				<el-select
					v-else-if="item.type === 'select'"
					v-model="form[item.prop]"
					:teleported="false"
					placeholder="请选择"
					style="width: 100%"
				>
					<el-option
						v-for="option in item.options"
						:key="option.value"
						:label="option.label"
						:value="option.value"
					/>
				</el-select>
				<el-input
					v-else-if="item.type === 'textarea'"
					v-model="form[item.prop]"
					type="textarea"
					:rows="4"
					:placeholder="item.placeholder"
					maxlength="200"
					show-word-limit
				/>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="dialogVisible = false">关闭</el-button>
			<el-button type="primary" :loading="confirmLoading" @click="handleConfirm"
				>确定</el-button
			>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import { ElMessage } from 'element-plus';
import { handleRules } from '@/utils/form';
import {
	agreeVisit,
	assignVisit,
	postponeVisit,
	superviseVisit,
	getVisitLeaderList,
} from '@/api/leaderWorkbench';

const props = defineProps<{
	selectedMonth: number;
}>();

const emit = defineEmits(['refresh', 'assign']);
const nextMonthDate = computed(() => dayjs().startOf('month').toDate());

const dialogVisible = ref(false);
const dialogType = ref<'suspend' | 'assign' | 'supervise' | 'agree'>('suspend');
const selectedCount = ref(0);
const selectedIds = ref<string[]>([]);
const confirmLoading = ref(false);
const leaderOptions = ref<Array<{ label: string; value: string }>>([]);

/** 获取市领导名单 */
const fetchLeaderList = async () => {
	const res = await getVisitLeaderList<Array<{ leaderId: string; fullName: string }>>();
	leaderOptions.value = (res.data || []).map((item) => ({
		label: item.fullName,
		value: item.leaderId,
	}));
};

const disabledDate = (time: Date) => {
	const isBefore = dayjs(time).isBefore(dayjs(nextMonthDate.value), 'day');
	// selectedMonth 为 1-based，dayjs month() 为 0-based，判断是否属于选中的月份
	const isSelectMonth = dayjs(time).month() === props.selectedMonth - 1;
	return isBefore || isSelectMonth;
};

interface FormItemConfig {
	label: string;
	prop: string;
	type: 'month' | 'select' | 'textarea';
	isRequired?: boolean;
	placeholder?: string;
	options?: Array<{ label: string; value: string }>;
}

interface DialogTypeConfig {
	title: string;
	hasForm: boolean;
	formItems: FormItemConfig[];
	// eslint-disable-next-line no-unused-vars
	action?: (..._args: any[]) => Promise<void>;
}

const dialogConfig: Record<string, DialogTypeConfig> = {
	suspend: {
		title: '暂缓走访',
		hasForm: true,
		formItems: [
			{ label: '暂缓月份选择：', prop: 'month', type: 'month', isRequired: true },
			{
				label: '意见说明：',
				prop: 'remark',
				type: 'textarea',
				isRequired: true,
				placeholder: '请输入（限200字）',
			},
		],
		action: async (ids, formVal) => {
			const targetMonth = parseInt(formVal.month.split('-')[1], 10);
			const params = {
				targetMonth,
				targetYear: parseInt(formVal.month.split('-')[0], 10),
				remark: formVal.remark,
			};
			await Promise.all(ids.map((id: any) => postponeVisit({ id, ...params })));
		},
	},
	assign: {
		title: '交办其他市领导',
		hasForm: true,
		formItems: [
			{
				label: '市领导：',
				prop: 'leader',
				type: 'select',
				isRequired: true,
				options: [] as Array<{ label: string; value: string }>,
			},
			{
				label: '意见说明：',
				prop: 'remark',
				type: 'textarea',
				isRequired: true,
				placeholder: '请输入',
			},
		],
		action: async (ids, formVal) => {
			const selectedLeader = leaderOptions.value.find((l) => l.value === formVal.leader);
			if (!selectedLeader) return;
			const params = {
				assignToUserId: selectedLeader.value,
				assignToUserName: selectedLeader.label,
				remark: formVal.remark,
			};
			await Promise.all(ids.map((id: any) => assignVisit({ id, ...params })));
		},
	},
	supervise: {
		title: '一键督办',
		hasForm: true,
		formItems: [
			{
				label: '督办说明：',
				prop: 'remark',
				type: 'textarea',
				isRequired: true,
				placeholder: '请输入（限200字）',
			},
		],
		action: async (ids, formVal) => {
			await Promise.all(
				ids.map((id: any) => superviseVisit({ id, supervisionRemark: formVal.remark }))
			);
		},
	},
	agree: {
		title: '同意走访',
		hasForm: false,
		formItems: [],
		action: async (ids) => {
			await Promise.all(ids.map((id: any) => agreeVisit(id)));
		},
	},
};

const currentConfig = computed(() => {
	const config = dialogConfig[dialogType.value];
	if (dialogType.value === 'assign') {
		return {
			...config,
			formItems: config.formItems.map((item) =>
				item.prop === 'leader' ? { ...item, options: leaderOptions.value } : item
			),
		};
	}
	return config;
});

const rules = computed(() => handleRules(currentConfig.value.formItems));

const form = ref<Record<string, string>>({
	month: '',
	leader: '',
	remark: '',
});

const formRef = ref();

const show = (
	type: 'suspend' | 'assign' | 'supervise' | 'agree',
	count: number,
	ids: string[] = []
) => {
	dialogType.value = type;
	selectedCount.value = count;
	selectedIds.value = ids;
	form.value = {};
	if (type === 'suspend') {
		form.value.month = dayjs().month(props.selectedMonth).format('YYYY-MM');
	}
	if (type === 'assign') {
		fetchLeaderList();
	}
	formRef.value?.resetFields();
	dialogVisible.value = true;
};

const handleConfirm = async () => {
	confirmLoading.value = true;
	try {
		if (currentConfig.value.hasForm) {
			const valid = await formRef.value
				.validate()
				.then(() => true)
				.catch(() => false);
			if (!valid) return;
		}
		await currentConfig.value.action?.(selectedIds.value, form.value).then(() => {
			ElMessage.success('操作成功');
			dialogVisible.value = false;
			form.value = {};
			// 指派其他市领导，重新获取领导列表
			if (dialogType.value === 'assign') {
				emit('assign');
			} else {
				emit('refresh');
			}
		});
	} finally {
		confirmLoading.value = false;
	}
};

defineExpose({ show });
</script>

<style lang="less" scoped>
.agree-tip {
	font-size: 0.2rem;
	color: #333;
	text-align: left;
	line-height: 1.5;
	padding: 0.24rem 0;
}

.el-form {
	:deep(.el-form-item__label) {
		font-size: 0.18rem;
	}
}

:deep(.el-date-editor) {
	--el-input-height: 0.4rem;
	--el-date-editor-monthrange-width: 100%;

	.el-input__wrapper {
		font-size: 0.16rem;
	}

	.el-input__prefix {
		.el-icon {
			font-size: 0.18rem;
		}
	}

	.el-input__suffix {
		.el-icon {
			font-size: 0.16rem;
		}
	}
}

:deep(.el-picker-panel) {
	.el-month-table td {
		padding: 0.06rem 0;
		font-size: 0.16rem;
		.el-date-table-cell__text {
			height: 0.36rem;
			line-height: 0.36rem;
			border-radius: 0.18rem;
			width: 0.64rem;
		}
	}

	.el-popper__arrow {
		display: none;
	}
}

:deep(.el-select) {
	font-size: 0.16rem;

	.el-input__wrapper {
		font-size: 0.16rem;
	}

	.el-input__suffix {
		.el-icon {
			font-size: 0.16rem;
		}
	}
}

:deep(.el-textarea) {
	font-size: 0.16rem;

	.el-textarea__inner {
		font-size: 0.16rem;
		line-height: 0.24rem;
	}

	.el-input__count {
		font-size: 0.14rem;
	}
}

.el-button {
	height: 0.36rem;
	padding: 0 0.16rem;
	font-size: 0.16rem;
}
</style>
