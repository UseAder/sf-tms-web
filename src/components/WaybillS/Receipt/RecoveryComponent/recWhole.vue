<template>
    <div>
        <div class="J-main-body">
            <div class="homeMain-header"> 
                <div class="J-main-search" >
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                        <el-form-item label="开单日期" prop="createTime">
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
                        <el-form-item label="回单状态" prop="receiptRetrieveStatus">
                        <el-select v-model="searchForm.receiptRetrieveStatus"  multiple collapse-tags clearable placeholder="请选择">
                            <el-option
                            v-for="item in base.receiptRetrieveStatus"
                            :key="item.value"
                            :label="item.code"
                            :value="item.value">
                            </el-option>
                        </el-select>
                        </el-form-item>
                        <el-form-item label="承运商" prop="transferName">
                        <el-input v-model="searchForm.transferName" placeholder="承运商"></el-input>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <el-button type="primary"  @click="handlesearch">查询</el-button>
                            <el-button type="warning" @click="resetForm('searchForm')">重置</el-button>
                            <el-button type="primary" @click="exportFile()">导出</el-button>
                        </el-form-item>
                    </el-form> 
                </div>
            </div>
            <div class="J-elTable" id="J-elTable" >
                <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border >
                    <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                    <el-table-column prop="waybillNo" label="运单号" min-width="110" align='center'>
                        <template slot-scope="scope">
                        <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billTime" label="开单日期" min-width="110" align='center'></el-table-column>
                     <el-table-column prop="consignorName" label="发货单位" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consignorLinkman" label="发货人" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="transferName" label="承运商" min-width="150" align='center'></el-table-column>
                    <el-table-column prop="receiptStatus" label="回单状态" min-width="150" align='center'>
                        <template slot-scope="scope">
                            <div v-html="statusBackground(receiptStatus(scope.row.receiptStatus))" class="J-statusBackground"></div>     
                        </template>
                        <!-- <template slot-scope="scope">
                            
                            {{receiptStatus(scope.row.receiptStatus)}}
                        </template> -->
                    </el-table-column>
                    <el-table-column prop="receiptNum" label="回单份数" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="memo" label="备注说明" min-width="200" align='center'></el-table-column>
                    <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="goodsNum" label="件数" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="goodsWeight" label="重量" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="goodsBulk" label="体积" min-width="110" align='center'></el-table-column>
                </el-table>
                <div class="main-table-page">
                <div class="main-table-page-left"> 
                </div>
                    <el-pagination background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :page-sizes="page.pageSizes"
                       :page-size="page.pageSize"
                       :current-page="searchForm.pageNo"
                    layout="total, sizes, prev, pager, next, jumper"
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
    mixins: [Base,List],
     components: {
    "waybillNo-component": waybillNoComponent,
  },
    data() {
        return {
            searchForm: { //客户对账 查询   
                createTime:[],
                startReceiptBillTime:'',
                endReceiptBillTime:'',
                transferName:'',
                // consignorName:'',
                pageSize: 10,
                pageNo: 1
            },
            tableData: [], //专线对账 表格
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
        "searchForm.createTime": function (val, oldval) {
        if (val !== null) {
            this.searchForm.startReceiptBillTime = val[0];
            this.searchForm.endReceiptBillTime = val[1];
        }else{
            this.searchForm.startReceiptBillTime = null;
            this.searchForm.endReceiptBillTime = null;
        }
        },
    },
    methods: {
        showWaybill(row) {
      this.openWaybill.waybillNo = row.waybillNo
      this.openWaybill.waybillId = row.waybillId
      this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
      this.openWaybill.visiable = true;
    }, 
        async querySpecialList() {//获取页面初始数据    
        const { code, message,data} =await api.post('/receipt/receipt/list', this.searchForm)
        if(code==="200"){
            this.tableData = data.records;
            this.page.total = data.total;  
        }
        },
         exportFile(){  
            api.post('/receipt/receipt/export/list', this.searchForm).then(data=>{
                if (data.code == '200') {
           this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
        }
      })
    },
    }
};
</script>

