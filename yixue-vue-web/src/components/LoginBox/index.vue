<template>
    <div>
        <div class="box loginBox" v-if="showLogin == true">
            <div class="title">
                <span class="t1">
                    登录
                </span>
                <div class="el-icon-close t2" @click="closeLogin"></div>
            </div>
            <div style="margin: 0 10px;">
                <!-- 分割线 -->
                <el-form
                        ref="loginForm"
                        :model="loginForm"
                        :rules="loginRules"
                        auto-complete="on"
                        label-position="top"
                >
                    <el-form-item prop="userName" label="用户名">
                        <el-input
                                ref="username"
                                v-model="loginForm.userName"
                                placeholder="请输入用户名或邮箱"
                                name="userName"
                                type="text"
                                tabindex="1"
                                auto-complete="on"
                        />
                    </el-form-item>
                    <el-form-item prop="password" label="密码">
                        <el-tooltip v-model="capsTooltip" content="大写锁定已开启" placement="right" manual>
                            <el-input
                                    ref="password"
                                    v-model="loginForm.password"
                                    type="password"
                                    placeholder="请输入密码"
                                    tabindex="2"
                                    autocomplete="on"
                                    show-password
                                    @keyup.native="checkCapslock"
                                    @blur="capsTooltip = false"
                                    @keyup.enter.native="startLogin"
                            />
                        </el-tooltip>

                    </el-form-item>
                    <el-row style="text-align: center; ">
                        <el-button class="btn" type="primary" @click="startLogin">登录
                        </el-button>
                        <el-button class="btn" type="info" @click="goRegister">注册
                        </el-button>
                    </el-row>
                </el-form>
            </div>
        </div>

        <div class="box registerBox" v-if="showLogin == false">
            <div class="title">
                <span class="t1">注册</span>
                <div class="el-icon-close t2" @click="closeLogin"></div>
            </div>
            <el-form style="margin: 0 10px;"
                     :rules="registerRules"
                     label-position="top"
                     :model="registerForm"
                     ref="registerForm">
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="registerForm.userName" placeholder="用户名长度在5~20之间"
                    ></el-input>
                </el-form-item>

                <el-form-item label="密码" prop="password">
                    <el-input type="password" v-model="registerForm.password" placeholder="密码长度在5~20之间"
                    ></el-input>
                </el-form-item>

                <el-form-item label="重复密码" prop="password2">
                    <el-input type="password" v-model="registerForm.password2" placeholder="请再次输入密码"
                    ></el-input>
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email" placeholder="请输入正确的邮箱进行注册认证"
                    ></el-input>
                </el-form-item>
                <el-form-item style="margin-bottom: 25px" label="验证码" prop="code">
                    <el-input style="width: 40%" v-model="registerForm.code" placeholder="邮箱验证码"
                    ></el-input>
                    <el-button style="margin-left: 15px"
                               type="primary" round
                               @click='getCode'
                               :disabled="btnStatus"
                               size="small">
                        {{ content }}
                    </el-button>
                </el-form-item>

                <el-row style="text-align: center;">
                    <el-button class="btn" type="primary" @click="startRegister">注册
                    </el-button>
                    <el-button class="btn" type="info" @click="showLogin = true;">返回登录
                    </el-button>
                </el-row>
            </el-form>
        </div>

        <div class="mask"></div>
    </div>
</template>

<script>
import {getEmailCode, localLogin, localRegister} from '@/api/user'

