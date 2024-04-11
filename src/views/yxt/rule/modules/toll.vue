<template>
  <div class="container">
    <div class="title">收费标准</div>
    <el-form ref="form" :model="form" :disabled="!isEdit" :inline="true">
      <template v-if="carTypeList.length">
        <el-form-item label="">
          <p class="titps">请选择要查看的车型</p>
          <ul v-if="!isEdit" class="group">
            <li
              @click="handleCarTypeClick(index, item.carType)"
              :class="[index == carCount ? 'actv' : '']"
              v-for="(item, index) in findCarType"
              :key="item.carType"
            >
              {{ item.carType }}
            </li>
          </ul>
          <el-radio-group class="radio-group" v-else v-model="carTypeRadio">
            <el-radio
              :style="{ background: item.status ? '#cdf3f9' : '#e9ecf3' }"
              :label="item.carType"
              v-for="item in carTypeList"
              :key="item.carType"
            >
              {{ item.carType }}
            </el-radio>
            <el-button
              :disabled="
                !carTypeList.some(
                  (item) => item.carType == carTypeRadio && item.status
                )
              "
              @click="clear"
              size="small"
              >清除设置</el-button
            >
          </el-radio-group>
        </el-form-item>
        <br />
        <el-form-item label="收费规则：">
          <div style="display: flex">
            <div class="sild-title"><span>收 费 规 则</span></div>
            <div>
              <div class="input-suffix">
                <label for="">按时收费:</label>
                科目二
                <el-form-item
                  prop="toll.timeChargeKm2"
                  :rules="rules.toll.timeChargeKm2"
                >
                  <el-input
                    v-model="form.toll.timeChargeKm2"
                    placeholder="请输入内容"
                  ></el-input>
                </el-form-item>
                <span class="gulp">元/小时</span>
                科目三
                <el-form-item
                  prop="toll.timeChargeKm3"
                  :rules="rules.toll.timeChargeKm3"
                >
                  <el-input
                    v-model="form.toll.timeChargeKm3"
                    placeholder="请输入内容"
                  ></el-input
                ></el-form-item>

                <span class="gulp">元/小时</span>
              </div>
              <div class="input-suffix">
                <label for="">按圈收费:</label>
                <span class="titps"
                  >按圈收费时，若每圈用时超过设置的时限，则自动算一圈。</span
                >
              </div>
              <div class="input-suffix">
                <label for=""></label>
                科目二
                <el-form-item
                  prop="toll.cycleChargeKm2"
                  :rules="rules.toll.cycleChargeKm2"
                >
                  <el-input
                    v-model="form.toll.cycleChargeKm2"
                    placeholder="请输入内容"
                  ></el-input
                ></el-form-item>

                <span class="gulp">元/圈</span>
                每圈用时不能超过
                <el-form-item
                  prop="toll.cycleChargeLimitKm2"
                  :rules="rules.toll.cycleChargeLimitKm2"
                >
                  <el-input
                    v-model="form.toll.cycleChargeLimitKm2"
                    placeholder="请输入内容"
                  ></el-input
                ></el-form-item>

                <span class="gulp">分钟</span>
              </div>
              <div class="input-suffix">
                <label for=""></label>
                科目三
                <el-form-item
                  prop="toll.cycleChargeKm3"
                  :rules="rules.toll.cycleChargeKm3"
                >
                  <el-input
                    v-model="form.toll.cycleChargeKm3"
                    placeholder="请输入内容"
                  ></el-input
                ></el-form-item>

                <span class="gulp">元/圈</span>
                每圈用时不能超过
                <el-form-item
                  prop="toll.cycleChargeLimitKm3"
                  :rules="rules.toll.cycleChargeLimitKm3"
                >
                  <el-input
                    v-model="form.toll.cycleChargeLimitKm3"
                    placeholder="请输入内容"
                  ></el-input
                ></el-form-item>
                <span class="gulp">分钟</span>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item class="scrollbar" label="">
          <div
            :style="{ display: 'flex', width: !isEdit ? '1227px' : '1364px' }"
          >
            <div class="sild-title"><span>优 惠 规 则</span></div>
            <div>
              <div class="container-item">
                <span v-if="!isEdit">
                  <span v-if="form.discount.status" class="rule-have"
                    >已启用优惠</span
                  >
                  <span v-else class="rule-none">未启用优惠</span>
                </span>
                <p v-else>
                  启用优惠<el-switch
                    style="margin: 0 10px"
                    v-model="form.discount.status"
                    :inactive-value="0"
                    :active-value="1"
                  >
                  </el-switch>
                </p>
                <div>
                  <p class="item-discount">
                    1）启用优惠之后，订单的实缴金额将在订单应缴金额的基础上减去设置的优惠额度。
                  </p>
                  <p class="item-discount">
                    2）计时满减只用于按时收费，计圈满减只用于按圈收费，缴费满减适用于按时收费和按圈收费
                  </p>
                  <p class="item-discount">
                    3）三个优惠规则中，缴费满减优先级最高，无论是按时收费还是按圈收费，只要订单金额满足此设置，优先启用此优惠规则。
                  </p>
                </div>
              </div>
              <div>
                <div
                  v-for="(level1, levelCount1) in labelList"
                  :key="levelCount1"
                  class="container-item"
                >
                  <ul class="title">
                    <li>{{ level1.label }}学员</li>
                    <li v-for="(item, index) in sideLabel" :key="index">
                      {{ item.label }}
                    </li>
                  </ul>
                  <ul
                    v-for="(level2, levelCount2) in level1.child"
                    :key="levelCount2"
                    class="suject"
                  >
                    <li>{{ level2.label }}</li>
                    <li
                      v-for="(level3, levelCount3) in level2.child"
                      :key="levelCount3"
                    >
                      {{ level3.orderLabel }}
                      <el-input
                        v-model="
                          form.discount[level1.field + level2.field][
                            levelCount3
                          ].discountStandard
                        "
                        placeholder="请输入内容"
                      ></el-input>
                      <span
                        :style="{
                          marginRight: level3.unit == '小时' ? '4px' : '20px'
                        }"
                        class="gulp"
                        >{{ level3.unit }}</span
                      >
                      <el-radio-group
                        @change="
                          radioGroupChange(
                            form.discount[level1.field + level2.field][
                              levelCount3
                            ]
                          )
                        "
                        v-model="
                          form.discount[level1.field + level2.field][
                            levelCount3
                          ].discountType
                        "
                      >
                        <el-radio-button
                          v-if="
                            (form.discount[level1.field + level2.field][
                              levelCount3
                            ].discountType == 1 &&
                              !isEdit) ||
                            isEdit
                          "
                          :label="1"
                          >打折</el-radio-button
                        >
                        <el-radio-button
                          v-if="
                            (form.discount[level1.field + level2.field][
                              levelCount3
                            ].discountType == 0 &&
                              !isEdit) ||
                            isEdit
                          "
                          :label="0"
                          >减去</el-radio-button
                        >
                      </el-radio-group>
                      <el-input
                        v-if="
                          form.discount[level1.field + level2.field][
                            levelCount3
                          ].discountType == 0
                        "
                        v-model="
                          form.discount[level1.field + level2.field][
                            levelCount3
                          ].discount
                        "
                        placeholder="请输入内容"
                      ></el-input>
                      <el-select
                        v-else
                        v-model="
                          form.discount[level1.field + level2.field][
                            levelCount3
                          ].discount
                        "
                        placeholder="请选择"
                      >
                        <el-option
                          v-for="item in discountOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        >
                        </el-option>
                      </el-select>
                      <span class="gulp">{{
                        form.discount[level1.field + level2.field][levelCount3]
                          .discountType == 0
                          ? "元"
                          : "折"
                      }}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
