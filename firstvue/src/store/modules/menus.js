import Vue from 'vue'
import Vuex from 'vuex'
import fa from "element-ui/src/locale/lang/fa";
Vue.use(Vuex)
export default {
    state: {
        // 菜单栏数据
        menuList:  [],
        // 权限数据
        permList:  [],
        hasRoute: false,
        editableTabsValue: 'Index',
        editableTabs: [
            {
                title: '首页',
                name: 'Index'
            }
        ],
    },
    mutations: {
        changeRouteStatus(state, hasRoute) {
            state.hasRoute = hasRoute
            sessionStorage.setItem("hasRoute", hasRoute)
        },
        setMenuList(state, menus) {
            state.menuList = menus
        },
        setPermList(state, authoritys) {
            state.permList = authoritys
        },
        addTabs(state, tab) {
            console.log(tab)
            // 判断是否在栈内
            let index = state.editableTabs.findIndex(item => item.name === tab.name)
            if (index === -1) {
                // 添加到tabs中
                state.editableTabs.push(tab)
            }
            // 当前激活的tab
            state.editableTabsValue = tab.name
        },
        setActiveTab(state, tabName) {
            state.editableTabsValue = tabName
        },
        resetState:(state)=>{
            state.permList=[];
            state.menuList=[];
            state.hasRoute=false;
            state.editableTabsValue="Index";
            state.editableTabs=[
                {
                    title: '首页',
                    name: 'Index'
                }
            ]
        }
    }
}