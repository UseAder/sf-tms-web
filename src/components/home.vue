<template>
    <div class="home-container">
        <el-row :gutter="10" class="panel-group">
            <el-col :span="6" class="card-panel-col"  > 
                <div class="card-panel J-flexSbc" @click="pathJump('/Ways/magList','WaybillSMagListGl',{'status':'0'})">
                    <div class="card-panel-icon-wrapper ">
                        <img src="../assets/homefahuo.png" class="J-width100"/>

                    </div>
                    <div class="card-panel-description" >
                        <div class="card-panel-text">
                            今日发货
                        </div> 
                        <span class="card-panel-num">{{todayWaybillData.todayBillNum}}</span>
                    </div>
                </div>    
            </el-col>
            <el-col :span="6" class="card-panel-col"> 
                <div class="card-panel J-flexSbc" @click="pathJump('/Ways/magList','WaybillSMagListGl',{'status':'15'})">
                    <div class="card-panel-icon-wrapper ">
                        <img src="../assets/homezaitu.png" class="J-width100"/>

                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            今日在途
                        </div> 
                        <span class="card-panel-num">{{todayWaybillData.todayOnTheWayNum}}</span>
                    </div>
                </div>    
            </el-col>
            <el-col :span="6" class="card-panel-col"> 
                <div class="card-panel J-flexSbc" @click="pathJump('/Ways/magList','WaybillSMagListGl',{'status':'25'})">
                    <div class="card-panel-icon-wrapper ">
                        <img src="../assets/homeqianshou.png" class="J-width100"/>

                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            今日签收
                        </div> 
                        <span class="card-panel-num">{{todayWaybillData.todaySignNum}}</span>
                    </div>
                </div>    
            </el-col>
            <el-col :span="6" class="card-panel-col"> 
                <div class="card-panel J-flexSbc" @click="pathJump('/SendGoods/Exception','SendGoodsTrackAnomalyTrack',{})">
                    <div class="card-panel-icon-wrapper ">
                        <img src="../assets/homeyichang.png" class="J-width100"/>

                    </div>
                    <div class="card-panel-description">
                        <div class="card-panel-text">
                            今日异常
                        </div> 
                        <span class="card-panel-num">{{todayWaybillData.todayExceptionNum}}</span>
                    </div>
                </div>    
            </el-col>
        </el-row>
        
        <el-row :gutter="10" class="J-home-span8">
            <el-col :span="8">
                <div class="chart-wrapper">
                    <div class="J-toDoItemData toDoItemData-rq">
                        <div class="J-toDoItemData-title">
                            代办事项
                        </div>
                        <div class="J-toDoItemData-body">
                            <el-button class="J-toDoItemData-body-list" @click="addTab('/Exam/waybill')">
                                    <div class="J-toDoItemData-body-list-title">
                                        运单变更审核
                                    </div>
                                     <div class="J-toDoItemData-body-list-num">
                                        <el-button type="success">{{toDoItemData.waybillChangeNum}}</el-button>
                                    </div>   
                            </el-button>
                            <el-button class="J-toDoItemData-body-list"  @click="addTab('/Exam/scheduling')">
                                    <div class="J-toDoItemData-body-list-title">
                                        调度变更审核
                                    </div>
                                     <div class="J-toDoItemData-body-list-num">
                                        <el-button type="success">{{toDoItemData.dispatchChangeNum}}</el-button>
                                    </div>   
                            </el-button>
                            <el-button class="J-toDoItemData-body-list"  @click="addTab('/Exam/customer')">
                                    <div class="J-toDoItemData-body-list-title">
                                        客户开票审核
                                    </div>
                                     <div class="J-toDoItemData-body-list-num">
                                        <el-button type="success">{{toDoItemData.cusOpenTrickNum}}</el-button>
                                    </div>   
                            </el-button>
                            <el-button class="J-toDoItemData-body-list"  @click="addTab('/Exam/financial')">
                                    <div class="J-toDoItemData-body-list-title">
                                        财务结算审核
                                    </div>
                                     <div class="J-toDoItemData-body-list-num">
                                        <el-button type="success">{{toDoItemData.financeNum}}</el-button>
                                    </div>   
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8" >
                <div class="chart-wrapper">
                    <div class="J-toDoItemData">
                        <div class="J-toDoItemData-title">
                            今日发货占比（发货方）
                        </div>
                        <div class="todaySendGoodsMyChart-rq">
                            <div id="todaySendGoodsMyChart" ></div>   
                        </div>
                    </div>
                </div>
            </el-col>
            <el-col :span="8" >
                <div class="chart-wrapper" style="height:auto">
                    <div class="J-toDoItemData">
                        <div class="J-toDoItemData-title">
                            今日承运占比（承运方）
                        </div>
                        <div class="todayDispatchMyChart-rq">
                            <div id="todayDispatchMyChart" ></div>   
                        </div>
                    </div>
                </div>
            </el-col>
        </el-row>
        <div class="MagList" style="background:#fff;margin:0">
            <div class="homeMain-header"> 
                <div class="J-main-search">
                    <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                        <el-form-item label="统计日期" prop="createTime">
                            <el-date-picker
                                value-format="yyyy-MM-dd"
                                v-model="searchForm.createTime"
                                type="daterange"
                                :picker-options="pickerOptions"
                                range-separator="至"
                                start-placeholder="开始日期"
                                end-placeholder="结束日期"
                                align="right">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item class="J-main-search-button">
                            <!-- 重写了查询和重置方法 -->
                            <el-button type="primary" @click='handlesearch'>查询</el-button>
                            <el-button type="warning" @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
        <el-row style="background: rgb(255, 255, 255);">
            <div class=" searchWaybillMyChart-rq">
                <div id="searchWaybillMyChart"></div>
            </div>
        </el-row>
    </div>

