<template>
  <div v-if="selfvedUrl" class="avatar">
    <video
      height="180"
      width="240"
      :src="urlPrefix + selfvedUrl"
      @mouseover="showactionsBtns"
    ></video>

    <div
      class="avatar-actions"
      v-show="isShowbtns"
      @mouseleave="hideactionsBtns"
    >
      <el-button
        type="text"
        icon="el-icon-view"
        style="margin-right: 10px"
        @click="preview"
      ></el-button>
      <el-button
        type="text"
        :disabled="disabled"
        icon="el-icon-delete"
        @click="deleteurl"
      ></el-button>
    </div>
    <el-dialog
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      append-to-body
      width="400"
      @close="cancel"
    >
      <video
        width="100%"
        autoplay
        v-if="dialogVisible"
        :src="urlPrefix + selfvedUrl"
        controls
      />
    </el-dialog>
  </div>
  <el-upload
    v-else
    v-loading="loading"
    :disabled="disabled"
    :show-file-list="false"
    :action="`${action}api/bg/operation/subprojectexplain/uploadVideo`"
    :headers="headers"
    :data="uploadData"
    :before-upload="beforeVedioUpload"
    :on-error="handleAvatarImgError"
    :on-success="handleAvatarImgSuccess"
  >
    <div class="avatar">
      <i class="el-icon-plus avatar-uploader-icon"></i>
      <div>点击上传</div>
    </div>
  </el-upload>
</template>

<script>
import { getToken } from "@/utils/auth";
export default {
  name: "UpLoadVedio",
  props: {
    temFormModel: {
      default: () => {
        return {
          id: "",
          url: "",
        };
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      urlPrefix: process.env.VUE_APP_BASE_URL,
      headers: { Authorization: `Bearer ${getToken("Admin-Token")}` },
      action: this.baseApi,
      uploadData: {},
      selfvedUrl: "",
      dialogVisible: false,
      isShowbtns: false,
      loading: false,
    };
  },

  mounted() {
    this.selfvedUrl = this.temFormModel.url;
  },

  methods: {
    // 图片上传前
    beforeVedioUpload(file) {
       let size = Math.floor(file.size / 1024 / 1024); //计算文件的大小
      if (size > 200) {
         this.$message({
          type: "warning",
          message:'上传视频大小不能超过200M！',
        });
        return false;
      }
      let FileExt = file.name.replace(/.+\./, "");
      let accept = 'mp4'
      let arrAccept = accept.split(",");
      if (
        arrAccept.indexOf(FileExt.toLowerCase()) === -1
      ) {
        this.$message({
          type: "warning",
          message:`请上传后缀名为MP4的视频！`,
        });
        return false;
      }
      let flag = true;
      this.uploadData.id = this.temFormModel.id ? this.temFormModel.id : "";
      this.uploadData.photo = file;
      this.uploadData.photoaddr = this.selfvedUrl;
      if (file.type.indexOf("video/") < 0) {
        this.$message.warning("视频格式错误！");
        flag = false;
      }
      this.loading = flag;
      return flag;
    },
    // 上传成功回调
    handleAvatarImgSuccess(res, fileObj) {
      if (res.code != 200) {
        this.msgError("上传失败");
      } else {
        this.selfvedUrl = res.data.addr;
        this.$emit("update:newVedUrl", res.data.addr);
        this.$emit("changeDuration", res.data.duration);
      }
      this.loading = false;
    },
    // 上传失败回调
    handleAvatarImgError() {
      this.msgError("上传失败");
      this.loading = false;
    },
    // 显示操作按钮
    showactionsBtns() {
      this.isShowbtns = true;
    },
    // 隐藏操作按钮
    hideactionsBtns() {
      this.isShowbtns = false;
    },
    // 预览
    preview() {
      // this.$emit("update:dialogVisible", false);
      this.dialogVisible = true;
    },
    // 关闭预览
    cancel() {
      this.dialogVisible = false;
      // this.$emit("update:dialogVisible", true);
    },
    // 删除
    deleteurl() {
      this.selfvedUrl = "";
      this.$emit("update:newVedUrl", "");
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  height: 180px;
  width: 240px;
  border: 1px dashed;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.avatar-actions {
  position: absolute;
  height: 180px;
  width: 240px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
