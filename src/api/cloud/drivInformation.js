import request from "@/utils/request.js";

// 驾校分页列表
export function drvSchoolPageList(data) {
    return request({
        url: "/api/bg/operation/drvSchool/page",
        method: "post",
        data,
    });
}

// 添加主校
export function drvSchoolAdd(data) {
    return request({
        url: "/api/bg/operation/drvSchool/add",
        method: "post",
        data,
    });
}
// 添加分校
export function subsSchoolAdd(data) {
    return request({
        url: "/api/bg/operation/drvSchool/subschool/add",
        method: "post",
        data,
    });
}
// 添加报名点
export function pointAdd(data) {
    return request({
        url: "/api/bg/operation/drvSchool/point/add",
        method: "post",
        data,
    });
}

// 修改主校
export function drvSchoolUpdate(data) {
    return request({
        url: "/api/bg/operation/drvSchool/update",
        method: "post",
        data,
    });
}
// 修改分校
export function subSchoolUpdate(data) {
    return request({
        url: "/api/bg/operation/drvSchool/subschool/update",
        method: "post",
        data,
    });
}
// 修改报名点
export function pointUpdate(data) {
    return request({
        url: "/api/bg/operation/drvSchool/point/update",
        method: "post",
        data,
    });
}

// 驾校分校详情获取信息
export function drvSchoolInfo(data) {
    return request({
        url: "/api/bg/operation/drvSchool/info",
        method: "post",
        data,
    });
}

// 报名点详情获取信息
export function pointInfo(data) {
    return request({
        url: "/api/bg/operation/drvSchool/point/info",
        method: "post",
        data,
    });
}

// 删除分校
export function subSchoolRemove(data) {
    return request({
        url: "/api/bg/operation/drvSchool/subschool/remove",
        method: "post",
        data,
    });
}
// 删除报名点
export function pointRemove(data) {
    return request({
        url: "/api/bg/operation/drvSchool/point/remove",
        method: "post",
        data,
    });
}

// 删除照片
export function fileRemove(data) {
    return request({
        url: "/api/public/file/remove",
        method: "post",
        data,
    });
}
// 审核
export function drvSchoolAudit(data) {
    return request({
        url: "/api/bg/operation/drvSchool/audit",
        method: "post",
        data,
    });
}
// 导出
export function exportConfig(id) {
    return request({
        url: "/api/bg/operation/drvSchool/export/config/" + id,
        method: "get",
    });
}
// 导出易学通
export function exportConfigExt(id) {
    return request({
        url: "/api/bg/operation/drvSchool/export/config/yxt/" + id,
        method: "get",
    });
}