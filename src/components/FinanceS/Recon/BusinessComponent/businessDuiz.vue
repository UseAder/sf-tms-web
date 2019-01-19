<template>
    <div>
        <div class="J-main-body">
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
                  <el-form-item label="运单号" prop="waybillNo">
                    <el-input v-model="searchForm.waybillNo" placeholder="运单号"></el-input>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary"  v-if="checkHasPermission('hkyfjs:read')" @click='handlesearch'>查询</el-button>
                    <el-button type="warning"  v-if="checkHasPermission('hkyfjs:read')" @click="resetForm('searchForm')">重置</el-button>
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
                          <el-menu-item index="1-2" v-if="checkHasPermission('hkyfjs:create')" @click="showCreateBalance(scope.row)">对账</el-menu-item>  
                          <el-menu-item index="1-3" @click="exportFile(scope.row)">导出</el-menu-item>  
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="consignorName" label="发货单位" min-width="120" align='center'></el-table-column>
              <el-table-column prop="consignorLinkman" label="发货人" min-width="120" align='center'></el-table-column>
              <el-table-column prop="waybillNum" label="运单数量" width="100"  align='center'></el-table-column>
              <el-table-column prop="hkFee" label="回扣" width="120" align='center'></el-table-column>
              <el-table-column prop="balanceHkFee" label="已结回扣" width="120" align='center'></el-table-column>
              <el-table-column prop="unBalanceHkFee" label="未结回扣" width="120" align='center' class-name="J-expenditure"></el-table-column>
              <el-table-column prop="unCheckBalanceHkFee" label="未对账回扣" width="120" align='center' class-name="J-expenditure"></el-table-column>
              
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
        <hkCreateBalance @reloadList="reloadList" :pVisible.sync='createDialog.visible' pAuFlag='0' :pConsignorId.sync='createDialog.consignorId' :pConsignorName.sync='createDialog.consignorName' v-if="createDialog.visible"></hkCreateBalance>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import hkCreateBalance from './createBalance.vue'
export default {
  mixins: [Base,List],
  components: { 
    'hkCreateBalance':hkCreateBalance
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
      tableData: [],//整车对账 表格
      createDialog: {
         visible:false,
         consignorId:'',
         consignorName:''
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
     * 显示对账界面
     */
    showCreateBalance(row) {
      this.createDialog.consignorId = row.consignorId
      this.createDialog.consignorName = row.consignorName
      this.createDialog.visible = true
    },
    exportFile(row){
      this.searchForm.consignorId = row.consignorId
      api.post('/finance/balance/hk/export/list', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
    querySpecialList() {
      api.post('/finance/balance/hk/list', this.searchForm).then(data=>{
        if(data.code==="200"){
          this.tableData = data.data.records;
          this.page.total = data.data.total;  
        }
      })
    }
  }
}
</script>
<style>
</style>





