<template>
  <div class="main">
    <div>
      <div class="tool">
        <jaya-select
          type="SS"
          :parameter="JSON.stringify({})"
          v-model="drvSchoolId"
          filterable
          placeholder="请选择驾校"
        ></jaya-select>
        <el-button
          @click="clickCount = 0"
          :type="clickCount == 0 ? 'primary' : ''"
          >收费标准设置</el-button
        >
        <!-- <el-button
          @click="clickCount = 1"
          :type="clickCount == 1 ? 'primary' : ''"
          >订单规则设置</el-button
        >
        <el-button
          @click="clickCount = 2"
          :type="clickCount == 2 ? 'primary' : ''"
          >预约规则设置</el-button
        > -->
        <el-button
          @click="clickCount = 3"
          :type="clickCount == 3 ? 'primary' : ''"
          >考试项目设置</el-button
        >
        <el-button
            @click="btnActins(1)"
            >预约规则设置
          </el-button>
        <!-- <el-button
            @click="btnActins(3)"
            >分成比例设置
          </el-button> -->
        <el-button
          v-if="isEdit"
          @click="handleSave"
          style="position: absolute; right: 0px"
          type="primary"
        >
          保存</el-button
        >
        <el-button
          v-else
          @click="handleEdit"
          style="position: absolute; right: 0px"
          type="primary"
        >
          编辑</el-button
        >
        <el-button
          v-if="isEdit"
          @click="handleCancel"
          style="position: absolute; right: 80px"
        >
          取消</el-button
        >
      </div>
      <!-- <div style="height:60px"></div> -->
      <div ref="components" class="components">
        <toll
          @carTypeChange="handleCarTypeChange"
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component0"
        ></toll>
        <!-- <order
          :carType="carType"
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component1"
        ></order>
        <reserve
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component2"
        ></reserve> -->
        <exam
          :carType="carType"
          :drvSchoolId="drvSchoolId"
          :isEdit="isEdit"
          ref="component3"
        ></exam>
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
import {
  appointmentJxtInfo,
  appointmentJxtEdit,
  appointmentJxtAdd,
  shareInfo,
  shareEdit
} from "@/api/cloud/operationmanage.js";
import { Toll, Exam, Appointment, Share } from "./modules";
export default {
  name: "jianxuetongRule",
  components: { Toll, Exam, Appointment, Share },

  Examprops: {},
  data() {
    return {
      isEdit: false,
      drvSchoolId: "",
      carType: "",
      clickCount: 0,
      commentId: Date.now(),

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
      deviceTypeList:[]
    };
  },
  watch: {
    clickCount(value) {
      this.$refs.components.scrollTop =
        this.$refs[`component${value}`].$el.offsetTop;
    },
  },
  mounted() {
    // this.$refs.components.addEventListener("scroll", ({ target }) => {});
  },
  methods: {
    handleCarTypeChange(value) {
      this.carType = value;
    },
    //取消
    handleCancel() {
      Promise.all([
        this.$refs.component0.initData(),
        // this.$refs.component1.initData(),
        // this.$refs.component2.initData(),
        this.$refs.component3.initData(),
      ])
        .then((res) => {
          this.isEdit = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //保存
    handleSave() {
      Promise.all([
        this.$refs.component0.rule(),
        // this.$refs.component1.rule(),
        // this.$refs.component2.rule(),
        this.$refs.component3.rule(),
      ])
        .then((res) => {
          this.isEdit = false;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    //编辑
    handleEdit() {
      if (!this.drvSchoolId) return this.msgWarn("请先选择驾校");
      this.isEdit = true;
    },

    // 新增功能预约设置和分成比例
     // 按钮点击事件
     async btnActins(btnType) {
      if (!this.drvSchoolId) return this.msgWarn("请先选择驾校");
      let getInfo = null;
      let tmpid = null;
      switch (btnType) {
        case 1:
          this.title = "预约规则设置";
          getInfo = appointmentJxtInfo;
          break;
        case 3:
          this.title = "分成比例设置";
          getInfo = shareInfo;
          tmpid = 36;
          break;
        default:
          this.cancel;
          break;
      }
  
      getInfo({ id: this.drvSchoolId }).then((res) => {
        if (res.code == 200) {
          if (btnType == 1) {
            this.reserveForm = {
              advanceDays: res.data.advanceDays, // 可提前预约天数	integer(int32)
              appointmentPersonHours: res.data.appointmentPersonHours, //	每人每日可预约时长	integer(int32)
              appointmentTotalHours: res.data.appointmentTotalHours, //	每日可预约总时长	integer(int32)
              drvSchoolId: this.drvSchoolId, //	驾校id	integer(int64)
              type: '3',
              id: res.data.id, //	主键	integer(int64)
              outEnabled: res.data.outEnabled,
              startTime: res.data.startTime
                ? res.data.startTime.substr(0, 5)
                : null,
              endTime: res.data.endTime ? res.data.endTime.substr(0, 5) : null,
              unUseStartTime: res.data.unUseStartTime
                ? res.data.unUseStartTime.substr(0, 5)
                : null,
                unUseEndTime: res.data.unUseEndTime ? res.data.unUseEndTime.substr(0, 5) : null,
              subjectTime: res.data.subjectTime
            };
          }
          if (btnType == 3) {
            this.reserveForm = {
              id: res.data.id,
              drvSchoolId: res.data.drvSchoolId,
              // drvSchoolName: drvName,
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
      this.saveObj.id= this.saveObj.id?this.saveObj.id:undefined
      switch (this.visibleType) {
        case 1:
          this.title = "预约规则设置";
          EditApi = this.saveObj.id?appointmentJxtEdit:appointmentJxtAdd;
          tempModel = this.saveObj;
          isCan = await this.$refs.edappmtfv.FormValidateFields();
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
        // this.getTableList(null);
        this.cancel();
      });
    },
    // 关闭设置界面
    cancel() {
      this.dialogVisible = false;
      this.visibleType = null;
      this.saveObj = null;
      this.saveList1 = [];
      this.drvSchoolName = "";
      this.reserveForm = null;
    }
  },
};
</script>

<style lang="scss" scoped>
/deep/.el-input.is-disabled .el-input__inner {
  color: black;
  text-align: center;
}
.main {
  height: calc(100vh - 50px);
  padding: 10px 20px;
  box-sizing: border-box;
  > div {
    height: 100%;
    overflow-y: scroll;
    position: relative;
  }

  .components {
    position: relative;
    height: calc(100% - 60px);
    overflow-y: scroll;
  }
  .container {
    background: white;
    padding: 15px;
    border-radius: 10px;
    margin-bottom: 20px;
  }
  .tool {
    width: 100%;
    height: 60px;
    display: flex;
    align-items: center;
    // position: fixed;
    top: 50px;
    // position: fixed;
    // background: white;
    z-index: 9999;
    .jaya-select {
      height: 36px;
      margin-right: 10px;
      /deep/ .el-input--small .el-input__inner {
        height: 36px;
        line-height: 36px;
      }
    }
  }
}

</style>
