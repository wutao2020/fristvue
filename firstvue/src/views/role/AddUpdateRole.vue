<template>

    <!--新增对话框-->
    <el-dialog
            :title="editForm.id?'编辑角色':'新增角色'"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">

        <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

            <el-form-item label="角色名称" prop="name" label-width="100px">
                <el-input v-model="editForm.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="唯一编码" prop="code" label-width="100px">
                <el-input v-model="editForm.code" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="描述" prop="remark" label-width="100px">
                <el-input v-model="editForm.remark" autocomplete="off"></el-input>
            </el-form-item>


            <el-form-item label="状态" prop="statu" label-width="100px">
                <el-radio-group v-model="editForm.statu">
                    <el-radio :label=0>禁用</el-radio>
                    <el-radio :label=1>正常</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
                <el-button @click="resetForm('editForm')">重置</el-button>
            </el-form-item>
        </el-form>

    </el-dialog>
</template>

<script>
    export default {
        name: "AddUpdateRole",
        data(){
            return{
                editForm:{},
                editFormRules: {
                    name: [
                        {required: true, message: '请输入角色名称', trigger: 'blur'}
                    ],
                    code: [
                        {required: true, message: '请输入唯一编码', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                },
                dialogVisible: false,
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
                        this.$axios.post('/role/' + (this.editForm.id?'update' : 'save'), this.editForm)
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
                    this.$axios.get('/role/info/' + id).then(res => {
                        this.editForm = res.data
                    })
                }
            },
        }
    }
</script>

<style scoped>

</style>