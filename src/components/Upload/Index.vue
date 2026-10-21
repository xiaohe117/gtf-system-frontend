<template>
  <div class="upload">
    <el-upload
        v-if="!disabled"
        :show-file-list="false"
        :accept="accept"
        :action="actionUrl"
        class="p-upload"
        :http-request="customUpload"
        :disabled="disabled"
        :drag="drag"
    >
      <!--      <div v-if="drag">-->
      <!--        <i class="el-icon-upload"></i>-->
      <!--        <div class="el-upload__text">点击或将文件拖拽到这里上传</div>-->
      <!--        <p class="accept">支持扩展名：{{ accept }}</p>-->
      <!--      </div>-->
      <!--      <div v-else class="upload-btn" :class="{'flex-x-center':layout==='level'}">-->

      <!--      </div>-->
      <el-button class="upload-btn" type="primary">上传文件</el-button>
      <template #tip>
        <p class="accept">支持扩展名：</p>
        <p class="accept">{{ accept }}</p>
      </template>
    </el-upload>
    <div class="file-list">
      <div v-for="(file, index) in fileList" :key="index" class="file-item">
        <div class="file-item-wrapper default">
          <div class="file-item-left c-pointer"  :class="{'not-allowed': !file.id || file.progress !== 100}" @click="downloadFunc(file)">
            <el-icon><Document /></el-icon>
            <span class="text">{{ file.fileName }}</span>
          </div>
          <div v-if="file.id" class="file-item-right">
            <template>
              <!--              <span class="btn" @click="previewFunc(file)"> 预览</span>-->
              <!--              <span v-show="viewType === 'detail'" class="btn" @click="downloadFunc(file)"> 下载</span>-->
            </template>
            <div v-if="!disabled" class="delete" @click="deleteFunc(file, index)"><el-icon><Close /></el-icon></div>
          </div>
        </div>
        <el-progress
            v-if="file.progress > 0 && file.progress < 100"
            :percentage="file.progress"
            :show-text="false"
            :stroke-width="4"
            style="margin-top: 8px"
        ></el-progress>
      </div>
    </div>
    <!--    <PreviewFile ref="previewRef" />-->
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, defineProps, defineEmits, PropType } from 'vue';
import { ElMessage } from 'element-plus';
import type { UploadRequestOptions } from 'element-plus';
import {
  uploadApi,
  deleteFileById,
  downloadFile,
  getFileNamesById,
} from '@/api/upload';
import { generateUUID } from '@/utils/index';
// import PreviewFile from './PreviewFile.vue';

interface FileItem {
  uuid?: string;
  fileName: string;
  progress?: number;
  id?: string;
}

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  drag: {
    type: Boolean,
    default: false
  },
  uploading: {
    type: Boolean,
    default: false
  },
  limit: {
    type: Number,
    default: 0
  },
  files: {
    type: Array as PropType<FileItem[]>,
    default: () => []
  },
  maxSize: {
    type: Number,
    default: 20
  },
  accept: {
    type: [String, Boolean] as PropType<string | boolean>,
    default: '.rar,.zip,.doc,.docx,.xls,.xlsx,.pdf,.jpg,.png'
  },
  name: {
    type: String,
    default: 'files'
  },
  modelValue: {
    type: Array as PropType<FileItem[]>,
    default: () => []
  },
  viewType: {
    type: String,
    default: 'detail'
  },
  layout: {
    type: String,
    default: 'vertical'
  }
});

const emit = defineEmits(['update:modelValue']);

const actionUrl = ref('#');
const fileList = ref<any[]>([
  {fileName: '1.docx'}
]);
// const previewRef = ref();

const changeFileList = () => {
  emit('update:modelValue', fileList.value);
};
watch(() => props.modelValue, (newVal) => {
  fileList.value = newVal ? [...newVal] : [];

  // 查询是否有id没名字，有则调用查询名字接口
  const ids = fileList.value
      .filter((item) => item.id && !item.fileName)
      .map((item) => item.id) as string[];

  if (ids && ids.length > 0) {
    getFileNamesById({ id: ids.join(',') }).then((res:any) => {
      const names: Record<string, string> = {};
      ids.forEach((id, index) => {
        if (id) names[id] = res.data[index];
      });
      fileList.value.forEach((item) => {
        if (item.id && names[item.id]) {
          item.fileName = names[item.id];
        }
      });
      changeFileList();
    });
  }
}, { immediate: true, deep: true });

