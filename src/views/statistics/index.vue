<template>
  <div class="app-container">
    <el-form :model="params" ref="queryForm" :inline="true" label-width="68px">
      <el-form-item>
        <el-select
          placeholder="选择驾校"
          filterable
          clearable
          size="small"
          v-model="params.kcxh"
        >
          <el-option
            v-for="room in roomOptions"
            :key="room.kcxh"
            :value="room.kcxh"
            :label="room.kcjc"
          >
          </el-option> </el-select
      ></el-form-item>
      <el-form-item>
        <el-select
          placeholder="选择智能设备"
          filterable
          clearable
          size="small"
          v-model="params.kcxh"
        >
          <el-option
            v-for="room in roomOptions"
            :key="room.kcxh"
            :value="room.kcxh"
            :label="room.kcjc"
          >
          </el-option> </el-select
      ></el-form-item>
      <el-form-item>
        <el-date-picker
          class="daterange"
          size="small"
          v-model="params.date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button
          size="small"
          type="primary"
          icon="el-icon-search"
          @click="search"
          >搜索</el-button
        >
      </el-form-item>
    </el-form>
    <div class="chart-mode">
      <div>
        <div class="chart">
          <div class="tap">
            <h3>科目二项目训练次数统计</h3>
            <div>
              <span
                @click="handleTapClick(0, true)"
                :class="isEcharShow[0] ? 'actv' : ''"
                >饼状图</span
              >
              <span
                @click="handleTapClick(0, false)"
                :class="!isEcharShow[0] ? 'actv' : ''"
                >数据表</span
              >
            </div>
          </div>
          <jaya-echar-bar v-if="isEcharShow[0] && pieData" :getData="pieData" />
          <el-table v-else ref="multipleTable" :data="[]">
            <el-table-column
              prop="drvPreasign.yycs"
              label="项目名称"
              align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="训练次数"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="训练次数占比"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <div class="chart">
          <div class="tap">
            <h3>科目二项目通过率</h3>
            <div>
              <span
                @click="handleTapClick(1, true)"
                :class="isEcharShow[1] ? 'actv' : ''"
                >折线图</span
              >
              <span
                @click="handleTapClick(1, false)"
                :class="!isEcharShow[1] ? 'actv' : ''"
                >数据表</span
              >
            </div>
          </div>
          <jaya-echar-line
            v-if="isEcharShow[1] && lineData"
            :getData="lineData"
          />
          <el-table v-else ref="multipleTable" :data="[]">
            <el-table-column
              prop="drvPreasign.yycs"
              label="项目名称"
              align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="培训日期"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <div class="chart">
          <div class="tap">
            <h3>科目二扣分统计</h3>
            <div>
              <span
                @click="handleTapClick(2, true)"
                :class="isEcharShow[2] ? 'actv' : ''"
                >饼状图</span
              >
              <span
                @click="handleTapClick(2, false)"
                :class="!isEcharShow[2] ? 'actv' : ''"
                >数据表</span
              >
            </div>
          </div>
          <jaya-echar-pie3d v-if="isEcharShow[2] && pieData"></jaya-echar-pie3d>
          <!-- <jaya-echar-pie v-if="isEcharShow[2] && pieData" :getData="pieData" /> -->
          <el-table v-else ref="multipleTable" :data="[]">
            <el-table-column
              prop="drvPreasign.yycs"
              label="扣分项"
              align="center"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="扣分次数"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="占比"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <div>
        <div class="chart">
          <div class="tap">
            <h3>科目三扣分统计</h3>
            <div>
              <span
                @click="handleTapClick(3, true)"
                :class="isEcharShow[3] ? 'actv' : ''"
                >饼状图</span
              >
              <span
                @click="handleTapClick(3, false)"
                :class="!isEcharShow[3] ? 'actv' : ''"
                >数据表</span
              >
            </div>
          </div>
          <jaya-echar-pie v-if="isEcharShow[3] && pieData" :getData="pieData" />
          <el-table v-else ref="multipleTable" :data="[]">
            <el-table-column
              align="center"
              prop="drvPreasign.yycs"
              label="扣分项"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="扣分次数"
            ></el-table-column>
            <el-table-column
              align="center"
              prop="kscs"
              label="占比"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Statistics",
  data() {
    return {
      params: {
        pageNum: 1,
        pageSize: 10,
      },
      pageSizes: [10, 20, 30, 50, 100],
      data: [],
      tableLoading: false,
      visible: false,
      form: {},
      pieData: null,
      lineData: null,
      sujectOptions: [
        { value: "科目一", key: "1" },
        { value: "科目二", key: "2" },
        { value: "科目三", key: "3" },
      ],
      roomOptions: [],
      isEcharShow: [true, true, true, true],
    };
  },
  mounted() {
    this.search();
    this.pieData = {
      nameArray: ["Direct", "Direct2", "Direct3", "Direct4", "Direct5"],
      dataArray: [1048, 735, 580, 124, 543],
      textTitle: "",
    };
    this.lineData = {
      textTitle: "",
      nameArray: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      dataArray: [
        {
          name: "Email",
          type: "line",
          stack: "Total",
          smooth: true,
          data: [120, 132, 101, 134, 90, 230, 210],
        },
        {
          name: "Union Ads",
          type: "line",
          stack: "Total",
          smooth: true,
          data: [220, 182, 191, 234, 290, 330, 310],
        },
        {
          name: "Video Ads",
          type: "line",
          stack: "Total",
          smooth: true,
          data: [150, 232, 201, 154, 190, 330, 410],
        },
        {
          name: "Direct",
          type: "line",
          stack: "Total",
          smooth: true,
          data: [320, 332, 301, 334, 390, 330, 320],
        },
        {
          name: "Search Engine",
          type: "line",
          stack: "Total",
          smooth: true,
          data: [820, 932, 901, 934, 1290, 1330, 1320],
        },
      ],
    };
  },
  methods: {
    // 取消
    cancel() {
      this.visible = false;
    },
    // 搜索
    search() {
      this.tableLoading = true;
    },

    handleTapClick(index, status) {
      this.$set(this.isEcharShow, index, status);
    },

    getExamRoomList() {},
    handleRowClick() {},
    tableRowClassName() {},
    handleSelectionChange() {},
  },
};
</script>
<style lang="scss" scoped>
.rows {
  display: flex;
  flex-wrap: wrap;
}

.daterange {
  width: 240px !important;
}

.chart-mode {
  display: flex;
  flex-wrap: wrap;
  > div:nth-child(2),
  > div:nth-child(4) {
    margin-right: 0;
  }
  > div:nth-child(3),
  > div:nth-child(4) {
    margin-bottom: 0;
  }
  > div {
    width: calc(50% - 10px);
    margin-right: 20px;
    margin-bottom: 20px;
    .chart {
      height: 450px;
      background: white;
      border-radius: 6px;
      overflow-y: scroll;
    }
    .tap {
      box-sizing: border-box;
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      > h3 {
        margin: 0;
        font-weight: 700;
      }
      // background-color: rgb(216, 216, 216);
      span {
        box-sizing: border-box;
        border-radius: 12px;
        font-size: 12px;
        background-color: #dbdbdb;
        padding: 3px 12px;
        color: #444444;
        margin-left: 10px;
        cursor: pointer;
      }
      .actv {
        background: #49bbc5;
        color: white;
      }
    }
    h4 {
      text-align: center;
    }
  }
}

#line {
  height: 420px;
}
</style>
