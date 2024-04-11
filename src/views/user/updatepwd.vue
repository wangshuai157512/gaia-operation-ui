<template>
  <div style="width: 100%; height: 100%">
    <div class="center">
      <el-form ref="form" :model="updatePwd" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="18" style="margin-bottom: 12px">
            <el-form-item label="原密码" prop="oldPassword">
              <el-input
                size="small"
                type="password"
                v-model="updatePwd.oldPassword"
                placeholder="请输入原密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item
              label="新密码"
              style="margin-bottom: 22px"
              prop="newPassword"
            >
              <el-input
                size="small"
                type="password"
                @input="handleInputPwd"
                v-model="updatePwd.newPassword"
                placeholder="请输入新密码"
              />
            </el-form-item>
          </el-col>
          <el-col :span="18" style="margin: 12px 0">
            <div>
              <label
                style="
                  float: left;
                  font-size: 12px;
                  text-align: right;
                  width: 68px;
                "
              >
                密码强度
              </label>
              <div class="pwd">
                <div class="tip">
                  <div
                    :style="{ background: pwdStrength >= 1 ? '#ed3400' : '' }"
                  ></div>
                  <div
                    :style="{ background: pwdStrength >= 2 ? '#f7820d' : '' }"
                  ></div>
                  <div
                    :style="{ background: pwdStrength >= 3 ? '#6ba100' : '' }"
                  ></div>
                </div>
                <div class="name">
                  <div>弱</div>
                  <div>中</div>
                  <div>强</div>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="18">
            <el-form-item label="确认密码" prop="newPasswords">
              <el-input
                size="small"
                type="password"
                v-model="updatePwd.newPasswords"
                placeholder="请确认新密码"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-col :span="18">
        <el-button style="float: right" type="primary" @click="submitForm"
          >保存</el-button
        >
      </el-col>
    </div>
  </div>
</template>

<script>
import { updatePwd } from "@/api/cloud/user";
import { Base64 } from "js-base64";
const pwdCheckStrong = function (J) {
  var M = 0;
  var L = /\d/;
  var H = /[A-Z]/;
  var K = /[a-z]/;
  var I = /\W/;
  if (L.test(J)) {
    M++;
  }
  if (H.test(J)) {
    M++;
  }
  if (K.test(J)) {
    M++;
  }
  if (I.test(J)) {
    M++;
  }
  if (M >= 4) {
    M = 3;
  }
  if (M > 1 && J.length <= 7) {
    M--;
  }
  return M;
};

export default {
  name: "ResetPassword",
  data() {
    return {
      pwdStrength: 0,
      updatePwd: {},
      rules: {
        oldPassword: [
          { required: true, message: "请输入旧密码", trigger: "change" },
        ],
        newPassword: [
          {
            required: true,
            validator: this.validatePwdStrong,
            trigger: "change",
          },
        ],
        newPasswords: [
          { required: true, validator: this.validatePass, trigger: "change" },
        ],
      },
    };
  },
  watch: {
    visible() {
      this.reset();
    },
  },
  methods: {
    handleInputPwd(val) {
      this.pwdStrength = pwdCheckStrong(val);
      if (this.updatePwd.newPasswords) this.updatePwd.newPasswords = "";
    },

    cancel() {
      this.pwdStrength = 0;
      this.$emit("update:visible", false);
    },

    reset() {
      this.updatePwd = {};
      this.resetForm("form");
    },

    validatePass(rule, value, callback) {
      if (!value || value === "") {
        callback(new Error("请再次输入密码"));
      } else if (!this.updatePwd.newPassword) {
        callback(new Error("请先输入新密码"));
      } else if (value !== this.updatePwd.newPassword) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    },

    validatePwdStrong(rule, value, callback) {
      if (pwdCheckStrong(value) < 3) {
        callback(
          new Error(
            "密码长度不小于8位，且必须包含英文大小写字母、数字及特殊符号"
          )
        );
      } else {
        callback();
      }
    },

    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          const { oldPassword, newPassword } = this.updatePwd;
          updatePwd({
            oldPassword: Base64.encode(oldPassword),
            newPassword: Base64.encode(newPassword),
          }).then(() => {
            this.$message({
              message: "密码修改成功",
              type: "success",
            });
          });
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.pwd {
  width: calc(100% - 80px);
  float: right;
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

.center {
  width: 800px;
  margin: 40px auto 0;
}
</style>
