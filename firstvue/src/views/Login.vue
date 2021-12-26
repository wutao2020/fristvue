<template>
    <div>
        <el-form
                :rules="rules"
                ref="loginForm"
                v-loading="loading"
                element-loading-text="正在登录..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :model="loginForm"
                class="loginContainer">
            <h3 class="loginTitle">系统登录</h3>
            <el-form-item prop="username">
                <el-input size="normal" type="text" v-model="loginForm.username" auto-complete="off"
                          placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item prop="password">
                <el-input size="normal" type="password" v-model="loginForm.password" auto-complete="off"
                          placeholder="请输入密码"></el-input>
            </el-form-item>
            <el-form-item prop="code">
                <el-input size="normal" type="text" v-model="loginForm.code" auto-complete="off"
                          placeholder="点击图片更换验证码" @keydown.enter.native="submitLogin" style="width: 250px;"></el-input>
                <el-image :src="vcUrl" @click="updateVerifyCode" style="padding-left: 5px"></el-image>
            </el-form-item>
            <el-button size="normal" type="primary" style="width: 100%;" @click="submitLogin('loginForm')">登录</el-button>
        </el-form>
    </div>
</template>
<script>
    import qs from 'qs'
    export default {
        name: "Login",
        data() {
            return {
                loading: false,
                vcUrl: '',
                loginForm: {
                    username: 'admin',
                    password: 'admin',
                    code:'',
                    randomCode:''
                },
                rules: {
                    username: [{required: true, message: '请输入用户名', trigger: 'blur'}],
                    password: [{required: true, message: '请输入密码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入验证码', trigger: 'blur'}]
                }
            }
        },
        created() {
            this.updateVerifyCode();
        },
        methods: {
            updateVerifyCode() {
                this.$axios.get('/admin/auth/captcha').then(res => {
                    this.loginForm.randomCode = res.data.randomCode
                    this.vcUrl = res.data.captchaImg
                })
            },
            submitLogin(formName) {
                this.$refs[formName].validate((valid) => {
                  console.log('1111',formName);
                    if (valid) {
                        this.$axios.post('/login?' + qs.stringify(this.loginForm)).then(res => {
                            console.log('qqq',res.data)
                            const jwt = res.data.jwt;
                          console.log('wt',jwt)
                            // 将jwt存储到应用store中
                            this.$store.commit("SET_TOKEN", jwt)
                            this.$router.push("/index")
                        }).catch(error => {
                            this.updateVerifyCode();
                            console.log('error submit!!');
                        })
                    } else {
                        this.updateVerifyCode();
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
        }
    }
</script>

<style>
    .loginContainer {
        border-radius: 15px;
        background-clip: padding-box;
        margin: 180px auto;
        width: 350px;
        padding: 15px 35px 15px 35px;
        background: #fff;
        border: 1px solid #eaeaea;
        box-shadow: 0 0 25px #cac6c6;
    }

    .loginTitle {
        margin: 15px auto 20px auto;
        text-align: center;
        color: #505458;
    }

    .loginRemember {
        text-align: left;
        margin: 0px 0px 15px 0px;
    }
    .el-form-item__content{
        display: flex;
        align-items: center;
    }
</style>
