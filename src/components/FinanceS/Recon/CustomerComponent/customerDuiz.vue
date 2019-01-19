<template>
    <div>
        <div class="J-main-body ">
          <div class="homeMain-header"> 
            <div class="J-main-search" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                <el-form-item label="开单日期" prop="createTime">
                  <el-date-picker
                      v-model="searchForm.createTime"
                      type="daterange"
                      :picker-options="pickerOptions"
                      range-separator="至"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      align="right">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="发货单位" prop="consignorName">
                  <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                </el-form-item>
                <el-form-item class="J-main-search-button">
                  <el-button type="primary" v-if="checkHasPermission('khyfjs:read')" @click='handlesearch'>查询</el-button>
                <el-button type="warning" v-if="checkHasPermission('khyfjs:read')" @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border header-row-class-name='J-table-thead'>
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true" >
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-2" v-if="checkHasPermission('khyfjs:create')" @click="showCreateBalance(scope.row)">对账</el-menu-item>  
                          <el-menu-item index="1-3" v-if="checkHasPermission('khyfjs:out')" @click="exportFile(scope.row)">导出</el-menu-item>  
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="consignorName" label="发货单位" width="180" align='center' fixed></el-table-column>
              <el-table-column prop="consignorLinkman" label="发货人" width="180" align='center'></el-table-column>
              <el-table-column prop="linkmanMobile" label="发货人手机" width="120" align='center'></el-table-column>
              <el-table-column prop="waybillNum" label="运单数量"  min-width='110' align='center'></el-table-column>
              <el-table-column prop="sumUnBalanceFee" label="未结算合计" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumUnCheckBalanceFee" label="未对账合计" min-width="110" align='center'></el-table-column>
              <!-- <el-table-column prop="sumInFee" label="应收" min-width="110" align='center' class-name="J-income" ></el-table-column>
              <el-table-column prop="sumBalanceInFee" label="已收" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnBalanceInFee" label="未收" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceInFee" label="应收未对账" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumOutFee" label="应付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumBalanceOutFee" label="已付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumUnBalanceOutFee" label="未付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceOutFee" label="应付未对账" min-width="110" align='center'></el-table-column> -->
              <el-table-column prop="sumXfFee" label="现付" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumBalanceXfFee" label="已结现付" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumUnBalanceXfFee" label="未结现付" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceXfFee" label="未对账现付" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumHfFee" label="回付" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumBalanceHfFee" label="已结回付" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumUnBalanceHfFee" label="未结回付" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceHfFee" label="未对账回付" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumYjFee" label="月结" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumBalanceYjFee" label="已结月结" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumUnBalanceYjFee" label="未结月结" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceYjFee" label="未对账月结" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumExceptionFee" label="异常费" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumBalanceExceptionFee" label="已结异常" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumUnBalanceExceptionFee" label="未结异常" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceExceptionFee" label="未对账异常" min-width="110" align='center' class-name="J-income"></el-table-column>
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
               
              </div>
              <el-pagination background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="page.pageSizes"
                :page-size="page.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :current-page="searchForm.pageNo"
                :total="page.total">
              </el-pagination>
            </div>
          </div>
        </div>
        <consignorCreateBalance @reloadList="reloadList" :pVisible.sync='createDialog.visible' pAuFlag='0' :pConsignorId.sync='createDialog.consignorId' :pConsignorName.sync='createDialog.consignorName' v-if="createDialog.visible"></consignorCreateBalance>
    </div>
</template>


<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import consignorCreateBalance from './createBalance.vue'
export default {
  mixins: [Base,List],
  components: { 
    'consignorCreateBalance':consignorCreateBalance
  },
  data() {
    return {
      searchForm: { //客户对账 查询 
        createTime:[],  
        consignorName:'',
        createTimeBegin:'',
        createTimeEnd:'',
        pageSize: 10,
        pageNo: 1
      },
      
      tableData: [], //专线对账 表格
      createDialog: {
         visible:false,
         consignorId:'',
         consignorName:''
      },
      exportForm: { //客户对账 查询 
        consignorId: '',
      },
    };
  },
  watch:{
    "searchForm.createTime": function (val, oldval) {
        if (val !== null) {
            this.searchForm.createTimeBegin = val[0];
            this.searchForm.createTimeEnd = val[1];
        }else{
            this.searchForm.createTimeBegin = null;
            this.searchForm.createTimeEnd = null;
        }
    }
  },
  
  methods: {
    //确认刷新
    reloadList: function (flag) {        
      if (flag) {
          this.querySpecialList()
      }
    },

    /**
     * 显示对账界面
     */
    showCreateBalance(row) {
      this.createDialog.consignorId = row.consignorId
      this.createDialog.consignorName = row.consignorName
      this.createDialog.visible = true
    },
    exportFile(row){
      this.searchForm.consignorId = row.consignorId
      api.post('/finance/balance/consignor/export/list', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }else{
          this.$message({type: 'error',message: '查询出数据为空.不能导出文件！'});
        }
      })
    },
    querySpecialList() {//获取页面初始数据    
      api.post('/finance/balance/consignor/list', this.searchForm).then(data=>{
        if(data.code==="200"){
          this.tableData = data.data.records;
          this.page.total = data.data.total;  
        }
      })
    }
  }
};
</script>












