<template>
    <!-- 分配权限对话框 -->
    <el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">

        <el-form :model="roleForm">
            <el-tree
                    :data="roleTreeData"
                    show-checkbox
                    ref="roleTree"
                    :check-strictly=checkStrictly
                    node-key="id"
                    :default-expand-all=true
                    :props="defaultProps">
            </el-tree>
        </el-form>

        <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('roleForm')">取 消</el-button>
            <el-button type="primary" @click="submitRoleHandle('roleForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "AssignRoles",
        data(){
            return{
                roleTreeData:[],
                roleDialogFormVisible:false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                roleForm: {},
                roleTreeData:  [],
                treeCheckedKeys: [],
                checkStrictly: true
            }
        },
        created() {
            this.$axios.get("/role/list").then(res => {
                this.roleTreeData = res.data.records
            })
        },
        methods:{
            submitRoleHandle(formName) {
                var menuIds = this.$refs.roleTree.getCheckedKeys()
                console.log(menuIds)
                this.$axios.post('/role/perm/' + this.roleForm.id, menuIds).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.$emit('refreshDataList')
                        }
                    });
                    this.roleDialogFormVisible = false
                    this.resetForm(formName)
                })
            },
            resetForm(formName) {
                this.roleDialogFormVisible = false
                this.permForm = {}
            },
            init(id){
                this.roleDialogFormVisible = true
                this.$axios.get('/user/info/' + id).then(res => {
                    this.roleForm = res.data
                    let roleIds = []
                    res.data.roles.forEach(row => {
                        roleIds.push(row.id)
                    })
                    this.$refs.roleTree.setCheckedKeys(roleIds)
                })
            }
        }
    }
</script>

<style scoped>

</style>