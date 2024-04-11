<template>
  <div class="app-container">
    <el-form
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
          <jaya-select
            type="C"
            v-model="queryParams.cityId"
            :parameter="queryParams.provinceId"
            placeholder="请选择市/区"
          ></jaya-select>
          <jaya-select
            type="T"
            v-model="queryParams.countyId"
            :parameter="queryParams.cityId"
            placeholder="请选择区/县"
          ></jaya-select>
        </div>
      </el-form-item>
      <el-form-item>
        <jaya-select
          type="SS"
          :parameter="
            JSON.stringify({
              provinceId: queryParams.provinceId,
              cityId: queryParams.cityId,
              countyId: queryParams.countyId,
              hasSubSchool: false
            })
          "
          v-model="queryParams.schoolId"
          placeholder="请选择驾校"
        ></jaya-select>
      </el-form-item>
      <el-form-item>
        <el-input
          size="small"
          placeholder="请输入视频名称"
          v-model="queryParams.name"
          clearable
        >
          <template slot="prepend">视频名称</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-select
          size="small"
          v-model="queryParams.type"
          placeholder="请选择视频类型"
          style="width: 160px !important"
          clearable
        >
          <el-option
            v-for="type in typeList"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          size="small"
          v-model="queryParams.carType"
          placeholder="请选择车辆类型"
          style="width: 160px !important"
          clearable
        >
          <el-option
            v-for="type in carTypeList"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          size="small"
          v-model="queryParams.status"
          placeholder="请选择视频状态"
          style="width: 160px !important"
          clearable
        >
          <el-option
            v-for="type in statusList"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-button
        class="fun-btn-right"
        @click="getTableList(null)"
        type="primary"
      >
        查询
      </el-button>
    </el-form>
    <div class="table-box-con">
      <div class="branch-school">
        <div>
          <el-button
            icon="el-icon-plus"
            @click="add"
            type="primary"
            v-hasPermi="['subprojectexplain:add']"
          >
            添加
          </el-button>

          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['subprojectexplain:update']"
          >
            编辑
          </el-button>

          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="removeItem"
            v-hasPermi="['subprojectexplain:delete']"
          >
            删除
          </el-button>
        </div>
        <jaya-table-group
          :total="total"
          :tableHeaderList="column"
          :tableList="tableData"
          @pagination="getTableList"
          @handleCurrentChange="handleCurrentChange"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :option="option"
        ></jaya-table-group>
      </div>
    </div>

    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible="visible"
      width="800px"
      append-to-body
      @close="cancel"
    >
      <el-form
        class="dialogForm"
        :model="reserveForm"
        ref="reserveForm"
        :inline="true"
        label-position="right"
        :rules="rules"
        style="width: 760px"
        v-if="visible"
      >
        <!-- <el-form-item label="驾校名称：" prop="schoolname">
          <el-input
            v-model="reserveForm.schoolname"
            placeholder="请输入驾校名称，默认为精英智通"
            style="width: 360px"
          />
        </el-form-item> -->
        <el-form-item label="视频名称：" prop="name">
          <el-input
            :disabled="title == '查看视频'"
            v-model="reserveForm.name"
            style="width: 360px"
            placeholder="请输入视频名称"
          />
        </el-form-item>
        <el-form-item label="视频类型：" prop="type">
          <el-select
            :disabled="title == '查看视频'"
            size="small"
            v-model="reserveForm.type"
            placeholder="请选择视频类型"
            clearable
            style="width: 360px !important"
          >
            <el-option
              v-for="type in typeList"
              :key="type.value"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item
          label="车辆类型："
          prop="carTypeListSelected"
          class="f-i-cb-body"
        >
          <el-checkbox-group
            :disabled="title == '查看视频'"
            v-model="reserveForm.carTypeListSelected"
          >
            <el-checkbox
              :label="item.value"
              v-for="item in carTypeList"
              :key="item.value"
            >
              {{ item.label }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item v-if="visible1" label="车辆型号：" prop="carModel">
          <el-input
            :disabled="title == '查看视频'"
            v-model="reserveForm.carModel"
            placeholder="请输入车辆型号，比如爱丽舍、桑塔纳"
            style="width: 360px"
          />
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="教学视频：" prop="video">
              <UpLoadVedio
                :disabled="title == '查看视频'"
                :temFormModel="{
                  id: reserveForm.id,
                  url: reserveForm.video
                }"
                :newVedUrl.sync="reserveForm.video"
                @changeDuration="setDuration"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="视频封面：" prop="videoScreen">
              <up-load-image
                :temFormModel="{
                  id: reserveForm.id,
                  url: reserveForm.videoScreen
                }"
                :newImgUrl.sync="reserveForm.videoScreen"
                :disabled="title == '查看视频'"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="视频介绍：" prop="remark">
          <!-- remark	视频介绍		false -->
          <el-input
            type="textarea"
            :disabled="title == '查看视频'"
            v-model="reserveForm.remark"
            style="width: 360px"
            :rows="4"
            placeholder="请输入视频介绍"
          />
        </el-form-item>
        <br />
        <el-form-item label="视频状态：" prop="status">
          <!-- status	上架状态(0,未上架 1,上架)		false	 -->
          <el-switch
            :disabled="title == '查看视频'"
            v-model="reserveForm.status"
            active-text="上架"
            active-value="1"
            inactive-text="未上架"
            inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" v-if="title != '查看视频'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  teachVideoPageList,
  getInfoApi,
  removeApi,
  updateApi,
  addApi,
  putawayApi,
  soldoutApi
} from "@/api/cloud/teachingvideo.js";
import { getDictSelect } from "@/api/param/select";
import { UpLoadImage, UpLoadVedio } from "./modules";
const column = function () {
  return [
    {
      title: "视频名称",
      prop: "name",
      width: "130"
    },
    {
      title: "视频类型",
      prop: "type",
      width: "200",
      status: () => {
        return this.typeList;
      }
    },
    {
      title: "车辆类型",
      prop: "carType"
    },
    {
      title: "上架状态",
      prop: "status",
      status: () => {
        return this.statusList;
      }
    },
    {
      title: "观看次数",
      prop: "showCount"
    },
    {
      title: "最后编辑时间",
      prop: "createTime",
      width: "200"
    },
    {
      title: "操作",
      width: "140",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "查看",
          size: "mini",
          onClick: this.showdetail
        },
        {
          title: "上架",
          size: "mini",
          onClick: this.upAction,
          hide: (row) => {
            return row.status == "1";
          }
        },
        {
          title: "下架",
          size: "mini",
          onClick: this.downAction,
          hide: (row) => {
            return row.status == "0";
          }
        }
      ]
    }
  ];
};
export default {
  name: "TeachingVideo",
  components: { UpLoadImage, UpLoadVedio },
  data() {
    return {
      typeList: [], //视频类型
      carTypeList: [], // 车辆类型
      statusList: [], // 视频状态
      total: 0,
      queryParams: {
        provinceId: "",
        cityId: "",
        countyId: "",
        schoolId: "", // 	驾校
        name: "", // 	视频名称
        type: "", // 视频类型
        subject: "", // 科目(1,科目一 2,科目二 3,科目三)
        carType: "", // 	车辆类型
        status: "", // 	上架状态(0,未上架 1,上架)
        // asc: false, // 	正排序字段
        // desc: true, // 	倒排序字段
        pageNum: 1, // 当前页,示例值(1)
        pageSize: 20 // 	每页的数量,示例值(10)
      },
      column: column.call(this),
      option: {
        isRadio: true
      },
      tableData: [],
      // 列表当前选择项
      multipleSelection: null,
      // 弹窗显示控制
      visible: false,
      visible1: false,
      // 弹窗标题
      title: "",
      // 表单model
      reserveForm: {
        provinceId: "", //
        cityId: "", //
        countyId: "", //
        schoolId: "", //
        carModel: "", //	车辆型号		false
        carType: "", //	车辆类型		false
        // 已经选择的 车辆类型
        carTypeListSelected: [],
        id: "", //	ID主键		false
        name: "", //	视频名称		false
        remark: "", //	视频介绍		false
        status: "1", //	上架状态(0,未上架 1,上架)		false
        subject: "", //	科目(1,科目一 2,科目二 3,科目三)		false
        type: "", //	视频类型		false
        video: "", //	视频文件		false
        videoScreen: "", //	视频封面文件		false
        duration: "" //视频时长
      },

      // 表单验证
      rules: {
        name: [{ required: true, message: "请输入视频名称", trigger: "blur" }],
        type: [
          { required: true, message: "请选择视频类型", trigger: "change" }
        ],
        carTypeListSelected: [
          { required: true, message: "请选择车辆类型", trigger: "change" }
        ],
        carModel: [
          {
            validator:  this.validate,
            trigger: "change"
          },
          { required: true, message: "请输入车辆型号", trigger: "blur" }
        ],
        video: [
          { required: true, message: "请上传教学视频", trigger: "change" }
        ],
        videoScreen: [
          { required: true, message: "请上传视频封面", trigger: "change" }
        ],
        remark: [
          { required: true, message: "请输入视频介绍", trigger: "blur" }
        ],
        status: [
          { required: true, message: "请选择视频状态", trigger: "change" }
        ]
      }
    };
  },
  watch: {
    "reserveForm.carTypeListSelected": {
      handler(nv, ov) {
        // debugger
        this.reserveForm.carType = "";
        this.reserveForm.carType = nv && nv.length > 0 ? nv.join(",") : "";
      },
      immediate: true
    },
    "reserveForm.type": {
      handler(nv, ov) {
        this.visible1 = false;
        this.$nextTick(() => {
          let f = false;
          this.$refs.reserveForm && this.$refs.reserveForm.clearValidate
            ? this.$refs.reserveForm.clearValidate("carModel")
            : "";
          this.typeList.forEach((item) => {
            if (nv == item.value) {
              if (
                item.label.indexOf("科目二") > -1 ||
                item.label.indexOf("科目三") > -1
              ) {
                f = true;
                return;
              }
            }
          });
          if (f) {
            delete this.rules.carModel;
          } else {
            this.rules.carModel = [
              {
                validator: this.validate,
                trigger: "change"
              },
              { required: true, message: "请输入车辆型号", trigger: "blur" }
            ];
          }

          this.visible1 = true;
        });
      },
      immediate: true
    }
  },
  async mounted() {
    await this.getAlldict();
    this.getTableList(null);
  },
  methods: {
    validate(rule, value, callback) {
      if (/[^\a-\z\A-\Z0-9\u4E00-\u9FA5]/.test(value)) {
        callback(new Error("禁止含有特殊字符"));
      } else {
        callback();
      }
    },
    // 获取准教车型
    getAlldict() {
      getDictSelect("exam_car_type").then((res) => {
        if (res.code == 200) this.carTypeList = res.data;
      });
      getDictSelect("video_type").then((res) => {
        if (res.code == 200) this.typeList = res.data;
      });
      getDictSelect("listing_status").then((res) => {
        if (res.code == 200) this.statusList = res.data;
      });
    },
    // 获取列表数据
    getTableList(page) {
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      teachVideoPageList(this.queryParams).then((res) => {
        if (res.code == 200) {
          this.tableData = res.records;
          this.total = Number(res.total);
        }
      });
    },
    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },
    // 增加
    add() {
      this.title = "添加视频";
      this.visible = true;
    },
    //编辑
    async edit() {
      if (!this.multipleSelection || !this.multipleSelection.id) {
        this.$message({ message: "请选择视频", type: "warning" });
        return;
      }
      await this.getInfo(this.multipleSelection.id);

      this.title = "编辑视频";
      this.visible = true;
    },
    // 删除
    async removeItem() {
      if (!this.multipleSelection || !this.multipleSelection.id) {
        this.$message({ message: "请选择视频", type: "warning" });
        return;
      }
      if (this.multipleSelection.status == "1") {
        this.$message({ message: "视频已上架,不可删除", type: "warning" });
        return;
      }
      this.$confirm("确定删除选择的的视频吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeApi({ id: this.multipleSelection.id }).then((res) => {
            this.$message.success("删除视频成功！");
            this.getTableList(null);
          });
        })
        .catch(() => {});
    },
    // 按钮查看
    async showdetail(row) {
      await this.getInfo(row.id);
      this.title = "查看视频";
      this.visible = true;
    },
    // 查看api
    async getInfo(id) {
      await getInfoApi({ id: id })
        .then((res) => {
          if (res.code == 200) {
            res.data.status = String(res.data.status);
            res.data.type = String(res.data.type);
            // res.data.video = String(res.data.video);
            res.data.carTypeListSelected = res.data.carType
              ? res.data.carType.split(",")
              : [];
            this.reserveForm = res.data;
          }
        })
        .catch((e) => {});
    },
    // 上架
    upAction(row) {
      putawayApi({
        id: row.id
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("上架成功！");
            this.getTableList(null);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    // 下架
    downAction(row) {
      soldoutApi({
        id: row.id
      })
        .then((res) => {
          if (res.code == 200) {
            this.$message.success("下架成功！");
            this.getTableList(null);
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },

    // 设置视频时长
    setDuration(val) {
      this.reserveForm.duration = val;
    },

    // 保存
    save() {
      this.$refs.reserveForm.validate((valid) => {
        if (valid) {
          let saveapi = null;
          switch (this.title) {
            case "添加视频":
              saveapi = addApi;
              break;
            case "编辑视频":
              saveapi = updateApi;
              break;
            default:
              break;
          }
          this.reserveForm.videoFile = this.reserveForm.video;
          this.reserveForm.videoScreen = this.reserveForm.videoScreen;
          saveapi(this.reserveForm)
            .then((res) => {
              if (res.code == 200) {
                this.getTableList(null);
                this.cancel();
              }
            })
            .catch((e) => {
              console.log(e);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 关闭设置界面
    cancel() {
      this.visible = false;
      this.title = "";
      this.reserveForm = {
        provinceId: "", //
        cityId: "", //
        countyId: "", //
        schoolId: "", //
        carModel: "", //	车辆型号		false
        carType: "", //	车辆类型		false
        // 已经选择的 车辆类型
        carTypeListSelected: [],
        id: "", //	ID主键		false
        name: "", //	视频名称		false
        remark: "", //	视频介绍		false
        status: "1", //	上架状态(0,未上架 1,上架)		false
        subject: "", //	科目(1,科目一 2,科目二 3,科目三)		false
        type: "", //	视频类型		false
        video: "", //	视频文件		false
        videoScreen: "", //	视频封面文件		false
        duration: "" //视频时长
      };
      this.$refs.reserveForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.querySchool {
  .ganged {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    /deep/.jaya-select {
      width: 30%;
      .el-input,
      .el-select {
        width: 100%;
      }
    }
  }
}
/deep/ .f-i-cb-body .el-checkbox-group {
  width: 596px;
}
</style>
