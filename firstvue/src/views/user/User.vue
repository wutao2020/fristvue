<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input
                        v-model="searchForm.username"
                        placeholder="用户名"
                        clearable
                >
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getUserList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addUpdateUserButton(null)" v-if="hasAuth('SysUser:save')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
                    <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('SysUser:del')">批量删除</el-button>
                </el-popconfirm>
            </el-form-item>
        </el-form>

        <el-table
                ref="multipleTable"
                :data="tableData"
                tooltip-effect="dark"
                style="width: 100%"
                border
                stripe
                @selection-change="handleSelectionChange">

            <el-table-column
                    type="selection"
                    width="55">
            </el-table-column>

            <el-table-column
                    label="头像"
                    width="50">
                <template slot-scope="scope">
                    <el-avatar size="small" :src="scope.row.avatar"></el-avatar>
                </template>
            </el-table-column>

            <el-table-column
                    prop="username"
                    label="用户名"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="角色名称">
                <template slot-scope="scope">
                    <el-tag size="small" type="info" v-for="item in scope.row.sysRoles">{{item.name}}</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="email"
                    label="邮箱">
            </el-table-column>
            <el-table-column
                    prop="phone"
                    label="手机号">
            </el-table-column>

            <el-table-column
                    prop="statu"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="created"
                    width="200"
                    label="创建时间"
            >
            </el-table-column>
            <el-table-column
                    prop="icon"
                    width="260px"
                    label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" @click="repassHandle(scope.row.id, scope.row.username)">重置密码</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <el-button type="text" @click="addUpdateUserButton(scope.row.id)">编辑</el-button>
                    <el-divider direction="vertical"></el-divider>

                    <template>
                        <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
                            <el-button type="text" slot="reference">删除</el-button>
                        </el-popconfirm>
                    </template>

                </template>
            </el-table-column>
        </el-table>
        <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :current-page="current"
                :page-size="size"
                :total="total">
        </el-pagination>
        <AddUpdateUser ref="addUpdateUser" v-if="addUpdateUservisible" @refreshDataList="getUserList"></AddUpdateUser>
        <AssignRoles ref="adssignRoles" v-if="assignRolesvisible" @refreshDataList="getUserList"></AssignRoles>
    </div>
</template>

<script>
    import AddUpdateUser from "./AddUpdateUser";
    import AssignRoles from "./AssignRoles";
    export default {
        name: "User",
        components:{
          AddUpdateUser,AssignRoles
        },
        data(){
            return{
                searchForm:{},
                delBtlStatu:true,
                tableData:[],
                total: 0,
                size: 10,
                current: 1,
                addUpdateUservisible: false,
                assignRolesvisible: false,
            }
        },
        created() {
            this.getUserList();
        },
        methods:{
            toggleSelection(rows) {
                if (rows) {
                    rows.forEach(row => {
                        this.$refs.multipleTable.toggleRowSelection(row);
                    });
                } else {
                    this.$refs.multipleTable.clearSelection();
                }
            },
            handleSelectionChange(val) {
                console.log("勾选")
                console.log(val)
                this.multipleSelection = val;

                this.delBtlStatu = val.length == 0
            },

            handleSizeChange(val) {
                console.log(`每页 ${val} 条`);
                this.size = val
                this.getUserList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getUserList()
            },
            getUserList() {
                this.$axios.get("/admin/user/list", {
                    params: {
                        username: this.searchForm.username,
                        current: this.current,
                        size: this.size
                    }
                }).then(res => {
                    this.tableData = res.data.records
                    this.size = res.data.size
                    this.current = res.data.current
                    this.total = res.data.total
                })
            },
            delHandle(id) {

                var ids = []

                if (id) {
                    ids.push(id)
                } else {
                    this.multipleSelection.forEach(row => {
                        ids.push(row.id)
                    })
                }

                console.log(ids)

                this.$axios.post("/user/delete", ids).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.getUserList()
                        }
                    });
                })
            },
            repassHandle(id, username) {

                this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$axios.post("/user/repass", id).then(res => {
                        this.$message({
                            showClose: true,
                            message: '恭喜你，操作成功',
                            type: 'success',
                            onClose: () => {
                            }
                        });
                    })
                })
            },
            addUpdateUserButton(id){
                this.addUpdateUservisible=true;
                this.$nextTick(()=>{
                    this.$refs.addUpdateUser.init(id);
                })
            },
            roleHandle(id){
                this.assignRolesvisible=true;
                this.$nextTick(()=>{
                    this.$refs.adssignRoles.init(id);
                })
            }
        }
    }
</script>

<style scoped>

</style>