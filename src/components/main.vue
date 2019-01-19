<template> 
  <div> 
    <el-container>
      <el-header style="height:50px"> 
        <div  class="header-left">
          <div class="header-logo"> {{this.$store.getters.shortEnterpriseName}}</div> 
        </div>
        <div  class="header-right">
          <div class="J-header-menu">
            <el-menu background-color= '#4e97d9' class="el-menu-demo" mode="horizontal">
              <el-submenu index="1" class="J-header-b J-header-grcz" popper-class='J-header-grxx' >
                <template slot="title">
                  <div class="J-fff J-flexSbc J-height100">
                    <img src="../assets/grcz.png" class="J-width100"/>
                  </div>
                </template>
                <el-menu-item index="2-1">
                  <img src="../assets/xiugaimima.png" style="width:13px;margin-right:10px">
                  <span @click="modifyPassword.visible=true">修改密码</span> 
                </el-menu-item>
                <!-- <el-submenu index="2-4" >
                  <template slot="title">{{this.$store.getters.userName}}测试</template>
                  <el-menu-item index="2-4-1">测试</el-menu-item>
                  <el-menu-item index="2-4-2">测试</el-menu-item>
                  <el-menu-item index="2-4-3">测试</el-menu-item>
                </el-submenu> -->
                <el-menu-item index="2-2"  @click="quit"> 
                  <img src="../assets/tuichu.png" style="width:16px;margin-right:10px">
                  <span >退出</span> 
                </el-menu-item>
              </el-submenu>
              <el-submenu index="2" class="J-header-b " popper-class='J-header-grxx'>
                <template slot="title">
                  <div class="J-fff J-grxx J-flexSbc J-height100">
                   <img src="../assets/grxx.png" />
                  </div>
                </template>
                <el-menu-item index="2-1">暂无</el-menu-item>
              </el-submenu>
            </el-menu>  
          </div>
          <div class=" J-flexSbc J-cursor" style="padding-left:7px" >
          <el-popover
                  placement="bottom"
                  title="最新消息"
                  width="200"
                  trigger="click"
                  color="909399"
                  popper-class='J-header-news'
                  >
                  <div class="J-header-news-body">
                    
                    <div v-if="messageList.length == 0" class="J-header-news-content">
                      没有新消息
                    </div>
                    <div  v-for="ms in messageList" :key="ms.content">
                        {{ ms.content }}
                    </div>

                    <div class="J-header-news-footer">
                      <div class="menu-icon"></div>
                      <span>所有消息</span>
                    </div>
                  </div>
                  
                  <div slot="reference" class="news J-flexSbc J-height100"> 
                      <img src="../assets/news.png" /> 
                      <div class="news-num">
                        <div class="news-num-padding">
                           {{messageList.length}}
                        </div>
                      </div> 
                    </div>
                </el-popover>
          </div> 
          <div class="btn-fullscreen J-flexSbc" @click="handleFullScreen" >
            <el-tooltip effect="dark" :content="fullscreen ? `取消全屏`:`全屏`" placement="bottom">
                <svg data-v-31cdf04b="" t="1508738709248" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2069" xmlns:xlink="http://www.w3.org/1999/xlink" width="32" height="32" class="screenfull-svg"><path data-v-31cdf04b="" d="M333.493443 428.647617 428.322206 333.832158 262.572184 168.045297 366.707916 64.444754 64.09683 64.444754 63.853283 366.570793 167.283957 262.460644Z" p-id="2070"></path> <path data-v-31cdf04b="" d="M854.845439 760.133334 688.61037 593.95864 593.805144 688.764889 759.554142 854.56096 655.44604 958.161503 958.055079 958.161503 958.274066 656.035464Z" p-id="2071"></path> <path data-v-31cdf04b="" d="M688.535669 428.550403 854.31025 262.801405 957.935352 366.921787 957.935352 64.34754 655.809313 64.081481 759.919463 167.535691 593.70793 333.731874Z" p-id="2072"></path> <path data-v-31cdf04b="" d="M333.590658 594.033341 167.8171 759.804852 64.218604 655.67219 64.218604 958.270996 366.342596 958.502263 262.234493 855.071589 428.421466 688.86108Z" p-id="2073"></path></svg>
            </el-tooltip> 
          </div>     
        </div>
      </el-header> 
     
      <el-container :class="isCollapse?'hideSidebar':'showSidebar'"> 
        <div class="J-sidebar-container el-scrollbar">
          <el-aside  >
            <el-menu  collapse-transition :collapse="isCollapse" :default-active="activeIndex" class="el-menu-vertical-demo site-menu J-el-menu-vertical "    background-color="#304156" text-color="rgb(191, 203, 217)" active-text-color="#ffd04b" unique-opened>
              <div class="el-submenu"> 
                <div class="el-submenu__title J-flexCc J-submenuTitle " style=" background-color: rgb(48, 65, 86);cursor: auto;">
                  <div :class="collapseClassObject"  @click="isCollapseFun"></div>
                </div>
              </div>
              <el-submenu index="0"  style="display:none">
                <el-menu-item index="0" disabled  style="display:none">
                </el-menu-item> 
              </el-submenu >
              <el-submenu  v-for="item in elAsideList" :index="item.id.toString()"  :key='item.id.toString()' class="submenu-te">
                <template slot="title">
                  <img :src="require('../assets/'+item.imgUrl+'.png')"> 
                  <span style="padding-left:5px">{{item.name}}</span>
                </template>
                <template v-for="itemChild in item.subList">                   
                  <el-menu-item  :key="itemChild.id.toString()" v-if="!itemChild.subList" :index="itemChild.id.toString()" :label="itemChild.name" :name="itemChild.name"  @click="addTab(itemChild.accessUrl)">{{itemChild.name}}
                  </el-menu-item>
                  <el-submenu :key="itemChild.id.toString()" v-else :index="itemChild.id.toString()" :label="itemChild.name" :name="itemChild.name" class="asideBackground">
                    <template slot="title">{{itemChild.name}}</template>
                    <el-menu-item v-for="itemSecondChild in itemChild.subList" :key="itemSecondChild.id.toString()" :index="itemSecondChild.id.toString()" :label="itemSecondChild.name" :name="itemSecondChild.name"  @click="addTab(itemSecondChild.accessUrl)">{{itemSecondChild.name}}
                    </el-menu-item>
                  </el-submenu>
                </template>
              </el-submenu> 
            </el-menu> 
          </el-aside>
          <!-- <div class="el-scrollbar__bar is-vertical"><div class="el-scrollbar__thumb" style="height: 47.6068%; transform: translateY(0%);"></div></div> -->
        </div>
         
        <el-container class="J-relative J-subject-body" style="display: block;">
          <div class="J-subject-bodyTab">
            <!-- 响应事件 --> 
            <el-dropdown @command="removeTabAll"  class="J-app-dropdown" >
              <span class="el-dropdown-link triangle-down" >
              </span>
              <el-dropdown-menu slot="dropdown" class="J-app-dropdown-ul">
                <el-dropdown-item command="刷新当前"> <img src="../assets/RefreshPng.png" /> 刷新当前</el-dropdown-item>
                <el-dropdown-item command="关闭其他"><img src="../assets/ClosePng.png" />关闭其他</el-dropdown-item>
                <el-dropdown-item command="关闭所有"><img src="../assets/SwitchPng.png" />关闭所有</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-tabs v-model="editableTabsValue" type="border-card" closable @tab-remove="removeTab" @tab-click="activeTabClick" class="duli">
              <el-tab-pane v-for="item in editableTabs" :key="item.id" :label="item.name" :name="item.name" class="J-relative"></el-tab-pane>    
            </el-tabs>
          </div>
          <div >
            <div class="template-wrap" > 
              <div class="template-wrap-scoll" :style="'max-height:'+(getScreenHeight-90)+'px'">
                <keep-alive :include="gaicounter">
                  <router-view></router-view>
                </keep-alive>
              </div>
            </div>
              <!-- style="'min-height:'+screenHeight+'px'" -->
              
          </div>
          
        </el-container>
      </el-container> 
    </el-container>

    <el-dialog :close-on-click-modal="false"  title="修改登录密码" :visible.sync="modifyPassword.visible" @close="closeDialog('modifyPassword.form')" width="450px" center class="Maglist-HairCar J-dialog-vh ">
      <div class="J-detail J-dialog-vh-body J-changePassword-wrap">
       <el-row >
          <el-form ref="modifyPassword.form" @submit.native.prevent :rules="modifyPasswordRules" :model="modifyPassword.form"  label-width="94px" class="demo-ruleForm J-flexSbc" style="    width: 91%; margin:0 auto">
            
              <el-form-item label="新密码 :" prop="password">
                  <el-input type="password" v-model="modifyPassword.form.password"></el-input>
              </el-form-item>
              <el-form-item label="确认密码 :" prop="checkPassword">
                <el-input type="password" v-model="modifyPassword.form.checkPassword"></el-input>
              </el-form-item>
          </el-form>
        </el-row> 
        <div class="J-dialog-vh-submission"  >
          <span class="dialog-footer">
            <el-button type="primary" :loading="savingFlag" @click="modifyPasswordPreservation('modifyPassword.form')">保 存</el-button>
          </span> 
        </div>
      </div>
    </el-dialog>      
  </div> 
