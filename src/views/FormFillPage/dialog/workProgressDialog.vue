<template>
	<el-dialog
		v-model="dialogVisible"
		:title="title"
		:width="width"
		class="enterprise-business-dialog"
		:before-close="handleClose"
	>
		<workProgress ref="dialogContent" :modify="modify" @confirm="handleConfirm" />
		<template #footer>
			<span class="dialog-footer">
				<!-- <div class="button" @click="handleSubmit">{{ confirmText }}</div> -->
				<el-button class="button" type="primary" @click="handleSubmit">提交</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import workProgress from '@/views/FormFillPage/components/workProgress.vue';

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false,
	},
	title: {
		type: String,
		default: '',
	},
	width: {
		type: String,
		default: '99.5%',
	},
	confirmText: {
		type: String,
		default: '提交',
	},
	modify: {
		type: Boolean,
		default: true,
	},
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const dialogVisible = ref(false);
const dialogContent = ref<any>(null);

// 监听外部modelValue变化
watch(
	() => props.modelValue,
	(val) => {
		dialogVisible.value = val;
	}
);

// 监听内部dialogVisible变化
watch(dialogVisible, (val) => {
	emit('update:modelValue', val);
});

const handleClose = () => {
	dialogVisible.value = false;
	emit('cancel');
};

const handleSubmit = async () => {
	if (dialogContent.value) {
		await dialogContent.value.validateAndSubmit();
	}
};

const handleConfirm = (formData: any) => {
	console.log('获取到的所有表单数据:', formData);
	emit('confirm', formData);
	dialogVisible.value = false;
};

const show = () => {
	dialogVisible.value = true;
};
// 暴露重置表单方法
const resetForm = () => {
	if (dialogContent.value) {
		dialogContent.value.resetForm();
	}
};

defineExpose({ resetForm, show });
</script>

<style scoped lang="less">
.dialog-footer {
	display: flex;
	justify-content: center;
	.button {
		width: 1.6rem;
		height: 0.38rem;
		// background: linear-gradient(#1b4df4 0%, #5dc9fc 100%);
		// border-radius: 2px;
		// text-align: center;
		// line-height: 0.38rem;
		cursor: pointer;
	}
}
.enterprise-business-dialog {
	margin-top: 0.3rem;
	margin-bottom: 0rem;
}
</style>
