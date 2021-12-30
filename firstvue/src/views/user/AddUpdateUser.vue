<template>
    <!--新增对话框-->
    <el-dialog
            :title="editForm.id?'编辑用户':'新增用户'"
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
                <el-input v-model="editForm.phone"  autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="头像" prop="avatar" label-width="100px">
                <VploadImg :limit="1" v-bind:file-list="fileList" :file-type="1"   @submitImg="getImgList" ></VploadImg>

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
    import VploadImg from "../inc/VploadImg";
    export default {
        name: "AddUpdateUser",
        components:{
          VploadImg
        },
        data(){
            return{
                editForm:{},
                avatar:'',
                fileList:[],
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
                this.fileList=[];
            },
            handleClose() {
                this.resetForm('editForm')
            },
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/admin/user/' + (this.editForm.id?'update' : 'save'), this.editForm)
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
            getImgList(url) {
                //  url
                console.log("www",url)
                this.editForm.avatar=url
            },
            init(id){
                this.dialogVisible=true;
                if (id!=null&&id!=''&&id>0){
                    this.$axios.get('/admin/user/info/' + id).then(res => {
                        this.editForm = res.data
                        var filess={url:res.data.avatar}
                        this.fileList.push(filess)
                    })
                }
            },
        }
    }
</script>

<style scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
</style>