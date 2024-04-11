<template>
  <div class="container">
    <div class="title">订单规则设置</div>
    <el-form :disabled="!isEdit" :model="form">
      <el-form-item>
        <p class="label">免输入验证码</p>
        <span v-if="!isEdit">
          <span v-if="form.isInputCode" class="rule-have">已启用</span>
          <span v-else class="rule-none">未启用</span>
        </span>
        <el-switch
          :inactive-value="0"
          :active-value="1"
          v-else
          style="margin: 0 10px"
          v-model="form.isInputCode"
        >
        </el-switch>
        <span class="directions"
          >启用后，可以免输入验证码登录该驾校的易学通设备</span
        >
      </el-form-item>
      <el-form-item>
        <p class="label">批量添加订单</p>
        <span v-if="!isEdit">
          <span v-if="form.isBantchOrder" class="rule-have">已启用</span>
          <span v-else class="rule-none">未启用</span>
        </span>
        <el-switch
          v-else
          :inactive-value="0"
          :active-value="1"
          style="margin: 0 10px"
          v-model="form.isBantchOrder"
        >
        </el-switch>
        <span class="directions">启用后，该驾校拥有批量添加订单的功能</span>
      </el-form-item>
      <el-form-item>
        <p class="label">添加自定义订单</p>
        <span v-if="!isEdit">
          <span v-if="form.isCustomOrder" class="rule-have">已启用</span>
          <span v-else class="rule-none">未启用</span>
        </span>
        <el-switch
          v-else
          :inactive-value="0"
          :active-value="1"
          style="margin: 0 10px"
          v-model="form.isCustomOrder"
        >
        </el-switch>
        <span class="directions"
          >启用后，该驾校拥有添加自定义订单的功能，自定义订单只需要输入用户信息和缴纳金额即可</span
        >
      </el-form-item>
      <el-form-item>
        <p class="label">请选择订单类型</p>
        <el-radio
          v-if="isEdit || (!isEdit && form.orderType == 0)"
          v-model="form.orderType"
          :label="0"
        >
          <span class="directions">
            订单有效期内，无论是否有剩余时长，只能使用一次</span
          ></el-radio
        >
        <el-radio
          v-if="isEdit || (!isEdit && form.orderType == 1)"
          v-model="form.orderType"
          :label="1"
          ><span class="directions">
            订单有效期内，只要订单剩余时长≥
            <el-input
              v-model="form.orderUseTime"
              placeholder="请输入内容"
            ></el-input>
            <span class="gulp">分钟 </span>订单不限使用次数</span
          ></el-radio
        >
      </el-form-item>
      <el-form-item>
        <p class="label">订单有效期</p>
        <span class="directions">
          订单有效期为
          <el-input
            v-model="form.orderValidity"
            placeholder="请输入内容"
          ></el-input>
          <span class="gulp">天 </span
          >（值为1时，表示订单只在练车日期当天有效）</span
        >
      </el-form-item>
      <el-form-item>
        <p class="label">订单结束提醒</p>
        <span class="directions">
          距离订单结束前
          <el-select
            style="width: 105px; margin: 0 10px"
            v-model="form.orderEndReminder"
            placeholder="请选择"
          >
            <el-option
              v-for="item in orderEndReminder"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
          <!-- <el-input
            v-model="form.orderEndReminder"
            placeholder="请输入内容"
          ></el-input> -->
          <span class="gulp">分钟 </span>提醒学员订单即将用完</span
        >
      </el-form-item>
      <el-form-item>
        <p class="label">订单最低时长</p>
        <span class="directions">
          计时订单最低时长
          <el-input
            v-model="form.limitTime"
            placeholder="请输入内容"
          ></el-input>
          <span class="gulp">分钟</span>
        </span>

        <span class="directions">
          计时订单最低圈数
          <el-input
            v-model="form.limitCycle"
            placeholder="请输入内容"
          ></el-input>
          <span class="gulp">圈</span>
        </span>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { saveOrder, delOrder, getOrder } from "@/api/yxt/rule";
export default {
  name: "Order",
  props: {
    isEdit: { type: Boolean },
    carType: { type: String },
    drvSchoolId: { type: String },
  },
  data() {
    return {
      form: {},
      orderEndReminder: [1, 5, 10, 15, 20],
    };
  },
  watch: {
    drvSchoolId() {
      this.form = {};
      this.initData();
    },
    // carType(value) {
    //   this.initData();
    // }
  },
  methods: {
    initData() {
      const { drvSchoolId } = this;

      new Promise((resolve, reject) => {
        getOrder({ drvSchoolId }).then((res) => {
          this.form = res.data.length ? res.data[0] : {};
          resolve();
        });
      });
    },
    rule() {
      const { drvSchoolId, form } = this;

      return new Promise((resolve, reject) => {
        saveOrder({ ...form, equipType: 1, drvSchoolId: drvSchoolId }).then(
          resolve
        );
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  color: #25a5b0;
}

.gulp {
  // color: black;
  font-size: 16px;
}

/deep/ .el-radio__inner {
  width: 18px;
  height: 18px;
  margin-left: 15px;
}
.el-input {
  width: 105px;
  margin: 0 15px;
}
.el-form-item {
  background: #f6f5f5;
  border-radius: 4px;
  padding: 2px 8px;
  box-sizing: border-box;
  margin-top: 16px;
  .label {
    display: inline-block;
    width: 100px;
  }
}
p {
  margin: 0;
  padding: 0;
}
.directions {
  font-size: 14px;
  color: #999999;
}
</style>
