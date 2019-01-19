<template>
    <div>
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                     <el-form-item label="登记日期" prop="createTime">
                        <el-date-picker
                            v-model="searchForm.createTime"
                            type="datetimerange"
                            :picker-options="pickerOptions"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="申请人" prop="createEmployeeName">
                        <el-input v-model="searchForm.createEmployeeName" placeholder="申请人"></el-input>
                    </el-form-item>
                    <el-form-item label="审核状态" prop="auditStatus">
                        <el-select v-model="searchForm.auditStatus"  multiple collapse-tags clearable placeholder="审核状态">
                          <el-option
                            v-for="item in base.auditStatusBuizBatch"
                            :key="item.value"
                            :label="item.code"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item> 
                    <el-form-item label="开票状态" prop="kpStatus">
                        <el-select v-model="searchForm.kpStatus"  multiple collapse-tags clearable placeholder="开票状态">
                          <el-option
                            v-for="item in base.kpStatus"
                            :key="item.value"
                            :label="item.code"
                            :value="item.value">
                          </el-option>
                        </el-select>
                    </el-form-item>     
                    <el-form-item class="J-main-search-button">
                        <el-button type="primary" @click="handlesearch">查询</el-button>
                        <el-button type="warning" @click="resetForm('searchForm')">重置</el-button>
                    </el-form-item>
              </el-form>
            </div>
            
          </div>
          
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border  @selection-change="handleSelectionChange">
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
                          <el-menu-item index="1-1" v-if="scope.row.status!=2 && checkHasPermission('trick_open:update')" @click="showModifyInvoice(scope.row)">修改开票</el-menu-item> 
                          <el-menu-item index="1-2" v-if="scope.row.status!=2 && checkHasPermission('trick_open:delete')"  @click="deleteInvoice(scope.row)">删除开票</el-menu-item>
                          <el-menu-item index="1-3" v-if="scope.row.auditStatus==0" @click="showSubmitInvoiceAudit(scope.row)">提交审核</el-menu-item>
                          <el-menu-item index="1-4" v-if="scope.row.auditStatus==1 || scope.row.auditStatus==3" @click="showSubmitInvoiceAudit(scope.row)">重新提交审核</el-menu-item>
                          <el-menu-item index="1-5" v-if="scope.row.auditStatus==2 && scope.row.status==1 && checkHasPermission('trick_open:finish')" @click="kpFinishFun(scope.row)">完成开票</el-menu-item> 
                          <el-menu-item index="1-6" @click="detailClick(scope.row)">开票详情</el-menu-item> 
                           <el-menu-item index="1-7" @click="exportFile(scope.row)">导出</el-menu-item> 

                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="auditStatus" label="审核状态" width="130" align='center'>
                 <template slot-scope="scope">
                  <div v-html="statusBackground(auditStatus(scope.row.auditStatus))" class="J-statusBackground"></div>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="开票状态"  width="130"  align='center'>
                 <template slot-scope="scope">
                  <div v-html="statusBackground(kpStatusFormat(scope.row.status))" class="J-statusBackground"></div>
                </template>
              </el-table-column>
              <el-table-column prop="invoiceTitle"  label="发票抬头" width="180" align='center'></el-table-column>
              <el-table-column prop="fee" label="开票金额"  width="100" align='center'></el-table-column>
              <el-table-column prop="createEmployeeName" label="申请人" width="120" align='center'></el-table-column>
              <el-table-column prop="createTime" label="申请时间" width="180" align='center'></el-table-column>
              <el-table-column prop="memo" label="申请备注" show-overflow-tooltip min-width="200" align='center'></el-table-column>
              <el-table-column prop="finishEmployeeName" label="开票人" width="120" align='center'></el-table-column>
              <el-table-column prop="finishTime" label="开票时间" width="180" align='center'></el-table-column>
              <el-table-column prop="finishMemo" label="开票备注" show-overflow-tooltip min-width="200" align='center'></el-table-column>
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

        <el-dialog title="完成开票" :visible.sync="finishDialog.visible" width="585px" center class="Maglist-HairCar" v-if="finishDialog.visible">   
          <div class="J-detail  "> 
              <el-row>
                <el-form :model="finishForm"  label-width="110px" class="demo-ruleForm J-flexSbc" style=" width: 90%;margin:0 auto">
                  <el-form-item label="完成开票备注："   class="J-width100">
                    <el-input v-model="finishForm.memo"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" @click="saveKpFinish">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>

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
                <el-button type="primary" @click="submitInvoiceAudit" :loading="savingFlag">确 定</el-button>
            </span>
        </el-dialog>

        <createTicket @reloadList="reloadList" :pVisible.sync='modifyDialog.visible' pAuFlag='1' :pConsignorId.sync='modifyDialog.consignorId' :pInvoiceId.sync="modifyDialog.invoiceId" :pInvoiceTitle.sync='modifyDialog.invoiceTitle' v-if="modifyDialog.visible"></createTicket>
        <detailInvoice :pVisible.sync='detailDialog.visible' :pInvoiceId.sync="detailDialog.invoiceId" :pInvoiceTitle.sync='detailDialog.invoiceTitle' v-if="detailDialog.visible"></detailInvoice>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import auditorSelect from '@/widget/auditorSelect'
