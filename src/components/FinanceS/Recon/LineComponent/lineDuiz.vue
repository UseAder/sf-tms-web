<template>
    <div>
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                <el-form-item label="调度日期" prop="createTime">
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
                <el-form-item label="专线物流" prop="transferName">
                  <el-input v-model="searchForm.transferName" placeholder="专线物流"></el-input>
                </el-form-item>
                <el-form-item class="J-main-search-button">
                  <el-button type="primary"  v-if="checkHasPermission('zxyfjs:read')" @click='handlesearch'>查询</el-button>
                  <el-button type="warning"  v-if="checkHasPermission('zxyfjs:read')" @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border>
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
                          <el-menu-item index="1-2" v-if="checkHasPermission('zxyfjs:create')" @click="showCreateBalance(scope.row)">对账</el-menu-item>  
                          <el-menu-item index="1-6" v-if="checkHasPermission('zxyfjs:out')" @click="exportFile(scope.row)">导出</el-menu-item>  
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="transferName" label="承运方" min-width="110" align='center'></el-table-column>
              <el-table-column prop="waybillNum" label="运单数量"  min-width='110' align='center'></el-table-column>
              <el-table-column prop="sumUnBalanceFee" label="未结算合计" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumUnCheckBalanceFee" label="未对账合计" min-width="110" align='center'></el-table-column>
              <!-- <el-table-column prop="sumOutFee" label="应付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumBalanceOutFee" label="已付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumUnBalanceOutFee" label="未付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceOutFee" label="应付未对账" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumInFee" label="应收" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumBalanceInFee" label="已收" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnBalanceInFee" label="未收" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumUnCheckBalanceInFee" label="应收未对账" min-width="110" align='center' class-name="J-income"></el-table-column> -->
              <el-table-column prop="sumDdXfFee" label="现付" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdBalanceXfFee" label="已结现付" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdUnBalanceXfFee" label="未结现付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDdUnCheckBalanceXfFee" label="未对账现付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDdHfFee" label="回付" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdBalanceHfFee" label="已结回付" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdUnBalanceHfFee" label="未结回付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDdUnCheckBalanceHfFee" label="未对账回付" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDdYjFee" label="月结" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdBalanceYjFee" label="已结月结" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sumDdUnBalanceYjFee" label="未结月结" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDdUnCheckBalanceYjFee" label="未对账月结" min-width="110" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDdDfXxFee" label="信息费" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdBalanceDfXxFee" label="已结信息费" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdUnBalanceDfXxFee" label="未结信息费" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumDdUnCheckBalanceDfXxFee" label="未对账信息费" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumDdExceptionFee" label="异常费" min-width="110" align='center' >
                <template slot="header" slot-scope="scope">
                  <span>异常费</span>
                  <el-popover
                    placement="top"
                    title="异常费"
                    width="200"
                    trigger="hover"
                    content="正数表示收入，负数表示支出">
                    <i slot="reference" class="el-icon-question"></i>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column prop="sumDdBalanceExceptionFee" label="已结异常" min-width="110" align='center' ></el-table-column>
              <el-table-column prop="sumDdUnBalanceExceptionFee" label="未结异常" min-width="110" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="sumDdUnCheckBalanceExceptionFee" label="未对账异常" min-width="110" align='center' class-name="J-income"></el-table-column>
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
        <zxCreateBalance @reloadList="reloadList" :pVisible.sync='createDialog.visible' pAuFlag='0' :pTransferId.sync='createDialog.transferId' :pTransferName.sync='createDialog.transferName' v-if="createDialog.visible"></zxCreateBalance>
    </div>
</template>


<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import zxCreateBalance from './createBalance.vue'

export default {
  mixins: [Base,List],
  components: { 
    'zxCreateBalance':zxCreateBalance
  },
  data() {
    return {
      //获取页面中table距离浏览器的offsetTop值
      jElTableOffsetTop:'',
      searchForm: { //客户对账 查询   
        createTime:[],
        transferName:'',
        createTimeBegin:'',
        createTimeEnd:'',
        pageSize: 10,
        pageNo: 1
      },
      tableData: [], //专线对账 表格

      createDialog: {
         visible:false,
         transferId:'',
         transferName:''
      }
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
    querySpecialList() {//获取页面初始数据
      api.post('/finance/balance/zx/list', this.searchForm).then(data=>{
        if(data.code==="200"){
          this.tableData = data.data.records;
          this.page.total = data.data.total;  
        }
      })
    },
     /**
     * 显示对账界面
     */
    showCreateBalance(row) {
      this.createDialog.transferId = row.transferId
      this.createDialog.transferName = row.transferName
      this.createDialog.visible = true
    },
    exportFile(row){
      this.searchForm.transferId = row.transferId;
      api.post('/finance/balance/zx/export/list', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
  }
};
</script>