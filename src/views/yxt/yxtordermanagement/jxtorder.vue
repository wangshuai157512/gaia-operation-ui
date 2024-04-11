<template>
  <div class="app-container">
    <el-form
      :model="queryParams"
      ref="queryForm"
      :inline="true"
      label-width="68px"
    >
      <el-form-item>
        <jaya-select
          type="SS"
          :parameter="JSON.stringify(querySelect)"
          v-model="queryParams.drvSchoolId"
          filterable
          placeholder="请选择驾校"
        ></jaya-select>
      </el-form-item>
      <el-form-item class="timepick-width-prepend">
        <el-date-picker
          size="small"
          v-model="date"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="起始日期"
          end-placeholder="结束日期"
          style="width: 240px"
          clearable
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          v-model="queryParams.subject"
          size="small"
          placeholder="科目"
          style="width: 150px"
        >
          <el-option
            v-for="item in subTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          v-model="queryParams.carType"
          size="small"
          style="width: 150px"
          placeholder="车型"
        >
          <el-option
            v-for="item in carTypeOptions"
            :key="item.carType"
            :label="item.carType"
            :value="item.carType"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-select
          clearable
          v-model="queryParams.status"
          size="small"
          style="width: 150px"
          placeholder="订单状态"
        >
          <el-option
            v-for="item in orderTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-input
          size="small"
          style="width: 150px"
          v-model="queryParams.cardNum"
          placeholder="训练卡号"
          clearable
        />
      </el-form-item>

      <el-form-item prop="createRealName">
        <el-input
          size="small"
          style="width: 210px"
          v-model="queryParams.createRealName"
          placeholder="请输入学员姓名/手机号"
          clearable
        />
      </el-form-item>

      <el-button @click="getTableList" type="primary">查询</el-button>
      <el-button @click="searchByCardNum" type="danger">刷卡查询</el-button>
    </el-form>
    <div class="table-box-con">
      <span class="carTotal"
        >订单数量：{{ statistic.orderNum || 0 }}，订单时长：{{
          statistic.orderTime || 0
        }}圈，订单金额：{{ statistic.totalMoney || 0 }}元，实收金额：{{
          statistic.totalPayableAmount || 0
        }}元，退费金额：{{ statistic.totalRefund || 0 }}元
      </span>
      <el-button
        @click="addbtn"
        type="primary"
        icon="el-icon-plus"
        class="addstyleselect"
        >添加
      </el-button>
      <el-button @click="orderInfobtn" icon="el-icon-view" type="info"
        >查看订单详情</el-button
      >
      <el-button v-if="!isExpire" @click="cancelOrder" type="danger"
        >关闭订单</el-button
      >
      <el-button @click="recharge" type="primary">续充</el-button>
      <el-button type="primary" class="addstyleselect" @click="cardRefund"
        >退卡
      </el-button>
    </div>

    <jaya-table-group
      v-show="!visibleinfo"
      ref="jayaCurrent"
      :total="total"
      :tableHeaderList="column"
      :tableList="tableList"
      @pagination="getTableList"
      @handleCurrentChange="handleCurrentChange"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      :option="option"
    ></jaya-table-group>
    <!-- 添加  -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="addvisible"
      width="790px"
      append-to-body
      title="添加订单"
    >
      <el-form ref="addform" :model="addform" :rules="rules" :inline="true">
        <div class="card_show">训练卡号：{{ cardNum }}</div>
        <div class="orderMes">
          <el-form-item label="驾校名称" prop="drvSchoolId">
            <jaya-select
              type="SS"
              :parameter="JSON.stringify(querySelect)"
              v-model="addform.drvSchoolId"
              filterable
              placeholder="请选择"
            ></jaya-select>
          </el-form-item>
          <el-form-item label="姓名" prop="createRealName">
            <el-input
              v-model="addform.createRealName"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="createPhone">
            <el-input
              v-model="addform.createPhone"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="车型" prop="carType">
            <el-select
              clearable
              v-model="addform.carType"
              size="small"
              style="width: 140px !important"
              placeholder="请选择"
            >
              <el-option
                v-for="item in carTypeOptions.filter(
                  (item) => item.status == 1
                )"
                :key="item.carType"
                :label="item.carType"
                :value="item.carType"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="科目" prop="subject">
            <el-radio-group v-model="addform.subject">
              <el-radio-button label="2">科目二</el-radio-button>
              <el-radio-button label="3">科目三</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="订单圈数(圈)" prop="initDuration">
            <el-select
              clearable
              v-model="addform.initDuration"
              size="small"
              style="width: 200px !important"
              placeholder="请选择"
            >
              <el-option
                v-for="item in 10"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应缴金额(元)" prop="amountMoney">
            <el-input
              disabled
              v-model="addform.amountMoney"
              size="small"
              placeholder="根据圈数自动计算"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="addform.remark"
              style="width: 740px"
              type="textarea"
              :rows="2"
              placeholder="请输入"
              size="small"
            />
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">保 存</el-button>
        <el-button @click="addvisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 训练详情 -->
    <Details :key="key" :visible.sync="visibleOpen" :option="option"></Details>
    <!-- 续充 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="rechargevisible"
      width="500px"
      append-to-body
      :title="title"
      top="35vh"
    >
      <el-form ref="rechargeForm" :model="rechargeForm" :rules="rules">
        <div>
          <div class="card_show">训练卡号：{{ cardNum }}</div>
          <div>
            <div style="text-align: center">订单编号：{{ id }}</div>
            <hr style="width: 300px" />
          </div>
          <div class="info_mes">
            <div class="info_title">
              <span>订单金额</span>
              <span>订单时长</span>
              <span>科目</span>
              <span>车型</span>
            </div>
            <div class="title_mes">
              <!-- v-if所判断的是：选择圈数/金额后点击下一步，顶部详情自动更新出所选的圈数 -->
              <span v-if="isup"> {{ rechargeForm.amountMoney }}元 </span>
              <!-- v-else：此条数据目前详情 -->
              <span v-else>{{ formattedValue }}元</span>
              <span v-if="isup">{{ rechargeForm.rechargeNum }}圈</span>
              <span v-else>{{ rechargeInfo.remainDuration }}圈</span>
              <span>{{ rechargeInfo.subject == 2 ? "科目二" : "科目三" }}</span>
              <span>{{ rechargeInfo.carType }}</span>
            </div>
          </div>
        </div>

        <div class="recharge_info" v-if="showcode">
          <el-form-item label="请选择续充圈数" prop="rechargeNum">
            <el-select
              clearable
              v-model="rechargeForm.rechargeNum"
              size="small"
              style="width: 300px !important"
              placeholder="请选择"
            >
              <el-option
                v-for="item in 10"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="应缴金额(元)" prop="amountMoney">
            <el-input
              v-model="rechargeForm.amountMoney"
              size="small"
              placeholder="根据圈数自动计算"
              disabled
            />
          </el-form-item>
        </div>
        <div v-else>
          <img
            v-if="payCode"
            style="width: 230px; height: 230px; margin: auto; display: block"
            :src="payCode"
          />

          <div style="text-align: center; margin-top: 15px">
            请打开微信扫一扫，扫描上面的二维码付款，付款成功后自动充卡
          </div>
          <div></div>
          <div
            style="text-align: center; margin-top: 10px"
            v-if="paySuccess == 1"
          >
            <img
              style="width: 30px; height: 30px; margin: auto"
              src="../../../assets/images/pay_success.png"
            />
            <span style="font-size: 18px">支付成功</span>
            <img
              style="width: 30px; height: 30px; margin: auto"
              src="../../../assets/images/pay_success.png"
            />
            <span style="font-size: 18px">充卡成功</span>
            <div style="text-align: center; margin-top: 15px">
              3秒后窗口自动关闭
            </div>
          </div>

          <div
            style="text-align: center; margin-top: 10px"
            v-if="paySuccess == 2"
          >
            <img
              style="width: 30px; height: 30px; margin: auto"
              src="../../../assets/images/pay_success.png"
            />
            <span style="font-size: 18px">支付成功</span>
            <img
              style="width: 30px; height: 30px; margin: auto"
              src="../../../assets/images/pay_fail.png"
            />
            <span style="font-size: 18px">充卡失败</span>
            <div style="text-align: center; margin-top: 15px">
              点击下边按钮重新充卡
            </div>
            <div style="text-align: center; margin-top: 15px">
              <el-button type="primary" @click="chargeCard">充卡</el-button>
            </div>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer" v-if="showcode">
        <el-button type="primary" @click="submitRecharge">下一步</el-button>
        <el-button @click="rechargevisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 充卡 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="chargeCardVisible"
      width="500px"
      append-to-body
      :title="title"
      top="35vh"
    >
      <div>
        <div class="card_show">训练卡号：{{ cardNum }}</div>
        <div>
          <div style="text-align: center">订单编号：{{ id }}</div>
          <hr style="width: 300px" />
        </div>
        <div class="info_mes">
          <div class="info_title">
            <span>剩余金额</span>
            <span>剩余时长</span>
            <span>科目</span>
            <span>车型</span>
          </div>
          <div class="title_mes">
            <span>{{ formattedValue }}元</span>
            <span>{{ rechargeInfo.remainDuration }}圈</span>
            <span>{{ rechargeInfo.subject == 2 ? "科目二" : "科目三" }}</span>
            <span>{{ rechargeInfo.carType }}</span>
          </div>
        </div>
      </div>

      <div v-if="tip == 1" style="text-align: center; margin-top: 40px">
        <img
          style="width: 30px; height: 30px; margin: auto"
          src="../../../assets/images/pay_success.png"
        />
        <span style="font-size: 18px">充卡成功</span>
        <div style="text-align: center; margin-top: 15px">
          3秒后窗口自动关闭
        </div>
      </div>
      <!-- <div style="text-align: center; margin-top: 10px">
        <img
          style="width: 30px; height: 30px; margin: auto"
          src="../../../assets/images/pay_fail.png"
        />
        <span style="font-size: 18px">充卡失败</span>
      </div> -->
      <div v-if="tip == 2" style="text-align: center; margin-top: 60px">
        <el-button type="primary" @click="againCard">充卡</el-button>
      </div>
    </el-dialog>
    <!--  详情 -->
    <div class="custom-dialog" v-if="visibleinfo">
      <div class="custom-dialog-con">
        <div class="formShowInfo">
          <el-form
            class="dialogForm"
            ref="form"
            :model="form"
            :rules="rules"
            :inline="true"
            label-width="100px"
            disabled
          >
            <div class="titleOrder">订单详情（计圈订单）</div>
            <div>
              <el-form-item label="订单编号" prop="id">
                <el-input v-model="form.id" size="small" />
              </el-form-item>

              <el-form-item label="订单状态" prop="status">
                <el-select
                  v-model="form.status"
                  size="small"
                  placeholder="订单状态"
                >
                  <el-option
                    v-for="item in orderTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="操作人" prop="operator">
                <el-input v-model="form.operator" size="small" />
              </el-form-item>
              <el-form-item label="训练卡号" prop="cardNum">
                <el-input v-model="form.cardNum" size="small" />
              </el-form-item>
            </div>

            <div class="titleOrder">用户基本信息</div>
            <div>
              <el-form-item label="驾校名称" prop="drvSchoolName">
                <el-input v-model="form.drvSchoolName" size="small" />
              </el-form-item>
              <el-form-item label="姓名" prop="createRealName">
                <el-input v-model="form.createRealName" size="small" />
              </el-form-item>
              <el-form-item label="手机号" prop="createPhone">
                <el-input v-model="form.createPhone" size="small" />
              </el-form-item>
              <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="form.idCard" size="small" />
              </el-form-item>
            </div>

            <div class="titleOrder">订单详细信息</div>
            <div>
              <el-form-item label="训练车型" prop="carType">
                <el-input v-model="form.carType" size="small" />
              </el-form-item>
              <el-form-item label="训练科目" prop="subject">
                <!-- <el-input v-model="form.subject" size="small" /> -->
                <el-select
                  clearable
                  v-model="form.subject"
                  size="small"
                  placeholder="训练科目"
                >
                  <el-option
                    v-for="item in [
                      { value: 2, label: '科目二' },
                      { value: 3, label: '科目三' }
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="计费类型" prop="chargeWay">
                <el-select
                  clearable
                  v-model="form.chargeWay"
                  size="small"
                  placeholder="计费类型"
                >
                  <el-option
                    v-for="item in [
                      { value: 0, label: `按时` },
                      { value: 1, label: `按圈` }
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="优惠类型" prop="discountContent">
                <el-input v-model="form.discountContent" size="small" />
              </el-form-item>
              <el-form-item label="应缴金额" prop="amountMoney">
                <el-input v-model="form.amountMoney" size="small">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="实缴金额" prop="payableAmount">
                <el-input v-model="form.payableAmount" size="small">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="订单时长" prop="initDuration">
                <el-input v-model="form.initDuration" size="small">
                  <template slot="append">圈</template>
                </el-input>
              </el-form-item>
              <!-- <el-form-item label="号牌号码" prop="carPlate">
                <el-input v-model="form.carPlate" size="small" />
              </el-form-item> -->
              <el-form-item label="练车日期" prop="useDate">
                <el-input v-model="form.useDate" size="small" />
              </el-form-item>
              <el-form-item label="下单时间" prop="createTime">
                <el-input v-model="form.createTime" size="small" />
              </el-form-item>

              <el-form-item label="支付时间" prop="payTime">
                <el-input v-model="form.payTime" size="small" />
              </el-form-item>
              <el-form-item label="支付方式" prop="payType">
                <el-select
                  clearable
                  v-model="form.payType"
                  size="small"
                  placeholder="支付方式"
                >
                  <el-option
                    v-for="item in payTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label="退款金额"
                prop="refund"
                v-if="form.status == 6 || form.status == 7"
              >
                <el-input v-model="form.refund" size="small">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item
                label="退款状态"
                prop="status"
                v-if="form.status == 6 || form.status == 7"
              >
                <el-select
                  v-model="form.status"
                  size="small"
                  placeholder="退款状态"
                >
                  <el-option
                    v-for="item in orderTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="退费说明" prop="drvSchoolName">
                <el-input v-model="form.drvSchoolName" size="small" />
              </el-form-item> -->
              <el-form-item label="备注信息" prop="remark">
                <el-input v-model="form.remark" size="small" />
              </el-form-item>
            </div>
          </el-form>
          <div>
            <div class="titleOrder">订单续充记录</div>
            <el-table
              :data="tableRecharge"
              class="tableStyle"
              style="width: 100%; padding-top: 20px"
            >
              <el-table-column align="center" type="index" label="续充次数">
              </el-table-column>
              <el-table-column align="center" prop="payTime" label="支付时间" />
              <el-table-column
                align="center"
                prop="bussinessTxt"
                label="续充圈数"
              />
              <el-table-column
                align="center"
                prop="amountMoney"
                label="续充金额"
              />
            </el-table>
          </div>
          <div style="margin-top: 20px">
            <div class="titleOrder">订单使用记录</div>
            <el-table
              :data="tableData"
              class="tableStyle"
              style="width: 100%; padding-top: 20px"
            >
              <el-table-column
                align="center"
                type="index"
                label="序号"
                width="50"
              >
              </el-table-column>
              <el-table-column
                align="center"
                prop="loginTime"
                label="开始时间"
              />
              <el-table-column
                align="center"
                prop="logoutTime"
                label="结束时间"
              />
              <el-table-column
                align="center"
                prop="loginTimeDuration"
                label="训练时长"
              >
                <template slot-scope="scope">{{
                  parseTimes(scope.row.loginTimeDuration || 0)
                }}</template>
              </el-table-column>
              <!-- <el-table-column
                align="center"
                prop="reusableSurplusTime"
                label="剩余时长"
              /> -->
              <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="text"
                    @click.stop="handleDetailsClick(scope.row)"
                    >查看训练详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="btn">
            <el-button @click="visibleinfo = false">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 退卡 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="cardvisible"
      width="400px"
      append-to-body
      title="退卡"
    >
      <el-form ref="rechargeForm" :model="rechargeForm" :rules="rules">
        <div>
          <div class="card_show">训练卡号：{{ cardNum }}</div>
          <div class="info_mes">
            <div class="info_title">
              <span>剩余金额</span>
              <span>剩余时长</span>
            </div>
            <div class="title_mes">
              <span>{{ formattedValue }}元</span>
              <span>{{ rechargeInfo.remainDuration }}圈</span>
            </div>
          </div>
        </div>

        <div class="money_info">
          <div>若有余额，退卡时会同时退费</div>
          <div>
            <el-button type="primary" @click="cardMoney">退卡</el-button>
            <el-button @click="cardvisible = false">取消</el-button>
          </div>
        </div>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import {
  ordersPage,
  addJxt,
  statistic,
  jxtordersInfo,
  jxtordersCancel,
  jxtordersUpdate,
  jxtNative,
  outTradeNo,
  wxRefund,
  rechargeNative,
  orderPageList,
  rechargeRecord,
  jxtCard
} from "@/api/yxt/order";
import { getConfig } from "@/api/yxt/jianxuetongrule";
import { getCarType, getOrder } from "@/api/yxt/jianxuetongrule";
import Details from "../../train/components/Details";
import axios from "axios";
let timer;
let timer1;
const column = function () {
  return [
    {
      title: "订单编号",
      prop: "id",
      width: "200"
    },
    {
      title: "订单金额",
      prop: "amountMoney",
      slotFn: (row) => `￥${row.amountMoney || "-"}`
    },
    {
      title: "订单时长",
      prop: "initDuration",
      slotFn: (row) =>
        `${row.initDuration}${row.chargeWay == 0 ? "分钟" : "圈"}`
    },
    {
      title: "训练卡号",
      prop: "cardNum",
      onClick: (row) => {
        if (row.cardStatus === 0) {
          this.payCard(row);
        }
        if (row.cardStatus === 1) {
          this.continueCard(row);
        }
      },
      slotFn: (row) => {
        // 训练卡状态 0 未充卡未缴费 1 已支付未冲卡 2 已缴费已充卡 3已退卡
        if (row.cardStatus == 0 && row.status == 5) {
          return "-";
        }
        if (row.cardStatus == 0) {
          return `<span class="click_show">支付</span>`;
        }
        if (row.cardStatus == 1) {
          return `<span class="click_show">充卡</span>`;
        }
        if (row.cardStatus == 2) {
          return `${row.cardNum}`;
        }
        if (row.cardStatus == 3) {
          return `${row.cardNum}`;
        }
        return "-";
      }
    },
    {
      title: "用户姓名",
      prop: "createRealName"
    },
    {
      title: "手机号",
      prop: "createPhone"
    },
    {
      title: "科目",
      prop: "subject",
      status: () => this.subTypeOptions
    },
    {
      title: "车型",
      prop: "carType"
    },
    {
      title: "练车日期",
      prop: "useDate"
    },

    {
      title: "订单状态",
      prop: "status",
      status: () => this.orderTypeOptions
    },
    {
      title: "下单时间",
      prop: "createTime"
    },

    {
      title: "驾校名称",
      prop: "drvSchoolName"
    }
  ];
};
function parseTimes(t) {
  const val = t / 1000;

  if (val < 60) {
    return val + "秒";
  } else {
    var min_total = Math.floor(val / 60); // 分钟
    var sec = Math.floor(val % 60); // 余秒
    if (min_total < 60) {
      return min_total + "分钟" + sec + "秒";
    } else {
      var hour_total = Math.floor(min_total / 60); // 小时数
      var min = Math.floor(min_total % 60); // 余分钟
      return hour_total + "小时" + min + "分钟" + sec + "秒";
    }
  }
}
let readCarID,
  searchByCardNumTimer,
  payStatus = true,
  korderId;
