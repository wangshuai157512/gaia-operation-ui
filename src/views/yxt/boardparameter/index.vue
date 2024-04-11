<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item class="querySchool">
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
      </el-form-item> -->
      <el-form-item>
        <jaya-select
          type="SS"
          v-model="queryParams.drvSchoolId"
          :parameter="JSON.stringify(querySelect)"
          placeholder="请选择驾校"
          filterable
        ></jaya-select>
      </el-form-item>
       <el-form-item prop="equipmentNumber">
          <el-input v-model="queryParams.equipmentNumber" placeholder="请输入设备编号">
          </el-input>
        </el-form-item>
      <el-form-item>
        <jaya-select
          type="YN"
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
        <div class="table-top-btn">
          <div class="table-top-btn-l">
            <el-button
              icon="el-icon-plus"
              @click="btnaction(1)"
              type="primary"
              v-hasPermi="['car-equipment-config:add']"
            >
              添加
            </el-button>
            <el-button
              icon="el-icon-view"
              @click="btnaction(2)"
              type="info"
              v-hasPermi="['car-equipment-config:info']"
            >
              查看
            </el-button>
            <el-button
              icon="el-icon-edit"
              type="warning"
              @click="btnaction(3)"
              v-hasPermi="['car-equipment-config:update']"
            >
              编辑
            </el-button>

            <el-button
              icon="el-icon-delete"
              type="danger"
              @click="btnaction(4)"
              v-hasPermi="['car-equipment-config:delete']"
            >
              删除
            </el-button>
          </div>
          <div class="table-top-btn-r">
              <el-button
                round
                @click="exportbtn"
                >导出</el-button
              >
            </div>
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
        :disabled="title == '查看车载设备'"
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
               :disabled="title == '编辑车载设备'"
            ></jaya-select>
            <jaya-select
              type="C"
              v-model="querySelect.cityId"
              :parameter="querySelect.provinceId"
              placeholder="请选择市/区"
               :disabled="title == '编辑车载设备'"
            ></jaya-select>
            <jaya-select
              type="T"
              v-model="querySelect.countyId"
              :parameter="querySelect.cityId"
              placeholder="请选择区/县"
               :disabled="title == '编辑车载设备'"
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
            :disabled="title == '编辑车载设备'"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="IP地址" prop="ip">
          <el-input v-model="reserveForm.ip" placeholder="请输入IP"> </el-input>
        </el-form-item>
        <el-form-item label="MAC地址" prop="mac">
          <el-input v-model="reserveForm.mac" placeholder="请输入MAC地址">
          </el-input>
        </el-form-item>
        <el-form-item label="培训科目" prop="subject">
          <el-select
            v-model="reserveForm.subject"
            placeholder="请选择"
            size="small"
            multiple
             :disabled="title == '编辑车载设备'"
          >
            <el-option
              v-for="item in kskmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="设备编号" prop="equipmentNumber">
          <el-input
            v-model="reserveForm.equipmentNumber"
            placeholder="请输入设备编号"
          />
        </el-form-item>
        <el-form-item label="SN">
          <el-input v-model="reserveForm.sn" placeholder="请输入SN" />
        </el-form-item>
        <el-form-item label="车牌号" prop="licensePlate">
          <jaya-select
            type="YN"
            v-model="reserveForm.licensePlate"
            :parameter="JSON.stringify({ id: reserveForm.drvSchoolId })"
            placeholder="请选择车牌号"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="状态" class="reserveFormstate">
          <el-select
            size="small"
            v-model="reserveForm.state"
            placeholder="请选择设备状态"
          >
            <el-option
              v-for="type in statusList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
         <el-form-item label="安装日期" prop="installTime">
              <el-date-picker
                size="small"
                value-format="yyyy-MM-dd"
                v-model="reserveForm.installTime"
                type="date"
                placeholder="选择日期"
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
        <el-button type="primary" @click="save" v-if="title != '查看车载设备'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  carEquipmentPageList,
  getInfoApi,
  removeApi,
  updateApi,
  addApi,
  carEquipmentConfigurationExport
} from "@/api/cloud/goldmedalcoachmanagement.js";
import { pageList } from "@/api/cloud/goldmedal.js";

