import request from "@/utils/request.js";
//  ------------------ 车载设备配置 bg-----------------
// 分页列表
export function carEquipmentPageList(data) {
    return request({
        url: "/api/bg/operation/CarEquipmentConfiguration/page",
        method: "post",
        data,
    });
}

// 添加
export function addApi(data) {
    return request({
        url: "/api/bg/operation/CarEquipmentConfiguration/add",
        method: "post",
        data,
    });
}
// 删除
export function removeApi(data) {
    return request({
        url: "/api/bg/operation/CarEquipmentConfiguration/remove",
        method: "post",
        data,
    });
}

// 编辑
export function updateApi(data) {
    return request({
        url: "/api/bg/operation/CarEquipmentConfiguration/update",
        method: "post",
        data,
    });
}

// 导出
export function carEquipmentConfigurationExport(data) {
    return request({
        url: "/api/bg/operation/CarEquipmentConfiguration/export",
        method: "post",
        data,
        responseType: 'blob'
    });
}

// 获取信息
export function getInfoApi(data) {
    return request({
        url: "/api/bg/operation/CarEquipmentConfiguration/info",
        method: "post",
        data,
    });
}

//  ------------------ 车载设备配置 ed-----------------

//  ------------------ 音视频设备配置 bg-----------------
// 分页列表
export function AudioVideoPageList(data) {
    return request({
        url: "/api/bg/operation/AudioVideoConfiguration/page",
        method: "post",
        data,
    });
}

// 添加
export function addAudioVideoApi(data) {
    return request({
        url: "/api/bg/operation/AudioVideoConfiguration/add",
        method: "post",
        data,
    });
}
// 删除
export function removeAudioVideoApi(data) {
    return request({
        url: "/api/bg/operation/AudioVideoConfiguration/remove",
        method: "post",
        data,
    });
}

// 编辑
export function updateAudioVideoApi(data) {
    return request({
        url: "/api/bg/operation/AudioVideoConfiguration/update",
        method: "post",
        data,
    });
}

// 获取信息
export function getAudioVideoInfoApi(data) {
    return request({
        url: "/api/bg/operation/AudioVideoConfiguration/info",
        method: "post",
        data,
    });
}

//  ------------------ 音视频设备配置 ed-----------------

//  ------------------ 系统配置管理  bg-----------------
// 分页列表  
export function systemConfigList(data) {
    return request({
        url: "/api/bg/operation/DrvSchoolConfig/page",
        method: "post",
        data,
    });
}

// 添加 
export function addSystemConfigApi(data) {
    return request({
        url: "/api/bg/operation/DrvSchoolConfig/add",
        method: "post",
        data,
    });
}
// 删除
export function removeSystemConfigApi(data) {
    return request({
        url: "/api/bg/operation/DrvSchoolConfig/remove",
        method: "post",
        data,
    });
}

// 编辑
export function updateSystemConfigApi(data) {
    return request({
        url: "/api/bg/operation/DrvSchoolConfig/update",
        method: "post",
        data,
    });
}

// 获取信息
export function getSystemConfigInfoApi(data) {
    return request({
        url: "/api/bg/operation/DrvSchoolConfig/info",
        method: "post",
        data,
    });
}

//  ------------------ 系统配置管理  ed-----------------