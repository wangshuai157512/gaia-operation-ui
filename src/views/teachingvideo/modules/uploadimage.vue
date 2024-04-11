<template>
  <div v-if="selfimgUrl" class="avatar">
    <img
      height="180"
      width="240"
      :src="urlPrefix + selfimgUrl"
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
        :disabled="disabled"
        type="text"
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
      <img
        width="100%"
        v-if="dialogVisible"
        :src="urlPrefix + selfimgUrl"
        alt=""
      />
    </el-dialog>
  </div>
  <el-upload
    v-else
    v-loading="loading"
    :disabled="disabled"
    :show-file-list="false"
    :action="`${action}api/bg/operation/subprojectexplain/uploadPhoto`"
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
  name: "UpLoadImage",
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
      selfimgUrl: "",
      dialogVisible: false,
      isShowbtns: false,
      loading: false,
    };
  },

  created() {
    this.selfimgUrl = this.temFormModel.url;
  },

  methods: {
    // 图片上传前
    beforeImageUpload(file) {
       let size = Math.floor(file.size / 1024 / 1024); //计算文件的大小
      if (size > 50) {
         this.$message({
          type: "warning",
          message:'上传图片大小不能超过50M！',
        });
        return false;
      }
      let FileExt = file.name.replace(/.+\./, "");
      let accept = 'jpg,jpeg,png'
      let arrAccept = accept.split(",");
      if (
        arrAccept.indexOf(FileExt.toLowerCase()) === -1
      ) {
        this.$message({
          type: "warning",
          message:`请上传后缀名为jpg、png的图片！`,
        });
        return false;
      }
      let flag = true;
      this.uploadData.id = this.temFormModel.id ? this.temFormModel.id : "";
      this.uploadData.photo = file;
      this.uploadData.photoaddr = this.selfimgUrl;
      if (file.type.indexOf("image/") < 0) {
        this.$message.warning("格式错误！");
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
        this.selfimgUrl = res.data.addr;
        this.$emit("update:newImgUrl", res.data.addr);
      }
      this.loading = false;
    },
    // 上传失败回调
    handleAvatarImgError() {
      this.loading = false;
      this.$message.error("上传失败");
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
      this.$emit("update:dialogVisible", false);
      this.dialogVisible = true;
    },
    // 关闭预览
    cancel() {
      this.dialogVisible = false;
      this.$emit("update:dialogVisible", true);
    },
    // 删除
    deleteurl() {
      this.selfimgUrl = "";
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
