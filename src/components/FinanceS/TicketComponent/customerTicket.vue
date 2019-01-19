<template>
    <div>
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                    <el-form-item label="发货单位" prop="consignorName">
                        <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                    </el-form-item>
                    <el-form-item class="J-main-search-button">
                        <el-button type="primary" v-if="checkHasPermission('trick_open:read')" @click="handlesearch">查询</el-button>
                        <el-button type="warning" v-if="checkHasPermission('trick_open:read')" @click="resetForm('searchForm')">重置</el-button>
                    </el-form-item>
              </el-form> 
            </div>
          </div>
    
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true">
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-2" v-if="checkHasPermission('trick_open:create')" @click="showCreateKp(scope.row)">新增开票</el-menu-item>
                          <el-menu-item index="1-3" v-if="checkHasPermission('trick_open:create')" @click="exportFile(scope.row)">导出</el-menu-item>  
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
             <el-table-column prop="consignorName" label="发货单位" min-width="180" align='center'></el-table-column>
              <el-table-column prop="consignorLinkman" label="发货人" min-width="180" align='center'></el-table-column>
              <el-table-column prop="waybillNum" label="待开票运单数量" min-width="180" align='center'></el-table-column>
              <el-table-column prop="kpFee" label="待开票金额" min-width="180" align='center'></el-table-column>
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
        <createTicket @reloadList="reloadList" :pVisible.sync='createDialog.visible' pAuFlag='0' :pConsignorId.sync='createDialog.consignorId' :pInvoiceTitle.sync='createDialog.invoiceTitle' v-if="createDialog.visible"></createTicket>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import createTicket from './createTicket.vue'
export default {
  mixins: [Base,List],
  components: {    
        'createTicket':createTicket
  },
  data() {
    return {      
        searchForm: {  
          consignorName:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [],
        createDialog: {
          visible:false,
          consignorId:'',
          invoiceTitle:''
        }
      };
    },
    methods: {
      //确认刷新
      reloadList: function (flag) {        
        if (flag) {
            this.querySpecialList()
        }
      },

      /**
       * 显示界面
       */
      showCreateKp(row) {
        this.createDialog.consignorId = row.consignorId
        this.createDialog.invoiceTitle = row.consignorName
        this.createDialog.visible = true
      },
      exportFile(row){
        this.searchForm.consignorId =  row.consignorId
        api.post('kp/wait/waybill/export/list', this.searchForm).then(data=>{
          if (data.code == '200') {
            this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
          }
        })
      },
      querySpecialList() {//获取页面初始数据    
        api.post('/kp/cus', this.searchForm).then(data=>{
          if(data.code==="200"){
            this.tableData = data.data.records;
            this.page.total = data.data.total;  
          }
        })
      },
    }
  };
</script>
<style>

</style>
