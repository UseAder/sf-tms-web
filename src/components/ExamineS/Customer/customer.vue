<template>
  <div class="MagList">
    <div class="MagListTablist">
        <el-tabs v-model="activeName"  @tab-click="tabMagListClick" >
          <el-tab-pane :label="item.name" :name="item.status"  v-for="item in tabMagList" :key="item.status"></el-tab-pane>  
        </el-tabs>
    </div>
    <div class="J-main-body">
      <div class="homeMain-header"> 
        <div class="J-main-search " >
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
              <el-form-item label="申请时间" prop="createTime">
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
              <el-form-item label="开票抬头" prop="invoiceTitle">
                <el-input v-model="searchForm.invoiceTitle" placeholder="开票抬头"></el-input>
              </el-form-item>
              <el-form-item class="J-main-search-button">
                <el-button type="primary" v-if="checkHasPermission('customer_audit:read')" @click='handlesearch'>查询</el-button>
                <el-button type="warning" v-if="checkHasPermission('customer_audit:read')" @click="resetForm('searchForm')">重置</el-button>
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
                      <el-menu-item index="1-3" @click="newFun(scope.row)">审核</el-menu-item>
                    </el-menu-item-group> 
                  </el-submenu> 
                </el-menu>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="开票抬头" min-width="110" align='center'>
            <template slot-scope="scope">
              <el-button @click="modifyFun(scope.row)" type="text" size="small">
                {{ scope.row.invoiceTitle }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="fee" label="开票金额" min-width="110" align='center'></el-table-column>
          <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>
          <el-table-column prop="createEmployeeName" label="申请人" min-width="110"  align='center'></el-table-column>
          <el-table-column prop="createTime" label="申请时间" min-width="180" align='center'></el-table-column>
          <el-table-column prop="beforeAuditMemo" label="上次审核意见" min-width="200" align='center'></el-table-column>
          <el-table-column prop="beforeAuditEmployeeName" label="上次审核人" min-width="110" align='center'></el-table-column>
          <el-table-column prop="beforeAuditTime" label="上次审核时间" min-width="130" align='center'></el-table-column>
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
    <components @ischild="ischild" :dialog.sync='isUpdate.isDialog' :isContent.sync='isUpdate.isContent' :updateRow.sync='isUpdate.updateRow' v-if='isUpdate.isDialog'></components>
  </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import isDialog from './isDialog.vue'
export default {
  name:'e-c-customer',
  mixins: [Base,List],
  components: { 
    'components':isDialog,
  },
  data() {
    return {
      activeName: "1", //Tabs 标签页 基础用法
      tabMagList: [
        { status: "1", name: "待我审核的" },
        { status: "2", name: "我已审核的" },
      ],
      searchForm: {
        createTime:[],
        startCreateTime: "", //开单日期
        endCreateTime: "",
        invoiceTitle:"",
        status: 1, //运单状态
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],//客户开票审核 表格      
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
    //审核确认
    ischild: function (childValue) {        
      if (childValue) {
          this.querySpecialList()
      }
    },
    //tab切换
    tabMagListClick(tab, event) {
      this.searchForm.status = tab.$vnode.data.key;
      this.querySpecialList();
    },
    //获取页面初始数据
    async querySpecialList() {
      const { code, message,data } =await api.post('/cus/list', this.searchForm)
      if(code==="200"){
        this.tableData = data.records;
        this.page.total = data.total;  
      }
    },
  }
};
</script>

