<template>
    <el-dialog
            title="分配权限"
            :visible.sync="permDialogVisible"
            width="600px">

        <el-form :model="permForm">

            <el-tree
                    :data="permTreeData"
                    show-checkbox
                    ref="permTree"
                    :default-expand-all=true
                    node-key="id"
                    :props="defaultProps">
            </el-tree>

        </el-form>

        <span slot="footer" class="dialog-footer">
			    <el-button @click="resetForm('permForm')">取 消</el-button>
			    <el-button type="primary" @click="submitPermFormHandle('permForm')">确 定</el-button>
			</span>

    </el-dialog>
</template>

<script>
    export default {
        name: "AssignPermissions",
        data(){
            return{
                permDialogVisible:false,
                permTreeData:[],
                permForm: {},
                defaultProps: {
                    children: 'children',
                    label: 'name'
                }
            }
        },
        created() {
            this.$axios.get('/admin/menu/list').then(res => {
                this.permTreeData = res.data;
            })
        },
        methods:{
            submitPermFormHandle(formName) {
                var menuIds = this.$refs.permTree.getCheckedKeys()
                console.log(menuIds)
                this.$axios.post('/role/perm/' + this.permForm.id, menuIds).then(res => {
                    this.$message({
                        showClose: true,
                        message: '恭喜你，操作成功',
                        type: 'success',
                        onClose:() => {
                            this.$emit('refreshDataList')
                        }
                    });
                    this.permDialogVisible = false
                    this.resetForm(formName)
                })
            },
            resetForm(formName) {
                this.permDialogVisible = false
                this.permForm = {}
            },
            init(id){
                this.permDialogVisible=true;
                this.$axios.get("/admin/role/info/" + id).then(res => {
                    this.$refs.permTree.setCheckedKeys(res.data.menuIds)
                    this.permForm = res.data
                })
            }
        }
    }
</script>

<style scoped>

</style>