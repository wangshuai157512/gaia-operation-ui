import request from "@/utils/request.js";

// 驾校数量
export function schoolNumber() {
  return request({
    url: "/api/bg/operation/big-screen/school/number",
    method: "post"
  });
}

// 学员数量
export function studentNumber() {
  return request({
    url: "/api/bg/operation/big-screen/student/number",
    method: "post"
  });
}

// 今日登录人数
export function loginNumber() {
  return request({
    url: "/api/bg/operation/big-screen/login/number",
    method: "post"
  });
}

// 订单累计数量
export function orderNumber() {
  return request({
    url: "/api/bg/operation/big-screen/order/number",
    method: "post"
  });
}

// 订单总金额
export function sellNumber() {
  return request({
    url: "/api/bg/operation/big-screen/sell/number",
    method: "post"
  });
}

// 近7日订单趋势图
export function orderNumTrend() {
  return request({
    url: "/api/bg/operation/big-screen/order/num/trend",
    method: "post"
  });
}

// 设备分布统计
export function equipNumber(data) {
  return request({
    url: "/api/bg/operation/big-screen/equip/number",
    method: "post",
    data
  });
}

// 科目二扣分统计
export function subTwoDeduct() {
  return request({
    url: "/api/bg/operation/big-screen/subTwo/deduct",
    method: "post"
  });
}

// 科二通过率
export function subTwoPass() {
  return request({
    url: "/api/bg/operation/big-screen/subTwo/pass",
    method: "post"
  });
}

// 科三通过率【前五项】
export function subThreePass() {
  return request({
    url: "/api/bg/operation/big-screen/subThree/pass",
    method: "post"
  });
}

// 设备类型统计
export function equipType() {
  return request({
    url: "/api/bg/operation/big-screen/equip/type",
    method: "post"
  });
}

// 近一年订单数量按设备类型趋势统计
export function orderTypeTrend() {
  return request({
    url: "/api/bg/operation/big-screen/order/type/trend",
    method: "post"
  });
}

// 随机3条驾校信息
export function randomSchool() {
  return request({
    url: "/api/bg/operation/big-screen/equip/random",
    method: "post"
  });
}
