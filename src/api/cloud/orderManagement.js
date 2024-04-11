import request from "@/utils/request.js";

// 分页列表
export function ordersPage(data) {
    return request({
        url: "/api/bg/operation/orders/page",
        method: "post",
        data,
    });
}
// 详情
export function ordersInfo(data) {
    return request({
        url: "/api/bg/operation/orders/info",
        method: "post",
        data,
    });
}
// 订单明细详情列表
export function detailsList(data) {
    return request({
        url: "/api/bg/operation/order/details/list",
        method: "post",
        data,
    });
}
