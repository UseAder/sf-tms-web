<template>
    <div>
        <div class="J-main-body">
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
                <el-form-item label="车牌号" prop="transferName">
                    <el-input v-model="searchForm.transferName" placeholder="车牌号"></el-input>
                </el-form-item>
                 <el-form-item label="结算人" prop="realBalanceName">
                    <el-input v-model="searchForm.realBalanceName" placeholder="结算人"></el-input>
                </el-form-item>
                <el-form-item label="审核状态" prop="auditStatus">
                    <el-select v-model="searchForm.auditStatus"  multiple collapse-tags clearable placeholder="请选择">
                      <el-option
                        v-for="item in this.base.auditStatusBuizBatch"
                        :key="item.value"
                        :label="item.code"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>   
                <el-form-item label="结算状态" prop="balanceStatus">
                    <el-select v-model="searchForm.balanceStatus"  multiple collapse-tags clearable placeholder="请选择">
                      <el-option
                        v-for="item in this.base.balanceStatusBuizBatch"
                        :key="item.value"
                        :label="item.code"
                        :value="item.value">
                      </el-option>
                    </el-select>
                </el-form-item>   
                <el-form-item class="J-main-search-button">
                    <el-button type="primary"  v-if="checkHasPermission('zcyfjs:read')" @click='handlesearch'>查询</el-button>
                    <el-button type="warning" v-if="checkHasPermission('zcyfjs:read')" @click="resetForm('searchForm')">重置</el-button>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border @selection-change="handleSelectionChange" >
              <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true"  >
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group>  
                         <el-menu-item index="1-1" v-if="scope.row.balanceStatus==1 && checkHasPermission('zcyfjs:update')" @click="showModifyBalance(scope.row)">修改对账单</el-menu-item>  
                          <el-menu-item index="1-2" v-if="scope.row.balanceStatus==1 && checkHasPermission('zcyfjs:delete')" @click="deleteBalance(scope.row)">删除对账单</el-menu-item> 
                          <el-menu-item index="1-3" v-if="scope.row.auditStatus==0" @click="showSubmitBalanceAudit(scope.row)">提交审核</el-menu-item>
                          <el-menu-item index="1-4" v-if="scope.row.auditStatus==1 || scope.row.auditStatus==3" @click="showSubmitBalanceAudit(scope.row)">重新提交审核</el-menu-item>
                          <el-menu-item index="1-6" @click="exportFile(scope.row)" >导出</el-menu-item> 
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
              <el-table-column prop="auditStatus" label="审核状态" width="110" align='center'>
                <template slot-scope="scope">
                  <div v-html="statusBackground(auditStatus(scope.row.auditStatus))" class="J-statusBackground"></div>
                </template>
              </el-table-column>
              <el-table-column  prop="balanceStatus" label="结算状态" width="110" align='center'>
                <template slot-scope="scope">
                  <div v-html="statusBackground(balanceStatus(scope.row.balanceStatus))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column prop="realBalanceName" label="结算人" width="120" align='center'></el-table-column>
              <el-table-column prop="transferName" label="承运方" width="120" align='center'></el-table-column>
              <el-table-column prop="waybillNum" label="运单数量" width="100" align='center'></el-table-column>
              <el-table-column prop="sumBalanceFee" label="对账合计" width="100" align='center'></el-table-column>
              <!-- <el-table-column prop="sumInFee" label="应收金额" width="100" align='center' class-name="J-income"></el-table-column> -->
              <!-- <el-table-column prop="sumOutFee" label="应付金额" width="100" align='center' class-name="J-expenditure"></el-table-column> -->
              <el-table-column prop="sumXfFee" label="现付" width="80" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumDfFee" label="到付" width="80" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumHfFee" label="回付" width="80" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumYajFee" label="押金" width="80" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="sumExceptionFee" label="异常费" width="80" align='center' class-name="J-income"></el-table-column>
              <el-table-column prop="memo" label="对账备注" min-width="200" align='center'></el-table-column>
              <el-table-column prop="createTime" label="对账时间" width="180" align='center'></el-table-column>
              <el-table-column prop="createEmployeeName" label="收款人" width="120" align='center'></el-table-column>

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

        <!-- 提交审核提示框 -->
        <el-dialog :title="auditDialog.title"
            :visible.sync="auditDialog.visible"
            width="40%"
            center
            :modal=false
            :close-on-click-modal=false
            @close="auditDialog.visible = false" v-if="auditDialog.visible">
            <el-form label-width="90px">
                <el-form-item label="审核人：">
                    <v-auditorSelect @auditorSelect='selectAuditEmployee' :auditorList='auditForm.auditFlowEmployeeIds'></v-auditorSelect> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="auditDialog.visible = false">取 消</el-button>
                <el-button type="primary" @click="submitBalanceAudit" :loading="savingFlag">确 定</el-button>
            </span>
        </el-dialog>

        <cartCreateBalance @reloadList="reloadList" :pVisible.sync='modifyDialog.visible' pAuFlag='1' 
          :pBalanceId.sync='modifyDialog.balanceId'  :pBalanceNo.sync='modifyDialog.balanceNo'
          :pTransferId.sync='modifyDialog.transferId' :pTransferName.sync='modifyDialog.transferName' v-if="modifyDialog.visible"></cartCreateBalance>
        <detailCartBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailCartBalance>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import cartCreateBalance from './createBalance.vue'
