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
      <el-form-item prop="coachName">
        <el-input
          size="small"
          style="width: 200px"
          v-model="queryParams.coachName"
          placeholder="请输入教练"
          clearable
        >
          <template slot="prepend">教练</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="learnProcId">
        <jaya-select
          size="small"
          v-model="queryParams.learnProcId"
          placeholder="学车进度"
          othername="learnProc"
        />
      </el-form-item>
      <el-form-item prop="name">
        <el-input
          size="small"
          placeholder="请输入姓名"
          v-model="queryParams.name"
          style="width: 200px !important"
          clearable
        >
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="telephone">
        <el-input
          size="small"
          placeholder="请输入手机号"
          v-model="queryParams.telephone"
          style="width: 230px !important"
          clearable
        >
          <template slot="prepend">手机号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="idCard">
        <el-input
          size="small"
          placeholder="请输入身份证号"
          v-model="queryParams.idCard"
          style="width: 300px !important"
          clearable
        >
          <template slot="prepend">身份证号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="" class="timepick-width-prepend">
        <div
          style="display: inline-table; height: 40px"
          class="el-input-group__prepend"
        >
          报名时间
        </div>
        <el-date-picker
          style="width: 220px !important"
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-button class="fun-btn-right" @click="getTableList(1)" type="primary"
        >查询</el-button
      >
    </el-form>

    <div class="table-box-con">
      <span class="manTotal">总人数：{{ total }}</span>
      <el-button
        @click="handleNewAdd"
        icon="el-icon-plus"
        type="primary"
        v-hasPermi="['student:add']"
        >添加学员</el-button
      >

      <el-button
        @click="handleClick"
        icon="el-icon-view"
        type="info"
        v-hasPermi="['student:info']"
        >查看详情</el-button
      >

      <el-button
        @click="updateClick"
        icon="el-icon-edit"
        type="warning"
        v-hasPermi="['student:update']"
        >编辑</el-button
      >

      <el-button
        @click="deleteClick"
        icon="el-icon-delete"
        type="danger"
        v-hasPermi="['student:delete']"
        >删除</el-button
      >

      <el-upload
        class="avatar-uploader avatar-uploader-file"
        :action="`${action}api/bg/operation/student/import`"
        :headers="headers"
        :data="importData"
        :show-file-list="false"
        :on-success="handleAvatarFileSuccess"
      >
        <el-button
          type="primary"
          round
          class="btnStuBtn"
          v-hasPermi="['student:import']"
          >导入学员</el-button
        >
      </el-upload>

      <el-button
        @click="handleDownClick"
        type="primary"
        round
        class="btnStu"
        v-hasPermi="['student:export']"
        >导出学员</el-button
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
    <div class="custom-dialog" v-if="visible">
      <div class="custom-dialog-con">
        <div class="img-box">
          <div v-if="!imageUrl && operating == 3" class="">
            <i class="el-icon-plus avatar-uploader-icon"
              ><div class="upPhoto">暂无照片</div></i
            >
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              name="photo"
              :accept="accept"
              :before-upload="(file) => verifyAccept(file, accept)"
              :action="`${action}api/bg/operation/student/uploadPhoto`"
              :headers="headers"
              :data="uploadImgData"
              :show-file-list="false"
              :on-success="handleAvatarImgSuccess"
              :disabled="operating === 3"
            >
              <img v-if="imageUrl" :src="`${imageUrl}`" class="avatar" />
              <div v-else class="">
                <i class="el-icon-plus avatar-uploader-icon">
                  <div class="imgUp">
                    <img
                      src="../../../assets/images/photoUpload.png"
                      alt=""
                      class="imgShow"
                    />
                  </div>
                  <div class="upPhotoText">点击修改</div></i
                >
              </div>
            </el-upload>
          </div>
        </div>

        <div class="formShowInfo">
          <el-form
            class="dialogForm"
            :disabled="operating == 3"
            ref="form"
            :model="form"
            :rules="rules"
            :inline="true"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" size="small" placeholder="请输入" />
            </el-form-item>

            <el-form-item label="学员编号" prop="code">
              <el-input
                v-model="form.code"
                size="small"
                placeholder="系统自动生成"
                disabled
              />
            </el-form-item>
            <el-form-item label="所属驾校" prop="drvSchoolId">
              <jaya-select
                type="SS"
                v-model="form.drvSchoolId"
                :parameter="'{}'"
                placeholder="请选择"
              ></jaya-select>
            </el-form-item>

            <el-form-item label="报名点" prop="registrationPointId">
              <jaya-select
                type="M"
                v-model="form.registrationPointId"
                :parameter="form.drvSchoolId || ''"
                placeholder="选择报名点"
              ></jaya-select>
            </el-form-item>

            <el-form-item label="身份证" prop="idCard">
              <el-input
                v-model="form.idCard"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item label="联系电话" prop="telephone">
              <el-input
                v-model="form.telephone"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item label="本地电话" prop="localPhone">
              <el-input
                v-model="form.localPhone"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item label="保险" prop="insurance">
              <el-select
                v-model="form.insurance"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in insuranceOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="增驾" prop="addDrive">
              <el-select
                v-model="form.addDrive"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="外地学员" prop="outStudent">
              <el-select
                v-model="form.outStudent"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in studentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="家庭住址" prop="homeAddr">
              <el-input
                v-model="form.homeAddr"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item label="受理地址" prop="acceptAddr">
              <el-input
                v-model="form.acceptAddr"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item label="申请车型" prop="carType">
              <jaya-select
                size="small"
                v-model="form.carType"
                :parameter="form.drvSchoolId"
                placeholder="请选择培训车型"
                type="CAR"
              />
            </el-form-item>

            <el-form-item label="班型" prop="classTypeId">
              <el-select
                v-model="form.classTypeId"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in classTypeIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="报名日期" prop="signUpDate">
              <el-date-picker
                v-model="form.signUpDate"
                type="date"
                size="small"
                style="width: 100%"
                value-format="yyyy-MM-dd"
                placeholder="日历选择"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="报名价格" prop="signUpPrice">
              <el-input
                v-model="form.signUpPrice"
                size="small"
                placeholder="请输入"
              />
            </el-form-item>

            <el-form-item label="学车进度" prop="learnProcId">
              <jaya-select
                size="small"
                v-model="form.learnProcId"
                placeholder="学车进度"
                othername="learnProc"
              />
            </el-form-item>

            <el-form-item label="约车阶段" prop="reserveCarProcId">
              <jaya-select
                size="small"
                v-model="form.reserveCarProcId"
                placeholder="约车阶段"
                othername="reserveCarProc"
              />
            </el-form-item>

            <el-form-item label="受理日期" prop="acceptDate">
              <el-date-picker
                v-model="form.acceptDate"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="日历选择"
              >
              </el-date-picker>
            </el-form-item>

            <el-form-item label="模拟器教练" prop="simulatorCoachId">
              <jaya-select
                type="L"
                :parameter="getSub1"
                v-model="form.simulatorCoachId"
                placeholder="模拟器教练"
              ></jaya-select>
            </el-form-item>

            <el-form-item label="推荐人" prop="recommentname">
              <el-input
                v-model="form.recommentname"
                size="small"
                placeholder="学员扫教练码生成"
                disabled
              />
            </el-form-item>
            <el-form-item label="科目二教练" prop="subTwoCoachId">
              <jaya-select
                type="L"
                :parameter="getSub2"
                v-model="form.subTwoCoachId"
                placeholder="选择科目二教练"
              ></jaya-select>
            </el-form-item>

            <el-form-item label="科目三教练" prop="subThreeCoachId">
              <jaya-select
                type="L"
                :parameter="getSub3"
                v-model="form.subThreeCoachId"
                placeholder="选择科目三教练"
              ></jaya-select>
            </el-form-item>

            <el-form-item label="备注" prop="memo">
              <el-input
                v-model="form.memo"
                style="width: 100%"
                type="textarea"
                :rows="2"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
          </el-form>

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
        <!-- </el-dialog> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  studentPageList,
  addPage,
  updatePage,
  removePage,
  importPage,
  exportPage,
  uploadPhoto,
  classtypePage,
  studentGetCode,
  studentInfo,
  carSimple,
} from "@/api/cloud/studentmanagement";
import { Loading } from "element-ui";
const column = function () {
  return [
    {
      title: "姓名",
      prop: "name",
    },
    {
      title: "身份证",
      prop: "idCard",
      width: "200",
    },
    {
      title: "联系电话",
      prop: "telephone",
    },
    {
      title: "所属驾校",
      prop: "schoolname",
    },
    {
      title: "推荐人",
      prop: "recommentname",
    },
    {
      title: "科二教练",
      prop: "coahtwoname",
    },
    {
      title: "科三教练",
      prop: "coachthreename",
    },
    {
      title: "学车进度",
      prop: "learnProcId",
      status: () => {
        return "learnProc";
      },
    },
    {
      title: "报名日期",
      prop: "signUpDate",
      width: "200",
    },
  ];
};
export default {
  name: "studentmanagement",
  data() {
    return {
      column: column.call(this),
      headers: { Authorization: `Bearer ${getToken("Admin-Token")}` },
      action: this.baseApi,
      visible: false,
      form: {},
      // 弹出层标题
      title: "",
      tableList: [],
      importData: {},
      uploadImgData: {},
      option: {
        isRadio: true,
      },
      sujectOptions: [],
      learningOptions: [],
      opinionOptions: [
        {
          value: "1",
          label: "非本校学员",
        },
        {
          value: "2",
          label: "身份信息不完整",
        },
        {
          value: "3",
          label: "其它",
        },
      ],
      statusOptions: [
        {
          value: "0",
          label: "未认证",
        },
        {
          value: "1",
          label: "认证中",
        },
        {
          value: "2",
          label: "未通过",
        },
        {
          value: "3",
          label: "已认证",
        },
      ],
      passOptions: [
        {
          value: 0,
          label: "未审核",
        },
        {
          value: 1,
          label: "通过",
        },
        {
          value: 2,
          label: "不通过",
        },
      ],
      classTypeIdOptions: [],
      carTypeOptions: [],
      // 数据
      data: [],
      // 总条数
      total: 0,
      // table入参
      querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      date: [
        // this.parseTime(new Date(), "{y}-{m}-{d}"),
        // this.parseTime(new Date(), "{y}-{m}-{d}"),
      ],
      operating: 0, //1 添加 2 编辑 3详情
      imageUrl: "",
      dialogImageUrl: "",
      typeOptions: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      insuranceOptions: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      studentOptions: [
        {
          value: 1,
          label: "是",
        },
        {
          value: 0,
          label: "否",
        },
      ],
      loadingInstance: null,
      // table Loading框
      tableLoading: false,
      open: false,
      examineOpen: false,
      // options: [],
      multipleSelection: null,
      accept: ".jpg,.jpeg,.png,.bmp", //图片格式
      rules: {
        idCard: [
          { required: true, trigger: "blur", message: "必填项" },
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
          },
        ],
        name: [{ required: true, trigger: "blur", message: "必填项" }],
        telephone: [
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
          },
          { required: true, trigger: "blur", message: "必填项" },
        ],
        drvSchoolId: [{ required: true, trigger: "blur", message: "必填项" }],
        signUpPrice: [
          {
            pattern: /(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/,
            message: "请输入正确的报名价格:整数或者保留两位小数",
          },
        ],
      },
    };
  },
  mounted() {
    this.getTableList();
    classtypePage().then((res) => {
      this.classTypeIdOptions = res;
    });
  },
  computed: {
    getSub1() {
      return this.form.drvSchoolId ? `${this.form.drvSchoolId},` : "";
    },
    getSub2() {
      return this.form.drvSchoolId ? `${this.form.drvSchoolId},2` : "";
    },
    getSub3() {
      return this.form.drvSchoolId ? `${this.form.drvSchoolId},3` : "";
    },
  },
  watch: {
    "queryParams.drvSchoolId": function (drvSchoolId) {
      this.importData = { drvSchoolId };
    },
  },
  methods: {
    //学员编号
    async getCodeStudent() {
      let { data } = await studentGetCode();
      this.$set(this.form, "code", data);
    },

    //列表查询
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      studentPageList({
        ...this.queryParams,
        sigBeginDate: this.date ? this.date[0] : "",
        sigEndDate: this.date ? this.date[1] : "",
      }).then((res) => {
        this.tableList = res.records;
        this.total = Number(res.total);
      });
    },

    // 上传照片回显
    handleAvatarImgSuccess({ code, msg, data }, file) {
      this.loadingInstance.close();
      if (code != 200) {
        this.msgError(msg);
      } else {
        this.imageUrl = data.addr;
        this.form.photoaddr = data.addr;
        this.msgSuccess("上传成功");
      }
    },

    //导入
    handleAvatarFileSuccess({ code, msg }, file) {
      if (code != 200) {
        this.msgError(msg);
      } else {
        this.msgSuccess("导入成功");
      }
    },

    //导入前校验
    // importBeforeUpload() {
    //   if (!this.queryParams.drvSchoolId) {
    //     this.msgWarn("请选择驾校！");
    //     return false;
    //   }
    // },

    //添加
    async handleNewAdd() {
      this.imageUrl = "";
      this.form = {};
      this.resetForm("form");
      this.visible = true;
      await this.getCodeStudent();
      this.operating = 1;
      delete this.uploadImgData.id;
      this.title = "详情";
    },

    //详情
    handleClick() {
      this.resetForm("form");
      this.imageUrl = null;
      if (this.multipleSelection) {
        const { photoaddr, id } = (this.form = this.multipleSelection);
        studentInfo({ id: id }).then(({ data }) => {
          this.operating = 3;
          this.form = data;
          this.imageUrl = photoaddr;
          this.title = "详情";
          this.visible = true;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    //编辑
    updateClick() {
      this.resetForm("form");
      this.imageUrl = null;
      this.form = {};
      if (this.multipleSelection) {
        const { id, photoaddr } = (this.form = { ...this.multipleSelection });
        this.uploadImgData.id = id;
        studentInfo({ id: id }).then(({ data }) => {
          this.operating = 2;
          this.form = data;
          this.imageUrl = photoaddr;
          this.title = "详情";
          this.visible = true;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    /** 提交按钮 */
    // 新增，修改
    submitForm(formNames) {
      this.$refs[formNames].validate((valid) => {
        if (valid) {
          if (this.operating !== 3) {
            this.$refs["form"].validate((valid) => {
              if (valid) {
                if (this.operating == 1) {
                  addPage(this.form).then(() => {
                    this.getTableList();
                    this.msgSuccess("新增成功");
                    this.visible = false;
                  });
                } else {
                  const form = { ...this.form };
                  const filterForm = {};
                  Object.keys(form)
                    .filter((key) => form[key] !== null)
                    .map((key) => {
                      filterForm[key] = form[key];
                    });
                  filterForm.createTime = undefined;
                  filterForm.updateTime = undefined;
                  filterForm.createBy = undefined;
                  filterForm.updateBy = undefined;
                  filterForm.schoolname = undefined;
                  updatePage(filterForm).then(() => {
                    this.getTableList();
                    this.msgSuccess("修改成功");
                    this.visible = false;
                  });
                }
              }
            });
          } else {
            this.visible = false;
          }
        }
      });
    },

    //删除
    deleteClick() {
      if (this.multipleSelection) {
        const { id } = this.multipleSelection;
        this.$confirm("是否确认删除?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return removePage({ id });
          })
          .then(() => {
            this.getTableList();
            this.msgSuccess("删除成功");
          })
          .catch(() => {});
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    //取消
    cancel() {
      // this.open = false;
      this.examineOpen = false;
    },

    //审核
    toExamine() {
      this.examineOpen = true;
      this.title = "审核";
    },

    //导出学员
    handleDownClick() {
      const loading = this.$loading({
        lock: true,
        text: "正在导出...",
        spinner: "el-icon-loading",
      });
      exportPage({ ...this.queryParams, pageSize: 999999999 })
        .then((res) => {
          const link = document.createElement("a");
          const blob = new Blob([res], { type: "application/vnd.ms-excel" });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, "学员信息.xls");
            return;
          }
          link.style.display = "none";
          //设置连接
          link.href = URL.createObjectURL(blob);
          link.download = "学员信息";
          document.body.appendChild(link);
          //模拟点击事件
          link.click();

          loading.close();
          this.getTableList();
          this.msgSuccess("导出成功");
        })
        .catch((err) => {
          loading.close();
        });
    },
    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
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

.timepick-width-prepend {
  align-items: center;
  .prepend-text {
    background: #f5f7fa;
    color: #909399;
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    height: 40px;
    cursor: default;
    display: inline-flex;
    :focus,
    :hover {
      border-color: #dcdfe6 !important;
    }
  }

  .prepend-text:focus,
  .prepend-text:hover {
    border-color: #dcdfe6 !important;
  }
  .el-input__inner {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
  }
}

.el-select .el-input {
  width: 130px;
}

/deep/ .el-dialog__title {
  margin: auto;
  display: block;
  text-align: center;
}

.boxStu {
  .styleStu {
    float: left;
  }
  .styleSh {
    float: right;
    width: 710px;
    padding-left: 40px;
  }

  .editText {
    color: #ff9650;
    position: fixed;
    padding-top: 20px;
    padding-left: 20px;
  }

  .editTextYijian {
    color: #38bf91;
    position: fixed;
    padding-top: 20px;
    padding-left: 20px;
  }
  .el-textarea {
    padding-top: 20px;
    padding-left: 20px;
    width: 520px;
  }

  #circle {
    width: 6px;
    height: 6px;
    background: #e2e7ed;
    -moz-border-radius: 60px;
    -webkit-border-radius: 60px;
    border-radius: 60px;
    margin-left: 16px;
  }

  #circle-two {
    position: fixed;
    width: 6px;
    height: 6px;
    background: #e2e7ed;
    -moz-border-radius: 60px;
    -webkit-border-radius: 60px;
    border-radius: 60px;
    margin-top: 290px;
    margin-left: 15px;
  }

  .find-div-body {
    position: relative;
    // top:30px;
    left: 1px;
    height: 80px;
    width: 650px;
    padding: 8px;
    background-color: #f7f7f8;
    border: #dee0e3 solid 1px;
    border-radius: 3px;
    margin-top: 30px;
  }

  .find-div-body:before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 23px;
    left: -16px;
    padding: 0;
    border-right: 8px solid #f7f7f8;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    display: block;
    content: "";
    z-index: 12;
  }

  .find-div-body:after {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 22px;
    left: -18px;
    padding: 0;
    border-right: 9px solid #cccccc;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 9px solid transparent;
    display: block;
    content: "";
    z-index: 10;
  }

  .find-div-body-two {
    position: relative;
    top: 30px;
    left: 1px;
    height: 142px;
    width: 650px;
    padding: 8px;
    background-color: #f7f7f8;
    border: #dee0e3 solid 1px;
    border-radius: 3px;
  }

  .find-div-body-two:before {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 23px;
    left: -16px;
    padding: 0;
    border-right: 8px solid #f7f7f8;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
    border-left: 8px solid transparent;
    display: block;
    content: "";
    z-index: 12;
  }

  .find-div-body-two:after {
    box-sizing: content-box;
    width: 0px;
    height: 0px;
    position: absolute;
    top: 22px;
    left: -18px;
    padding: 0;
    border-right: 9px solid #cccccc;
    border-top: 9px solid transparent;
    border-bottom: 9px solid transparent;
    border-left: 9px solid transparent;
    display: block;
    content: "";
    z-index: 10;
  }
}

.img-box {
  justify-content: space-between;
  flex-wrap: wrap;
  float: right;
  width: 25%;
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
    font-size: 16px;
    color: #999999;
    padding: 0px;
    width: 500px;
    height: 140px;
    text-align: center;
    display: table-cell;
    vertical-align: middle;
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

/deep/.el-dialog__body {
  position: relative;
}

.hrshow {
  position: absolute;
  width: 1px;
  height: 75%;
  background: #e2e7ed;
  left: 43px;
}

/deep/.el-tooltip {
  .el-button {
    background: #49bbc5;
    border-radius: 16px;
    color: white;
    padding: 4px 15px;
  }
}

.formShowInfo {
  justify-content: space-between;
  flex-wrap: wrap;
  width: 75%;
  position: relative;
  /deep/ .el-form-item {
    width: calc(50% - 25px);
    .el-form-item__content {
      width: calc(100% - 140px);
      .el-select--small {
        width: 100%;
      }
    }
  }
}

.table-box-con {
  position: relative;
  .manTotal {
    font-size: 22px;
    color: #333333;
    margin-right: 20px;
  }
  .btnStu {
    background-color: #fff;
    color: #000;
    border-color: #b1b4ba;
    position: absolute;
    right: 9px;
  }
  .btnStuBtn {
    background-color: #fff;
    color: #000;
    border-color: #b1b4ba;
  }
  .btnStuBtn:focus {
    color: #49bbc5;
    border-color: #49bbc5;
  }
  .btnStu:focus {
    color: #49bbc5;
    border-color: #49bbc5;
  }
}

.avatar-uploader-file {
  position: absolute;
  top: 10px;
  right: 110px;
}
</style>
