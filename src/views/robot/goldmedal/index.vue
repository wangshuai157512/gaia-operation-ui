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
          v-model="queryParams.drvSchoolId"
          :parameter="JSON.stringify(querySelect)"
          placeholder="请输入驾校"
          filterable
        ></jaya-select>
      </el-form-item>
      <el-form-item prop="hphm">
        <el-input
          size="small"
          style="width: 250px"
          v-model="queryParams.hphm"
          placeholder="请输入车牌号"
          clearable
        >
          <template slot="prepend">车牌号</template>
        </el-input>
      </el-form-item>
      <el-button class="fun-btn-right" @click="getTableList(1)" type="primary"
        >查询</el-button
      >
    </el-form>
    <div class="table-box-con">
      <span class="carTotal">总车辆：{{ total }} </span>
      <el-button
        @click="handleNewAdd"
        icon="el-icon-plus"
        type="primary"
        v-hasPermi="['gold-coach:operation:add']"
        >添加车辆</el-button
      >
      <el-button
        @click="InfoShow"
        icon="el-icon-view"
        type="info"
        v-hasPermi="['gold-coach:operation:info']"
        >查看详情</el-button
      >

      <el-button
        @click="updateShow"
        icon="el-icon-edit"
        type="warning"
        v-hasPermi="['gold-coach:operation:update']"
        >编辑</el-button
      >
      <el-button
        @click="deleteClick"
        icon="el-icon-delete"
        type="danger"
        v-hasPermi="['gold-coach:operation:delete']"
        >删除</el-button
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

    <!-- 编辑、详情 -->
    <div class="custom-dialog" v-if="visible">
      <div class="custom-dialog-con">
        <!-- 正面照 -->
        <div class="img-box">
          <div v-if="!imageUrlPositive && operating == 3" class="">
            <i class="el-icon-plus avatar-uploader-icon">
              <div class="upPhoto">暂无照片</div>
            </i>
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              name="image"
              :accept="accept"
              :before-upload="(file) => verifyAccept(file, accept)"
              :action="`${action}api/public/file/uploadImage`"
              :headers="headers"
              fileTitle="正面照"
              :show-file-list="false"
              :on-success="handleImgPositiveSuccess"
              :disabled="operating === 3"
            >
              <img
                v-if="imageUrlPositive"
                :src="`https://jpypt.oss-cn-beijing.aliyuncs.com${imageUrlPositive}`"
                class="avatar"
              />
              <div v-else class="">
                <i class="el-icon-plus avatar-uploader-icon">
                  <div class="imgUp">
                    <img
                      src="../../../assets/images/photoUpload.png"
                      alt=""
                      class="imgShow"
                    />
                  </div>
                  <div class="upPhotoFist">点击上传正前照</div>
                </i>
              </div>
            </el-upload>
          </div>
          <!-- 侧面照 -->
          <div v-if="!imageUrlSide && operating == 3" class="">
            <i class="el-icon-plus avatar-uploader-icon-two">
              <div class="upPhoto">暂无照片</div>
            </i>
          </div>
          <div v-else>
            <el-upload
              class="avatar-uploader"
              name="image"
              :accept="accept"
              :before-upload="(file) => verifyAccept(file, accept)"
              :action="`${action}api/public/file/uploadImage`"
              :headers="headers"
              fileTitle="侧面照"
              :show-file-list="false"
              :on-success="handleImgSideSuccess"
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
                      src="../../../assets/images/photoUpload.png"
                      alt=""
                      class="imgShow"
                    />
                  </div>
                  <div class="upPhotoFist">点击上传侧面照</div>
                </i>
              </div>
            </el-upload>
          </div>
        </div>
        <div class="formShowInfo">
          <el-form
            :disabled="operating == 3"
            class="dialogForm"
            ref="form"
            :model="form"
            :rules="rules"
            :inline="true"
          >
            <el-form-item label="车牌号" prop="hphm">
              <el-input
                v-model="form.hphm"
                size="small"
                placeholder="请输入车牌号"
                :disabled="operating !== 1"
              />
            </el-form-item>
            <el-form-item label="车辆编号" prop="id">
              <el-input
                v-model="form.id"
                size="small"
                placeholder="系统自动生成"
                disabled
              />
            </el-form-item>
            <el-form-item label="车身编号" prop="carBodyNum">
              <el-input
                v-model="form.carBodyNum"
                size="small"
                placeholder="请输入车身编号"
                clearable
              />
            </el-form-item>
            <el-form-item label="所属驾校" prop="drvSchoolId">
              <jaya-select
                type="SS"
                v-model="form.drvSchoolId"
                :parameter="JSON.stringify(querySelect)"
                placeholder="请输入驾校"
                filterable
              ></jaya-select>
            </el-form-item>
            <el-form-item label="培训车型" prop="carModel">
              <jaya-select
                size="small"
                v-model="form.carModel"
                placeholder="请选择培训车型"
                othername="exam_car_type"
              />
            </el-form-item>
             <el-form-item label="车辆品牌" prop="carBrand">
              <!-- <jaya-select
                size="small"
                v-model="form.carBrand"
                placeholder="请选择车辆品牌"
                othername="car_brand"
              /> -->
              <el-autocomplete
                v-model="form.carBrand"
                :fetch-suggestions="querySearchAsync"
                placeholder="请选择车辆品牌"
                value-key="label"
                @clear="clear"
                clearable
              ></el-autocomplete>
            </el-form-item>
            <el-form-item label="车辆型号" prop="carType">
              <el-input
                v-model="form.carType"
                size="small"
                placeholder="请输入车辆型号"
                clearable
              />
            </el-form-item>
            <el-form-item label="车辆用途" prop="carPurpose">
              <jaya-select
                size="small"
                v-model="form.carPurpose"
                placeholder="请选择车辆用途"
                othername="car_purpose"
              />
            </el-form-item>
            <el-form-item label="使用科目" prop="subject">
              <el-select
                v-model="form.subject"
                size="small"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in subjectoptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车辆状态" prop="status">
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
            <el-form-item label="设备厂家" prop="factory">
              <el-input v-model="form.factory" size="small" clearable />
            </el-form-item>
            <el-form-item label="发动机号" prop="engineNum">
              <el-input
                v-model="form.engineNum"
                size="small"
                placeholder="请输入发动机号"
                clearable
              />
            </el-form-item>
            <el-form-item label="运营证号码" prop="operateNum">
              <el-input
                v-model="form.operateNum"
                size="small"
                placeholder="请输入运营证号码"
                clearable
              />
            </el-form-item>
            <el-form-item label="年检时间" prop="checkTime">
              <el-date-picker
                v-model="form.checkTime"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="日历选择"
                clearable
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="安装设备时间" size="small" prop="installTime">
              <el-date-picker
                v-model="form.installTime"
                type="date"
                size="small"
                value-format="yyyy-MM-dd"
                style="width: 100%"
                placeholder="日历选择"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="所属教练" prop="coach">
              <el-input
                v-model="form.coach"
                size="small"
                placeholder="系统自动生成"
                disabled
              />
            </el-form-item>
            <el-form-item label="备注" prop="remark">
              <el-input
                v-model="form.remark"
                type="textarea"
                :rows="2"
                placeholder="请输入"
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
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import {
  pageList,
  pageInfo,
  pageUpdate,
  pageRemove,
  pageAdd,
  uploadImage,
} from "@/api/cloud/goldmedal";
import { getDictSelect,brandAdd } from "@/api/param/select";
const column = function () {
  return [
    {
      title: "车牌号",
      prop: "hphm",
    },
    {
      title: "车身编号",
      prop: "carBodyNum",
    },
    {
      title: "所属驾校",
      prop: "drvSchoolName",
    },
    {
      title: "安装时间",
      prop: "installTime",
    },
  ];
};
export default {
  name: "GoldMedal",
  //   components: { TableDetail },
  data() {
    return {
      action: this.baseApi,
      headers: { Authorization: `Bearer ${getToken("Admin-Token")}` },
      column: column.call(this),
      visible: false,
      detailRow: null,
      title: null,
      form: {
        factory: "精英智通",
      },
      tableList: [],
      option: {
        isRadio: true,
      },
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
      operating: 0, //1 添加 2 编辑  3详情
      loadingInstance: null,
      imageUrlPositive: null,
      imageUrlSide: null,
      dialogimageUrlSide: "",
      // table Loading框
      tableLoading: false,
      open: false,
      // 模态框
      visible: false,
      subjectoptions: [
        // {
        //   value: "1",
        //   label: "科目一",
        // },
        {
          value: "2",
          label: "科目二",
        },
        {
          value: "3",
          label: "科目三",
        },
      ],
      statusOptions: [
        {
          value: "0",
          label: "停用",
        },
        {
          value: "1",
          label: "正常",
        },
      ],
      examResults: [],
      reservationStatus: [],
      sujectOptions: [],
      options: [],
      roomOptions: [],
      multipleSelection: null,
      multipleSelectState: "1", // 1显示弹窗，2显示不合格，3显示科目不同
      carBrandList: [],
      timeout: null,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        },
      },
      accept: ".jpg,.jpeg,.png,.bmp", //图片格式
      rules: {
        hphm: [{ required: true, trigger: "blur", message: "必填项" }],
        // carNum: [{ required: true, trigger: "blur", message: "必填项" }],
        drvSchoolId: [{ required: true, trigger: "blur", message: "必填项" }],
        status: [{ required: true, trigger: "blur", message: "必填项" }],
        subject: [{ required: true, trigger: "blur", message: "必填项" }],
        carPurpose: [{ required: true, trigger: "blur", message: "必填项" }],
        carBrand: [{ required: true, trigger: "blur", message: "必填项" }],
      },
    };
  },
  mounted() {
    this.getTableList();
    this.getCarList();
  },
  methods: {
        // 获取车辆品牌列表
    getCarList() {
      getDictSelect("car_brand").then(({ data }) => {
        this.carBrandList = data;
      });
    },
    clear() {
      // 先使焦点元素失焦
      document.activeElement.blur()
    },
    querySearchAsync(queryString, cb) {
      if(!queryString) return cb(this.carBrandList)
      var carBrandList = this.carBrandList;
      var results = queryString
        ? carBrandList.filter(this.createStateFilter(queryString))
        : carBrandList;
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        cb(results);
      }, 500 * Math.random());
    },
    createStateFilter(queryString) {
      return (state) => {
        return (
          state.label.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        );
      };
    },
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
      // this.imageUrl = "";
      this.imageUrlPositive = null;
      this.imageUrlSide = null;
      this.form = {
        factory: "精英智通",
      };
      this.resetForm("form");
      this.visible = true;
      this.operating = 1;
      this.title = "添加";
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
            return pageRemove({ id });
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

    //上传照片回显
    handleImgPositiveSuccess({ code, msg, data }, file) {
      this.loadingInstance.close();
      if (code != 200) {
        this.msgError(msg);
      } else {
        this.imageUrlPositive = data;
        this.form.photoFront = data;
        this.msgSuccess("上传成功");
      }
    },
    handleImgSideSuccess({ code, msg, data }, file) {
      this.loadingInstance.close();
      if (code != 200) {
        this.msgError(msg);
      } else {
        this.imageUrlSide = data;
        this.form.photoSide = data;
        this.msgSuccess("上传成功");
      }
    },

    //编辑
    updateShow(row) {
      this.form = {};
      this.resetForm("form");
      // this.imageUrl = "";
      this.imageUrlPositive = null;
      this.imageUrlSide = null;
      let {
        carBodyNum,
        carBrand,
        carModel,
        carPurpose,
        carType,
        checkTime,
        engineNum,
        installTime,
        operateNum,
        remark,
        status,
        subject,
      } = row;
      this.form = {
        carBodyNum,
        carBrand,
        carModel,
        carPurpose,
        carType,
        checkTime,
        engineNum,
        installTime,
        operateNum,
        remark,
        status,
        subject,
      };
      if (this.multipleSelection) {
        const { id } = this.multipleSelection;
        pageInfo({ id: id }).then(({ data }) => {
          data.carPurpose = data.carPurpose + "";
          data.subject = data.subject + "";
          data.status = data.status + "";
           data.carBrand = this.carBrandList.filter((item) => {
            return data.carBrand == item.value;
          })[0]?.label;
          this.form = data;
          this.visible = true;
          this.title = "修改";
          this.operating = 2;
          this.imageUrlPositive = data.photoFront || null;
          this.imageUrlSide = data.photoSide || null;
          // this.getTableList();
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    //详情
    InfoShow() {
      // this.imageUrl = "";
      this.imageUrlPositive = null;
      this.imageUrlSide = null;
      if (this.multipleSelection) {
        this.operating = 3;
        const { id } = this.multipleSelection;
        pageInfo({ id: id }).then(({ data }) => {
          data.carPurpose = data.carPurpose + "";
          data.subject = data.subject + "";
          data.status = data.status + "";
           data.carBrand = this.carBrandList.filter((item) => {
            return data.carBrand == item.value;
          })[0]?.label;
          this.form = data;
          this.imageUrlPositive = data.photoFront || null;
          this.imageUrlSide = data.photoSide || null;
          this.visible = true;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(async(valid) => {
       if (valid) {
          let carBrandValue = this.carBrandList.filter((item) => {
            return this.form.carBrand === item.label;
          })[0]?.value;
          if(!carBrandValue) {
            const { data } = await brandAdd({brand:this.form.carBrand})
            carBrandValue = data
          }
          const { data } = await this.operating == 1? pageAdd({...this.form,carBrand:carBrandValue}): pageUpdate({...this.form,carBrand:carBrandValue});
          this.getTableList();
          this.msgSuccess(this.operating == 1 ? "新增成功" : "修改成功");
          this.visible = false;
          this.getCarList() 
        }
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
.table-box-con {
  .carTotal {
    font-size: 22px;
    color: #333333;
    margin-right: 20px;
  }
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
  > div {
    margin-bottom: 50px;
  }
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

  .avatar {
    width: 194px;
    height: 194px;
    margin-left: 20px;
  }

  .avatar-uploader-icon:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon-two {
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
    margin-top: 20px;
  }

  .avatar-uploader-icon-two:hover {
    border-color: #409eff;
  }

  .upPhoto {
    margin-top: 120px;
    font-size: 16px;
    text-align: center;
    color: #999999;
    text-align: center;
  }

  .upPhotoLast {
    margin-top: 120px;
    font-size: 16px;
    color: #999999;
    text-align: center;
  }

  .upPhotoFist {
    margin-top: 120px;
    font-size: 16px;
    color: #999999;
    text-align: center;
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
</style>
