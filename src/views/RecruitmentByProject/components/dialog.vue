<template>
	<el-dialog v-model="dialogVisible" width="72%">
		<TitleBody :name="'策划项目详情'">
			<template #extra v-if="listData.isExcellentPlan === '2'">
				<div class="yiuxiu">优秀策划项目案例</div></template
			>
			<div class="dialogBox">
				<div class="dialog-left">
					<div class="title">·策划项目名称：</div>
					<div class="txt">{{ listData.planProjName }}</div>
					<div class="title">·策划项目描述：</div>
					<div class="txt color desc">
						{{ listData.planProjDesc }}
					</div>
					<div class="title">·相关企业：</div>
					<div class="txt">{{ listData.companyName }}</div>
					<div class="title">·策划单位：</div>
					<div class="txt color">{{ listData.createUnit }}</div>
					<div class="title">·所属122818产业：</div>
					<div class="txt color">{{ listData.industryName }}</div>
				</div>
				<div class="dialog-rigth">
					<iframe
						class="pdf"
						:src="url"
						frameborder="0"
						v-if="listData.fileInfo"
					></iframe>
					<div v-else>暂无文件信息</div>
					<!-- <iframe
						class="pdf"
						src="/src/assets/images/RecruitmentByProject/pdf.pdf"
						frameborder="0"
					></iframe> -->
				</div>
			</div>
		</TitleBody>
	</el-dialog>
</template>
<script setup lang="ts">
const props = defineProps({
	data: {
		type: Object,
		default: () => ({}),
	},
});
const dialogVisible = ref(false);
const show = () => {
	dialogVisible.value = true;
};
const url = ref('');
defineExpose({ show });
const listData: any = ref({});
watch(
	() => props.data,
	(newVal: any) => {
		console.log(newVal, '详情页数据传参');
		listData.value = newVal;
		const fileInfo = newVal?.fileInfo;

		if (fileInfo && fileInfo.fileUrl) {
			// url.value = fileInfo.fileUrl;
			url.value = `${window.location.href}/view/onlinePreview?url=${encodeURIComponent(btoa(`${fileInfo.fileUrl}`))}`;
		}
	},
	{ immediate: true }
);
</script>
<style lang="less" scoped>
.dialogBox {
	// width: 13.84rem;
	display: flex;
	.dialog-left {
		width: 3.48rem;
		height: 5.88rem;
		background: url('@/assets/images/RecruitmentByProject/left.png') no-repeat;
		background-size: cover;
		margin-right: 0.21rem;
		font-size: 0.14rem;
		padding: 0 0.3rem 0 0.3rem;
		box-shadow: 0px 0px 8px 0px rgba(25, 43, 138, 0.34);

		.title {
			font-weight: 600;
			color: #111;
			margin: 0.24rem 0 0.05rem 0;
		}
		.txt {
			color: #165dff;
			margin-left: 0.08rem;
			font-weight: 400;
		}
    .desc{
      max-height: 2.45rem;
      overflow: auto;
    }
		.color {
			color: #111;
		}
	}
	.dialog-rigth {
		width: 9.5rem;
		height: 5.88rem;
		.pdf {
			width: 100%;
			height: 100%;
		}
	}
}
.yiuxiu {
	width: 2.2rem;
	height: 0.41rem;
	padding-left: 0.6rem;
	font-size: 0.14rem;
	font-weight: bold;
	color: #fff;
	background: url('@/assets/images/ActivityFillingPage/yiuxiu.png') no-repeat;
	background-size: cover;
	line-height: 0.48rem;
	margin-left: -11.3rem;
	text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
}
</style>
<style></style>
