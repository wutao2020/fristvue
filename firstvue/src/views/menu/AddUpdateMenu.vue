<template>

    <!--新增对话框-->
    <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="600px"
            :before-close="handleClose">

        <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

            <el-form-item label="上级菜单" prop="parentId">
                <el-select v-model="editForm.parentId" placeholder="请选择上级菜单">
                    <template v-for="item in tableData">
                        <el-option :label="item.name" :value="item.id"></el-option>
                        <template v-for="child in item.children">
                            <el-option :label="child.name" :value="child.id">
                                <span>{{ "- " + child.name }}</span>
                            </el-option>
                        </template>
                    </template>
                </el-select>
            </el-form-item>

            <el-form-item label="菜单名称" prop="name" label-width="100px">
                <el-input v-model="editForm.name" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="权限编码" prop="perms" label-width="100px">
                <el-input v-model="editForm.perms" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="图标" prop="icon" label-width="100px">
                <el-input v-model="editForm.icon" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="菜单URL" prop="path" label-width="100px">
                <el-input v-model="editForm.path" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="菜单组件" prop="component" label-width="100px">
                <el-input v-model="editForm.component" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="类型" prop="type" label-width="100px">
                <el-radio-group v-model="editForm.type">
                    <el-radio :label=0>目录</el-radio>
                    <el-radio :label=1>菜单</el-radio>
                    <el-radio :label=2>按钮</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="状态" prop="statu" label-width="100px">
                <el-radio-group v-model="editForm.statu">
                    <el-radio :label=0>禁用</el-radio>
                    <el-radio :label=1>正常</el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item label="排序号" prop="orderNum" label-width="100px">
                <el-input-number v-model="editForm.orderNum" :min="1" label="排序号">1</el-input-number>
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
        name: "AddUpdateMenu",
        data(){
            return{
                dialogVisible: false,
                editForm: {

                },
                tableData: [],
                editFormRules: {
                    parentId: [
                        {required: true, message: '请选择上级菜单', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入名称', trigger: 'blur'}
                    ],
                    perms: [
                        {required: true, message: '请输入权限编码', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ],
                    orderNum: [
                        {required: true, message: '请填入排序号', trigger: 'blur'}
                    ],
                    statu: [
                        {required: true, message: '请选择状态', trigger: 'blur'}
                    ]
                }
            }
        },
        created() {
            this.getMenuTree();
        },
        methods:{
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$axios.post('/admin/menu/' + (this.editForm.id?'update' : 'save'), this.editForm)
                            .then(res => {

                                this.$message({
                                    showClose: true,
                                    message: '恭喜你，操作成功',
                                    type: 'success',
                                });

                                this.dialogVisible = false
                                this.$emit('refreshDataList')
                            })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },

            getMenuTree() {
                this.$axios.get("/admin/menu/list").then(res => {
                  console.log('wwwtr',res.data)
                    this.tableData = res.data;
                })
            },
            init(id) {
                this.dialogVisible=true;
                if (id!=null&&id!=''&&id>0){
                    this.$axios.get('admin/menu/info/' + id).then(res => {
                        this.editForm = res.data
                    })
                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dialogVisible = false
                this.editForm = {}
            },
            handleClose() {
                this.resetForm('editForm')
            },
        }
    }
</script>

<style scoped>

</style>