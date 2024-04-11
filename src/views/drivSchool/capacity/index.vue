<template>
  <div class="app-container">
    <div class="table-box-con">
      <div class="table-top-btn">
        <div class="table-top-btn-l">
          <el-button
            type="primary"
            @click="addUser"
            icon="el-icon-plus"
            v-hasPermi="['ctluser:add']"
            >添加</el-button
          >
          <el-button
            icon="el-icon-view"
            type="info"
            @click="detail"
            v-hasPermi="['ctluser:info']"
            >查看</el-button
          >
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['ctluser:update']"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="delet"
            v-hasPermi="['ctluser:delete']"
            >删除</el-button
          >
        </div>
      </div>
      <jaya-table-group
        :total="total"
        :tableHeaderList="column"
        :tableList="tableData"
        @pagination="getTableList"
        :option="option"
        @handleCurrentChange="handleCurrentChange"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
      ></jaya-table-group>
    </div>
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="visible"
      width="780px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :disabled="operating == 3"
        :model="form"
        ref="form"
        :inline="true"
        :rules="rules"
      >
        <el-form-item
          label="驾校"
          class="querySchool all-item"
          style="width: 100%"
          prop="countyId"
        >
          <div class="ganged">
            <jaya-select
              type="P"
              v-model="querySelect.provinceId"
              placeholder="请选择省/市"
            ></jaya-select>
            <jaya-select
              type="C"
              v-model="querySelect.cityId"
              :parameter="querySelect.provinceId"
              placeholder="请选择市/区"
            ></jaya-select>
            <jaya-select
              type="T"
              v-model="querySelect.countyId"
              :parameter="querySelect.cityId"
              placeholder="请选择区/县"
            ></jaya-select>
          </div>
        </el-form-item>
        <el-form-item label="驾校名称" prop="drvSchoolId">
          <jaya-select
            type="SS"
            v-model="form.drvSchoolId"
            :parameter="JSON.stringify(querySelect)"
            placeholder="请输入驾校"
            filterable
          ></jaya-select>
        </el-form-item>
        <el-form-item label="登录用户名" prop="loginname">
          <el-input
            v-model="form.loginname"
            placeholder="请输入登录用户名"
            size="small"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="form.password"
            autocomplete="new-password"
            type="password"
            placeholder="请输入密码"
            size="small"
          />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入姓名" size="small" />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input
            v-model="form.telephone"
            placeholder="请输入联系电话"
            size="small"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            v-model="form.idCard"
            placeholder="请输入身份证号"
            size="small"
          />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select
            clearable
            v-model="form.status"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" style="width: 100%">
          <el-input type="textarea" rows="3" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="operating !== 3">
        <el-button type="primary" @click="handleSure">确 定</el-button>
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 分配车辆 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="openCar"
      width="900px"
      append-to-body
      class="allocation-dialog"
    >
      <el-form
        class="dialogForm"
        :model="formCar"
        ref="formCar"
        :inline="true"
        :rules="rules"
      >
        <el-form-item style="width: 100%">
          <div class="allocation-title">分配机器人教练车辆</div>
          <el-checkbox
            :indeterminate="isIndeterminateCar"
            v-model="checkAllCar"
            @change="handleCheckAllCarChange"
            class="all-check"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="goodCoachIds"
            @change="handleCheckedCarChange"
            class="check-car"
          >
            <el-checkbox
              v-for="item in goodCoachList"
              :label="item.value"
              :key="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureCar">确 定</el-button>
        <el-button @click="openCar = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  ctlPageList,
  ctlAdd,
  ctlUpdate,
  ctlInfo,
  ctlRemove,
  ctlGoldCoachList,
  ctlRelate,
} from "@/api/cloud/capacity";
const column = function () {
  return [
    {
      title: "登录名",
      prop: "loginname",
      width: "130",
    },
    {
      title: "姓名",
      prop: "name",
    },
    {
      title: "电话",
      prop: "telephone",
    },
    {
      title: "所管理驾校",
      prop: "drvSchoolName",
    },
    {
      title: "操作",
      width: "200",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "分配车辆",
          size: "mini",
          onClick: this.car,
         hasPermi: ["ctluser:relate:list"],
        },
      ],
    },
  ];
};
export default {
  name: "capacity",
  data() {
    return {
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      column: column.call(this),
      tableData: [],
      option: {
        isRadio: true,
      },
      activeRow: {},
      visible: false,
      operating: 0,
      title: "",
      querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      },
      form: {},
      statusList: [
        {
          label: "开启",
          value: 0,
        },
        {
          label: "停用",
          value: 1,
        },
      ],
      openCar: false,
      formCar: {},
      checkAllCar: false,
      checkAllSimulator: false,
      goodCoachIds: [], // 选中项
      goodCoachList: [], //展示项
      isIndeterminateCar: true,
      rules: {
        loginname: [{ required: true, message: "必填项", trigger: "change" }],
        password: [{ required: true, message: "必填项", trigger: "change" }],
        name: [{ required: true, message: "必填项", trigger: "change" }],
        idCard: [
          {
            pattern:
              /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/,
            message: "请输入正确身份证号",
            trigger: "change",
          },
        ],
        telephone: [
          {
            required: true,
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确手机号",
            trigger: "change",
          },
        ],
        drvSchoolId: [{ required: true, message: "必填项", trigger: "blur" }],
        // countyId: [{ required: true, message: "必填项", trigger: "blur" }],
      },
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      ctlPageList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    // 点击单选获取当前行
    handleCurrentChange(row) {
      this.activeRow = row;
    },
    // 新增
    addUser() {
      (this.querySelect = {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      }),
        (this.form = {});
      this.resetForm("form");
      this.operating = 1;
      this.title = "添加";
      this.visible = true;
    },
    // 编辑
    async edit() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.operating = 2;
      this.title = "编辑";
      await this.getInfo();
      this.visible = true;
    },
    // 详情
    async detail() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.operating = 3;
      this.title = "详情";
      await this.getInfo();
      this.visible = true;
    },
    async getInfo() {
      let { data } = await ctlInfo({ id: this.activeRow.id });
      this.form = data;
    },
    // 提交
    handleSure() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.operating === 1) {
            let { data } = await ctlAdd(this.form);
            this.getTableList();
            this.msgSuccess("新增成功");
            this.visible = false;
          } else {
            let { data } = await ctlUpdate(this.form);
            this.getTableList();
            this.msgSuccess("修改成功");
            this.visible = false;
          }
        }
      });
    },

    // 删除
    delet() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      let { id } = this.activeRow;
      this.$confirm(`确定要删除此教练信息`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let { data } = await ctlRemove({ id });
        this.getTableList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    // 分配机器人教练车辆
    handleCheckAllCarChange(val) {
      let allList = this.goodCoachList.map((item) => {
        return item.value;
      });
      this.goodCoachIds = val ? allList : [];
      this.isIndeterminateCar = false;
    },
    handleCheckedCarChange(value) {
      let checkedCount = value.length;
      this.checkAllCar = checkedCount === this.goodCoachList.length;
      this.isIndeterminateCar =
        checkedCount > 0 && checkedCount < this.goodCoachList.length;
    },
    // 分配车辆
    async car(row) {
      this.formCar = row;
      let { id, drvSchoolId } = row;
      let { data } = await ctlGoldCoachList({ id, drvSchoolId });
      // 选中项
      this.goodCoachIds = data.map((item) => {
        if (item.selected) {
          return item.value;
        }
      });
      this.goodCoachIds = this.goodCoachIds.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.goodCoachList = data;
      this.openCar = true;
    },
    handleCheckAllChange(val) {
      this.checkedCities = val ? this.cities : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.cities.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.cities.length;
    },
    // 提交分配车辆
    handleSureCar() {
      let queryCar = {
        ctlUser: this.formCar.id,
        goodCoachIds: this.goodCoachIds,
      };
      ctlRelate(queryCar).then((res) => {
        this.msgSuccess("分配成功");
        this.getTableList();
        this.openCar = false;
      });
    },
  },

  mounted() {
    this.getTableList();
  },
};
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-dialog__body .el-form-item {
    width: calc(50% - 10px);
    /deep/.el-form-item__content {
      width: calc(100% - 114px);
    }
  }
  .ganged {
    display: flex;
    justify-content: space-between;
    width: calc(100% - 10px) !important;
    /deep/.jaya-select {
      width: 30%;
      .el-input,
      .el-select {
        width: 100%;
      }
    }
  }
}

