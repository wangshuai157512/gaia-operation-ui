import request from "@/utils/request.js";

// 获取用户列表
export function getUserPageList(data) {
  return request({
    url: "/api/auth/user/page",
    method: "post",
    data,
  });
}

// 新增用户
export function addUser(data) {
  return request({
    url: "/api/auth/user/add",
    method: "post",
    data,
  });
}

// 删除用户
export function delUser(id) {
  return request({
    url: "/api/auth/user/remove",
    method: "post",
    data: { id },
  });
}

// 获取详细信息
export function getUserInfo(id) {
  return request({
    url: "/api/auth/user/info",
    method: "post",
    data: { id },
  });
}

// 修改用户
export function editUserInfo(data) {
  return request({
    url: "/api/auth/user/update",
    method: "post",
    data,
  });
}

// 修改密码
export function updatePwd(data) {
  return request({
    url: "/api/auth/user/update/pwd",
    method: "post",
    data,
  });
}

//角色 bg ---------------------------------------------
// 列表
export function rolePageList(data) {
  return request({
    url: "/api/auth/role/page",
    method: "post",
    data,
  });
}
// 添加
export function addRoleApi(data) {
  return request({
    url: "/api/auth/role/add",
    method: "post",
    data,
  });
}
// 编辑
export function updateRoleApi(data) {
  return request({
    url: "/api/auth/role/update",
    method: "post",
    data,
  });
}
// 详情
export function getRoleInfoApi(data) {
  return request({
    url: "/api/auth/role/info",
    method: "post",
    data,
  });
}
// 详情
export function removeRoleApi(data) {
  return request({
    url: "/api/auth/role/remove",
    method: "post",
    data,
  });
}
// 菜单查询
export function menuListApi(data) {
  return request({
    url: "/api/auth/menu/menu-tree-selected",
    method: "post",
    data,
  });
}
// removeRoleApi getRoleInfoApi updateRoleApi  addRoleApi
//角色 ed ---------------------------------------------
