import request from "@/utils/request.js";

// 总学员数
export function getSellSum() {
  return request({
    url: "/api/bg/operation/index/student/sum",
    method: "post"
  });
}

// 今日新增学员数
export function getOrderSum() {
  return request({
    url: "/api/bg/operation/index/student/new",
    method: "post"
  });
}

// 驾校总数
export function getSellToday() {
  return request({
    url: "/api/bg/operation/index/school/sum",
    method: "post"
  });
}

// 设备总数
export function getStudentToday() {
  return request({
    url: "/api/bg/operation/index/driver/sum",
    method: "post"
  });
}

// 订单金额趋势统计
export function getOrderTrend() {
  return request({
    url: "/api/bg/operation/index/order/trend",
    method: "post"
  });
}

// 教练引荐-学员消费排名
export function getRanking(data) {
  return request({
    url: "/api/bg/operation/index/money/ranking",
    method: "post",
    data
  });
}

// 近30天科目二五项训练时长统计
export function getTraintime(projectIds) {
  return request({
    url: "/api/bg/operation/index/five/traintime",
    method: "post",
    data: { projectIds }
  });
}

// 近30日收入分类
export function getReceiptsType() {
  return request({
    url: "/api/bg/operation/index/receipts/type",
    method: "post"
  });
}
