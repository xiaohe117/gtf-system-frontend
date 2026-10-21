<template>
	<div class="iframe-container">
		<div v-if="loading" class="loading">
			<div class="spinner"></div>
			<p>加载中...</p>
		</div>
		<iframe
			ref="iframeRef"
			:src="src"
			:title="title"
			class="iframe-content"
			@load="handleLoad"
			@error="handleError"
		></iframe>
		<div v-if="error" class="error">
			<p>加载失败，请稍后重试</p>
			<button @click="reload">重新加载</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Props {
	src: string;
	title?: string;
}

const props = withDefaults(defineProps<Props>(), {
	title: 'title',
});
const emit = defineEmits(['loaded'])

const iframeRef = ref<HTMLIFrameElement>();
const loading = ref(true);
const error = ref(false);

const handleLoad = () => {
	loading.value = false;
	error.value = false;
	emit('loaded', iframeRef.value);
};

const handleError = () => {
	loading.value = false;
	error.value = true;
};

const reload = () => {
	error.value = false;
	loading.value = true;
	if (iframeRef.value) {
		iframeRef.value.src = props.src;
	}
};

onMounted(() => {
	loading.value = true;
});
</script>

<style scoped>
.iframe-container {
	position: relative;
	width: 100%;
	height: 100%;
	min-height: 500px;
}

.iframe-content {
	width: 100%;
	height: 10.5rem;
	border: none;
	border-radius: 8px;
	overflow-y: auto;
}

.loading {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	z-index: 10;
}

.spinner {
	width: 40px;
	height: 40px;
	border: 4px solid #f3f3f3;
	border-top: 4px solid #1890ff;
	border-radius: 50%;
	animation: spin 1s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}

.error {
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
	z-index: 10;
	padding: 20px;
	background: #fff;
	border-radius: 8px;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error button {
	padding: 8px 16px;
	background: #1890ff;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	transition: background 0.3s;
}

.error button:hover {
	background: #40a9ff;
}

.loading p,
.error p {
	margin: 0;
	color: #666;
	font-size: 14px;
}
</style>
