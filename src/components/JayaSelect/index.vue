<template>
  <div class="jaya-select">
    <el-select
      v-elTextLoading="loading"
      v-bind="$attrs"
      :style="sty || ''"
      v-model="val"
      clearable
      filterable
      @change="handleChange"
      :placeholder="placeholder || typeName[this.type] || '请选择'"
      size="small"
    >
      <el-option
        v-for="(option, index) in options"
        :key="index"
        :label="option.label || option.name"
        :value="option.value || option.id"
      />
    </el-select>
  </div>
</template>
<script>
const cacheTypeOptions = {};
import {
  // getDrvSelect,
  // getDeptSelect,
  getDictSelect,
  // getOrganSelect,
  // getSchoolSelect,
  // getExamCarSelect,
  // getMonitorSelect,
  // getExamRoomSelect,
  // getExamToolSelect,
  // getExamStaffSelect,
  // getuserDeptSelect,
  // getuserRoleSelect,
  // getuserInspectSelect,
  // getCheckProjectSelect,
  getProvinceSelect,
  getCitySelect,
  getCountySelect,
  getSchoolSelect,
  pointListPage,
  getCoachSelect,
  getSeachSchoolSelect,
  getRoleSelect,
  getCarNumberSelect,
  getCarNumberSelectY,
  getStudentSelect,
} from "@/api/param/select";

import { carSimple } from "@/api/cloud/studentmanagement";
const fn = {
  // X: getDrvSelect,
  O: getDictSelect,
  // B: getDeptSelect,
  // F: getOrganSelect,
  // C: getExamCarSelect,
  // J: getMonitorSelect,
  // L: getSchoolSelect,
  // K: getExamRoomSelect,
  // T: getExamToolSelect,
  // S: getExamStaffSelect,
  // UB: getuserDeptSelect,
  // UR: getuserRoleSelect,
  // UI: getuserInspectSelect,
  // CP: getCheckProjectSelect,
  P: getProvinceSelect,
  C: getCitySelect,
  T: getCountySelect,
  S: getSchoolSelect,
  L: getCoachSelect,
  M: pointListPage, //报名点
  SS: getSeachSchoolSelect,
  R: getRoleSelect,
  N: getCarNumberSelect,
  YN: getCarNumberSelectY, //易学通车牌号
  ST: getStudentSelect, //学员
  CAR: carSimple, //车型
};

const typeName = {
  // B: "部门管理",
  // F: "发证机关",
  // C: "考试车",
  // J: "监控设备",
  // K: "考场简称",
  // S: "考试员",
  // T: "考试设备",
  // X: "考试项目",
  // L: "驾校简称",
};

export default {
  name: "JayaSelect",
  props: {
    sty: String,
    lable: { type: Boolean, default: false },
    value: String | Array,
    type: String,
    placeholder: String,
    othername: { type: String, default: null },
    parameter: { type: String | Number, default: null },
    isCache: { type: Boolean, default: true },
  },
  data() {
    return {
      options: [],
      val: this.value,
      typeName,
      loading: false,
    };
  },
  mounted() {
    this.$nextTick(this.getOptions);
  },
  watch: {
    value(newVal) {
      this.val = newVal;
    },
    parameter(val) {
      this.getOptions(val);
      if (!val) {
        this.$emit("input", "");
      }
    },
  },
  methods: {
    async getOptions(val) {
      // 缓存，避免相同类型组件重复请求
      if (this.othername) {
        if (true) {
          this.loading = true;
          const result = await fn["O"](this.othername);
          this.loading = false;
          cacheTypeOptions[this.othername] = result.data;
          this.options = result.data;
          if (val && !this.options.find((item) => item.value == this.value)) {
            this.$emit("input", "");
          }
        } else {
          this.options = cacheTypeOptions[this.othername];
        }
      } else {
        if (true) {
          this.loading = true;
          const result = await fn[this.type](this.parameter);
          this.loading = false;
          cacheTypeOptions[this.type] = result.data;
          this.options = result.data;
          if (val && !this.options.find((item) => item.value == this.value)) {
            this.$emit("input", "");
          }
        } else {
          this.options = cacheTypeOptions[this.type];
        }
      }
      this.$emit("getOptions", this.type);
    },

    handleChange(val) {
      this.$emit("input", val);
    },
  },
};
</script>
<style scoped>
p {
  height: 32px;
}
</style>
