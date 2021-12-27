<template>
    <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
                <el-button type="primary" @click="addUpdateMenuButton(0)">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                stripe
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
            <el-table-column
                    prop="name"
                    label="名称"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="perms"
                    label="权限编码"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="icon"
                    label="图标">
            </el-table-column>
            <el-table-column
                    prop="type"
                    label="类型"
                    width="120">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.type === 0" size="small">目录</el-tag>
                    <el-tag v-else-if="scope.row.type === 1" size="small" type="success">菜单</el-tag>
                    <el-tag v-else-if="scope.row.type === 2" size="small" type="info">按钮</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    prop="path"
                    label="菜单URL">
            </el-table-column>
            <el-table-column
                    prop="component"
                    label="菜单组件">
            </el-table-column>
            <el-table-column
                    prop="orderNum"
                    label="排序号">
            </el-table-column>
            <el-table-column
                    prop="statu"
                    label="状态"
                    width="120">
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.statu === 0" size="small" type="danger">禁用</el-tag>
                    <el-tag v-else-if="scope.row.statu === 1" size="small" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="120">
                <template slot-scope="scope">
                    <el-button type="text" @click="addUpdateMenuButton(scope.row.id)" >编辑</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-popconfirm title="确定要删除这条记录吗？" >
                        <el-button type="text" slot="reference">删除</el-button>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>
        <AddUpdateMenu ref="addUpdateMenu" v-if="addUpdateMenuvisible" @refreshDataList="getMenuTree"></AddUpdateMenu>
    </div>
</template>

<script>
    import AddUpdateMenu from "./AddUpdateMenu";
    export default {
        name: "Menu",
        components:{
          AddUpdateMenu,
        },
        data() {
            return {
                searchForm: {
                    name: ''
                },
                tableData: [],
                addUpdateMenuvisible:false,
            }
        },
        created() {
            this.getMenuTree();
        },
        methods:{
            getMenuTree() {
                console.log("1111")
                this.$axios.get("/admin/menu/list").then(res => {
                    this.tableData = res.data;
                })
            },
            addUpdateMenuButton(id){
                this.addUpdateMenuvisible=true;
                console.log("qq",this.$refs.addUpdateMenu)
                this.$nextTick(()=>{
                    this.$refs.addUpdateMenu.init(id);
                })
            }
        }

    }
</script>

<style scoped>

</style>