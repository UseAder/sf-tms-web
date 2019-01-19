<template>
    <div>
        <div class="J-elTable-right-title ">送货预约登记</div>
        <div class="J-detail  J-inputBorder0 " style="padding:5px 5px 0 5px;"> 
            <el-row>
                <el-col :span="12">
                    <div class="labal">电商仓库</div>
                    <div class="input J-borderBot">{{bookingFindList.warehouseName}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="labal">电商平台</div>
                    <div class="input J-borderBot">{{bookingFindList.platformName}}</div>
                </el-col>
                <el-col :span="12">
                    <div class="labal">地址</div>
                    <div class="input ">{{bookingFindList.address}}</div>
                </el-col>                                                       
                <el-col :span="12">
                    <div class="labal">联系人</div>
                    <div class="input">{{bookingFindList.linkman}}</div>
                </el-col>  
                <el-col :span="24">
                    <div class="labal">电商订单号</div>
                    <div class="input J-borderTop J-flexSbc" style="padding:0 15px">
                        <span>
                            {{bookingFindList.customerOrderNo}}
                        </span>
                        <el-button  type="text" size="small" v-if="checkHasPermission('booking:read')" @click="showWaybillDetail()">查看清单</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-form  :rules="bookingRules" :model="bookingFindForm" ref="bookingFindForm" label-width="84px" :inline="true" style="padding-top: 6px;" class="demo-form-inline">
                <el-form-item label="预约号" prop='orderNo' class="select-status">
                    <el-input v-model="bookingFindForm.orderNo" style="width:355px" ></el-input>
                </el-form-item>
                <div>

                    <el-form-item label="预约时间" prop='orderDate'>
                        <el-date-picker 
                            value-format="yyyy-MM-dd"
                            v-model="bookingFindForm.orderDate"
                            type="date"                
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            align="right">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item prop='orderTimes' >
                        <el-select v-model="bookingFindForm.orderTimes" placeholder=" " >
                            <el-option
                                v-for="(item,index) in canOrderTimesOptions"
                                :key="index"
                                :label="item"
                                :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </div>
                
                <div class="J-flex textarea_checkbox">
                <el-form-item label="备注" prop="memo" >
                    <el-input style="width:355px" autosize type="textarea" v-model="bookingFindForm.memo"></el-input>
                </el-form-item> 
            </div>    
        </el-form>     
        <span class="dialog-footer" style="display: block; text-align: center;">
            <el-button type="primary" v-if="checkHasPermission('booking:create')" @click="bookingAdd('bookingFindForm')">保存预约</el-button>
            <el-button type="primary"  @click="bookingCancel('bookingFindForm')" v-if="waybillStatus && checkHasPermission('booking:delete')">取消预约</el-button>
        </span>
        <div class="J-trackMessage">
            <div class="J-trackMessage-body" :style="'max-height:'+(this.$store.getters.getScreenHeight-jElTableOffsetTop-264)+'px;'">
                <div  class="J-trackMessage-list"  v-for="(item,index) in bookingFindList.bookingTrackList" :key="item.index" >
                    <div class="J-trackMessage-bt" style="line-height: 27px;">
                        <div>
                            <div class="J-trackMessage-title-time">
                                第{{bookingFindList.bookingTrackList.length-index}}次预约： {{item.createTime}}， {{item.createEmployeeName}}
                            </div>
                            <div class="J-trackMessage-title-name" v-if="item.orderNo">预约号： {{item.orderNo}}</div>
                            <div class="J-trackMessage-title-name" v-if="item.orderTimes">预约时间： {{item.orderDate}},{{item.orderTimes}}</div>
                            <div class="J-trackMessage-title-name">{{item.memo}}</div>
                        </div>
                    </div>      
                </div>
            </div>
        </div>
         <el-dialog width="430px" title="取消预约" :visible.sync="bookingCancelvisiable" center >     
            <el-form ref="bookingCancelForm" :inline="true" :model="bookingCancelForm" class="demo-form-inline "  >    
                <el-form-item label="备注" prop="memo" >
                    <el-input type="textarea" style="width:330px"  placeholder="" :autosize="{ minRows: 2, maxRows: 3}" v-model="bookingCancelForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <span style="display: block; text-align: center;margin-top:10px">   
                <el-button type="primary" :loading="savingFlag"  @click="bookingCancelPreservation('bookingCancelForm')">保 存</el-button>
            </span>
        </el-dialog>
        <waybillNo-component :showFlag.sync='showWaybill.visible' :waybillNo='showWaybill.waybillNo' :statusText='showWaybill.statusText' :waybillId='showWaybill.waybillId' v-if="showWaybill.visible"></waybillNo-component>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue"
export default {
    mixins: [Base,List],
    props: ['waybillNo','waybillId','id','convertWaybillStatus'],
    components: {
        "waybillNo-component": waybillNoComponent,
    },
    data() {
        return {
            //定义convert对象 表示需要转换一个属性，因为每当父组件重新呈现时，该值都将被覆盖
            convert:{
                waybillStatus:''   
            },
            //预约时间段
            canOrderTimesOptions:[],
            //取消预约弹框
            bookingCancelvisiable:false,
            bookingFindList:{
                bookingTrackList:{}
            },
            //保存预约
            bookingFindForm:{
                id:'',
                waybillId:'',
                orderNo:'',
                orderDate:'',
                orderTimes:'',
                memo:''
            },
            //取消预约
            bookingCancelForm:{
                id:'',
                waybillId:'',
                memo:''
            },
    
            //查看清单
            showWaybill:{
                visible:false,
                waybillNo:'',
                waybillId:'',
                statusText:'',
            },
            bookingRules: {
                orderNo: [
                    { required: true, message: '请输入预约号',trigger: ['blur', 'change'] },
                ],
                orderDate: [
                    { required: true, message: '请选择预约时间',trigger: ['blur', 'change'] },
                ],
                orderTimes: [
                    { required: true, message: '请选择时间段',trigger: ['blur', 'change'] },
                ],
            }
        }
    },
    watch:{
        waybillNo () {
            if (this.waybillNo) {
                this.$refs['bookingFindForm'].resetFields();    
                if (this.id==-1) {
                    this.bookingRegisterDataCreated()   
                }  
                this.convert.waybillStatus=this.convertWaybillStatus

            }  
        },
        id () {    
            if (this.id!=-1) {        
            this.bookingRegisterDataCreated()  
           }   
        }
    },
    methods: {
        showWaybillDetail() {
            this.showWaybill.visible = true;
            this.showWaybill.waybillNo = this.waybillNo
            this.showWaybill.waybillId = this.waybillId
            this.showWaybill.statusText = this.waybillStatusTxt(this.convert.waybillStatus);

        }, 

        bookingAdd(formName){
            this.bookingFindForm.id=this.id
            this.bookingFindForm.waybillId=this.waybillId
            
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.bookingAddConfirm(formName)
                } else { 
                    return false;
                }
            });
        },
        bookingAddConfirm(formName){
            api.post('eb/booking/add',this.bookingFindForm).then((data)=>{
                if(data.code==="200"){
                    this.$message({
                    type: 'success',
                    message: '恭喜您，预约成功!'
                    });
                    this.$emit('upData', true)
                    if (this.id>0) {
                        this.bookingRegisterDataCreated()               
                    }
                    this.$refs[formName].resetFields();
                }   
            }) 
        }, 
        bookingCancel(formName){
            this.$refs[formName].resetFields();
            this.bookingCancelvisiable=true
        },
        bookingCancelPreservation(formName){
            if (!this.waybillNo) {
                this.$message({
                    type: 'error',
                    message: '暂无订单!'
                });
                return
            }
            this.savingFlag=true
            this.bookingCancelForm.id=this.id
            this.bookingCancelForm.waybillId=this.waybillId
            api.post('eb/booking/cancel',this.bookingCancelForm).then((data)=>{
                this.savingFlag=false
                if(data.code==="200"){
                    this.$message({
                    type: 'success',
                    message: '恭喜您，已取消预约!'
                    });
                    this.$emit('upData', true)
                    this.bookingRegisterDataCreated()            
                    this.$refs[formName].resetFields();
                    this.bookingCancelvisiable=false
                }
            })   
        },
        //获取页面初始数据    
        bookingRegisterDataCreated() {
            api.get('/eb/booking/find?id='+this.id+'&waybillId='+this.waybillId).then((data)=>{
                if(data.code==="200"){
                    this.bookingFindList = data.data;
                    this.canOrderTimesOptions=this.bookingFindList.canOrderTimes
                }
            })
        }
    }
};
</script>


<style>
    .J-trackMessage{
        min-height: 116px;
        box-sizing: border-box;
        padding: 0 15px;
       
    }
    .J-trackMessage-title{
        font-size: 18px;
    font-weight: 700;
    }
    .J-trackMessage-list{
        border-bottom: 1px solid #ebeef5;
        padding-bottom: 10px;
    }
    .J-trackMessage-bt{
        display: flex;
        line-height: 40px;
        justify-content: space-between;
    }
    .J-trackMessage-bt-left{
        display: flex;
    }
    .J-trackMessage-title-time{
        padding-right: 17px;
    }

    
</style>