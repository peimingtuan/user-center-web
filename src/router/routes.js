const routes = [
    {
        path: '/Login',
        name: 'Login',
        meta:{
          title:'登录'
        },
        component: () => import("../views/Login")
    },
    {
        path: '/IntranetLogin',
        name: 'IntranetLogin',
        meta:{
            title:'登录'
        },
        component: () => import("../views/IntranetLogin")
    },
    {
        path: '/Regist',
        name: 'Regist',
        meta:{
            title:'注册'
        },
        component: () => import("../views/Regist")
    },
    {
        path: '*',
        name: '404',
        component: ()=> import("../views/404")
    },
    {
        path: '/test',
        name: 'test',
        component: ()=> import("../views/test")
    },
    {
        path: '/500',
        name: '500',
        component: ()=> import("../views/500")
    },
    {
        path: '/Disconnected',
        name: 'Disconnected',
        component: ()=> import("../views/Disconnected")
    },
    {
        path: '/Developing',
        name: 'Developing',
        component: ()=> import("../views/Developing")
    },
    {
        path: '/indexMain',
        name: 'indexMain',
        meta: {
            requireAuth: true
        },
        component: () => import("../views/IndexMain"),
        redirect: '/indexMain/HomePage',
        children: [
            {
                path: '/indexMain/HomePage',
                meta: {
                    title: '首页',
                    requireAuth: true
                },
                component: () => import("../views/HomePage")
            },
            {
                path: '/indexMain/SystemManagement',
                meta:{
                    title:'系统管理',
                    requireAuth: true
                },
                component: () => import("../views/SystemManagement"),
                //redirect: '/indexMain/SystemManagement/UnitManage',
                children: [
                    {
                        path: '/indexMain/SystemManagement/UnitManage',
                        meta:{
                            title:'单位管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/UnitManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/DepartmentManage',
                        meta:{
                            title:'部门管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/DepartmentManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/DutiesManage',
                        meta:{
                            title:'职务管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/DutiesManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/GroupManage',
                        meta:{
                            title:'职务管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/GroupManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/RoleManage',
                        meta:{
                            title:'角色管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/RoleManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/InstitutionPersonManage',
                        meta:{
                            title:'机构人员管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/InstitutionPersonManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/SystemUsersManage',
                        meta:{
                            title:'系统用户管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/SystemUsersManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/DataSyncManage',
                        meta:{
                            title:'数据同步管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/DataSyncManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/PortalManage',
                        meta:{
                            title:'portal管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/PortalManage"),
                        redirect:'/indexMain/SystemManagement/PortalManage/PortalSubgroup',
                        children:[
                            {
                                path:'/indexMain/SystemManagement/PortalManage/PortalSubgroup',
                                meta:{
                                    title:'portal组件管理',
                                    requireAuth: true
                                },
                                component: () => import("../views/system-management/portal-manage/PortalSubgroup"),
                            },
                            {
                                path:'/indexMain/SystemManagement/PortalManage/ComposeSubgroup',
                                meta:{
                                    title:'组合组件管理',
                                    requireAuth: true
                                },
                                component: () => import("../views/system-management/portal-manage/ComposeSubgroup"),
                            },
                            {
                                path:'/indexMain/SystemManagement/PortalManage/FastWay',
                                meta:{
                                    title:'应用快捷方式配置',
                                    requireAuth: true
                                },
                                component: () => import("../views/system-management/portal-manage/FastWay"),
                            }
                        ]
                    },
                    {
                        path: '/indexMain/SystemManagement/ApplyManage',
                        meta:{
                            title:'应用管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/ApplyManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/ApplicationModule',
                        meta:{
                            title:'应用模块管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/ApplicationModule")
                    },
                    {
                        path: '/indexMain/SystemManagement/InterfaceManage',
                        meta:{
                            title:'接口管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/InterfaceManage")
                    },
                    {
                        path: '/indexMain/SystemManagement/IUserManage',
                        meta:{
                            title:'接口用户管理',
                            requireAuth: true
                        },
                        component: () => import("../views/system-management/IUserManage")
                    },
                ]
            },
            {
                path: '/indexMain/LogManagement',
                meta:{
                    title:'日志管理',
                    requireAuth: true
                },
                component: () => import("../views/LogManagement"),
                redirect: '/indexMain/LogManagement/LoginLog',
                children:[
                    {
                        path: '/indexMain/LogManagement/LoginLog',
                        meta:{
                            title:'登录日志',
                            requireAuth: true
                        },
                        component: () => import("../views/log-management/LoginLog")
                    },
                    {
                        path: '/indexMain/LogManagement/UserLog',
                        meta:{
                            title:'用户日志',
                            requireAuth: true
                        },
                        component: () => import("../views/log-management/UserLog")
                    },
                    {
                        path: '/indexMain/LogManagement/SynchronizationLog',
                        meta:{
                            title:'同步日志',
                            requireAuth: true
                        },
                        component: () => import("../views/log-management/SynchronizationLog")
                    },
                ]
            },
            {
                path: '/indexMain/Shortcut',
                meta:{
                    title:'应用导航',
                    requireAuth: true
                },
                component: () => import("../views/Shortcut")
            },
        ]
    }
]

export {
    routes
}