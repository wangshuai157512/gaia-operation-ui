<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item>
        <jaya-select
          type="SS"
          v-model="queryParams.drvSchoolId"
          :parameter="JSON.stringify({})"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          v-model="queryParams.subject"
          othername="course"
          placeholder="培训科目"
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          v-model="queryParams.carType"
          placeholder="培训车型"
          othername="exam_car_type"
          sty="width:200px"
        >
        </jaya-select>
      </el-form-item>
      <el-form-item>
        <el-select
          v-model="queryParams.trainDate"
          placeholder="预约日期"
          size="small"
         @change="$forceUpdate()"
        >
          <el-option
            v-for="item in dateList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          size="small"
          v-model="queryParams.name"
          placeholder="请输入教练姓名"
          style="width: 230px !important"
          clearable
        >
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getCoachList" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="defautl">
      <div
        class="table-box-con"
        style="display: flex"
        v-for="(item, index) in coachList"
        :key="index"
      >
        <div
          class="box"
          @click="handlePhoto(index)"
          :style="{
            background: index === activeIndex ? '#49BBC5' : '',
            color: index === activeIndex ? '#fff' : '',
          }"
        >
          <div class="box-left">
            <img
              v-if="item.type == 0"
              class="photoCar"
              src="../../../assets/images/cartype.png"
              alt=""
            />
            <div v-else>
              <img
                v-if="!item.img"
                class="photo"
                src="../../../assets/images/photoUpload.png"
                alt=""
              />
              <img
                v-if="item.img"
                class="photo"
                :src="baseUrl + item.img"
                alt=""
              />
            </div>
          </div>
          <div class="box-right">
            <div class="name" v-if="item.type == 1">{{ item.name }}</div>
            <div v-if="item.type == 1">手机：{{ item.phone }}</div>
            <div>车型：{{ item.carType }}</div>
            <div v-if="item.type == 0">车牌：{{ item.name }}</div>
          </div>
        </div>
        <div class="con-list" v-if="item.timeVOS && item.timeVOS.length > 0">
          <div
            class="item"
            v-for="(itemC, indexC) in item.timeVOS"
            :key="indexC"
            @click="appointment(index,item,itemC)"
            :style="{
              background:
                itemC.status == 0
                  ? '#61d14b'
                  : itemC.status == 1
                  ? 'rgb(230, 162, 60)'
                  : itemC.status == 2
                  ? '#FF0000'
                  : '',
            }"
          >
            <div style="font-weight: 700;">
              {{ itemC.startTime.substr(0, 5) }} -
              {{ itemC.endTime.substr(0, 5) }}
            </div>
            <!-- <div>1圈 0元</div> -->
            <div>已约{{ itemC.count }} | 可约1</div>
            <div>{{ itemC.subject == 2 ? "科目二" : "科目三" }}</div>
            <div class="item-name">{{ itemC.studentName }}</div>
            <div class="item-name" v-if="itemC.status == 1">学员不可见</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加文件窗 -->
    <el-dialog
      :close-on-click-modal="false"
      title="请选择学员"
      :visible.sync="openAdd"
      width="888px"
      append-to-body
    >
      <el-form :model="form" ref="form" :inline="true">
        <el-form-item prop="keyword">
          <el-input
            size="small"
            v-model="form.name"
            placeholder="请输入姓名|身份证号|手机号"
            style="width: 220px !important; background-color: #fff"
            clearable
          >
            <!-- <template slot="prepend">姓名|身份证号|手机号</template> -->
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            @click="getTableList(1)"
            type="primary"
            style="margin-top: 2px"
            >查询</el-button
          >
        </el-form-item>
      </el-form>
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
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleUpload('form')"
          >确 定</el-button
        >
        <el-button @click="openAdd = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  coachReserveTime,
  coachReserveDate,
  coachStudentList,
  reserveStudentJxtAdd,
} from "@/api/cloud/coachappointment";
export default {
  name: "Coachappointment",
  data() {
    return {
      baseUrl: process.env.VUE_APP_BASE_URL,
      total: 0,
      queryParams: {},
      coachList: [],
      activeIndex: null,
      dateList: [],
      column: [
        {
          title: "姓名",
          prop: "name",
          // width: "115",
        },
        // {
        //   title: "培训科目",
        //   prop: "trainSubject",
        //   status: () => {
        //     return "course";
        //   },
        // },
        {
          title: "身份证号码",
          prop: "idCard",
          width: "220",
        },
        {
          title: "手机",
          prop: "telephone",
          width: "155",
        },

        // {
        //   title: "是否缴费",
        //   prop: "carTypeFileName",
        //   width: "80",
        // },
        {
          title: "班别",
          prop: "classType",
          width: "80",
        },
        {
          title: "入学类型",
          prop: "outStudent",
          formatter: ({ row }) => {
            return  "本校";
          },
          width: "80",
        },
        {
          title: "介绍人",
          prop: "recommentname",
          width: "80",
        },
      ],
      tableData: [],
      option: {
        isRadio: true,
      },
      activeRow: {},
      openAdd: false,
      form: {},
      studentsQuery:{},
    };
  },
  watch: {
    "queryParams.drvSchoolId": {
      handler: "getCoachReserveDate",
    },
  
  },
  methods: {
    // 获取日期
    getCoachReserveDate() {
      coachReserveDate({ drvSchoolId: this.queryParams.drvSchoolId }).then(
        ({ data }) => {
          this.dateList = data.map((item) => {
            const weekArray = new Array(
              "日",
              "一",
              "二",
              "三",
              "四",
              "五",
              "六"
            );
            const week = weekArray[new Date(item.trainDate).getDay()];
            return {
              label: `${item.trainDate}  （星期${week}）`,
              value: item.trainDate,
            };
          });
          this.queryParams.trainDate = this.dateList[0].value;
        }
      );
    },
    // 获取可预约情况
    getCoachList() {
      coachReserveTime(this.queryParams).then(({ data }) => {
        this.coachList = data;
      });
    },
    handlePhoto(index) {
      this.activeIndex = index;
    },

    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      coachStudentList({
        drvSchoolId: this.queryParams.drvSchoolId,
        name: this.form.name,
      }).then((res) => {
        this.tableData = res.data;
        this.total = res.data.length;
      });
    },
    // 点击单选获取当前行
    handleCurrentChange(row) {
      this.activeRow = row;
    },
    // 新增
    appointment(index,item,itemC) {
      this.handlePhoto(index);
      this.form = {}
      this.getTableList();
      const { drvSchoolId, coachId,equipId,reserveDate} = item
      const { subject,startTime,endTime} = itemC
      this.studentsQuery = {drvSchoolId, coachId,equipmentId:equipId,trainDate:reserveDate,trainSubject:subject,startTime,endTime}
      this.openAdd = true;
    },

    // 提交
    handleUpload() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择学员", type: "warning" });
        return;
      }
      let { id } = this.activeRow;
      reserveStudentJxtAdd({ studentId:id,...this.studentsQuery}).then((res) => {
        this.$message({ message: "预约成功", type: "success" });
        this.getCoachList();
        this.openAdd = false;
      });
    },
  },
  mounted() {
    this.getCoachList();
  },
};
</script>

