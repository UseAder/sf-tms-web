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
                        <el-form-item label="异常状态" prop="status">
                            <el-select v-model="searchForm.status"  multiple collapse-tags clearable placeholder="请选择" class="J-width100">
                                <el-option
                                    v-for="item in base.anomalyTrackStatus"
                                    :key="item.value"
                                    :label="item.code"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="运单号" prop="waybillNo">
                            <el-input v-model="searchForm.waybillNo" placeholder="运单号"></el-input>
                        </el-form-item>
                        <el-form-item label="发货单位" prop="consignorName">
                            <el-input v-model="searchForm.consignorName" placeholder="发货单位"></el-input>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <el-button type="primary" v-if="checkHasPermission('back_exception:read')" @click='handlesearch'>查询</el-button>
                            <el-button type="warning" v-if="checkHasPermission('back_exception:read')" @click="resetForm('searchForm')">重置</el-button>
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
                        <v-backGoodsExceptionaWaybill @upData="updateData" :waybillNo.sync='chooseData.waybillNo' :waybillId.sync='chooseData.waybillId' :id.sync='chooseData.id'></v-backGoodsExceptionaWaybill>
                    </div>
                </div>    
                <div class="J-elTable-left" id="J-elTable">
                    <el-table :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  ref="defaultChoiceData" highlight-current-row :data="tableData" border @current-change="currentChangeFun">
                        <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                        <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                            <template slot-scope="scope">
                            <div class="table-menu">
                                <el-menu  :collapse="true" >
                                <el-submenu index="1" >
                                    <template slot="title" >
                                    <i class="el-icon-edit-outline"></i>
                                    </template>
                                    <el-submenu index="2">
                                        <span slot="title">标记</span>
                                        <div class="J-flexW" style="width:156px;padding: 0 5px;">
                                            <div v-for="item in managementMark.managementMarkList" :key="item.id" @click="mark(item.id, scope.row,6)">
                                                <el-tooltip 
                                                    class="item"
                                                    effect="dark"
                                                    :content="item.memo"
                                                    placement="top" style="margin:0 3px">
                                                    <div class="el-color-picker__trigger" style="height: 25px;width: 25px;">
                                                    <span class="el-color-picker__color is-alpha">
                                                        <span
                                                        class="el-color-picker__color-inner"
                                                        :style="'background-color:'+item.colorValue+';margin-right:3px;width:100%;height:100%'"
                                                        ></span>
                                                    </span>
                                                    </div>
                                                </el-tooltip>
                                            </div>
                                        </div>
                                        <el-menu-item index="2-5" @click="managementMarkFun" style="text-align: center;padding-left: 40px;">管理</el-menu-item>
                                    </el-submenu>
                                </el-submenu> 
                                </el-menu>
                            </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="标记" min-width="80" align="center">
                            <template slot-scope="scope">
                            <div>
                                <el-tooltip
                                v-for="mark in scope.row.marks"
                                :key="mark.id"
                                class="item"
                                effect="dark"
                                :content="mark.memo"
                                placement="top"
                                >
                                <i class="iconfont icon-zhuyi" :style="'color:'+ mark.colorValue+';margin:0 1px;'"></i>
                                {{mark.colorValue}}
                                </el-tooltip>
                            </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="status" label="异常状态" min-width="110" align='center'>
                             <template slot-scope="scope">
                                <div v-html="statusBackground(anomalyTrackStatus(scope.row.status))" class="J-statusBackground"></div>     
                            </template>
                        </el-table-column>
                        <el-table-column prop="createTime" label="异常日期" min-width="180" align='center'></el-table-column>
                        <el-table-column prop="content" label="异常描述"  min-width='110' align='center'></el-table-column>
                        <el-table-column prop="waybillNo" label="运单号" min-width="110" align='center'>
                        <template slot-scope="scope">
                        <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                        </template> 
                        </el-table-column>
                        <el-table-column prop="billTime" label="开单日期" width="110" align='center'></el-table-column>
                        <el-table-column prop="consignorName" label="发货单位" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="beginSiteName" label="发站" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="endSiteName" label="到站" min-width="110" align='center'></el-table-column>
                        <el-table-column prop="goodsNum" label="单品数" min-width="110" align='center'>
                             <template slot-scope="scope">
                                {{showProductNumFun(scope.row)}}
                             </template>
                        </el-table-column>
                        <el-table-column  prop="backProductNum" label="退货数" min-width="110" align='center'></el-table-column>
                        <el-table-column  prop="" label="退货率" min-width="110" align='center'>
                            <template slot-scope="scope">
                                 {{showBackGoodsRate(scope.row)}}
                            </template>
                        </el-table-column>
                       
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
             <waybillNo-component
        :showFlag.sync="openWaybill.visiable"
        :waybillNo="openWaybill.waybillNo"
        :statusText="openWaybill.statusText"
        :waybillId="openWaybill.waybillId"
        v-if="openWaybill.visiable"
      ></waybillNo-component>
        </div>
        <v-managementMark  @reloadData="markReloadData"  :dialog.sync='managementMark.visiable' v-if="managementMark.visiable" ></v-managementMark>
    </div>
