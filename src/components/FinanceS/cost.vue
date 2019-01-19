<template>
    <div class="MagList">
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
                   
                  <el-form-item label="结算方" prop="balanceHolderName">
                    <el-input v-model="searchForm.balanceHolderName" placeholder="结算方"></el-input>
                  </el-form-item>
                  <el-form-item label="结算类别" prop="balanceHolderType">
                    <el-select v-model="searchForm.balanceHolderType" multiple collapse-tags clearable  placeholder="请选择" class="J-width100">
                      <el-option
                        v-for="item in base.balanceHolderTypeOp"
                        :key="item.value"
                        :label="item.code"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item> 
                  <el-form-item label="核销状态"  prop="balanceStatus">
                    <el-select v-model="searchForm.balanceStatus"  multiple collapse-tags clearable placeholder="请选择" class="J-width100">
                      <el-option
                        v-for="item in base.balanceStatusBuizBatch"
                        :key="item.value"
                        :label="item.code"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item> 
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('balance:read')" @click='handlesearch' :loading="savingFlag" >查询</el-button>
                  <el-button type="warning" v-if="checkHasPermission('balance:read')" @click="resetForm('searchForm')">重置</el-button>
                  <el-button type="primary" v-if="checkHasPermission('balance:read')" @click="exportFile('searchForm')">导出</el-button>
                  </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="J-navButton">
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
                          <el-menu-item index="1-1" v-if="checkHasPermission('balance:balance') && scope.row.balanceStatus != 3 " @click="writeOffFun(scope.row)">核销</el-menu-item>  
                          <el-menu-item index="1-2" v-if="checkHasPermission('balance:read')" @click="costMxFun(scope.row)">费用核销明细</el-menu-item> 
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="balanceNo" label="对账结算批次" width="120"  align='center'>
                <template slot-scope="scope">
                   <el-button @click="detailClick(scope.row)" type="text" size="small">{{ scope.row.balanceNo }}</el-button>
                </template>
              </el-table-column>
              <el-table-column prop="balanceStatus" label="核销状态"  align='center'>
                <template slot-scope="scope">
                  <div v-html="statusBackground(balanceStatus(scope.row.balanceStatus))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column prop="realBalanceName" label="结算方" align='center'></el-table-column>
              <el-table-column prop="balanceHolderType" label="结算类型" min-width="100"  align='center'>
                <template slot-scope="scope">
                    {{balanceHolderType(scope.row.balanceHolderType)}}   
                </template>
              </el-table-column>
              <el-table-column prop="createTime" label="对账时间" width="180"  align='center'></el-table-column>
              <el-table-column prop="fee" label="结算金额"  align='center'></el-table-column>
              <el-table-column prop="unBalanceFee" label="余额"  align='center'></el-table-column>
               <el-table-column prop="createEmployeeName" label="核销人"  align='center'></el-table-column>       
              <el-table-column prop="memo" label="对账备注"  min-width="260"  align='center'></el-table-column>       

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
        <el-dialog :close-on-click-modal="false" :title="costFormList.title" :visible.sync="FinancesOpinionList.Cost.costHxOpinion" width="450px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
              <el-row>
                <el-form  ref="costFormList.costHxForm" :rules="oilcardAddRules"  :model="costFormList.costHxForm"  label-width="88px" class="demo-ruleForm J-flexSbc" style=" width: 91%;margin:0 auto">
                  <el-form-item label="核销金额 :" prop="hxFee">
                    <el-input v-model="costFormList.costHxForm.hxFee" placeholder="默认为剩余金额"></el-input>
                  </el-form-item>
                  <el-form-item label="备注 :" prop="memo"  class="J-width100">
                    <el-input type="textarea" v-model="costFormList.costHxForm.memo"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" @click="saveHxFee('costFormList.costHxForm')">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>
        <el-dialog :title="costMxTitle" :visible.sync="FinancesOpinionList.Cost.costMxOpinion" width="1200px" center class="Maglist-HairCar">
          <div class="J-detail"> 
              <el-row>
                <el-table :max-height="getScreenHeight-jElTableOffsetTop>69?getScreenHeight-jElTableOffsetTop:'none'" :data="costMxTable" border   >
                  <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                  <el-table-column prop="createTime" label="支付时间"  align='center' min-width="150"></el-table-column>
                  <el-table-column prop="lastRemainFee" label="上次结余" align='center'></el-table-column>
                  <el-table-column prop="fee" label="收款金额" align='center'></el-table-column>
                  <el-table-column prop="remainFee" label="本次余额"  align='center'></el-table-column>
                  <el-table-column prop="createEmployeeName" label="操作人"  align='center'></el-table-column> 
                  <el-table-column prop="memo" label="核销备注" width="420"  align='center'></el-table-column> 
                </el-table>
              </el-row> 
          </div>
        </el-dialog>  
      <!-- ↓↓↓↓↓↓↓↓↓↓↓↓ 根据不同的费用类型跳转到不同的详情页面 ↓↓↓↓↓↓↓↓↓↓↓↓ -->
          <template v-if="detailFlag == 1">
          <detailConsignorBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailConsignorBalance>
          </template>
            <template v-if="detailFlag == 2">
            <detailZxBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailZxBalance>
            </template>
          <template v-if="detailFlag == 3">
          <detailCartBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailCartBalance>
          </template>
            <template v-if="detailFlag == 4">
            <detailDbBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailDbBalance>
            </template>
          <template v-if="detailFlag == 5">
          <detailHkBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailHkBalance>
          </template>
            <template v-if="detailFlag == 100">
            <detailOtherBalance :pVisible.sync='detailDialog.visible' :pBalanceId='detailDialog.balanceId' :pBalanceNo='detailDialog.balanceNo' v-if="detailDialog.visible"></detailOtherBalance>
            </template>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js';
