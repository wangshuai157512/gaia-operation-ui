import { constantRoutes } from "@/router";
import { getRouters } from "@/api/menu";
import Layout from "@/layout/index";
import ParentView from "@/components/ParentView";
import InnerLink from "@/layout/components/InnerLink";

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    defaultRoutes: [],
    topbarRouters: [],
    sidebarRouters: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes;
      state.routes = constantRoutes.concat(routes);
    },
    SET_DEFAULT_ROUTES: (state, routes) => {
      state.defaultRoutes = constantRoutes.concat(routes);
    },
    SET_TOPBAR_ROUTES: (state, routes) => {
      // 顶部导航菜单默认添加统计报表栏指向首页
      // const index = [{
      //   path: 'index',
      //   meta: { title: '统计报表', icon: 'dashboard'}
      // }]
      state.topbarRouters = routes;
    },
    SET_SIDEBAR_ROUTERS: (state, routes) => {
      state.sidebarRouters = routes;
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise((resolve) => {
        // 向后端请求路由数据
        // const res = {
        //     data: [{
        //         meta: {
        //             icon: "#",
        //             link: null,
        //             noCache: false,
        //             title: "",
        //         },
        //         path: "/cloud",
        //         alwaysShow: true,
        //         component: "Layout",
        //         hidden: false,
        //         children: [{
        //                 component: "index",
        //                 hidden: false,
        //                 name: "Index",
        //                 path: "index",
        //                 meta: {
        //                     icon: "dashboard",
        //                     link: null,
        //                     noCache: false,
        //                     title: "首页",
        //                 },
        //             },
        //             {
        //                 alwaysShow: true,
        //                 path: "drivSchool",
        //                 name: "DrivSchool",
        //                 hidden: false,
        //                 component: "ParentView",
        //                 meta: {
        //                     icon: "peoples",
        //                     link: null,
        //                     noCache: false,
        //                     title: "驾校管理",
        //                 },
        //                 children: [{
        //                         component: "drivSchool/drivInformation/index",
        //                         hidden: false,
        //                         name: "DrivInformation",
        //                         path: "DrivInformation",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "信息管理",
        //                         },
        //                     },
        //                     {
        //                         component: "drivSchool/capacity/index",
        //                         hidden: false,
        //                         name: "Capacity",
        //                         path: "capacity",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "管控用户",
        //                         },
        //                     },
        //                     {
        //                         component: "drivSchool/studentmanagement/index",
        //                         hidden: false,
        //                         name: "StudentManagement",
        //                         path: "studentmanagement",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "学员管理",
        //                         },
        //                     },
        //                     {
        //                         component: "drivSchool/coachManagement/index",
        //                         hidden: false,
        //                         name: "CoachManagement",
        //                         path: "coachManagement",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "教练管理",
        //                         },
        //                     },
        //                 ],
        //             },
        //             {
        //                 alwaysShow: true,
        //                 path: "train",
        //                 name: "Train",
        //                 hidden: false,
        //                 component: "ParentView",
        //                 meta: {
        //                     icon: "peoples",
        //                     link: null,
        //                     noCache: false,
        //                     title: "培训过程管理",
        //                 },
        //                 children: [{
        //                         component: "drivschoolrules/index",
        //                         hidden: false,
        //                         name: "DrivSchoolRules",
        //                         path: "drivschoolrules",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "驾校规则",
        //                         },
        //                     },
        //                     {
        //                         component: "train/studenttrain/index",
        //                         hidden: false,
        //                         name: "StudentTrain",
        //                         path: "studenttrain",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "学员训练记录",
        //                         },
        //                     },
        //                     {
        //                         component: "train/teachertrain/index",
        //                         hidden: false,
        //                         name: "TeacherTrain",
        //                         path: "teachertrain",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "教练使用记录",
        //                         },
        //                     },
        //                 ],
        //             },
        //             {
        //                 component: "statistics/index",
        //                 hidden: false,
        //                 name: "Statistics",
        //                 path: "statistics",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "统计分析",
        //                 },
        //             },
        //             {
        //                 alwaysShow: true,
        //                 path: "robot",
        //                 name: "Robot",
        //                 hidden: false,
        //                 component: "ParentView",
        //                 meta: {
        //                     icon: "peoples",
        //                     link: null,
        //                     noCache: false,
        //                     title: "机器人教练管理",
        //                 },
        //                 children: [{
        //                         component: "robot/goldmedal/index",
        //                         hidden: false,
        //                         name: "GoldMedal",
        //                         path: "goldmedal",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "机器人教练信息操作",
        //                         },
        //                     },
        //                     {
        //                         component: "robot/modelFile/index",
        //                         hidden: false,
        //                         name: "ModelFile",
        //                         path: "modelFile",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "车型文件配置",
        //                         },
        //                     },
        //                     {
        //                         component: "robot/vehicleFile/index",
        //                         hidden: false,
        //                         name: "VehicleFile",
        //                         path: "vehicleFile",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "车辆文件配置",
        //                         },
        //                     },
        //                     {
        //                         component: "robot/vehicleConfig/index",
        //                         hidden: false,
        //                         name: "VehicleConfig",
        //                         path: "vehicleConfig",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "车载参数配置",
        //                         },
        //                     },
        //                     {
        //                         component: "robot/systemparameter/index.vue",
        //                         hidden: false,
        //                         name: "SystemParameter",
        //                         path: "systemparameter",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "系统参数配置",
        //                         },
        //                     },
        //                     {
        //                         component: "robot/boardparameter/index.vue",
        //                         hidden: false,
        //                         name: "BoardParameter",
        //                         path: "boardparameter",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "车载设备配置",
        //                         },
        //                     },
        //                     {
        //                         component: "robot/audiovideoequipment/index.vue",
        //                         hidden: false,
        //                         name: "AudioVideoEquipment",
        //                         path: "audiovideoequipment",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "音视频设备配置",
        //                         },
        //                     },
        //                 ],
        //             },
        //             {
        //                 component: "jiananxing/index",
        //                 hidden: false,
        //                 name: "Jiananxing",
        //                 path: "jiananxing",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "智能模拟器管理",
        //                 },
        //             },
        //             {
        //                 component: "orderManagement/index",
        //                 hidden: false,
        //                 name: "orderManagement",
        //                 path: "orderManagement",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "订单管理",
        //                 },
        //             },
        //             // {
        //             //     component: "ParentView",
        //             //     hidden: false,
        //             //     name: "SmartDevice",
        //             //     path: "smartdevice",
        //             //     alwaysShow: true,
        //             //     meta: {
        //             //         icon: "tree-table",
        //             //         link: null,
        //             //         noCache: false,
        //             //         title: "智能设备管理",
        //             //     },
        //             //     children: [{
        //             //             component: "goldmedal/index",
        //             //             hidden: false,
        //             //             name: "GoldMedal",
        //             //             path: "goldmedal",
        //             //             meta: {
        //             //                 icon: "tree-table",
        //             //                 link: null,
        //             //                 noCache: false,
        //             //                 title: "金牌教练管理",
        //             //             },
        //             //         },
        //             //         {
        //             //             component: "jiananxing/index",
        //             //             hidden: false,
        //             //             name: "Jiananxing",
        //             //             path: "jiananxing",
        //             //             meta: {
        //             //                 icon: "tree-table",
        //             //                 link: null,
        //             //                 noCache: false,
        //             //                 title: "简安行管理",
        //             //             },
        //             //         },
        //             //     ],
        //             // },

        //             // {
        //             //   component: "financial/index",
        //             //   hidden: false,
        //             //   name: "Financial",
        //             //   path: "financial",
        //             //   meta: {
        //             //     icon: "tree-table",
        //             //     link: null,
        //             //     noCache: false,
        //             //     title: "财务报表",
        //             //   },
        //             // },
        //             {
        //                 component: "ParentView",
        //                 alwaysShow: true,
        //                 hidden: false,
        //                 name: "User",
        //                 path: "user",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "用户管理",
        //                 },
        //                 children: [{
        //                         component: "user/index",
        //                         hidden: false,
        //                         name: "User",
        //                         path: "userlist",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "用户列表",
        //                         },
        //                     },
        //                     {
        //                         component: "user/role",
        //                         hidden: false,
        //                         name: "Role",
        //                         path: "role",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "角色管理",
        //                         },
        //                     },
        //                     {
        //                         component: "user/updatepwd",
        //                         hidden: false,
        //                         name: "UpdatePwd",
        //                         path: "updatepwd",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "修改密码",
        //                         },
        //                     },
        //                 ],
        //             },
        //             {
        //                 component: "ParentView",
        //                 alwaysShow: true,
        //                 hidden: false,
        //                 name: "ContentManagement",
        //                 path: "contentmanagement",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "内容管理",
        //                 },
        //                 children: [{
        //                         component: "teachingvideo/index",
        //                         hidden: false,
        //                         name: "TeachingVideo",
        //                         path: "teachingvideo",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "教学视频管理",
        //                         },
        //                     },
        //                     {
        //                         component: "adscontent/index",
        //                         hidden: false,
        //                         name: "AdsContent",
        //                         path: "adscontent",
        //                         meta: {
        //                             icon: "tree-table",
        //                             link: null,
        //                             noCache: false,
        //                             title: "广告内容管理",
        //                         },
        //                     },
        //                 ],
        //             },
        //             {
        //                 component: "ParentView",
        //                 alwaysShow: true,
        //                 hidden: false,
        //                 name: "Operation",
        //                 path: "operation",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "运营管理",
        //                 },
        //                 children: [{
        //                     component: "operation/index",
        //                     hidden: false,
        //                     name: "Operation",
        //                     path: "operation",
        //                     meta: {
        //                         icon: "tree-table",
        //                         link: null,
        //                         noCache: false,
        //                         title: "管理记录",
        //                     },
        //                 }, ],
        //             },
        //             {
        //                 component: "system/dict/index",
        //                 hidden: false,
        //                 name: "dict",
        //                 path: "dict",
        //                 meta: {
        //                     icon: "tree-table",
        //                     link: null,
        //                     noCache: false,
        //                     title: "字典管理",
        //                 },
        //             },
        //         ],
        //     }, ],
        // };
        const res = {
          data: [
            {
              meta: {
                icon: "#",
                link: null,
                noCache: false,
                title: ""
              },
              path: "/cloud",
              alwaysShow: true,
              component: "Layout",
              hidden: false,
              children: []
            }
          ]
        };

        getRouters().then((r) => {
          res.data[0].children = r.data;
          const sdata = JSON.parse(JSON.stringify(res.data));
          const rdata = JSON.parse(JSON.stringify(res.data));
          const sidebarRoutes = filterAsyncRouter(sdata);
          const rewriteRoutes = filterAsyncRouter(rdata, false, true);
          rewriteRoutes.push({
            path: "*",
            redirect: "/404",
            hidden: true
          });
          commit("SET_ROUTES", rewriteRoutes);
          commit("SET_SIDEBAR_ROUTERS", constantRoutes.concat(sidebarRoutes));
          commit("SET_DEFAULT_ROUTES", sidebarRoutes);
          commit("SET_TOPBAR_ROUTES", sidebarRoutes);
          resolve(rewriteRoutes);
        });
      });
    }
  }
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (route.component === "InnerLink") {
        route.component = InnerLink;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children != null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView") {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve);
};

export default permission;
