import request from "@/utils/request.js";

// 订单分页列表
export function ordersPage(data) {
    return request({
        url: "/api/bg/operation/orders/page",
        method: "post",
        data,
    });
}
// 新增单个订单
export function ordersAdd(data) {
    return request({
        url: "/api/bg/operation/orders/add",
        method: "post",
        data,
    });
}
// 新增批量订单
export function addBatch(data) {
    return request({
        url: "/api/bg/operation/orders/add/yxt/batch",
        method: "post",
        data,
    });
}
// 新增自定义订单
export function addCustom(data) {
    return request({
        url: "/api/bg/operation/orders/add/yxt/custom",
        method: "post",
        data,
    });
}
// 详情信息
export function ordersInfo(data) {
    return request({
        url: "/api/bg/operation/orders/info",
        method: "post",
        data,
    });
}
// 取消订单
export function ordersCancel(data) {
    return request({
        url: "/api/bg/operation/orders/cancel",
        method: "post",
        data,
    });
}
// 编辑
export function ordersUpdate(data) {
    return request({
        url: "/api/bg/operation/orders/update",
        method: "post",
        data,
    });
}
// 查询收费标准设置
export function standardChargeConfig(data) {
    return request({
        url: "/api/bg/operation/yxt/standardChargeConfig/info",
        method: "post",
        data,
    });
}
// 查询订单优惠规则
export function discountRule(data) {
    return request({
        url: "/api/bg/operation/yxt/discountRule/order/rule",
        method: "post",
        data,
    });
}
// 查询订单规则
export function orderRuleSet(data) {
    return request({
        url: "/api/bg/operation/yxt/orderRuleSet/order/info",
        method: "post",
        data,
    });
}
//导出
export function ordersList(data) {
    return request({
        url: "/api/bg/operation/orders/export",
        method: "post",
        data,
        responseType: 'blob',
    });
}
//批量打印二维码
export function batchOrderno(data) {
    return request({
        url: "/api/bg/operation/orders/batch/order-no",
        method: "post",
        data,
    });
}
//使用记录列表
export function orderPageList(data) {
    return request({
        url: "/api/bg/operation/train-record/order/page",
        method: "post",
        data,
    });
}
//新增简学通订单
export function addJxt(data) {
    return request({
        url: "/api/bg/operation/orders/add/jxt",
        method: "post",
        data,
    });
}
//简学通列表统计
export function statistic(data) {
    return request({
        url: "/api/bg/operation/orders/jxt/statistic",
        method: "post",
        data,
    });
}
//简学通详情
export function jxtordersInfo(data) {
    return request({
        url: "/api/bg/operation/orders/info",
        method: "post",
        data,
    });
}
//取消订单(根据订单号)
export function jxtordersCancel(data) {
    return request({
        url: "/api/bg/operation/orders/cancel",
        method: "post",
        data,
    });
}
//修改 | 编辑训练卡卡号
export function jxtordersUpdate(data) {
    return request({
        url: "/api/bg/operation/orders/update",
        method: "post",
        data,
    });
}
//简学通微信扫码支付
export function jxtNative(data) {
    return request({
        url: "/api/bg/operation/payment/jxt/wx/native",
        method: "post",
        data,
    });
}
//查询微信订单状态表
export function outTradeNo(data) {
    return request({
        url: "/api/bg/operation/payment/check/status/outTradeNo",
        method: "post",
        data,
    });
}
//退款
export function wxRefund(data) {
    return request({
        url: "/api/bg/operation/payment/wx/refund",
        method: "post",
        data,
    });
}
//简学通微信续充扫码支付
export function rechargeNative(data) {
    return request({
        url: "/api/bg/operation/payment/jxt/wx/recharge/native",
        method: "post",
        data,
    });
}
// 简学通详情信息
export function rechargeRecord(data) {
    return request({
        url: "/api/bg/operation/orders/jxt/recharge/record",
        method: "post",
        data,
    });
}
// 简学通写卡成功状态修改
export function jxtCard(data) {
    return request({
        url: "/api/bg/operation/orders/jxt/card",
        method: "post",
        data,
    });
}