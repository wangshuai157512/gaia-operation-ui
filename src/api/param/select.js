import request from "@/utils/request.js";
import authRequest from "@/utils/auth-request.js";

// // 发证机关下拉查询
// export function getOrganSelect() {
//     return request({
//         url: "/sys-fzjg/simple",
//         method: "post",
//     });
// }

// // 部门下拉查询
// export function getDeptSelect() {
//     return request({
//         url: "/glbm/simple",
//         method: "post",
//     });
// }

// // 考场下拉查询
// export function getExamRoomSelect(kskm) {
//     return request({
//         url: "/examroom/simple",
//         method: "post",
//         data: { kskm: kskm || "" },
//     });
// }

// // 监控设备下拉列表
// export function getMonitorSelect(kcxh) {
//     return request({
//         url: "/videquipment/simple",
//         method: "post",
//         data: { kcxh: kcxh || "" },
//     });
// }

// // 考试员下拉查询
// export function getExamStaffSelect() {
//     return request({
//         url: "/drvexaminer/simple",
//         method: "post",
//     });
// }

// // 设备下拉查询
// export function getExamToolSelect() {
//     return request({
//         url: "/equipment/simple",
//         method: "post",
//     });
// }

// // 考车下拉查询
// export function getExamCarSelect(kcxh) {
//     return request({
//         url: "/drvcar/simple",
//         method: "post",
//         data: { kcxh: kcxh || "" },
//     });
// }

// // 其他下拉查询
// export function getOtherSelect(type) {
//     return request({
//         url: "/dict/data/simple?dictType=" + type,
//         method: "get",
//     });
// }

// // 考试项目下拉查询
// export function getDrvSelect(data) {
//     return request({
//         url: "/drv-code-exam/simple",
//         method: "POST",
//         data: data || { kcxh: "", kskm: "" },
//     });
// }

// // 考试项目下拉查询
// export function getSchoolSelect() {
//     return request({
//         url: "/drvschool/simple",
//         method: "POST",
//     });
// }

// // 登录相关

// // 部门下拉查询
// export function getuserDeptSelect() {
//     return authRequest({
//         url: "/system/dept/simple",
//         method: "GET",
//     });
// }

// // 角色下拉查询
// export function getuserRoleSelect(userType) {
//     if (userType === null) {
//         userType = ''
//     }
//     return authRequest({
//         url: `/system/role/simple?examinerFlag=${userType}`,
//         method: "GET",
//     });
// }

// // 核查员/审批人下拉查询
// export function getuserInspectSelect() {
//     return authRequest({
//         url: "/system/user/simple",
//         method: "POST",
//     });
// }

// // 检查项目下拉查询
// export function getCheckProjectSelect(kskm) {
//     return request({
//         url: "/check-config/item/simple",
//         headers: {
//             "Content-Type": "application/x-www-form-urlencoded",
//         },
//         method: "post",
//         data: { kskm: kskm || "" },
//         isLoading: false
//     });
// }

// 云平台下拉框从这里开始
// 省市县级联
export function getProvinceSelect() {
    return authRequest({
        url: "/api/public/city/list/province",
        method: "POST"
    });
}
export function getCitySelect(id) {
    if (!id) return {
        data: []
    };
    return authRequest({
        url: "/api/public/city/list/city",
        method: "POST",
        data: {
            id
        }
    });
}
export function getCountySelect(id) {
    if (!id) return {
        data: []
    };
    return authRequest({
        url: "/api/public/city/list/county",
        method: "POST",
        data: {
            id
        }
    });
}

// 字典下拉查询
export function getDictSelect(data) {
    return authRequest({
        url: "/api/public/dict/data/simple",
        method: "POST",
        data: {
            dictType: data
        }
    });
}

// 新增车辆品牌
export function brandAdd(data) {
    return authRequest({
        url: "/api/bg/operation/car-type-file-config/brand/add",
        method: "POST",
        data
    });
}

// 查询驾校
export function getSchoolSelect(data) {
    return authRequest({
        url: "/api/bg/operation/drvSchool/school/list",
        method: "POST",
        data: {
            id: data || 0
        }
    });
}
// 教练
export function getCoachSelect(str) {
    const strArr = str ? str.split(",") : ["", ""];
    return authRequest({
        url: "/api/bg/operation/coach/simple",
        method: "POST",
        data: {
            drvSchoolId: strArr[0],
            teachSub: strArr[1]
        }
    });
}

// 省市县联动驾校
export function getSeachSchoolSelect(data) {
    return authRequest({
        url: "/api/bg/operation/drvSchool/school/select/list",
        method: "POST",
        data: JSON.parse(data)
    });
}

// 车牌号
export function getCarNumberSelect(data) {
    if (data === '{}' || JSON.parse(data).id === '') {
        return []
    }
    return authRequest({
        url: "/api/bg/operation/GoldCoachOperate/list",
        method: "POST",
        data: JSON.parse(data)
    });
}
// 易学通车牌号
export function getCarNumberSelectY(data) {
    if (data === '{}' || JSON.parse(data).id === '') {
        return []
    }
    return authRequest({
        url: "/api/bg/operation/yxt/operate/list",
        method: "POST",
        data: JSON.parse(data)
    });
}
//报名点
export function pointListPage(id) {
    if (!id) {
        return [];
    }
    return authRequest({
        url: "/api/bg/operation/drvSchool/point/list",
        method: "post",
        data: {
            id: id
        }
    });
}
//角色
export function getRoleSelect() {
    return authRequest({
        url: "/api/auth/role/simple",
        method: "get"
    });
}
//学员下拉
export function getStudentSelect(data) {
    return authRequest({
        url: "/api/mp/student/student/simple",
        method: "post",
        data: JSON.parse(data)
    });
}