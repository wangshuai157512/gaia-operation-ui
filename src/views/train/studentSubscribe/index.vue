<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item>
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
          placeholder="预约训练地点"
          filterable
          clearable
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          v-if="queryParams.equipmentType==2"
          v-model="queryParams.carType"
          placeholder="预约车型"
          othername="exam_car_type"
          multiple
          sty="width:200px"
          clearable
        >
        </jaya-select>
        <el-select
          v-else
          v-model="queryParams.carType"
          size="small"
          placeholder="预约车型"
          style="width:200px"
          multiple
          clearable
        >
          <el-option
            v-for="item in carTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.status"
          size="small"
          placeholder="预约状态"
          clearable
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>

     <el-form-item>
        <el-date-picker
          class="daterange"
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="createRealName">
        <el-input
          size="small"
          style="width: 300px"
          v-model="queryParams.keyword"
          placeholder="请输入姓名/手机号"
          clearable
        >
          <template slot="prepend">学员</template>
        </el-input>
      </el-form-item>
      <el-button class="fun-btn-right" @click="select" type="primary"
        >查询</el-button
      >
    </el-form>

    <div class="table-box-con">
      <el-button-group>
        <el-button
          v-for="(item, index) in orderTypeOptions"
          :key="index"
          @click="tabBtn(item.value, index)"
          :class="[activeIndex === index ? 'getBtnActive' : '', 'getBtn']"
          >{{ item.label }}</el-button
        >
      </el-button-group>

      <el-button
        @click="handleClick"
        icon="el-icon-view"
        type="primary"
        style="margin-left: 10px"
        >取消预约</el-button
      >
      <jaya-table-group
        :total="total"
        :tableHeaderList="column"
        :tableList="tableList"
        @pagination="getPageList"
        @handleCurrentChange="handleCurrentChange"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :option="option"
        v-show="!visible"
      ></jaya-table-group>
    </div>
  </div>
</template>

<script>
import {
  reserveStudentList,
  reserveStudencancelUpdate,
} from "@/api/yxt/studentSubscribe";