import createTicket from './createTicket.vue'
import detailInvoice from './detail.vue'
export default {
  mixins: [Base,List],
  components: {    
      'v-auditorSelect':auditorSelect,
      'createTicket':createTicket,
      'detailInvoice':detailInvoice
  },
  data() {
    return {   
        searchForm: { 
          createTime:[],
          startCreateTime:'',
          endCreateTime:'',
          createEmployeeName:'',
          kpStatus:'',
          auditStatus:'',
          pageSize: 10,
          pageNo: 1
        },
        //提交审核
        auditForm:{
          dataId:'',
          auditFlowEmployeeIds:[]
        },
        auditDialog:{
          visible:false,
          title:''
        },
        
        tableData: [], //整车对账 表格

        modifyDialog: {
          visible:false,
          consignorId:'',
          invoiceId:'',
          invoiceTitle:''
        },

        finishDialog:{
          visible:false,
        },
        finishForm:{
            id:'',
            memo:''
        },

        detailDialog:{
          visible:false,//明细弹框打开
          invoiceId:'',//明细id
          invoiceTitle:''
        },

        savingFlag:false 
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
        this.detailDialog.invoiceId=row.id
        this.detailDialog.invoiceTitle=row.invoiceTitle
      },
      querySpecialList() {//获取页面初始数据
        api.post('/kp/list', this.searchForm).then(data=>{
            if(data.code==="200"){
              this.tableData = data.data.records;
              this.page.total = data.data.total; 
            }
        })
      },
      showModifyInvoice(row){
        this.modifyDialog.invoiceId = row.id
        this.modifyDialog.consignorId = row.consignorId
        this.modifyDialog.invoiceTitle = row.invoiceTitle
        this.modifyDialog.visible = true
      },

      //显示审核框
      async showSubmitInvoiceAudit(row) {

        //加载原审核流程信息
        const { code, message, data } =await api.get('/kp/audit/oldflow?id='+row.id)
        if(code=='200'){
          this.auditForm.auditFlowEmployeeIds = JSON.parse(data)
        } else {
          this.auditForm.auditFlowEmployeeIds=[]
        }
        this.auditForm.dataId = row.id
        this.auditDialog.title = '审核人选择-' + row.invoiceTitle
        this.auditDialog.visible = true
      },
      submitInvoiceAudit() {

        if (this.savingFlag) {
          return;
        }

        this.savingFlag = true
        api.post('/kp/audit/submit', this.auditForm).then(data=>{
          if(data.code==="200"){
            this.$message({type: 'success',message: '提交开票审核成功!'});
            this.auditDialog.visible = false
            this.querySpecialList()
          }
        }).then(()=>{
          this.savingFlag = false;
        })
      },

      deleteInvoice(row){

        this.$confirm('确定要删除开票申请['+row.invoiceTitle+']吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
          const { code, message, data } =await api.get('/kp/delete?id='+row.id)
          if(code==200){
            this.$message({
              type: 'success',
              message: '开票申请删除成功!'
            });
            this.querySpecialList()
          }    
        }).catch(() => {});
      },  

      //完成开票 弹框出现
      kpFinishFun(row){
        this.finishDialog.visible = true
        this.finishForm.id=row.id  
      },

      async saveKpFinish(){ ////完成开票 保存
        this.savingFlag=true
        api.post('/kp/finish',this.finishForm).then(data=>{
          this.savingFlag=false
          if(data.code=="200"){
            this.$message({ type: 'success', message: '开单完成!'});
            this.finishDialog.visible = false
            this.querySpecialList()
          }
        })
      },
      exportFile(row){
       
        api.get('kp/export/detail?id='+row.id).then(data=>{
          if (data.code == '200') {
            this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
          }
        })
      },
    }
  };
</script>