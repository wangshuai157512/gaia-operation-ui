import request from "@/utils/auth-request.js";

// 查询菜单列表
export function listMenu(query) {
  return request({
    url: "/api/auth/menu/page",
    method: "post",
    data: { ...query, clientId: "bg_operation" }
  });
}

// 查询菜单详细
export function getMenu(menuId) {
  return request({
    url: "/api/auth/menu/info",
    method: "post",
    data: {
      id: menuId
    }
  });
}

// 查询菜单下拉树结构
export function treeselect() {
  return request({
    url: "/menu/treeselect",
    method: "get"
  });
}

// 根据角色ID查询菜单下拉树结构
export function roleMenuTreeselect(roleId) {
  return request({
    url: "/menu/roleMenuTreeselect/" + roleId,
    method: "get"
  });
}

// 新增菜单
export function addMenu(data) {
  return request({
    url: "/api/auth/menu/add",
    method: "post",
    data: data
  });
}

// 修改菜单
export function updateMenu(data) {
  return request({
    url: "/api/auth/menu/update",
    method: "post",
    data: data
  });
}

// 删除菜单
export function delMenu(data) {
  return request({
    url: "/api/auth/menu/remove",
    method: "post",
    data: data
  });
}
