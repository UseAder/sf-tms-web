<template>
  <div >
    <div class="J-main-body ">
      <div class="homeMain-header"> 
        <div class="J-main-search" >
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
              <el-form-item label="对账日期" prop="createTime">
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
                <el-button type="primary" v-if="checkHasPermission('finance_audit:read')" @click='handlesearch'>查询</el-button>
                <el-button type="warning" v-if="checkHasPermission('finance_audit:read')" @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="J-elTable" id="J-elTable" >        
        <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
          <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
          <el-table-column label="操作"  width="50" align='center' header-align="center" fixed >
            <template slot-scope="scope">
              <div class="table-menu">
                <el-menu  :collapse="true" v-if="scope.row.status==1" >
                  <el-submenu index="1" >
                    <template slot="title" >
                      <i class="el-icon-edit-outline"></i>
                    </template>
                    <el-menu-item-group> 
                      <el-menu-item index="1-3"  v-if="checkHasPermission('finance_audit:audit')" @click="showAuditDialog(scope.row)">审核</el-menu-item>
                    </el-menu-item-group> 
                  </el-submenu> 
                </el-menu>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="balanceNo" label="对账结算批次" width="120" align='center'>
            <template slot-scope="scope">
                  <el-button @click="detailClick(scope.row)" type="text" size="small">{{ scope.row.balanceNo }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核状态"  min-width="110" align='center'>
            <template slot-scope="scope">
              <div v-html="statusBackground(auditStatus(scope.row.status))" class="J-statusBackground"></div>     
            </template>
          </el-table-column>
          <el-table-column prop="beforeAuditEmployeeName" label="上次审核人" width="180" align='center'></el-table-column>
          <el-table-column prop="beforeAuditTime" label="上次审核时间" width="180" align='center'></el-table-column>
          <el-table-column prop="sumBalanceFee" label="应付金额" width="120" align='center'></el-table-column>
          <el-table-column prop="realBalanceName" label="结算人" min-width="110" align='center'></el-table-column>
          <el-table-column prop="createEmployeeName" label="对账人" min-width="110" align='center'></el-table-column>
          <el-table-column prop="consignorName" label="发货单位" width="120" align='center'></el-table-column>
          <!-- <el-table-column prop="consignorLinkman" label="发货人" width="120" align='center'></el-table-column> -->
          <el-table-column prop="waybillNum" label="运单数量" width="100" align='center'></el-table-column>
          <el-table-column prop="createTime" label="对账时间" min-width="180" align='center'></el-table-column>
          <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>
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
    <detailHkBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailHkBalance>
    <auditDialog @reloadList="reloadList" :pVisible.sync='auditDialog.visible' :pAuditId.sync='auditDialog.auditId' :pBalanceNo.sync='auditDialog.balanceNo' v-if="auditDialog.visible"></auditDialog>
  </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import auditDialog from '../audit.vue'
import detailHkBalance from '@/components/FinanceS/Recon/BusinessComponent/detail.vue'

export default {
  mixins: [Base,List],
  components: { 
    'auditDialog':auditDialog,
    'detailHkBalance':detailHkBalance
  },
  data() {
    return {      
      searchForm: {
        createTime:[],
        startCreateTime: "", //开单日期
        endCreateTime: "",
        consignorName:"",
        status: "", //运单状态
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],//整车对账 表格     
      auditDialog: {
         visible:false,
         balanceId:'',
         balanceNo:''
      },
      detailDialog:{
        visible:false,//明细弹框打开
        balanceId:'',//明细id
        balanceNo:''
      },
    };
  },
  watch:{
    "searchForm.createTime": function (val, oldval) {
      if (val !== null) {
        this.searchForm.startCreateTime = val[0];
        this.searchForm.endCreateTime = val[1];
      }else{
        this.searchForm.startCreateTime = null;
        this.searchForm.endCreateTime = null;
      }
    },
  },
  methods: {
    //确认刷新
    reloadList: function (flag) {        
      if (flag) {
          this.querySpecialList()
          this.$emit('reloadData',true)//刷新getWaitAuditData 数据
      }
    },
    detailClick(row){
      this.detailDialog.visible = true;
      this.detailDialog.balanceId=row.balanceId
      this.detailDialog.balanceNo=row.balanceNo
    },
    /**
     * 显示对账界面
     */
    showAuditDialog(row) {
      this.auditDialog.auditId = row.id
      this.auditDialog.balanceNo = row.balanceNo
      this.auditDialog.visible = true
    },
    //tab切换
    //获取页面初始数据
    querySpecialList() {
      api.post('/finance/hk/list', this.searchForm).then(data=>{
        if(data.code==="200"){
          this.tableData = data.data.records;
          this.page.total = data.data.total;  
        }
      })
    },
  }
};
</script>



