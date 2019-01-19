<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="开单日期" prop="billTime">
                    <el-date-picker
                        v-model="searchForm.billTime"
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
                  <el-form-item label="发货单位" prop="consignorName">
                    <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                  </el-form-item>
                  <el-form-item label="承运方" prop="transferName">
                    <el-input v-model="searchForm.transferName" placeholder="承运方"></el-input>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('summary:read')" @click='handlesearch'>查询</el-button>
                  <el-button type="warning" v-if="checkHasPermission('summary:read')" @click="resetForm('searchForm')">重置</el-button>
                  <el-button type="primary" v-if="checkHasPermission('summary:read')" @click="exportFile()">导出</el-button>
                  </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column prop="waybillNo" label="运单号"  align='center'>
                 <template slot-scope="scope">
                  <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                  </template>
              </el-table-column>
              <el-table-column prop="status" label="运单状态" align='center'>
                <template slot-scope="scope">
                  <div v-html="statusBackground(waybillStatus(scope.row.status))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
               <el-table-column prop="consignorName" label="发货单位"  align='center'></el-table-column>
              <el-table-column prop="consignorLinkman" label="发货方"  align='center'></el-table-column>
              <el-table-column prop="transferName" label="承运方"  align='center'></el-table-column>
              <el-table-column label="应收"  align='center'  class-name="J-income" >
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    trigger="click">
                    <el-table :data="scope.row.ysList" border show-summary style="width:300px!important" >
                      <el-table-column prop="feeName" label="项" align='center' min-width="120px"></el-table-column>
                      <el-table-column prop="ysFee" label="金额" align='center' min-width="60px"></el-table-column>
                      <el-table-column prop="ysBalanceFee" label="已收" align='center' min-width="60px"></el-table-column>
                      <el-table-column prop="ysUnBalanceFee" label="未收" align='center' min-width="60px"></el-table-column>
                    </el-table>
                    <el-button slot="reference"  type="text" size="small"  class="J-width100">{{ scope.row.ysFee }}</el-button>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column label="应付"  align='center' >
                <template slot-scope="scope">
                  <el-popover
                    placement="right"
                    trigger="click">
                    <el-table :data="scope.row.yfList" show-summary style="width:300px!important" border>
                      <el-table-column prop="feeName" label="项" align='center' min-width="120px"></el-table-column>
                      <el-table-column prop="yfFee" label="金额" align='center' min-width="60px"></el-table-column>
                      <el-table-column prop="yfBalanceFee" label="已付" align='center' min-width="60px"></el-table-column>
                      <el-table-column prop="yfUnBalanceFee" label="未付" align='center' min-width="60px"></el-table-column>
                  </el-table>
                    <el-button slot="reference"  type="text" size="small" class="J-width100">{{ scope.row.yfFee }}</el-button>
                  </el-popover>
                  
                </template>
              </el-table-column>
              <el-table-column prop="goodsName" label="货物名称" align='center'></el-table-column>
              <el-table-column prop="pack" label="包装"  align='center'></el-table-column>
              <el-table-column prop="goodsNum" label="件数"  align='center'></el-table-column>
              <el-table-column prop="goodsWeight" label="重量"  align='center'></el-table-column>
              <el-table-column prop="goodsBulk" label="体积"  align='center'></el-table-column>              
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
          <waybillNo-component
        :showFlag.sync="openWaybill.visiable"
        :waybillNo="openWaybill.waybillNo"
        :statusText="openWaybill.statusText"
        :waybillId="openWaybill.waybillId"
        v-if="openWaybill.visiable"
      ></waybillNo-component>
        </div>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js';
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
  name:'f-s-table',
  mixins: [Base,List],
  components: { 
         "waybillNo-component": waybillNoComponent,
    },
  data() {
    return {
        searchForm: { //资金汇总-业务总表 查询  
          billTime:[], 
          waybillNo:'',
          consignorName:'',
          dispatchName:'',
          billTimeBegin:'',
          billTimeEnd:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [],//资金汇总-业务总表 表格
          //运单详情框
            openWaybill: {
            waybillNo: "",
            waybillId: "",
            statusText: "",
            visiable: false
      },
      };
    },
   watch:{
    "searchForm.billTime": function (val, oldval) {
      if (val !== null) {
        this.searchForm.billTimeBegin = val[0];
        this.searchForm.billTimeEnd = val[1];
      }else{
        this.searchForm.billTimeBegin = null;
        this.searchForm.billTimeEnd = null;
      }
    },
  },
    methods: {
       showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.id
            this.openWaybill.statusText = this.waybillStatusTxt(row.status);
            this.openWaybill.visiable = true;
    }, 
      status : function (row,column) {
        let param = this.base.statusTable.find((n) => (n.value == row.status));
        if (param === undefined) {
            return ""
        }
        return param;
      },
      //获取页面初始数据
      querySpecialList() {
        api.post('/finance/summary/business', this.searchForm).then(data=>{
          if(data.code==="200"){
            this.tableData = data.data.records;
            this.page.total = data.data.total;  
          }
        })
      },
      exportFile(){

       api.post('/finance/summary/export/business', this.searchForm).then(data=>{
        if (data.code == '200') {
          this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
    }
  };
</script>


<style>

</style>
