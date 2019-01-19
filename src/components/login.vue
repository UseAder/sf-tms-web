<!-- 登录 -->
<template>
    <div class="content-layout">
        <div class="login-box-warp">
           <div class="login-logo">
                <img src="../assets/logo_white.png" class="J-width100"/>   
            </div> 
            <div class="login-box">
                <div class="login-title" >货速运 - 物流管理系统</div>
                <div class="login-nav" >
                    <span></span>
                    因为更专业，所以更放心
                    <span></span>
                </div>
                <el-form ref="loginForm" label-width="2px" :model="loginForm" :rules="ruleLoginForm">
                    <el-form-item prop="ecode">
                        <el-input  placeholder="请输入 企业编号" v-model="loginForm.ecode" class="J-flex"></el-input>
                        <!-- <el-input >
                        <i class="el-icon-info"  slot="prepend"> 公司</i>
                        </el-input> -->
                    </el-form-item>
                    <el-form-item prop="username">
                        <el-input  placeholder="请输入 账号" v-model="loginForm.username" size='medium' class="J-flex">
                        <!-- <i class="el-icon-info"  slot="prepend"> 账号</i> -->
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input  placeholder="请输入 密码" type="password" v-model="loginForm.password" size='medium' class="J-flex"> 
                            <!-- <i class="el-icon-warning"  slot="prepend"> 密码</i> -->
                        </el-input>
                    <div class="forget-pwd" @click="changePassword.visible=true">忘记密码</div>
                    </el-form-item>
                    <el-form-item class="submit">
                        <el-button  class="J-login-botton" :loading="loginLoadingFlag"  @click="login()" @keyup.enter.native="login('loginData')">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>  
            <div class="login-footer">
                浙ICP备18008689号 © 2017-2019 杭州领华科技有限公司 版权所有 官网: 
                
                <a href="http://www.56linker.com"  target="_blank" >www.56linker.com</a>
                
            </div>            
        </div> 
        <el-dialog append-to-body title="找回密码" :visible.sync="changePassword.visible" @close="closeDialog('changePassword.form')" width="457px" center class="Maglist-HairCar ">
            <div class="J-detail J-changePassword-wrap">
                <el-row >
                    <el-form ref="changePassword.form"  :rules="changePasswordRules" :model="changePassword.form"  label-width="94px" class="demo-ruleForm J-flexSbc" style="    width: 91%; margin:0 auto">
                        <el-form-item label="手机号 :" prop="mobile" >
                            <el-input v-model="changePassword.form.mobile"></el-input>
                        </el-form-item>
                        <el-form-item label="验证码 :"  prop="mobileCode">
                            <div class="J-flex J-changePassword-wrap-mobileCode">
                                <el-input v-model="changePassword.form.mobileCode"></el-input>
                                <div class="J-changePassword-wrap-mobileCode-send">
                                    <el-button size="mini" :class="changePassword.disabled?'J-changePassword-disabled':''"  @click="obtainYzm('changePassword.form')">{{changePassword.mobileCodename}}</el-button>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="新密码 :" prop="password">
                            <el-input v-model="changePassword.form.password"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row> 
                <div class="J-dialog-vh-submission"  >
                    <span class="dialog-footer" style="display: block; text-align: center;">
                    <el-button type="primary" :loading="savingFlag"  @click="changePasswordPreservation('changePassword.form')">保 存</el-button>
                    </span> 
                </div>
            </div>
        </el-dialog>      
    </div>
</template>

