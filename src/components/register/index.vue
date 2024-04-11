<template>
  <el-dialog
    :close-on-click-modal="false"
    title="注册"
    :visible.sync="openRegister"
    width="600px"
    append-to-body
    :before-close="closeRegister"
    fullscreen
  >
    <div class="register-box">
      <div @click="handleClose">
          <img src="../../assets/images/close-img.png" alt="" class="close-img" />
      </div>
      <div class="register-box-l">
        <div class="img-box">
          <img
            src="../../assets/images/title-img.png"
            alt=""
            class="title-img"
          />
          <img src="../../assets/images/register-img.png" alt="" />
        </div>
      </div>
      <div class="register-box-r">
        <el-form ref="form" :model="form" :rules="rules" label-width="114px">
          <div class="woclome-img">
            <img src="../../assets/images/woclome-img.png" alt="">
          </div>
          <el-form-item label="驾校" prop="name">
            <el-cascader
              style="width: 100%"
              :options="cityList"
              :props="props"
              @change="handleChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="驾校名称" prop="name">
            <el-input size="small" v-model="form.old" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="负责人" prop="name">
            <el-input size="small" v-model="form.oldPa" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="用户名" prop="userName">
            <el-input size="small" v-model="form.o" placeholder="请输入" />
          </el-form-item>
          <el-form-item label="密码" prop="ne">
            <el-input
              size="small"
              type="password"
              autocomplete="new-password"
              v-model="form.newPass"
              placeholder="请输入新密码"
            />
          </el-form-item>
          <el-form-item label="确认密码" prop="newPasswords">
            <el-input
              size="small"
              type="password"
              v-model="form.newPassws"
              placeholder="请确认新密码"
            />
          </el-form-item>
           <el-form-item label="">
            <el-button type="primary" @click="submitForm">提 交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import { updatePwd, updateFirstPwd } from "@/api/login";
import cityList from "../../utils/citys.json";
export default {
  name: "register",
  props: {
    openRegister: Boolean,
  },
  data() {
    return {
      form: {},
      cityList: [],
      props: {
        value: "label",
        children: "cities",
      },
      rules: {
        name: [{ required: true, message: "必填项", trigger: "change" }],
      },
    };
  },
  watch: {
    openRegister() {
      this.reset();
    },
  },
  methods: {
    handleChange() {},
    closeRegister() {
      this.$emit("update:openRegister", false);
    },
    handleClose() {
      this.$emit("update:openRegister", false);
    },

    reset() {
      this.form = {};
      this.resetForm("form");
    },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
        }
      });
    },
  },

  mounted() {
    this.cityList = cityList.provinces;
  },
};
</script>

<style lang="scss" scoped>
.pwd {
  width: 520px;
  // float: right;
  .tip,
  .name {
    div {
      width: 33.3333%;
      float: left;
      text-align: center;
      font-size: 10px;
    }
  }
  .tip div {
    height: 10px;
  }
}
/deep/.el-dialog__header {
  display: none !important;
}
/deep/.el-dialog__body {
  padding: 0;
  width: 100%;
  height: 100%;
  .register-box {
    width: 100%;
    height: 100%;
    display: flex;
    position: relative;
    .close-img {
      position: absolute;
      top: 30px;
      right: 30px;
    }
    .register-box-l {
      width: 45%;
      height: 100%;
      background: #354153;
      display: flex;
      justify-content: center;
      padding-top: 7%;
      box-sizing: border-box;
      .img-box {
        width: 645px;
        .title-img {
          margin-left: 20px;
        }
      }
    }
    .register-box-r {
      width: 55%;
      display: flex;
      justify-content: center;
       padding-top: 7%;
      .el-form {
        width: 643px;
        .woclome-img {
          margin-bottom: 76px;
          text-align: center;
          img {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>
