import request from "@/utils/request.js";

// 学员训练记录分页
export function getStudentTrainPageList(data) {
  return request({
    url: "/api/bg/operation/train-record/student/page",
    method: "post",
    data
  });
}

// 学员训练详细信息
export function getStudentTrainInfo(data) {
  return request({
    url: "/api/bg/operation/train-record/info",
    method: "post",
    data
  });
}

// 教练使用记录分页
export function getCoachTrainPageList(data) {
  return request({
    url: "/api/bg/operation/train-record/coach/page",
    method: "post",
    data
  });
}

// 获取GPS轨迹
export function getCarGpsTrack(data) {
  return request({
    url: "/api/bg/operation/train-record/gps/track",
    method: "post",
    data
  });
}

// 学员训练详情-训练项目列表
export function getInfoProject(data = { id: 0 }) {
  return request({
    url: "/api/bg/operation/train-record/info/project/simple",
    method: "post",
    data
  });
}
