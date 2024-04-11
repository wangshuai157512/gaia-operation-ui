<template>
  <div class="app-container">
    <el-form :model="params" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
        <el-select
          placeholder="选择驾校"
          filterable
          clearable
          size="small"
          v-model="params.kcxh"
        >
          <el-option
            v-for="room in roomOptions"
            :key="room.kcxh"
            :value="room.kcxh"
            :label="room.kcjc"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog
      title="预约规则设置"
      :visible.sync="visible"
      width="600px"
      append-to-body
      :center="true"
    >
      <el-form ref="form" :model="form">
        <el-row>
          <el-col>
            <el-form-item
              label="可提前预约天数（天），默认可提前14天预约"
              prop="kcxh"
            >
              <el-input v-model="form.kcxh" placeholder="请输入"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item
              label="每日可预约总时长（小时），计算方式：最大可预约总时长=车辆数*24小时"
              prop="glbm"
            >
              <el-input
                v-model="form.glbm"
                placeholder="请输入"
              /> </el-form-item
          ></el-col>
          <el-col>
            <el-form-item
              label="每人每日可预约时长（小时），每位学员每天最多可预约的学时数"
              prop="kcmc"
            >
              <el-input
                v-model="form.kcmc"
                placeholder="请输入"
              /> </el-form-item
          ></el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submit" type="primary">保存</el-button>
      </div>
    </el-dialog>
  <div class="table-box-con">
    <el-table :data="data">
      <el-table-column
        align="center"
        width="90"
        prop="kcxh"
        label="序号"
      ></el-table-column>
      <el-table-column
        align="center"
        prop="glbm"
        label="驾校"
      ></el-table-column>
      <el-table-column
        align="center"
        width="120"
        prop="kskm"
        label="可预约天数"
      >
      </el-table-column>
      <el-table-column
        width="140"
        align="center"
        prop="kcmc"
        label="每人每日可预约时长"
      ></el-table-column>
      <el-table-column
        width="140"
        align="center"
        prop="kcjc"
        label="训练类型"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="80"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleClick(1, scope.row)"
            >设置</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
    

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
export default {
  name: "DrivSchoolRules",
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      pageSizes: [10, 20, 30, 50, 100],
      total: 0,
      status: 0, // 0 新增 1 修改 2 详情
      data: [],
      tableLoading: false,
      visible: false,
      form: {},
      sujectOptions: [
        { value: "科目一", key: "1" },
        { value: "科目二", key: "2" },
        { value: "科目三", key: "3" },
      ],
      roomOptions: [],
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    handleClick(status, row) {
      this.status = status;
      if (status == 0) {
        this.form = {};
      } else {
        this.form = { ...row };
      }
      this.visible = true;
    },
    // 取消
    cancel() {
      this.visible = false;
    },
    // 提交form
    submit() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          // 新增
          if (this.status === 0) {
            // 修改
          } else if (this.status == 1) {
            this.form.page = undefined;
          } else {
            this.visible = false;
          }
        }
      });
    },
    // 搜索
    search() {
      this.tableLoading = true;
    },
    getExamRoomList() {},
  },
};
</script>
<style scoped>
.rows {
  display: flex;
  flex-wrap: wrap;
}
</style>
