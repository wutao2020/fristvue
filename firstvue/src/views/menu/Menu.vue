<template>
    <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
            <el-form-item>
                <el-button v-if="open" type="success" style="margin-bottom:10px;" @click="Toexpandall">全部展开</el-button>
                <el-button v-if="close" type="danger" style="margin-bottom:10px;" @click="ToClose">全部收起</el-button>
                <el-button type="primary" @click="addUpdateMenuButton(0)">新增</el-button>
            </el-form-item>
        </el-form>
        <el-table
                :data="tableData"
                style="width: 100%;margin-bottom: 20px;"
                row-key="id"
                border
                stripe
                ref="tabletree"
                :default-expand-all="false"
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
                    label="图标" width="80">
                <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                </template>
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
                    label="菜单URL" width="120">
            </el-table-column>
            <el-table-column
                    prop="component"
                    label="菜单组件" width="150">
            </el-table-column>
            <el-table-column
                    prop="orderNum"
                    label="排序号" width="80">
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
                    width="240">
                <template slot-scope="scope">
                    <el-button type="primary" plain  @click="addUpdateMenuButton(scope.row.id)"
                    v-if="hasAuth('sys:menu:update')">编辑</el-button>
                    <el-popconfirm title="确定要删除这条记录吗？" @confirm="delHandle(scope.row.id)"
                                   v-if="hasAuth('sys:menu:delete')">
                        <el-button type="danger"  slot="reference">删除</el-button>
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
                open: true,
                close:false,
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

          delHandle(id) {
            this.$axios.post("/admin/menu/delete/" + id).then(res => {
              this.$message({
                showClose: true,
                message: '恭喜你，操作成功',
                type: 'success',
                onClose:() => {
                  this.getMenuTree()
                }
              });

            })
          },
            addUpdateMenuButton(id){
                this.addUpdateMenuvisible=true;
                console.log("qq",this.$refs.addUpdateMenu)
                this.$nextTick(()=>{
                    this.$refs.addUpdateMenu.init(id);
                })
            },
            // 全部展开
            Toexpandall() {
                let els = document.getElementsByClassName('el-table__expand-icon')
                if(this.tableData.length !=0 && els.length != 0){
                    this.open = false
                    this.close = true
                    for(let j1=0;j1<els.length;j1++){
                        els[j1].classList.add("dafult")
                    }
                    if(this.$el.getElementsByClassName('el-table__expand-icon--expanded')){
                        const open = this.$el.getElementsByClassName('el-table__expand-icon--expanded')
                        for(let j=0;j<open.length;j++){
                            open[j].classList.remove("dafult")
                            // open[j].classList.remove("el-table__expand-icon--expanded")
                            // open[j].click(function(event) {
                            //   event.preventDefault();
                            // })
                        }
                        const dafult = this.$el.getElementsByClassName('dafult')
                        for(let a=0;a<dafult.length;a++){
                            dafult[a].click()
                        }
                    }
                }
            },
            // 全部收起
            ToClose() {
                if(this.tableData.length !=0){
                    this.open = true
                    this.close = false
                    const elsopen = this.$el.getElementsByClassName('el-table__expand-icon--expanded')
                    if(this.$el.getElementsByClassName('el-table__expand-icon--expanded')){
                        for(let i=0;i<elsopen.length;i++){
                            elsopen[i].click()
                        }
                    }
                }
            }
        }
    }
</script>

<style scoped>
.el-button{
    padding: 0 10px;
    height: 30px;
    line-height:30px;
    font-size:12px;
    margin-right: 10px;
}
</style>