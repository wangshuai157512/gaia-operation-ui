import request from "@/utils/request.js";

// 视频分页列表
export function teachVideoPageList(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/page",
    method: "post",
    data,
  });
}

// 添加视频
export function addApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/add",
    method: "post",
    data,
  });
}
// 删除视频
export function removeApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/remove",
    method: "post",
    data,
  });
}

// 编辑视频
export function updateApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/update",
    method: "post",
    data,
  });
}

// 获取视频信息
export function getInfoApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/info",
    method: "post",
    data,
  });
}

// 上传 图片
export function uploadImageApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/uploadPhoto",
    method: "post",
    data,
  });
} // 上传视频
export function uploadVedioApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/uploadVideo",
    method: "post",
    data,
  });
}

// 上架
export function putawayApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/putaway",
    method: "post",
    data,
  });
}
// 上架 
export function soldoutApi(data) {
  return request({
    url: "/api/bg/operation/subprojectexplain/soldout",
    method: "post",
    data,
  });
}
