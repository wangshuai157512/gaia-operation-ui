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
          v-model="queryParams.schoolId"
          :parameter="JSON.stringify(querySelect)"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
      <el-form-item prop="keyword">
        <el-input
          size="small"
          v-model="queryParams.name"
          placeholder="请输入姓名"
          style="width: 200px !important"
          clearable
        >
          <template slot="prepend">姓名</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="telephone">
        <el-input
          size="small"
          v-model="queryParams.telephone"
          placeholder="请输入手机号"
          style="width: 300px !important"
          clearable
        >
          <template slot="prepend">手机号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="idCard">
        <el-input
          size="small"
          v-model="queryParams.idCard"
          placeholder="请输入身份证号"
          style="width: 300px !important"
          clearable
        >
          <template slot="prepend">身份证号</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="keyword">
        <el-button @click="getTableList(1)" icon="el-icon-search" type="primary"
          >查询</el-button
        >
      </el-form-item>
      <!-- <el-form-item class="fun-btn-right">
        <el-button
          @click="handleNewAdd"
          icon="el-icon-plus"
          size="small"
          type="primary"
          >添加</el-button
        >
        <el-button size="small" @click="importCoach" type="primary"
          >导入学员</el-button
        >
        <el-button size="small" @click="exportCoach" type="primary"
          >导出学员</el-button
        >
      </el-form-item> -->
    </el-form>
    <div class="table-box-con">
      <div class="table-top-btn">
        <div class="table-top-btn-l">
          <div class="sum">总人数：{{ total }}</div>
          <el-button
            type="primary"
            @click="handleNewAdd"
            icon="el-icon-plus"
            v-hasPermi="['coach:add']"
            >添加</el-button
          >
          <el-button
            icon="el-icon-view"
            type="info"
            @click="detail"
            v-hasPermi="['coach:info']"
            >查看</el-button
          >
          <el-button
            icon="el-icon-edit"
            type="warning"
            @click="edit"
            v-hasPermi="['coach:update']"
            >编辑</el-button
          >
          <el-button
            icon="el-icon-delete"
            type="danger"
            @click="delet"
            v-hasPermi="['coach:delete']"
            >删除</el-button
          >
          <el-button
            icon="el-icon-check"
            type="success"
            @click="car"
            v-hasPermi="['coach:relate']"
            >分配设备</el-button
          >
        </div>
        <!-- <div class="table-top-btn-r">
          <el-button @click="importCoach" round>导入</el-button>
          <el-button @click="exportCoach" round>导出</el-button>
        </div> -->
      </div>
      <jaya-table-group
        :total="total"
        :tableHeaderList="column"
        :tableList="tableData"
        @pagination="getTableList"
        :option="option"
        @handleCurrentChange="handleCurrentChange"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        v-show="!visible"
      ></jaya-table-group>
    </div>
    <!-- 添加 -->
    <div class="custom-dialog" v-if="visible">
      <div class="custom-dialog-con">
        <div class="opear-box">
          <el-form
            ref="form"
            :model="form"
            :rules="rules"
            :inline="true"
            label-width="160px"
            :disabled="operating == 3"
          >
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.name" placeholder="请输入" size="small" />
            </el-form-item>
            <el-form-item label="教练编号" prop="no">
              <el-input
                v-model="form.no"
                placeholder="系统自动生成"
                size="small"
                disabled
              />
            </el-form-item>
            <el-form-item label="身份证" prop="idCard">
              <el-input
                v-model="form.idCard"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone">
              <el-input
                v-model="form.telephone"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="所属驾校" prop="drvSchoolId">
              <jaya-select
                type="SS"
                v-model="form.drvSchoolId"
                :parameter="JSON.stringify({})"
                placeholder="请选择"
              ></jaya-select>
            </el-form-item>
            <el-form-item label="推荐码" prop="recommendCode">
              <el-input
                v-model="form.recommendCode"
                placeholder="系统自动生成"
                size="small"
                disabled
              />
            </el-form-item>
            <!-- <el-form-item label="保险" prop="dictType">
              <el-select v-model="form.sykm" placeholder="请选择" size="small">
                <el-option
                  v-for="item in formList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item> -->
            <el-form-item label="职业资格等级" prop="professionLevel">
              <el-select
                v-model="form.professionLevel"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in professionLevelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="职业资格证号" prop="professionCertificate">
              <el-input
                v-model="form.professionCertificate"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="驾驶证号" prop="drivingLicence">
              <el-input
                v-model="form.drivingLicence"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <!-- <el-form-item label="准驾车型" prop="drvCarType">
              <el-input
                v-model="form.drvCarType"
                placeholder="请输入"
                size="small"
              />
            </el-form-item> -->
            <el-form-item label="驾驶证初领日期" prop="drivingLicenceDate">
              <el-date-picker
                size="small"
                value-format="yyyy-MM-dd"
                v-model="form.drivingLicenceDate"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="每日机器人教练时限" prop="goldCoachLimit">
              <el-input
                v-model="form.goldCoachLimit"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="每日智能模拟器时限" prop="jaxLimit">
              <el-input
                v-model="form.jaxLimit"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item label="教练状态" prop="status">
              <el-select
                v-model="form.status"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in statusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="是否绑定微信" prop="bindWx">
              <el-select
                v-model="form.bindWx"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in bindWxList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="教练简介" prop="brief" style="width: 100%">
              <el-input
                v-model="form.brief"
                type="textarea"
                :rows="3"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
            <el-form-item
              label="准驾车型"
              prop="drvCarType"
              style="width: 100%"
            >
              <el-checkbox-group v-model="drvCarType">
                <el-checkbox
                  v-for="item in carTypeList"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="准教车型" prop="carType" style="width: 100%">
              <el-checkbox-group v-model="carType">
                <el-checkbox
                  v-for="item in carTypeList"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="所教科目" prop="teachSub" style="width: 100%">
              <el-checkbox-group v-model="teachSub">
                <el-checkbox
                  v-for="item in teachSubList"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="家庭住址" prop="addr" style="width: 100%">
              <el-input v-model="form.addr" placeholder="请输入" size="small" />
            </el-form-item>
            <el-form-item label="备注" prop="remark" style="width: 100%">
              <el-input
                v-model="form.remark"
                placeholder="请输入"
                size="small"
              />
            </el-form-item>
          </el-form>
          <div class="photo-box">
            <el-upload
              :accept="accept"
              :before-upload="(file) => verifyAccept(file, accept)"
              :headers="token"
              :action="baseApi + 'api/public/file/uploadImage'"
              name="image"
              :show-file-list="false"
              :on-success="handleSuccess"
              :disabled="operating === 3"
            >
              <img v-if="imageUrl" :src="baseUrl + imageUrl" class="avatar" />
              <i v-else class="avatar-uploader-icon">
                <img src="../../../assets/images/photoUpload.png" alt="" />
              </i>
            </el-upload>
            <div class="code">
              <canvas ref="stage"></canvas>
            </div>
          </div>
          <div class="btn">
            <el-button type="primary" @click="handleSure" v-if="operating !== 3"
              >确 定</el-button
            >
            <el-button @click="visible = false">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 分配设备 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="openCar"
      width="1070px"
      append-to-body
      class="allocation-dialog"
    >
      <el-form
        class="dialogForm"
        :model="formCar"
        ref="formCar"
        :inline="true"
        :rules="rules"
      >
        <el-form-item style="width: 100%">
          <div class="allocation-title">分配机器人教练车辆</div>
          <el-checkbox
            :indeterminate="isIndeterminateCar"
            v-model="checkAllCar"
            @change="handleCheckAllCarChange"
            class="all-check"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="goodCoachIds"
            @change="handleCheckedCarChange"
            class="check-car"
          >
            <el-checkbox
              v-for="item in goodCoachList"
              :label="item.value"
              :key="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="width: 100%">
          <div class="allocation-title">分配智能模拟器</div>
          <el-checkbox
            :indeterminate="isIndeterminateSimulator"
            v-model="checkAllSimulator"
            @change="handleCheckAllSimulatorChange"
            class="all-check"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="simulatorIds"
            @change="handleCheckedSimulatorChange"
            class="check-simulator"
          >
            <el-checkbox
              v-for="item in simulatorList"
              :label="item.value"
              :key="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="width: 100%">
          <div class="allocation-title">分配易学通</div>
          <el-checkbox
            :indeterminate="isIndeterminateYxt"
            v-model="checkAllYxt"
            @change="handleCheckAllYxtChange"
            class="all-check"
            >全选</el-checkbox
          >
          <el-checkbox-group
            v-model="yxtIds"
            @change="handleCheckedYxtChange"
            class="check-simulator"
          >
            <el-checkbox
              v-for="item in yxtList"
              :label="item.value"
              :key="item.value"
              >{{ item.label }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSureCar">确 定</el-button>
        <el-button @click="openCar = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 查看评价 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="openEvaluate"
      append-to-body
      fullscreen
    >
      <el-form :model="queryParamsDialog" ref="queryFormDialog" :inline="true">
        <el-form-item>
          <jaya-select
            type="ST"
            :parameter="JSON.stringify({})"
            v-model="queryParamsDialog.studentId"
            placeholder="评价人"
            clearable
          ></jaya-select>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            @click="getTableListDialog(1)"
            icon="el-icon-search"
            type="primary"
            >搜索</el-button
          >
        </el-form-item>
      </el-form>
      <jaya-table-group
        :total="total"
        :tableHeaderList="columnDialog"
        :tableList="tableDataDialog"
        @pagination="getTableListDialog"
        :page.sync="queryParamsDialog.pageNum"
        :limit.sync="queryParamsDialog.pageSize"
      ></jaya-table-group>
    </el-dialog>
  </div>
</template>

<script>
import {
  coachCode,
  coachRecommendCode,
  coachPageList,
  coachAdd,
  coachEdit,
  coachInfo,
  coachRemove,
  coachEvaluateList,
  coachRelateList,
  coachRelate,
} from "@/api/cloud/coachManagement";
import { getDictSelect } from "@/api/param/select";
import { getToken } from "@/utils/auth";
import QRCode from "qrcode";
const column = function () {
  return [
    {
      title: "姓名",
      prop: "name",
      width: "130",
    },
    {
      title: "身份证",
      prop: "idCard",
    },
    {
      title: "联系电话",
      prop: "telephone",
    },
    {
      title: "推荐码",
      prop: "recommendCode",
      width: "200",
    },
    {
      title: "微信状态",
      prop: "bindWx",
      width: "200",
      status: () => {
        return this.bindWxList;
      },
    },
    {
      title: "操作",
      width: "120",
      type: "buttons",
      fixed: "right",
      butList: [
        {
          title: "查看评价",
          size: "mini",
          onClick: this.lookEvaluate,
          //   auth: ["safety:auth:user:edit"],
        },
      ],
    },
  ];
};
const columnDialog = function () {
  return [
    {
      title: "评价学员",
      prop: "createRealName",
      width: "130",
    },
    {
      title: "服务态度",
      prop: "serveAttitude",
      type: "star",
      width: "180",
    },
    {
      title: "专业度",
      prop: "prefessionalLevel",
      type: "star",
      width: "180",
    },
    {
      title: "日期",
      prop: "createTime",
      width: "200",
    },
    {
      title: "评价内容",
      prop: "memo",
    },
  ];
};
export default {
  name: "coachManagement",
  data() {
    return {
      token: { Authorization: "Bearer " + getToken() },
      baseUrl: process.env.VUE_APP_BASE_URL,
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      column: column.call(this),
      sujectOptions: [],
      tableData: [{ userName: "13231" }],
      option: {
        isRadio: true,
      },
      activeRow: {},
      bindWxList: [
        {
          label: "是",
          value: "1",
        },
        {
          label: "否",
          value: "0",
        },
      ],
      visible: false,
      operating: 0,
      title: "",
      querySelect: {
        provinceId: "",
        cityId: "",
        countyId: "",
        hasSubSchool: true,
      },
      form: {},
      imageUrl: "",
      bindWxList: [
        {
          label: "是",
          value: 1,
        },
        {
          label: "否",
          value: 0,
        },
      ],
      statusList: [
        {
          label: "离职",
          value: 1,
        },
        {
          label: "在职",
          value: 0,
        },
      ],
      professionLevelList: [
        {
          label: "一级",
          value: 1,
        },
        {
          label: "二级",
          value: 2,
        },
        {
          label: "三级",
          value: 3,
        },
      ],
      teachSubList: [],
      teachSub: [], //选中项
      carTypeList: [],
      carType: [], //选中项
      drvCarType: [], //准驾车型选中项
      dialogImageUrl: "",
      dialogVisible: false,
      loadingInstance: null,
      openCar: false,
      formCar: {},
      checkAllCar: false,
      checkAllSimulator: false,
      checkAllYxt: false,
      goodCoachIds: [], // 选中项
      goodCoachList: [], //展示项
      simulatorIds: [], // 选中项
      simulatorList: [], //展示项
      yxtIds: [], // 选中项
      yxtList: [], //展示项
      isIndeterminateCar: true,
      isIndeterminateSimulator: true,
      isIndeterminateYxt: true,
      openEvaluate: false,
      totalDialog: 0,
      queryParamsDialog: {
        pageNum: 1,
        pageSize: 20,
      },
      tableDataDialog: [{ realName: 4, sex: 5 }],
      columnDialog: columnDialog.call(this),
      accept: ".jpg,.jpeg,.png,.bmp", //图片格式
      rules: {
        name: [{ required: true, message: "必填项", trigger: "change" }],
        idCard: [
          {
            required: true,
            pattern:
              /^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/,
            message: "请输入正确身份证号",
            trigger: "change",
          },
        ],
        telephone: [
          {
            required: true,
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确手机号",
            trigger: "change",
          },
        ],
        drivingLicence: [
          {
            required: true,
            pattern: /^[0-9]*$/,
            message: "请输入数字",
            trigger: "change",
          },
        ],
        professionCertificate: [
          { pattern: /^[0-9]*$/, message: "请输入数字", trigger: "change" },
        ],
        jaxLimit: [
          {
            pattern: /^(([1-9])|(1\d)|(2[0-4]))$/,
            message: "请输入小于24小时",
            trigger: "change",
          },
        ],
        goldCoachLimit: [
          {
            pattern: /^(([1-9])|(1\d)|(2[0-4]))$/,
            message: "请输入小于24小时",
            trigger: "change",
          },
        ],
        drvSchoolId: [
          {
            required: true,
            message: "必填项",
            trigger: "blur",
          },
        ],
      },
      code: {
        data: "",
        type: 3,
      },
    };
  },
  mounted() {
    this.getCoachSubjectList();
    this.getCarTypeList();
    this.getTableList();
  },
  methods: {
    //获取教练编号
    async getCoachCode() {
      let { data } = await coachCode();
      this.$set(this.form, "no", data);
      this.$set(this.code, "data", data);
    },
    //获取推荐码
    async getCoachRecommendCode() {
      let { data } = await coachRecommendCode();
      this.$set(this.form, "recommendCode", data);
    },
    // 生成二维码
    createCode() {
      this.$nextTick(() => {
        QRCode.toCanvas(this.$refs.stage, JSON.stringify(this.code), {
          height: 234,
          width: 234,
        });
      });
    },
    //获取科目
    getCoachSubjectList() {
      getDictSelect("course").then((res) => {
        this.teachSubList = res.data;
      });
    },
    // 获取准教车型
    getCarTypeList() {
      getDictSelect("exam_car_type").then((res) => {
        this.carTypeList = res.data;
      });
    },
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      coachPageList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = res.total;
      });
    },
    // 点击单选获取当前行
    handleCurrentChange(row) {
      this.activeRow = row;
    },
    // 上传照片
    handleSuccess(response) {
      this.loadingInstance.close();
      if (response.code == 200) {
        this.imageUrl = response.data;
        this.msgSuccess("上传成功");
      } else {
        this.msgError("上传失败");
      }
    },
    // 新增
    async handleNewAdd() {
      this.form = {};
      await this.getCoachCode();
      await this.getCoachRecommendCode();
      this.operating = 1;
      this.imageUrl = "";
      this.teachSub = [];
      this.carType = [];
      this.drvCarType = [];
      this.resetForm("form");
      this.visible = true;
      this.createCode();
    },
    // 编辑
    async edit() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.teachSub = [];
      this.carType = [];
      this.drvCarType = [];
      this.resetForm("form");
      this.operating = 2;
      let { no, recommendCode } = this.form;
      this.form = { no, recommendCode, id: this.activeRow.id };
      await this.getInfo();
      this.visible = true;
      this.createCode();
    },
    // 详情
    async detail() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      this.teachSub = [];
      this.carType = [];
      this.drvCarType = [];
      this.resetForm("form");
      this.operating = 3;
      await this.getInfo();
      this.visible = true;
      this.createCode();
    },
    // 获取详情数据
    async getInfo() {
      let { data } = await coachInfo({ id: this.activeRow.id });
      this.form = { ...this.form, ...data };
      this.code.data = this.form.recommendCode;
      if (data.teachSub) {
        this.teachSub = data.teachSub.split(",");
      }
      if (data.carType) {
        this.carType = data.carType?.split(",");
      }
      if (data.drvCarType) {
        this.drvCarType = data.drvCarType?.split(",");
      }
      this.imageUrl = data.photo;
    },
    // 提交教练列表
    handleSure() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          this.form.carType = this.carType + "";
          this.form.teachSub = this.teachSub + "";
          this.form.drvCarType = this.drvCarType + "";
          this.form.photo = this.imageUrl;
          if (this.operating === 1) {
            let { data } = await coachAdd(this.form);
            this.getTableList();
            this.msgSuccess("新增成功");
            this.visible = false;
          } else {
            let { data } = await coachEdit(this.form);
            this.getTableList();
            this.msgSuccess("修改成功");
            this.visible = false;
          }
        }
      });
    },
    // 删除
    delet() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      let { id } = this.activeRow;
      this.$confirm(`确定要删除此教练信息`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        let { data } = await coachRemove({ id });
        this.getTableList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },

    // 分配机器人教练车辆
    handleCheckAllCarChange(val) {
      let allList = this.goodCoachList.map((item) => {
        return item.value;
      });
      this.goodCoachIds = val ? allList : [];
      this.isIndeterminateCar = false;
    },
    handleCheckedCarChange(value) {
      let checkedCount = value.length;
      this.checkAllCar = checkedCount === this.goodCoachList.length;
      this.isIndeterminateCar =
        checkedCount > 0 && checkedCount < this.goodCoachList.length;
    },
    // 分配智能模拟器
    handleCheckAllSimulatorChange(val) {
      let allList = this.simulatorList.map((item) => {
        return item.value;
      });
      this.simulatorIds = val ? allList : [];
      this.isIndeterminateSimulator = false;
    },
    handleCheckedSimulatorChange(value) {
      let checkedCount = value.length;
      this.checkAllSimulator = checkedCount === this.simulatorList.length;
      this.isIndeterminateSimulator =
        checkedCount > 0 && checkedCount < this.simulatorList.length;
    },
    // 分配易学通
    handleCheckAllYxtChange(val) {
      let allList = this.yxtList.map((item) => {
        return item.value;
      });
      this.yxtIds = val ? allList : [];
      this.isIndeterminateYxt = false;
    },
    handleCheckedYxtChange(value) {
      let checkedCount = value.length;
      this.checkAllYxt = checkedCount === this.yxtList.length;
      this.isIndeterminateYxt =
        checkedCount > 0 && checkedCount < this.yxtList.length;
    },

    // 分配设备
    async car() {
      if (JSON.stringify(this.activeRow) === "{}" || !this.activeRow) {
        this.$message({ message: "请先选择数据", type: "warning" });
        return;
      }
      let { id, drvSchoolId } = this.activeRow;
      let { data } = await coachRelateList({ coachId: id, drvSchoolId });
      // 选中项
      this.goodCoachIds = data.goldCoachList.map((item) => {
        if (item.selected) {
          return item.value;
        }
      });
      this.goodCoachIds = this.goodCoachIds.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.goodCoachList = data.goldCoachList;
      // 选中项
      this.simulatorIds = data.simulatorList.map((item) => {
        if (item.selected) {
          return item.value;
        }
      });
      this.simulatorIds = this.simulatorIds.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.simulatorList = data.simulatorList;
      // 选中项
      this.yxtIds = data.yxtList.map((item) => {
        if (item.selected) {
          return item.value;
        }
      });
      this.yxtIds = this.yxtIds.filter((item) => {
        if (item) {
          return item;
        }
      });
      this.yxtList = data.yxtList;
      this.openCar = true;
    },
    // 提交分配设备
    handleSureCar() {
      let queryCar = {
        coachId: this.activeRow.id,
        goodCoachIds: this.goodCoachIds,
        simulatorIds: this.simulatorIds,
        yxtIds: this.yxtIds,
      };
      coachRelate(queryCar).then((res) => {
        this.msgSuccess("分配成功");
        this.getTableList();
        this.openCar = false;
      });
    },
    lookEvaluate(row) {
      this.activeRow = row;
      this.title = "评价";
      this.openEvaluate = true;
      this.getTableListDialog();
    },
    getTableListDialog(num) {
      if (num === 1) {
        this.queryParamsDialog.pageNum = num;
      }
      coachEvaluateList({
        ...this.queryParamsDialog,
        coachId: this.activeRow.id,
      }).then((res) => {
        this.tableDataDialog = res.records;
        this.totalDialog = res.total;
      });
    },
  },
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
.custom-dialog {
  .opear-box {
    display: flex;
    justify-content: space-between;
    position: relative;
    .el-form {
      width: calc(100% - 234px);
      // width: 80%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        width: 46%;
        margin-right: 0;
        /deep/.el-form-item__content {
          width: calc(100% - 160px);
          .el-input__inner {
            width: 100%;
          }
          .el-input,
          .el-select {
            width: 100%;
          }
          .el-textarea {
            width: 100%;
          }
        }
      }
      .detailArea {
        /deep/.el-form-item__content {
          // width: 84%;
          // width: calc(100% - 114px);
          .ganged {
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            margin-bottom: 24px;
            /deep/.jaya-select {
              width: 30%;
              .el-select {
                width: 100%;
              }
            }
          }
          .resultArea {
            width: 80%;
          }
        }
      }
    }
    .photo-box {
      width: 234px;
      margin-left: 36px;
      .code {
        margin-top: 30px;
        img {
          width: 234px;
          height: 234px;
        }
      }

      .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .avatar-uploader .el-upload:hover {
        border-color: #409eff;
      }
      /deep/ .el-upload--text {
        font-size: 28px;
        color: #8c939d;
        width: 234px;
        height: 234px;
        line-height: 234px;
        text-align: center;
        background: #ebecef;
      }
      .avatar {
        width: 234px;
        height: 234px;
        display: block;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  .all-item {
    /deep/.el-form-item__content {
      width: calc(100% - 153px) !important;
    }
  }
}

.allocation-dialog {
  .el-dialog__header {
    display: none;
  }
  /deep/.el-form-item__content {
    width: 1037px;
  }
  .el-form-item {
    border-bottom: 1px dashed #c5cccc;
  }
  .allocation-title {
    display: inline-block;
    vertical-align: middle;
    font-size: 22px;
    color: #000;
    margin-right: 20px;
  }
  .all-check {
    display: inline-block;
    vertical-align: middle;
  }
  .el-checkbox {
    margin-right: 20px;
  }
  .check-car {
    padding-bottom: 30px;
    height: 260px;
    overflow-y: auto;
    /deep/.el-checkbox__inner {
      width: 150px;
      height: 100px;
      border: 0;
      background: url("../../../assets/images/coachCarNormal.png") no-repeat
        center center;
      margin-top: 20px;
    }
    /deep/.el-checkbox__label {
      padding-left: 0;
      position: absolute;
      left: 50%;
      top: 80%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    /deep/.is-checked {
      .el-checkbox__inner {
        background: url("../../../assets/images/coachCarCheck.png") no-repeat
          center center;
      }
      .el-checkbox__inner::after {
        width: 0;
        height: 0;
        border: 0;
      }
    }
  }
  .check-simulator {
    padding-bottom: 30px;
    height: 260px;
    overflow-y: auto;
    /deep/.el-checkbox__inner {
      width: 80px;
      height: 100px;
      border: 0;
      background: url("../../../assets/images/coachSimulatorNormal.png")
        no-repeat center center;
      margin-top: 20px;
    }
    /deep/.el-checkbox__label {
      padding-left: 0;
      position: absolute;
      left: 50%;
      top: 80%;
      transform: translate(-50%, -50%);
      z-index: 2;
    }
    /deep/.is-checked {
      .el-checkbox__inner {
        background: url("../../../assets/images/coachSimulatorCheck.png")
          no-repeat center center;
      }
      .el-checkbox__inner::after {
        width: 0;
        height: 0;
        border: 0;
      }
    }
  }
}
</style>
