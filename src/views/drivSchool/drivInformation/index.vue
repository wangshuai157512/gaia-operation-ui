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
      <el-form-item prop="name">
        <el-input
          size="small"
          v-model="queryParams.name"
          placeholder="请输入名称"
          style="width: 230px !important"
          clearable
        >
          <template slot="prepend">名称</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="nameAuthAuditStatus">
        <el-select
          size="small"
          v-model="queryParams.auditStatus"
          placeholder="状态"
          style="width: 120px !important"
          clearable
        >
          <el-option
            v-for="status in statusList"
            :key="status.value"
            :label="status.label"
            :value="status.value"
          />
        </el-select>
      </el-form-item>
      <el-button class="fun-btn-right" @click="getTableList(1)" type="primary"
        >查询</el-button
      >
    </el-form>
    <div class="table-box-con">
      <!-- 主校信息 -->
      <!-- <div class="campus-school" >
        <img src="" alt="" />
        <el-button type="success" round>编辑</el-button>
        <el-button type="info" round>查看</el-button>
        <div class="campus-school-imfor">
          <div class="campus-school-item">
            <h5>驾校名称：</h5>
            <p>重庆市川培汽车驾驶培训有</p>
          </div>
          <div class="campus-school-item">
            <h5>驾校地址：</h5>
            <p>重庆市川培汽车驾驶培训有</p>
          </div>
          <div class="campus-school-item">
            <h5>联系人：</h5>
            <p>重庆市川培汽车驾驶培训有</p>
          </div>
          <div class="campus-school-item">
            <h5>联系电话：</h5>
            <p>重庆市川培汽车驾驶培训有</p>
          </div>
        </div>
      </div> -->
      <!-- 分校信息 -->
      <div class="branch-school">
        <div class="table-top-btn">
          <div class="table-top-btn-l">
            <el-button
              v-hasPermi="['school:add']"
              icon="el-icon-plus"
              type="primary"
              @click="addSchool"
              >添加驾校</el-button
            >
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="addOtherSchool"
              v-hasPermi="['school:sub:add']"
              >添加分校</el-button
            >
            <el-button
              icon="el-icon-plus"
              type="success"
              @click="addArea"
              v-hasPermi="['school:point:add']"
              >添加报名点</el-button
            >
            <el-button
              icon="el-icon-view"
              type="info"
              @click="detail"
              v-hasPermi="['school:info']"
              >查看详情</el-button
            >
            <el-button
              icon="el-icon-edit"
              type="warning"
              @click="edit"
              v-hasPermi="['school:update']"
              >编辑</el-button
            >
            <el-button
              icon="el-icon-delete"
              type="danger"
              @click="delet"
              v-hasPermi="['school:delete']"
              >删除</el-button
            >
          </div>
          <div class="table-top-btn-r">
            <el-button
              round
              @click="handleDownClick"
              v-hasPermi="['school:export']"
              >导出</el-button
            >
            <el-button
              round
              @click="handleDownExt"
              >导出易学通</el-button
            >
          </div>
        </div>

        <jaya-table-group
          :total="total"
          :tableHeaderList="column"
          :tableList="tableData"
          @pagination="getTableList"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          :option="option"
          @handleCurrentChange="handleCurrentChange"
          v-show="!visible"
        ></jaya-table-group>
      </div>
    </div>

    <div class="custom-dialog" v-if="visible">
      <div class="custom-dialog-con">
        <div class="opear-box">
          <el-form
            class="dialogForm"
            :disabled="operating == 3"
            :model="form"
            ref="form"
            :inline="true"
            :rules="rules"
          >
            <el-form-item
              label="驾校"
              prop="countyId"
              class="querySchool all-item"
              style="width: 100%"
            >
              <div class="ganged">
                <jaya-select
                  type="P"
                  v-model="form.provinceId"
                  placeholder="请选择省/市"
                ></jaya-select>
                <jaya-select
                  type="C"
                  v-model="form.cityId"
                  :parameter="form.provinceId"
                  placeholder="请选择市/区"
                ></jaya-select>
                <jaya-select
                  type="T"
                  v-model="form.countyId"
                  :parameter="form.cityId"
                  placeholder="请选择区/县"
                ></jaya-select>
              </div>
            </el-form-item>
            <el-form-item label="名称" prop="name">
              <el-input
                v-model="form.name"
                placeholder="请输入名称"
                size="small"
              />
            </el-form-item>
            <el-form-item label="驾校编号" prop="id">
              <el-input
                v-model="form.id"
                placeholder="系统自动生成"
                size="small"
                disabled
              />
            </el-form-item>
            <el-form-item label="负责人" prop="chargePerson">
              <el-input
                v-model="form.chargePerson"
                placeholder="请输入负责人"
                size="small"
              />
            </el-form-item>
            <el-form-item label="营业时段1" class="businesTime">
              <el-time-picker
                is-range
                v-model="business1"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item label="联系电话" prop="telephone">
              <el-input
                v-model="form.telephone"
                placeholder="请输入联系电话"
                size="small"
              />
            </el-form-item>
            <el-form-item label="营业时段2" class="businesTime">
              <el-time-picker
                is-range
                v-model="business2"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item label="经营许可证号" prop="licenseNo">
              <el-input
                v-model="form.licenseNo"
                placeholder="请输入设备名称"
                size="small"
              />
            </el-form-item>
            <el-form-item label="营业时段3" class="businesTime">
              <el-time-picker
                is-range
                v-model="business3"
                range-separator="-"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                value-format="HH:mm:ss"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item label="许可时间" prop="licenseTime">
              <el-date-picker
                size="small"
                value-format="yyyy-MM-dd"
                v-model="form.licenseTime"
                type="date"
                placeholder="选择日期"
              />
            </el-form-item>
            <el-form-item label="招生电话" prop="badckssj">
              <el-input
                v-model="form.recruitStudentPhone"
                placeholder="请输入招生电话"
                size="small"
              />
            </el-form-item>
            <el-form-item label="分类等级" prop="level">
              <el-select
                clearable
                v-model="form.level"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in levelList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="驾校邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入驾校邮箱"
                size="small"
              />
            </el-form-item>
            <el-form-item label="经营范围" prop="busScope">
              <jaya-select
                othername="exam_car_type"
                v-model="form.busScope"
                placeholder="经营范围"
                multiple
              ></jaya-select>
            </el-form-item>
            <el-form-item label="驾校状态" prop="status">
              <el-select
                clearable
                v-model="form.status"
                placeholder="请选择"
                size="small"
              >
                <el-option
                  v-for="item in drvStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="驾校简介" style="width: 100%" class="all-item">
              <el-input
                type="textarea"
                rows="3"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="详细地址"
              style="width: 100%"
              class="detailArea"
            >
              <el-input
                v-model="form.address"
                placeholder="请输入"
                size="small"
                style="margin-right: 10px"
              />
              <el-button type="primary" size="small" @click="handleMap"
                >在地图上选择</el-button
              >
            </el-form-item>
            <el-form-item
              label="关键词"
              prop="keyWord"
              style="width: 100%"
              class="all-item"
            >
              <el-input
                v-model="form.keyWord"
                placeholder="请输入关键词"
                size="small"
              />
            </el-form-item>
            <el-form-item
              label="交通路线"
              prop="route"
              style="width: 100%"
              class="all-item"
            >
              <el-input
                v-model="form.route"
                placeholder="请输入交通路线"
                size="small"
              />
            </el-form-item>
            <el-form-item label="服务设施" style="width: 100%">
              <el-checkbox-group v-model="serviceFacility">
                <el-checkbox
                  v-for="item in serverList"
                  :key="item.value"
                  :label="item.value"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-form>
          <div class="photo-box">
            <p>驾校照片</p>
            <el-upload
              :accept="accept"
              :before-upload="(file) => verifyAccept(file, accept)"
              :headers="token"
              :action="baseApi + 'api/public/file/uploadImage'"
              name="image"
              list-type="picture-card"
              :file-list="fileList"
              :on-preview="handlePictureCardPreview"
              :on-remove="handleRemove"
              :on-success="handleSuccess"
              :disabled="operating === 3"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
            <el-dialog
              :visible.sync="dialogVisible"
              :close-on-click-modal="false"
              append-to-body
            >
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
            <!-- </el-form-item> -->
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

    <el-dialog
      :close-on-click-modal="false"
      :title="title"
      :visible.sync="openArea"
      width="820px"
      append-to-body
    >
      <el-form
        class="dialogForm"
        :model="formArea"
        ref="formArea"
        :inline="true"
        :rules="rules"
        :disabled="operingArea === 3"
      >
        <el-form-item
          label="驾校"
          prop="countyId"
          class="querySchool all-item"
          style="width: 100%"
        >
          <div class="ganged">
            <jaya-select
              type="P"
              v-model="formArea.provinceId"
              placeholder="请选择省/市"
              :disabled="formArea.parentId ? true : false"
            ></jaya-select>
            <jaya-select
              type="C"
              v-model="formArea.cityId"
              :parameter="formArea.provinceId"
              placeholder="请选择市/区"
              :disabled="formArea.parentId ? true : false"
            ></jaya-select>
            <jaya-select
              type="T"
              v-model="formArea.countyId"
              :parameter="formArea.cityId"
              placeholder="请选择区/县"
              :disabled="formArea.parentId ? true : false"
            ></jaya-select>
          </div>
        </el-form-item>
        <!-- <el-form-item label="驾校名称" prop="name">
          <el-input size="small" v-model="formArea.old" placeholder="请输入" />
        </el-form-item> -->
        <el-form-item label="报名点名称" prop="name">
          <el-input
            v-model="formArea.name"
            placeholder="请输入报名点名称"
            size="small"
          />
        </el-form-item>
        <el-form-item label="负责人" prop="chargePerson">
          <el-input
            size="small"
            v-model="formArea.chargePerson"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="联系电话" prop="telephone">
          <el-input
            v-model="formArea.telephone"
            placeholder="请输入联系电话"
            size="small"
          />
        </el-form-item>
        <el-form-item label="报名点简介" prop="pointDesc">
          <el-input
            v-model="formArea.pointDesc"
            placeholder="请输入报名点简介"
            size="small"
          />
        </el-form-item>
        <el-form-item label="详细地址" prop="address" style="width: 100%">
          <el-input
            v-model="formArea.address"
            placeholder="请输入"
            size="small"
            style="margin-right: 10px"
            @input="$forceUpdate()"
            class="resultArea"
          />
          <el-button
            type="primary"
            size="small"
            @click="handleMap"
            class="mapBtn"
            >在地图上选择</el-button
          >
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="operingArea !== 3">
        <el-button type="primary" @click="handleSureArea">确 定</el-button>
        <el-button @click="openArea = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 选择地址 -->
    <school-map :openMap.sync="openMap" @result-area="getResultArea" />
    <!-- 导出配置 -->
    <!-- <el-dialog
      :close-on-click-modal="false"
      :visible.sync="examineOpen"
      width="800px"
      append-to-body
      :center="true"
    >
    <el-form
        class="dialogForm"
        :model="form"
        ref="auditform"
        :rules="rules"
        label-width="90px"
      >
         <el-form-item label="网址" prop="auditOpinion">
                  <el-input
                    v-model="auditform.web"
                    type="textarea"
                    :rows="2"
                    size="small"
                    placeholder="请输入意见"
                  />
                </el-form-item>
    </el-form>
     </el-dialog> -->
    <!-- 审核弹窗 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="examineOpen"
      width="800px"
      append-to-body
      :center="true"
    >
      <div class="hrshow"></div>
      <el-form
        class="dialogForm"
        :model="form"
        ref="auditform"
        :rules="rules"
        label-width="90px"
      >
        <div class="boxStu">
          <div class="styleSh">
            <div class="find-div-body">
              <span class="editText">审核</span>
              <el-form-item>
                <el-radio-group v-model="auditform.auditStatus">
                  <el-radio
                    v-for="status in statusList"
                    :key="status.value"
                    :label="status.value"
                    style="padding-top: 25px; padding-left: 20px"
                    v-show="status.value"
                    >{{ status.label }}</el-radio
                  >
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="find-div-body-two">
              <div class="texBox">
                <span class="editTextYijian">审核意见</span>
                <el-form-item prop="auditOpinion">
                  <el-input
                    v-model="auditform.auditOpinion"
                    type="textarea"
                    :rows="2"
                    size="small"
                    resize="none"
                    placeholder="请输入意见"
                  />
                </el-form-item>
                <el-form-item>
                  <el-radio-group v-model="auditform.auditOpOption">
                    <el-radio
                      v-for="dict in opinionOptions"
                      :key="dict.value"
                      :label="dict.value"
                      style="padding-bottom: 30px; padding-left: 9px"
                      >{{ dict.label }}</el-radio
                    >
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </div>

          <div class="styleStu">
            <div id="circle"></div>
            <div id="circle-two"></div>
            <p style="margin-top: 35px">
              <img
                src="../../../assets/images/examine.png"
                alt=""
                class="imgShow"
              />
            </p>
            <p style="margin-top: 60px">
              <img
                src="../../../assets/images/opinion.png"
                alt=""
                class="imgShow"
              />
            </p>
          </div>
        </div>
      </el-form>
      <div style="clear: both; padding-top: 80px">
        <hr style="border: 1px dashed #dee0e3; width: 712px; height: 1px" />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="auditSubmitForm">保 存</el-button>
        <el-button @click="examineOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  drvSchoolPageList,
  drvSchoolAdd,
  subsSchoolAdd,
  pointAdd,
  drvSchoolUpdate,
  subSchoolUpdate,
  pointUpdate,
  drvSchoolInfo,
  pointInfo,
  subSchoolRemove,
  pointRemove,
  fileRemove,
  drvSchoolAudit,
  exportConfig,
  exportConfigExt
} from "@/api/cloud/drivInformation";
import { getDictSelect } from "@/api/param/select";
const column = function () {
  return [
    {
      title: "名称",
      prop: "name",
    },
    {
      title: "类型",
      prop: "type",
      status: () => {
        return this.typeList;
      },
      width: "130",
    },
    {
      title: "地址",
      prop: "address",
    },
    {
      title: "联系人",
      prop: "chargePerson",
      width: "200",
    },
    {
      title: "联系电话",
      prop: "telephone",
    },
    {
      title: "审核状态",
      prop: "auditStatus",
      status: () => {
        return this.statusList;
      },
    },
    {
      title: "操作",
      width: "200",
      type: "buttons",
      fixed: "right",
      text: function (row) {
        if (row.auditStatus === 1 || row.auditStatus === 2) {
          return "已审核";
        }
        return false;
      },
      butList: [
        {
          title: "审核",
          size: "mini",
          onClick: this.toExamine,
          hasPermi: ["school:audit"],
          hide: function (row) {
            return row.type === "2" || row.auditStatus;
          },
        },
      ],
    },
  ];
};
import { getToken } from "@/utils/auth";
let ganged;
export default {
  name: "drivInformation",
  data() {
    return {
      token: { Authorization: "Bearer " + getToken() },
      baseUrl: process.env.VUE_APP_BASE_URL,
      total: 0,
      loadingInstance: null,
      queryParams: {
        pageNum: 1,
        pageSize: 20,
      },
      column: column.call(this),
      tableData: [],
      typeList: [
        {
          label: "主校",
          value: "0",
        },
        {
          label: "分校",
          value: "1",
        },
        {
          label: "报名点",
          value: "2",
        },
      ],
      // 驾校状态
      drvStatusList: [
        {
          label: "启用",
          value: 0,
        },
        {
          label: "冻结",
          value: 1,
        },
      ],
      // 审核状态
      statusList: [
        {
          value: 0,
          label: "待审核",
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
      opinionOptions: [
        {
          value: "1",
          label: "非合作驾校",
        },
        {
          value: "2",
          label: "驾校信息不完整",
        },
        {
          value: "3",
          label: "其它",
        },
      ],
      option: {
        isRadio: true,
      },
      visible: false,
      examineOpen: false,
      operating: 0,
      title: "",
      activeRow: {},
      form: {},
      auditform: {},
      levelList: [
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
      accept: ".jpg,.jpeg,.png,.bmp", //图片格式
      serviceFacility: [], //选中项
      serverList: [], //初始项
      fileList: [], //展示图片列表[{url:''}]
      business1: ["", ""],
      business2: ["", ""],
      business3: ["", ""],
      dialogImageUrl: "",
      dialogVisible: false,
      openArea: false,
      operingArea: 0,
      formArea: {},
      openMap: false,
      rules: {
        name: [{ required: true, message: "必填项", trigger: "change" }],
        chargePerson: [
          { required: true, message: "必填项", trigger: "change" },
        ],
        telephone: [{ required: true, message: "必填项", trigger: "change" }],
        countyId: [{ required: true, message: "必填项", trigger: "blur" }],
        telephone: [
          {
            required: true,
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确手机号",
            trigger: "change",
          },
        ],
        busScope: [
          { type: "array", required: true, message: "必填项", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    getTableList(num) {
      if (num === 1) {
        this.queryParams.pageNum = num;
      }
      drvSchoolPageList(this.queryParams).then((res) => {
        this.tableData = res.records;
        this.total = Number(res.total);
      });
    },
    // 点击单选获取当前行
    handleCurrentChange(row) {
      this.activeRow = row;
    },

    // 预览照片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    handleSuccess(response) {
      this.loadingInstance.close();
      if (response.code == 200) {
        this.photo.push(response.data); //这点我们把没次上传成功的图片地址装到 photo里面 (我这点是收集起所有上传的图片地址，后面点击提交的时候传给后端)
        let obj = {
          url: this.baseUrl + response.data,
        };
        // this.fileList.push(obj); //回显图片
        this.msgSuccess("上传成功");
      } else {
        this.msgError("上传失败");
      }
    },

    // 删除照片
    handleRemove(file, fileList) {
      this.photo = fileList.map(({ response, url }) =>
        response ? response.data : url.split(this.baseUrl)[1]
      );
    },

    //审核
    toExamine({ id }) {
      drvSchoolInfo({ id }).then(({ data }) => {
        this.auditform = data;
        this.examineOpen = true;
        this.title = "审核";
      });
    },

    auditSubmitForm() {
      const auditform = {};
      const fild = ["auditStatus", "auditOpinion", "auditOpOption", "id"];

      fild.forEach((key) => {
        auditform[key] = this.auditform[key];
      });
      drvSchoolAudit(auditform).then((res) => {
        this.getTableList();
        this.msgSuccess("审核成功");
        this.examineOpen = false;
      });
    },
    //导出
    handleDownClick() {
      if (JSON.stringify(this.activeRow) === "{}" || this.activeRow === null) {
        this.$message({ message: "请先选择列表数据", type: "warning" });
        return;
      }
      let { type } = this.activeRow;
      if (type == 2) {
        this.msgWarn("请选择主校或分校");
      } else {
        const loading = this.$loading({
          lock: true,
          text: "正在导出...",
          spinner: "el-icon-loading",
        });
        const { id } = this.activeRow;
        exportConfig(id)
          .then((res) => {
            const link = document.createElement("a");
            const blob = new Blob([res], { type: "application/xml" });
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, "web.config");
              return;
            }
            link.style.display = "none";
            //设置连接
            link.href = URL.createObjectURL(blob);
            link.download = "web.config";
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
      }
    },
    //导出易学通
    handleDownExt() {
      if (JSON.stringify(this.activeRow) === "{}" || this.activeRow === null) {
        this.$message({ message: "请先选择列表数据", type: "warning" });
        return;
      }
      let { type } = this.activeRow;
      if (type == 2) {
        this.msgWarn("请选择主校或分校");
      } else {
        const loading = this.$loading({
          lock: true,
          text: "正在导出...",
          spinner: "el-icon-loading",
        });
        const { id } = this.activeRow;
        exportConfigExt(id)
          .then((res) => {
            const link = document.createElement("a");
            const blob = new Blob([res], { type: "application/xml" });
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, "mnksconfig");
              return;
            }
            link.style.display = "none";
            //设置连接
            link.href = URL.createObjectURL(blob);
            link.download = "mnksconfig";
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
      }
    },

    // 获取服务设施
    getServerList() {
      getDictSelect("serviceFacility").then((res) => {
        this.serverList = res.data;
      });
    },

    // 新增
    addSchool() {
      this.operating = 1;
      this.title = "添加驾校";
      this.form = {};
      this.resetForm("form");
      (this.business1 = ["", ""]),
        (this.business2 = ["", ""]),
        (this.business3 = ["", ""]),
        (this.serviceFacility = []);
      this.fileList = [];
      this.photo = [];
      this.visible = true;
    },
    // 编辑
    edit() {
      if (JSON.stringify(this.activeRow) === "{}") {
        this.$message({ message: "请先选择驾校", type: "warning" });
        return;
      }
      let { id, type } = this.activeRow;
      this.serviceFacility = [];
      this.photo = [];
      this.fileList = [];
      this.business1 = ["", ""];
      this.business2 = ["", ""];
      this.business3 = ["", ""];
      if (type == 2) {
        // 报名点编辑
        this.operingArea = 2;
        pointInfo({ id }).then((res) => {
          let {
            drvSchoolId,
            id,
            provinceId,
            cityId,
            countyId,
            address,
            chargePerson,
            name,
            telephone,
            pointDesc,
          } = res.data;
          this.formArea = {
            drvSchoolId,
            id,
            provinceId,
            cityId,
            countyId,
            address,
            chargePerson,
            name,
            telephone,
            pointDesc,
          };

          this.openArea = true;
        });
      } else {
        this.operating = 2;
        // 主校分校编辑
        drvSchoolInfo({ id }).then((res) => {
          if (res.data.serviceFacility) {
            this.serviceFacility = res.data.serviceFacility.split(",");
          }

          if (res.data.photo) {
            this.photo = res.data.photo.split(",");
            let photoList = res.data.photo.split(",");
            photoList.forEach((item) => {
              let obj = {
                url: this.baseUrl + item,
              };
              this.fileList.push(obj); //回显图片
            });
          }

          let {
            id,
            parentId,
            serviceFacility,
            provinceId,
            cityId,
            countyId,
            name,
            chargePerson,
            telephone,
            licenseNo,
            licenseTime,
            recruitStudentPhone,
            level,
            email,
            remark,
            address,
            keyWord,
            route,
            business1Start,
            business1End,
            business2Start,
            business2End,
            business3Start,
            business3End,
            status,
          } = res.data;
          ganged = { provinceId, cityId, countyId };
          this.form = {
            id,
            serviceFacility,
            name,
            provinceId,
            cityId,
            countyId,
            chargePerson,
            telephone,
            licenseNo,
            licenseTime,
            recruitStudentPhone,
            level,
            email,
            remark,
            address,
            keyWord,
            route,
            business1Start,
            business1End,
            business2Start,
            business2End,
            business3Start,
            business3End,
            status,
          };
          if (res.data.busScope) {
            this.form.busScope = res.data.busScope.split(",");
          }
          if (parentId) {
            this.form = { ...this.form, parentId };
          }

          if (business1Start && business1End) {
            this.business1[0] = business1Start;
            this.business1[1] = business1End;
          }
          if (business2Start && business2End) {
            this.business2[0] = business2Start;
            this.business2[1] = business2End;
          }
          if (business3Start && business3End) {
            this.business3[0] = business3Start;
            this.business3[1] = business3End;
          }
          this.visible = true;
        });
      }
    },
    // 详情
    detail() {
      if (JSON.stringify(this.activeRow) === "{}") {
        this.$message({ message: "请先选择驾校", type: "warning" });
        return;
      }
      let { id, type } = this.activeRow;
      this.resetForm("form");
      this.resetForm("formArea");
      this.serviceFacility = [];
      this.photo = [];
      this.fileList = [];
      this.operating = 3;
      if (type == 2) {
        // 报名点详情
        this.operingArea = 3;
        pointInfo({ id }).then((res) => {
          this.formArea = res.data;
          this.openArea = true;
        });
      } else {
        // 主校分校详情
        drvSchoolInfo({ id }).then((res) => {
          if (res.data.serviceFacility) {
            this.serviceFacility = res.data.serviceFacility.split(",");
          }
          if (res.data.photo) {
            this.photo = res.data.photo.split(",");
            let photoList = res.data.photo.split(",");
            photoList.forEach((item) => {
              let obj = {
                url: this.baseUrl + item,
              };
              this.fileList.push(obj); //回显图片
            });
          }
          this.form = res.data;
          let {
            business1Start,
            business1End,
            business2Start,
            business2End,
            business3Start,
            business3End,
          } = this.form;
          if (res.data.busScope) {
            this.form.busScope = res.data.busScope.split(",");
          }
          if (business1Start && business1End) {
            this.business1[0] = business1Start;
            this.business1[1] = business1End;
          }
          if (business2Start && business2End) {
            this.business2[0] = business2Start;
            this.business2[1] = business2End;
          }
          if (business3Start && business3End) {
            this.business3[0] = business3Start;
            this.business3[1] = business3End;
          }
          this.visible = true;
        });
      }
    },
    // 新增添加分校
    addOtherSchool() {
      this.form = {};
      this.resetForm("form");
      if (
        JSON.stringify(this.activeRow) === "{}" ||
        this.activeRow.type !== "0"
      ) {
        this.$message({ message: "请先选择主校", type: "warning" });
        return;
      }
      let { id, provinceId, cityId, countyId } = this.activeRow;
      this.form = {
        parentId: id,
        provinceId,
        cityId,
        countyId,
      };
      this.business1 = ["", ""];
      this.business2 = ["", ""];
      this.business3 = ["", ""];
      this.serviceFacility = [];
      this.fileList = [];
      this.photo = [];
      this.operating = 4;
      this.title = "添加分校";
      this.visible = true;
    },
    // 提交驾校
    handleSure() {
      this.$refs["form"].validate(async (valid) => {
        if (valid) {
          if (this.operating == 4) {
            this.activeRow.type === "1";
          }
          let { id, type } = this.activeRow;
          this.form.busScope = this.form.busScope + "";
          this.form.serviceFacility = this.serviceFacility + "";
          this.form.photo = this.photo + "";
          if (this.operating == 1 || this.operating == 4) {
            if (type === "0" || !type) {
              let requestForm = {
                ...this.form,
                business1Start: this.business1 ? this.business1[0] : null,
                business1End: this.business1 ? this.business1[1] : null,
                business2Start: this.business2 ? this.business2[0] : null,
                business2End: this.business2 ? this.business2[1] : null,
                business3Start: this.business3 ? this.business3[0] : null,
                business3End: this.business3 ? this.business3[1] : null,
              };
              let { data } = await drvSchoolAdd(requestForm);
              this.getTableList();
              this.msgSuccess("新增成功");
              this.visible = false;
            } else if (type === "1") {
              let requestForm = {
                ...this.form,
                business1Start: this.business1 ? this.business1[0] : null,
                business1End: this.business1 ? this.business1[1] : null,
                business2Start: this.business2 ? this.business2[0] : null,
                business2End: this.business2 ? this.business2[1] : null,
                business3Start: this.business3 ? this.business3[0] : null,
                business3End: this.business3 ? this.business3[1] : null,
              };
              let { data } = await subsSchoolAdd(requestForm);
              this.getTableList();
              this.msgSuccess("新增成功");
              this.visible = false;
            }
          } else {
            if (type === "0") {
              // 编辑主校
              let { data } = await drvSchoolUpdate(this.form);
              this.getTableList();
              this.msgSuccess("修改成功");
              this.visible = false;
            } else if (type === "1") {
              // 编辑分校
              let { data } = await subSchoolUpdate(this.form);
              this.getTableList();
              this.msgSuccess("修改成功");
              this.visible = false;
            }
            this.activeRow = {};
          }
        }
      });
    },
    // 删除
    delet() {
      if (JSON.stringify(this.activeRow) === "{}") {
        this.$message({ message: "请先选择分校或报名点", type: "warning" });
        return;
      }
      let { id, type } = this.activeRow;
      if (type == 0) {
        this.$message({ message: "驾校不允许删除", type: "warning" });
        return;
      }
      this.$confirm(`确定要删除此${type == 1 ? "分校" : "报名点"}`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        if (type == 1) {
          let { data } = await subSchoolRemove({ id });
        } else {
          let { data } = await pointRemove({ id });
        }
        this.getTableList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 添加报名点
    addArea() {
      this.formArea = {};
      this.resetForm("formArea");
      if (
        !this.activeRow.type ||
        JSON.stringify(this.activeRow) === "{}" ||
        this.activeRow.type !== "0"
      ) {
        this.$message({ message: "请先选择主校", type: "warning" });
        return;
      }
      let { id, provinceId, cityId, countyId } = this.activeRow;
      this.formArea = {
        drvSchoolId: id,
        provinceId,
        cityId,
        countyId,
      };
      this.title = "添加报名点";
      this.operingArea = 1;
      this.openArea = true;
    },
    // 提交报名点
    handleSureArea() {
      this.$refs["formArea"].validate(async (valid) => {
        if (valid) {
          if (this.operingArea == 1) {
            let { data } = await pointAdd(this.formArea);
            this.getTableList();
            this.msgSuccess("新增成功");
            this.openArea = false;
          } else {
            let { data } = await pointUpdate(this.formArea);
            this.getTableList();
            this.msgSuccess("修改成功");
            this.openArea = false;
            this.activeRow = {};
          }
        }
      });
    },
    // 地图弹窗
    handleMap() {
      this.openMap = true;
    },
    // 获取详细地址
    getResultArea(area) {
      this.form.address = area;
      this.formArea.address = area;
    },
  },

  mounted() {
    this.getTableList();
    this.getServerList();
  },
};
</script>

<style lang="scss" scoped>
.hrshow {
  position: absolute;
  width: 1px;
  height: 60%;
  background: #e2e7ed;
  left: 43px;
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
  // .el-radio {
  //   padding-top: 30px;
  //   padding-left: 10px;
  // }
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

.custom-dialog {
  .opear-box {
    display: flex;
    justify-content: space-between;
    position: relative;
    .el-form {
      // width: calc(100% - 526px);
      width: 60%;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      .el-form-item {
        width: 46%;
        margin-right: 0;
        /deep/.el-form-item__content {
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
          width: calc(100% - 153px);
          .el-input--small {
            width: calc(100% - 114px);
          }
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
      width: 526px;
      margin-left: 20px;
    }
  }
  .all-item {
    /deep/.el-form-item__content {
      // width: calc(100% - 153px) !important;
    }
  }
  .photo-box {
    p {
      margin-top: 0;
    }
    /deep/.el-upload--picture-card,
    /deep/.el-upload-list__item {
      width: 246px !important;
      height: 138px !important;
    }
  }
}
.el-dialog {
  .el-form-item__content {
    .el-input__inner {
      width: 540px;
    }
    .el-input,
    .el-select {
      width: 540px;
    }
    .el-textarea {
      width: 540px;
    }
  }
  .all-item {
    /deep/.el-form-item__content {
      width: calc(100% - 240px) !important;
    }
  }
}
/deep/.el-tooltip {
  .el-button {
    // height: 20px;
    background: #49bbc5;
    border-radius: 16px;
    color: white;
    padding: 4px 15px;
  }
}
</style>