const beforeUpload = (rawFile: File): boolean => {
  const typeList = props.accept.toString().split(',');
  const arr = rawFile.name.split('.');
  const fileType = `.${arr[arr.length - 1]}`;
  const idx = typeList.findIndex((item) => item === fileType.toLowerCase());

  // 限制文件名称不能超过100
  const nameLength = rawFile.name.length - (fileType.length - 1);
  if (nameLength > 100) {
    ElMessage.error('文件名称不能超过100个字符，请重命名后再上传');
    return false;
  }

  if (idx === -1) {
    ElMessage.error(`请上传扩展名为${typeList}类型的文件`);
    return false;
  }

  const maxSize = props.maxSize as number;
  if (rawFile.size / 1024 / 1024 > maxSize) {
    ElMessage.error(`上传文件不能超过${props.maxSize}M`);
    return false;
  }

  // 检查文件个数
  if (props.limit && fileList.value.length >= props.limit) {
    ElMessage.error(`最多上传${props.limit}个文件`);
    return false;
  }

  return true;
};
const customUpload = async (options: UploadRequestOptions) => {
  const file = options.file as File;
  if (!beforeUpload(file)) {
    return;
  }

  const formData = new FormData();
  formData.append('files', file);
  const uuid = generateUUID();

  fileList.value.push({
    uuid,
    fileName: file.name,
    progress: 0,
    id: ''
  });
  changeFileList();
  try {
    const res = await uploadApi(formData) as any;
    if (res.code !== 0) {
      const idx = fileList.value.findIndex((ele: any) => ele.uuid === uuid);
      fileList.value.splice(idx, 1);
      changeFileList();
      return;
    }

    const data = res.data[0];
    const idx = fileList.value.findIndex((ele: any) => ele.uuid === uuid);
    fileList.value[idx].id = data.id;
    fileList.value[idx].progress = 100;
    changeFileList();
  } catch (error) {
    const idx = fileList.value.findIndex((ele: any) => ele.uuid === uuid);
    fileList.value.splice(idx, 1);
    changeFileList();
  }
};

const deleteFunc = async (file: FileItem, index: number) => {
  try {
    await deleteFileById({ id: file.id as string });
    fileList.value.splice(index, 1);
    changeFileList();
    ElMessage.success('文件删除成功');
  } catch (error) {
    ElMessage.error('文件删除失败');
  }
};

// const previewFunc = async (file: FileItem) => {
//   try {
//     const res = await previewFile({ fileId: file.id as string });
//     if (res.code === 200) {
//       const url = `${import.meta.env.VITE_APP_FILE_URL}/onlinePreview?url=${res.data}`;
//       window.open(url, '_blank');
//     } else {
//       ElMessage.error(res.msg);
//     }
//   } catch (error) {
//     ElMessage.error('文件预览失败');
//   }
// };

const downloadFunc = (file: FileItem) => {
  if (!file.id || file.progress !== 100) {
    ElMessage.warning('文件上传未完成，禁止下载');
    return;
  }
  downloadFile(file.id );
};
</script>

<style scoped lang="less">
.not-allowed{
  cursor: not-allowed !important;
  opacity: 0.7;
}
.upload-btn {
  margin-bottom: 0.1rem;
  .el-button {
    height: 0.32rem;
    border-radius: 0.02rem;
    margin: .1rem 0;
    margin-right: 0.24rem;
  }
  text-align: left;
}
.file-list {
  margin-top: 0.2rem;
}
.file-item {
  font-weight: 400;
  font-size: 0.14rem;
  line-height: 0.14rem;
  margin-top:  .1rem;
  &:first-child {
    margin-top: 0;
  }
  .file-item-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: rgba(0,0,0,0.65);
    width: 100%;
    height: 0.32rem;
    line-height: 0.32rem;
    padding: 0 0.08rem;
    background: #FFFFFF;
    border-radius: 0.04rem;
    font-size: 0.18rem;
    .file-item-left {
      display: flex;
      align-items: center;
      flex: 1;
      min-width: 0;
      font-size: 0.16rem;
      color: rgba(0, 0, 0, 0.65);
      i {
        margin-right: 0.08rem;
        font-size: 0.16rem;
        color: #165dff;
      }
      .text {
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
    .file-item-right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      color: #165dff;
      font-size: 0.16rem;
      .btn {
        margin-left: 0.08rem;
        cursor: pointer;
      }
      .delete {
        color: rgba(0, 0, 0, 0.65);
        margin-left: 0.08rem;
        cursor: pointer;
        padding-top: 0.05rem;
      }
    }
  }
}
.el-upload__text {
  color: rgba(0, 0, 0, 0.65);
  line-height: 0.22rem;
  font-size: 0.14rem;
}
.accept {
  font-family: PingFangSC, PingFang SC;
  color: rgba(0, 0, 0, 0.45);
  font-size: 0.14rem;
  line-height: 0.2rem;
}
.upload {
  //width: 100%;
  //:deep(.el-upload) {
  //  width: 100%;
  //  justify-content: flex-start;
  //}
}
:deep(.el-upload-dragger) {
  width: 100%;
}
</style>
