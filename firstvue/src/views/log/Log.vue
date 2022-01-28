<template>
    <div>
        <el-form :inline="true">
                <el-form-item label="操作员名称" label-width="100px">
                <el-input
                        v-model="searchForm.operUserName"
                        placeholder="操作员名称"
                        clearable>
                </el-input>
                </el-form-item>
            <el-form-item label="发生异常时间" label-width="100px">
                <el-date-picker
                        v-model="searchForm.createTime"
                        type="date"
                        placeholder="发生异常时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="日志来源" label-width="100px">
                <el-select v-model="searchForm.isManage" clearable   placeholder="请选择日志来源">
                    <el-option
                            v-for="item in isManageList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item>
                <el-button @click="getlogList">搜索</el-button>
            </el-form-item>

<!--            <el-form-item>-->
<!--                <el-button type="primary" @click="addUpdateUserButton(null)" v-if="hasAuth('sys:user:save')">新增</el-button>-->
<!--            </el-form-item>-->
<!--            <el-form-item>-->
<!--                <el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">-->
<!--                    <el-button type="danger" slot="reference" :disabled="delBtlStatu" v-if="hasAuth('sys:user:delete')">批量删除</el-button>-->
<!--                </el-popconfirm>-->
<!--            </el-form-item>-->
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
                    align="center"
                    fixed="left"
                    type="selection"
                    width="55">
            </el-table-column>

            <el-table-column
                    label="操作员名称"
                    align="center"
                    prop="operUserName"
                    width="200">
            </el-table-column>

            <el-table-column
                    prop="createTime"
                    align="center"
                    label="发生异常时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="operIp"
                    align="center"
                    width="200"
                    label="ip">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="200"
                    prop="module"
                    label="模块">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="200"
                    prop="operDesc"
                    label="操作描述">
            </el-table-column>
            <el-table-column
                    align="center"
                    width="200"
                    label="操作类型"
                    prop="operType"
            ></el-table-column>
            <el-table-column
                    prop="isAbnormal"
                    align="center"
                    width="200"
                    label="是否异常">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.isAbnormal === 0" type="success">正常</el-tag>
                    <el-tag size="small" v-else-if="scope.row.isAbnormal === 1" type="danger">异常</el-tag>
                </template>

            </el-table-column>
            <el-table-column
                    prop="isManage"
                    align="center"
                    width="200"
                    label="日志来源">
                <template slot-scope="scope">
                    <el-tag size="small" v-if="scope.row.isManage === 0" type="success">app</el-tag>
                    <el-tag size="small" v-else-if="scope.row.isManage === 1" type="danger">管理端</el-tag>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    width="200"
                    label="路径"
                    prop="operUri"
            ></el-table-column>
<!--            <el-table-column-->
<!--                    prop="icon"-->
<!--                    align="center"-->

<!--                    width="350px"-->
<!--                    label="操作">-->
<!--                <template slot-scope="scope">-->
<!--                    <el-button type="success" plain @click="roleHandle(scope.row.id)" v-if="hasAuth('sys:user:role')">分配角色</el-button>-->

<!--                    <el-button type="warning" plain @click="repassHandle(scope.row.id, scope.row.username)"  v-if="hasAuth('sys:user:repass')">重置密码</el-button>-->

<!--                    <el-button type="primary" plain @click="addUpdateUserButton(scope.row.id)" v-if="hasAuth('sys:user:update')">编辑</el-button>-->


<!--                    <template v-if="hasAuth('sys:user:delete')">-->
<!--                        <el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">-->
<!--                            <el-button type="danger" plain slot="reference">删除</el-button>-->
<!--                        </el-popconfirm>-->
<!--                    </template>-->

<!--                </template>-->
<!--            </el-table-column>-->
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
<!--        <AddUpdateUser ref="addUpdateUser" v-if="addUpdateUservisible" @refreshDataList="getUserList"></AddUpdateUser>-->
<!--        <AssignRoles ref="adssignRoles" v-if="assignRolesvisible" @refreshDataList="getUserList"></AssignRoles>-->
    </div>
</template>

<script>
    export default {
        name: "Log",
        data(){
            return{
                searchForm:{},
                delBtlStatu:true,
                tableData:[],
                total: 0,
                size: 10,
                current: 1,
                // addUpdateUservisible: false,
                // assignRolesvisible: false,
                isManageList: [{
                    value: '1',
                    label: '管理端'
                }, {
                    value: '0',
                    label: 'app'
                }],
            }
        },
        created() {
            this.getlogList();
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
            getlogList() {
                this.$axios.get("/admin/logs/list", {
                    params: {
                        operUserName: this.searchForm.operUserName,
                        createTime:this.searchForm.createTime,
                        isManage:this.searchForm.isManage,
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

        }
    }

</script>

<style scoped>

</style>