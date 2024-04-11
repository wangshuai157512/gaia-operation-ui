<template>
  <el-dialog
    width="600"
    title="功能模块配置"
    :visible="visible"
    :destroy-on-close="true"
    :append-to-body="true"
    :show-close="false"
    @close="handleClose"
  >
    <!-- <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item class="querySchool">
        <div class="ganged">
          <jaya-select
            type="P"
            v-model="queryParams.provinceId"
            placeholder="请选择省/市"
          ></jaya-select>
        </div>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="C"
          v-model="queryParams.cityId"
          :parameter="queryParams.provinceId"
          placeholder="请选择市/区"
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="T"
          v-model="queryParams.countyId"
          :parameter="queryParams.cityId"
          placeholder="请选择区/县"
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="SS"
          v-model="queryParams.drvSchoolId"
          :parameter="JSON.stringify(queryParams)"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
    </el-form> -->
    <div class="bg">
      <el-switch
        v-model="value"
        active-text="全部设为收费"
        inactive-text="全部设为免费"
      >
      </el-switch>
    </div>
    <ul v-if="data">
      <li v-for="(item, i) in data" :key="item.id">
        <div>
          <el-checkbox
            :key="item.id"
            :indeterminate="isIndeterminate(item)"
            :value="isChecked(item)"
            @change="handleChange($event, item, i)"
            >{{ item.label }}</el-checkbox
          >
        </div>
        <p v-for="(jtem, j) in item.list" :key="j">
          <el-checkbox v-model="jtem.ischeck">{{ jtem.label }}</el-checkbox>
          <el-switch
            :disabled="true"
            v-model="jtem.ischarge"
            active-text="收费"
            inactive-text="免费"
          >
          </el-switch>
        </p>
      </li>
    </ul>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save">保存</el-button>
    </span>
  </el-dialog>
</template>

<script>
function getField(data) {
  const click = data
    .filter((i) => i.list.some((j) => j.ischeck === true))
    .map((k) => k.id)
    .join();

  const configType = data
    .map((i) => i.list.every((j) => j.ischarge === true))
    .every((item) => item === true)
    ? 2
    : 0;

  return {
    click,
    configType
  };
}
import {
  getSimulatorConfig,
  addSimulatorConfig,
  simulatorConfigInfo
} from "@/api/cloud/jiananxing";
export default {
  name: "ConfigModel",
  props: {
    simulatorId: {
      type: String,
      default: ""
    },
    isConfig: {
      type: Boolean
    }
  },
  data() {
    return {
      queryParams: {},
      visible: false,
      isAllList: [],
      value: false,
      data: null,
      id: null
    };
  },
  watch: {
    value(val) {
      const data = this.data;
      if (data) {
        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < data[i].list.length; j++) {
            data[i].list[j].ischarge = val;
          }
        }
      }
    }
  },

  methods: {
    handleClose() {
      this.value = false;
    },
    save() {
      const { simulatorId, data, id } = this;
      const { click, configType } = getField(this.data);

      if (!click) return this.msgWarn("请先勾选所需的功能模块");

      addSimulatorConfig({
        config: data,
        id: id ? id : "",
        simulatorId,
        configType,
        click
      }).then(({ code, msg }) => {
        if (code == 200) {
          this.msgSuccess(msg);
          this.$emit("configSuccess");
          this.visible = false;
          return;
        }
        this.msgError(msg);
      });
    },

    getSimulatorConfig() {
      const { simulatorId, isConfig } = this;

      if (!isConfig) {
        getSimulatorConfig().then((res) => {
          this.data = res.data;
          this.visible = true;
        });
      } else {
        simulatorConfigInfo({
          config: [],
          id: "",
          simulatorId
        }).then(({ data }) => {
          this.data = data.config;
          this.id = data.configId;
          this.visible = true;
          this.value = this.data.every((i) =>
            i.list.every((j) => j.ischarge === true)
          );
        });
      }
    },

    isIndeterminate(row) {
      const rows = row.list.filter((item) => item.ischeck === true);
      return rows.length > 0 && row.list.length > rows.length;
    },

    isChecked(row) {
      const rows = row.list.filter((item) => item.ischeck === true);
      return rows.length === row.list.length;
    },

    handleChange(event, row, index) {
      this.$set(this.data, index, {
        ...row,
        list: row.list.map((item) => ({ ...item, ischeck: event }))
      });
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.bg {
  /deep/ span {
    font-size: 18px;
    font-weight: 700;
  }
  margin-bottom: 20px;
}

p {
  margin: 0;
  padding: 0;
}

ul {
  li {
    font-size: 16px;
    font-weight: 700;
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 30px;
    > div {
      width: 100%;
    }
    .el-switch {
      margin-left: 12px;
    }

    p {
      font-size: 14px;
      font-weight: 500;
      margin-left: 30px;
      margin-top: 14px;
    }
  }
}
</style>
