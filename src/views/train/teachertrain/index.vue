<template>
  <div class="app-container">
    <el-form :model="params" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
         <jaya-select
          type="S"
          v-model="params.drvSchoolId"
          placeholder="选择驾校"
        ></jaya-select
      ></el-form-item>
      <el-form-item>
        <el-input
          size="small"
          v-model="params.coachName"
          placeholder="请输入教练名称"
          style="width: 240px !important"
        >
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          placeholder="选择智能设备"
          filterable
          clearable
          size="small"
          v-model="params.trainEquipmentType"
        >
          <el-option
            v-for="device in deviceType"
            :key="device.value"
            :value="device.value"
            :label="device.label"
          >
          </el-option> </el-select
      ></el-form-item>
      <el-form-item>
        <el-date-picker
          class="daterange"
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-table
      ref="multipleTable"
      :data="data"
      @row-click="handleRowClick"
      :row-class-name="tableRowClassName"
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column align="center" fixed type="selection" width="50">
      </el-table-column> -->
      <el-table-column
        align="center"
        prop="coachName"
        label="教练姓名"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="orderNum"
        label="订单编号"
      ></el-table-column>
      <el-table-column
        prop="loginTime"
        align="center"
        label="签到时间"
      ></el-table-column>
      <el-table-column
        prop="logoutTime"
        align="center"
        label="签退时间"
      ></el-table-column>
      <el-table-column
        prop="loginTimeDuration"
        align="center"
        label="使用时长"
      ></el-table-column>
      <el-table-column
        prop="trainEquipmentType"
        align="center"
        :formatter="getDeviceType"
        label="智能设备"
      ></el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page-sizes="pageSizes"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="search"
    />
  </div>
</template>

<script>
import { getCoachTrainPageList } from "@/api/cloud/train";
export default {
  name: "TeacherTrain",
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
        desc: "loginTime"
      },
      pageSizes: [10, 20, 30, 50, 100],
      total: 0,
      data: [],
      date:[],
      deviceType: [
        { value: "0", label: "智能模拟器" },
        { value: "1", label: "机器人教练" }
      ],
      roomOptions: []
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    // 取消
    cancel() {
      this.visible = false;
    },
    // 搜索
    search() {
      this.params.startTime = this.date ? this.date[0] : "";
      this.params.finishTime = this.date ? this.date[1] : "";
      getCoachTrainPageList(this.params).then(({ records, total }) => {
        this.total = total;
        this.data = records;
      });
    },
    getDeviceType(row, column, cellValue) {
      return this.deviceType.find(({ value }) => value == cellValue)?.label;
    },
    getExamRoomList() {},
    handleRowClick() {},
    tableRowClassName() {},
    handleSelectionChange() {}
  }
};
</script>
<style scoped>
.rows {
  display: flex;
  flex-wrap: wrap;
}

.daterange {
  width: 240px !important;
}
</style>
