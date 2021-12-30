<template>
    <div>
        <el-upload
                :action="actionUrl"
                list-type="picture-card"
                accept=".jpg,.jpeg,.png"
                :on-success="handleSuccess"
                :file-list="fileLists"
                :on-change="handleChange"
                :class="{hide:hideUploadEdit}">
            <i slot="default" class="el-icon-plus" ></i>
            <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "VploadImg",
        props:{
            limit:{
                type:Number,
                default:12,
            },
            action:{
                type:String,
                default:'http://localhost:9001/common/uploadFileUrl'
            },
            fileType:{
                type:Number,
                default:1
            },
            fileList:{
                type:Array,
                default: ()=>{
                    return []
                }
            }
        },
        data(){
            return{
                dialogImageUrl: '',
                dialogVisible: false,
                actionUrl: this.action+'?fileType='+this.fileType,
                hideUploadEdit:this.fileList.length>=this.limit,
                fileLists:this.fileList,
                editForm:{
                    url:'',
                    uid:null
                },
                editView:false,

            }
        },
        watch:{
            fileList(n,o){ //n为新值,o为旧值;
                this.fileLists = n;
                this.hideUploadEdit=this.fileList.length>=this.limit
            }
        },
        methods:{
            // 移除图片
            handleRemove(file) {
                for(let i in this.fileLists){
                    if(this.fileLists[i].uid == file.uid){
                        this.fileLists.splice(i,1)
                    }
                }
                this.hideUploadEdit = this.fileLists.length>=1;
                this.submitFile(file.url)
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            handleChange(file,fileList){
                this.hideUploadEdit = fileList.length>=1;
            },
            handleSuccess(response,file,fileList){
                let obj = {
                    name: file.name,
                    status: "success",
                    uid: file.uid,
                    url: response.data.filePath
                }
                this.fileLists.push(obj)
                this.submitFile(response.data.filePath)
            },
            // 将图片文件传回给父组件
            submitFile(filePath){
                this.$emit('submitImg',filePath)
            },
        }
    }
</script>

<style scoped>
    .el-icon-plus{
        font-size: 30px!important;
    }

    .el-icon-zoom-in{
        font-size: 18px !important;
    }
    .el-icon-delete{
        font-size: 18px !important;
        color:rgb(243, 143, 130);
    }
    .el-input>>> .el-textarea__inner{
        font-size:18px!important;
    }
    .hide  >>> .el-upload--picture-card{
        display: none;
    }
</style>
