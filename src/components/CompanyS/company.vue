
<template>
  <div class="MagList" style="margin-top: 7px;">
    <div class="J-main-body">
      <div class="J-detail"> 
        <el-row>
            <el-col :span="6">
                <div class="labal">企业名称</div>
                <div class="input J-borderBot">{{ompanyList.name?ompanyList.name:''}}</div>
            </el-col>
            <el-col :span="6">
                <div class="labal">企业编码</div>
                <div class="input J-borderBot">{{ompanyList.code?ompanyList.code:''}}</div>
            </el-col>
            <el-col :span="6">
                <div class="labal">联系人</div>
                <div class="input J-borderBot">{{ompanyList.linkman?ompanyList.linkman:''}}</div>
            </el-col>
            <el-col :span="6" >
                <div class="labal">联系人手机</div>
                <div class="input J-borderBot">{{ompanyList.linkmanMobile?ompanyList.linkmanMobile:''}}</div>
            </el-col>
            
            <el-col :span="6">
                <div class="labal">注册日期</div>
                <div class="input J-borderBot">{{ompanyList.registerTime?ompanyList.registerTime:''}}</div>
            </el-col>
            <el-col :span="6">
                <div class="labal">开通日期</div>
                <div class="input J-borderBot">{{ompanyList.openTime?ompanyList.openTime:''}}</div>
            </el-col>
            <el-col :span="6">
                <div class="labal">开通状态</div>
                <div class="input J-borderBot">{{ompanyList.status ==0?'未开通':'已开通'}}</div>
            </el-col>
            <el-col :span="6" >
                <div class="labal">短信数量</div>
                <div class="input J-borderBot">{{ompanyList.smsNum}}</div>
            </el-col>
             <el-col :span="6" >
                <div class="labal">软件有效期</div>
                <div class="input ">{{ompanyList.expireBeginTime}} 至 {{ompanyList.expireEndTime}}</div>
            </el-col>
            
            <el-col :span="18">
               <div class="labal">企业地址</div>
                <div class="input">{{ompanyList.provinceName}}/{{ompanyList.cityName}}/{{ompanyList.countyName}}/{{ompanyList.address}}</div>
            </el-col>
        </el-row>
      </div>
    </div> 
  </div>
</template>
 <style>

     /* border-radius: 2px; */
 </style>
 
<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    name:'c-company',
    mixins: [Base],
    data() {
      return {
          ompanyList:{
            name:'',
            code:'',
            linkman:'',
            linkmanMobile:'',
            address:'',
            registerTime:'',
            openTime:'',
          }
        }
    },
    methods: {
      async querySpecialList() {//获取页面初始数据
        const { code, message,data } =await api.get('ent/info')
        this.ompanyList = data;
      }
    }
  }  

</script>