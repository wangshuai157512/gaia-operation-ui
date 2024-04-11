<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item class="querySchool">
        <div class="ganged">
          <jaya-select
            type="P"
            v-model="queryParams.provinceId"
            placeholder="请选择省/市"
          ></jaya-select>
          <jaya-select
            type="C"
            v-model="queryParams.cityId"
            :parameter="queryParams.provinceId"
            placeholder="请选择市/区"
          ></jaya-select>
          <jaya-select
            type="T"
            v-model="queryParams.countyId"
            :parameter="queryParams.cityId"
            placeholder="请选择区/县"
          ></jaya-select>
        </div>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="SS"
          :parameter="
            JSON.stringify({
              provinceId: queryParams.provinceId,
              cityId: queryParams.cityId,
              countyId: queryParams.countyId,
              hasSubSchool: true,
            })
          "
          v-model="queryParams.id"
          placeholder="请选择驾校"
        ></jaya-select>
      </el-form-item>
       <el-form-item prop="equipType">
          <jaya-select
            size="small"
            v-model="queryParams.equipType"
            placeholder="请选择设备类型"
            othername="equipType"
            clearable
          />
        </el-form-item>
      <el-button
        class="fun-btn-right"
        @click="getTableList(null)"
        type="primary"
      >
        查询
      </el-button>
    </el-form>
    <div class="table-box-con">
      <div class="branch-school">
        <div>
          <el-button
            icon="el-icon-plus"
            @click="btnaction(1)"
            type="primary"
            v-hasPermi="['school-config:add']"
          >
            添加
          </el-button>
          <el-button
            icon="el-icon-view"
            @click="btnaction(2)"
            type="info"
            v-hasPermi="['school-config:info']"
          >
            查看
          </el-button>
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="btnaction(3)"
            v-hasPermi="['school-config:update']"
          >
            编辑
          </el-button>

          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="btnaction(4)"
            v-hasPermi="['school-config:delete']"
          >
            删除
          </el-button>
        </div>
        <jaya-table-group
          :total="total"
          :tableHeaderList="column"
          :tableList="tableData"
          @pagination="getTableList"
          @handleCurrentChange="handleCurrentChange"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :option="option"
        ></jaya-table-group>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible="visible"
      width="980px"
      append-to-body
      @close="cancel"
    >
      <el-form
        class="dialogForm"
        :model="reserveForm"
        ref="reserveForm"
        :inline="true"
        :rules="rules"
        style="width: 940px"
        :disabled="title == '查看系统参数'"
      >
        <el-form-item label="驾校 ：" prop="drvSchoolId">
          <jaya-select
            type="P"
            v-model="reserveForm.provinceId"
            placeholder="请选择省/市"
          ></jaya-select>
          <jaya-select
            type="C"
            v-model="reserveForm.cityId"
            :parameter="reserveForm.provinceId"
            placeholder="请选择市/区"
          ></jaya-select>
          <jaya-select
            type="T"
            v-model="reserveForm.countyId"
            :parameter="reserveForm.cityId"
            placeholder="请选择区/县"
          ></jaya-select>
          <jaya-select
            type="SS"
            :parameter="
              JSON.stringify({
                provinceId: reserveForm.provinceId,
                cityId: reserveForm.cityId,
                countyId: reserveForm.countyId,
                hasSubSchool: true,
              })
            "
            v-model="reserveForm.drvSchoolId"
            placeholder="请选择驾校"
          ></jaya-select>
        </el-form-item>
        <br />

        <el-form-item label="系统类型：" prop="systemType">
          <el-select
            size="small"
            v-model="reserveForm.systemType"
            placeholder="请选择系统类型"
            clearable
          >
            <el-option
              v-for="type in systemTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="数据协议：" prop="protocolType">
          <el-select
            size="small"
            v-model="reserveForm.protocolType"
            placeholder="请选择数据协议"
            clearable
          >
            <el-option
              v-for="type in dataProtocolList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <!-- carModel state: 0, -->
        <el-form-item label="IP：" prop="ip">
          <el-input v-model="reserveForm.ip" placeholder="请输入IP"> </el-input>
        </el-form-item>
        <el-form-item label="端口：" prop="port">
          <el-input v-model="reserveForm.port" placeholder="请输入端口" />
        </el-form-item>
        <el-form-item label="设备类型：" prop="equipType">
          <jaya-select
            size="small"
            v-model="reserveForm.equipType"
            placeholder="请选择设备类型"
            othername="equipType"
            clearable
          />
        </el-form-item>
        <el-form-item label="备注：">
          <el-input v-model="reserveForm.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" v-if="title != '查看系统参数'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  // systemConfigList,
  // getSystemConfigInfoApi,
  // removeSystemConfigApi,
  // updateSystemConfigApi,
  // addSystemConfigApi,
  systemConfigList,
  getSystemConfigInfoApi,
  updateSystemConfigApi,
  removeSystemConfigApi,
  addSystemConfigApi,
} from "@/api/cloud/goldmedalcoachmanagement.js";
import { getDictSelect } from "@/api/param/select";
import { getToken } from "@/utils/auth";
const column = function () {
  return [
    {
      title: "系统类型",
      prop: "systemType",
      status: () => {
        return this.systemTypeList;
      },
    },
    {
      title: "IP",
      prop: "ip",
    },
    {
      title: "端口",
      prop: "port",
    },
    {
      title: "数据协议",
      prop: "protocolType",
      status: () => {
        return this.dataProtocolList;
      },
    },
    {
      title: "设备类型",
      prop: "protocolType",
      status: () => {
        return "equipType";
      },
    },
    {
      title: "备注",
      prop: "remark",
    },
  ];
};
export default {
  name: "SystemParameter",
  data() {
    return {
      systemTypeList: [], // 字典
      dataProtocolList: [],

      total: 0,
      queryParams: {
        provinceId: "",
        cityId: "",
        countyId: "",
        drvSchoolId: "",
        pageNum: 1,
        pageSize: 20,
      },
      column: column.call(this),
      option: {
        isRadio: true,
      },
      tableData: [],
      // 列表当前选择项
      multipleSelection: null,
      // 弹窗显示控制
      visible: false,
      // 弹窗标题
      title: "",
      // 表单model
      reserveForm: {
        drvSchoolId: "",
        systemType: "", // 系统类型
        protocolType: "", // 数据协议
        ip: "",
        port: "",
        remark: "",
      },
      // 表单规则
      rules: {
        drvSchoolId: [
          { required: true, message: "请选择驾校", trigger: "change" },
        ],
        port: [{ required: true, message: "请输入端口号", trigger: "blur" }],
        ip: [{ required: true, message: "请输入IP", trigger: "blur" }],
        systemType: [
          { required: true, message: "请选择系统类型", trigger: "change" },
        ],
        protocolType: [
          { required: true, message: "请选择数据协议", trigger: "change" },
        ],
        equipType: [
          { required: true, message: "请选择设备类型", trigger: "change" },
        ],
      },
    };
  },
  async mounted() {
    // 获取字典
    await this.getAlldict();
    this.getTableList(null);
  },
  methods: {
    // 获取准教车型
    getAlldict() {
      getDictSelect("sys_parameter_type").then((res) => {
        if (res.code == 200) {
          this.systemTypeList = res.data;
        }
      });
      getDictSelect("data_protocol").then((res) => {
        if (res.code == 200) {
          this.dataProtocolList = res.data;
        }
      });
    },
    // 获取列表数据
    getTableList(page) {
      // if (!this.queryParams.id) return this.$message.warning("请选择学校");
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      systemConfigList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableData = res.records;
          this.total = Number(res.total);
        }
      });
    },
    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },
    // 按钮事件判断
    btnaction(type) {
      if (
        (!this.multipleSelection || !this.multipleSelection.id) &&
        type != 1
      ) {
        this.$message({ message: "请选择系统参数", type: "warning" });
        return;
      }
      switch (type) {
        case 1: //增加
          this.add();
          break;
        case 2: //查看
          this.showdetail();
          break;
        case 3: //编辑
          this.edit();
          break;
        case 4: //删除
          this.removeAction({ id: this.multipleSelection.id });
          break;
        default:
          break;
      }
    },
    // 增加
    add() {
      this.title = "添加系统参数";
      this.visible = true;
    },
    //编辑
    async edit() {
      await this.getInfo(this.multipleSelection.id);
      this.title = "编辑系统参数";
      this.visible = true;
    },
    // 按钮查看
    async showdetail() {
      await this.getInfo(this.multipleSelection.id);
      this.title = "查看系统参数";
      this.visible = true;
    },
    // 查看api
    async getInfo(id) {
      await getSystemConfigInfoApi({ id: id })
        .then((res) => {
          if (res.code == 200) {
            res.data.state = String(res.data.state);
            res.data.equipType = String(res.data.equipType);
            this.reserveForm = res.data;
          }
        })
        .catch((e) => {});
    },
    // 删除
    removeAction(row) {
      this.$confirm(`确定要删除该系统配置`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let { data } = await removeSystemConfigApi({ id: row.id });
        this.getTableList(null);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    // 保存
    save() {
      this.$refs.reserveForm.validate((valid) => {
        if (valid) {
          let saveapi = null;
          let msg = "";
          switch (this.title) {
            case "添加系统参数":
              saveapi = addSystemConfigApi;
              msg = "添加成功！";
              break;
            case "编辑系统参数":
              saveapi = updateSystemConfigApi;
              msg = "编辑成功！";
              break;
            default:
              break;
          }
          saveapi(this.reserveForm)
            .then((res) => {
              if (res.code == 200) {
                this.cancel();
                this.getTableList(null);
                this.$message({
                  type: "success",
                  message: msg,
                });
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭设置界面
    cancel() {
      this.title = "";
      this.reserveForm = {
        drvSchoolId: "",
        protocolType: "", // 数据协议
        systemType: "", // 系统类型
        ip: "",
        port: "",
        remark: "",
      };
      this.$refs.reserveForm.resetFields();
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogForm {
  /deep/ .el-select--small .el-input,
  .el-input--medium,
  .el-input {
    width: 200px;
  }

  /deep/.school {
    .el-form-item__label {
      width: 80px;
    }
  }
  /deep/.tw {
    width: 100%;
    .el-form-item__label {
      width: 200px;
    }
    .el-form-item__content {
      font-size: 16px;
      color: #444;
      font-weight: 700;
    }
  }
}
.formTitle,
.formData {
  height: 60px;
  display: flex;
  li {
    flex: 1;
    font-weight: 700;
    line-height: 60px;
    text-align: center;
    /deep/ .el-input,
    .el-select--small .el-input {
      width: 80px !important;
    }
  }
  li:nth-child(2),
  li:nth-child(3) {
    width: 120px;
    flex: none;
  }
}
.querySchool {
  .ganged {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    /deep/.jaya-select {
      width: 30%;
      .el-input,
      .el-select {
        width: 100%;
      }
    }
  }
}
.jaya-select {
  display: inline-block;
}
.table-box-con {
  // display: flex;
  .campus-school {
    width: 360px;
    margin-right: 38px;
    img {
      width: 360px;
      height: 270px;
    }
    .campus-school-item {
      h5 {
        font-size: 16px;
        color: #354153;
        margin-bottom: 10px;
      }
      p {
        font-size: 16px;
        color: #444;
        width: 100%;
        line-height: 2.6;
        border-bottom: 1px solid #000;
        margin-top: 0;
      }
    }
  }
}
</style>
