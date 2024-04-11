<template>
  <div class="container">
    <div class="title">考试项目设置</div>
    <div class="tap">
      <p
        @click="count = index"
        v-for="(item, index) in suject"
        :key="index"
        :class="[count == index ? 'actv' : '']"
      >
        {{ item }}
      </p>
    </div>
    <div v-if="cities">
      <div
        v-for="(exam, index) in carType
          ? { [carType]: cities[count][carType] }
          : cities[count]"
        v-show="
          !drvSchoolId ||
          (!isEdit &&
            checkedCities[count][index] &&
            checkedCities[count][index].length) ||
          isEdit
        "
        :key="index"
        class="container-content"
      >
        <div class="clot name">{{ index == "all" ? "全部" : index }}</div>
        <div v-if="exam" class="clot">
          <el-checkbox
            v-if="isEdit"
            v-model="checkAll[count][index]"
            @change="handleCheckAllChange($event, index)"
            >全选</el-checkbox
          >
        </div>
        <div class="check-item">
          <el-checkbox-group
            :disabled="!isEdit"
            v-model="checkedCities[count][index]"
            @change="handleCheckedCitiesChange($event, index)"
          >
            <el-checkbox
              v-for="city in exam"
              v-show="
                !drvSchoolId ||
                (!isEdit &&
                  checkedCities[count][index] &&
                  checkedCities[count][index].includes(city.value)) ||
                isEdit
              "
              :label="city.value"
              :key="city.value"
              >{{ city.label }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { saveExam, getSelect } from "@/api/yxt/jianxuetongrule";
const sort = (data) => {
  return Object.keys(data)
    .sort()
    .reduce((a, b) => ({ ...a, [b]: data[b] }), {});
};
const filterChecked = (data) => {
  const obj = {};

  Object.keys(data).forEach((key) => {
    obj[key] = data[key]
      .filter((item) => item.selected)
      .map((item) => item.value);
  });
  return obj;
};
const checkallChecked = (data, target) => {
  const obj = {};

  Object.keys(data).forEach((key) => {
    obj[key] = target[key] ? target[key].length === data[key].length : false;
  });
  return obj;
};
export default {
  name: "Exam",
  props: {
    carType: { type: String },
    drvSchoolId: { type: String },
    isCancel: { type: Boolean },
    isEdit: { type: Boolean },
  },
  data() {
    return {
      count: 0,
      suject: ["科目二", "科目三"],
      checkAll: null,
      checkedCities: null,
      cities: null,
    };
  },
  watch: {
    drvSchoolId() {
      this.initData();
    },
  },
  mounted() {
    Promise.all([getSelect({ subject: 2 }), getSelect({ subject: 3 })]).then(
      (res) => {
        this.cities = { 0: sort(res[0].data), 1: sort(res[1].data) };
        this.checkedCities = { 0: {}, 1: {} };
        this.checkAll = { 0: {}, 1: {} };
      }
    );
  },
  methods: {
    initData() {
      const { drvSchoolId } = this;

      return new Promise((resolve, reject) => {
        Promise.all([
          getSelect({ drvSchoolId, subject: 2 }),
          getSelect({ drvSchoolId, subject: 3 }),
        ]).then((res) => {
          this.cities = { 0: sort(res[0].data), 1: sort(res[1].data) };
          this.checkedCities = {
            0: filterChecked(res[0].data),
            1: filterChecked(res[1].data),
          };
          this.checkAll = {
            0: checkallChecked(res[0].data, this.checkedCities[0]),
            1: checkallChecked(res[1].data, this.checkedCities[1]),
          };
          resolve();
        });
      });
    },

    rule() {
      return new Promise((resolve, reject) => {
        const { checkedCities, drvSchoolId } = this;
        const projectSchoolList = [];

        Object.keys(checkedCities).forEach((key) => {
          Object.keys(checkedCities[key]).forEach((keys) => {
            if (checkedCities[key][keys].length) {
              checkedCities[key][keys].forEach((jxtExamProjectId) => {
                projectSchoolList.push({
                  subject: key == 0 ? 2 : 3,
                  carType: keys,
                  jxtExamProjectId,
                });
              });
            }
          });
        });

        saveExam({ projectSchoolList, drvSchoolId }).then(resolve);
      });
    },

    handleCheckAllChange(value, index) {
      const { count, cities, checkedCities } = this;
      const type = {
        ...checkedCities[count],
        [index]: value ? cities[count][index].map((item) => item.value) : [],
      };

      this.$set(this.checkedCities, count, type);
    },

    handleCheckedCitiesChange(value, index) {
      const { count, cities, checkedCities } = this;
      const type = {
        ...this.checkAll[count],
        [index]: cities[count][index].length === value.length,
      };

      this.$set(this.checkAll, count, type);
    },
  },
};
</script>

<style lang="scss" scoped>
p {
  margin: 0;
  padding: 0;
}
.container-content {
  display: flex;
  margin-top: 15px;
  padding: 10px 0;
  border-bottom: 1px #535253 dashed;
  .name {
    background: #eefafc;
    font-size: 20px;
    color: #67b9c1;
  }
  .check-item {
    flex: 1;
    min-height: 100px;
    .el-checkbox {
      margin-right: 100px;
      margin-bottom: 10px;
    }
  }
  .clot {
    width: 60px;
    margin-right: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/ .el-checkbox__inner::after {
      top: 2px;
      left: 5px;
    }

    /deep/ .el-checkbox span {
      display: block;
      .el-checkbox__label {
        font-size: 16px;
      }

      // .el-checkbox__inner::after
      .el-checkbox__inner {
        width: 16px;
        height: 16px;
        top: -4px;
        left: 15px;
        ::before {
          top: 6px;
        }
      }
    }
  }
}
.tap {
  display: flex;
  margin-top: 20px;
  p {
    text-align: center;
    line-height: 34px;
    width: 120px;
    height: 34px;
    cursor: pointer;
    font-size: 16px;
    border: 1px solid #49bbc5;
  }
  p:nth-child(1) {
    border-radius: 4px 0px 0px 4px;
  }
  p:nth-child(2) {
    border-radius: 0px 4px 4px 0px;
  }
  .actv {
    color: white;
    background: #49bbc5;
  }
}
.title {
  font-size: 24px;
  color: #25a5b0;
}
</style>
