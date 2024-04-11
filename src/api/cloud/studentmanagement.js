import request from "@/utils/request.js";

// 学员分页列表
export function studentPageList(data) {
    return request({
        url: "/api/bg/operation/student/page",
        method: "post",
        data,
    });
}

// 添加学员
export function addPage(data) {
    return request({
        url: "/api/bg/operation/student/add",
        method: "post",
        data,
    });
}

// 修改学员
export function updatePage(data) {
    return request({
        url: "/api/bg/operation/student/update",
        method: "post",
        data,
    });
}

// 删除学员
export function removePage(data) {
    return request({
        url: "/api/bg/operation/student/remove",
        method: "post",
        data,
    });
}

// 学员导入
export function importPage(data) {
    return request({
        url: "/api/bg/operation/student/import",
        method: "post",
        data,
    });
}

// 学员导出
export function exportPage(data) {
    return request({
        url: "/api/bg/operation/student/export",
        method: "post",
        data,
        responseType: 'blob',
    });
}

// 班型
export function classtypePage() {
    return request({
        url: "/api/bg/operation/student/classtype",
        method: "post",
    });
}

// 车型
export function carSimple(id) {
    return request({
        url: "/api/bg/operation/drvSchool/car/simple",
        method: "post",
        data: { id }
    });
}

// 学员编号
export function studentGetCode(data) {
    return request({
        url: "/api/bg/operation/student/getCode",
        method: "post",
        data,
    });
}

//获取信息
export function studentInfo(data) {
    return request({
        url: "/api/bg/operation/student/info",
        method: "post",
        data,
    });
}

//上传图片
export function uploadPhoto(data, onUploadProgress) {
    const form = new FormData();
    form.append('photo', data.file)
    return request({
        headers: { "Content-Type": "multipart/form-data" },
        url: "/api/bg/operation/student/uploadPhoto",
        method: "post",
        data: form,
        onUploadProgress
    });
}
