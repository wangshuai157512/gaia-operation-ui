<template>
  <div class="app-container">
    <el-form :model="params" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
        <jaya-select
          type="SS"
          v-model="params.drvSchoolId"
          :parameter="'{}'"
          placeholder="训练地点"
        ></jaya-select
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
      <!-- <el-form-item>
        <el-input
          size="small"
          v-model="params.coachName"
          placeholder="请输入教练名称"
          style="width: 300px !important"
        >
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item> -->
      <el-form-item>
        <el-input
          size="small"
          v-model="params.keyword"
          placeholder="请输入学员姓名/手机号"
          style="width: 300px !important"
        >
          <!-- <template slot="prepend">姓名</template> -->
        </el-input>
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
      <el-table-column type="index" align="center" label="序号">
      </el-table-column>
      <el-table-column
        prop="studentName"
        align="center"
        label="学员姓名"
      ></el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        label="手机号"
      ></el-table-column>
      <!-- <el-table-column
        align="center"
        prop="coachName"
        label="教练姓名"
      ></el-table-column> -->
      <!-- <el-table-column
        align="center"
        prop="orderNum	"
        label="订单编号"
      ></el-table-column> -->
      <el-table-column
        prop="trainDate"
        align="center"
        label="训练日期"
      ></el-table-column>
      <el-table-column
        width="160"
        prop="loginTimeDuration"
        align="center"
        label="开始结束时间"
      >
        <template slot-scope="scope"
          >{{ scope.row.loginTime.split(" ")[1] }}-{{
            scope.row.logoutTime ? scope.row.logoutTime.split(" ")[1] : ""
          }}</template
        >
      </el-table-column>
      <el-table-column prop="loginTimeDuration" align="center" label="登录时长">
        <template slot-scope="scope">{{
          parseTimes(scope.row.loginTimeDuration)
        }}</template>
      </el-table-column>
      <el-table-column
        prop="trainEquipmentType"
        align="center"
        :formatter="getDeviceType"
        label="智能设备"
      ></el-table-column>
      <el-table-column
        prop="trainEquipmentId"
        align="center"
        label="设备号牌"
      ></el-table-column>
      <el-table-column
        width="240"
        prop="schoolName"
        align="center"
        label="训练地点"
      ></el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            @click.stop="handleDetailsClick(scope.row)"
            >查看详情</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <pagination
      :total="total"
      :page-sizes="pageSizes"
      :page.sync="params.pageNum"
      :limit.sync="params.pageSize"
      @pagination="search"
    />
    <Details :key="key" :visible.sync="visible" :option="option"></Details>
  </div>
</template>