const column = function () {
  return [
    {
      title: "驾校名称",
      prop: "drvSchoolName",
      width: "240",
    },
    {
      title: "IP",
      prop: "ip",
    },
     {
      title: "设备编号",
      prop: "equipmentNumber",
    },
    {
      title: "SN",
      prop: "sn",
    },
    {
      title: "科目",
      prop: "subject",
      status: () => {
        return this.kskmList;
      },
    },
     {
      title: "软件版本号",
      prop: "version",
    },
    {
      title: "车牌号",
      prop: "hphm",
    },
     {
      title: "设备状态",
      prop: "state",
      status: () => {
        return this.statusList;
      },
    },
    {
      title: "是否在线",
      prop: "isOnline",
      status: () => {
        return this.isOnlineList;
      },
    },
    {
      title: "安装日期",
      prop: "installTime",
       width: "180",
    },
    {
      title: "备注",
      prop: "remarks",
    },
  ];
};
export default {
  name: "boardparameter",
  data() {
    return {
      filterLicensePlateList: [],
      typeList: [
        { label: "部件练习视频", value: "A" },
        { label: "科目二项目视频", value: "B" },
        { label: "科目三项目视频", value: "C" },
        { label: "科目二考试视频", value: "D" },
        { label: "科目三考试视频", value: "E" },
      ], //视频类型
      advTypeList: [
        { label: "1-1", value: "11" },
        { label: "1-2", value: "12" },
      ], // 查看车载设备类型

      statusList: [
        { label: "正常", value: "1" },
        { label: "停用", value: "0" },
      ], // 视频状态
      total: 0,
      queryParams: {
        provinceId: "",
        cityId: "",
        countyId: "",
        drvSchoolId: "",
        licensePlate: "",
        pageNum: 1,
        pageSize: 20,
        equipType: 2,
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
        drvSchoolId: "",
        equipmentNumber: "",
        ip: "",
        licensePlate: "",
        remarks: "",
        sn: "",
        state: "1",
        installTime:this.parseTime(new Date(), "{y}-{m}-{d}")
      },
      kskmList: [
        {
          label: "科目二",
          value: "2",
        },
        {
          label: "科目三",
          value: "3",
        },
      ],
      isOnlineList: [
        {
          label: "否",
          value: "0",
        },
        {
          label: "是",
          value: "1",
        },
      ],
      // 表单规则
      rules: {
        drvSchoolId: [
          { required: true, message: "请选则驾校", trigger: "change" },
        ],
     ip: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern:
              /^((2[0-4]\d|25[0-5]|[01]?\d\d?)\.){3}(2[0-4]\d|25[0-5]|[01]?\d\d?)$/,
            message: "请输入正确的ip地址",
            trigger: "change",
          },
        ],
        mac: [
          { required: true, message: "必填项", trigger: "change" },
          {
            pattern: /^([0-9a-fA-F]{2})(([/\s:-][0-9a-fA-F]{2}){5})$/,
            message: "请输入正确的mac地址",
            trigger: "change",
          },
        ],
        subject: [
          { required: true, message: "必填项", trigger: "blur" },
        ],
        licensePlate: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        equipmentNumber: [
          { required: true, message: "必填项", trigger: "change" },
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
  mounted() {
    // 获取字典
    // this.getAdvTypeListList();
    this.getTableList(null);
  },
  methods: {
    async filterLicensePlate(filter) {
      let { code, records } = await pageList({
        schoolId: this.reserveForm.drvSchoolId,
        pageNum: 1,
        pageSize: 20,
        hphm: filter,
      });
      if (code == 200) {
        this.filterLicensePlateList = records;
      }
    },
    // 获取准教车型
    // getAdvTypeListList() {
    //   getDictSelect("exam_car_type").then((res) => {
    //     if (res.code == 200) {
    //       this.carTypeList = res.data;
    //     }
    //   });
    // },
    // 获取列表数据
    getTableList(page) {
      // if (!this.queryParams.drvSchoolId)
      //   return this.$message.warning("请选择学校");
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      carEquipmentPageList(this.queryParams).then((res) => {
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
        this.$message({ message: "请选择车载设备", type: "warning" });
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
    async add() {
      this.title = "添加车载设备";
      this.reserveForm.drvSchoolId = this.queryParams.drvSchoolId;
      this.visible = true;
      // await this.filterLicensePlate("");
    },
    //编辑
    async edit() {
      // await this.filterLicensePlate("");
      await this.getInfo(this.multipleSelection.id);
      this.title = "编辑车载设备";
      this.visible = true;
    },
    // 按钮查看
    async showdetail() {
      // await this.filterLicensePlate("");
      await this.getInfo(this.multipleSelection.id);
      this.title = "查看车载设备";
      this.visible = true;
    },
    // 查看api
    async getInfo(id) {
      await getInfoApi({ id: id, equipType: 2 })
        .then((res) => {
          if (res.code == 200) {
            res.data.state = String(res.data.state);
            res.data.subject =res.data.subject?res.data.subject.split(","):''
            this.reserveForm = res.data;
          }
        })
        .catch((e) => {});
    },
    // 删除
    removeAction(row) {
      this.$confirm(`确定要删除该车载设备`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let { data } = await removeApi({ id: row.id, equipType: 2 });
        this.getTableList(null);
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

      //导出
    exportbtn() {
      const loading = this.$loading({
        lock: true,
        text: "正在导出...",
        spinner: "el-icon-loading"
      });
      carEquipmentConfigurationExport({ ...this.queryParams, pageSize: 999999999 })
        .then((res) => {
          const link = document.createElement("a");
          const blob = new Blob([res], { type: "application/vnd.ms-excel" });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, "车载设备配置.xls");
            return;
          }
          link.style.display = "none";
          //设置连接
          link.href = URL.createObjectURL(blob);
          link.download = "车载设备配置";
          document.body.appendChild(link);
          //模拟点击事件
          link.click();
          loading.close();
          this.getTableList();
          this.msgSuccess("导出成功");
        })
        .catch((err) => {
          loading.close();
        });
    },

    // 保存
    save() {
      this.$refs.reserveForm.validate((valid) => {
        if (valid) {
          let saveapi = null;
          let msg = "";
          switch (this.title) {
            case "添加车载设备":
              saveapi = addApi;
              msg = "添加成功！";
              break;
            case "编辑车载设备":
              saveapi = updateApi;
              msg = "编辑成功！";
              break;
            default:
              break;
          }
          saveapi({ ...this.reserveForm,subject:this.reserveForm.subject+'', equipType: 2 })
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
        carModel: "",
        drvSchoolId: "",
        equipmentName: "",
        equipmentNumber: "",
        ip: "",
        licensePlate: "",
        remarks: "",
        sn: "",
        state: "1",
        installTime:this.parseTime(new Date(), "{y}-{m}-{d}")
      };
      this.$refs.reserveForm.resetFields();
      this.visible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogForm {
  /deep/ .el-select,
  .el-select--small .el-input,
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
  // /deep/.tw {
  //   width: 100%;
  //   .el-form-item__label {
  //     width: 200px;
  //   }
  //   .el-form-item__content {
  //     font-size: 16px;
  //     color: #444;
  //     font-weight: 700;
  //   }
  // }
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
