<template>
  <div class="container">
    <div>
      <el-row :gutter="20">
        <el-col :span="6"
          ><div class="warnKC">
            <ul>
              <li v-for="(item, index) in waringInfo" :key="index">
                <!-- <em>11:38:38</em> -->
                <span>{{ item }}</span>
              </li>
            </ul>
          </div></el-col
        >
        <el-col :span="6"
          ><div class="form">
            <p>
              <label>当前考场：</label>
              <el-select
                style="width: 220px !important"
                v-model="room"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in examRoom"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </p>
            <p>
              <label>考试车型：</label>
              <el-select
                style="width: 220px !important"
                v-model="carType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in examCarType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <!-- <el-select
                style="width:120px!important;"
                v-model="car"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in examCar"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select> -->
            </p>

            <button @click="inquire" class="btn">查看</button>
          </div></el-col
        >
        <el-col :span="12">
          <div>
            <p v-if="statis">
              <!-- <span class="s1">正常</span> -->
              <span class="s2">正在考试</span>
              <span class="s3">考试结束</span>
              <span class="s"> (预约人数：{{ statis.yyrs }}</span>
              <span class="s"> 合格人数：{{ statis.hgrs }}</span>
              <span class="s"> 不合格人数：{{ statis.bhgrs }}</span>
              <span class="s">已考人数{{ statis.ykrs }}</span>
              <span class="s">未考人数：{{ statis.wkrs }}</span>
              <span class="s">合格率：{{ statis.hgl }}%)</span>
            </p>
            <p>
              <el-checkbox-group v-model="checkList">
                <el-checkbox
                  @change="handleCheckedCitiesChange($event, item)"
                  v-for="item in examCar"
                  :key="item.kcbh"
                  :label="item"
                  >{{ item.clmc }}</el-checkbox
                >
              </el-checkbox-group>
            </p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import {
  getTodayExamRoom,
  getExamCar,
  getExamCarType,
  getWaringInfo,
  getStatisticsInfo,
  getTodayExamCarList
} from "@/api/exam/invigilate";
let timer;
export default {
  name: "NavTop",
  data() {
    return {
      checkList: [],
      room: "",
      carType: "",
      car: "",
      examCarType: [],
      examRoom: [],
      examCar: [],
      waringInfo: [],
      statis: null
    };
  },
  mounted() {
    getTodayExamRoom().then((result) => {
      this.examRoom = result.data;
      this.$emit("loadMap", result.data);
    });
  },
  watch: {
    room() {
      this.carType = "";
      this.examCar = [];
      this.getExamCarTypeOptions();
      this.getWaringInfo();
    }
  },
  methods: {
    getExamCarTypeOptions() {
      getExamCarType({ kcxh: this.room }).then((result) => {
        this.examCarType = result.data;
      });
    },

    getExamCarOptions() {
      getTodayExamCarList({ kcxh: this.room, kscx: this.carType }).then(
        (result) => {
          this.examCar = result.data;
        }
      );
    },

    getWaringInfo() {
      getWaringInfo(this.room).then((result) => {
        this.waringInfo = result.data;
      });
    },

    inquire() {
      this.getWaringInfo();
      this.getExamCarOptions();

      timer && clearTimeout(timer);
      timer = () => {
        getStatisticsInfo(this.room).then((res) => {
          this.statis = res.data;
          setTimeout(timer, 5000);
        });
      };

      timer();

      this.$emit(
        "review",
        this.examRoom.findIndex((room) => room.value == this.room),
        this.examRoom.length
      );
    },

    handleCheckedCitiesChange(e, T) {
      this.$emit("checkedChange", {
        checkList: this.checkList,
        carType: this.carType,
        room: this.room,
        T
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  margin-bottom: 16px;
  background: #001529;
  height: 100%;
  margin: 0px;
  padding: 0px;
  /*隐藏滚动条，当IE下溢出，仍然可以滚动*/
  -ms-overflow-style: none;
  /*火狐下隐藏滚动条*/
  overflow: -moz-scrollbars-none;
}

.form {
  color: #9eb6c6;
  font-size: 12px;
}

/deep/.el-input__inner {
  background-color: unset;
  height: 26px;
  line-height: 26px;
}

/deep/.el-input__icon {
  line-height: 26px;
}

/deep/.el-row {
  width: 100%;
}

.btn {
  width: 300px;
  color: white;
  border-radius: 20px;
  background-color: #1e9fff;
  text-align: center;
  padding: 3px 0;
  cursor: pointer;
}

.warnKC {
  height: 100px;
  border: 1px solid #203657;
  line-height: 20px;
  overflow-y: scroll;
  font-size: 12px;
  li:nth-child(2n) {
    background-color: #14273a;
  }
  li em {
    float: left;
    width: 70px;
    padding-left: 10px;
    font-style: normal;
    cursor: pointer;
    color: #9eb6c6;
  }
  li span {
    color: #9eb6c6;
    display: block;
    margin-left: 80px;
    cursor: pointer;
    white-space: nowrap;
  }
}
.s1,
.s2,
.s3 {
  display: inline-block;
  margin-right: 20px;
  color: #9eb6c6;
  font-size: 12px;
  &::before {
    content: " ";
    display: inline-block;
    margin-right: 3px;
    width: 9px;
    height: 9px;
  }
}

.s {
  display: inline-block;
  margin-right: 20px;
  color: #9eb6c6;
  font-size: 12px;
}

.s1::before {
  background-color: #f42329;
}

.s2::before {
  background-color: #52c41a;
}

.s3::before {
  background-color: #9fa2aa;
}
</style>
