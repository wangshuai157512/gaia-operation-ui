<template>
  <div class="login">
    <div class="loginCon">
      <div class="login-img-box">
        <img src="../assets/images/title-img.png" alt="" class="title-img" />
        <img src="../assets/images/loginPic.png" alt="" class="loginPic" />
      </div>
      <div class="login-form-box">
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="loginRules"
          class="login-form"
        >
          <h3 class="title">
            欢迎登录 <span style="color: #fff">WELCOME</span>
          </h3>
          <el-form-item prop="username">
            <el-input
              v-model="loginForm.username"
              type="text"
              auto-complete="off"
              placeholder="账号"
              tabindex="1"
            >
              <svg-icon
                slot="prefix"
                icon-class="user"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              auto-complete="new-password"
              placeholder="密码"
              tabindex="2"
              @keyup.enter.native="handleLogin"
            >
              <svg-icon
                slot="prefix"
                icon-class="password"
                class="el-input__icon input-icon"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="code" v-if="captchaOnOff">
            <el-input
              v-model.trim="loginForm.code"
              auto-complete="off"
              placeholder="验证码"
              style="width: 63%"
              class="code"
              tabindex="3"
              @keyup.enter.native="handleLogin"
            >
              <!-- <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon" /> -->
              <i slot="prefix" class="el-icon-menu el-input__icon input-icon" />
            </el-input>
            <div class="login-code">
              <img :src="codeUrl" @click="getCode" class="login-code-img" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-checkbox v-model="loginForm.rememberMe" style="color: #fff"
              >记住密码</el-checkbox
            >
            <!-- <div style="float: right" class="forget-remeber">
                忘记密码？
                <div class="forget-remeber-line"></div>
              </div> -->
          </el-form-item>
          <el-form-item style="width: 100%">
            <el-button
              :loading="loading"
              size="medium"
              type="primary"
              @click.native.prevent="handleLogin"
            >
              <span v-if="!loading">登 录</span>
              <span v-else>登 录 中...</span>
            </el-button>
            <!-- <el-button
              size="medium"
               type="primary"
              style="float: right"
              @click="handleRegister"
            >
              注册
            </el-button> -->
            <!-- <div style="float: right" v-if="register">
            <router-link class="link-type" :to="'/register'"
              >立即注册</router-link
            >
          </div> -->
          </el-form-item>
          <!-- <div class="customer">
                使用有问题？请联系客服？
                <div class="customer-line"></div>
          </div> -->
        </el-form>
      </div>
    </div>
    <!-- 注册 -->
    <register :openRegister.sync="openRegister" />
    <!--  修改密码  -->
    <reset-password :userName="loginForm.username" :visible.sync="visible" />
    <!--  底部  -->
    <div class="el-login-footer">
      <!-- <span>Copyright © 2018-2021 jaya.vip All Rights Reserved.</span> -->
      <span>技术支持： 北京精英智通科技股份有限公司</span>
    </div>
  </div>
</template>

<script>
import { getCodeImg } from "@/api/login";
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
import { removeToken } from "@/utils/auth";
import { Base64 } from "js-base64";

export default {
  name: "Login",
  data() {
    return {
      visible: false,
      codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", message: "请输入您的账号" }
        ],
        password: [
          { required: true, trigger: "blur", message: "请输入您的密码" }
        ],
        code: [{ required: true, trigger: "change", message: "请输入验证码" }]
      },
      loading: false,
      // 验证码开关
      captchaOnOff: true,
      // 注册开关
      register: true,
      openRegister: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    // Cookies.remove("username");
    // Cookies.remove("password");
    // Cookies.remove("rememberMe");
    this.getCode(); //获取验证码
    this.getCookie();
  },
  methods: {
    getCode() {
      getCodeImg().then((res) => {
        this.captchaOnOff =
          res.captchaOnOff === undefined ? true : res.captchaOnOff;
        if (this.captchaOnOff) {
          this.codeUrl = "data:image/gif;base64," + res.data.img;
          this.loginForm.uuid = res.data.uuid;
        }
      });
    },
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password: password === undefined ? this.loginForm.password : password,
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
      };
    },
    handleLogin() {
      // if (!document.getElementById("obj").GetMac) {
      //   this.$alert(
      //     "<div>请用ie浏览器<a style='color: blue;'  href='/plugins/MacOcxSetup.msi'>下载</a>插件后登录</div>",
      //     "提示",
      //     {
      //       dangerouslyUseHTMLString: true,
      //       showConfirmButton: false,
      //     }
      //   );
      //   return;
      // }
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          removeToken();
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {
              expires: 30
            });
            Cookies.set("password", this.loginForm.password, {
              expires: 30
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", {
              ...this.loginForm,
              username: Base64.encode(this.loginForm.username),
              password: Base64.encode(this.loginForm.password),
              // mac: Base64.encode(document.getElementById("obj").GetMac),
              mac: Base64.encode("40:1C:83:29:F6:F8")
            })
            .then(() => {
              this.$router.push({ path: this.redirect || "/" }).catch(() => {});
            })
            .catch((err) => {
              this.loading = false;
              // 修改默认密码
              if (err == 1018) {
                setTimeout(() => {
                  this.visible = true;
                }, 1000);
              }
              if (this.captchaOnOff) {
                this.getCode();
              }
            });
        }
      });
    },
    handleRegister() {
      this.openRegister = true;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  // align-items: center;
  height: 100%;
  background-image: url("../assets/images/loginBg.png");
  background-size: cover;
  // padding: 100px 100px 0 100px;
  box-sizing: border-box;
  position: relative;
  .el-button--primary {
    background: #31c0cd !important;
    width: 100%;
  }
}

.loginCon {
  width: 1200px;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  .title-img {
    margin-left: 80px;
  }
}
.login-img-box {
  width: 65%;
  height: auto;
  img {
    max-width: 100%;
  }
}
.login-form-box {
  width: 35%;
}
.login-form {
  border-radius: 6px;
  padding: 20px 25px 0 25px;
  h3 {
    color: #49bbc5;
  }
  .el-input {
    height: 38px;
    width: 100% !important;
    input {
      height: 38px;
      color: #49bbc5;
    }
    .el-input__prefix {
      color: #49bbc5 !important;
    }
    .el-input__inner {
      background: transparent;
      border: 0;
      border-radius: 0;
      border-bottom: 1px solid #fff;
      color: #a6becd;
    }
    .el-input__inner::-webkit-input-placeholder {
      color: #a6becd;
    }

    .el-input__inner:-moz-placeholder {
      color: #a6becd;
    }

    .el-input__inner:-ms-input-placeholder {
      color: #a6becd;
    }
  }
  .code {
    width: 63% !important;
  }
  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
    color: #49bbc5;
  }
  .forget-remeber {
    color: #ffce5a;
    .forget-remeber-line {
      width: 100%;
      height: 1px;
      background: #ffce5a;
      margin-top: -7px;
    }
  }
  .customer {
    color: #00fffc;
    width: 192px;
    .customer-line {
      width: 100%;
      height: 1px;
      background: #00fffc;
    }
  }
}
.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}
.login-code {
  width: 33%;
  height: 38px;
  float: right;
  img {
    cursor: pointer;
    vertical-align: middle;
  }
}
.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  text-align: center;
  color: #a6becd;
  font-family: Arial;
  font-size: 12px;
  letter-spacing: 1px;
}
.login-code-img {
  height: 38px;
}
</style>
