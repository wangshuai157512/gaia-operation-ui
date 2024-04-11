import request from "@/utils/auth-request.js";
import { CONFIG } from "./config";

// 登录方法
export function login(username, password, code, uuid, mac) {
    const data = {
        ...CONFIG,
        username,
        password,
        code,
        mac,
        uuid
    };
    return request({
        url: "/api/auth/token",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        method: "post",
        data: data
    });
}

// 注册方法
export function register(data) {
    return request({
        url: "/register",
        headers: {
            isToken: false
        },
        method: "post",
        data: data
    });
}

// 获取用户详细信息
export function getInfo() {
    return request({
        url: "/api/auth/profile",
        method: "get"
    });
}

// 退出方法
export function logout(data) {
    return request({
        url: "/api/auth/remove",
        method: "post",
        data: data
    });
}

// 获取验证码
export function getCodeImg() {
    return request({
        url: "/api/auth/captchaImage",
        headers: {
            isToken: false
        },
        method: "get",
        timeout: 20000
    });
}

// 最近登录日志
export function getLoginLog() {
    return request({
        url: "/system/user/profile/login/log",
        method: "get"
    });
}

// 修改密码（登录后）
export function updatePwd(data) {
    return request({
        url: "/system/user/profile/updatePwd",
        method: "post",
        data
    });
}

// 修改密码（初次登录）
export function updateFirstPwd(data) {
    return request({
        url: "/system/user/profile/updatePwd/init",
        method: "post",
        data: {...data, client_id: CONFIG.client_id }
    });
}

// 个人信息
export function userInfo() {
    return request({
        url: "/api/auth/profile",
        method: "get"
    });
}