</template>


<script>
import List from "@/utils/list.js";
import Track from "@/utils/track.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import managementMarkDialog from '@/components/Common/managementMark.vue'
import backGoodsExceptionaWaybill from './BackGoodsExceptionaWaybill/backGoodsExceptionaWaybill.vue'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    name:'e-s-backGoodsExceptionList',
    mixins: [Base,List,Track],
    components: { 
       'v-backGoodsExceptionaWaybill':backGoodsExceptionaWaybill,
        'v-managementMark':managementMarkDialog,
         "waybillNo-component": waybillNoComponent,
    },
    data() {
        return {   
        //选择运单时需要传递的数据
        chooseData:{
            waybillNo:'',
            waybillId:'',
            id:'',
        }, 
        searchForm: { //客户对账 查询   
            createTime:[],
            startBillTime:'',
            endBillTime:'',
            status:'',
            waybillNo:'',
            consignorName:'',
            pageSize: 10,
            pageNo: 1,
            type:2
        },
        tableData: [], //专线对账 表格
        multipleSelection: [], //多选
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
                this.searchForm.startBillTime = val[0];
                this.searchForm.endBillTime = val[1];
            }else{
                this.searchForm.startBillTime = null;
                this.searchForm.endBillTime = null;
            }
        }
    },  
    created(){
        this.managementMarkListCreated()
        },
    methods: {
        //重新加载 标记数据列表数据
        markReloadData: function (flag) {        
            if (flag) {
                this.managementMarkListCreated()
            }
        },
        showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.waybillId
            this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
            this.openWaybill.visiable = true;
        }, 
        updateData(val){
            if(val){
            this.querySpecialList()
            }
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
            if(currentRow){
                //@点击当前行给track.js 的tableDataTrackId赋值
                this.tableDataTrackId=currentRow.id
                this.chooseData.waybillNo=currentRow.waybillNo
                this.chooseData.waybillId=currentRow.waybillId            
                this.chooseData.id=currentRow.id 
            }
                      
        },
        async querySpecialList() {//获取页面初始数据    
            const { code, message,data } =await api.post('/goods/track/back/list', this.searchForm)
            if(code==="200"){
                if(data.records){
                    this.tableData = data.records;
                    this.page.total = data.total; 
                } 
            } 
        },
        //显示单品数量.如果没有单品数.显示货物数量
        showProductNumFun(row){
            if(row.productNum != 0 && row.productNum != null){
                return row.productNum;
            }else{
                return row.goodsNum;
            }
        },
          //计算退货率
        showBackGoodsRate(row){
            if(row.productNum != 0 && row.productNum != null){
                return (row.backProductNum/row.productNum).toFixed(3);
            }else{
                return (row.backProductNum/row.goodsNum).toFixed(3);
            }
        }
    }

};
</script>