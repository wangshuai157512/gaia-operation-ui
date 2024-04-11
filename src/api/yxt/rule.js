import request from "@/utils/request.js";

// 查询收费标准设置
export function getConfig(data) {
  return request({
    url: "/api/bg/operation/yxt/standardChargeConfig/info",
    method: "post",
    data: data
  });
}

// 删除收费标准设置
export function delConfig(data) {
  return request({
    url: "/api/bg/operation/yxt/standardChargeConfig/delete",
    method: "post",
    data: data
  });
}

// 保存收费标准设置
export function saveConfig(data) {
  return request({
    url: "/api/bg/operation/yxt/standardChargeConfig/save",
    method: "post",
    data: data
  });
}

// 查询优惠规则
export function getDiscount(data) {
  return request({
    url: "/api/bg/operation/yxt/discountRule/info",
    method: "post",
    data: data
  });
}

// 删除优惠规则
export function delDiscount(data) {
  return request({
    url: "/api/bg/operation/yxt/discountRule/delete",
    method: "post",
    data: data
  });
}

// 保存优惠规则
export function saveDiscount(data) {
  return request({
    url: "/api/bg/operation/yxt/discountRule/save",
    method: "post",
    data: data
  });
}

// 查询订单规则
export function getOrder(data) {
  return request({
    url: "/api/bg/operation/yxt/orderRuleSet/info",
    method: "post",
    data: data
  });
}

// 删除订单规则
export function delOrder(data) {
  return request({
    url: "/api/bg/operation/yxt/orderRuleSet/delete",
    method: "post",
    data: data
  });
}

// 保存订单规则
export function saveOrder(data) {
  return request({
    url: "/api/bg/operation/yxt/orderRuleSet/save",
    method: "post",
    data: data
  });
}

// 查询考试项目设置
export function getExam(data) {
  return request({
    url: "/api/bg/operation/yxt/examProjectSet/list",
    method: "post",
    data: data
  });
}

// 删除考试项目设置
export function delExam(data) {
  return request({
    url: "/api/bg/operation/yxt/examProjectSet/delete",
    method: "post",
    data: data
  });
}

// 保存考试项目设置
export function saveExam(data) {
  return request({
    url: "/api/bg/operation/yxt/examProjectSet/save",
    method: "post",
    data: data
  });
}

// 查询驾校考试项目选择列表
export function getSelect(data) {
  return request({
    url: "/api/bg/operation/yxt/examProjectSet/select/list",
    method: "post",
    data: data
  });
}

// 查询车型配置
export function getCarType(data) {
  return request({
    url: "/api/bg/operation/yxt/standardChargeConfig/findCarType",
    method: "post",
    data: data
  });
}

// 查询易学通预约规则
export function getReserve(data) {
  return request({
    url: "/api/bg/operation/yxt/reserve-rule/info",
    method: "post",
    data: data
  });
}

// 修改易学通预约规则
export function updateReserve(data) {
  return request({
    url: "/api/bg/operation/yxt/reserve-rule/update",
    method: "post",
    data: data
  });
}

// 清除收费标准设置和优惠规则
export function removeChargeConfig(data) {
  return request({
    url: "/api/bg/operation/yxt/standardChargeConfig/swap",
    method: "post",
    data: data
  });
}
