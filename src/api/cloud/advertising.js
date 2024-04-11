import request from "@/utils/request.js";

// 广告分页列表
export function advPageList(data) {
  return request({
    url: "/api/bg/operation/advertising/page",
    method: "post",
    data,
  });
}

// 添加广澳
export function addApi(data) {
  return request({
    url: "/api/bg/operation/advertising/add",
    method: "post",
    data,
  });
}
// 删除广告
export function removeApi(data) {
  return request({
    url: "/api/bg/operation/advertising/remove",
    method: "post",
    data,
  });
}

// 编辑广告
export function updateApi(data) {
  return request({
    url: "/api/bg/operation/advertising/update",
    method: "post",
    data,
  });
}

// 获取广告信息
export function getInfoApi(data) {
  return request({
    url: "/api/bg/operation/advertising/info",
    method: "post",
    data,
  });
}

// 上传文件
export function uploadFileApi(data) {
  return request({
    url: "/api/bg/operation/advertising/uploadAdvert",
    method: "post",
    data,
  });
}

// 上架
export function putawayApi(data) {
  return request({
    url: "/api/bg/operation/advertising/putaway",
    method: "post",
    data,
  });
}
// 下架
export function soldoutApi(data) {
  return request({
    url: "/api/bg/operation/advertising/soldout",
    method: "post",
    data,
  });
}
