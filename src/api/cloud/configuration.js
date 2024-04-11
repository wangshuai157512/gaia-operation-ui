import request from "@/utils/request.js";

// 新增车辆配置
export function addVehicleFile(data) {
    return request({
        url: "/api/bg/operation/car-file-config/edit",
        method: "post",
        data: data,
    });
}

// 车辆配置列表
export function vehicleList(data) {
    return request({
        url: "/api/bg/operation/car-file-config/list",
        method: "post",
        data: data,
    });
}
// 易学通车辆配置列表
export function vehicleListYxt(data) {
    return request({
        url: "/api/bg/operation/car-file-config/list/yxt",
        method: "post",
        data: data,
    });
}

// 新增车型配置
export function addModelFile(data) {
    return request({
        url: "/api/bg/operation/car-type-file-config/edit",
        method: "post",
        data: data,
    });
}

// 车型配置列表
export function modelList(data) {
    return request({
        url: "/api/bg/operation/car-type-file-config/list",
        method: "post",
        data: data,
    });
}

// 车辆品牌数据下拉查询
export function brandSelect(data) {
    return request({
        url: "/api/bg/operation/car-type-file-config/simple",
        method: "post",
        data: data,
    });
}

// 车载配置列表
export function vehicleConfigList(data) {
    return request({
        url: "/api/bg/operation/car-config/list",
        method: "post",
        data: data,
    });
}

// 上传车载配置文件
export function vehicleUploadConfig(data) {
    return request({
        url: "/api/bg/operation/car-config/upload",
        method: "post",
        data: data,
    });
}
// 易学通上传车载配置文件
export function vehicleUploadConfigYxt(data) {
    return request({
            url: "/api/bg/operation/car-config/upload/yxt",
            method: "post",
            data: data,

        },
        false, 100000);
}

// 编辑车载配置文件
export function vehicleConfigEdit(data) {
    return request({
        url: "/api/bg/operation/car-config/edit",
        method: "post",
        data: data,
    });
}