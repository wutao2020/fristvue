<template>
    <!--新增对话框-->
    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">

        <el-form :model="editForm" :rules="editFormRules" ref="editForm">
            <el-form-item label="用户名" prop="username" label-width="100px">
                <el-input v-model="editForm.username" autocomplete="off"></el-input>
                <el-alert
                        title="初始密码为888888"
                        :closable="false"
                        type="info"
                        style="line-height: 12px;"
                ></el-alert>
            </el-form-item>

            <el-form-item label="邮箱"  prop="email" label-width="100px">
                <el-input v-model="editForm.email" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="手机号"  prop="phone" label-width="100px">
                <el-input v-model="editForm.phone" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="状态"  prop="statu" label-width="100px">
                <el-radio-group v-model="editForm.statu">
                    <el-radio :label="0">禁用</el-radio>
                    <el-radio :label="1">正常</el-radio>
                </el-radio-group>
            </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="resetForm('editForm')">取 消</el-button>
            <el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
        </div>
    </el-dialog>
</template>

<script>
    export default {
        name: "AddUpdateUser",
        data(){
            return{
                editForm:{},
                dialogVisible:false,
                editFormRules: {
                    username: [
                        {required: true, message: '请输入用户名称', trigger: 'blur'}
                    ],
                    email: [
                        {required: true, message: '请输入邮箱', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
            }
        },
        methods:{
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false
                this.editForm = {}
            },
            handleClose() {
                this.resetForm('editForm')
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/user/' + (this.editForm.id?'update' : 'save'), this.editForm)
                            .then(res => {

                                this.$message({
                                    showClose: true,
                                    message: '恭喜你，操作成功',
                                    type: 'success',
                                    onClose:() => {
                                        this.$emit('refreshDataList')
                                    }
                                });
                                this.dialogVisible = false
                                this.resetForm(formName)
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            init(id){
                this.dialogVisible=true;
                if (id!=null&&id!=''&&id>0){
                    this.$axios.get('/user/info/' + id).then(res => {
                        this.editForm = res.data
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>