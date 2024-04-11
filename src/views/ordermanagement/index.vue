<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
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
      <el-form-item prop="createRealName">
        <el-input
          size="small"
          style="width: 300px"
          v-model="queryParams.createRealName"
          placeholder="请输入姓名"
          clearable
        >
          <template slot="prepend">学员</template>
        </el-input>
      </el-form-item>
      <!-- <el-form-item prop="orderType">
        <el-select
          clearable
          v-model="queryParams.orderType"
          size="small"
          placeholder="请选择类型"
        >
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item prop="id">
        <el-input
          size="small"
          style="width: 300px"
          v-model="queryParams.id"
          placeholder="请输入订单编号"
          clearable
        >
          <template slot="prepend">订单编号</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="" class="timepick-width-prepend">
        <el-button type="default" class="prepend-text">下单时间</el-button>
        <el-date-picker
          style="width: 220px !important"
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-button class="fun-btn-right" @click="select" type="primary"
        >查询</el-button
      >
    </el-form>

    <div class="table-box-con">
      <el-button-group>
        <el-button @click="queryParams.status = ''" class="getBtn"
          >全部</el-button
        >

        <el-button @click="queryParams.status = 1" class="getBtn"
          >已支付</el-button
        >

        <el-button @click="queryParams.status = 2" class="getBtn"
          >使用中</el-button
        >

        <el-button @click="queryParams.status = 3" class="getBtn"
          >已完成</el-button
        >
      </el-button-group>

      <el-button
        @click="handleClick"
        icon="el-icon-view"
        type="primary"
        style="margin-left: 10px"
        >查看详情</el-button
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
    <!-- 添加、编辑、详情-->
    <div class="custom-dialog" v-if="visible">
      <div class="custom-dialog-con">
        <div class="formShowInfo">
          <el-form
            class="dialogForm"
            ref="form"
            :model="form"
            :rules="rules"
            :inline="true"
            label-width="80px"
            disabled
          >
            <span style="color: #d5d7d8">订单详情</span>
            <div style="font-size: 18px; margin-top: 20px">订单信息</div>
            <div class="orderMes">
              <el-form-item label="订单编号" prop="id">
                <el-input v-model="form.id" size="small" />
              </el-form-item>
              <el-form-item label="订单状态" prop="status">
                <el-select v-model="form.status" size="small">
                  <el-option
                    v-for="item in statusOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="下单时间" prop="createTime">
                <el-input v-model="form.createTime" size="small" />
              </el-form-item>
              <el-form-item label="支付金额" prop="amountMoney">
                <el-input v-model="form.amountMoney" size="small"
                  ><template slot="append">元</template></el-input
                >
              </el-form-item>
              <el-form-item label="购买时长" prop="initDuration">
                <el-input v-model="form.initDuration" size="small"
                  ><template slot="append">分钟</template></el-input
                >
              </el-form-item>
              <el-form-item label="支流水号" prop="payNumber">
                <el-input v-model="form.payNumber" size="small" />
              </el-form-item>
              <el-form-item label="支付方式" prop="payType">
                <el-select v-model="form.payType" size="small">
                  <el-option
                    v-for="item in payTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="hrShow"></div>
            <div style="font-size: 18px; margin-top: 20px">用户信息</div>
            <div class="userMes">
              <el-form-item label="用户名称" prop="createRealName">
                <el-input v-model="form.createRealName" size="small" />
              </el-form-item>
              <el-form-item label="手机号" prop="createPhone">
                <el-input v-model="form.createPhone" size="small" />
              </el-form-item>
              <el-form-item label="所属驾校" prop="drvSchoolName">
                <el-input v-model="form.drvSchoolName" size="small" />
              </el-form-item>
            </div>
          </el-form>
          <div
            style="margin-top: 20px"
            v-if="form.status == 2 || form.status == 3"
          >
            <div style="font-size: 18px">使用记录</div>
            <el-table
              :data="tableData"
              class="tableStyle"
              style="width: 100%; padding-top: 20px"
            >
              <el-table-column prop="startTime" label="开始时间" />
              <el-table-column prop="endTime" label="结束时间" />
              <el-table-column prop="goldCoachId" label="智能模拟器编号" />
              <el-table-column prop="useDuration" label="训练时长" />
              <el-table-column prop="remainDuration" label="剩余时长" />
            </el-table>
          </div>

          <div class="btn">
            <el-button @click="visible = false">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  ordersPage,
  ordersInfo,
  detailsList,
} from "@/api/cloud/orderManagement";
const column = function () {
  return [
    {
      title: "订单编号",
      prop: "id",
      width: "200",
    },
    {
      title: "订单金额",
      prop: "amountMoney",
    },
    {
      title: "订单时长",
      prop: "initDuration",
    },
    {
      title: "下单时间",
      prop: "createTime",
    },
    {
      title: "支付流水号",
      prop: "payNumber",
      width: "300",
    },
    {
      title: "支付方式",
      prop: "payType",
      status: () => this.payTypeOptions,
    },
    {
      title: "用户名称",
      prop: "createRealName",
    },
    {
      title: "手机号",
      prop: "createPhone",
    },
    {
      title: "驾校",
      prop: "drvSchoolName",
      width: "200",
    },
  ];
};
export default {
  name: "orderManagement",
  //   components: { TableDetail },
  data() {
    return {
      column: column.call(this),
      visible: false,
      form: {},
      // 弹出层标题
      title: "",
      tableList: [],
      tableData: [],
      option: {
        isRadio: true,
      },
      payTypeOptions: [
        {
          value: 0,
          label: "在线支付",
        },
      ],
      statusOptions: [
        {
          value: 0,
          label: "未支付",
        },
        {
          value: 1,
          label: "已支付",
        },
        {
          value: 2,
          label: "使用中",
        },
        {
          value: 3,
          label: "已完成",
        },
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
      ],
      opinionOptions: [
        {
          value: "1",
          label: "非本校学员",
        },
        {
          value: "2",
          label: "身份信息不完整",
        },
        {
          value: "3",
          label: "其它",
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
        hasSubSchool: true,
      },
      queryParams: {
        status: "",
        pageNum: 1,
        pageSize: 10,
        desc: "createTime",
      },
      date: [
        // this.parseTime(new Date(), "{y}-{m}-{d}"),
        // this.parseTime(new Date(), "{y}-{m}-{d}"),
      ],
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
      insuranceOptions: [
        {
          value: 0,
          label: "否",
        },
        {
          value: 1,
          label: "是",
        },
      ],
      studentOptions: [
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
  watch: {
    "queryParams.status": function () {
      this.getPageList();
    },
  },
  mounted() {
    this.getPageList();
  },
  methods: {
    select() {
      this.queryParams.status = "";
      this.queryParams.pageNum = 1;
      this.getPageList();
    },
    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },

    //查询列表
    getPageList() {
      ordersPage({
        ...this.queryParams,
        orderType: 0,
        createStartTime: this.date ? this.date[0] : "",
        createEndTime: this.date ? this.date[1] : "",
      }).then((res) => {
        this.tableList = res.records;
        this.total = Number(res.total);
      });
    },

    //详情
    handleClick() {
      if (this.multipleSelection) {
        const { id } = this.multipleSelection;
        ordersInfo({ id: id }).then(({ data }) => {
          this.form = data;
          this.visible = true;
        });
        detailsList({ orderId: id }).then((res) => {
          this.tableData = res.data;
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
  .getBtn:focus {
    color: #fff;
    border-color: #354153;
    background-color: #354153;
  }
}
.avatar-uploader-file {
  position: absolute;
  top: 10px;
  right: 110px;
}
</style>
