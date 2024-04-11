<template>
  <el-form
    :model="reserveForm"
    ref="reserveForm"
    label-width="190px"
    :inline="true"
    :rules="rules"
  >
    <el-form-item class="drvSchool" label="驾校：">
      <el-input
        v-model="reserveForm.drvSchoolName"
        disabled
        style="width: 240px"
      ></el-input>
    </el-form-item>
    <el-form-item label="智能设备">
      <el-input
        v-model="reserveForm.model"
        disabled
        style="width: 240px"
      ></el-input>
    </el-form-item>
    <br />
    <el-form-item label="可提前预约天数：" prop="advanceDays">
      <div class="jaya-select-body">
        <el-input
          v-model="reserveForm.advanceDays"
          placeholder="请输入"
          style="width: 240px"
        />
        <span>（天），默认可提前14天预约</span>
      </div>
    </el-form-item>
    <br />
    <el-form-item
      prop="startTime"
      v-if="reserveForm.model === '智能模拟器'"
      label="请选择可预约时间段："
    >
      <el-time-select
        style="width: 112px"
        placeholder="起始"
        v-model="reserveForm.startTime"
        :picker-options="{
          start: '00:00',
          step: '01:00',
          end: '24:00',
          maxTime: reserveForm.endTime
        }"
      >
      </el-time-select>
      --
      <el-time-select
        style="width: 112px"
        placeholder="结束"
        v-model="reserveForm.endTime"
        :picker-options="{
          start: '00:00',
          step: '01:00',
          end: '24:00',
          minTime: reserveForm.startTime
        }"
      >
      </el-time-select>
    </el-form-item>
    <el-form-item v-else label="每日可预约总时长" prop="appointmentTotalHours">
      <div class="jaya-select-body">
        <el-input
          v-model="reserveForm.appointmentTotalHours"
          placeholder="请输入"
          style="width: 240px"
        />
        <span>（小时），计算方式：最大可预约总时长=车辆数*24小时</span>
      </div>
    </el-form-item>
    <br />
    <el-form-item
      v-if="reserveForm.model === '智能模拟器'"
      label="请选择课程时长"
      prop="subjectTime"
    >
      <el-select
        style="width: 240px"
        v-model="reserveForm.subjectTime"
        placeholder="请选择"
      >
        <el-option
          v-for="item in subjectTimeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="每人每日可预约时长：" prop="appointmentPersonHours">
      <div class="jaya-select-body">
        <el-input
          v-model="reserveForm.appointmentPersonHours"
          style="width: 240px"
          placeholder="请输入"
        ></el-input>
        <span>（小时），每位学员每天最多可预约的学时数</span>
      </div>
    </el-form-item>
    <el-form-item label="允许校外预约：">
      <el-switch
        :active-value="1"
        :inactive-value="0"
        v-model="reserveForm.outEnabled"
      >
      </el-switch>
      <span style="margin-left: 10px"
        >启用后，该驾校允许校外学员预约智能模拟器</span
      >
    </el-form-item>
  </el-form>
</template>

<script>
const validateAdvanceDays = (rule, value, callback) => {
  let reg = /^[+]{0,1}(\d+)$/g;
  if (!reg.test(value)) {
    callback(new Error("仅可输入大于等于0的正整数"));
  } else {
    callback();
  }
};

const validateAppointmentTotalHours = (rule, value, callback) => {
  let reg = /^[1-9]\d*$/g;
  if (!reg.test(value)) {
    callback(new Error("仅可输入大于0的正整数"));
  } else {
    callback();
  }
};

const validateAppointmentPersonHours = (rule, value, callback) => {
  let reg = /^[1-9]\d*$/g;
  if (!reg.test(value)) {
    callback(new Error("仅可输入1-24的正整数"));
  } else if (value > 24) {
    callback(new Error("仅可输入1-24的正整数"));
  } else {
    callback();
  }
};

export default {
  name: "Appointment",
  props: {
    reserveForm: {
      default() {
        return {
          outEnabled: 0,
          advanceDays: "", // 可提前预约天数	integer(int32)
          appointmentPersonHours: "", //	每人每日可预约时长	integer(int32)
          appointmentTotalHours: "", //	每日可预约总时长	integer(int32)
          drvSchoolId: "", //	驾校id	integer(int64)
          drvSchoolName: "",
          model: "", //// 智能设备
          id: "" //	主键	integer(int64)
        };
      }
    }
  },
  data() {
    return {
      provinceId: "",
      cityId: "",
      countyId: "",
      rules: {
        subjectTime: [{ required: true, message: "必填项", trigger: "change" }],
        startTime: [{ required: true, message: "必填项", trigger: "change" }],
        endTime: [{ required: true, message: "必填项", trigger: "change" }],
        advanceDays: [
          { required: true, validator: validateAdvanceDays, trigger: "change" }
        ],
        appointmentTotalHours: [
          {
            required: true,
            validator: validateAppointmentTotalHours,
            trigger: "change"
          }
        ],
        appointmentPersonHours: [
          {
            required: true,
            validator: validateAppointmentPersonHours,
            trigger: "change"
          }
        ]
      },
      subjectTimeOptions: [
        { label: "30分钟", value: 30 },
        { label: "45分钟", value: 45 },
        { label: "60分钟", value: 60 },
        { label: "90分钟", value: 90 },
        { label: "120分钟", value: 120 }
      ]
    };
  },
  watch: {
    reserveForm: {
      handler(nval, oval) {
        const { startTime, endTime } = nval;

        this.$emit("update:newObj", {
          ...nval,
          startTime: startTime ? startTime + ":00" : null,
          endTime: endTime ? endTime + ":00" : null
        });
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    async FormValidateFields() {
      let flag = true;
      await this.$refs.reserveForm.validate((valid) => {
        if (valid) {
          flag = true;
        } else {
          flag = false;
        }
      });
      return flag;
    }
  }
};
</script>

<style lang="scss" scoped>
.jaya-select-body {
  width: 700px;
  display: flex;
}
</style>
