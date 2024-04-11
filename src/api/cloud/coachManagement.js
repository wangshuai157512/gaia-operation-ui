import request from "@/utils/request.js";

// 教练编号
export function coachCode() {
    return request({
        url: "/api/bg/operation/coach/get/coach-code",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get"
    });
}
// 推荐码
export function coachRecommendCode() {
    return request({
        url: "/api/bg/operation/coach/recommend_code",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "get"
    });
}
//所教科目
export function coachSubjectList(data) {
    return request({
        url: "/api/bg/operation/coach/simple",
        method: "post",
        data,
    });
}

// 教练分页列表
export function coachPageList(data) {
    return request({
        url: "/api/bg/operation/coach/page",
        method: "post",
        data,
    });
}

// 教练新增列表
export function coachAdd(data) {
    return request({
        url: "/api/bg/operation/coach/add",
        method: "post",
        data,
    });
}

// 教练编辑列表
export function coachEdit(data) {
    return request({
        url: "/api/bg/operation/coach/update",
        method: "post",
        data,
    });
}

// 教练详情
export function coachInfo(data) {
    return request({
        url: "/api/bg/operation/coach/info",
        method: "post",
        data,
    });
}

// 教练删除
export function coachRemove(data) {
    return request({
        url: "/api/bg/operation/coach/remove",
        method: "post",
        data,
    });
}

// 教练评价列表
export function coachEvaluateList(data) {
    return request({
        url: "/api/bg/operation/coach/evaluate/page",
        method: "post",
        data,
    });
}

// 机器人教练分配列表
export function coachRelateList(data) {
    return request({
        url: "/api/bg/operation/coach/relate/list",
        method: "post",
        data,
    });
}
// // 模拟器分配列表
// export function coachSimulatorList(data) {
//     return request({
//         url: "/api/bg/operation/coach/relate/simulator/list",
//         method: "post",
//         data,
//     });
// }

// 分配车辆
export function coachRelate(data) {
    return request({
        url: "/api/bg/operation/coach/relate",
        method: "post",
        data,
    });
}