<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import * as types from '@/vuex/types'
export default {
  mixins: [Base],
    data() {
        return {
            savingFlag:false,
            loginLoadingFlag:false,
            changePassword:{
                mobileCodename:'获取验证码',
                disabled:false,//验证码发送状态
                visible:false,
                form:{
                    mobile:'',
                    mobileCode:'',
                    password:''
                }
            },
            loginForm: {//登陆账号 密码 验证码
                username: '',
                password: '',
                ecode:''
            },
            ruleLoginForm:{//登陆验证
                ecode:[
                     { required: true, message: '请填写企业编号', trigger: 'blur' },
                    { required: true,min: 2, message: '用户名长度不能小于2位', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请填写用户名', trigger: 'blur' },
                    { required: true,min: 2, message: '用户名长度不能小于2位', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请填写密码', trigger: 'blur' },
                    { required: true,min: 3, message: '密码长度不能小于3位', trigger: 'blur' }
                ]
            },
            changePasswordRules:{//登陆验证
                mobile:[
                    { required: true, message: '请填写手机号', trigger:  ['blur', 'change']},
                    { validator: this.linkmanMobileRules, trigger: ['blur', 'change']}
                ],
                mobileCode: [
                    { required: true, message: '请填写验证码', trigger:  ['blur', 'change']},
                    { validator: this.numRules, trigger: ['blur', 'change']}

                ],
                password: [
                    { required: true, message: '请填写新密码', trigger:  ['blur', 'change']},
                    { validator: this.numRules, trigger: ['blur', 'change']},
                    { required: true,min: 3, message: '密码长度不能小于3位', trigger:  ['blur', 'change']}
                ]
            },
        }
    },
    created() {
        this.loginForm.ecode = localStorage.getItem('ecode')
        this.loginForm.username = localStorage.getItem('username')
        //登录回车事件 
        this.loginEntryEvent()
    },
    methods: {
        //弹框关闭时清空表单数据
        closeDialog(formName){    
            if(this.$refs[formName]){    
            this.$refs[formName].resetFields();
            }
            this.changePassword.mobileCodename='获取验证码'
            this.changePassword.disabled=false//验证码发送状态
        },

        loginEntryEvent(){
            var _self = this;
            document.onkeydown = function(e){
                if(window.event == undefined){
                    var key = e.keyCode;
                }else{
                    var key = window.event.keyCode;
                }
                if(key == 13){
                    _self.login('loginData');
                }
            }
        },
        login () {
            
            this.$refs.loginForm.validate( async (valid) => {
                if (valid) {
                    this.loginLoadingFlag = true;
                    const { code, data, message } = await api.post('/login', this.loginForm)
                    if (code === '200') {
                        this.$store.commit(types.COMMAND_LOGIN, data)
                        // 在请求成功后把document.onkeydown置为undefined
                        document.onkeydown = undefined;
                        //保存用户名和企业编号
                        localStorage.setItem('ecode', this.loginForm.ecode)
                        localStorage.setItem('username', this.loginForm.username)
                        localStorage.setItem('employeeId', data.user.employeeId)
                        this.$router.push('/Home') //登录成功进入首页
                    }

                    this.loginLoadingFlag = false;
                } 
            })
        } ,
         //获取验证码接口
            obtainYzm: function(formName) {
                this.$refs[formName].validateField('mobile')
                var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
                if(this.changePassword.form.mobile&&myreg.test(this.changePassword.form.mobile)&&!this.changePassword.disabled){
                    api.post('/find/password/send/sms ',this.changePassword.form.mobile).then(data=>{
                        if(data.code==200){
                            this.$message({
                                type: 'success',
                                message: '短信已发送!'
                            });
                            var num = 60;
                            var _this=this;
                            var timer = setInterval(function() {
                                num--;
                                if (num <= 0) {
                                    clearInterval(timer);
                                    _this.changePassword.mobileCodename='重新发送';
                                    _this.changePassword.disabled=false
                                } else {
                                    _this.changePassword.mobileCodename=num + "s"
                                    _this.changePassword.disabled=true                    
                                }
                            }, 1000)
                        }
                    })
                }
            },
        changePasswordPreservation(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.saveDataSubmit()
            } else {
                return false;
            }
            });
        },
        saveDataSubmit(){  //点击保存到-执行密码更改
            this.$confirm('确定要【保存】, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(() => {   
                    this.savingFlag=true
                    api.post('/find/password/update',this.changePassword.form).then(data=>{
                        if(data.code==200){
                            this.$message({
                                type: 'success',
                                message: '恭喜您，密码更改成功!'
                            });
                            this.changePassword.visible=false
                        }
                    }).then(() => {          // 点击确认
                    this.savingFlag=false
                }) 
            }).catch(() => {})
    
        },  
    }
}
</script>
<style>


</style>