export default {
  name: "studentSubscribe",
  //   components: { TableDetail },
  data() {
    return {
      date: [this.parseTime(new Date(), "{y}-{m}-{d}"),this.parseTime(new Date(), "{y}-{m}-{d}")],
      columnList:[],
      column:[],
      visible: false,
      form: {},
      // 弹出层标题
      title: "",
      tableList: [],
      tableData: [],
      option: {
        isRadio: true,
      },
      carTypeOptions:[
        {
          value: "C1",
          label: "C1",
        },
        {
          value: "C2",
          label: "C2",
        },
      ],
      statusOptions: [
        {
          value: 1,
          label: "待训练",
        },
        {
          value: 2,
          label: "已训练",
        },
        {
          value: 3,
          label: "已过期",
        },
        {
          value: 4,
          label: "已取消",
        },
        // {
        //   value: 5,
        //   label: "已完成",
        // },
      ],
      orderTypeOptions: [
        {
          value: 0,
          label: "模拟器",
        },
        {
          value: 1,
          label: "机器人教练",
        },
        {
          value: 2,
          label: "易学通",
        },
        {
          value: 3,
          label: "简学通",
        },
      ],
      trainSubjectOptions: [
        {
          value: 0,
          label: "基础训练",
        },
        {
          value: 1,
          label: "科目一",
        },
        {
          value: 2,
          label: "科目二",
        },
        {
          value: 3,
          label: "科目三",
        },
        {
          value: 4,
          label: "科安全文明驾驶",
        },
      ],
       chargeWayOptions: [
        {
          value: 0,
          label: "按时",
        },
        {
          value: 1,
          label: "按圈",
        },
      ],
      // 数据
      data: [],
      // 总条数
      total: 0,
      // table入参
      querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: false,
      },
      queryParams: {
        equipmentType: 0,
        pageNum: 1,
        pageSize: 10,
      },
      activeIndex: 0,
      typeOptions: [
        {
          value: 0,
          label: "否",
        },
        {
          value: 1,
          label: "是",
        },
      ],
      // table Loading框
      tableLoading: false,
      multipleSelection: null,
      rules: {},
    };
  },
  mounted() {
    this.columnList = [
      [
        {
          title: "学员姓名",
          prop: "name",
          width: "200",
        },
        {
          title: "手机号",
          prop: "telephone",
        },
        {
          title: "预约训练日期",
          prop: "trainDate",
        },
        {
          title: "预约时间段",
          prop: "timeSlot", 
          width: "220",
        },
        {
          title: "预约车型",
          prop: "carType"
        },
        {
          title: "预约状态",
          prop: "status",
          status: () => {
            return this.statusOptions;
          },
        },
        {
          title: "预约时间",
          prop: "createTime",
          width: "220",
        },

        {
          title: "预约训练地点",
          prop: "drvSchoolName",
          width: "200",
        },
      ],
      [
        {
          title: "学员姓名",
          prop: "name",
          width: "200",
        },
        {
          title: "手机号",
          prop: "telephone",
        },
        {
          title: "预约训练日期",
          prop: "trainDate",
        },
        {
          title: "预约时长",
          prop: "totalTimeDurationShow"
        },
        {
          title: "预约车型",
          prop: "carType"
        },
        {
          title: "验证码",
          prop: "verifyCode",
        },
        {
          title: "预约状态",
          prop: "status",
          status: () => {
            return this.statusOptions;
          },
        },
        {
          title: "预约时间",
          prop: "createTime",
          width: "220",
        },

        {
          title: "预约训练地点",
          prop: "drvSchoolName",
          width: "200",
        },
      ],
      [
        {
          title: "学员姓名",
          prop: "name",
          width: "200",
        },
        {
          title: "手机号",
          prop: "telephone",
        },
        {
          title: "预约训练日期",
          prop: "trainDate",
        },
        {
          title: "预约时长",
          prop: "totalTimeDurationShow",
          
        },
        {
          title: "预约车型",
          prop: "carType"
        },
        {
          title: "训练科目",
          prop: "trainSubject",
          status: () => {
            return this.trainSubjectOptions;
          },
        },
        {
          title: "计费类型",
          prop: "chargeWay",
          status: () => {
            return this.chargeWayOptions;
          },
        },
        {
          title: "应缴金额(元)",
          prop: "amount",
        },
        {
          title: "预约状态",
          prop: "status",
          status: () => {
            return this.statusOptions;
          },
        },
        {
          title: "预约时间",
          prop: "createTime",
          width: "220",
        },

        {
          title: "预约训练地点",
          prop: "drvSchoolName",
          width: "200",
        },
      ],
      [
        {
          title: "学员姓名",
          prop: "name",
          width: "200",
        },
        {
          title: "手机号",
          prop: "telephone",
        },
        {
          title: "预约训练日期",
          prop: "trainDate",
        },
        {
          title: "预约车型",
          prop: "carType"
        },
        {
          title: "训练科目",
          prop: "trainSubject",
          status: () => {
            return this.trainSubjectOptions;
          },
        },
        {
          title: "预约状态",
          prop: "status",
          status: () => {
            return this.statusOptions;
          },
        },
        {
          title: "预约时间段",
          prop: "createTime",
          formatter: ({ row }) => {
            return  `${row.startTime}-${row.endTime}`;
          },
        },

        {
          title: "预约训练地点",
          prop: "drvSchoolName",
          width: "200",
        },
      ],
    ]
  this.column = this.columnList[0]
    this.select();
  },
  watch: {
    "queryParams.equipmentType": {
      handler: "getPageList",
    },
  },
  methods: {
    tabBtn(val, index) {
      (this.queryParams.equipmentType = val), (this.activeIndex = index);
      this.column = this.columnList[index]
    },
    select() {
      this.queryParams.pageNum = 1;
      this.queryParams.startTime = this.date ? this.date[0] : "";
      this.queryParams.finishTime = this.date ? this.date[1] : "";
      this.getPageList();
    },
    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },

    //查询列表
    getPageList() {
      reserveStudentList(this.queryParams).then((res) => {
        res.records.forEach(item => {
          if(item.equipmentType==0) {
            item.timeSlot=(item.startTime?item.startTime:'')+'-'+(item.endTime?item.endTime:'')
          }else if(item.equipmentType==1) {
            item.totalTimeDurationShow=item.totalTimeDuration+'分钟'
          }else if(item.equipmentType==2) {
            item.chargeWay==1?item.totalTimeDurationShow=item.totalTimeDuration+'圈':item.totalTimeDurationShow=item.totalTimeDuration+'分钟'
          }
        });
        this.tableList = res.records;
        this.total = Number(res.total);
      });
    },

    //取消预约
    handleClick() {
      if (this.multipleSelection) {
        const { id, status } = this.multipleSelection;
        if (status != 1) {
          return this.msgWarn("只有“待训练”的预约才可以取消哟");
        } 
        this.$confirm("确定要取消该名学生的预约?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          reserveStudencancelUpdate({ id }).then((res) => {
            this.msgSuccess("取消成功");
            this.getPageList();
          });
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.ganged {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  /deep/.jaya-select {
    width: 30%;
  }
}

.timepick-width-prepend {
  align-items: center;
  .prepend-text {
    background: #f5f7fa;
    color: #909399;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: 40px;
    cursor: default;
    display: inline-flex;
    :focus,
    :hover {
      border-color: #dcdfe6 !important;
    }
  }

  .prepend-text:focus,
  .prepend-text:hover {
    border-color: #dcdfe6 !important;
  }

  .el-input__inner {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
}

.el-select .el-input {
  width: 130px;
}

/deep/ .el-dialog__title {
  margin: auto;
  display: block;
  text-align: center;
}

.boxStu {
  .styleStu {
    float: left;
  }
  .styleSh {
    float: right;
    width: 710px;
    padding-left: 40px;
  }
  .editText {
    color: #ff9650;
    position: fixed;
    padding-top: 20px;
    padding-left: 20px;
  }
  .editTextYijian {
    color: #38bf91;
    position: fixed;
    padding-top: 20px;
    padding-left: 20px;
  }
  .el-textarea {
    padding-top: 20px;
    padding-left: 20px;
    width: 520px;
  }
  #circle {
    width: 6px;
    height: 6px;
    background: #e2e7ed;
    -moz-border-radius: 60px;
    -webkit-border-radius: 60px;
    border-radius: 60px;
    margin-left: 16px;
  }
  #circle-two {
    position: fixed;
    width: 6px;
    height: 6px;
    background: #e2e7ed;
    -moz-border-radius: 60px;
    -webkit-border-radius: 60px;
    border-radius: 60px;
    margin-top: 290px;
    margin-left: 15px;
  }
  .find-div-body {
    position: relative;
    // top:30px;
    left: 1px;
    height: 80px;
    width: 650px;
    padding: 8px;
    background-color: #f7f7f8;
    border: #dee0e3 solid 1px;
    border-radius: 3px;
    margin-top: 30px;
  }
  .find-div-body:before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 23px;
    left: -16px;
    padding: 0;
    border-right: 8px solid #f7f7f8;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    display: block;
    content: "";
    z-index: 12;
  }
  .find-div-body:after {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 22px;
    left: -18px;
    padding: 0;
    border-right: 9px solid #cccccc;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 9px solid transparent;
    display: block;
    content: "";
    z-index: 10;
  }
  .find-div-body-two {
    position: relative;
    top: 30px;
    left: 1px;
    height: 142px;
    width: 650px;
    padding: 8px;
    background-color: #f7f7f8;
    border: #dee0e3 solid 1px;
    border-radius: 3px;
  }
  .find-div-body-two:before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 23px;
    left: -16px;
    padding: 0;
    border-right: 8px solid #f7f7f8;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    display: block;
    content: "";
    z-index: 12;
  }
  .find-div-body-two:after {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 22px;
    left: -18px;
    padding: 0;
    border-right: 9px solid #cccccc;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 9px solid transparent;
    display: block;
    content: "";
    z-index: 10;
  }
}

/deep/.el-dialog__body {
  position: relative;
}

.hrshow {
  position: absolute;
  width: 1px;
  height: 75%;
  background: #e2e7ed;
  left: 43px;
}

/deep/.el-tooltip {
  .el-button {
    background: #49bbc5;
    border-radius: 16px;
    color: white;
    padding: 4px 15px;
  }
}

.formShowInfo {
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
  position: relative;
  /deep/ .el-form-item {
    width: calc(50% - 25px);
    .el-form-item__content {
      width: calc(100% - 140px);
      .el-select--small {
        width: 100%;
      }
    }
  }
  .orderMes {
    margin-top: 30px;
  }
  .userMes {
    margin-top: 30px;
  }
  .hrShow {
    border: 1px solid #dfe9f2;
    margin-top: 10px;
  }
}

.table-box-con {
  .getBtn {
    background-color: #fff;
    color: #000;
    border-color: #b1b4ba;
  }
  .getBtnActive {
    color: #fff;
    border-color: #354153;
    background-color: #354153;
  }
}

.custom-dialog {
  .btn {
    position: relative;
    left: 80%;
  }
}

.avatar-uploader-file {
  position: absolute;
  top: 10px;
  right: 110px;
}
</style>
