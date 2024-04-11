<template>
  <div class="container">
    <div class="title">预约规则设置</div>
    <el-form ref="form" :rules="rules" :disabled="!isEdit" :model="form">
      <el-form-item prop="subscribeDay" style="width: 40%">
        <p class="label">提前预约天数</p>
        <el-input
          v-model.number="form.subscribeDay"
          placeholder="请输入内容"
        ></el-input
        >天
        <span class="directions"
          >最长可提前预约{{ form.subscribeDay || 0 }}天</span
        >
      </el-form-item>
      <el-form-item prop="everydayDuration" style="width: 60%">
        <p class="label">每日预约时长</p>
        <el-input
          v-model.number="form.everydayDuration"
          placeholder="请输入内容"
        ></el-input
        >小时
        <span class="directions"
          >每辆车每天最多可预约{{
            form.everydayDuration || 0
          }}小时，每日可预约的总时长 = 车辆总数 *
          {{ form.everydayDuration || 0 }}</span
        >
      </el-form-item>
      <el-form-item style="width: 40%">
        <p class="label">允许校外预约</p>
        <span v-if="!isEdit">
          <span v-if="form.allowExternal" class="rule-have">已启用</span>
          <span v-else class="rule-none">未启用</span>
        </span>
        <el-switch
          v-else
          :inactive-value="0"
          :active-value="1"
          style="margin: 0 10px"
          v-model="form.allowExternal"
        >
        </el-switch>
        <span class="directions">启用后，该驾校允许校外学员预约易学通</span>
      </el-form-item>
      <el-form-item prop="everyDuration" style="width: 60%">
        <p class="label">单次预约时长</p>
        <el-input
          v-model.number="form.everyDuration"
          placeholder="请输入内容"
        ></el-input
        >小时
        <span class="directions"
          >学员每次最多可预约{{
            form.everyDuration || 0
          }}小时，按圈收费模式，以每圈最长时长计算</span
        >
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getReserve, updateReserve } from "@/api/yxt/rule";
export default {
  name: "Reserve",
  props: {
    isEdit: { type: Boolean },
    drvSchoolId: { type: String }
  },
  data() {
    return {
      form: {},
      rules: {
        everyDuration: [
          {
            type: "number",
            max: 12,
            message: "最大值为12",
            trigger: "change"
          }
        ],
        subscribeDay: [
          {
            type: "number",
            max: 30,
            message: "最大值为30",
            trigger: "change"
          }
        ],
        everydayDuration: [
          {
            type: "number",
            max: 24,
            message: "最大值为24",
            trigger: "change"
          }
        ]
      }
    };
  },
  watch: {
    drvSchoolId() {
      const { drvSchoolId } = this;
      this.form = {};
      if (drvSchoolId) {
        this.initData();
      }
    }
  },
  methods: {
    initData() {
      const { drvSchoolId } = this;

      new Promise((resolve, reject) => {
        getReserve({ drvSchoolId }).then((res) => {
          if (res.data) {
            this.form = res.data;
          }
          resolve();
        });
      });
    },
    rule() {
      const { form } = this;

      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            updateReserve(form).then(resolve);
          } else {
            reject();
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 24px;
  color: #25a5b0;
}
.el-input {
  width: 105px;
  margin: 0 15px;
}
.el-form-item {
  width: 50%;
  background: #f6f5f5;
  border-radius: 4px;
  padding: 2px 8px;
  box-sizing: border-box;
  margin-top: 16px;
  display: inline-block;
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
