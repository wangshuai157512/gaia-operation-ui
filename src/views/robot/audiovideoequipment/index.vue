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
      <el-form-item>
        <jaya-select
          type="SS"
          v-model="queryParams.drvSchoolId"
          :parameter="JSON.stringify(querySelect)"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="N"
          v-model="queryParams.licensePlate"
          :parameter="JSON.stringify({ id: queryParams.drvSchoolId })"
          placeholder="请选择车牌号"
        ></jaya-select>
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
            v-hasPermi="['video-config:add']"
          >
            添加
          </el-button>
          <el-button
            icon="el-icon-view"
            @click="btnaction(2)"
            type="info"
            v-hasPermi="['video-config:info']"
          >
            查看
          </el-button>
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="btnaction(3)"
            v-hasPermi="['video-config:update']"
          >
            编辑
          </el-button>

          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="btnaction(4)"
            v-hasPermi="['video-config:delete']"
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
      width="888px"
      append-to-body
      @close="cancel"
    >
      <el-form
        class="dialogForm"
        :model="reserveForm"
        ref="reserveForm"
        :inline="true"
        :rules="rules"
        :disabled="title == '查看设备'"
      >
         <el-form-item
          label="驾校"
          prop="countyId"
          class="querySchool all-item"
          style="width: 100%"
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
            v-model="reserveForm.drvSchoolId"
            :parameter="JSON.stringify(querySelect)"
            placeholder="请输入驾校"
            filterable
          ></jaya-select>
        </el-form-item>
        <el-form-item label="车牌号" prop="licensePlate">
          <jaya-select
            type="N"
            v-model="reserveForm.licensePlate"
            :parameter="JSON.stringify({ id: reserveForm.drvSchoolId })"
            placeholder="请选择车牌号"
          ></jaya-select>
        </el-form-item>
        <el-form-item
          label="设备类型："
          prop="equipmentType"
          class="equipmentType"
        >
          <!-- <el-input
            v-model="reserveForm.licensePlate"
            placeholder="请输入车牌号"
          /> -->
          <el-select
            size="small"
            v-model="reserveForm.equipmentType"
            placeholder="请选择设备类型"
            clearable
          >
            <el-option
              v-for="type in equipmentTypeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="IP" prop="ip">
          <el-input
            v-model="reserveForm.ip"
            placeholder="请输入IP"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="端口" prop="port">
          <el-input
            v-model="reserveForm.port"
            placeholder="请输入端口"
          />
        </el-form-item>
        <el-form-item label="通道" prop="passageway">
          <el-input
            v-model="reserveForm.passageway"
            placeholder="请输入通道"
          />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="reserveForm.userName"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="reserveForm.password"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            type="textarea"
            rows="3"
            placeholder="请输入备注"
            v-model="reserveForm.remarks"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" v-if="title != '查看设备'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  AudioVideoPageList,
  addAudioVideoApi,
  getAudioVideoInfoApi,
  updateAudioVideoApi,
  removeAudioVideoApi,
} from "@/api/cloud/goldmedalcoachmanagement.js";
import { getDictSelect } from "@/api/param/select";
import { getToken } from "@/utils/auth";
import { pageList } from "@/api/cloud/goldmedal.js";

