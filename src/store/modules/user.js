import { login, logout, getInfo } from "@/api/login";
import { getToken, setToken, removeToken } from "@/utils/auth";

const user = {
    state: {
        token: getToken(),
        name: "",
        roleName: "",
        realName: "",
        avatar: "",
        roles: [],
        permissions: [],
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_ROLENAME: (state, roleName) => {
            state.roleName = roleName;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_REALNAME: (state, roles) => {
            state.realName = roles;
        },
        SET_ROLES: (state, roles) => {
            state.roles = roles;
        },
        SET_PERMISSIONS: (state, permissions) => {
            state.permissions = permissions;
        },
    },

    actions: {
        // 登录
        Login({ commit }, userInfo) {
            const username = userInfo.username.trim();
            const password = userInfo.password;
            const code = userInfo.code;
            const uuid = userInfo.uuid;
            // const mac = userInfo.mac;
            return new Promise((resolve, reject) => {
                login(username, password, code, uuid)
                    .then((res) => {
                        setToken(res.data);
                        commit("SET_TOKEN", res.data);
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 获取用户信息
        GetInfo({ commit, state }) {
            return new Promise((resolve, reject) => {
                // commit("SET_ROLES", ["ROLE_DEFAULT"]);
                // resolve();
                // return;
                getInfo()
                    .then((res) => {
                        const user = res.data.user;
                        const avatar =
                            user.avatar == "" ?
                            require("@/assets/images/profile.jpg") :
                            process.env.VUE_APP_BASE_API + user.avatar;
                        if (res.data.roles) {
                            // 验证返回的roles是否是一个非空数组
                            commit("SET_ROLES", res.data.roles);
                        } else {
                            commit("SET_ROLES", ["ROLE_DEFAULT"]);
                        }
                        commit("SET_PERMISSIONS", res.data.permissions);
                        commit("SET_NAME", user.userName); //
                        commit("SET_REALNAME", user.realName);
                        commit("SET_AVATAR", avatar);
                        commit("SET_ROLENAME", res.data.roleName);
                        resolve(res.data);
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 退出系统
        LogOut({ commit, state }) {
            return new Promise((resolve, reject) => {
                logout({ token: state.token })
                    .then(() => {
                        commit("SET_TOKEN", "");
                        commit("SET_ROLENAME", "");
                        commit("SET_PERMISSIONS", []);
                        removeToken();
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            });
        },

        // 前端 登出
        FedLogOut({ commit }) {
            return new Promise((resolve) => {
                commit("SET_TOKEN", "");
                commit("SET_PERMISSIONS", []);
                removeToken();
                resolve();
            });
        },
    },
};

export default user;