</template>
<script>
import {mapGetters} from 'vuex'
import Base from '@/utils/base.js';
import api from "@/utils/api.js";
import Tab from "@/utils/tab.js";
  export default {
    mixins:[Tab,Base],
    computed:{
        //获取stroe 中 state的方法 相当于this.$store.getters.xx
        ...mapGetters([
            'getScreenWidth'
        ])
    },
    data() {
        return {
            todayDispatchMyChart:'',
            searchWaybillMyChart:'',

            searchForm:{
                createTime:[]
            },
            todayWaybillData:{},
            //代办事项
            toDoItemData:{
                cusOpenTrickNum:0,
                dispatchChangeNum:0,
                financeNum:0,
                waybillChangeNum:0
            },
            //今日发货占比
            todaySendGoods:[],
            //今日承运占比
            todayDispatch:[],

            searchWaybill:{
                //折线图定义了两个数组
                xAxisData:[],
                seriesData:[]
            },
            
        }
    },
    created(){
        this.todayWaybillDataFun()
        this.todaySendGoodsFun()   
        this.todayDispatchFun()
        this.searchWaybillFun()
        this.toDoItemDataFun()
    },
    mounted () {
         this.myChartreSizeChange()
    },
    watch:{
        "searchForm.createTime": function (val, oldval) {
            if (val !== null) {
                this.searchForm.beginBillTime = val[0];
                this.searchForm.endBillTime = val[1];
            }else{
                this.searchForm.beginBillTime = null;
                this.searchForm.endBillTime = null;
            }
        },
        'getScreenWidth':function(){
            this.myChartreSizeChange()
        }
    },
    methods: {

        // 路径跳转  (如果要实现路径跳转 需要在router.js设置要跳转的路径的 name,)
        pathJump(path,name,dataObj){
            this.$router.push({
                path:path,
                name:name,
                params: dataObj
            })
        },
        myChartreSizeChange(){
            let todaySendGoodsMyChartElement=document.getElementById('todaySendGoodsMyChart');
            let todaySendGoodsMyChartElementRq=document.getElementsByClassName("todaySendGoodsMyChart-rq")[0]; 
            this.resizeWorldMapContainer(todaySendGoodsMyChartElement,todaySendGoodsMyChartElementRq);
            //今日承运占比获取宽高
            let todayDispatchMyChartElement=document.getElementById('todayDispatchMyChart');
            let todayDispatchMyChartElementRq=document.getElementsByClassName("todayDispatchMyChart-rq")[0]; 
            this.resizeWorldMapContainer(todayDispatchMyChartElement,todayDispatchMyChartElementRq);
            //日期搜索统计获取宽高
            let searchWaybillMyChartElement=document.getElementById('searchWaybillMyChart');
            let searchWaybillMyChartElementRq=document.getElementsByClassName("searchWaybillMyChart-rq")[0]; 
            
            this.resizeWorldMapContainer(todaySendGoodsMyChartElement,todayDispatchMyChartElementRq);            
            if (this.todaySendGoodsMyChart) {
                  this.todaySendGoodsMyChart.resize();
            }
          
            this.resizeWorldMapContainer(todayDispatchMyChartElement,todayDispatchMyChartElementRq);
            if (this.todayDispatchMyChart) {
                this.todayDispatchMyChart.resize();
            }
            this.resizeWorldMapContainer(searchWaybillMyChartElement,searchWaybillMyChartElementRq);
            if (this.searchWaybillMyChart) {
                this.searchWaybillMyChart.resize();
            }
        },
        //今日开单,今日在途,今日签收,今日异常
        todayWaybillDataFun(){
            api.get('/today/waybill/data ').then(data=>{
                if (data.code === '200') {
                    if (data.data) {
                        this.todayWaybillData=data.data
                    }
                } 
            })
        } ,
        //当前员工代办事项
        toDoItemDataFun(){
            api.get('/to/do/item/data').then(data=>{
                if (data.code === '200') {
                    if (data.data) {
                         this.toDoItemData=data.data
                    }         
                } 
            })
        } ,
        //今日发货占比（发货方）
        todaySendGoodsFun(){
            api.get('/today/send/goods').then(data=>{
                if (data.code === '200') {
                    if (data.data!='') {
                        this.todaySendGoods= JSON.parse(JSON.stringify(data.data).replace(/consignorName/g, "name").replace(/waybillNum/g, "value"))                        
                        // 基于准备好的dom，初始化echarts实例
                        this.todaySendGoodsMyChart= this.$echarts.init(document.getElementById('todaySendGoodsMyChart'))
                        this.todayDispatchDrawLine(this.todaySendGoodsMyChart,this.todaySendGoods);
                    }   
                } 
            })
        },

        //今日承运占比（承运方）
        todayDispatchFun(){
            api.get('/today/dispatch ').then(data=>{
                if (data.code === '200') {
                    if (data.data!='') {
                        this.todayDispatch= JSON.parse(JSON.stringify(data.data).replace(/transferName/g, "name").replace(/transferNum/g, "value"))                        
                        // 基于准备好的dom，初始化echarts实例
                        this.todayDispatchMyChart= this.$echarts.init(document.getElementById('todayDispatchMyChart'))
                        this.todayDispatchDrawLine(this.todayDispatchMyChart,this.todayDispatch);
            
                   }  
                } 
            })
        },
        //日期搜索统计  单量统计 数据获取
        searchWaybillFun(){
            api.post('/search/waybill',this.searchForm).then(data=>{
                if (data.code === '200') {
                    if (data.data!='') {
                        this.searchWaybill.seriesData= data.data.map(function(a) {return a.waybillNum;});
                        this.searchWaybill.xAxisData= data.data.map(function(a) {return a.waybillTime;});
                        this.searchWaybillDrawLine()
                    }  
                } 
            })
        },
        //用于使chart自适应高度和宽度,通过窗体高宽计算
        resizeWorldMapContainer(echartsWarp,container){                    
            echartsWarp.style.width =container.clientWidth+'px';
            echartsWarp.style.height = container.clientHeight+'px';
        },
        //日期搜索统计  单量统计 折线图 
        searchWaybillDrawLine(){
            this.searchWaybillMyChart = this.$echarts.init(document.getElementById('searchWaybillMyChart'))   

            // 基于准备好的dom，初始化echarts实例
            // 绘制图表
            this.searchWaybillMyChart.setOption({
                title: {
                    text: ''
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                legend: {  selectedMode:false,},
                
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis : [
                    {
                        type : 'category',
                        boundaryGap : false,
                        data :this.searchWaybill.xAxisData
                    }
                ],
                yAxis : [
                    {
                        type : 'value'
                    }
                ],
                series : [
                    {
                        name:'单量',
                        type:'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        areaStyle: {normal: {}},
                        data:this.searchWaybill.seriesData
                    }
                ]
            });
        },
        //今日发货占比、承运占比饼图
        todayDispatchDrawLine(myChart,seriesData){
            // 绘制图表
            myChart.setOption({
              
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                legend: {
                    x : 'center',
                    y : 'bottom',
                    
                    // data:['rose1','rose2','rose3','rose4','rose5','rose6','rose7','rose8']
                },
                toolbox: {
                    show : true,
                    feature : {
                        mark : {show: true},
                        // dataView : {show: true, readOnly: false},
                        // restore : {show: true},
                        // saveAsImage : {show: true},
                        magicType : {
                            show: true,
                            type: ['pie', 'funnel']
                        }
                    }
                },
                calculable : true,
                series : [
                    {
                        name:'面积模式',
                        type:'pie',
                        radius : [20, 100],
                        center:['50%', '41%'],
                        roseType : 'area',
                        data:seriesData
                    }
                ]
            });
        },
        handlesearch() {//当前页 
            this.searchWaybillFun();
        },
        resetForm(formName) {
            //重置
            if(this.$refs[formName]){
                this.$refs[formName].resetFields();
                this.$nextTick(function(){//默认选中
                    this.searchWaybillFun()
                })
            }
        },
    }
  }
</script>

<style>
    
    .toDoItemData-rq{
            height: 310px;
    }
   .todaySendGoodsMyChart-rq{
       height: 279px;
    }
    .todayDispatchMyChart-rq{
            height: 279px;
    }
    .searchWaybillMyChart-rq{
        height: 366px;
    }
    .card-panel{
        padding: 0 45px 0 45px
    }
    .card-panel-icon-wrapper{
        height: 50px;width: 50px;
    }




    .J-toDoItemData{
        padding: 15px;
    }
    .J-toDoItemData-title{
        border-bottom: 1px solid #dcdfe6;
        padding-bottom: 9px;
        color: rgba(0,0,0,.45);
        font-size: 16px;
        font-weight: 700;
    }
    .J-toDoItemData-body-list{
        height: 46px;
        margin-top: 11px;
        color: rgba(0,0,0,.55);
        width: 100%;
        position: relative;
        text-align: left
    }

    .J-toDoItemData-body-list-num{
        position: absolute;right: 5px;
        top:8px;
        /* width: 20px;
        height: 20px; */
    }
    .J-toDoItemData-body-list-num button{
        padding: 5px 8px;
    }
    .J-toDoItemData-body .el-button+.el-button {
        margin-left: 0px;
    }



    .home-container{
               padding: 12px 10px;
  
    height: 100%;
    background-color: #f0f2f5;
        
    }
    .panel-group .card-panel-col{
        margin-bottom:10px
    }
    .panel-group .card-panel-col .card-panel{
        height: 108px;
        cursor: pointer;
        font-size: 12px;
        position: relative;
        overflow: hidden;
        color: #666;
        background: #fff;
        -webkit-box-shadow: 4px 4px 40px rgba(0,0,0,.05);
        box-shadow: 4px 4px 40px rgba(0,0,0,.05);
        border-color: rgba(0,0,0,.05);
    }
    .panel-group .card-panel .card-panel-description {
        text-align: center;
        float: right;
        font-weight: 700;
        margin: 26px 26px 26px 0;
    }
    .panel-group .card-panel .card-panel-description .card-panel-text{
        line-height: 18px;
        color: rgba(0,0,0,.45);
        font-size: 16px;
        margin-bottom: 12px;
    }
    .panel-group .card-panel .card-panel-description .card-panel-num{
    font-size: 20px;color: #F56C6C
    }

    .chart{
        height: 350px;
        width: 100%;
        -webkit-tap-highlight-color: transparent;
        user-select: none;
        position: relative;
    }

   .chart-wrapper {
    background: #fff;
        margin-bottom: 3px;
    height: 100%;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    position: relative;
    }
    .chart-table {
    background: #fff;
    margin-bottom: 32px;
    height: 400px;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
    user-select: none;
    position: relative;
}
</style>