import request from "@/utils/request.js";

// 金牌教练分页列表
export function pageList(data) {
    return request({
        url: "/api/bg/operation/yxt/page/carManage",
        method: "post",
        data,
    });
}
// 金牌教练详情
export function pageInfo(data) {
    return request({
        url: "/api/bg/operation/yxt/info",
        method: "post",
        data,
    });
}
// 金牌教练新增
export function pageAdd(data) {
    return request({
        url: "/api/bg/operation/yxt/add",
        method: "post",
        data,
    });
}
// 金牌教练修改
export function pageUpdate(data) {
    return request({
        url: "/api/bg/operation/yxt/update",
        method: "post",
        data,
    });
}
// 金牌教练删除
export function pageRemove(data) {
    return request({
        url: "/api/bg/operation/yxt/remove",
        method: "post",
        data,
    });
}
// 上传照片
export function uploadImage(data) {
    return request({
        url: "/api/public/file/uploadImage",
        method: "post",
        data,
    });
}