<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="卡号" prop="cardNo">
                    <el-input v-model="searchForm.cardNo" placeholder="卡号"></el-input>
                  </el-form-item>
                  <el-form-item label="车牌" prop="plateNumber">
                    <el-input v-model="searchForm.plateNumber" placeholder="车牌"></el-input>
                  </el-form-item> 
                  <el-form-item label="司机" prop="driverName">
                    <el-input v-model="searchForm.driverName" placeholder="司机"></el-input>
                  </el-form-item>
                  <el-form-item label="司机手机" prop="driverMobile">
                    <el-input v-model="searchForm.driverMobile" placeholder="司机手机"></el-input>
                  </el-form-item> 
                  <el-form-item label="分配状态" prop="status">
                    <el-select v-model="searchForm.status"  multiple collapse-tags clearable placeholder="分配状态  ">
                      <el-option
                        v-for="item in base.distributionStatus"
                        :key="item.value"
                        :label="item.code"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item> 
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('oilcard:read')" @click='handlesearch'>查询</el-button>
                    <el-button type="warning" v-if="checkHasPermission('oilcard:read')" @click="resetForm('searchForm')">重置</el-button>
                    <el-button type="primary" style="margin-right:18px" v-if="checkHasPermission('oilcard:create')" @click="newModifyFun()">新增油卡</el-button>
                  </el-form-item>
              </el-form>
             
            </div>
          </div>
          
          <!-- <div class="J-navButton"> -->
          <!-- </div> -->
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
                          <el-menu-item index="1-2" v-if="checkHasPermission('oilcard:update')" @click="newModifyFun(scope.row)">修改油卡</el-menu-item> 
                          <el-menu-item index="1-3" v-if="checkHasPermission('oilcard:recharge')" @click="rechargeFun(scope.row)">油卡充值</el-menu-item>  
                          <el-menu-item index="1-4" v-if="checkHasPermission('oilcard:read')" @click="listLogFun(scope.row)">使用记录</el-menu-item> 
                          <el-menu-item index="1-5" v-if="scope.row.status==1 && checkHasPermission('oilcard:assign')" @click="assignFun(scope.row)">分配</el-menu-item>  
                          <el-menu-item index="1-6" v-if="scope.row.status==2 && checkHasPermission('oilcard:back')" @click="takeBackFun(scope.row)">收回</el-menu-item> 
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="oilName" label="开户油站" align='center'></el-table-column>
              <el-table-column prop="cardNo" label="油卡卡号"  width='180' align='center'></el-table-column>
              <el-table-column prop="fee" label="余额" align='center'></el-table-column>
              <el-table-column prop="status" label="分配状态" align='center'>
                <template slot-scope="scope">
                  <div v-html="statusBackground(distributionStatus(scope.row.status))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column prop="plateNumber" label="车牌号" align='center'></el-table-column>
              <el-table-column prop="driverName" label="司机名称" align='center'></el-table-column>
              <el-table-column prop="driverMobile" label="司机手机" align='center'></el-table-column>
              <el-table-column prop="assignEmployeeName" label="分配人" align='center'></el-table-column>       
              <el-table-column prop="assignTime" label="分配日期" min-width="120" align='center'></el-table-column>       
              <el-table-column prop="lastRechargeTime"  min-width="120"  label="充值日期" align='center'></el-table-column>       
              <el-table-column prop="memo" label="备注" min-width="200" align='center'></el-table-column>       
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

        <el-dialog  :close-on-click-modal="false" :title="newModifyTitle" :visible.sync="FinancesOpinionList.Oilcard.oilcardOpinion" @close="closeDialog('oilcardAddForm')"  width="585px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
              <el-row>
                <el-form ref="oilcardAddForm"  :rules="oilcardAddRules"  :model="oilcardAddForm"  label-width="94px" class="demo-ruleForm J-flexSbc" style=" width: 90%;margin:0 auto">
                  <el-form-item label="办卡日期：" prop="openTime" class="J-width100">
                     <el-date-picker
                        v-model="oilcardAddForm.openTime"
                        type="datetime"
                        :disabled="newModifyDisabled"
                        placeholder="选择日期时间"
                        align="right">
                      </el-date-picker>
                  </el-form-item>
                  <el-form-item label="开户油站：" prop="oilName" class="J-width100">
                    <el-input v-model="oilcardAddForm.oilName"></el-input>
                  </el-form-item> 
                  <el-form-item label="油卡卡号：" prop="cardNo" class="J-width100" >
                    <el-input v-model="oilcardAddForm.cardNo" :disabled="newModifyDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="卡内金额：" prop="fee" class="J-width100" >
                    <el-input v-model.number="oilcardAddForm.fee" :disabled="newModifyDisabled"></el-input>
                  </el-form-item>
                  <el-form-item label="备注：" prop="memo" class="J-width100">
                    <el-input type="textarea" v-model="oilcardAddForm.memo"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" @click="newModifyPreservation('oilcardAddForm')">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="油卡充值" :visible.sync="FinancesOpinionList.Oilcard.rechargeOpinion"  @close="closeDialog('oilcardRechargeForm')" width="585px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
              <el-row>
                <el-form ref="oilcardRechargeForm"  :rules="oilcardRechargeRules" :model="oilcardRechargeForm"  label-width="94px" class="demo-ruleForm J-flexSbc" style=" width: 90%;margin:0 auto">
                  <el-form-item label="开户油站：" class="J-width100" >
                    {{oilcardRechargeForm.oilName}}
                  </el-form-item>
                  <el-form-item label="油卡卡号：" class="J-width100">
                     {{oilcardRechargeForm.cardNo}}
                  </el-form-item>
                  <el-form-item label="充值金额：" prop="money" class="J-width100">
                    <el-input v-model.number="oilcardRechargeForm.money"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" @click="rechargePreservation('oilcardRechargeForm')">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="油卡分配" :visible.sync="FinancesOpinionList.Oilcard.allotOpinion" @close="closeDialog('oilcardAllotForm')" width="585px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
              <el-row>
                <el-form ref="oilcardAllotForm" :rules="oilcardAllotRules" :model="oilcardAllotForm"  label-width="122px" class="demo-ruleForm J-flexSbc" style=" width: 90%;margin:0 auto">
                  <el-form-item label="开户油站 :" class="J-width100" >
                    {{oilcardAllotForm.oilName}}
                  </el-form-item>
                  <el-form-item label="油卡卡号 :" class="J-width100">
                    {{oilcardAllotForm.cardNo}}
                  </el-form-item>
                  <el-form-item label="分配的车牌号 :" prop="truckId"  class="J-width100">
                    <el-select v-model="oilcardAllotForm.truckId" placeholder="请选择">
                      <el-option
                        v-for="item in truckIdOption"
                        :key="item.id"
                        :label="item.plateNumber"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item> 
                  <el-form-item label="备注 :"  prop="memo" class="J-width100">
                    <el-input v-model="oilcardAllotForm.memo"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" @click="assignPreservation('oilcardAllotForm')">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>
        <el-dialog :close-on-click-modal="false" title="油卡收回" :visible.sync="FinancesOpinionList.Oilcard.callbackOpinion"  @close="closeDialog('oilcardCallbackForm')" width="585px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
              <el-row>
                <el-form ref="oilcardCallbackForm" :rules="oilcardCallbackRules"  :model="oilcardCallbackForm"  label-width="82px" class="demo-ruleForm J-flexSbc" style=" width: 90%;margin:0 auto">
                  <el-form-item label="备注："  prop="memo" class="J-width100">
                    <el-input v-model="oilcardCallbackForm.memo"></el-input>
                  </el-form-item>  
                </el-form>
                <span class="dialog-footer" style="display: block; text-align: center;">
                  <el-button type="primary" :loading="savingFlag" @click="regainPreservation">保 存</el-button>
                </span> 
              </el-row> 
          </div>
        </el-dialog>
        <el-dialog title="油卡使用记录" :visible.sync="FinancesOpinionList.Oilcard.recordOpinion" width="1200px" center class="Maglist-HairCar J-dialog-vh">    
          <div class="J-detail J-dialog-vh-body J-table"> 
              <el-row>
                <el-table :max-height="getScreenHeight-jElTableOffsetTop>69?getScreenHeight-jElTableOffsetTop:'none'" :data="listLogTableData" border   >
                  <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                  <el-table-column prop="operate" label="操作" align='center'></el-table-column>
                  <el-table-column prop="content" label="详情" min-width="300" align='center'></el-table-column>
                  <el-table-column prop="memo" label="操作备注" min-width="200"  align='center'></el-table-column>
                  <el-table-column prop="createTime" label="操作时间" min-width="120"  align='center'></el-table-column>
                  <el-table-column prop="createEmployeeName" label="操作人" align='center'></el-table-column>  
                </el-table>

              </el-row> 
          </div>
        </el-dialog>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
  name:'f-oilcard',
  mixins: [Base,List],
  data() {
    return {   
        //新增修改input禁用状态  
        newModifyDisabled:true,
        //已选择n项
        batchNum:0,
        ids:[],//选择删除的id数组
        //删除弹框title
        batchDeletionTitle:"",
        //判断是新增还是修改
        newModifyMessage:false,
        //新增或修改弹框title
        newModifyTitle:'',
        //油卡新增或修改
        oilcardAddForm:{
          openTime:'',
          oilName:'',
          cardNo:'',
          fee:'',
          memo:'',
          id:''
        },
        //油卡充值
        oilcardRechargeForm:{
          oilName:'',
          cardNo:'',
          money:'',
          id:''
        },
        //油卡分配
        oilcardAllotForm:{
          oilName:'',
          cardNo:'',
          truckId:'',
          memo:'',
          id:''
        },
        //油卡收回
        oilcardCallbackForm:{
          memo:'',
          id:'',
        },
        //油卡管理 查询   
        searchForm: { 
          cardNo:'',
          plateNumber:'',
          driverName:'',
          driverMobile:'',
          status:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [], 
        //使用记录
        listLogTableData:[],
        multipleSelection: [],
        //分配的车牌号的接口
        truckIdOption:[],
        //油卡新增或修改
        oilcardAddRules: {
          openTime:[
            { required: true, message: '请选择办卡时间' ,trigger:'change' }         
          ],
          oilName:[
            { required: true, message: '请选择开户油站' ,trigger: ['blur', 'change'] }         
          ],
          cardNo:[
            { required: true, message: '请输入油卡卡号' ,trigger: ['blur', 'change']},
            { validator: this.numberStringRules, trigger: ['blur', 'change']},
            { min: 1, max: 50, message: '超出长度限制{1~50}' ,trigger: 'blur'}  
          ],
          fee:[
            { required: true, message: '请输入金额' ,trigger: ['blur', 'change'] },  
            { type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}
          ],
          memo:[
            { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
          ]
        },
        //油卡充值
        oilcardRechargeRules:{
          money:[
            { required: true, message: '请输入金额' ,trigger: ['blur', 'change'] },  
            { type: 'number', message: '金额必须为数字值', trigger: ['blur', 'change']}
          ],
        },
        //油卡分配
        oilcardAllotRules:{
          truckId:[
           { required: true, message: '请选择分配的车牌号' ,trigger:['blur', 'change']}
          ],
          memo:[
            { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
          ]
        },
        //油卡收回
        oilcardCallbackRules:{
          memo:[
            { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
          ]
        }
      };
    },
    
    methods: {
      //弹框关闭时清空表单数据
      closeDialog(formName){    
        if(this.$refs[formName]){    
          this.$refs[formName].resetFields();
        }
      },
      newModifyFun(row){
        if(row){
          this.newModifyMessage=false
          this.newModifyDisabled=true
          this.newModifyTitle='油卡修改'
          this.oilcardAddForm.openTime=row.openTime
          this.oilcardAddForm.oilName=row.oilName
          this.oilcardAddForm.cardNo=row.cardNo
          this.oilcardAddForm.fee=row.fee
          this.oilcardAddForm.memo=row.memo
          this.oilcardAddForm.id=row.id
        }else{
          this.newModifyMessage=true
          this.newModifyDisabled=false
          this.newModifyTitle='油卡新增'
        }    
        this.FinancesOpinionList.Oilcard.oilcardOpinion=true 
      },
      //油卡修改/新增--弹框点击保存到
      newModifyPreservation(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveDataSubmit(formName)
          } else {
            return false;
          }
        });
      },
       //油卡修改/新增--点击保存到-执行
      saveDataSubmit(formName){ 
        this.savingFlag=true
        if(this.newModifyMessage){
          api.post('oil/add',this.oilcardAddForm).then(data=>{
            if(data.code==="200"){
              this.$message({
                type: 'success',
                message: '恭喜您，油卡已新增!'
              });
              this.FinancesOpinionList.Oilcard.oilcardOpinion=false 
              this.querySpecialList()
            }
          }).then(() => { 
            this.savingFlag=false  
          })
        }else{
          api.post('oil/update',this.oilcardAddForm).then(data=>{
            if(data.code==="200"){
              this.$message({
                  type: 'success',
                  message: '恭喜您，已成功修改该油卡信息!'
              }); 
            }  
            this.FinancesOpinionList.Oilcard.oilcardOpinion=false 
            this.querySpecialList()
          }).then(() => { 
            this.savingFlag=false             
          })    
        }
      },  
      //油卡充值   
      rechargeFun(row){    
        this.FinancesOpinionList.Oilcard.rechargeOpinion=true
        this.oilcardRechargeForm.oilName=row.oilName
        this.oilcardRechargeForm.cardNo=row.cardNo
        this.oilcardRechargeForm.money=''
        this.oilcardRechargeForm.id=row.id
      },
     //油卡充值 --弹框保存
       rechargePreservation(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.oilRecharge()
          } else {
            return false;
          }
        });
      },
      //油卡充值 -弹框保存-执行
      oilRecharge(){  
        this.savingFlag=true
        api.post('oil/recharge',this.oilcardRechargeForm).then(data=>{
          if(data.code==="200"){
            this.$message({
              type: 'success',
              message: '恭喜您，油卡充值成功!'
            });
            this.FinancesOpinionList.Oilcard.rechargeOpinion=false
            this.querySpecialList()
          }
        
        }).then(() => { 
            this.savingFlag=false             
        })  
      },  
      //使用记录 
      async listLogFun(row){   
        const { code, message,data } =await api.get('oil/list/log?id='+row.id)
        this.FinancesOpinionList.Oilcard.recordOpinion=true 
        if(code==="200"){
          this.listLogTableData = data;
        }
      },
      //分配    
      assignFun(row){
        this.FinancesOpinionList.Oilcard.allotOpinion=true 
        this.oilcardAllotForm.oilName=row.oilName
        this.oilcardAllotForm.cardNo=row.cardNo
        this.oilcardAllotForm.truckId=''
        this.oilcardAllotForm.id=row.id
        this.oilcardAllotForm.memo=''
      },
      //油卡分配  --弹框保存
      assignPreservation(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.oilAssign()
          } else {
            return false;
          }
        });
      },
      //油卡分配  --弹框保存-执行
      oilAssign(){
        this.savingFlag=true
        api.post('oil/assign',this.oilcardAllotForm).then(data=>{
          if(data.code==="200"){
            this.$message({
              type: 'success',
              message: '恭喜您，油卡分配成功!'
            });
            this.FinancesOpinionList.Oilcard.allotOpinion=false 
            this.querySpecialList()
          }
        }).then(() => { 
            this.savingFlag=false             
        })
      } ,
      //收回  
      takeBackFun(row){
        this.FinancesOpinionList.Oilcard.callbackOpinion=true 
        this.oilcardCallbackForm.id=row.id
        this.oilcardCallbackForm.memo=''
      },
      //油卡收回   --弹框保存
      regainPreservation(){
        this.savingFlag=true
        api.post('oil/regain',this.oilcardCallbackForm).then(data=>{
          this.FinancesOpinionList.Oilcard.callbackOpinion=false 
          if(data.code==="200"){
            this.$message({
              type: 'success',
              message: '油卡收回成功!'
            });
            this.querySpecialList()
          }
        }).then(() => { 
          this.savingFlag=false             
        })   
      },
      async querySpecialList() {//获取页面初始数据
        const { code, message,data } =await api.post('oil/list', this.searchForm)
        if(code==="200"){
          this.tableData = data.records;
          this.page.total = data.total;  
        }
      },   
      //获取信息管理中---分配的车牌号的接口
      async carList(){
        const { code, message,data } =await api.post('car/list', this.searchForm)
        if(code==="200"){
          this.truckIdOption = data.records;
        }
      },
      handleSelectionChange(val) {
        var delsete=[]
        this.multipleSelection = val;
        for (const item of this.multipleSelection) {
            delsete.push(item.id)  
        }
        this.batchNum=delsete.length
        this.ids=delsete
      },
      batchDeletion(row){//批量删除      
      if(row.id){
          this.batchDeletionTitle='此操作将永久删除当前油卡, 是否继续?'
      }else{
          this.batchDeletionTitle='此操作将永久删除已选择油卡, 是否继续?'
      }
      this.$confirm(this.batchDeletionTitle, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        center:true,
        type: 'warning'
      }).then(async () => {
        if(row.id){
          this.ids.splice(0,this.ids.length,row.id);
        }
        if(this.ids!=''){
          const { code, message,data } =await api.get('car/delete?ids='+this.ids)
                  if(code==="200"){
            this.$message({
              type: 'success',
              message: '恭喜您，删除成功!'
            });
            if (this.tableData.length===1) {
              this.searchForm.pageNo--
            }   
            this.querySpecialList()
          }    
        }else{
          this.$message({
            type: 'warning',
            message: '请选择需要删除的油卡'
          });   
        }             
      }).catch(() => {
                
      });
    },  
  },
  created() {
    this.carList()//获取信息管理中---车辆管理的接口
  },
};
</script>
<style>
</style>
