<template>
 <div class="J-detail"> 
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                收入
            </div>
            <el-table
    :data="tableData.inFeeList"
    border 
    show-summary
    :summary-method="costTotal"
    style="width: 100%">
    <el-table-column
      prop="feeLinkName"
      label="费用关联方"
      width="180"  align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="projectName"
      label="项目名称"
      width="180" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="fee"
      label="费用"
      width="180" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="balanceFee"
      label="已结费用"
      width="180"  align='center' header-align="center">
       <template slot-scope="scope">
            {{ scope.row.balanceFee == null ? '-' : scope.row.balanceFee}}
        </template>
    </el-table-column>
    <el-table-column
      prop="unBalanceFee"
      label="未结费用"
      align='center' header-align="center">
       <template slot-scope="scope">
            {{ scope.row.unBalanceFee == null ? '-' : scope.row.unBalanceFee}}
        </template>
    </el-table-column>
    <el-table-column
      prop="memo"
      label="备注" align='center' header-align="center">
    </el-table-column>
  </el-table>    
</el-row> 
        <el-row>
            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                支出
            </div>
            <el-table
    :data="tableData.outFeeList"
    border 
    show-summary
    :summary-method="costTotal"
    style="width: 100%">
    <el-table-column
      prop="feeLinkName"
      label="费用关联方"
      width="180"  align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="projectName"
      label="项目名称"
      width="180" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="fee"
      label="费用"
      width="180" align='center' header-align="center">
    </el-table-column>
    <el-table-column
      prop="balanceFee"
      label="已结费用"
      width="180"  align='center' header-align="center">
        <template slot-scope="scope">
            {{ scope.row.balanceFee == null ? '-' : scope.row.balanceFee}}
        </template>
    </el-table-column>
    <el-table-column
      prop="unBalanceFee"
      label="未结费用"
      align='center' header-align="center">
       <template slot-scope="scope">
            {{ scope.row.unBalanceFee == null ? '-' : scope.row.unBalanceFee}}
        </template>
    </el-table-column>
    <el-table-column
      prop="memo"
      label="备注" align='center' header-align="center">
    </el-table-column>
  </el-table>    
        </el-row> 
         <el-row>
            <div class="J-detail-title">
               <span style="margin-right:50px; color: red; ">利润率：{{  ((tableData.inFee - tableData.outFee) / tableData.inFee * 100 ).toFixed(2) }} %</span>
               <span>利润率 =（应收 - 应付）/ 应收</span>
            </div>
            </el-row> 
    </div>
</template>
<script>
import api from '@/utils/api.js'
export default {
  props: ["waybillId"],
  data() {
    return {
      tableData: {
        inFeeList:[],
        outFeeList:[],
        inFee:[],
        outFee:[],
      },
    };
  },
  async created() {
    const  { code, message,data} =await api.get('/waybill/fee/balance?waybillId=' + this.waybillId)
    if(code==="200"){
      this.tableData = data

      }
  },
  methods:{
////////////// 合计  //////////////////////////////
    costTotal(param) {
      const { columns, data } = param; 
      const sums = [];
      columns.forEach((column, index) => {
      if (index === 0) {
          sums[index] = '合计';
          return; 
      }
      const values = data.map(item => Number(item[column.property]));
      const arr=['fee','balanceFee','unBalanceFee']
      if(arr.indexOf(column.property) > -1){//则包含该元素}
          if (!values.every(value => isNaN(value))) {
              sums[index] = values.reduce((prev, curr) => {
                  const value = Number(curr);
                  if (!isNaN(value)) {
                  return prev + curr;
                  } else {
                  return prev;
                  }
              }, 0);
              // sums[index] += ' 元'; 
              } else {
              sums[index] = 'N/A';
              }
          }  
      });
      return sums;
    },
    
  }
};
</script>



