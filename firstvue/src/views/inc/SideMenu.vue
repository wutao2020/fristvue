<template>
    <el-menu
            class="el-menu-vertical-demo"
            background-color="#545c64"
            text-color="#fff"
            active-text-color="#ffd04b"
            :default-active="activeMenu">
        <router-link to="/index">
            <el-menu-item index="Index">
                <template slot="title">
                    <i class="el-icon-s-home"></i>
                    <span slot="title">首页</span>
                </template>
            </el-menu-item>
        </router-link>
        <el-submenu :index="menu.name" v-for="menu in menuList">
            <template slot="title">
                <i :class="menu.icon"></i>
                <span>{{menu.title}}</span>
            </template>
            <router-link :to="item.path" v-for="item in menu.children">
                <el-menu-item :index="item.name" @click="selectMenu(item)">
                    <template slot="title">
                        <i :class="item.title"></i>
                        <span slot="title">{{item.title}}</span>
                    </template>
                </el-menu-item>
            </router-link>
        </el-submenu>
    </el-menu>
</template>

<script>
    export default {
        name: "SideMenu",
        data() {
            return {
                menuList:this.$store.state.menus.menuList,
            }
        },
        computed: {
            activeMenu() {
                return this.$store.state.menus.editableTabsValue
            }
        },
        methods:{
            selectMenu(item) {
                console.log(item)
                let obj = {
                    name: item.name,
                    title: item.title
                }
                this.$store.commit("addTabs", obj)
            }
        }
    }
</script>

<style scoped>
    .el-menu-vertical-demo{
        height: 100%;
    }
</style>