.allocation-dialog {
  .el-dialog__header {
    display: none;
  }
  /deep/.el-form-item__content {
    width: 867px!important;
  }
  .el-form-item {
    border-bottom: 1px dashed #c5cccc;
  }
  .allocation-title {
    display: inline-block;
    vertical-align: middle;
    font-size: 22px;
    color: #000;
    margin-right: 20px;
  }
  .all-check {
    display: inline-block;
    vertical-align: middle;
  }
  .el-checkbox {
    margin-right: 20px;
  }
  .check-car {
    padding-bottom: 30px;
    height: 380px;
    overflow-y: auto;
    /deep/.el-checkbox__inner {
      width: 150px;
      height: 100px;
      border: 0;
      background: url("../../../assets/images/coachCarNormal.png") no-repeat
        center center;
      margin-top: 20px;
    }
    /deep/.el-checkbox__label {
      padding-left: 0;
      position: absolute;
      left: 50%;
      top: 80%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    /deep/.is-checked {
      .el-checkbox__inner {
        background: url("../../../assets/images/coachCarCheck.png") no-repeat
          center center;
      }
      .el-checkbox__inner::after {
        width: 0;
        height: 0;
        border: 0;
      }
    }
  }
  .check-simulator {
    padding-bottom: 30px;
    /deep/.el-checkbox__inner {
      width: 80px;
      height: 100px;
      border: 0;
      background: url("../../../assets/images/coachSimulatorNormal.png")
        no-repeat center center;
      margin-top: 20px;
    }
    /deep/.el-checkbox__label {
      padding-left: 0;
      position: absolute;
      left: 50%;
      top: 80%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    /deep/.is-checked {
      .el-checkbox__inner {
        background: url("../../../assets/images/coachSimulatorCheck.png")
          no-repeat center center;
      }
      .el-checkbox__inner::after {
        width: 0;
        height: 0;
        border: 0;
      }
    }
  }
}
</style>
