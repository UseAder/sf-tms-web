<template>
  <div class="MagList" >
    <div class="MagListTablist">
      <el-tabs v-model="financialCurrentView"   @tab-click="tabMagListClick" >
        <el-tab-pane  :name="item.name"  v-for="item in financialTabMagList" :key="item.index">
           <span slot="label" class="J-tab-badge"><el-badge :value="item.num" class="item">{{item.title}}</el-badge></span>
        </el-tab-pane>  
      </el-tabs>
    </div>

    <div :is="financialCurrentView" @reloadData="reloadData"></div>
  </div>
</template>

<script>
import csList from './financialComponent/csList'
import zxList from './financialComponent/zxList'
import cartList from './financialComponent/cartList'
import draList from './financialComponent/draList'
import hkList from './financialComponent/hkList'
import otherList from './financialComponent/otherList'
import api from '@/utils/api.js'
export default {
  name:'e-f-financial',
  data() {
    return {
      financialCurrentView: "csList", //Tabs 标签页 基础用法
      financialTabMagList: [
        { name: "csList", title: "客户运费结算审核", num:0},
        { name: "zxList", title: "专线运费结算审核", num:0},
        { name: "cartList", title: "整车运费结算审核" , num:0},
        { name: "draList", title: "短驳运费结算审核" , num:0},
        { name: "hkList", title: "业务回扣结算审核" , num:0},
        { name: "otherList", title: "其他异费付款审核" , num:0},
      ],
      auditDataTypeNumList:[]
    }
  },
  components: {    
      csList , 
      zxList ,
      cartList,
      draList,
      hkList,
      otherList
  },
  methods:{ 
      //重新加载 标记数据列表数据
      reloadData: function (flag) {     
          if (flag) { 
              this.financialTabMagList.forEach(finanObj=> {
                finanObj.num=0
              });
               this.getWaitAuditData()
          }
      },
      // 获取待审核的数据.
        getWaitAuditData(){
          api.get('finance/get/wait/data/tab').then(data=>{
            if(data.code==200){
            this.auditDataTypeNumList = data.data;
            this.auditDataTypeNumList.forEach(balanceType => {
              //说明: 1 客户运费结算审核 2 专线运费结算审核 3整车运费结算审核 4短驳运费结算审核 5业务回扣结算审核 100其他异费付款审核
            if(balanceType == 1){
                this.financialTabMagList[0].num = this.financialTabMagList[0].num +1;
            }else if(balanceType == 2){
                this.financialTabMagList[1].num = this.financialTabMagList[1].num +1;
            }else if(balanceType == 3){
                this.financialTabMagList[2].num = this.financialTabMagList[2].num +1;
            }else if(balanceType == 4){
                this.financialTabMagList[3].num = this.financialTabMagList[3].num +1;
            }else if(balanceType == 5){
                this.financialTabMagList[4].num = this.financialTabMagList[4].num +1;
            }else if(balanceType == 100){
                this.financialTabMagList[5].num = this.financialTabMagList[5].num +1;
            }
          });
          }   
          })
        },

      tabMagListClick(tab, event) {//tab切换
      //   // 更新数字角标
      //  this.financialTabMagList.forEach(finTab =>{
      //   finTab.num = 0;
      //  })
      // this.getWaitAuditData();
      },
  },
  created(){
     // 数字角标 
      this.getWaitAuditData();
  }
}
</script>
