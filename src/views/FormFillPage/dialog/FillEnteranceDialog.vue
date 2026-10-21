<template>
	<el-dialog
		v-model="dialogVisible"
		:title="title"
		class="fill-enterance-dialog"
		:append-to-body="true"
		:width="width"
	>
		<FillEnteracne ref="fillEnteranceForm" @close="close" />

		<!--<template #footer>
			<span class="dialog-footer">
				<el-button @click="handleCancel">{{ cancelText }}</el-button>
				<el-button type="primary" @click="handleConfirm">{{ confirmText }}</el-button>
			</span>
		</template>-->
	</el-dialog>
</template>

<script lang="ts" setup>
import FillEnteracne from '@/views/FormFillPage/components/FillEnterance.vue';

// 对话框控制相关props
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
		default: '99%',
	},
	cancelText: {
		type: String,
		default: '取消',
	},
	confirmText: {
		type: String,
		default: '确定',
	},
});

const emit = defineEmits(['update:modelValue', 'confirm', 'cancel']);

const dialogVisible = ref(false);
const fillEnteranceForm = ref<any>(null);

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

const close = () => {
	dialogVisible.value = false;
};

/*
const handleClose = () => {
	dialogVisible.value = false;
};
*/

/*
const handleCancel = () => {
	emit('cancel');
	handleClose();
};

const handleConfirm = async () => {
	try {
		const isValid = await fillEnteranceForm.value?.validateForm();
		if (isValid) {
			// emit('confirm', formData.value);
			handleClose();
		}
	} catch (error) {
		console.error('表单验证失败:', error);
	}
};
*/

// 暴露show方法
const show = () => {
	dialogVisible.value = true;
};

defineExpose({ show });
</script>

<style lang="less">
.fill-enterance-dialog {
	margin-top: 0.3rem !important;
	margin-bottom: 0rem !important;
}
</style>
