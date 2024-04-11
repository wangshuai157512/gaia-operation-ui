import request from "@/utils/request.js";

// 教练列表
export function coachReserveTime(data) {
  return request({
    url: "/api/bg/operation/reserveStudent/jxt/coach/reserve-time",
    method: "post",
    data,
  });
}

// 教练预约日期
export function coachReserveDate(data) {
  return request({
    url: "/api/bg/operation/reserveStudent/jxt/coach/reserve-date",
    method: "post",
    data,
  });
}

// 查询预约学员
export function coachStudentList(data) {
  return request({
    url: "/api/bg/operation/student/list",
    method: "post",
    data,
  });
}

// 学员保存预约
export function reserveStudentJxtAdd(data) {
  return request({
    url: "/api/bg/operation/reserveStudent/jxt/add",
    method: "post",
    data,
  });
}
