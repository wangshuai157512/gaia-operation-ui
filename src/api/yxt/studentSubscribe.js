import request from "@/utils/request.js";

// 学员预约记录列表
export function reserveStudentList(data) {
    return request({
        url: "/api/bg/operation/reserveStudent/page",
        method: "post",
        data: data
    });
}
// 学员取消预约
export function reserveStudencancelUpdate(data) {
    return request({
        url: "/api/bg/operation/reserveStudent/cancelUpdate",
        method: "post",
        data: data
    });
}