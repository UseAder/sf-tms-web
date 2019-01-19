<template>
  <div class="MagList">
    <div class="J-main-body ">
      <div class="homeMain-header"> 
        <div class="J-main-search J-flexSbc" >
          <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
              <el-form-item label="短驳时间" prop="createTime">
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
              <el-form-item label="车牌号" prop="plateNumber">
                <el-input v-model="searchForm.plateNumber" placeholder="车牌号"></el-input>
              </el-form-item>
              <el-form-item label="司机" prop="driverName">
                <el-input v-model="searchForm.driverName" placeholder="司机"></el-input>
              </el-form-item>
              <el-form-item class="J-main-search-button">
                <el-button type="primary" v-if="checkHasPermission('drayage:read')" @click='handlesearch'>查询</el-button>
                <el-button type="warning" v-if="checkHasPermission('drayage:read')" @click="resetForm('searchForm')">重置</el-button>
              </el-form-item>
          </el-form>
          <el-button class="J-search-right" type="primary" v-if="checkHasPermission('drayage:create')" @click="newFun()">提货短驳</el-button>
        </div>
      </div>

      <div class="J-elTable" id="J-elTable" >
        <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
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
                      <el-menu-item index="1-2" v-if="checkHasPermission('drayage:read')" @click="modifyFun(scope.row)">修改短驳</el-menu-item>
                      <el-menu-item index="1-3" v-if="checkHasPermission('drayage:delete')" @click="batchDeletion(scope.row)">删除短驳</el-menu-item>
                    </el-menu-item-group> 
                  </el-submenu> 
                </el-menu>
              </div>
            </template>
          </el-table-column>
          <el-table-column  label="短驳批次号" min-width="110" align='center'>
            <template slot-scope="scope">
              <el-button @click="detailsClick(scope.row)" type="text" size="small">{{ scope.row.drayageNo }}</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="drayageTime" label="短驳时间" min-width="120" align='center'></el-table-column>
          <el-table-column prop="plateNumber" label="车牌号" min-width="110" align='center'></el-table-column>
          <el-table-column prop="driverName" label="司机姓名" min-width="110" align='center'></el-table-column>
          <el-table-column prop="driverMobile" label="司机手机" min-width="120" align='center'></el-table-column>
          <el-table-column prop="fee" label="短驳费" min-width="80" align='center'></el-table-column>
          <el-table-column prop="balanceFee" label="已结短驳费" min-width="80" align='center'></el-table-column>
          <el-table-column prop="unBalanceFee" label="未结短驳费" min-width="80" align='center'></el-table-column>
          <el-table-column prop="memo" label="备注"  align='center' min-width="200"></el-table-column>
          <el-table-column prop="createTime" label="创建时间" min-width="120" align='center'></el-table-column>
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
    <v-detailsTable :isdetailsOpinion.sync='isdetailsOpinion' :detailsId='detailsId' :detailsTitle='detailsTitle'></v-detailsTable>
    <components @ischild="ischild" :dialog.sync='isUpdate.isDialog' :isContent.sync='isUpdate.isContent' :updateRow.sync='isUpdate.updateRow' v-if="isUpdate.isDialog"></components>
  </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import isDialog from './shortComponent/isDialog.vue'
import detailsTable from './ShortComponent/detailsTable.vue'
export default {
  name:'d-short',
  mixins: [Base,List],
  components: { 
    'components':isDialog,
    'v-detailsTable':detailsTable
  },
  data() {
    return {
      searchForm: {
        createTime:[],
        startTruckBillTime: "", //开单日期
        endTruckBillTime: "",
        plateNumber:"",
        driverName: "",
        status: "", //运单状态
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],//整车对账 表格      
      isdetailsOpinion:false,//明细弹框打开
      detailsTitle:'',//明细title
      detailsId:'',//明细id
    };
  },
  watch:{
    "searchForm.createTime": function (val, oldval) {
      if (val !== null) {
        this.searchForm.startTruckBillTime = val[0];
        this.searchForm.endTruckBillTime = val[1];
      }else{
        this.searchForm.startTruckBillTime = null;
        this.searchForm.endTruckBillTime = null;
      }
    },
  },
  methods: {
    //提货确认
    ischild: function (childValue) {        
      if (childValue) {
          this.querySpecialList()
      }
    },
    //短驳详情
    detailsClick(row){
      this.isdetailsOpinion=true;
      this.detailsTitle=row.drayageNo+'' 
      this.detailsId=row.id
    },
    //获取页面初始数据
    async querySpecialList() {
      const { code, message,data } =await api.post('/dra/list', this.searchForm)
      if(code==="200"){
        this.tableData = data.records;
        this.page.total = data.total;  
      }
    },
    //取消当前短驳
    batchDeletion(row){  
      this.batchDeletionTitle='此操作将取消当前短驳, 是否继续?'
      this.$confirm(this.batchDeletionTitle, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center:true,
        type: 'warning'
      }).then(async () => {
        const { code, message,data } =await api.get('dra/cancel?id='+row.id)
        if(code==200){
          this.$message({
            type: 'success',
            message: '恭喜您，已取消当前短驳!'
          });
          this.querySpecialList()
        }          
      })
    },  
  }
};
</script>