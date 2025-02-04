import request from "@/utils/auth-request.js";
// import req from "@/utils/request.js";

// function request(handle) {
//   const pathname = window.location.pathname;
//   return pathname == "/system/dict" ? authReq(handle) : req(handle);
// }
// 查询字典类型列表
export function listType(data) {
    return request({
        url: "/api/public/dict/type/page",
        method: "post",
        data: data,
    });
}

// 查询字典类型详细
export function getType(data) {
    return request({
        url: "/api/public/dict/type/info",
        method: "post",
        data: data,
    });
}

// 新增字典类型
export function addType(data) {
    return request({
        url: "/api/public/dict/type/add",
        method: "post",
        data: data,
    });
}

// 修改字典类型
export function updateType(data) {
    return request({
        url: "/api/public/dict/type/update",
        method: "post",
        data: data,
    });
}

// 删除字典类型
export function delType(data) {
    return request({
        url: "/system/dict/type/remove",
        method: "POST",
        data: data,
    });
}

// 刷新字典缓存
export function refreshCache() {
    return request({
        url: "/system/dict/type/refreshCache",
        method: "delete",
    });
}

// 导出字典类型
export function exportType(query) {
    return request({
        url: "/system/dict/type/export",
        method: "get",
        params: query,
    });
}

// 获取字典选择框列表
export function optionselect() {
    return request({
        url: "/system/dict/type/optionselect",
        method: "get",
    });
}