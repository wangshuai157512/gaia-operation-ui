import request from "@/utils/request.js";

// 管控用户分页列表
export function ctlPageList(data) {
    return request({
        url: "/api/bg/operation/ctl/user/page",
        method: "post",
        data,
    });
}

// 管控用户新增
export function ctlAdd(data) {
    return request({
        url: "/api/bg/operation/ctl/user/add",
        method: "post",
        data,
    });
}

// 管控用户修改
export function ctlUpdate(data) {
    return request({
        url: "/api/bg/operation/ctl/user/update",
        method: "post",
        data,
    });
}

// 管控用户详情
export function ctlInfo(data) {
    return request({
        url: "/api/bg/operation/ctl/user/info",
        method: "post",
        data,
    });
}

// 管控用户删除
export function ctlRemove(data) {
    return request({
        url: "/api/bg/operation/ctl/user/remove",
        method: "post",
        data,
    });
}

// 机器人教练分配列表
export function ctlGoldCoachList(data) {
    return request({
        url: "/api/bg/operation/ctl/user/relate/list",
        method: "post",
        data,
    });
}

// 机器人教练分配
export function ctlRelate(data) {
    return request({
        url: "/api/bg/operation/ctl/user/relate",
        method: "post",
        data,
    });
}