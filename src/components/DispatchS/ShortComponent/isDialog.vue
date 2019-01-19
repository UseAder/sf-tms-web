
<template>
    <div>
        <el-dialog :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)" 
             width="1200px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">          
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body">
                <el-row>  
                    <div  id="J-dialog-header-offsetHeight" style="overflow: hidden;">
                        <el-form ref="newModifyForm"  :rules="newModifyRules" :model="newModifyForm"  >
                            <div class="J-detail-title">
                                <div class="J-detail-title-yuan"></div>
                                基本信息
                            </div>
                            <el-col :span="6" >
                                <div class="labal">短驳车辆</div>
                                <div class="input J-elSelect J-borderBot">
                                    <el-form-item prop="plateNumber">
                                        <el-autocomplete 
                                            placeholder="短驳车辆"
                                            ref="plateNumber"
                                            value-key="plateNumber"
                                            select-when-unmatched
                                            v-model="newModifyForm.plateNumber"
                                            @select="handleCartSelect"
                                            :fetch-suggestions="queryCartferSearch">
                                            <template slot-scope="{ item }">
                                                <span style="float: left;">{{ item.plateNumber }}</span>
                                            </template>
                                        </el-autocomplete>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <!-- <el-col :span="6">
                                <div class="labal">短驳车辆</div>
                                <div class="input J-borderBot"><el-input type="text" placeholder="短驳车辆" v-model="newModifyForm.plateNumber"></el-input></div>
                            </el-col> -->
                            <el-col :span="6">
                                <div class="labal">司机名称</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="driverName">
                                        <el-input placeholder="司机名称" v-model="newModifyForm.driverName"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">联系手机</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="driverMobile">
                                        <el-input placeholder="联系手机" v-model="newModifyForm.driverMobile"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>                                                       
                            <el-col :span="6">
                                <div class="labal">短驳车型</div>
                                <div class="input J-borderBot">
                                    <el-select v-model="newModifyForm.truckType" placeholder="请选择" class="J-width100">
                                    <el-option
                                        v-for="item in base.catTruckTypeData"
                                        :key="item.value"
                                        :label="item.item"
                                        :value="item.value">
                                    </el-option>
                                    </el-select>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">短驳时间</div>
                                <div class="input J-borderBot">
                                    <el-date-picker
                                    v-model="newModifyForm.drayageTime"
                                    type="datetime"
                                    placeholder="选择日期时间">
                                    </el-date-picker>
                                </div>
                            </el-col>
                            <el-col :span="6">
                                <div class="labal">短驳运费</div>
                                <div class="input J-borderBot">
                                    <el-form-item prop="fee">
                                        <el-input type="text" placeholder="短驳运费" v-model="newModifyForm.fee"></el-input>
                                    </el-form-item>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <div class="labal">成本分摊方式</div>
                                <div class="input J-borderBot">
                                    <el-radio-group v-model="newModifyForm.separateRule">
                                    <el-radio :label="1">按件</el-radio>
                                    <el-radio :label="2">重量</el-radio>
                                    <el-radio :label="3">体积</el-radio>
                                    <el-radio :label="4">单</el-radio>
                                    </el-radio-group>
                                </div>  
                            </el-col>
                            
                            <el-col :span="24">
                                <div class="labal">备注</div>
                                 
                                <div class="input ">
                                    <el-form-item prop="memo">
                                    <el-input type="text" placeholder="备注" v-model="newModifyForm.memo"></el-input>
                                     </el-form-item>
                                    </div>
                            </el-col>
                        </el-form>
                    </div>
                    <el-row > 
                        <div class="J-detail-title">
                            <div class="J-detail-title-yuan"></div>
                            短驳运单列表
                        </div>
                        <el-row class="J-elTable" >
                            <el-table  :max-height="getScreenHeight-jElTableOffsetTop-jdialogFooterOffsetHeight-150>111?getScreenHeight-jElTableOffsetTop-150-jdialogFooterOffsetHeight:'none'"  :data="tableData" border @selection-change="handleSelectionChange"  ref="multipleTable"  class="table-checkboxLabel">
                                <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
                                <el-table-column fixed type="index" width="50" label="序号" align='center'> </el-table-column>
                                <el-table-column prop="waybillNo" label="运单号" width="110"  align='center' header-align="center">
                                    <template slot-scope="scope">
                                    <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                                    </template>
                                </el-table-column>
                                <el-table-column  prop="status" label="运单状态" min-width="110" align='center'>
                                    <template slot-scope="scope">
                                    <div v-html="statusBackground(waybillStatus(scope.row.status))" class="J-statusBackground"></div>     
                                    </template>
                                </el-table-column>                            <el-table-column prop="billTime" label="开单日期" width="110"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="transferName" label="承运商名称" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="linkman" label="联系人" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="linkmanMobile" label="联系手机电话" width="120"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="receiptNum" label="回单" width="110"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consignorName" label="发货单位" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consignorLinkman" label="发货人" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consignorLinkmanMobile" label="发货人手机" width="120"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consignorAddress" label="发货地址" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consigneeName" label="收货单位" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consigneeLinkman" label="收货人" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consigneeLinkmanMobile" label="收货人手机" width="120"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="consigneeAddress" label="收货地址" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="goodsName" label="货物名称" width="180"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="pack" label="包装" width="110"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="goodsNum" label="件数" width="110"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="goodsWeight" label="重量" width="110"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="goodsBulk" label="体积" width="110"  align='center' header-align="center"></el-table-column>
                                <el-table-column prop="memo" label="备注" width="180"  align='center' header-align="center"></el-table-column>
                            </el-table>
                        </el-row>
                    </el-row>  

                    <div class="main-table-page"  id="J-dialog-footer-offsetHeight">
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
                </el-row>  
                <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
                    <el-button type="primary" :loading="savingFlag" @click="preservation('newModifyForm')">保 存</el-button>
                </span>
            </div>
        </el-dialog>
        <waybillNo-component
        :showFlag.sync="openWaybill.visiable"
        :waybillNo="openWaybill.waybillNo"
        :statusText="openWaybill.statusText"
        :waybillId="openWaybill.waybillId"
        v-if="openWaybill.visiable"
      ></waybillNo-component>
    </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js';
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    mixins: [Base,List],
    props: ['dialog','isContent','updateRow'],
     components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data() {
        return {
            //提货短驳 分页
            searchForm: {
                pageSize: 10,
                pageNo: 1,
                drayageId:'', //修改提货短驳 需要
                pickOrDriverType:1
            },     
            isDialog: this.dialog,
            newModifyTitle:'',
            tableData:[],
            newModifyForm:{
                plateNumber:'',
                driverName:'',
                truckType:'',
                driverMobile:'',
                drayageTime:'',
                fee:'',
                separateRule:1,
                memo:'',
                waybillList:[],
                drayageType:1,
                drayageId:'',
                id:''
            },
            multipleSelection: [], //多选
            base:{
                catTruckTypeData:[],
                cartList:[]

            },
            savingFlag:false,
            newModifyRules: {
                plateNumber: [
                    { required: true, message: '请选择短驳车辆' ,trigger: ['blur', 'change'] },
                     { validator: this.plateNumberRules, trigger: ['blur', 'change']}
                ],
                driverName: [
                    { required: true, message: '请输入司机名称' ,trigger: ['blur', 'change'] },
                ],
                driverMobile: [
                     { validator: this.linkmanMobileRules, trigger: ['blur', 'change']}
                ],
                 fee:[
                      { validator: this.numberRules, trigger: ['blur', 'change']}
                ],
                memo:[
                    { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
                ]
              
            },
        //运单详情框
            openWaybill: {
            waybillNo: "",
            waybillId: "",
            statusText: "",
            visiable: false
      },
        }
    },
    created(){
        this.loadCarTypeDataFun();
        this.openDialog()
    },
    methods:{
        showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.id
            this.openWaybill.statusText = this.waybillStatusTxt(row.status);
            this.openWaybill.visiable = true;
    }, 
        openDialog(){
            if(this.updateRow){
                this.newModifyTitle='修改提货短驳'
                this.searchForm.drayageId=this.updateRow.id
                this.draDrayageModifyList()
            }else{
                this.newModifyTitle='提货短驳'
                this.draPickList()  
            }            
        },
        //费用未对账 勾选时
        toggleSelection(rows) {  
            if (rows) {
                rows.forEach(row=>{
                    
                    this.$refs.multipleTable.toggleRowSelection(row);
                })
            } 
        },
        //提货短驳table列表
        draPickList(){
            api.post('/dra/pick/list',this.searchForm).then(data=>{
                if(data.code==="200"){
                    this.tableData = data.data.records;
                    this.page.total = data.data.total;  
                }
            })
        },
        //修改提货短驳table列表
        draDrayageModifyList(){
            api.post('/dra/drayage/modify/list ',this.searchForm).then(data=>{
                if(data.code==="200"){
                    this.tableData = data.data.records;
                    this.page.total = data.data.total;  
 
                    var sData=this.tableData.filter(n=>n.hasExist == true)  
                    this.$nextTick(function(){//默认选中
                        this.toggleSelection(sData)
                    })
                }
            })
            api.get('/dra/find/drayage?drayageId='+this.searchForm.drayageId).then(data=>{
                if(data.code==="200"){
                    if (data.data) {
                        this.newModifyForm.plateNumber=data.data.plateNumber
                        this.newModifyForm.driverName=data.data.driverName
                        this.newModifyForm.driverMobile=data.data.driverMobile
                        this.newModifyForm.truckType=data.data.truckType.toString()
                        this.newModifyForm.drayageTime=data.data.drayageTime
                        this.newModifyForm.fee=data.data.fee
                        this.newModifyForm.separateRule=data.data.separateRule
                        this.newModifyForm.memo=data.data.memo
                        this.newModifyForm.id=data.data.id
                    }    
                }
            })
        },
        handleSizeChange(val) {//`每页 ${val} 条`
            this.searchForm.pageSize=val;
            if(this.updateRow){
                this.draDrayageModifyList();
            }else{
                this.draPickList();
            }
            
        },
        handleCurrentChange(val) {//当前页 
            this.searchForm.pageNo=val;
            if(this.updateRow){
                this.draDrayageModifyList();
            }else{
                this.draPickList();
            }
        },
        //新增 或修改 保存时
        preservation(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {    
                    if (this.savingFlag) {
                        return;
                    }
                    if (this.multipleSelection=='') {
                        this.$message({
                                type: 'error',
                                message: '请选择需要短驳的运单!'
                            });
                        return
                    }
                    if(!this.updateRow){
                        this.$confirm('确定要【提货短驳】, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(() => {
                            this.savingFlag = true
                            var waybillListArray=[]
                            this.multipleSelection.forEach(val => {waybillListArray.push(val.id);});  
                            this.newModifyForm.waybillList=waybillListArray
                            api.post('/dra/add', this.newModifyForm).then(data=>{
                                if(data.code==="200"){
                                    this.$message({
                                        type: 'success',
                                        message: '恭喜您，短驳批次号已生成!'
                                    });
                                    this.newModifyForm={}
                                    this.newModifyForm.drayageType=1
                                    this.isDialog=false
                                    this.$emit('ischild',true)
                                }
                            }).then(() => { 
                                this.savingFlag=false             
                            }) 
                        }).catch(() => {})
                    }else{
                        this.$confirm('确定要修改【提货短驳】, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning',
                            center: true
                        }).then(() => {
                            this.savingFlag = true
                            var waybillListArray=[]
                            this.multipleSelection.forEach(val => {waybillListArray.push(val.id);});  
                            this.newModifyForm.waybillList=waybillListArray
                            api.post('/dra/drayage/modify', this.newModifyForm).then(data=>{
                                if(data.code==="200"){
                                    this.$message({
                                        type: 'success',
                                        message: '恭喜您，短驳批次号已生成!'
                                    });
                                    this.newModifyForm={}
                                    this.newModifyForm.drayageType=1
                                    this.isDialog=false
                                    this.$emit('ischild',true)
                                }
                            }).then(() => { 
                                this.savingFlag=false             
                            }) 
                        }).catch(() => {})
                    }
                } else { 
                    return false;
                }
            });
           

        },   
        //加载车型接口 
        async loadCarTypeDataFun(){
           const { code, message,data } =await api.get('system/dic/code?code=TRUCK_TYPE');
            this.base.catTruckTypeData = data;
        },
         handleCartSelect(item) {
            //在未选择建议项时，item的内容为输入的数据，而不是列表内容            
            if (item.plateNumber)  {
                this.newModifyForm.plateNumber = item.plateNumber
                this.newModifyForm.driverName = item.driverName                
                this.newModifyForm.driverMobile = item.driverMobile
                if(item.truckType) {
                    this.newModifyForm.truckType = item.truckType.toString()
                }
            }

        },
        queryCartferSearch(queryString, cb) {
            api.get('/car/list/ddl?word=' + queryString).then(data=>{
                if (data.code === '200') {
                    this.base.cartList = data.data;
                } else {
                    this.base.cartList = [];
                }
                cb(this.base.cartList);
            })
        },
    }, 
    
}                    
</script>

                          
  
                        
 
              