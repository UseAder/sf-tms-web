<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="核销日期" prop="createTime">
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
                  <el-form-item label="结算方名称" prop="incomeName">
                    <el-input v-model="searchForm.incomeName" placeholder="结算方名称"></el-input>
                  </el-form-item>
                  <el-form-item label="结算方类别" prop="incomeType">
                    <el-select v-model="searchForm.incomeType"  multiple collapse-tags clearable placeholder="请选择" class="J-width100">
                      <el-option
                        v-for="item in incomeTypeOption"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item> 
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('flow:read')" @click='handlesearch'>查询</el-button>
                    <el-button type="warning" v-if="checkHasPermission('flow:read')" @click="resetForm('searchForm')">重置</el-button>
                    <el-button type="primary" v-if="checkHasPermission('flow:read')" @click="exportFile('searchForm')">导出</el-button>
                  </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column prop="flowNo" label="资金流水号"  align='center'></el-table-column>
              <el-table-column prop="incomeName" label="结算方名称"  align='center'></el-table-column>
              <el-table-column prop="feeName" label="费用名称"  align='center'></el-table-column>
              <el-table-column prop="incomeType" :formatter="incomeType" label="结算方类别"  align='center'></el-table-column>
              <el-table-column prop="feeType" label="费用类型"  align='center'>
                <template slot-scope="scope">
                  {{feeTypeFlow(scope.row.feeType)}} 
                </template>
              </el-table-column>
              <el-table-column prop="incomeDataNo" label="结算单号"  align='center'>
                 <template slot-scope="scope">
                   <el-button @click="detailClick(scope.row)" type="text" size="small">{{ scope.row.incomeDataNo }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="fee" label="费用" width="110" align='center'></el-table-column>
              <el-table-column prop="createEmployeeName" label="核销人"  align='center'></el-table-column>
              <el-table-column prop="createTime" label="核销时间" width="170" align='center'></el-table-column>       
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
        <!-- ↓↓↓↓↓↓↓↓↓↓↓↓ 根据不同的费用类型跳转到不同的详情页面 ↓↓↓↓↓↓↓↓↓↓↓↓ -->
          <template v-if="detailFlag == 1">
          <detailConsignorBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailConsignorBalance>
          </template>
            <template v-if="detailFlag == 2">
            <detailZxBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailZxBalance>
            </template>
          <template v-if="detailFlag == 3">
          <detailCartBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailCartBalance>
          </template>
            <template v-if="detailFlag == 4">
            <detailDbBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailDbBalance>
            </template>
          <template v-if="detailFlag == 5">
          <detailHkBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailHkBalance>
          </template>
            <template v-if="detailFlag == 6">
            <detailOtherBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailOtherBalance>
            </template>
       
        </div>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js';
import detailConsignorBalance from '@/components/FinanceS/Recon/CustomerComponent/detail.vue';
import detailHkBalance from '@/components/FinanceS/Recon/BusinessComponent/detail.vue';
import detailZxBalance from '@/components/FinanceS/Recon/LineComponent/detail.vue';
import detailCartBalance from '@/components/FinanceS/Recon/VehicleComponent/detail.vue';
import detailDbBalance from '@/components/FinanceS/Recon/ShortComponent/detail.vue';
import detailOtherBalance from '@/components/FinanceS/Recon/Other/detail.vue';
export default {
  name:'f-s-flow',
  mixins: [Base,List],
  components: {  
    'detailConsignorBalance':detailConsignorBalance,
    'detailHkBalance':detailHkBalance,
    'detailZxBalance':detailZxBalance,
    'detailCartBalance':detailCartBalance,
    'detailDbBalance':detailDbBalance,
    'detailOtherBalance':detailOtherBalance
  },
  data() {
    return {    
      searchForm: { //资金汇总-资金流水 查询   
        createTime:[],
        incomeType:'',
        incomeName:'',
        createTimeBegin:'',
        createTimeEnd:'',
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],//资金汇总-资金流水 表格
      incomeTypeOption:[{//结算类型的接口
        value: '1',
        label: '客户'
      }, {
        value: '2',
        label: '专线'
      }, {
        value: '3',
        label: '整车'
      }, {
        value: '4',
        label: '短驳'
      }, {
        value: '5',
        label: '回扣'
      }, {
        value: '100',
        label: '其他'
      }],

        detailDialog:{
        visible:false,//明细弹框打开
        balanceId:'',//明细id
        balanceNo:''
      },
      // 跳转标识
      detailFlag:'',
      
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
    },
  },
  methods: {
    
    detailClick(row){
      this.detailFlag = row.feeType;
      this.detailDialog.visible = true;
      this.detailDialog.balanceId=row.balanceId;
      this.detailDialog.balanceNo=row.balanceNo;
    },

    incomeType : function (row,column) {
        let param = this.base.incomeTypeFlow.find((n) => (n.value == row.incomeType));
        if (param === undefined) {
            return ""
        }
        return param.code;
    },
    
    async querySpecialList() {//获取页面初始数据
      const { code, message,data} =await api.post('/finance/summary/flow/list', this.searchForm)
      if(code==="200"){
        this.tableData = data.records;
        this.page.total = data.total;  
      }
    },
     async exportFile(row) {   
          const { code, message,data} =await api.post('/finance/summary/flow/export/list', this.searchForm)
          if(code==="200"){
            this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
          }
        },
  }
};
</script>


<style>

</style>
