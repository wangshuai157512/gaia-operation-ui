import request from "@/utils/request.js";

// 易学通新增更新包
export function addRefreshPack(data) {
    return request({
        url: "/api/bg/operation/yxt/updatePackageManage/add",
        method: "post",
        data: data,
    });
}

// 易学通更新包列表
export function refreshPackList(data) {
    return request({
        url: "/api/bg/operation/yxt/updatePackageManage/page",
        method: "post",
        data: data,
    });
}
// 易学通更新包编辑
export function updateRefreshPack(data) {
    return request({
        url: "/api/bg/operation/yxt/updatePackageManage/update",
        method: "post",
        data: data,
    });
}
// 易学通更新包删除
export function removeRefreshPack(data) {
    return request({
        url: "/api/bg/operation/yxt/updatePackageManage/remove",
        method: "post",
        data: data,
    });
}