export default {
  name: "jxtOrder",
  components: { Details },
  data() {
    return {
      column: column.call(this),
      form: {},
      addform: {},
      statistic: {},
      rechargeForm: {},
      rechargeInfo: {},
      option: {
        isRadio: true
      },
      // 弹出层标题
      title: "",
      tableList: [],
      tableData: [],
      tableRecharge: [],
      subTypeOptions: [
        {
          value: 2,
          label: "科目二"
        },
        {
          value: 3,
          label: "科目三"
        }
      ],
      chargeWayOptions: [
        {
          value: 0,
          label: "按时计费"
        },
        {
          value: 1,
          label: "按圈计费"
        },
        {
          value: 2,
          label: "自定义"
        }
      ],

      payTypeOptions: [
        {
          value: 0,
          label: "在线支付"
        },
        {
          value: 1,
          label: "线下支付"
        }
      ],
      circleOptions: [],
      schoolOptions: [],
      orderTypeOptions: [
        {
          value: 0,
          label: "未支付"
        },
        {
          value: 9,
          label: "已支付"
        },
        // {
        //   value: 1,
        //   label: "已支付（待激活）",
        // },
        {
          value: 2,
          label: "使用中"
        },
        {
          value: 3,
          label: "已完成"
        },
        {
          value: 4,
          label: "已过期"
        },
        {
          value: 5,
          label: "已关闭"
        },
        {
          value: 6,
          label: "已退费"
        },
        {
          value: 7,
          label: "异常单"
        },
        {
          value: 8,
          label: "支付失败"
        }
      ],
      // 数据
      data: [],
      date: [],
      isExpire: false,
      visibleinfo: false,
      ordersInfo: false,
      addvisible: false,
      cardvisible: false,
      rechargevisible: false,
      nocardvisible: false,
      nocardvisible: false,
      showcode: true,
      paySuccess: 0,
      visibleOpen: false,
      chargeCardVisible: false,
      tip: false,
      // payFail: false,
      cardNum: "",
      id: "",
      key: 0,
      // 总条数
      total: 0,
      // table入参
      querySelect: {},
      option: {
        isRadio: true
      },
      payCode: null,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        desc: "createTime"

        // useDate: parseTime(new Date(), "{y}-{m}-{d}"),
      },
      isup: false,
      date: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}")
      ],
      carTypeOptions: [],
      trainOptions: [],
      // table Loading框
      tableLoading: false,
      multipleSelection: null,
      rules: {
        drvSchoolId: [{ required: true, trigger: "blur", message: "必填项" }],
        // carType: [{ required: true, trigger: "blur", message: "必填项" }],
        subject: [{ required: true, trigger: "blur", message: "必填项" }],
        initDuration: [{ required: true, trigger: "blur", message: "必填项" }],
        rechargeNum: [{ required: true, trigger: "blur", message: "必填项" }],
        amountMoney: [{ required: true, trigger: "blur", message: "必填项" }],
        carType: [{ required: true, trigger: "blur", message: "必填项" }],
        createPhone: [
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确的手机号"
          }
        ]
      },
      chargeRule: null
    };
  },
  watch: {
    //获取车型
    "queryParams.drvSchoolId": function (drvSchoolId) {
      getCarType({ drvSchoolId }).then((res) => {
        this.carTypeOptions = res.data;
      });
    },
    "form.drvSchoolId": function (drvSchoolId) {
      if (drvSchoolId) {
        getCarType({ drvSchoolId, isOn: 1 }).then((res) => {
          this.carTypeOptions = res.data;
          this.form = {
            ...this.form
            // carType: null,
            // subject: null,
            // chargeWay: null,
            // inSchool: null,
          };
        });
      }
    },
    "addform.drvSchoolId": function (drvSchoolId) {
      if (drvSchoolId) {
        getCarType({ drvSchoolId, isOn: 1 }).then((res) => {
          this.carTypeOptions = res.data;
          this.addform = {
            ...this.addform,
            carType: "",
            subject: "",
            initDuration: ""
            // carType: null,
            // subject: null,
            // chargeWay: null,
            // inSchool: null,
          };
        });
      }
    },
    "addform.carType": function () {
      this.addform = {
        ...this.addform,
        initDuration: ""
      };
      const { carType, drvSchoolId, subject } = this.addform;
      this.getChargeRule(carType, drvSchoolId, subject);
    },
    "addform.subject": function () {
      this.addform = {
        ...this.addform,
        initDuration: ""
      };
      const { carType, drvSchoolId, subject } = this.addform;
      this.getChargeRule(carType, drvSchoolId, subject);
    },
    "addform.initDuration": function (val) {
      if (val && this.chargeRule) {
        const { subject } = this.addform;
        const { cycleChargeKm2, cycleChargeKm3 } = this.chargeRule;

        this.addform = {
          ...this.addform,
          amountMoney:
            subject == 2 ? cycleChargeKm2 * val : cycleChargeKm3 * val
        };
      } else if (!val) {
        this.addform = {
          ...this.addform,
          amountMoney: ""
        };
      }
    },
    "rechargeForm.rechargeNum": function (val) {
      const { subject } = this.rechargeInfo;
      const { cycleChargeKm2, cycleChargeKm3 } = this.chargeRule;

      if (val) {
        this.rechargeForm = {
          ...this.rechargeForm,
          amountMoney: (subject == 2 ? cycleChargeKm2 : cycleChargeKm3) * val
        };
      }
    },
    //添加时读取读卡器信息
    addvisible(val) {
      if (val) {
        this.fetchcardNum();
      }
    },
    //续充时读取读卡器信息
    rechargevisible(val) {
      if (val) {
        this.fetchcardNum();
      }
    },
    //退卡读取读卡器信息
    cardvisible(val) {
      if (val) {
        this.fetchcardNum();
      }
    }
  },
  mounted() {
    //获取表格数据
    this.getTableList();
    //统计数据
    // statistic({
    //   orderType: 3,
    // }).then((res) => {
    //   this.statistic = res.data;
    // });
    // this.searchByCardNum();
  },
  //销毁定时器
  destroyed() {
    clearTimeout(searchByCardNumTimer);
  },
  computed: {
    //金额截取保留两位小数
    formattedValue() {
      return (
        (this.rechargeInfo.remainDuration / this.rechargeInfo.initDuration) *
          this.rechargeInfo.amountMoney || 0
      ).toFixed(2);
    }
  },
  methods: {
    parseTimes,
    //根据id卡号检索
    searchByCardNum() {
      this.getRead()
        .then((response) => {
          if (response.data) {
            readCarID = response.data;
            if (readCarID === "131") {
              this.msgWarn("请将卡片放到读卡器上");
              this.getTableList();
              return;
            }
            ordersPage({ id: response.data }).then((res) => {
              this.tableList = res.records;
              this.total = Number(res.total);
              //如果列表返回空判断该卡为空
              if (res.records.length === 0) {
                this.$message({
                  type: "warning",
                  message: "此为空卡，无法检索订单"
                });
                return;
              }
            });
          }
          // searchByCardNumTimer = setTimeout(this.searchByCardNum, 1000);
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // 查询收费标准设置
    getChargeRule(carType, drvSchoolId, subject) {
      if (carType && drvSchoolId && subject) {
        getConfig({ carType, drvSchoolId, subject }).then((res) => {
          this.chargeRule = res.data;
        });
      }
    },

    //选择所在行
    handleCurrentChange(val) {
      this.multipleSelection = val;
    },
    //写入订单编号
    writeCard(id) {
      return axios.get(`http://localhost:9088/w20/write?id=${id}`);
    },
    //获取训练卡号
    getReadCardNum() {
      return axios.get("http://localhost:9088/w20/readCardNum");
    },
    //获取订单编号
    getRead() {
      return axios.get("http://localhost:9088/w20/read");
    },
    fetchcardNum() {
      if (
        !payStatus ||
        (!this.rechargevisible && !this.addvisible && !this.cardvisible)
      )
        return;
      // 使用Vue提供的axios或者其他库发送异步请求
      this.getReadCardNum().then((response) => {
        // 成功获取数据后更新data中的cardNum
        if (this.cardNum != 0 && response.data == 0) {
          this.msgWarn("请将卡片放到读卡器上");
        }
        this.cardNum = response.data;
        // 设置定时器，每隔一段时间重新获取数据，实现轮询效果。
        if (this.addvisible || this.cardvisible) {
          setTimeout(this.fetchcardNum, 1000);
          return;
        }
        setTimeout(this.fetchcardNum, 1000);
      });
    },

    //获取订单编号
    fetchcardId() {
      if (!this.rechargevisible || !this.cardvisible) return;
      // 使用Vue提供的axios或者其他库发送异步请求
      this.getRead().then((response) => {
        // 成功获取数据后更新data中的Id
        // this.id = response.data;
        // 设置定时器，每隔一段时间重新获取数据，实现轮询效果。
        setTimeout(this.fetchcardNum, 1000);
      });
    },

    //查询列表
    getTableList() {
      ordersPage({
        ...this.queryParams,
        orderType: 3,
        createStartTime: this.date ? this.date[0] : "",
        createEndTime: this.date ? this.date[1] : ""
      }).then((res) => {
        this.tableList = res.records;
        this.total = Number(res.total);
      });
      //根据查询条件检索
      const { carType, drvSchoolId, status, subject } = this.queryParams;
      statistic({
        orderType: 3,
        carType,
        createStartTime: this.date ? this.date[0] : "",
        createEndTime: this.date ? this.date[1] : "",
        drvSchoolId,
        status,
        subject
      }).then((res) => {
        this.statistic = res.data;
      });
    },

    //点击添加
    addbtn() {
      this.form = {};
      this.resetForm("addform");
      this.addvisible = true;
    },

    //添加提交
    submitForm() {
      this.$refs["addform"].validate((valid) => {
        if (valid) {
          if (this.cardNum == 0) {
            this.msgWarn("请将卡片放到读卡器上");
          } else {
            this.addform.cardNum = this.cardNum;
            // 调用添加接口
            addJxt(this.addform).then((res) => {
              this.msgSuccess("新增成功");
              this.title = "支付";
              this.addvisible = false;
              this.id = res.data;
              //支付
              this.payCard({ cardNum: this.cardNum, id: res.data });
              this.getTableList();
              this.timegetReadCardNum();
            });
          }
        }
      });
    },

    //查看训练详情
    handleDetailsClick(row) {
      this.key = Date.now();
      this.$nextTick(() => {
        this.option = { ...row, key: Date.now() };
      });
    },

    //获取订单状态
    getOrderStatus(id, orderId) {
      if (!this.rechargevisible) return;
      //获取支付状态
      outTradeNo({ id }).then((res) => {
        payStatus = true;
        //支付返回1代表支付成功
        if (res.data === 1) {
          this.getChangeCard(orderId)
            .then(() => {
              this.paySuccess = 1;
              setTimeout(() => {
                this.rechargevisible = false;
              }, 3000);
              this.getTableList();
            })
            .catch(() => {
              // 保存订单id
              korderId = orderId;
              //充卡失败
              this.paySuccess = 2;
              this.msgWarn("请放入卡片");
              this.getTableList();
            });
          return;
        }
        setTimeout(this.getOrderStatus, 1500, id, orderId);
      });
    },
    //充卡是否成功所返回的状态
    getChangeCard(orderId) {
      return new Promise((resolve, reject) => {
        this.getReadCardNum().then((res) => {
          if (res.data != 0) {
            this.writeCard(orderId).then((r) => {
              jxtCard({ cardNum: res.data, flag: r.data, orderId }).then(
                (res) => {
                  //充卡成功
                  resolve();
                }
              );
            });
          } else {
            reject();
          }
        });
      });
    },
    //添加订单后，支付成功却充卡失败，重新充卡所调用的方法（无弹窗）
    chargeCard() {
      this.getChangeCard(korderId)
        .then(() => {
          this.paySuccess = 1;
          setTimeout(() => {
            this.rechargevisible = false;
          }, 3000);
          this.getTableList();
        })
        .catch(() => {
          this.msgWarn("请将卡片放到读卡器上");
        });
    },
    //充卡窗口轮询 读卡器读卡
    timegetReadCardNum() {
      // 需要轮询的状态
      const loopQue = [this.chargeCardVisible, this.rechargevisible];

      if (!loopQue.includes(true)) return;
      this.getReadCardNum().then((res) => {
        if (this.cardNum != 0 && res.data == 0) {
          this.msgWarn("请将卡片放到读卡器上");
        }
        this.cardNum = res.data;
        setTimeout(() => {
          this.timegetReadCardNum();
        }, 1000);
      });
    },
    //充卡,弹窗展示（展示在列表上的充卡）
    continueCard(row) {
      this.chargeCardVisible = true;
      this.timegetReadCardNum();
      this.tip = 2;
      this.isup = false;
      const { id, cardNum } = row;
      this.cardNum = cardNum;
      this.id = id;
      jxtordersInfo({ id }).then(({ data }) => {
        this.title = "充卡";
        this.rechargeInfo = data;
      });
    },
    //确定充卡
    againCard() {
      this.getChangeCard(this.id)
        .then(() => {
          this.tip = 1;
          setTimeout(() => {
            this.chargeCardVisible = false;
          }, 3000);
          this.getTableList();
        })
        .catch(() => {
          this.msgWarn("请将卡片放到读卡器上");
        });
    },

    //未支付（展示在列表上的未支付）
    payCard(row) {
      this.paySuccess = 0;
      // this.getReadCardNum().then((res) => {
      // this.cardNum = res.data;
      // const { cardNum } = row;
      const { id, cardNum } = row;
      this.cardNum = cardNum;
      this.id = id;
      this.title = "支付";
      this.rechargevisible = true;
      this.showcode = false;
      payStatus = false;

      //获取详情
      jxtordersInfo({ id }).then(({ data }) => {
        this.rechargeInfo = data;
      });
      // if (cardNum == 0) {
      //   this.msgWarn("请将卡片放到读卡器上");
      //   return;
      // }

      // if (cardNum != row.cardNum) {
      //   this.msgWarn("训练卡与所选订单不一致，请更换卡片！");
      //   return;
      // }
      //获取支付码，将id, cardNum传给后端
      jxtordersUpdate({ id, cardNum }).then((res) => {
        jxtNative({ id }).then((res) => {
          if (res.data) {
            this.payCode = res.data.qrJpg;
            this.getOrderStatus(res.data.outTradeNo, id);
          }
        });
      });
      // });
    },

    //详情
    orderInfobtn() {
      if (this.multipleSelection) {
        const { id } = this.multipleSelection;
        jxtordersInfo({ id: id }).then(({ data }) => {
          this.visibleinfo = true;
          this.form = data;
          this.visible = true;
        });
        orderPageList({ id: id }).then((res) => {
          this.tableData = res.data;
        });
        rechargeRecord({ id: id }).then((res) => {
          this.tableRecharge = res.data;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    //关闭订单
    cancelOrder() {
      if (this.multipleSelection) {
        //状态为未支付和支付失败时才可关闭
        if (
          this.multipleSelection.status == 0 ||
          this.multipleSelection.status == 8
        ) {
          const { id } = this.multipleSelection;
          this.$confirm("是否确认关闭订单?", "警告", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(function () {
              return jxtordersCancel({ id });
            })
            .then(() => {
              this.getTableList();
              this.msgSuccess("关闭成功！");
            })
            .catch(() => {});
        } else {
          this.msgWarn("该订单状态不可关闭！");
        }
      } else {
        this.msgWarn("请选择一条数据");
      }
    },

    //退卡
    cardRefund() {
      if (!this.multipleSelection) {
        return this.msgWarn("请选择一条数据");
      }
      if (this.multipleSelection.status == 0) {
        return this.msgWarn("该订单未支付，无法退卡");
      }
      if (this.multipleSelection.status == 5) {
        return this.msgWarn("该订单已关闭，无法退卡");
      }

      const { id } = this.multipleSelection;

      // 查询详情回显
      jxtordersInfo({ id }).then(({ data }) => {
        this.cardvisible = true;
        this.rechargeInfo = data;
      });
    },

    //确定退卡
    cardMoney() {
      if (this.cardNum == 0) {
        this.msgWarn("请将卡片放到读卡器上");
        return;
      } else if (
        this.multipleSelection &&
        this.cardNum != this.multipleSelection.cardNum
      ) {
        this.msgWarn("训练卡与所选订单不一致，请更换卡片！");
        return;
      }

      this.$confirm("是否确认退卡?", "警告", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          const { id } = this.multipleSelection;
          return wxRefund({ id });
        })
        .then(() => {
          // this.msgSuccess("退卡成功！");
          this.cardvisible = false;
          this.getTableList();
        })
        .catch(() => {});
    },

    //续充
    recharge() {
      if (!this.multipleSelection) {
        return this.msgWarn("请选择一条数据");
      }
      if (
        this.multipleSelection.status == 0 ||
        this.multipleSelection.status == 8
      ) {
        return this.msgWarn("该订单未支付，无法续充");
      }
      if (this.multipleSelection.status == 5) {
        return this.msgWarn("该订单已关闭，无法续充");
      }
      if (this.multipleSelection.status == 4) {
        return this.msgWarn("该订单已过期，无法续充");
      }
      if (
        this.multipleSelection.status == 6 ||
        this.multipleSelection.status == 7
      ) {
        return this.msgWarn("该订单已退费，无法续充");
      }
      const { id } = this.multipleSelection;
      this.id = id;
      // 查询详情回显
      // 续充
      jxtordersInfo({ id }).then(({ data }) => {
        this.title = "续充";
        this.isup = false;
        this.rechargevisible = true;
        this.showcode = true;
        this.rechargeForm = { orderId: data.id };
        this.rechargeInfo = data;
        const { carType, drvSchoolId, subject } = data;
        this.getChargeRule(carType, drvSchoolId, subject);
      });
    },

    //提交续充表单
    submitRecharge() {
      //置空
      this.paySuccess = false;
      //判断是否放卡
      if (this.cardNum == 0) {
        this.msgWarn("请将卡片放到读卡器上");
        return;
      } else {
        if (
          this.multipleSelection &&
          this.cardNum != this.multipleSelection.cardNum
        ) {
          this.msgWarn("训练卡与所选订单不一致，请更换卡片！");
          return;
        }
      }
      this.showcode = false;
      this.isup = true;

      rechargeNative(this.rechargeForm).then((res) => {
        console.log(res);
        // this.msgSuccess("保存成功");
        this.payCode = res.data.qrJpg;
        this.getOrderStatus(res.data.outTradeNo, this.rechargeForm.orderId);
      });
    }
  }
};
</script>
<style lang="scss" scoped>
/deep/.el-dialog__body .el-form-item .el-form-item__label {
  display: block;
  height: 40px;
  line-height: 40px;
  width: 77px;
  font-size: 16px;
  color: #444;
}
/deep/.el-dialog__body .el-form-item .el-form-item__label {
  display: block;
  height: 40px;
  line-height: 40px;
  width: auto;
  font-size: 16px;
  color: #444;
}
.money_info {
  text-align: center;
}
.money_info div {
  margin-top: 20px;
}
.recharge_info {
  width: 300px;
  margin: 20px auto;
}
.info_mes {
  text-align: center;
}
.info_title {
  box-sizing: border-box;
  padding: 0 80px;
  display: flex;
}
.info_title span {
  font-size: 12px;
  flex: 1;
}
.title_mes {
  box-sizing: border-box;
  padding: 0 80px;
  display: flex;
}
.title_mes span {
  font-size: 16px;
  flex: 1;
  margin-top: 8px;
}
.custom-dialog .custom-dialog-con .el-form {
  padding: 10px 30px;
}

.card_show {
  text-align: center;
  background-color: #ebeef2;
  height: 20px;
  font-weight: 700;
  margin-bottom: 20px;
}
.table-box-con {
  .carTotal {
    font-size: 15px;
    color: #333333;
    margin-right: 20px;
  }
}
.formShowInfo {
  justify-content: space-between;
  flex-wrap: wrap;
  width: 100%;
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
  .titleOrder {
    font-size: 18px;
    margin: 20px 2px;
    color: #909399;
  }
}
.addstyleselect {
  position: relative;
}
.addstyleselect:hover .selectadd {
  display: block;
}
.selectadd {
  padding: 15px;
  border-radius: 4px;
  background: white;
  position: absolute;
  z-index: 9999;
  left: 0;
  top: 36px;
  display: none;
  li {
    margin-top: 10px;
    button {
      width: 100%;
      height: 32px;
      line-height: 12px;
    }
  }
}
/deep/.click_show {
  color: blue;
  cursor: pointer;
}
.el-dialog__wrapper {
  .jaya-select {
    width: 315px;
    /deep/ .el-select--small {
      width: 100%;
      // /deep/.el-input--suffix {
      //   width: 310px;
      //  /deep/ .el-input__inner {
      //     width: 310px;
      //   }
      // }
    }
  }
}
/deep/.el-table__body-wrapper {
  min-height: 0px;
}
</style>
