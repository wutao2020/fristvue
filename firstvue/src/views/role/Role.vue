<template>
    <div>
        <el-form :inline="true">
            <el-form-item>
                <el-input
                        v-model="searchForm.name"
                        placeholder="名称"
                        clearable
                >
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button @click="getRoleList">搜索</el-button>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="addUpdateRoleButton(0)" v-if="hasAuth('sys:role:save')">新增</el-button>
            </el-form-item>
            <el-form-item>
                <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
                    <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:role:delete')">批量删除</el-button>
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
                    align="center"
                    fixed="left"
                    width="55">
            </el-table-column>

            <el-table-column
                    prop="name"
                    label="名称"
                    align="center"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="code"
                    label="唯一编码"
                    width="100"
                    align="center"
                    show-overflow-tooltip>
            </el-table-column>
            <el-table-column
                    prop="remark"
                    label="描述"
                    align="center"
                    show-overflow-tooltip>
            </el-table-column>

            <el-table-column
                    prop="statu"
                    width="80"
                    align="center"
                    label="状态">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.statu === 1" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.statu === 0" type="danger">禁用</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="icon"
                    width="250"
                    align="center"
                    fixed="right"
                    label="操作">

                <template slot-scope="scope">
                    <el-button type="success" plain @click="permHandle(scope.row.id)" v-if="hasAuth('sys:role:perm')">分配权限</el-button>


                    <el-button type="primary" plain @click="addUpdateRoleButton(scope.row.id)" v-if="hasAuth('sys:role:update')">编辑</el-button>


                    <template v-if="hasAuth('sys:role:delete')">
                        <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
                            <el-button type="danger" plain slot="reference">删除</el-button>
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
        <AddUpdateRole ref="addUpdateRole" v-if="addUpdateRolevisible" @refreshDataList="getRoleList"></AddUpdateRole>
        <AssignPermissions ref="assignPermissions" v-if="assignPermissionsvisible" @refreshDataList="getRoleList"></AssignPermissions>
    </div>
</template>

<script>
    import AddUpdateRole from "./AddUpdateRole";
    import AssignPermissions from "./AssignPermissions";
    export default {
        name: "Role",
        components:{
            AddUpdateRole,
            AssignPermissions
        },
        data() {
            return {
                searchForm: {},
                delBtlStatu: true,
                total: 0,
                size: 10,
                current: 1,
                multipleSelection:[],
                addUpdateRolevisible: false,
                assignPermissionsvisible: false,
                tableData: [],
            }
        },
        created() {
            this.getRoleList()
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
                this.getRoleList()
            },
            handleCurrentChange(val) {
                console.log(`当前页: ${val}`);
                this.current = val
                this.getRoleList()
            },

            getRoleList() {
                this.$axios.get("/admin/role/list", {
                    params: {
                        name: this.searchForm.name,
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
            addUpdateRoleButton(id){
                this.addUpdateRolevisible=true
                this.$nextTick(()=>{
                    this.$refs.addUpdateRole.init(id);
                })
            },
            permHandle(id){
                this.assignPermissionsvisible=true
                this.$nextTick(()=>{
                    this.$refs.assignPermissions.init(id);
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

                this.$axios.post("/admin/role/delete", ids).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.getRoleList()
                        }
                    });
                })
            },
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