const column = function () {
  return [
    {
      title: "车牌号",
      prop: "hphm",
      width: "130",
    },
    {
      title: "设备类型",
      prop: "equipmentType",
      status: () => {
        return this.equipmentTypeList;
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
      title: "通道",
      prop: "passageway",
    },
    {
      title: "用户名",
      prop: "userName",
    },
    {
      title: "密码",
      prop: "password",
    },
  ];
};
export default {
  name: "AudioVideoEquipment",
  data() {
    return {
      filterLicensePlateList: [],
      //设备类型
      equipmentTypeList: [],
      total: 0,
      queryParams: {
        provinceId: "",
        cityId: "",
        countyId: "",
        drvSchoolId: "",
        licensePlate: "",
        pageNum: 1,
        pageSize: 20,
      },
       querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      },
      dateTimeList: [],
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
        drvSchoolId: "", // 驾校ID	integer(int64)
        licensePlate: "", //	车牌号	string //
        equipmentType: "", //	设备类型	string //
        ip: "", //	IP	string	//
        port: "", //	端口	string ///
        passageway: "", //	通道	string
        userName: "", //	用户名	string
        password: "", //	密码	string
        remarks: "", //	备注	string
        state: "1",
      },
      // 表单规则
      rules: {
        drvSchoolId: [
          { required: true, message: "请选则驾校", trigger: "change" },
        ],
        equipmentType: [
          { required: true, message: "请选则设备类型", trigger: "blur" },
        ],
        port: [{ required: true, message: "请输入端口", trigger: "blur" }],
        ip: [{ required: true, message: "请输入IP", trigger: "blur" }],
        passageway: [
          { required: true, message: "请输入通道", trigger: "blur" },
        ],
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        licensePlate: [
          { required: true, message: "请输入车牌号", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    "reserveForm.drvSchoolId": {
      async handler(nl, ol) {
        if (nl) {
          if (this.title == "添加设备" || ol) {
            await this.filterLicensePlate("");
            this.reserveForm.licensePlate = "";
          }
        } else {
          if (this.title == "添加设备" || this.title == "编辑设备") {
            this.filterLicensePlateList = [];
            this.reserveForm.licensePlate = "";
          }
        }
      },
    },
  },
  async mounted() {
    // 获取字典
    await this.getAlldict();
    this.getTableList(null);
  },
  methods: {
    async filterLicensePlate(filter) {
      if (!this.reserveForm.drvSchoolId && this.title) {
        this.$message.warning("请选择驾校");
      }
      let { code, records } = await pageList({
        schoolId: this.reserveForm.drvSchoolId,
        pageNum: 1,
        pageSize: 20,
        licensePlate: filter,
      });
      if (code == 200) {
        this.filterLicensePlateList = records;
      }
    },
    // 获取 设备类型
    getAlldict() {
      getDictSelect("equipment_type").then((res) => {
        if (res.code == 200) {
          this.equipmentTypeList = res.data;
        }
      });
    },
    // 获取列表数据
    getTableList(page) {
      // if (!this.queryParams.drvSchoolId)
      //   return this.$message.warning("请选择学校");
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      AudioVideoPageList(this.queryParams).then((res) => {
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
    async btnaction(type) {
      if (
        (!this.multipleSelection || !this.multipleSelection.id) &&
        type != 1
      ) {
        this.$message({ message: "请选择设备", type: "warning" });
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
      this.title = "添加设备";
      this.visible = true;
    },
    //编辑
    async edit() {
      await this.getInfo(this.multipleSelection.id);
      this.title = "编辑设备";
      this.visible = true;
    },
    // 按钮查看
    async showdetail() {
      await this.getInfo(this.multipleSelection.id);
      this.title = "查看设备";
      this.visible = true;
    },
    // 查看api
    async getInfo(id) {
      await getAudioVideoInfoApi({ id: id })
        .then((res) => {
          if (res.code == 200) {
            res.data.state = String(res.data.state);
            this.reserveForm = res.data;
          }
        })
        .catch((e) => {});
    },
    // 删除
    removeAction(row) {
      this.$confirm(`确定要删除该设备`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let { data } = await removeAudioVideoApi({ id: row.id });
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
            case "添加设备":
              saveapi = addAudioVideoApi;
              msg = "添加成功！";
              break;
            case "编辑设备":
              saveapi = updateAudioVideoApi;
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
        drvSchoolId: "", // 驾校ID	integer(int64)
        licensePlate: "", //	车牌号	string //
        equipmentType: "", //	设备类型	string //
        ip: "", //	IP	string	//
        port: "", //	端口	string ///
        passageway: "", //	通道	string
        userName: "", //	用户名	string
        password: "", //	密码	string
        remarks: "", //	备注	string
        state: "1",
      };
      this.$refs.reserveForm.resetFields();

      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogForm {
  /deep/ .el-select,.el-select--small .el-input,
  .el-input--medium,
  .el-input {
    width: 242px;
  }
   .el-textarea {
    width: 608px;
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
