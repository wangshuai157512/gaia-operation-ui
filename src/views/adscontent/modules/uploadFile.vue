<template>
  <div v-if="fileUrl">
    <video
      class="avatar"
      v-if="fileType == 2"
      :src="urlPrefix + fileUrl"
      @mouseover="showactionsBtns"
    ></video>
    <img
      class="avatar"
      v-if="fileType == 1"
      :src="urlPrefix + fileUrl"
      @mouseenter="showactionsBtns"
    />
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
        v-if="dialogVisible && fileType == 2"
        :src="urlPrefix + fileUrl"
        controls
      />
      <img
        width="100%"
        v-if="dialogVisible && fileType == 1"
        :src="urlPrefix + fileUrl"
        alt=""
      />
    </el-dialog>
  </div>
  <el-upload
    v-else
    v-loading="loading"
    :disabled="disabled"
    :show-file-list="false"
    :action="`${action}api/bg/operation/advertising/uploadAdvert`"
    :headers="headers"
    :data="uploadData"
    :before-upload="beforeImageUpload"
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
  name: "uploadFile",
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
      headers: { Authorization: `Bearer ${getToken("Admin-Token")}` },
      action: this.baseApi,
      uploadData: {},
      fileUrl: "",
      dialogVisible: false,
      isShowbtns: false,
      urlPrefix: process.env.VUE_APP_BASE_URL,
      loading: false,
    };
  },
  computed: {
    fileType() {
      let flag = "";
      if (
        this.fileUrl.indexOf(".png") >= 0 ||
        this.fileUrl.indexOf(".jpg") >= 0 ||
        this.fileUrl.indexOf(".jpeg") >= 0
      ) {
        flag = 1;
      }
      // if (this.fileUrl.indexOf(".mp4") >= 0) {
      //   flag = 2;
      // }
      return flag;
    },
  },

  created() {
    this.fileUrl = this.temFormModel.url;
  },

  methods: {
    // 图片上传前
    beforeImageUpload(file) {
      let flag = true;
      this.uploadData.id = this.temFormModel.id ? this.temFormModel.id : "";
      this.uploadData.photo = file;
      this.uploadData.photoaddr = this.fileUrl;
      if (
        !(
          file.type.indexOf("image/png") >= 0 ||
          file.type.indexOf("image/jpeg") >= 0
          // file.type.indexOf("video/mp4") >= 0
        )
      ) {
        this.$message.warning("格式错误！");
        flag = false;
      }
      if (file.size / 1024 / 1024 > 50) {
        this.$message.warning("文件不能超过50MB！");
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
        this.fileUrl = res.data.addr;
        this.$emit("update:newUrl", res.data.addr);
      }
      this.loading = false;
    },
    // 上传失败回调
    handleAvatarImgError() {
      this.$message.error("上传失败");
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
      this.fileUrl = "";
      this.$emit("update:newUrl", "");
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
  top: 0;
  height: 180px;
  width: 240px;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