export default {
    data() {
        return {
            // 按钮里显示的内容
            content: '获取验证码',
            //记录具体倒计时时间
            totalTime: 60,
            //验证码的按钮状态(true:禁用)
            btnStatus: false,
            //提升是否是大小写
            capsTooltip: false,
            // 显示登录页面
            showLogin: true,
            loginForm: {
                userName: "",
                password: ""
            },
            registerForm: {
                userName: "",
                password: "",
                password2: "",
                email: "",
                code: ""
            },

            // 登录表单验证
            loginRules: {
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 5, message: "用户名长度大于等于 5 个字符", trigger: "blur"},
                    {max: 20, message: "用户名长度不能大于 20 个字符", trigger: "blur"}
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "blur"},
                    {min: 5, message: "密码长度需要大于等于 5 个字符", trigger: "blur"},
                    {max: 20, message: "密码长度不能大于 20 个字符", trigger: "blur"}
                ]
            },
            // 注册表单验证
            registerRules: {
                userName: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {min: 5, message: "用户名长度大于等于 5 个字符", trigger: "blur"},
                    {max: 20, message: "用户名长度不能大于 20 个字符", trigger: "blur"}
                ],
                password: [
                    {required: true, message: "请输入密码", trigger: "blur"},
                    {min: 5, message: "密码长度需要大于等于 5 个字符", trigger: "blur"},
                    {max: 20, message: "密码长度不能大于 20 个字符", trigger: "blur"}
                ],
                password2: [
                    {required: true, message: "请再次输入密码", trigger: "blur"},
                    {min: 5, message: "密码长度需要大于等于 5 个字符", trigger: "blur"},
                    {max: 20, message: "密码长度不能大于 20 个字符", trigger: "blur"}
                ],
                email: [
                    {required: true, message: "邮箱不能为空", trigger: "blur"},
                    {pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/, message: '请输入正确的邮箱'},
                ],
                code: [
                    {required: true, message: "验证码不能为空", trigger: "blur"},
                ]
            },
        }
    },
    methods: {
        // 提示是大写模式
        checkCapslock(e) {
            const {key} = e
            this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
        },
        //登录
        startLogin() {
            this.$refs.loginForm.validate((valid) => {
                if (!valid) {
                    return;
                } else {
                    const params = {};
                    params.userName = this.loginForm.userName;
                    params.passWord = this.loginForm.password;
                    params.isRememberMe = 1;
                    localLogin(params).then(response => {
                        if (response.code === 20000) {
                            // 跳转到首页
                            location.replace("http://localhost:8080/#/?token=" + response.data)
                            window.location.reload()
                        } else {
                            this.$message({
                                type: "error",
                                message: response.data
                            })
                        }
                    });
                }
            })
        },
        //转到注册界面
        goRegister() {
            this.registerForm.userName = "";
            this.registerForm.password = "";
            this.registerForm.password2 = "";
            this.registerForm.email = "";
            this.showLogin = false;
        },
        // 注册
        startRegister() {
            this.$refs.registerForm.validate((valid) => {
                if (!valid) {
                    //校验失败
                    return;
                } else {
                    let passWord = this.registerForm.password;
                    let passWord2 = this.registerForm.password2;
                    if (passWord != passWord2) {
                        this.$message({
                            type: "error",
                            message: "两次密码不一致"
                        })
                        return;
                    }
                    const params = {};
                    params.userName = this.registerForm.userName;
                    params.passWord = this.registerForm.password;
                    params.email = this.registerForm.email;
                    params.nickName = this.registerForm.userName
                    params.code = this.registerForm.code
                    localRegister(params).then(response => {
                        if (response.code == 20000) {
                            this.$message({
                                type: "success",
                                message: response.message
                            })
                            // 打开登录页面
                            this.showLogin = true;
                        } else {
                            this.$message({
                                type: "error",
                                message: response.message
                            })
                        }
                    });
                }
            })
        },
        // 关闭登录框
        closeLogin() {
            this.$emit("closeLoginBox", "");
        },
        //获取验证码
        getCode() {
            this.$refs['registerForm'].validateField('email', (valid) => {
                if (!valid) {
                    this.btnStatus = true
                    this.content = this.totalTime + 's后重新发送'
                    let clock = window.setInterval(() => {
                        this.totalTime--
                        this.content = this.totalTime + 's后重新发送'
                        if (this.totalTime < 0) {     //当倒计时小于0时清除定时器
                            window.clearInterval(clock)
                            this.content = '获取验证码'
                            this.btnStatus = false
                            this.totalTime = 60
                        }
                    }, 1000)
                    let email = this.registerForm.email
                    this.$message('正在发送邮件，请稍等');
                    getEmailCode(email).then(response => {
                        if (response.code == 20000) {
                            this.$message({
                                message: response.message,
                                type: 'success'
                            });
                        } else {
                            this.$message({
                                message: response.message,
                                type: 'error'
                            });
                        }
                    })
                } else {
                    //校验失败
                }
            })
        },
    }
}
</script>

<style scoped>

.box {
    border-radius: 15px;
    width: 400px;
    height: 320px;
    background: white;
    position: fixed;
    margin: auto;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 101; /* 要比遮罩层大 */
}

.box .title {
    height: 48px;
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    line-height: 48px;
}

.box .title .t2 {
    float: right;
    margin-right: 10px;
    margin-top: 10px;
    cursor: pointer;
}

/deep/ .el-form-item {
    margin-bottom: 18px;
}

/deep/ .el-form--label-top .el-form-item__label {
    padding: 0 0 0 0;
}

.box .btn {
    width: 40%;
}

.registerBox {
    height: 620px;
}

.mask {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 100;
}
</style>