import detailConsignorBalance from '@/components/FinanceS/Recon/CustomerComponent/detail.vue';
import detailHkBalance from '@/components/FinanceS/Recon/BusinessComponent/detail.vue';
import detailZxBalance from '@/components/FinanceS/Recon/LineComponent/detail.vue';
import detailCartBalance from '@/components/FinanceS/Recon/VehicleComponent/detail.vue';
import detailDbBalance from '@/components/FinanceS/Recon/ShortComponent/detail.vue';
import detailOtherBalance from '@/components/FinanceS/Recon/Other/detail.vue';
export default {
  name:'f-cost',
  mixins: [Base,List],
   components: { 
    'detailConsignorBalance':detailConsignorBalance,
    'detailHkBalance':detailHkBalance,
    'detailZxBalance':detailZxBalance,
    'detailCartBalance':detailCartBalance,
    'detailDbBalance':detailDbBalance,
    'detailOtherBalance':detailOtherBalance
  },
    data() {
      return {
          costMxTitle:'',//
          costFormList:{
            title:'费用核销',
            costHxForm:{//费用核销 弹框内
              balanceId:'',
              hxFee:'',
              memo:''
            }
          },
          costMxTable:[],//费用核销明细
    
          searchForm: { //费用核销 查询   
            createTime:[],//时间控件 后端不接收 
            createTimeBegin:"",
            createTimeEnd:"",
            createEmployeeName:"",
            balanceHolderType:"",
            balanceHolderName:"",
            balanceStatus:"",
            pageSize: 10,
            pageNo: 1
          },
          tableData:[],
          detailDialog:{
          visible:false,//明细弹框打开
          balanceId:'',//明细id
          balanceNo:''
          },
          //费用核销
          oilcardAddRules:{
            hxFee:[
            { required: true, message: '请输入核销金额' ,trigger:['blur', 'change']},
            { validator: this.numberRules, trigger: ['blur', 'change']}

            ],
            memo:[
              { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
            ]
          },
          // 跳转标识
          detailFlag:'',
      }
    },
    watch:{
      "searchForm.createTime": function (val, oldval) {
        if (val) {
          this.searchForm.createTimeBegin = val[0];
          this.searchForm.createTimeEnd = val[1];
        }else{
          this.searchForm.createTimeBegin = null;
          this.searchForm.createTimeEnd = null;
        }
      }  
    },
    methods: {
        detailClick(row){
        this.detailFlag = row.balanceHolderType;
        this.detailDialog.visible = true;
        this.detailDialog.balanceId=row.id
        this.detailDialog.balanceNo=row.balanceNo
    },
      writeOffFun(row){
        this.FinancesOpinionList.Cost.costHxOpinion=true

        this.costFormList.title = '费用核销'
        if(row.unBalanceFee > 0) {
          this.costFormList.title +='（收入）'
        } else if(row.unBalanceFee < 0) {
          this.costFormList.title +='（支出）'
        } 

        this.costFormList.costHxForm.hxFee=Math.abs(row.unBalanceFee)
        this.costFormList.costHxForm.balanceId=row.id
        this.costFormList.costHxForm.memo=''
      },
      //费用核销 弹框保存
      saveHxFee(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.submitHxFee()
          } else {
            return false;
          }
        });
        
      },
      //费用核销 弹框保存————执行
      submitHxFee(){
        this.$confirm('确定要【保存】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {   
          this.savingFlag=true
          api.post('balance/fee/verify', this.costFormList.costHxForm).then(data=>{
            if(data.code==200){
              this.$message({type: 'success',message: '费用核销成功!'});
              this.querySpecialList()
              this.FinancesOpinionList.Cost.costHxOpinion=false
            }   
          }).then(() => { 
            this.savingFlag=false             
          })    
        }).catch(() => {})
      },

      async costMxFun(row){
        this.FinancesOpinionList.Cost.costMxOpinion=true
        this.costMxTitle=row.balanceNo+'对账单收款明细'
        const { code, message,data } = await api.get('/balance/detail?id=' + row.id)
        this.costMxTable=data
      },

      async querySpecialList() {//获取页面初始数据
        const { code, message,data } =await api.post('/balance/list', this.searchForm)
        if(code==="200"){
          this.tableData = data.records;
          this.page.total = data.total;  
        }
      },
       async exportFile(row) {   
          const { code, message,data} =await api.post('/balance/export/list', this.searchForm)
          if(code==="200"){
            this.$message({type: 'success',message: '文件正在导出中,请稍等！'});
          }
        },
    }
}
</script>


<style>

</style>
