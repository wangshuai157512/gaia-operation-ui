import request from "@/utils/request.js";

// 学员分页列表
export function operationPageList(data) {
  return request({
    url: "/api/bg/operation/operationManage/page",
    method: "post",
    data,
  });
}

//预约规则设置 获取详情
export function appointmentInfo(data) {
  return request({
    url: "/api/bg/operation/operationManageAppointment/info",
    method: "post",
    data,
  });
}
//预约规则设置 更新
export function appointmentEdit(data) {
  return request({
    url: "/api/bg/operation/operationManageAppointment/update",
    method: "post",
    data,
  });
}

//收费规则设置 获取详情
export function chargeInfo(data) {
  return request({
    url: "/api/bg/operation/operationManageCharge/info",
    method: "post",
    data,
  });
}
//收费规则设置 更新
export function chargeEdit(data) {
  return request({
    url: "/api/bg/operation/operationManageCharge/update",
    method: "post",
    data,
  });
}

//分成规则设置 获取详情
export function shareInfo(data) {
  return request({
    url: "/api/bg/operation/operationManageShare/info",
    method: "post",
    data,
  });
}
//分成规则设置 更新
export function shareEdit(data) {
  return request({
    url: "/api/bg/operation/operationManageShare/update",
    method: "post",
    data,
  });
}


//简学通预约规则设置 新增
export function appointmentJxtAdd(data) {
  return request({
    url: "/api/bg/operation/operationManageAppointment/add",
    method: "post",
    data,
  });
}

//简学通预约规则设置 修改
export function appointmentJxtEdit(data) {
  return request({
    url: "/api/bg/operation/operationManageAppointment/update",
    method: "post",
    data,
  });
}

//简学通规则设置 获取详情
export function appointmentJxtInfo(data) {
  return request({
    url: "/api/bg/operation/operationManageAppointment/jxt/info/schoolId",
    method: "post",
    data,
  });
}