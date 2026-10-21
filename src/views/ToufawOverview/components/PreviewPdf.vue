<!--
 * @Descripttion: 
 * @Author: ycyun
 * @Date: 2025-06-23 18:05:00
 * @LastEditors: zhaochao
 * @LastEditTime: 2025-06-26 10:12:59
-->

<template>
	<el-dialog
		v-model="dialogVisible"
		width="15rem"
		:append-to-body="true"
		class="preview-file-dialog"
		:before-close="handleClose"
    :title="title"
	>
		<main>
			<iframe class="iframe" :src="`${pdfUrl}`" frameborder="0"></iframe>
		</main>
	</el-dialog>
</template>
<script lang="ts" setup>


const dialogVisible: any = ref(false);

const emit = defineEmits(['close']);

const handleClose = () => {
	dialogVisible.value = false;
	emit('close');
};


const pdfUrl: any = ref('');
pdfUrl.value = '';
const title = ref<any>('')
const show = (text:string,name:string) => {
  console.log(name)
  dialogVisible.value = true
  title.value = text
  pdfUrl.value = `./pdf/${name}.pdf`;
}
defineExpose({show})
</script>
<style lang="less">
.preview-file-dialog {
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	margin: 0 !important;
}
</style>
<style lang="less" scoped>
main {
	width: 100%;
	height: 73vh;
	.iframe {
		width: 100%;
		height: 100%;
	}
}
</style>