import detailCartBalance from './detail.vue'
import auditorSelect from '@/widget/auditorSelect'
export default {
  mixins: [Base,List],
  components: { 
    'v-auditorSelect':auditorSelect,
    'cartCreateBalance':cartCreateBalance,
    'detailCartBalance':detailCartBalance
  },
  data() {
    return {
      searchForm: { //客户对账 查询   
        createTime:[],
        createTimeBegin:"",
        createTimeEnd:"",
        balanceStatus:"",
        auditStatus:"",
        transferName:"",
        realBalanceName:'',
        pageSize: 10,
        pageNo: 1
      },
      //提交审核
      auditForm:{
        dataId:'',
        auditFlowEmployeeIds:[]
      },
      tableData: [], //整车对账 表格
     
      modifyDialog: {
         visible:false,
         transferId:'',
         balanceId:'',
         balanceNo:'',
         transferName:''
      },
      detailDialog:{
        visible:false,//明细弹框打开
        balanceId:'',//明细id
        balanceNo:''
      },
      auditDialog:{
        visible:false,
        title:''
      },
      savingFlag:false
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
    //确认刷新
    reloadList: function (flag) {        
      if (flag) {
          this.querySpecialList()
      }
    },
    /**
     * 审核人员选择回调事件
     */
    selectAuditEmployee(employeeList) {
        var eIds = employeeList.map( (v,i) => v.id)
        this.auditForm.auditFlowEmployeeIds = eIds
    },

    detailClick(row){
      this.detailDialog.visible = true;
      this.detailDialog.balanceId=row.id
      this.detailDialog.balanceNo=row.balanceNo
    },
    querySpecialList() {
      api.post('/finance/balance/cart/list/pc', this.searchForm).then(data=>{
        if(data.code==="200"){
          this.tableData = data.data.records;
          this.page.total = data.data.total;  
        }
      })
    },
    showModifyBalance(row){
      this.modifyDialog.balanceId = row.id
      this.modifyDialog.balanceNo = row.balanceNo
      this.modifyDialog.transferId = row.transferId
      this.modifyDialog.transferName = row.transferName
      this.modifyDialog.visible = true
    },

    //显示审核框
    async showSubmitBalanceAudit(row) {

      //加载原审核流程信息
      const { code, message, data } =await api.get('/finance/balance/cart/balance/audit/oldflow?id='+row.id)
      if(code=='200'){
        this.auditForm.auditFlowEmployeeIds = JSON.parse(data)
      } else {
        this.auditForm.auditFlowEmployeeIds=[]
      }
      this.auditForm.balanceId = row.balanceId
      this.auditForm.dataId = row.id
      this.auditDialog.title = '审核人选择-' + row.balanceNo
      this.auditDialog.visible = true
    },

    submitBalanceAudit() {

      if (this.savingFlag) {
        return;
      }

      this.savingFlag = true
      api.post('/finance/balance/cart/balance/audit/submit', this.auditForm).then(data=>{
        if(data.code==="200"){
          this.$message({type: 'success',message: '提交对账单审核成功!'});
          this.auditDialog.visible = false
          this.querySpecialList()
        }
      }).then(()=>{
        this.savingFlag = false;
      })
    },
    deleteBalance(row){
      this.$confirm('确定要删除对账单['+row.balanceNo+']吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center:true,
        type: 'warning'
      }).then(async () => {
        const { code, message, data } = await api.get('/finance/balance/cart/balance/delete?id='+row.id)
        if(code==200){
          this.$message({
            type: 'success',
            message: '对账单删除成功!'
          });
          this.querySpecialList()
        }    
      }).catch(() => {});
    }, 
      exportFile(row){
      
      api.get('/finance/balance/cart/export/pc/list?id='+row.id).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    }
  }
};
</script>