</template> 
  
<script>
import '../../static/css/iconfont.css'
import '../../static/css/total.css'
import {mapGetters} from 'vuex'
import api from "@/utils/api.js";
import Base from "@/utils/base.js";
import Tab from "@/utils/tab.js";
import * as types from "@/vuex/types";
import Stomp from "@/utils/stomp.js";
// import SockJS from  'sockjs-client';
// import Stomp from "stompjs"
export default {
  mixins: [Tab,Stomp,Base],
  computed:{
    //获取stroe 中 state的方法 相当于this.$store.getters.xx
    ...mapGetters([
        'gaicounter',
        'getScreenHeight'
    ])
  },
  data() {
    var validateCheckPass = (rule, value, callback) => {
       if (value !== this.modifyPassword.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
    return {
      modifyPassword:{
        visible:false,
        form:{
          id:'',
          password:'',
          checkPassword:'',
        }
      },
      name: "",
      isCollapse: false, //侧栏收缩
      collapseClassObject:{
        'menu-icon':true,
        'is-active':false
      },
      fullscreen: false, //显示全屏
      elAsideList: [],
      modifyPasswordRules:{//登陆验证
        password: [
            { required: true, message: '请填写新密码', trigger:  ['blur', 'change']},
            { validator: this.numRules, trigger: ['blur', 'change']},
            { required: true,min: 3, message: '密码长度不能小于3位', trigger:  ['blur', 'change']}
        ],
        checkPassword: [
          { required: true,validator: validateCheckPass,trigger: ['blur', 'change'] }     
        ],
      },

      //消息
      messageList:[]
    };
  },
  //页面高度自适应
  mounted() {
    var tabs= sessionStorage.setItem("editableTabs", JSON.stringify( this.editableTabs))
    if(tabs!=''){
      this.editableTabs=tabs
    }
    const that = this;
     //监听页面高度改变 传store仓库
    this.$store.commit('changeScreenHeight',window.innerHeight )
     //监听页面宽度度改变 传store仓库
    this.$store.commit('changeScreenWidth',window.innerWidth)
      // console.log(window.innerHeight);
      
    window.onresize = () => {
      return (() => {
        this.$store.commit('changeScreenHeight',window.innerHeight )
        this.$store.commit('changeScreenWidth',window.innerWidth)
        // that.screenWidthMonitor = window.innerWidth
      })();
    };
  },
  watch: {
    $route(to, from) {
      this.urlRouter(to.path);
    }
  },
  //加载菜单数据 加载权限数据
  async created() {
    await this.loadMenuData();
    await this.loadPermissionData();
   
    this.closeOtherUrl();
    // //url变化
    this.urlRouter(this.$route.path);

    //加载过期时间和短信可用条数预警
    this.loadMessage();
  },

  methods: {
    //menu缩进和展开
    isCollapseFun() {
      this.isCollapse = !this.isCollapse;
      this.asideWidth = "50";
      this.collapseClassObject['is-active']=this.isCollapse
    },
    /**
     * 全屏事件
     */
    handleFullScreen() {
      let element = document.documentElement;
      if (this.fullscreen) {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          document.msExitFullscreen();
        }
      } else {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
          // IE11
          element.msRequestFullscreen();
        }        
      }
      this.fullscreen = !this.fullscreen;
    },
    
    /**
     * 关闭其他url
     */
    closeOtherUrl() {
      if (sessionStorage.getItem("editableTabs")) {
        this.editableTabs = JSON.parse(
          sessionStorage.getItem("editableTabs")
        );
        let tabs = this.editableTabs;
        this.editableTabs = tabs.filter(
          tab => tab.name === "首页" || tab.accessUrl === this.$route.path
        );
        var arr = JSON.stringify(this.editableTabs);
        sessionStorage.setItem("editableTabs", arr);
      }
    },
    /**
     * 加载菜单数据
     */
    async loadMenuData() {
      const { code, data, message } = await api.get("/emp/menu");
      if (code === "200") {
        this.elAsideList = data;
        //对先菜单数据进行遍历
        this.storageElAsideListFun(this.elAsideList)
      }
    },
    /**
     * 加载权限数据, 保存到session存储中
     */
    loadPermissionData() {
      api.get("/emp/permission/has").then(data => {
        sessionStorage.setItem("permissionData", JSON.stringify(data.data))
        // base.permissionDataList = data.data;
      });
    },

    loadMessage(){
        api.get("/emp/message").then(data => {
          this.messageList = data.data;
        });
    },

    quit() {
      this.$confirm('你确认要退出系统吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(() => {
          this.$store.commit(types.COMMAND_LOGOUT);
          this.$router.push("/login");
        }).catch(() => {});
    },
    
    /**
     * 移除所有Tab页
     */
    removeTabAll(command) {
      if (command == "刷新当前") {
        //TODO::是否又更好的方式处理
        window.location.reload();
      } else if (command == "关闭其他") {
        this.closeOtherUrl();
      } else {
        let tabs = this.editableTabs;
        let tabName = "首页";
        this.editableTabs = tabs.filter(tab => tab.name === tabName);
        var arr = JSON.stringify(this.editableTabs);
        sessionStorage.setItem("editableTabs", arr);
        this.activeIndex = '0';
        this.switchTab(tabName);        
      }
    },
    /**
     * 顶部导航切换
     */
    selectNav(title) {
      switch (title) {
        case "应用中心":
          this.$router.push("/app");
          break;
        case "数据看板":
          this.$router.push("/tms");
          break;
      }
    },
    modifyPasswordPreservation(formName){
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
              this.modifyPassword.form.id= localStorage.getItem('employeeId')
              api.post('/emp/update/pwd',this.modifyPassword.form).then(data=>{
                  if(data.code==200){
                      this.$message({
                          type: 'success',
                          message: '恭喜您，密码已更改!'
                      });
                      this.$router.push("/login");
                      this.modifyPassword.visible=false
                  }
              }).then(() => {          // 点击确认
              this.savingFlag=false
          }) 
      }).catch(() => {})
    },  
  },
};
</script>