<script>
function parseTimes(t) {
  const val = t / 1000;

  if (val < 60) {
    return val + "秒";
  } else {
    var min_total = Math.floor(val / 60); // 分钟
    var sec = Math.floor(val % 60); // 余秒
    if (min_total < 60) {
      return min_total + "分钟" + sec + "秒";
    } else {
      var hour_total = Math.floor(min_total / 60); // 小时数
      var min = Math.floor(min_total % 60); // 余分钟
      return hour_total + "小时" + min + "分钟" + sec + "秒";
    }
  }
}
import {
  getStudentTrainPageList,
  getInfoProject,
  getStudentTrainInfo,
  getCarGpsTrack
} from "@/api/cloud/train";
import { getToken } from "@/utils/auth";
import { parseTime } from "@/utils/jaya";
import Details from "../components/Details";
export default {
  name: "StudentTrain",
  components: { Details },
  data() {
    return {
      date: [
        parseTime(new Date(), "{y}-{m}-{d}"),
        parseTime(new Date(), "{y}-{m}-{d}")
      ],
      params: {
        pageNum: 1,
        pageSize: 10,
        desc: "loginTime"
      },
      pageSizes: [10, 20, 30, 50, 100],
      total: 0,
      data: [],
      visible: false,
      deviceType: [
        { value: "0", label: "智能模拟器" },
        { value: "1", label: "机器人教练" },
        { value: "2", label: "易学通" }
      ],
      option: null,
      key: 0
    };
  },
  mounted() {
    this.search();
  },
  methods: {
    parseTimes,
    handleClick(status, row) {
      this.status = status;
      if (status == 0) {
        this.form = {};
      } else {
        this.form = { ...row };
      }
      this.visible = true;
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
      this.params.startTime = this.date ? this.date[0] : "";
      this.params.finishTime = this.date ? this.date[1] : "";

      getStudentTrainPageList(this.params).then(({ records, total }) => {
        this.total = total;
        this.data = records;
      });
    },
    handleDetailsClick(row) {
      this.key = Date.now();
      this.$nextTick(() => {
        this.option = { ...row };
      });
      // this.$router.push({
      //   name: "StudentDetails",
      //   query: { id, trainSubject }
      // });
    },
    getDeviceType(row, column, cellValue) {
      return this.deviceType.find(({ value }) => value == cellValue)?.label;
    },
    handleRowClick() {},
    tableRowClassName() {},
    handleSelectionChange() {}
  }
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.rows {
  display: flex;
  flex-wrap: wrap;
}

.daterange {
  width: 240px !important;
}

.top-info {
  width: 100%;
  height: 86px;
  background: #ffffff;
  border: 1px dashed #c9cdd2;
  box-sizing: border-box;
  padding: 15px;
  margin-bottom: 20px;
}

.top-info > div {
  margin-bottom: 8px;
  font-size: 16px;
  color: #444444;
}

.dialog-content {
  height: 650px;
  border: 2px solid #eff0f1;
  border-radius: 0px 0px 2px 2px;
  background: #ffffff;
}

.item-tap {
  display: flex;
  height: 85px;
  background: #eff0f1;
  padding: 12px 12px 0;
}

.item-tap > li {
  height: 60px;
  background: #eafdff;
  border-radius: 2px;
  padding: 10px 15px;
  cursor: pointer;
  margin-right: 12px;
}

/deep/.item-tap > .activ > p {
  color: white;
}
/deep/.item-tap > .activ {
  height: 72px;
  background: #2da7b2;
  transition: all 0.4s;
}

/deep/.item-tap > li > p {
  color: #333333;
  font-size: 16px;
  margin: 0;
  text-align: center;
}
/deep/.el-date-editor .el-range-input,
.el-range-editor.is-disabled input {
  background-color: white;
}

.details0 {
  height: 565px;
  padding: 0 12px;
  > div {
    min-height: 112px;
    border-bottom: 1px dashed #c9cdd2;
    box-sizing: border-box;
    padding: 12px 0;
    .title {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      margin: 12px 0;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        display: flex;
        align-items: center;
        p {
          margin: 0;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: #dbdbdb;
          font-size: 10px;
          color: #333333;
          text-align: center;
          margin-right: 6px;
          line-height: 21px;
        }
        .name {
          margin-right: 70px;
          margin-left: 0;
          font-size: 16px;
          color: #2da7b2;
        }
        span {
          margin-left: 50px;
          color: #444444;
          font-size: 16px;
        }
      }
    }
  }
}
.details1 {
  height: 565px;
  padding: 0 12px;
  .content-nav {
    width: 60%;
    display: flex;
    margin: 25px 0;
    li {
      display: flex;
      flex: 1;
      align-items: center;
      > div {
        margin-left: 15px;
      }
      img {
        height: 46px;
      }
      p {
        font-size: 16px;
        color: #444444;
      }
    }
  }
  .map-container {
    display: flex;
    width: 100%;
    .left {
      width: 45%;
      .map {
        width: 100%;
        height: 380px;
        background: #eff0f1;
        border-radius: 6px;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: url("../../../assets/images/gj.jpg") no-repeat center 100%
          100%;
        img {
          width: 50px;
        }
      }
    }
    .right {
      width: 55%;
      height: 460px;
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 0 10px;
      > div {
        min-height: 112px;
        border-bottom: 1px dashed #c9cdd2;
        box-sizing: border-box;
        padding: 12px 0;
        .title {
          font-size: 16px;
          color: #000000;
          font-weight: 600;
          margin: 12px 0;
          .fraction {
            margin: 0 20px;
          }
          .date {
            font-size: 16px;
            color: #666666;
            font-weight: 400;
          }
        }
        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          li {
            width: 100%;
            display: flex;
            margin-bottom: 12px;
            // align-items: center;
            .fraction {
              color: red;
              margin-left: 0;
            }
            .play {
              width: 21px;
              height: 21px;
              margin-left: 6px;
              cursor: pointer;
            }
            p {
              margin: 0;
              width: 21px;
              height: 21px;
              border-radius: 50%;
              background: #dbdbdb;
              font-size: 10px;
              color: #333333;
              text-align: center;
              margin-right: 6px;
              line-height: 21px;
              display: inline-block;
            }
            .name {
              width: calc(100% - 21px);
              margin-left: 0;
              font-size: 16px;
              color: #2da7b2;
            }
            span {
              margin-left: 20px;
              color: #444444;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
</style>