<style lang="scss" scoped>
.box {
  display: flex;
  width: 230px;
  height: 100px;
  border: solid 1px #dbd5d5;
  padding: 10px 12px;
  background-color: #fff;
  // font-size: 12px;
  color: #333;
  font-size: 14px;
}
.box .box-left {
  width: 60px;
  height: 80px;
  margin-right: 10px;
}
.box .box-left .photo {
  width: 60px;
  height: 80px;
}
.box .box-left .photoCar {
  width: 32px;
  height: 43px;
  margin-left: 15px;
  margin-top: 10px;
}
.box .box-right .name {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 4px;
}
.con-list {
  width: calc(100% - 230px);
}
.con-list .item {
  font-size: 14px;
  cursor: pointer;
  width: 112px;
  height: 100px;
  text-align: center;
  border: 1px solid rgb(219, 213, 213);
  display: inline-block;
  vertical-align: middle;
  padding: 10px;
  background-color: rgb(255, 102, 102);
  margin-left: 10px;
  margin-bottom: 10px;
}
.con-list .item div{
  margin-bottom: 4px;
}
/deep/.jaya-table {
  max-height: 486px;
  overflow: scroll;
  margin-top: 0;
}
/deep/.el-dialog:not(.is-fullscreen) {
  margin-top: 6vh !important;
}
/deep/.el-dialog__body .el-input__inner {
  background: #fff;
}
.defautl {
  min-height: calc(100vh - 206px);
  background-color: #fff;
}
</style>
