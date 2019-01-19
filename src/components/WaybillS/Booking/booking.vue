<template>
    <div class="MagList">
        <div class="J-main-body ">
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
                        <el-form-item label="电商仓库" prop="ebWarehouseId">
                            <el-select v-model="searchForm.ebWarehouseId"  multiple collapse-tags clearable placeholder="请选择" class="J-width100">
                                <el-option
                                    v-for="item in base.ebWarehouseId"
                                    :key="item.id"
                                    :label="item.warehouseName"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        
                        <el-form-item label="发货单位" prop="consignorName">
                            <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                        </el-form-item>
                        <el-form-item label="运单号" prop="waybillNo">
                            <el-input v-model="searchForm.waybillNo" placeholder="运单号"></el-input>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <el-button type="primary" v-if="checkHasPermission('booking:read')" @click='handlesearch'>查询</el-button>
                            <el-button type="warning" v-if="checkHasPermission('booking:read')" @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div :class="trackWaybillVisible?'visibleWaybillList':''">
                <div class="J-elTable-right J-inputWidth">
                    <div class="J-elTable-right-title-icon" @click="showTrackWaybill">
                        <img src="@/assets/rightRight.png" class="J-width100">
                    </div>
                    <div class="J-elTable-right-waybill">
                        <v-bookingRegister @upData="updateData" :waybillNo.sync='chooseData.waybillNo' :waybillId.sync='chooseData.waybillId' :id.sync='chooseData.id' :convertWaybillStatus.sync='chooseData.waybillStatus'></v-bookingRegister>
                    </div>
                </div>
            <!-- <div class="J-elTable" >
                <div class="J-elTable-right J-inputWidth">
                    <v-bookingRegister @upData="updateData" :showData.sync='bookingRegisterTransmit.data'></v-bookingRegister>
                </div> -->
                <div class="J-elTable-left" id="J-elTable">
                    <el-table :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  ref="defaultChoiceData" highlight-current-row :data="tableData" border @current-change="currentChangeFun">
                        <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                        <el-table-column  prop="status" label="预约状态" min-width="110" align='center'>
                            <template slot-scope="scope">
                                <div v-html="statusBackground(bookingStatus(scope.row.status))" class="J-statusBackground"></div>     
                            </template>
                        </el-table-column>
                        <el-table-column prop="billTime" label="开单日期" width="110" align='center'></el-table-column>
                        <el-table-column prop="consignorName" label="发货单位"  width='180' align='center'></el-table-column>
                        <el-table-column prop="warehouse" label="电商仓库" width="150" align='center'></el-table-column>
                        <el-table-column prop="address" label="仓库地址" width="180" align='center'></el-table-column>
                        <el-table-column prop="transferName" label="承运方" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="waybillNo" label="查货单号" width="150" align='center'></el-table-column>
                        <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="pack" label="包装" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="goodsNum" label="件数" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="goodsBulk" label="体积" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="orderDate" label="预约时间" width="110" align='center'></el-table-column>
                        <el-table-column prop="orderNum" label="预约次数" min-width="110" align='center'></el-table-column>
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
        </div>
        <v-managementMark   @reloadData="markReloadData" :dialog.sync='managementMark.visiable'  v-if="managementMark.visiable"></v-managementMark>

    </div>
</template>


<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import managementMarkDialog from '@/components/Common/managementMark.vue'
import bookingRegister from './BookingRegister/bookingRegister.vue'
export default {
    name:'w-b-booking',
    mixins: [Base,List],
    components: { 
        'v-bookingRegister':bookingRegister,
        'v-managementMark':managementMarkDialog,
    },
    data() {
        return {
            //控制运单跟踪模块div缩放
            trackWaybillVisible:false,
            tableDataTrackId:'',
            //向预约登记页面传送数据
            chooseData:{
                waybillNo:'',
                waybillId:'',
                id:'',
                waybillStatus:''
            },        
            searchForm: { //客户对账 查询   
                createTime:[],
                startBillTime:'',
                endBillTime:'',
                ebWarehouseId:'',
                waybillNo:'',
                consignorName:'',
                pageSize: 10,
                pageNo: 1
            },
            tableData: [], //专线对账 表格
            multipleSelection: [], //多选
            base:{
            ebWarehouseId:[]
            },    
        };
        
    },
    watch:{
        "searchForm.createTime": function (val, oldval) {
            if (val !== null) {
                this.searchForm.startBillTime = val[0];
                this.searchForm.endBillTime = val[1];
            }else{
                this.searchForm.startBillTime = null;
                this.searchForm.endBillTime = null;
            }
        },
        //table列表数据存在的时候默认选择第一个
        "tableData": function (){
           if (this.tableData!=''&&this.tableData) {                
                let tableDataTrackIdStorage = this.tableData.find(n => n.waybillId === this.tableDataTrackId);  
                if (tableDataTrackIdStorage) {
                    this.$refs.defaultChoiceData.setCurrentRow(tableDataTrackIdStorage);      
                }else{
                    this.$refs.defaultChoiceData.setCurrentRow(this.tableData[0])
                    this.tableDataTrackId=''
                }
            }      
        }
    },
    created(){
        this.signListCreated()
        this.rowClickFunebWarehousesListAble()
        this.managementMarkListCreated()
    },
    methods: {
        //重新加载 标记数据列表数据
        markReloadData: function (flag) {        
            if (flag) {
                this.managementMarkListCreated()
            }
        },
         updateData(val){
            if(val){
                this.querySpecialList()  
                this.chooseData.id=this.chooseData.id
            }
        },
        //控制运单跟踪模块div缩放
        showTrackWaybill(){
            this.trackWaybillVisible=!this.trackWaybillVisible
        },
        async signListCreated(){
            const { code, message,data } =await api.get('/mark/list')
            if(code == "200"){
                var signData=[]  
                data.forEach(val => {
                if(val.colorValue){
                    signData.push(val);
                }
                });
                this.signList=signData
            }
        },
          //Table 当表格的当前行发生变化的时候会触发该事件
        currentChangeFun(currentRow, oldCurrentRow){                
            if (currentRow) {
                //@点击当前行给track.js 的tableDataTrackId赋值
                this.tableDataTrackId=currentRow.waybillId
                this.chooseData.waybillNo=currentRow.waybillNo
                this.chooseData.waybillId=currentRow.waybillId
                if (currentRow.id) {
                    this.chooseData.id = currentRow.id
                }else{
                    this.chooseData.id=-1
                }
                this.chooseData.waybillStatus=currentRow.waybillStatus 
            }
        },
        async querySpecialList() {//获取页面初始数据    
            const { code, message,data } =await api.post('/eb/booking/list ', this.searchForm)
            if(code==="200"){
                if(data.records){
                    this.tableData = data.records;
                    this.page.total = data.total; 
                } 
            }
        },
        //所有电商平台列表
        async rowClickFunebWarehousesListAble() {
            const { code, message,data } =await api.get('/eb/warehouses/list/able')
            if(code==="200"){
                this.base.ebWarehouseId=data 
            }
        }  
    }
};
</script>

