<template>
  <div class="jaya-table">
    <div class="table-top">
      <div>
        <el-button
          v-for="(item, index) in functionalityBtn"
          :key="index"
          :type="item.type || 'primary'"
          :disabled="
            typeof item.disabled === 'function'
              ? item.disabled()
              : item.disabled
          "
          :plain="item.plain || true"
          :size="item.size || 'mini'"
          :round="item.round || false"
          @click="item.funClick && item.funClick(item)"
          >{{ typeof item.title === "function" ? item.title() : item.title }}
        </el-button>
      </div>
    </div>
    <el-table
      v-if="showChart"
      highlight-current-row
      :data="tableList"
      :empty-text="'暂无数据'"
      style="width: 100%"
      ref="jayaTable"
      :row-class-name="tableRowClassName"
      :span-method="combine ? objectSpanMethod : function () {}"
      @selection-change="handleSelectionChange"
      @current-change="handleCurrentChange"
    >
      <el-table-column
        label="选择"
        width="55"
        align="center"
        v-if="option.isRadio"
      >
        <template slot-scope="scope">
          <el-radio v-model="tableRadio" :label="scope.row"><i></i></el-radio>
        </template>
      </el-table-column>
      <el-table-column
        type="selection"
        align="center"
        width="55"
        v-if="option.ismultiple"
      />
      <template v-for="(item, index) in tableHeaderList">
        <template>
          <el-table-column
            v-if="!item.type && !item.show"
            v-bind="setAttribute(item)"
            :key="index"
          >
            <template slot-scope="scope">
              <span v-if="item.status" class="table-text">
                {{ getStatus(scope.row[item.prop], item.status()) }}
              </span>
              <span
                v-else-if="item.slotFn"
                v-html="item.slotFn(scope.row, scope.$index)"
                @click="item.onClick && item.onClick(scope.row)"
                class="table-text"
              ></span>
              <span
                v-else
                class="table-text"
                v-html="getTableText(item, scope)"
                :align="item.align"
              >
              </span>
            </template>
          </el-table-column>
          <el-table-column
            v-bind="setAttribute(item)"
            v-else-if="item.type === 'switch'"
            align="center"
            :key="index"
          >
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row[item.prop]"
                :active-value="item.switchShow"
                :inactive-value="item.switchHide"
                :disabled="btnIsDisabled(item, scope)"
                @change="item.change(scope.row)"
                active-color="#13ce66"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column
            v-bind="setAttribute(item)"
            v-else-if="item.type === 'star'"
            align="center"
            :key="index"
          >
            <template slot-scope="scope">
              <el-rate
                v-model="scope.row[item.prop]"
                disabled
                text-color="#ff9900"
              >
              </el-rate>
            </template>
          </el-table-column>
          <el-table-column
            v-bind="setAttribute(item)"
            v-else-if="item.type === 'button'"
            :key="index"
          >
            <template slot-scope="scope">
              <el-button
                class="elt-button"
                @click="item.onClick && item.onClick(scope.row)"
                :type="item.btnType || 'text'"
                :size="item.size || 'mini'"
                >{{ getBtnText(item, scope) }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            v-bind="setAttribute(item)"
            v-else-if="item.type === 'tag'"
            :key="index"
          >
            <template slot-scope="scope">
              <el-tag v-if="scope.row.color" :color="scope.row.color">{{
                scope.row[item.prop]
              }}</el-tag>
              <el-tag v-else-if="scope.row.tagType" :type="scope.row.tagType">{{
                scope.row[item.prop]
              }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            v-bind="setAttribute(item)"
            align="center"
            headerAlign="center"
            fixed="right"
            v-else-if="item.type === 'buttons'"
            :key="index"
          >
            <template slot-scope="scope">
              <template>
                <el-button
                  v-show="
                    !itemBtn.hide || (itemBtn.hide && !itemBtn.hide(scope.row))
                  "
                  v-for="(itemBtn, index) in scope.row.butList
                    ? scope.row.butList
                    : item.butList"
                  :key="index"
                  v-hasPermi="itemBtn.hasPermi"
                  @click="itemBtn.onClick(scope.row, itemBtn)"
                  :type="itemBtn.type || 'text'"
                  :size="itemBtn.size || 'mini'"
                  :disabled="btnIsDisabled(itemBtn, scope)"
                  >{{
                    typeof itemBtn.title === "function"
                      ? itemBtn.title(scope.row)
                      : itemBtn.title
                  }}
                </el-button>
                <span v-if="item.text && item.text(scope.row)">{{
                  item.text(scope.row)
                }}</span>
              </template>
            </template>
          </el-table-column>
        </template>
      </template>
    </el-table>
    <div v-else>
      <slot name="chart"></slot>
    </div>
  </div>
</template>

<script>
const cacheTypeOptions = {};
import {
  getDrvSelect,
  getDeptSelect,
  getDictSelect,
  getOrganSelect,
  getExamCarSelect,
  getMonitorSelect,
  getExamRoomSelect,
  getExamToolSelect,
  getExamStaffSelect,
} from "@/api/param/select";
const fn = {
  X: getDrvSelect,
  O: getDictSelect,
  B: getDeptSelect,
  F: getOrganSelect,
  C: getExamCarSelect,
  J: getMonitorSelect,
  K: getExamRoomSelect,
  T: getExamToolSelect,
  S: getExamStaffSelect,
};
export default {
  name: "JayaTable",
  props: {
    title: {
      type: String,
      default: "",
    },
    functionalityBtn: {
      type: Array,
      default: () => [],
    },
    option: {
      type: Object,
      default: () => ({}),
    },
    tableHeaderList: {
      type: Array,
      default: () => [],
    },
    tableList: {
      type: Array,
      default: () => [],
    },
    showChart: {
      type: Boolean,
      default: true,
    },
    combine: {
      type: Boolean,
      default: false,
    },
    // 合并第几列
    colspans: {
      type: Number,
      default: null,
    },
    // 合并字段
    colspanName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      checkAll: true,
      checkNoAll: false,
      isIndeterminate: false,
      checkedColumn: [],
      allColumn: [],
      objOption: {},
      tableRadio: "",
    };
  },
  created() {
    this.tableHeaderList.map((option) => {
      if (option.status) {
        const typeOptions = option.status();
        if (typeof typeOptions == "string") {
          this.$set(this.objOption, typeOptions, null);
          if (!cacheTypeOptions[typeOptions]) {
            if (fn[typeOptions]) {
              fn[typeOptions]().then((result) => {
                const res = {};
                result.data.map((item) => {
                  res[item.value] = item.label;
                });
                this.$set(this.objOption, typeOptions, res);
                cacheTypeOptions[typeOptions] = res;
              });
            } else {
              getDictSelect(typeOptions).then((result) => {
                const res = {};
                result.data.map((item) => {
                  res[item.value] = item.label;
                });
                this.$set(this.objOption, typeOptions, res);
                cacheTypeOptions[typeOptions] = res;
              });
            }
          } else {
            this.$set(
              this.objOption,
              typeOptions,
              cacheTypeOptions[typeOptions]
            );
          }
        }
      }
    });
  },

  methods: {
    getStatus(prop, statusOption) {
      var label;
      if (!statusOption) return;
      prop = prop + "";
      if (prop && Array.isArray(statusOption)) {
        label = statusOption
          .filter((item) => prop.includes(item.value))
          .map((status) => status.label)
          .join();
      }
      if (typeof statusOption == "string") {
        if (statusOption && this.objOption[statusOption]) {
          label = this.objOption[statusOption][prop];
        }
      }
      return label;
    },
    getBtnText(item, scope) {
      return item.formatter ? item.formatter(scope) : item.label;
    },
    btnIsDisabled(itemBtn, scope) {
      return itemBtn.formatter ? itemBtn.formatter(scope) : itemBtn.disabled;
    },
    setAttribute(item) {
      return {
        headerAlign: "center",
        prop: item.prop,
        fixed: item.fixed,
        label: item.title,
        width: item.width || "auto",
        align: item.align || "center",
        minWidth: item.minWidth ? item.minWidth : "150",
        // sortable : item.sortable,
        showOverflowTooltip: true,
      };
    },
    getTableText(item, scope) {
      let text = item.formatter ? item.formatter(scope) : scope.row[item.prop];
      return text || text == "0" ? text : "-";
    },
    isAllSelect(val) {
      this.checkAll = val.length === this.allColumn.length;
    },
    handleCheckedCitiesChange(value) {
      this.checkedColumn = value;
      let checkedCount = value.length;
      let len = this.allColumn.length;
      this.checkAll = checkedCount === len;
      this.isIndeterminate = checkedCount > 0 && checkedCount < len;
    },
    // 多选
    handleSelectionChange(val) {
      this.$emit("handleSelectionChange", val);
    },
    //单选
    handleCurrentChange(val) {
      this.tableRadio = val;
      this.$emit("handleCurrentChange", val);
    },
    //取消单选
    setCurrent(row = "") {
      this.tableRadio = row;
      this.$emit("handleCurrentChange", null);
      this.$refs.jayaTable.setCurrentRow(row);
    },
    // 设置特殊行颜色
    tableRowClassName({ row }) {
      if (row.hfx === false) {
        return "danger-row";
      }
    },
    //合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === this.colspans) {
        return {
          rowspan: row.rowspan,
          colspan: 1,
        };
      }
    },
    // 处理数据
    setrowspans() {
      // 先给所有的数据都加一个v.rowspan = 1
      this.tableList.forEach((v) => {
        v.rowspan = 1;
      });
      // 双层循环
      for (let i = 0; i < this.tableList.length; i++) {
        // 内层循环，上面已经给所有的行都加了v.rowspan = 1
        // 这里进行判断
        // 如果当前行的name和下一行的name相等
        // 就把当前v.rowspan + 1
        // 下一行的v.rowspan - 1
        for (let j = i + 1; j < this.tableList.length; j++) {
          //此处可根据相同字段进行合并，此处是根据的name
          // console.log(this.colspanName)
          if (
            this.tableList[i][this.colspanName] ===
            this.tableList[j][this.colspanName]
          ) {
            this.tableList[i].rowspan++;
            this.tableList[j].rowspan--;
          }
        }
        // 这里跳过已经重复的数据
        i = i + this.tableList[i].rowspan - 1;
      }
    },

    setRow() {
      // 合并单元格
      if (this.tableList.length > 0 && this.combine) {
        this.setrowspans();
      }
    },
  },
  watch: {
    checkedColumn: {
      handler: "isAllSelect",
    },
    tableList: {
      handler: "setRow",
    },
  },
  mounted() {
    // 合并单元格
    this.setRow();
  },
};
</script>

<style lang="scss" scoped>
.table-top {
  margin-bottom: 10px;
}
.el-table {
  /deep/ .danger-row {
    background: red;
  }
  // 处理合并行问题
  /deep/.el-tooltip {
    width: 100% !important;
  }
}
</style>
