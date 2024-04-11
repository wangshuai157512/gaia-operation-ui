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
              countyId: queryParams.countyId
            })
          "
          v-model="queryParams.drvSchoolId"
          filterable
          placeholder="请选择驾校"
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
            icon="el-icon-view"
            @click="btnActins(1)"
            type="info"
            v-hasPermi="['appointment-config:info']"
            v-if="checkedModel != '易学通'"
            >预约规则设置
          </el-button>
          <el-button
            v-if="checkedModel == '智能模拟器'"
            icon="el-icon-view"
            @click="btnActins(2)"
            type="info"
            v-hasPermi="['charge-config:info']"
            >收费标准设置
          </el-button>
          <el-button
            v-if="checkedModel == '智能模拟器'"
            icon="el-icon-view"
            @click="btnActins(3)"
            type="info"
            v-hasPermi="['share-proportion:info']"
            >分成比例设置
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
      :visible="dialogVisible"
      width="1250px"
      append-to-body
      @close="cancel"
    >
      <appointment
        ref="edappmtfv"
        v-if="visibleType == 1"
        :reserveForm="reserveForm"
        :newObj.sync="saveObj"
        :deviceTypeList="deviceTypeList"
      />

      <charge
        v-if="visibleType == 2"
        :drvSchoolName="drvSchoolName"
        :reserveForm="reserveForm"
        :carTypeList="carModelList"
        :newList.sync="saveList1"
        :timeOption="timeOption"
        :timeNoLimitOption="timeNoLimitOption"
        :chargeTypeList="chargeTypeList"
      />

      <share
        ref="edappmtfv"
        v-if="visibleType == 3"
        :reserveForm="reserveForm"
        :newObj.sync="saveObj"
      />

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="edit">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Appointment, Share, Charge } from "./modules";
import {
  operationPageList,
  appointmentInfo,
  appointmentEdit,
  chargeInfo,
  chargeEdit,
  shareInfo,
  shareEdit
} from "@/api/cloud/operationmanage.js";
import { drvSchoolInfo } from "@/api/cloud/drivInformation.js";
import { getDictSelect } from "@/api/param/select";
const column = function () {
  return [
    {
      title: "驾校名称",
      prop: "drvName",
      width: "330"
    },
    {
      title: "设备类型",
      prop: "model"
    },
    {
      title: "收费模块",
      prop: "chargeModel"
    },
    {
      title: "收费标准",
      prop: "chargeText",
      width: "200"
    },
    {
      title: "分成模式",
      prop: "shareText"
    }
  ];
};
export default {
  name: "Operation",
  components: { Appointment, Share, Charge },
  data() {
    return {
      deviceTypeList: [],
      // 数据字典 时间单位
      timeOption: [
        { value: 1, label: "分钟" },
        { value: 2, label: "小时" },
        { value: 3, label: "天" }
      ],
      // 数据字典 时间单位
      timeNoLimitOption: [
        { value: 1, label: "分钟" },
        { value: 2, label: "小时" },
        { value: 3, label: "天" }
        // { value: 5, label: "不限时" },
      ],
      // 整体优惠【0 无 1 全部免费 2 限时免费】
      chargeTypeList: [
        { value: 1, label: "全部免费" },
        { value: 2, label: "限时免费" }
      ],
      // 查询参数
      queryParams: {
        provinceId: "",
        cityId: "",
        countyId: "",
        drvSchoolId: "",
        pageNum: 1,
        pageSize: 20
      },
      total: 0,
      column: column.call(this),
      option: {
        isRadio: true
      },
      checkedModel: "",
      tableData: [],
      // 列表当前选择项
      multipleSelection: null,
      drvSchoolName: "",
      // 业务类型 1 预约规则设置  2 收费标准设置  3 分成比例设置
      visibleType: null,
      // 弹窗控制
      dialogVisible: false,
      // 弹窗标题
      title: "",
      // 表单model
      reserveForm: null,
      // 规则、分成最新数据 临时存储
      saveObj: null,
      // 驾校已有的车辆类型
      carModelList: [],
      // 预约 最新数据 临时存储
      saveList1: []
    };
  },
  async mounted() {
    await this.getAllDictList();
    this.getTableList(null);
  },
  methods: {
    // 获取准教车型
    getAllDictList() {
      getDictSelect("preferential_unit").then((res) => {
        this.timeOption = res.data;
        this.timeNoLimitOption = res.data.filter((item) => {
          return item.value != 5;
        });
      });
      getDictSelect("charge_type_area").then((res) => {
        this.chargeTypeList = res.data;
      });
    },
    // 获取列表数据
    getTableList(page) {
      this.checkedModel = "";
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      operationPageList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = Number(res.total);
        this.multipleSelection = null;
      });
    },
    //选择所在行
    handleCurrentChange(val) {
      if (val) {
        this.multipleSelection = val;
        this.checkedModel = val.model;
      }
    },
    // 按钮点击事件
    async btnActins(btnType) {
      if (!this.multipleSelection) {
        this.msgWarn("请选择一条数据");
        this.cancel();
        return;
      }
      let { drvSchoolId, id, appointmentId, shareId, model, drvName } =
        this.multipleSelection;
      let getInfo = null;
      let tmpid = null;
      switch (btnType) {
        case 1:
          this.title = "预约规则设置";
          getInfo = appointmentInfo;
          tmpid = appointmentId;
          break;
        case 2:
          this.title = "收费标准设置";
          let { data } = await drvSchoolInfo({ id: drvSchoolId });
          this.carModelList = data.busScope ? data.busScope.split(",") : [];
          getInfo = chargeInfo;
          tmpid = id;
          break;
        case 3:
          this.title = "分成比例设置";
          getInfo = shareInfo;
          tmpid = shareId;
          break;
        default:
          this.cancel;
          break;
      }

      getInfo({ id: tmpid }).then((res) => {
        if (res.code == 200) {
          if (btnType == 1) {
            this.reserveForm = {
              advanceDays: res.data.advanceDays, // 可提前预约天数	integer(int32)
              appointmentPersonHours: res.data.appointmentPersonHours, //	每人每日可预约时长	integer(int32)
              appointmentTotalHours: res.data.appointmentTotalHours, //	每日可预约总时长	integer(int32)
              drvSchoolId: drvSchoolId, //	驾校id	integer(int64)
              drvSchoolName: drvName,
              model: model,
              id: res.data.id, //	主键	integer(int64)
              outEnabled: res.data.outEnabled,
              startTime: res.data.startTime
                ? res.data.startTime.substr(0, 5)
                : null,
              endTime: res.data.endTime ? res.data.endTime.substr(0, 5) : null,
              subjectTime: res.data.subjectTime
            };
          }
          if (btnType == 2) {
            this.drvSchoolName = drvName;
            this.activeName = "0";
            let addtt = [];
            res.data = res.data ? res.data : [];
            //  处理数据  判断  没有得添加已有的复用
            this.carModelList.forEach((item) => {
              let ishas = false;
              res.data.forEach((item1) => {
                if (item == item1.carModel) {
                  item1.chargeType = item1.chargeType ? item1.chargeType : 1;
                  addtt.push(item1);
                  ishas = true;
                }
              });
              if (!ishas) {
                // 校内默认
                addtt.push({
                  id: "",
                  drvSchoolId: drvSchoolId,
                  operationId: id,
                  type: 0,
                  chargeType: 1,
                  freeTime: "",
                  freeTimeUnit: "",
                  carModel: item,
                  list: []
                });
                // 校外默认
                addtt.push({
                  id: "",
                  drvSchoolId: drvSchoolId,
                  operationId: id,
                  type: 1,
                  chargeType: 1,
                  freeTime: "",
                  freeTimeUnit: "",
                  carModel: item,
                  list: []
                });
              }
            });
            // let addtt = [];
            // let hasttd = [];
            // this.carModelList.forEach((item) => {
            //   res.data.forEach((item1) => {
            //     if (item == item1.carModel) {
            //       addtt.push(item1);
            //       if (!hasttd.includes(item)) {
            //         hasttd.push(item);
            //       }
            //     }
            //   });
            // });
            // if (this.carModelList.length != hasttd.length) {
            // }
            this.reserveForm = addtt;
          }
          if (btnType == 3) {
            this.reserveForm = {
              id: res.data.id,
              drvSchoolId: res.data.drvSchoolId,
              drvSchoolName: drvName,
              sharePartner: res.data.sharePartner,
              shareOther: res.data.shareOther,
              shareDrv: res.data.shareDrv,
              partnerBankName: res.data.partnerBankName,
              partnerBankCard: res.data.partnerBankCard,
              drvBankName: res.data.drvBankName,
              drvBankCard: res.data.drvBankCard
            };
          }
          this.visibleType = btnType;
          this.dialogVisible = true;
        }
      });
    },
    // 保存
    async edit() {
      let EditApi = null;
      let tempModel = null;
      let isCan = true;
      switch (this.visibleType) {
        case 1:
          this.title = "预约规则设置";
          EditApi = appointmentEdit;
          tempModel = this.saveObj;
          isCan = await this.$refs.edappmtfv.FormValidateFields();
          break;
        case 2:
          this.title = "收费标准设置";
          EditApi = chargeEdit;
          let warnStr = "";
          this.saveList1.forEach((item) => {
            if (item.chargeType === "2") {
              let isSetmealStatus = item.list.every((itemL) => {
                return itemL.setmealStatus === 1;
              });
              if (isSetmealStatus) warnStr += item.carModel + "、";
            }
          });
          if (warnStr) {
            this.msgWarn(
              `${warnStr.substr(
                0,
                warnStr.length - 1
              )}存在限时免费套餐，请先设置套餐在进行保存`
            );
            return;
          }
          tempModel = this.saveList1;
          break;
        case 3:
          isCan = await this.$refs.edappmtfv.validatorall();
          this.title = "分成比例设置";
          EditApi = shareEdit;
          tempModel = this.saveObj;
          break;
        default:
          this.cancel();
          break;
      }
      if (!isCan) return;
      EditApi(tempModel).then(async (res) => {
        this.getTableList(null);
        this.cancel();
      });
    },
    // 关闭设置界面
    cancel() {
      this.dialogVisible = false;
      this.visibleType = null;
      this.saveObj = null;
      this.saveList1 = [];
      this.carModelList = [];
      this.drvSchoolName = "";
      this.reserveForm = null;
    }
  }
};
</script>

<style lang="scss" scoped>
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
