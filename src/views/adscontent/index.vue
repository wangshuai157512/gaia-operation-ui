<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <el-input
          size="small"
          placeholder="请输入广告名称"
          v-model="queryParams.advName"
          clearable
        >
          <template slot="prepend">广告名称</template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="dateTimeList"
          type="datetimerange"
          range-separator="至"
          start-placeholder="创建开始时间"
          end-placeholder="创建结束时间"
          format="yyyy-MM-dd HH:mm:ss"
          value-format="yyyy-MM-dd HH:mm:ss"
          :clearable="true"
          @change="dateChange"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          size="small"
          v-model="queryParams.status"
          placeholder="请选择广告状态"
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
      <el-form-item>
        <el-select
          size="small"
          v-model="queryParams.advType"
          placeholder="请选择广告类型"
          style="width: 160px !important"
          clearable
        >
          <el-option
            v-for="(type, index) in advTypeList"
            :key="index"
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
            v-hasPermi="['advertising:add']"
          >
            添加
          </el-button>

          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['advertising:update']"
          >
            编辑
          </el-button>

          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="removeItem"
            v-hasPermi="['advertising:delete']"
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
      width="700px"
      append-to-body
      @close="cancel"
    >
      <el-form
        v-if="visible"
        class="dialogForm"
        :model="reserveForm"
        ref="reserveForm"
        :inline="false"
        label-position="right"
        :rules="rules"
        style="width: 660px"
        label-width="200px"
      >
        <el-form-item label="广告名称：" prop="advName">
          <el-input
            v-model="reserveForm.advName"
            placeholder="请输入广告名称"
            style="width: 240px"
            :disabled="title == '查看广告'"
          />
        </el-form-item>
        <el-form-item label="广告类型：" prop="advType">
          <el-select
            size="small"
            v-model="reserveForm.advType"
            placeholder="请选择广告类型"
            clearable
            style="width: 240px !important"
            :disabled="title == '查看广告'"
          >
            <el-option
              v-for="(type, index) in advTypeList"
              :key="index"
              :label="type.label"
              :value="type.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="广告资源：" prop="advPhoto">
          <!-- advPhoto	视频封面文件		false	  -->
          <el-input v-show="false" v-model="reserveForm.advPhoto" />
          <div class="img-box">
            <uploadFile
              :temFormModel="{ id: reserveForm.id, url: reserveForm.advPhoto }"
              :newUrl.sync="reserveForm.advPhoto"
              :disabled="title == '查看广告'"
            />
            支持上传jpg、jpeg、png格式，小于50MB
          </div>
        </el-form-item>
        <el-form-item label="开始时间：" prop="startTime">
          <el-date-picker
            :disabled="title == '查看广告'"
            v-model="reserveForm.startTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            @blur="handleStartBlur"
            placeholder="选择开始日期时间"
            style="width: 240px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker
            :disabled="title == '查看广告'"
            v-model="reserveForm.endTime"
            type="datetime"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="选择结束日期时间"
            style="width: 240px"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="跳转链接：" prop="jumbLink">
          <el-input
            v-model="reserveForm.jumbLink"
            style="width: 240px"
            :disabled="title == '查看广告'"
          />
        </el-form-item>
        <el-form-item label="优先级排序：" prop="sort">
          <el-input-number
            :disabled="title == '查看广告'"
            v-model="reserveForm.sort"
            :min="0"
            step-strictly
            style="width: 240px"
          />
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-radio
            :disabled="title == '查看广告'"
            v-model="reserveForm.status"
            v-for="item in statusList"
            :key="item.value"
            :label="item.value"
            >{{ item.label }}</el-radio
          >
          <!-- <el-switch
            v-model=""
            active-text="上架"
            active-value="1"
            inactive-text="未上架"
            inactive-value="0"
          ></el-switch> -->
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save" v-if="title != '查看广告'"
          >确 定</el-button
        >
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  advPageList,
  getInfoApi,
  removeApi,
  updateApi,
  addApi,
  soldoutApi,
  putawayApi
} from "@/api/cloud/advertising.js";
import { getDictSelect } from "@/api/param/select";
import { getToken } from "@/utils/auth";
import { uploadFile } from "./modules";
const urlPrefix = process.env.VUE_APP_BASE_URL;
const column = function () {
  return [
    {
      title: "广告名称",
      prop: "advName",
      width: "130"
    },
    {
      title: "图片",
      prop: "advPhoto",
      formatter({ row }) {
        if (!row.advPhoto) return "";
        let str = "";
        let stri = `<img height="45" width="60" src="${
          urlPrefix + row.advPhoto
        }"  alt="" />`;

        let strv = `<video height="45" width="60" src="${
          urlPrefix + row.advPhoto
        }"  alt="" />`;
        if (
          row.advPhoto.indexOf(".png") >= 0 ||
          row.advPhoto.indexOf(".jpg") >= 0 ||
          row.advPhoto.indexOf(".jpeg") >= 0
        ) {
          str = stri;
        }
        if (row.advPhoto.indexOf(".mp4") >= 0) {
          str = strv;
        }
        return str;
      }
    },
    {
      title: "广告类型",
      prop: "advType",
      status: () => {
        return this.advTypeList;
      }
    },
    {
      title: "广告状态",
      prop: "status",
      status: () => {
        return this.statusList;
      }
    },
    {
      title: "创建时间",
      prop: "createTime",
      width: "200"
    },
    {
      title: "操作",
      width: "100",
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
  name: "AdsContent",
  components: { uploadFile },
  data() {
    return {
      // 广告类型
      advTypeList: [],
      // 广告状态
      statusList: [],
      total: 0,
      queryParams: {
        advName: "",
        advType: "",
        startTime: "",
        endTime: "",
        status: "",
        pageNum: 1, // 当前页,示例值(1)
        pageSize: 20 // 	每页的数量,示例值(10)
      },
      dateTimeList: [],
      column: column.call(this),
      option: {
        isRadio: true
      },
      tableData: [],
      // 列表当前选择项
      multipleSelection: null,
      // 弹窗显示控制
      visible: false,
      // 弹窗标题
      title: "",
      // 表单model
      reserveForm: {
        advName: "", //广告名称
        advType: "", //广告 类型
        advPhoto: "", //广告图片
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        jumbLink: "", // 跳转链接
        sort: "", // 优先级排序
        status: "1", // 状态
        id: ""
      },
      // 车辆类型
      // reserveFormCarModeList: [],
      fileList: [],
      fileVedioList: [],
      uploadImgData: {},
      // 图片参数 ---bg
      headers: { Authorization: "Bearer " + getToken() },
      imgUrlPrefix: process.env.VUE_APP_BASE_URL,
      dialogVisible: false,

      // 图片参数 ---ed
      rules: {
        advName: [
          { required: true, message: "请输入广告名称", trigger: "blur" }
        ], //
        advType: [
          { required: true, message: "请选择广告类型", trigger: "change" }
        ], //广告 类型
        advPhoto: [
          { required: true, message: "请上传广告资源", trigger: "change" }
        ], //广告图片
        startTime: [
          { required: true, message: "请选择开始时间", trigger: "change" }
        ], // 开始时间
        endTime: [
          { required: true, message: "请选择结束时间", trigger: "change" },
          {
            validator: this.validate,
            trigger: "change"
          }
        ], // 结束时间
        jumbLink: [
          { required: true, message: "请输入跳转链接", trigger: "blur" }
        ], // 跳转链接
        sort: [
          {
            required: true,
            message: "请输入优先级",
            trigger: "blur"
          }
        ], // 优先级排序
        status: [{ required: true, message: "请选择状态", trigger: "change" }] // 状态
      }
    };
  },
  async mounted() {
    await this.getAlldict();
    this.getTableList(null);
  },
  methods: {
    validate(rule, value, callback) {
      const nowDate = new Date(this.reserveForm.startTime || null); 
      if(new Date(value).getTime() <= nowDate.getTime()) {
          callback(new Error("结束时间需大于开始时间"));
      }else {
        callback();
      }
      // if ( value instanceof Object && value.getTime() <= nowDate.getTime()) {
      //   callback(new Error("结束时间需大于开始时间"));
      // } else {
      //   callback();
      // }
    },
    handleStartBlur() {
      this.reserveForm.endTime = "";
    },
    // 获取 字典
    getAlldict() {
      getDictSelect("listing_status").then((res) => {
        if (res.code == 200) {
          this.statusList = res.data;
          console.log();
        }
      });
      getDictSelect("adv_type").then((res) => {
        if (res.code == 200) {
          this.advTypeList = res.data;
        }
      });
    },
    // 时间范围选中 改变事件
    dateChange(val) {
      if (!val || val.length <= 0) {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
        return;
      }
      this.queryParams.startTime = val[0];
      this.queryParams.endTime = val[1];
    },
    // 获取列表数据
    getTableList(page) {
      this.queryParams.pageNum = page ? page.page : this.queryParams.pageNum;
      this.queryParams.pageSize = page ? page.limit : this.queryParams.pageSize;
      advPageList(this.queryParams).then((res) => {
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
      this.title = "添加广告";
      this.visible = true;
    },
    //编辑
    async edit() {
      if (!this.multipleSelection || !this.multipleSelection.id) {
        this.$message({ message: "请选择广告", type: "warning" });
        return;
      }
      await this.getInfo(this.multipleSelection.id);
      this.uploadImgData = { id: this.multipleSelection.id };
      this.title = "编辑广告";
      this.visible = true;
    },
    //  删除
    removeItem() {
      if (!this.multipleSelection || !this.multipleSelection.id) {
        this.$message({ message: "请选择广告", type: "warning" });
        return;
      }
      if (this.multipleSelection.status == "1") {
        this.$message({ message: "广告已上架,不可删除", type: "warning" });
        return;
      }
      this.$confirm("确定删除选择的的广告吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await removeApi({ id: this.multipleSelection.id });
          this.getTableList(null);
        })
        .catch(() => {});
    },
    // 按钮查看
    async showdetail(row) {
      // console.log(row);
      await this.getInfo(row.id);
      this.title = "查看广告";
      this.visible = true;
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
    //下架
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
    // 查看api
    async getInfo(id) {
      await getInfoApi({ id: id })
        .then((res) => {
          if (res.code == 200) {
            res.data.status = String(res.data.status);
            res.data.status = String(res.data.status);
            this.reserveForm = res.data;
            // this.reserveFormCarModeList = res.data.carType
            // ? res.data.carType.split(",")
            // : [];
          }
        })
        .catch((e) => {});
    },
    // 删除
    removeAction(row) {
      this.$confirm(`确定要删除该广告`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        let { data } = await removeApi({ id: row.id });
        this.getTableList(null);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
      });
    },

    // 保存
    save() {
      let saveapi = null;
      let msg = "";

      this.$refs.reserveForm.validate((valid) => {
        if (valid) {
          switch (this.title) {
            case "添加广告":
              saveapi = addApi;
              msg = "添加成功！";
              break;
            case "编辑广告":
              saveapi = updateApi;
              msg = "编辑成功！";
              break;
            default:
              break;
          }
          saveapi(this.reserveForm)
            .then((res) => {
              // console.log(res);
              this.cancel();
              this.getTableList(null);
              this.$message({
                type: "success",
                message: msg
              });
            })
            .catch((e) => {
              console.log(e);
            });
        }
      });
    },
    // 关闭设置界面
    cancel() {
      this.$refs.reserveForm.resetFields();
      this.visible = false;
      this.title = "";
      this.reserveForm = {
        advName: "", //广告名称
        advType: "", //广告 类型
        advPhoto: "", //广告图片
        startTime: "", // 开始时间
        endTime: "", // 结束时间
        jumbLink: "", // 跳转链接
        sort: "", // 优先级排序
        status: "1", // 状态
        id: ""
      };
      this.uploadImgData = {};
    },
    //广告图片上传
    handleAvatarImgSuccess({ code, msg, data }, file) {
      if (code != 200) {
        this.msgError(msg);
      } else {
        this.reserveForm.advPhoto = data.addr;
        this.msgSuccess("上传成功");
      }
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

.jaya-select {
  display: inline-block;
}
.table-box-con {
  // display: flex;
  .campus-school {
    width: 360px;
    margin-right: 38px;
    img {
      width: 360px;
      height: 270px;
    }
    .campus-school-item {
      h5 {
        font-size: 16px;
        color: #354153;
        margin-bottom: 10px;
      }
      p {
        font-size: 16px;
        color: #444;
        width: 100%;
        line-height: 2.6;
        border-bottom: 1px solid #000;
        margin-top: 0;
      }
    }
  }
}
.img-box {
  justify-content: flex-start;
  flex-wrap: wrap;
  float: left;
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
    img {
      border: 1px dashed #000;
    }
  }
  .avatar-uploader-icon {
    position: relative;
    z-index: 5;
    font-size: 28px;
    color: #ebecef;
    width: 194px;
    height: 194px;
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
    // margin-right: 200px;
    text-align: center;
  }
  .upPhotoText {
    margin-top: 120px;
    font-size: 16px;
    color: #999999;
    text-align: center;
  }
  .avatar {
    width: 194px;
    height: 194px;
    display: block;
  }
}
</style>
