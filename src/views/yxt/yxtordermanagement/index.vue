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
      <el-form-item prop="subject">
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
      <el-form-item prop="carType">
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
        <el-input
          size="small"
          style="width: 150px"
          v-model="queryParams.hphm"
          placeholder="号牌号码"
          clearable
        />
      </el-form-item>
      <el-form-item prop="chargeWay">
        <el-select
          clearable
          v-model="queryParams.chargeWay"
          size="small"
          placeholder="计费类型"
        >
          <el-option
            v-for="item in chargeWayOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="status">
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
      <el-form-item prop="createRealName">
        <el-input
          size="small"
          style="width: 180px"
          v-model="queryParams.createRealName"
          placeholder="请输入姓名/手机号"
          clearable
        />
      </el-form-item>

      <el-button @click="selectClick" type="primary">查询</el-button>
    </el-form>
    <div class="table-box-con">
      <el-button
        @click="addbtn"
        type="primary"
        icon="el-icon-plus"
        class="addstyleselect"
        >添加
        <ul v-if="isBatch || isCustom" class="selectadd">
          <li>
            <el-button @click="addbtn" type="primary" class="addstyle"
              >单个添加订单</el-button
            >
          </li>
          <li v-if="isBatch">
            <el-button @click="batchbtn" type="primary" class="addstyle"
              >批量添加订单</el-button
            >
          </li>
          <li v-if="isCustom">
            <el-button @click="custombtn" type="primary" class="addstyle"
              >添加自定义订单</el-button
            >
          </li>
        </ul>
      </el-button>
      <el-button @click="updateClick" icon="el-icon-edit" type="warning"
        >编辑</el-button
      >
      <el-button v-if="!isExpire" @click="cancelOrder" type="danger"
        >取消订单</el-button
      >
      <el-button @click="orderInfobtn" icon="el-icon-view" type="info"
        >查看订单详情</el-button
      >
      <!-- <el-button @click="refundbtn" type="primary">退费</el-button> -->
      <el-button @click="printReceipt" type="danger">打印小票</el-button>
      <el-button @click="printCredentials" type="primary"
        >打印二维码凭据</el-button
      >
      <el-button @click="exportbtn" type="warning">导出</el-button>
    </div>

    <jaya-table-group
      v-if="!visibleinfo"
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
    <!-- 单个/批量添加 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="visible"
      width="740px"
      append-to-body
      :title="title"
    >
      <el-form
        class="dialogForm"
        ref="forms"
        :model="form"
        :rules="rules"
        :inline="true"
        label-width="200px"
      >
        <div class="orderMes">
          <el-form-item label="驾校名称" prop="drvSchoolId">
            <jaya-select
              :disabled="ispayFalseEdit"
              type="SS"
              :parameter="JSON.stringify(querySelect)"
              v-model="form.drvSchoolId"
              filterable
              placeholder="请选择"
            ></jaya-select>
          </el-form-item>
          <el-form-item label="姓名" prop="createRealName">
            <el-input
              :disabled="ispayFalseEdit"
              v-model="form.createRealName"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="手机号" prop="createPhone">
            <el-input
              :disabled="ispayFalseEdit"
              v-model="form.createPhone"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="身份证号" prop="idCard">
            <el-input
              :disabled="ispayFalseEdit"
              v-model="form.idCard"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>

          <el-form-item label="车型" prop="carType">
            <el-select
              v-model="form.carType"
              size="small"
              :disabled="isCustomEdit"
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
          <el-form-item label="号牌号码">
            <el-input
              size="small"
              :disabled="true"
              style="width: 150px"
              v-model="form.hphm"
              placeholder="号牌号码"
              clearable
            />
          </el-form-item>
          <el-form-item
            :label="`练车日期(有效期${orderValidity}天）`"
            prop="useDate"
          >
            <el-date-picker
              :disabled="isUseDateEdit"
              v-model="form.useDate"
              :picker-options="pickerOptions"
              type="date"
              size="small"
              value-format="yyyy-MM-dd"
              style="width: 100%"
              placeholder="年/月/日"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="科目" prop="subject">
            <el-radio-group v-model="form.subject">
              <el-radio-button :disabled="isCustomEdit" label="2"
                >科目二</el-radio-button
              >
              <el-radio-button :disabled="isCustomEdit" label="3"
                >科目三</el-radio-button
              >
            </el-radio-group>
          </el-form-item>

          <el-form-item label="计费类型" prop="chargeWay">
            <el-radio-group v-model="form.chargeWay">
              <el-radio-button :disabled="isCustomEdit" label="0"
                >按时计费</el-radio-button
              >
              <el-radio-button :disabled="isCustomEdit" label="1"
                >按圈计费</el-radio-button
              >
            </el-radio-group>
            <div>
              <span style="margin-left: 20px">每小时{{ timeChargeKm }}元</span
              ><span style="margin-left: 40px">每圈{{ cycleChargeKm }}元</span>
            </div>
          </el-form-item>

          <el-form-item
            v-if="discount.length == 2 && !discount[0] && !discount[1]"
            label="优惠类型"
            prop="asd"
          >
            <div
              style="
                width: 220px;
                height: 40px;
                color: red;
                text-align: center;
                border: 1px solid #dcdfe6;
              "
            >
              未启用优惠
            </div>
          </el-form-item>

          <el-form-item v-else label="优惠类型" prop="inSchool">
            <el-radio-group v-model="form.inSchool">
              <el-radio-button :disabled="isCustomEdit" label="1"
                >校内优惠</el-radio-button
              >
              <el-radio-button :disabled="isCustomEdit" label="0"
                >校外优惠</el-radio-button
              >
            </el-radio-group>
            <div class="el-radio-group-school">
              <div>{{ discountContext[1] }}</div>
              <div>{{ discountContext[0] }}</div>
            </div>
          </el-form-item>
          <el-form-item
            :label="form.chargeWay == 0 ? '订单时长(分钟)' : '订单圈数(圈)'"
            prop="initDuration"
          >
            <el-input
              :disabled="isCustomEdit"
              v-model="form.initDuration"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="应缴金额(元)" prop="payableAmount">
            <el-input v-model="payable" size="small" disabled />
          </el-form-item>
          <el-form-item label="实缴金额(元)" prop="amountMoney">
            <el-input
              :disabled="isCustomEdit"
              v-model="form.amountMoney"
              size="small"
            />
          </el-form-item>

          <el-form-item label="订单数量" prop="count" v-if="operating == 2">
            <el-input
              :disabled="isCustomEdit"
              v-model="form.count"
              size="small"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item
            label="驾校名称"
            prop="schoolAlias"
            v-if="operating !== 1"
          >
            <el-input
              :disabled="isCustomEdit"
              v-model="form.schoolAlias"
              size="small"
              placeholder="最多可输入6个汉字"
            />
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              v-model="form.remark"
              style="width: 680px"
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
        <el-button @click="visible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 添加自定义菜单 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="freeOpen"
      width="740px"
      append-to-body
      :title="title"
    >
      <el-form
        class="dialogForm"
        :model="form"
        ref="formCustom"
        :rules="rules"
        label-width="100px"
        :inline="true"
      >
        <el-form-item label="驾校名称" prop="drvSchoolId">
          <jaya-select
            :disabled="isCustomEdit"
            type="SS"
            :parameter="JSON.stringify(querySelect)"
            v-model="form.drvSchoolId"
            filterable
            placeholder="请选择"
          ></jaya-select>
        </el-form-item>
        <el-form-item label="姓名" prop="createRealName">
          <el-input
            :disabled="isCustomEdit"
            v-model="form.createRealName"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="手机号" prop="createPhone">
          <el-input
            :disabled="isCustomEdit"
            v-model="form.createPhone"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input
            :disabled="isCustomEdit"
            v-model="form.idCard"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="实缴金额" prop="amountMoney">
          <el-input
            :disabled="isCustomEdit"
            v-model="form.amountMoney"
            size="small"
            placeholder="请输入"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            :disabled="isCustomEdit"
            v-model="form.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入"
            size="small"
            style="width: 680px"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="customSub">保 存</el-button>
        <el-button @click="freeOpen = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 退费 -->
    <!-- <el-dialog
      :close-on-click-modal="false"
      :visible.sync="refundOpen"
      width="450px"
      append-to-body
      title="退费说明"
    >
      <el-form
        class="dialogForm"
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="应退金额" prop="id">
          <el-input v-model="form.id" size="small" />
        </el-form-item>
        <el-form-item label="实退金额" prop="id">
          <el-input v-model="form.id" size="small" />
        </el-form-item>

        <el-form-item label="退费说明" prop="memo">
          <el-input
            v-model="form.memo"
            type="textarea"
            :rows="2"
            placeholder="请输入"
            size="small"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="refundSubmitForm">保 存</el-button>
        <el-button @click="refundOpen = false">取 消</el-button>
      </div>
    </el-dialog> -->
    <!-- 打印小票 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="printReceiptOpen"
      width="300px"
      append-to-body
    >
      <div style="height: 560px" id="receipt-code">
        <div class="titletips">收费凭据</div>
        <div class="yzm">
          <p v-if="multipleSelection">{{ multipleSelection.captcha }}</p>
          <span class="tips">验证码</span>
        </div>
        <ul v-if="printReceiptOpen" class="receipt_order">
          <li>
            <span class="left">用户姓名:</span>
            <span class="right">{{ multipleSelection.createRealName }}</span>
          </li>
          <li>
            <span class="left">联系方式:</span>
            <span class="right">{{ multipleSelection.createPhone }}</span>
          </li>
          <li>
            <span class="left">实缴金额:</span>
            <span class="right">{{ multipleSelection.amountMoney }}元</span>
          </li>
          <li>
            <span class="left">训练车型:</span>
            <span class="right">{{ multipleSelection.carType }}</span>
          </li>
          <li>
            <span class="left">训练科目:</span>
            <span class="right">{{
              multipleSelection.subject == 2 ? "科目二" : "科目三"
            }}</span>
          </li>
          <li>
            <span class="left">订单时长:</span>
            <span class="right"
              >{{ multipleSelection.initDuration
              }}{{ multipleSelection.chargeWay == 0 ? "分钟" : "圈" }}</span
            >
          </li>
          <li>
            <span class="left">练车日期:</span>
            <span class="right">{{ multipleSelection.useDate }}</span>
          </li>
        </ul>
        <span class="bottomTitle">本验证码仅可在有效期内使用，请勿超期</span>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" v-print="print" @click="printReceiptform"
          >打印</el-button
        >
      </div>
    </el-dialog>
    <!-- 计时 计圈 详情 -->
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
            <div class="titleOrder">
              {{
                form.chargeWay == 0
                  ? "订单详情（计时订单）"
                  : "订单详情（计圈订单）"
              }}
              <!-- {{
                form.chargeWay == 0
                  ? "订单详情（计时订单）"
                  : form.chargeWay == 1
                  ? "订单详情（计圈订单）"
                  : "自定义"
              }} -->
            </div>
            <div>
              <el-form-item label="订单编号" prop="id">
                <el-input v-model="form.id" size="small" />
              </el-form-item>
              <el-form-item label="订单类型" prop="orderType">
                <el-input v-model="form.orderType" size="small" />
                <!-- <el-select
                  clearable
                  v-model="form.orderType"
                  size="small"
                  placeholder="订单类型"
                >
                  <el-option
                    v-for="item in [
                      { value: 0, label: '模拟器' },
                      { value: 1, label: '机器人教练' },
                      { value: 2, label: '易学通' },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select> -->
              </el-form-item>
              <el-form-item label="订单状态" prop="status">
                <el-select
                  clearable
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
              <el-form-item label="验证码" prop="captcha">
                <el-input
                  v-if="!(form.status == 1 || form.status == 5)"
                  v-model="form.captcha"
                  size="small"
                />
                <el-input v-else value="—— ——" size="small" />
              </el-form-item>
              <el-form-item label="操作人" prop="operator">
                <el-input v-model="form.operator" size="small" />
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
                      { value: 3, label: '科目三' },
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
                      { value: 0, label: `按时计费(每小时${timeChargeKm}元)` },
                      { value: 1, label: `按圈计费(每圈${cycleChargeKm}元)` },
                    ]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="号牌号码">
                <el-input
                  size="small"
                  :disabled="true"
                  v-model="form.hphm"
                  placeholder="号牌号码"
                  clearable
                />
              </el-form-item>
              <el-form-item label="优惠类型" prop="discountContent">
                <el-input v-model="form.discountContent" size="small" />
              </el-form-item>
              <el-form-item label="应缴金额" prop="payableAmount">
                <el-input v-model="form.payableAmount" size="small">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="实缴金额" prop="amountMoney">
                <el-input v-model="form.amountMoney" size="small">
                  <template slot="append">元</template>
                </el-input>
              </el-form-item>
              <el-form-item label="订单时长" prop="initDuration">
                <el-input v-model="form.initDuration" size="small"> </el-input>
              </el-form-item>
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
              <!-- <el-form-item label="退款金额" prop="drvSchoolName">
                <el-input v-model="form.drvSchoolName" size="small" />
              </el-form-item> -->
              <!-- <el-form-item label="退费说明" prop="drvSchoolName">
                <el-input v-model="form.drvSchoolName" size="small" />
              </el-form-item> -->
              <el-form-item label="备注信息" prop="remark">
                <el-input v-model="form.remark" size="small" />
              </el-form-item>
            </div>
          </el-form>
          <div
            style="margin-top: 20px"
            v-if="form.chargeWay == 0 || form.chargeWay == 1"
          >
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
                }}</template></el-table-column
              >
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
            <el-button @click="handleCancel">取 消</el-button>
          </div>
        </div>
      </div>
    </div>
    <!-- 自定义订单详情 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="ordersInfo"
      width="750px"
      append-to-body
      title="自定义订单详情"
    >
      <el-form
        class="dialogForm"
        :model="form"
        :rules="rules"
        label-width="100px"
        :inline="true"
        disabled
      >
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
        <!-- <el-form-item label="订单编号" prop="id">
          <el-input v-model="form.id" size="small" />
        </el-form-item> -->
        <el-form-item label="实缴金额" prop="amountMoney">
          <el-input v-model="form.amountMoney" size="small" />
        </el-form-item>
        <!-- <el-form-item label="支付方式" prop="payType">
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
        </el-form-item> -->
        <el-form-item label="下单时间" prop="createTime">
          <el-input v-model="form.createTime" size="small" />
        </el-form-item>
        <el-form-item label="操作人" prop="operator">
          <el-input v-model="form.operator" size="small" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="form.remark"
            type="textarea"
            :rows="2"
            placeholder="请输入"
            size="small"
            style="width: 680px"
          />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="ordersInfo = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 训练详情 -->
    <Details :key="key" :visible.sync="visibleOpen" :option="option"></Details>
    <!-- 打印二维码凭据 -->
    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="codeOpen"
      width="350px"
      append-to-body
      title="二维码凭据"
    >
      <el-form
        class="dialogForm"
        :model="form"
        ref="form"
        :rules="rules"
        label-width="80px"
      >
        <div class="yzm">
          <div id="receipt-codes">
            <div v-if="!isAllCode && multipleSelection">
              <qr-code
                :key="multipleSelection.id"
                :code="JSON.stringify({ data: multipleSelection.id, type: 4 })"
              />
              <div class="code_name">
                {{ multipleSelection.schoolAlias }}
              </div>
            </div>
            <div v-else>
              <div v-for="(item, index) in batchCodeList" :key="index">
                <qr-code
                  :key="item.data"
                  :code="JSON.stringify({ data: item.data, type: 4 })"
                />
                <div class="code_name">
                  {{ multipleSelection.schoolAlias }}
                </div>
              </div>
            </div>
          </div>
          <div>
            <el-button v-print="printCode" class="printstyle" type="primary"
              >打印</el-button
            >
          </div>
          <div style="margin: 30px 50px">
            <span v-if="!isAllCode">此订单为批量创建,</span>
            共{{ batchCodeList.length }}个二维码
            <span v-if="!isAllCode"
              >，点击以下链接可以打印批量创建的所有订单的二维码</span
            >
          </div>
          <div v-if="!isAllCode" @click="isAllCode = true" class="all_code">
            所有订单二维码
          </div>
        </div>
      </el-form>

      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="printReceiptform">打印</el-button>
      </div> -->
    </el-dialog>
  </div>
