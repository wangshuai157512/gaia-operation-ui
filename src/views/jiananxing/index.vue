<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <!-- <el-form-item prop="drvSchoolId">
        <jaya-select
          size="small"
          type="S"
          v-model="queryParams.drvSchoolId"
          placeholder="选择驾校主校区"
        ></jaya-select>
      </el-form-item> -->
      <el-form-item class="querySchool">
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
      <el-form-item prop="model">
        <jaya-select
          size="small"
          v-model="queryParams.model"
          placeholder="请选择模拟器型号"
          othername="simulatorModel"
        />
      </el-form-item>
      <el-form-item prop="id">
        <el-input
          v-model="queryParams.id"
          size="small"
          placeholder="请输入系统编号"
          clearable
        >
          <template slot="prepend">系统编号</template>
        </el-input>
      </el-form-item>

      <el-form-item prop="functionConfiguration">
        <el-select
          size="small"
          v-model="queryParams.functionConfiguration"
          placeholder="功能配置"
          clearable
        >
          <el-option
            v-for="item in functionconfigurationOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
        <el-select
          v-model="queryParams.status"
          size="small"
          placeholder="请选择状态"
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
      <el-button class="fun-btn-right" @click="getTableList(1)" type="primary"
        >查询</el-button
      >
    </el-form>
    <div class="table-box-con">
      <span class="carTotal">总数量：{{ total }} </span>
      <el-button
        @click="handleNewAdd"
        icon="el-icon-plus"
        type="primary"
        v-hasPermi="['simulator:add']"
        >添加</el-button
      >
      <el-button
        @click="InfoShow"
        icon="el-icon-view"
        type="info"
        v-hasPermi="['simulator:info']"
        >查看详情</el-button
      >

      <el-button
        @click="updateShow"
        icon="el-icon-edit"
        type="warning"
        v-hasPermi="['simulator:update']"
        >编辑</el-button
      >
      <el-button
        @click="configurationShow"
        icon="el-icon-setting"
        type="primary"
        class="functionConfiguration"
        v-hasPermi="['simulator:config:update']"
        >功能配置</el-button
      >
      <jaya-table-group
        :total="total"
        :tableHeaderList="column"
        :tableList="tableList"
        @pagination="getTableList"
        @handleCurrentChange="handleCurrentChange"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        :option="option"
        v-show="!visible"
      ></jaya-table-group>
    </div>
    <config-model
      @configSuccess="getTableList"
      :isConfig="isConfig"
      :simulatorId="configId"
      ref="configModel"
    />
    <!-- 添加、编辑、详情 -->
    <div class="custom-dialog" v-if="visible">
      <div class="custom-dialog-con">
        <div class="img-box">
          <div v-if="!imageUrlSide && operating == 3" class="">
            <i class="el-icon-plus avatar-uploader-icon"
              ><div class="upPhoto">暂无照片</div></i
            >
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              name="image"
              :accept="accept"
              :before-upload="(file) => verifyAccept(file, accept)"
              :action="`${action}api/public/file/uploadImage`"
              :headers="headers"
              fileTitle="模拟器照片"
              :show-file-list="false"
              :on-success="handleAvatarImgSuccess"
              :disabled="operating === 3"
            >
              <img
                v-if="imageUrlSide"
                :src="`https://jpypt.oss-cn-beijing.aliyuncs.com${imageUrlSide}`"
                class="avatar"
              />
              <div v-else class="">
                <i class="el-icon-plus avatar-uploader-icon">
                  <div class="imgUp">
                    <img
                      src="../../assets/images/photoUpload.png"
                      alt=""
                      class="imgShow"
                    />
                  </div>
                  <div class="upPhotoFist">点击上传</div>
                </i>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="formShowInfo">
          <el-form
            style="width: 630px"
            :inline="true"
            ref="form"
            :disabled="operating == 3"
            :model="form"
            :rules="rules"
            label-width="180px"
          >
            <el-form-item label="所属驾校" prop="drvSchoolId">
              <jaya-select
                type="SS"
                v-model="form.drvSchoolId"
                :parameter="JSON.stringify(querySelect)"
                placeholder="请输入驾校"
                filterable
              ></jaya-select>
            </el-form-item>
            <el-form-item label="模拟器型号" prop="model">
              <jaya-select
                size="small"
                v-model="form.model"
                placeholder="模拟器型号"
                othername="simulatorModel"
                :disabled="operating !== 1"
              />
            </el-form-item>
            <el-form-item label="系统编号" prop="id">
              <el-input
                v-model="form.id"
                size="small"
                placeholder="系统自动生成"
                disabled
              />
            </el-form-item>
            <el-form-item label="设备编号" prop="number">
              <el-input
                v-model="form.number"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="设备厂家" prop="factory">
              <el-input
                v-model="form.factory"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>
            <el-form-item label="部署时间" prop="deployTime">
              <el-date-picker
                v-model="form.deployTime"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                placeholder="日历选择"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="模拟器状态" prop="status">
              <el-select
                v-model="form.status"
                size="small"
                placeholder="请选择"
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
            <el-form-item label="部署地址" size="small" prop="details">
              <el-input
                v-model="form.details"
                placeholder="请输入"
                size="small"
                style="margin-right: 10px"
                @input="$forceUpdate()"
                class="resultArea"
              />
              <el-button size="small" @click="handleMap" type="primary"
                >在地图上选择</el-button
              >
            </el-form-item>

            <!-- <el-form-item label="所属教练" prop="jl">
              <el-input
                v-model="form.dictType"
                size="small"
                placeholder="请输入所属教练"
              />
            </el-form-item> -->
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="3"
                :cols="50"
                style="width: 100%"
                placeholder="文字介绍"
              />
            </el-form-item>
          </el-form>
        </div>
        <div class="btn">
          <el-button
           v-if="operating !== 3"
            type="primary"
            @click="submitForm('form')"
            >保 存</el-button
          >
          <el-button @click="visible = false">取 消</el-button>
        </div>
      </div>
    </div>
    <!-- 选择地址 -->
    <school-map :openMap.sync="openMap" @result-area="getResultArea" />
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  pageList,
  addPage,
  pageInfo,
  updatePage,
  uploadImage,
  getSimulatorConfig,
} from "@/api/cloud/jiananxing";
import ConfigModel from "./configModel.vue";
const column = function () {
  return [
    {
      title: "型号",
      prop: "model",
    },
    {
      title: "系统编号",
      prop: "id",
    },
    {
      title: "设备编号",
      prop: "number",
    },
    {
      title: "部署地址",
      prop: "details",
    },
    {
      title: "部署时间",
      prop: "deployTime",
    },
    {
      title: "配置状态",
      prop: "functionConfiguration",
      status: () => this.functionconfigurationOptions,
    },
    {
      title: "状态",
      prop: "status",
      status: () => this.statusOptions,
    },
  ];
};
export default {
  name: "Jiananxing",
  components: { ConfigModel },
  data() {
    return {
      headers: { Authorization: `Bearer ${getToken("Admin-Token")}` },
      action: this.baseApi,
      column: column.call(this),
      visible: false,
      configVisible: false,
      detailRow: null,
      title: null,
      loadingInstance: null,
      form: {},
      querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      },
      // imageUrl: "",
      dialogImageUrl: "",
      operating: 0, //1添加 2编辑 3详情
      openMap: false,
      imageUrlSide: "",
      // 数据
      data: [],
      // 总条数
      total: 0,
      tableList: [],
      option: {
        isRadio: true,
      },
      // table入参
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // table Loading框
      tableLoading: false,
      open: false,
      // 模态框
      visible: false,
      statusOptions: [
        {
          value: 1,
          label: "正常",
        },
        {
          value: 0,
          label: "停用",
        },
      ],
      examResults: [],
      cityList: [],
      props: {
        value: "label",
        children: "cities",
      },
      sujectOptions: [],
      itemtOptions: [],
      modelOptions: [],
      functionconfigurationOptions: [
        {
          value: "0",
          label: "未设置",
        },
        {
          value: "1",
          label: "已设置",
        },
      ],
      sysVersionOptions: [],
      roomOptions: [],
      multipleSelection: null,
      accept: ".jpg,.jpeg,.png,.bmp", //图片格式
      rules: {
        drvSchoolId: [{ required: true, trigger: "blur", message: "必填项" }],
        model: [{ required: true, trigger: "blur", message: "必填项" }],
        number: [
          {
            pattern: /^[0-9]{1,3}$/,
            message: "请输入正确的设备编号",
          },
          { trigger: "change" },
        ],
      },
      configId: "",
      isConfig: false,
    };
  },
  mounted() {
    this.getTableList();
  },
  methods: {
    /** 搜索点击事件 */
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      pageList(this.queryParams).then((res) => {
        this.tableList = res.records;
        this.total = Number(res.total);
      });
    },

    //添加
    handleNewAdd() {
      this.form = {};
      this.resetForm("form");
      this.imageUrlSide = "";
      this.imageUrlSide = null;
      this.visible = true;
      this.operating = 1;
      // this.imageUrl = "";
      this.title = "添加";
    },

    getOptions({ data }) {
      if (data) {
        let keymap = {
          name: "label",
          id: "value",
        };
        data.forEach((item) => {
          Object.keys(item).map((keys) => {
            let newKey = keymap[keys];
            if (newKey) {
              item[newKey] = item[keys];
              delete item[keys];
            }
          });
        });
      }
    },

    //编辑
    updateShow() {
      this.form = {};
      this.resetForm("form");
      this.imageUrlSide = "";
      this.imageUrlSide = null;
      if (this.multipleSelection) {
        const { id } = this.multipleSelection;
        pageInfo({ id: id }).then(({ data }) => {
          this.form = data;
          this.visible = true;
          this.title = "修改";
          this.operating = 2;
          this.imageUrlSide = data.photo || null;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    //详情
    InfoShow() {
      this.imageUrlSide = "";
      this.imageUrlSide = null;
      if (this.multipleSelection) {
        this.operating = 3;
        const { id } = this.multipleSelection;
        pageInfo({ id: id }).then(({ data }) => {
          this.form = data;
          this.imageUrlSide = data.photo || null;
          this.visible = true;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.operating !== 3) {
            if (this.operating == 1) {
              addPage(this.form).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
                this.visible = false;
              });
            } else {
              updatePage(this.form).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
                this.visible = false;
              });
            }
          }
        }
      });
    },

    //功能配置
    configurationShow() {
      if (!this.multipleSelection) return this.msgWarn("请选择一条数据");
      const { functionConfiguration, id } = this.multipleSelection;

      this.configId = id;
      this.isConfig = functionConfiguration ? true : false;
      this.$nextTick(this.$refs.configModel.getSimulatorConfig);
    },

    // 上传照片回显
    handleAvatarImgSuccess({ code, msg, data }, file) {
      this.loadingInstance.close();
      if (code != 200) {
        this.msgError(msg);
      } else {
        this.msgSuccess("上传成功");
      }
      this.imageUrlSide = data;
      this.form.photo = data;
    },

    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },

    //地图选择
    handleMap() {
      this.openMap = true;
    },

    // 获取详细地址
    getResultArea(area) {
      this.form.details = area;
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

.functionConfiguration {
  background-color: #6a24eb;
  border-color: #6a24eb;
  border-radius: 5px;
}

.carTotal {
  font-size: 22px;
  color: #333333;
  margin-right: 20px;
}

/deep/ .el-dialog__title {
  margin: auto;
  display: block;
  text-align: center;
}

.img-box {
  justify-content: space-between;
  flex-wrap: wrap;
  float: right;
  width: 25%;
  position: relative;
  .imgUp {
    position: absolute;
    z-index: 10;
    width: 75px;
    height: 75px;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
  }
  .avatar-uploader-icon {
    position: relative;
    z-index: 5;
    font-size: 28px;
    color: #ebecef;
    width: 210px;
    height: 300px;
    border: 1px solid #ebecef;
    background-color: #ebecef;
    border-radius: 6px;
    margin-left: 20px;
  }
  .avatar-uploader-icon:hover {
    border-color: #409eff;
  }
  .upPhoto {
    margin-top: 120px;
    font-size: 16px;
    text-align: center;
    color: #999999;
    text-align: center;
  }
  .upPhotoText {
    margin-top: 180px;
    font-size: 16px;
    color: #999999;
    text-align: center;
  }
  .avatar {
    width: 210px;
    height: 300px;
    display: block;
  }
}

.formShowInfo {
  justify-content: space-between;
  flex-wrap: wrap;
  width: 75%;
  position: relative;
  /deep/ .el-form-item {
    width: calc(100% - 25px);
    .el-form-item__content {
      width: calc(100% - 140px);
      .el-select--small {
        width: 100%;
      }
    }
  }
}

/deep/.el-select--small,
.el-input--small {
  width: 100%;
}

</style>
