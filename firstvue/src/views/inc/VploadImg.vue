<template>
    <div>
        <el-upload
                list-type="picture-card"
                :action="action"
                :auto-upload="true"
                :data="uploadData"
                name="file"
                :show-file-list="true"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
                :before-upload="beforeUpload"
                :on-exceed="handleExceed"
                accept="image/png, image/jpeg, image/gif, image/jpg"
                :limit="1"
        >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
                <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
                <span class="el-upload-list__item-actions">
                    <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                        <i class="el-icon-zoom-in"></i>
                    </span>
                    <span v-if="!disabled" class="el-upload-list__item-delete">
                        <i class="el-icon-delete"></i>
                    </span>
                </span>
            </div>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt />
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "VploadImg",
        data() {
            return {
                action: "http://localhost:9001/common/uploadFileUrl?fileType=1",
                disabled: false,
                uploadData: {
                    file: "",
                    project: ""
                },
                imageUrl: "",
                dialogImageUrl: "",
                dialogVisible: false,
                disabled: false
            };
        },
        props: {
            profileUrl: {
                type: String,
                default: ""
            }
        },
        created() {
            console.log("开始",this.profileUrl)
            this.imageUrl = this.coverUrl;
        },
        methods: {
            handleRemove(file) {
                console.log(11111)

            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
            beforeUpload(file) {
                this.uploadData.file = file;
                const isLt2M = file.size / 1024 / 1024 < 2;
                if (!isLt2M) {
                    this.$message.error("上传头像图片大小不能超过 2MB!");
                    return isLt2M;
                }
            },
            // 上传成功后，但存在不保存情况
            handleSuccess(res, file) {
                // this.imageUrl = URL.createObjectURL(file.raw);
                // 获取后端对上传图片存储位置的路径，
                if (res.code === 200) {
                    this.imageUrl = res.data.filePath;
                    this.$emit("getShopProfileFn", this.imageUrl);
                } else {
                    this.$message.error("图片上传失败");
                }
            },
            handleExceed(files, fileList) {
                this.$message.error("只能上传一张图片");
            }
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