</template>

<script>
import {
  ordersPage,
  ordersAdd,
  addBatch,
  addCustom,
  ordersCancel,
  ordersUpdate,
  ordersInfo,
  standardChargeConfig,
  discountRule,
  orderRuleSet,
  ordersList,
  batchOrderno,
  orderPageList,
} from "@/api/yxt/order";
import { getCarType, getOrder } from "@/api/yxt/rule";
import { parseTime } from "@/utils/jaya";
import { getInfoProject, getStudentTrainInfo } from "@/api/cloud/train";
import { getToken } from "@/utils/auth";
import Details from "../../train/components/Details";
let time;
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
const column = function () {
  return [
    {
      title: "订单编号",
      prop: "id",
      width: "200",
    },
    {
      title: "订单金额",
      prop: "amountMoney",
      slotFn: (row) => `￥${row.amountMoney}`,
    },
    {
      title: "订单时长",
      prop: "initDuration",
      slotFn: (row) =>
        `${row.initDuration}${row.chargeWay == 0 ? "分钟" : "圈"}`,
    },
    {
      title: "已用时长",
      slotFn: (row) =>
        `${row.initDuration - row.remainDuration || 0}${
          row.chargeWay == 0 ? "分钟" : "圈"
        }`,
    },
    {
      title: "用户姓名",
      prop: "createRealName",
    },
    {
      title: "手机号",
      prop: "createPhone",
      width: "300",
    },
    {
      title: "科目",
      prop: "subject",
      status: () => this.subTypeOptions,
    },
    {
      title: "车型",
      prop: "carType",
    },
    {
      title: "号牌号码",
      prop: "hphm",
    },
    {
      title: "计费类型",
      prop: "chargeWay",
      status: () => this.chargeWayOptions,
    },
    {
      title: "练车日期",
      prop: "useDate",
    },
    {
      title: "订单有效期",
      prop: "effectiveDays",
      slotFn: (row) => `${row.effectiveDays}天`,
    },
    {
      title: "订单状态",
      prop: "status",
      status: () => this.orderTypeOptions,
    },
    {
      title: "下单时间",
      prop: "createTime",
      width: "200",
    },
    {
      title: "操作人",
      prop: "operator",
      width: "200",
    },
    {
      title: "驾校名称",
      prop: "drvSchoolName",
    },
  ];
};
export default {
  name: "yxtorderManagement",
  components: { Details },
  data() {
    return {
      print: {
        id: "receipt-code",
      },
      printCode: { id: "receipt-codes" },
      column: column.call(this),
      visible: false,
      visibleOpen: false,
      visibles: false,
      freeOpen: false,
      refundOpen: false,
      printReceiptOpen: false,
      turnVisible: false,
      visibleinfo: false,
      codeOpen: false,
      ordersInfo: false,
      form: {},
      // 弹出层标题
      title: "",
      tableList: [],
      tableData: [],
      subject: {},
      chargeWay: {},
      discount: [],
      isCustomEdit: false,
      ispayFalseEdit: false,
      isUseDateEdit: false,
      // option: {
      //   isRadio: true,
      // },
      carTypeOptions: [],
      cycleChargeKm: "0",
      timeChargeKm: "0",
      subTypeOptions: [
        {
          value: 2,
          label: "科目二",
        },
        {
          value: 3,
          label: "科目三",
        },
      ],
      chargeWayOptions: [
        {
          value: 0,
          label: "按时计费",
        },
        {
          value: 1,
          label: "按圈计费",
        },
        {
          value: 2,
          label: "自定义",
        },
      ],
      discountTypeOptions: [
        {
          value: 1,
          label: "校内优惠（满2小时减10元）",
        },
        {
          value: 2,
          label: "校外优惠（每满2小时减10元）",
        },
      ],
      payTypeOptions: [
        {
          value: 0,
          label: "在线支付",
        },
        {
          value: 1,
          label: "线下支付",
        },
      ],
      schoolOptions: [],
      orderTypeOptions: [
        // {
        //   value: 0,
        //   label: "支付失败",
        // },
        {
          value: 9,
          label: "已支付",
        },
        {
          value: 1,
          label: "已支付（待激活）",
        },
        {
          value: 2,
          label: "使用中",
        },
        {
          value: 3,
          label: "已完成",
        },
        {
          value: 4,
          label: "已过期",
        },
        {
          value: 5,
          label: "已关闭",
        },
        {
          value: 6,
          label: "已退费",
        },
        {
          value: 7,
          label: "异常单",
        },
        {
          value: 8,
          label: "支付失败",
        },
      ],
      // 数据
      data: [],
      isExpire: false,
      // 总条数
      total: 0,
      // table入参
      querySelect: {},
      option: {
        isRadio: true,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        desc: "createTime",
        useDate: parseTime(new Date(), "{y}-{m}-{d}"),
      },
      date: [
        this.parseTime(new Date(), "{y}-{m}-{d}"),
        this.parseTime(new Date(), "{y}-{m}-{d}"),
      ],
      typeOptions: [],
      discountContext: ["", ""],
      studentOptions: [],
      // table Loading框
      tableLoading: false,
      multipleSelection: null,
      rules: {
        drvSchoolId: [{ required: true, trigger: "blur", message: "必填项" }],
        createRealName: [
          { required: true, trigger: "blur", message: "必填项" },
        ],
        count: [{ required: true, trigger: "blur", message: "必填项" }],
        schoolAlias: [
          { required: true, trigger: "blur", message: "必填项" },
          { pattern: /^[\u4e00-\u9fa5]{1,6}$/, message: "请输入1-6个汉字" },
        ],
        createPhone: [
          {
            pattern: /^(?:(?:\+|00)86)?1[3-9]\d{9}$/,
            message: "请输入正确的手机号",
          },
          { required: true, trigger: "blur", message: "必填项" },
        ],
        idCard: [
          {
            pattern:
              /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0\d|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/,
            message: "请输入正确的证件号",
          },
          { required: true, trigger: "blur", message: "必填项" },
        ],
        carType: [{ required: true, trigger: "blur", message: "必填项" }],
        subject: [{ required: true, trigger: "blur", message: "必填项" }],
        chargeWay: [{ required: true, trigger: "blur", message: "必填项" }],
        inSchool: [{ required: true, trigger: "blur", message: "必填项" }],
        initDuration: [{ required: true, trigger: "blur", message: "必填项" }],
        amountMoney: [{ required: true, trigger: "blur", message: "必填项" }],
        useDate: [{ required: true, trigger: "blur", message: "必填项" }],
      },
      operating: 0, //1 单个添加 2 多个添加 3 自定义 4编辑 5详情
      isShowCode: true,
      orderValidity: "",
      isNewShowCode: true,
      batchCodeList: [],
      isAllCode: false,
      isBatch: 1,
      isCustom: 1,
      key: 0,
      pickerOptions: {
        disabledDate: function (t) {
          return t < Date.now() - 86400000;
        },
      },
    };
  },
  watch: {
    "queryParams.pageNum": function () {
      this.$refs.jayaCurrent.current("setCurrent")();
    },
    "queryParams.status": function () {
      // this.getTableList();
    },
    "queryParams.drvSchoolId": function (drvSchoolId) {
      getCarType({ drvSchoolId }).then((res) => {
        this.carTypeOptions = res.data;
      });
      //查询是否批量,自定义
      getOrder({ drvSchoolId }).then((res) => {
        if (res.data.length) {
          this.isBatch = res.data[0].isBantchOrder;
          this.isCustom = res.data[0].isCustomOrder;
        }
      });
    },
    "form.drvSchoolId": function (drvSchoolId) {
      if (drvSchoolId) {
        getCarType({ drvSchoolId, isOn: 1 }).then((res) => {
          this.carTypeOptions = res.data;
          this.form = {
            ...this.form,
            // carType: null,
            // subject: null,
            // chargeWay: null,
            // inSchool: null,
          };
        });
        orderRuleSet({ drvSchoolId: drvSchoolId }).then(({ data }) => {
          if (data) {
            this.isShowCode = data.isInputCode == 0;
            this.orderValidity = data.orderValidity;
          }
        });
      } else {
        this.isShowCode = true;
        this.orderValidity = "";
      }

      this.getStandardChargeConfig();
      this.getDiscountRule();
    },
    "form.chargeWay": function (value) {
      this.getDiscountRule();
    },
    "form.carType": function () {
      this.getStandardChargeConfig();
      this.getDiscountRule();
    },
    "form.subject": function (subject) {
      this.getStandardChargeConfig();
      this.getDiscountRule();
    },
    // "multipleSelection.drvSchoolId": function (drvSchoolId) {
    //   if (drvSchoolId) {
    //     orderRuleSet({ drvSchoolId }).then(({ data }) => {
    //       if (data) {
    //         this.isNewShowCode = data.isInputCode == 0;
    //       }
    //     });
    //   }
    // },
  },
  mounted() {
    this.getTableList();
  },
  computed: {
    getCodeData() {
      const { multipleSelection } = this;

      return JSON.stringify({ data: multipleSelection.id, type: 4 });
    },
    payable() {
      const { timeChargeKm, cycleChargeKm, operating } = this;
      const { initDuration, inSchool, chargeWay } = this.form;

      const chargeTypeUnit = [60, 1]; // 计时及计圈计算方式
      const cycleType = [timeChargeKm, cycleChargeKm]; // 计时及计圈优惠标准

      let value = initDuration;

      if (this.discount[inSchool]) {
        const { discountStandard, discountType, discount, chargeType } =
          this.discount[inSchool];

        value =
          (initDuration / chargeTypeUnit[chargeWay]) * cycleType[chargeWay];

        if (chargeType != 2) {
          if (
            discountType == 0 &&
            discountStandard <= initDuration / chargeTypeUnit[chargeWay]
          ) {
            value =
              (initDuration / chargeTypeUnit[chargeWay]) *
                cycleType[chargeWay] -
              Math.floor(
                initDuration / chargeTypeUnit[chargeWay] / discountStandard
              ) *
                discount;
          } else if (
            discountType == 1 &&
            discountStandard <= initDuration / chargeTypeUnit[chargeWay]
          ) {
            value =
              ((initDuration / chargeTypeUnit[chargeWay]) *
                cycleType[chargeWay] *
                discount) /
              10;
          }
        } else {
          if (discountType == 0 && discountStandard <= value) {
            value = value - Math.floor(value / discountStandard) * discount;
          } else if (discountType == 1 && discountStandard <= value) {
            value = (value * discount) / 10;
          }
        }
      } else if (cycleType[chargeWay]) {
        value =
          (initDuration / chargeTypeUnit[chargeWay]) * cycleType[chargeWay];
      }
      value = value ? Number(value).toFixed(2) : 0;
      if (operating == 1 || operating == 2) {
        this.$set(this.form, "amountMoney", value);
      }
      return value; // 保留俩位小数
    },
  },
  methods: {
    parseTimes,
    getStandardChargeConfig() {
      const { carType, subject, drvSchoolId } = this.form;

      if (carType && subject && drvSchoolId) {
        standardChargeConfig({ drvSchoolId, carType, subject }).then((res) => {
          if (res.data) {
            this.timeChargeKm = res.data[`timeChargeKm${subject}`] || 0;
            this.cycleChargeKm = res.data[`cycleChargeKm${subject}`] || 0;
          }
        });
      }
    },
    getDiscountRule() {
      clearTimeout(time);

      time = setTimeout(() => {
        const { carType, subject, drvSchoolId, inSchool, chargeWay } =
          this.form;

        if (
          carType &&
          subject &&
          drvSchoolId &&
          (chargeWay == 0 || chargeWay == 1)
        ) {
          discountRule({ drvSchoolId, carType, subject, chargeWay }).then(
            (res) => {
              const chargeType = ["小时", "圈"];
              const school = { outSchool: 0, inSchool: 1 };

              this.discount = [res.data.outSchool, res.data.inSchool];
              Object.keys(res.data).forEach((key) => {
                if (!res.data[key]) {
                  this.$set(this.discountContext, school[key], "");
                  return;
                }

                const { discountStandard, discountType, discount } =
                  res.data[key];

                if (res.data[key].chargeType != 2) {
                  // 计时,记圈
                  this.$set(
                    this.discountContext,
                    school[key],
                    `满${discountStandard}${chargeType[chargeWay]}${
                      discountType == 0
                        ? "减去" + discount + "元"
                        : "打" + discount + "折"
                    }`
                  );
                } else {
                  // 满减
                  this.$set(
                    this.discountContext,
                    school[key],
                    `满${discountStandard}元${
                      discountType == 0
                        ? "减去" + discount + "元"
                        : "打" + discount + "折"
                    }`
                  );
                }
              });
            }
          );
        }
      }, 400);
    },
    selectClick() {
      // this.queryParams.status = "";
      this.queryParams.pageNum = 1;
      this.getTableList();
    },
    handleDetailsClick(row) {
      this.key = Date.now();
      this.$nextTick(() => {
        this.option = { ...row, key: Date.now() };
      });
      // this.$router.push({
      //   name: "StudentDetails",
      //   query: { id, trainSubject }
      // });
    },

    //选择所在行date
    handleCurrentChange(val) {
      if (!val) return;
      const { useDate, effectiveDays, status } = (this.multipleSelection = val);
      const date = new Date(useDate);

      if (
        status != 8 ||
        (status == 8 &&
          parseTime(Date.now(), "{y}-{m}-{d}") <
            parseTime(
              date.getTime() + (effectiveDays - 1) * 86400000,
              "{y}-{m}-{d}"
            ))
      ) {
        this.isExpire = true;
      }
    },

    //查询列表
    getTableList() {
      ordersPage({
        ...this.queryParams,
        orderType: 2,
        createStartTime: this.date ? this.date[0] : "",
        createEndTime: this.date ? this.date[1] : "",
      }).then((res) => {
        this.tableList = res.records;
        this.total = Number(res.total);
      });
    },
    //单个添加
    addbtn(e) {
      this.form = {
        useDate: parseTime(Date.now(), "{y}-{m}-{d}"),
      };
      this.resetForm("forms");
      this.discount = [];
      this.discountContext = ["", ""];
      this.visible = true;
      this.operating = 1;
      this.title = "添加订单";
      this.isCustomEdit = false;
      this.ispayFalseEdit = false;
      this.isUseDateEdit = false;
      this.timeChargeKm = this.cycleChargeKm = 0;
      e.stopPropagation();
    },
    //取消
    handleCancel() {
      this.visibleinfo = false;
      this.form = {};
    },
    //批量添加
    batchbtn(e) {
      this.form = { useDate: parseTime(Date.now(), "{y}-{m}-{d}") };
      this.resetForm("forms");
      this.visible = true;
      this.operating = 2;
      this.discount = [];
      this.discountContext = ["", ""];
      this.$set(this.rules, "count", [
        { required: true, trigger: "blur", message: "必填项" },
      ]);
      this.$set(this.rules, "schoolAlias", [
        { required: true, trigger: "blur", message: "必填项" },
        { pattern: /^[\u4e00-\u9fa5]{1,6}$/, message: "请输入1-6个汉字" },
      ]);

      this.resetForm("forms");
      this.isCustomEdit = false;
      this.ispayFalseEdit = false;
      this.isUseDateEdit = false;
      this.timeChargeKm = this.cycleChargeKm = 0;
      e.stopPropagation();
    },
    // 自定义
    custombtn(e) {
      this.form = {};
      this.resetForm("formCustom");
      this.freeOpen = true;
      this.isCustomEdit = false;
      this.operating = 3;
      this.title = "添加自定义订单";
      e.stopPropagation();
    },
    //编辑
    updateClick() {
      this.form = {};
      this.$set(this.rules, "count", []);
      this.$set(this.rules, "schoolAlias", []);
      this.resetForm("forms");
      this.operating = 4;
      if (this.multipleSelection) {
        const { id, chargeWay, useDate, effectiveDays, status } =
          this.multipleSelection;
        const date = new Date(useDate);
        if (status == 8) {
          //练车日期过期前
          if (
            parseTime(Date.now(), "{y}-{m}-{d}") <
            parseTime(
              date.getTime() + (effectiveDays - 1) * 86400000,
              "{y}-{m}-{d}"
            )
          ) {
            //驾校 姓名 手机号 身份证号不可编辑
            this.ispayFalseEdit = true;
          } else {
            //练车日期过期后 除备注其他都不可编辑
            this.ispayFalseEdit = true;
            this.isCustomEdit = true;
            this.isUseDateEdit = true;
          }
        } else if (status == 1 || status == 4 || status == 9) {
          this.ispayFalseEdit = true;
          this.isCustomEdit = true;
        } else {
          this.ispayFalseEdit = true;
          this.isCustomEdit = true;
          this.isUseDateEdit = true;
        }
        ordersInfo({ id: id }).then((res) => {
          this.form = { ...res.data };
          this.title = "编辑订单";
          this[chargeWay == 2 ? "freeOpen" : "visible"] = true;
          // this.isCustomEdit = true;
        });
      } else {
        this.msgWarn("请选择一条数据");
      }
    },
    //单个/批量添加、编辑判断
    submitForm() {
      this.$refs["forms"].validate((valid) => {
        if (valid) {
          if (this.operating !== 5) {
            const { discountContext } = this;
            const { inSchool } = this.form;
            const form = {
              ...this.form,
              payableAmount: this.payable,
              discountContent: discountContext[inSchool]
                ? `${discountContext[inSchool]} (${
                    inSchool == 0 ? "校外" : "校内"
                  })`
                : "未设置",
            };
            if (this.operating == 1) {
              ordersAdd(form).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
                this.visible = false;
              });
            } else if (this.operating == 2) {
              addBatch(form).then(() => {
                this.getTableList();
                this.msgSuccess("新增成功");
                this.visible = false;
              });
            } else {
              const form = {};
              const field = ["id", "remark", "useDate"];
              field.forEach((key) => {
                form[key] = this.form[key];
              });
              ordersUpdate(form).then(() => {
                this.getTableList();
                this.msgSuccess("修改成功");
                this.visible = false;
              });
            }
          }
        }
      });
    },
    //自定义添加
    customSub() {
      this.$refs["formCustom"].validate((valid) => {
        if (valid) {
          if (this.operating == 3) {
            addCustom(this.form).then(() => {
              this.getTableList();
              this.msgSuccess("新增成功");
              this.freeOpen = false;
            });
          } else {
            const form = {};
            const field = ["id", "remark", "useDate"];
            field.forEach((key) => {
              form[key] = this.form[key];
            });
            ordersUpdate(form).then(() => {
              this.getTableList();
              this.msgSuccess("修改成功");
              this.freeOpen = false;
            });
          }
        }
      });
    },
    play(id) {
      this.src = `/ol.html?id=${id}&env=${
        process.env.NODE_ENV
      }&VUE_APP_BASE_API=${
        process.env.VUE_APP_BASE_API
      }&token=Bearer${getToken()}`;
    },
    //详情
    orderInfobtn() {
      if (this.multipleSelection) {
        if (
          this.multipleSelection.chargeWay == 0 ||
          this.multipleSelection.chargeWay == 1
        ) {
          const { id } = this.multipleSelection;
          const { orderValidity } = this;
          ordersInfo({ id: id }).then(({ data }) => {
            this.operating = 5;
            const { drvSchoolId } = (this.form = data);
            this.title = "详情";
            getOrder({ drvSchoolId }).then((res) => {
              this.visibleinfo = true;
              if (res.data.length) {
                this.orderValidity = res.data[0].orderValidity;
                this.circleMaxTime = res.data[0].circleMaxTime;
                this.$set(
                  this.form,
                  "orderType",
                  data.reusable ? "多次用订单" : "一次用订单"
                );
                this.$set(
                  this.form,
                  "useDate",
                  `${data.useDate || ""}(有效期${data.effectiveDays}天)`
                );
                this.$set(
                  this.form,
                  "initDuration",
                  `${data.initDuration || ""}${
                    this.multipleSelection.chargeWay == 1
                      ? `圈(每圈最大用时${data.circleMaxTime}分钟)`
                      : "分钟"
                  }`
                );
              }
            });
            orderPageList({ id: id }).then((res) => {
              this.tableData = res.data;
            });
          });
        } else {
          const { id } = this.multipleSelection;
          ordersInfo({ id: id }).then(({ data }) => {
            const { drvSchoolId } = (this.form = data);
            this.operating = 5;
            this.form = data;
            this.title = "详情";
            getOrder({ drvSchoolId }).then((res) => {
              this.ordersInfo = true;
              if (res.data.length) {
                this.$set(
                  this.form,
                  "orderType",
                  res.data[0].orderType ? "多次用订单" : "一次用订单"
                );
              }
            });
          });
        }
      } else {
        this.msgWarn("请选择一条数据");
      }
    },
    //退费
    // refundbtn() {
    //   this.refundOpen = true;
    // },
    //退费
    // refundSubmitForm() {},
    //打印小票
    printReceipt() {
      if (this.multipleSelection) {
        if ([8, 5, 1].includes(this.multipleSelection.status)) {
          this.msgWarn("只有已缴纳费用且已激活的订单才可以打印订单小票。");
        } else {
          this.printReceiptOpen = true;
        }
      } else {
        this.msgWarn("请选择一条数据");
      }
    },
    //打印
    printReceiptform() {},
    //打印凭据
    printCredentials() {
      this.isAllCode = false;
      if (this.multipleSelection) {
        if (this.multipleSelection.batchNo) {
          batchOrderno({ batchNo: this.multipleSelection.batchNo }).then(
            (res) => {
              this.codeOpen = true;
              this.batchCodeList = res.data;
            }
          );
        } else {
          this.msgWarn("请选择一条为批量添加的数据");
        }
      } else {
        this.msgWarn("请选择一条数据");
      }
    },
    //导出
    exportbtn() {
      const loading = this.$loading({
        lock: true,
        text: "正在导出...",
        spinner: "el-icon-loading",
      });
      ordersList({ ...this.queryParams, pageSize: 999999999, orderType: 2, createStartTime: this.date ? this.date[0] : "",
        createEndTime: this.date ? this.date[1] : "", })
        .then((res) => {
          const link = document.createElement("a");
          const blob = new Blob([res], { type: "application/vnd.ms-excel" });
          if (window.navigator.msSaveOrOpenBlob) {
            navigator.msSaveBlob(blob, "订单信息.xlsx");
            return;
          }
          link.style.display = "none";
          //设置连接
          link.href = URL.createObjectURL(blob);
          link.download = "订单信息";
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
    //取消订单
    cancelOrder() {
      if (this.multipleSelection) {
        const { id } = this.multipleSelection;
        this.$confirm("是否确认取消订单?", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(function () {
            return ordersCancel({ id });
          })
          .then(() => {
            this.getTableList();
            this.msgSuccess("取消成功！");
          })
          .catch(() => {});
      } else {
        this.msgWarn("请选择一条数据");
      }
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

.el-radio-group-school {
  display: flex;
  div {
    flex: 1;
    font-size: 12px;
    text-align: center;
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
.titleOrder {
  font-size: 18px;
  margin: 20px 2px;
  color: #909399;
}

.el-select .el-input {
  width: 130px;
}

/deep/ .el-dialog__body .el-form-item .el-form-item__label {
  display: block;
}

/deep/ .el-dialog__title {
  margin: auto;
  display: block;
  text-align: center;
}

/deep/.el-dialog__body {
  position: relative;
}

/deep/.el-tooltip {
  .el-button {
    background: #49bbc5;
    border-radius: 16px;
    color: white;
    padding: 4px 15px;
  }
}
/deep/.el-dialog__body .el-input__inner {
  width: 221px;
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
  // .orderMes {
  //   margin-top: 30px;
  // }
}
.code_name {
  text-align: center;
  font-size: 18px;
}
.printstyle {
  margin-top: 20px;
}
.custom-dialog .custom-dialog-con .el-form {
  padding: 10px 30px;
}

.avatar-uploader-file {
  position: absolute;
  top: 10px;
  right: 110px;
}
.addstyleselect {
  position: relative;
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
.all_code {
  color: rgb(0, 119, 255);
  cursor: pointer;
}
.addstyleselect:hover .selectadd {
  display: block;
}
.hrstyle {
  border: 1px rgb(134, 133, 133) dashed;
}
.yzm {
  text-align: center;
  margin: 0 auto;
  // font-weight: bold;
  p {
    margin: 0;
    padding: 0;
    font-size: 40px;
    // margin-bottom: 10px;
  }
  .tips {
    // padding: 4px;
    background: rgb(240, 239, 239);
    border-radius: 4px;
    // margin-top: 10px;
    font-size: 13px;
    transform: scale(0.8);
    color: rgb(186, 184, 184);
    display: inline-block;
  }
}
.bottomTitle {
  border-bottom: dashed 1px rgb(238, 233, 233);
  display: block;
  text-align: center;
  font-size: 12px;
  transform: scale(0.8);
  height: 60px;
  color: rgb(186, 184, 184);
}
.titletips {
  margin: 10px auto 20px;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
}
.receipt_order {
  margin-top: 15px;
  border-top: 1px gainsboro dashed;
  border-bottom: 1px gainsboro dashed;
  padding: 10px 0;
  li {
    height: 25px;
    line-height: 25px;
    font-size: 12px;
    box-sizing: border-box;
    padding-left: 10px;
    .right {
      color: #909399;
      margin-left: 12px;
    }
  }
}
/deep/.el-radio-button--medium .el-radio-button__inner {
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 0;
  width: 110px;
}
.dialog-content {
  height: 650px;
  border: 2px solid #eff0f1;
  border-radius: 0px 0px 2px 2px;
  background: #ffffff;
}
.item-tap {
  display: flex;
  height: 85px;
  background: #eff0f1;
  padding: 12px 12px 0;
}

.item-tap > li {
  height: 60px;
  background: #eafdff;
  border-radius: 2px;
  padding: 10px 15px;
  cursor: pointer;
  margin-right: 12px;
}

/deep/.item-tap > .activ > p {
  color: white;
}
/deep/.item-tap > .activ {
  height: 72px;
  background: #2da7b2;
  transition: all 0.4s;
}

/deep/.item-tap > li > p {
  color: #333333;
  font-size: 16px;
  margin: 0;
  text-align: center;
}
.details0 {
  height: 565px;
  padding: 0 12px;
  > div {
    min-height: 112px;
    border-bottom: 1px dashed #c9cdd2;
    box-sizing: border-box;
    padding: 12px 0;
    .title {
      font-size: 16px;
      color: #000000;
      font-weight: 600;
      margin: 12px 0;
    }
    ul {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      li {
        width: 50%;
        display: flex;
        align-items: center;
        p {
          margin: 0;
          width: 21px;
          height: 21px;
          border-radius: 50%;
          background: #dbdbdb;
          font-size: 10px;
          color: #333333;
          text-align: center;
          margin-right: 6px;
          line-height: 21px;
        }
        .name {
          margin-right: 70px;
          margin-left: 0;
          font-size: 16px;
          color: #2da7b2;
        }
        span {
          margin-left: 50px;
          color: #444444;
          font-size: 16px;
        }
      }
    }
  }
}
.details1 {
  height: 565px;
  padding: 0 12px;
  .content-nav {
    width: 60%;
    display: flex;
    margin: 25px 0;
    li {
      display: flex;
      flex: 1;
      align-items: center;
      > div {
        margin-left: 15px;
      }
      img {
        height: 46px;
      }
      p {
        font-size: 16px;
        color: #444444;
      }
    }
  }
  .map-container {
    display: flex;
    width: 100%;
    .left {
      width: 45%;
      .map {
        width: 100%;
        height: 380px;
        background: #eff0f1;
        border-radius: 6px;
        margin-right: 20px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        background: url("../../../assets/images/gj.jpg") no-repeat center 100%
          100%;
        img {
          width: 50px;
        }
      }
    }
    .right {
      width: 55%;
      height: 460px;
      overflow-y: scroll;
      box-sizing: border-box;
      padding: 0 10px;
      > div {
        min-height: 112px;
        border-bottom: 1px dashed #c9cdd2;
        box-sizing: border-box;
        padding: 12px 0;
        .title {
          font-size: 16px;
          color: #000000;
          font-weight: 600;
          margin: 12px 0;
          .fraction {
            margin: 0 20px;
          }
          .date {
            font-size: 16px;
            color: #666666;
            font-weight: 400;
          }
        }
        ul {
          width: 100%;
          display: flex;
          flex-wrap: wrap;
          li {
            width: 100%;
            display: flex;
            margin-bottom: 12px;
            // align-items: center;
            .fraction {
              color: red;
              margin-left: 0;
            }
            .play {
              width: 21px;
              height: 21px;
              margin-left: 6px;
              cursor: pointer;
            }
            p {
              margin: 0;
              width: 21px;
              height: 21px;
              border-radius: 50%;
              background: #dbdbdb;
              font-size: 10px;
              color: #333333;
              text-align: center;
              margin-right: 6px;
              line-height: 21px;
              display: inline-block;
            }
            .name {
              width: calc(100% - 21px);
              margin-left: 0;
              font-size: 16px;
              color: #2da7b2;
            }
            span {
              margin-left: 20px;
              color: #444444;
              font-size: 16px;
            }
          }
        }
      }
    }
  }
}
.top-info {
  width: 100%;
  height: 86px;
  background: #ffffff;
  border: 1px dashed #c9cdd2;
  box-sizing: border-box;
  padding: 15px;
}

.top-info > div {
  margin-bottom: 8px;
  font-size: 16px;
  color: #444444;
}
p {
  margin: 0;
}
</style>
