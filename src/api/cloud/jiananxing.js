import request from "@/utils/request.js";

// 分页列表
export function pageList(data) {
  return request({
    url: "/api/bg/operation/simulator/page",
    method: "post",
    data
  });
}
// 添加
export function addPage(data) {
  return request({
    url: "/api/bg/operation/simulator/add",
    method: "post",
    data
  });
}
// 详情
export function pageInfo(data) {
  return request({
    url: "/api/bg/operation/simulator/info",
    method: "post",
    data
  });
}
// 修改
export function updatePage(data) {
  return request({
    url: "/api/bg/operation/simulator/update",
    method: "post",
    data
  });
}
// 上传照片
export function uploadImage(data) {
  return request({
    url: "/api/public/file/uploadImage",
    method: "post",
    data
  });
}

// 查询配置
export function getSimulatorConfig() {
  return request({
    url: "/api/bg/operation/SimulatorConfig/page",
    method: "post"
  });
}

// 添加-修改
export function addSimulatorConfig(data) {
  return request({
    url: "/api/bg/operation/SimulatorConfig/update",
    method: "post",
    data
  });
}

// 添加-修改
export function simulatorConfigInfo(data) {
  return request({
    url: "/api/bg/operation/SimulatorConfig/info",
    method: "post",
    data
  });
}