import {
  getConfig,
  delConfig,
  saveConfig,
  getDiscount,
  delDiscount,
  saveDiscount,
  getCarType,
  removeChargeConfig
} from "@/api/yxt/rule";
const mapItem = function () {
  return new Array(3).fill().map((value, chargeType) => {
    return {
      chargeType,
      discount: "",
      discountStandard: "",
      discountType: 0
    };
  });
};
export default {
  name: "Toll",
  props: {
    isEdit: { type: Boolean },
    drvSchoolId: { type: String },
    commentId: { type: Number }
  },
  data() {
    const child = [
      {
        label: "计时满减",
        orderLabel: "订单时长≥",
        unit: "小时"
      },
      {
        label: "计圈满减",
        orderLabel: "订单圈数≥",
        unit: "圈"
      },
      {
        label: "缴费满减",
        orderLabel: "订单金额≥",
        unit: "元"
      }
    ];

    return {
      id: null,
      carType: "",
      carTypeList: [],
      carTypeRadio: "",
      discountType: "",
      carCount: null,
      discountOptions: [
        { label: "九", value: 9 },
        { label: "八", value: 8 },
        { label: "七", value: 7 },
        { label: "六", value: 6 },
        { label: "五", value: 5 },
        { label: "四", value: 4 },
        { label: "三", value: 3 },
        { label: "二", value: 2 },
        { label: "一", value: 1 }
      ],
      labelList: [
        {
          label: "校内",
          field: "xnKm",
          child: [
            { label: "科目二", field: 2, child },
            { label: "科目三", field: 3, child }
          ]
        },
        {
          label: "校外",
          field: "xwKm",
          child: [
            { label: "科目二", field: 2, child },
            { label: "科目三", field: 3, child }
          ]
        }
      ],
      sideLabel: child,
      form: {},
      rules: {
        toll: {
          timeChargeKm2: [
            {
              required: true,
              message: "必填项",
              trigger: "blur"
            }
          ],
          timeChargeKm3: [
            {
              required: true,
              message: "必填项",
              trigger: "blur"
            }
          ],
          cycleChargeLimitKm2: [
            {
              required: true,
              message: "必填项",
              trigger: "blur"
            }
          ],
          cycleChargeLimitKm3: [
            {
              required: true,
              message: "必填项",
              trigger: "blur"
            }
          ],
          cycleChargeKm2: [
            {
              required: true,
              message: "必填项",
              trigger: "blur"
            }
          ],
          cycleChargeKm3: [
            {
              required: true,
              message: "必填项",
              trigger: "blur"
            }
          ]
        }
      }
    };
  },
  watch: {
    drvSchoolId(value) {
      this.carCount = null;
      this.carTypeRadio = "";
      this.getCarTypeList();
      this.initTollForm();
      this.initDiscountForm();
    },
    carTypeRadio(value) {
      this.initData();
      this.$emit("carTypeChange", value);
    }
  },
  beforeMount() {
    this.initTollForm();
    this.initDiscountForm();
  },
  mounted() {
    this.getCarTypeList();
    // console.log(this.labelLists);
  },
  computed: {
    findCarType() {
      return this.carTypeList.filter((car) => car.status == 1);
    }
  },
  methods: {
    initData() {
      const { drvSchoolId, carTypeRadio } = this;
      let count = 0;

      return new Promise((resolve, reject) => {
        getDiscount({ carType: carTypeRadio, drvSchoolId }).then((res) => {
          const data = res.data;

          if (++count === 2) resolve();
          if (data.carType) {
            const { xnKm2, xnKm3, xwKm2, xwKm3, status } = data;
            this.$set(this.form, "discount", {
              xnKm2,
              xnKm3,
              xwKm2,
              xwKm3,
              status
            });
            return;
          }
          this.initDiscountForm();
        });
        getConfig({ carType: carTypeRadio, drvSchoolId }).then((res) => {
          const data = res.data;

          if (++count === 2) resolve();
          if (data) {
            const {
              cycleChargeKm2,
              cycleChargeKm3,
              cycleChargeLimitKm2,
              cycleChargeLimitKm3,
              timeChargeKm2,
              timeChargeKm3
            } = data;
            this.$set(this.form, "toll", {
              cycleChargeKm2,
              cycleChargeKm3,
              cycleChargeLimitKm2,
              cycleChargeLimitKm3,
              timeChargeKm2,
              timeChargeKm3
            });
            return;
          }
          this.initTollForm();
        });
      });
    },
    rule() {
      const { carTypeRadio } = this;

      return new Promise((resolve, reject) => {
        if (carTypeRadio) {
          this.$refs.form.validate(async (valid) => {
            if (valid) {
              // 保存
              const { drvSchoolId, carTypeRadio, form } = this;
              Promise.all([
                saveDiscount({
                  drvSchoolId: drvSchoolId,
                  carType: carTypeRadio,
                  ...form.discount
                }),
                saveConfig({
                  drvSchoolId: drvSchoolId,
                  carType: carTypeRadio,
                  ...form.toll
                })
              ]).then((res) => {
                resolve();
                this.getCarTypeList();
              });
            } else {
              reject();
            }
          });
        } else {
          resolve();
        }
      });
    },
    initTollForm() {
      this.$set(this.form, "toll", {});
    },
    initDiscountForm() {
      this.$set(this.form, "discount", {
        status: 0,
        xnKm2: mapItem(),
        xnKm3: mapItem(),
        xwKm2: mapItem(),
        xwKm3: mapItem()
      });
    },
    radioGroupChange(row) {
      row.discount = "";
    },

    handleCarTypeClick(index, car) {
      if (!this.drvSchoolId) return this.msgWarn("请先选择驾校");
      this.carCount = index;
      this.carTypeRadio = car;
    },

    getCarTypeList() {
      const { drvSchoolId } = this;
      getCarType({ drvSchoolId, carType: "" }).then((res) => {
        this.carTypeList = res.data;
      });
    },

    clear() {
      this.$confirm("确定要将该车型的收费标准和优惠规则清空吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const { drvSchoolId, carTypeRadio } = this;
          removeChargeConfig({ drvSchoolId, carType: carTypeRadio }).then(
            (res) => {
              this.getCarTypeList();
              this.initTollForm();
              this.initDiscountForm();
            }
          );
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
>>> .el-form-item__label {
  width: 240px;
}
.scrollbar {
  width: 100%;
  overflow-x: scroll;
  padding-bottom: 12px;
}
.sild-title {
  span {
    width: 16px;
    font-size: 16px;
    color: #67b9c1;
    writing-mode: horizontal-tb;
    writing-mode: vertical-rl;
    writing-mode: vertical-lr;
  }
  width: 34px;
  flex: 1;
  display: flex;
  background: #eefafc;
  align-items: center;
  margin-right: 15px;
}
.titps {
  color: #a3a3a3;
}
.radio-group {
  display: flex;
}

.el-radio {
  width: 100px;
  height: 32px;
  border-radius: 4px;
  background: #e9ecf3;
  display: flex;
  align-items: center;
  justify-content: center;
  /deep/ .el-radio__inner {
    width: 18px;
    height: 18px;
  }
}

.title {
  font-size: 24px;
  color: #25a5b0;
}

.group {
  display: flex;
  li {
    width: 100px;
    height: 32px;
    border-radius: 4px;
    background: #f6f5f5;
    line-height: 32px;
    text-align: center;
    font-size: 16px;
    margin-right: 30px;
    cursor: pointer;
  }
  .actv {
    color: #ffffff;
    background: #49bbc5;
  }
}
.container-item {
  width: 100%;
  display: flex;
  .gulp {
    margin-right: 20px;
  }
  ul {
    li:first-child {
      background: #f6f5f5;
      border-radius: 4px;
    }
    li {
      margin-top: 15px;
      text-align: center;
      font-size: 16px;
      color: #375d72;
      font-weight: 400;
      .el-input,
      .el-select {
        width: 120px;
        margin: 0 15px;
      }
    }
  }
  .title {
    width: 80px;
  }
}
.el-form-item {
  // width: 100%;
  margin-bottom: 15px;
}

p {
  margin: 0;
}
.item-discount {
  height: 26px;
  color: #999999;
  font-size: 16px;
}
.suject {
  margin-left: 30px;
}
.input-suffix {
  margin-bottom: 15px;
  width: 900px;
  display: flex;
  flex-wrap: wrap;
  label {
    width: 100%;
    display: block;
  }

  .el-input {
    width: 120px;
    margin: 0 15px;
  }

  .gulp {
    margin-right: 40px;
  }
}
</style>
