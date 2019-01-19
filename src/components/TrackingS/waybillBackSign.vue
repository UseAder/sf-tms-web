<template>
    <div>
        <el-dialog :title="title" :visible.sync="isShow" 
            @close="$emit('update:pVisible', false)"
            :close-on-click-modal="false"
            width="1210px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh">    
            <div class="J-detail J-inputBorder0 J-yx-error J-dialog-vh-body" > 
                <el-row>
                    <el-col :span="48">
                        <div class="labal">开单日期</div>
                        <div class="input J-borderBot">{{waybill.billTime?waybill.billTime:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">运单号</div>
                        <div class="input J-borderBot">{{waybill.waybillNo?waybill.waybillNo:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">发站</div>
                        <div class="input J-borderBot">{{waybill.beginSiteName?waybill.beginSiteName:''}}</div>
                    </el-col>
                    <el-col :span="48" >
                        <div class="labal">到站</div>
                        <div class="input J-borderBot">{{waybill.endSiteName?waybill.endSiteName:''}}</div>
                    </el-col>
                    <el-col :span="48">
                    <div class="labal">发货单位</div>
                        <div class="input J-borderBot">{{waybill.consignorName?waybill.consignorName:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">收货单位</div>
                        <div class="input J-borderBot">{{waybill.consigneeName?waybill.consigneeName:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">收货人</div>
                        <div class="input  J-borderBot">{{waybill.consigneeLinkman?waybill.consigneeLinkman:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">收货地址</div>
                        <div class="input  J-borderBot">{{waybill.consigneeAddress?waybill.consigneeAddress:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">货物名称</div>
                        <div class="input J-borderBot">{{waybill.goodsName?waybill.goodsName:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">包装</div>
                        <div class="input J-borderBot">{{waybill.pack?waybill.pack:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">回单要求</div>
                        <div class="input">{{waybill.receipt?receiptType(waybill.receipt):''}}, {{waybill.receiptNum?waybill.receiptNum:'0'}}份</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal">预约日期</div>
                        <div class="input">{{waybill.openTime?waybill.openTime:''}}</div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal"></div>
                        <div class="input "></div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal"></div>
                        <div class="input"></div>
                    </el-col>
                    <el-col :span="48">
                        <div class="labal"></div>
                        <div class="input"></div>
                    </el-col>
                </el-row>
            </div>
            <div  class="J-table-input"  id="J-elTable">
                <el-table
                    :max-height="getScreenHeight-jElTableOffsetTop>111?getScreenHeight-jElTableOffsetTop:'none'" 
                    :data="goodsList"
                    style="width: 100%" border show-summary
                    :summary-method="sumSignData">
                    <el-table-column fixed type="index" width="50" label="序号" align='center' ></el-table-column>
                    <el-table-column prop="customerOrderNo" label="订单号" width="100" align="center"></el-table-column>
                    <el-table-column prop="productName" label="品名" width="140" align="center"></el-table-column>
                    <el-table-column prop="skuNo" label="编码型号" width="100" align="center"></el-table-column>
                    <el-table-column prop="num" label="原实发" width="70" align="center"></el-table-column>
                    <el-table-column prop="signNum" label="原实收" width="70" align="center"></el-table-column>
                    <el-table-column prop="backNum" label="退货实发" width="70"  align="center"></el-table-column>
                    <el-table-column prop="signBackNum" label="退货实收" width="70"  align="center">
                        <template slot-scope="scope">
                            <el-input v-model.number="scope.row.signBackNum"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="异常" width="70" align="center">
                        <template slot-scope="scope">
                            <el-tooltip :content="scope.row.hasException==1?'有异常':'无异常'" placement="top">
                                <el-switch
                                    v-model="scope.row.hasException"
                                    active-value=1
                                    inactive-value=0>
                                </el-switch>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                    <el-table-column label="异常原因" align="center" min-width="120" >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.backExceptionReason"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="责任方" width="95" align="center">
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.backDutyPersonType" clearable>
                                <el-option
                                    v-for="item in base.dutyPersonType"
                                    :key="item.value"
                                    :label="item.code"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="50" align="center">
                        <template slot-scope="scope">
                            <el-button type="text" @click="allSignClick(scope.row)" size="small">全收</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <span  style="display: block; text-align: center;margin-top:18px">
                <el-button type="primary" @click="saveSign" :loading="savingFlag">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
    export default {
        mixins: [Base,List],
        props: ['pVisible','waybillId'],
        data() {
            return {
                title:'退货签单实收',
                signForm:{
                    waybillId:-1,
                    sbgList:[]
                },
                //货物清单，表格编辑时，数据实时反馈至此
                goodsList:[],
                //运单信息
                waybill:{},
                isShow:this.pVisible,
                savingFlag:false,
            }
        },
        watch: {
            pVisible () {
                this.isShow =this.pVisible
            }　　　　
        },
        methods: {
            /**
             * 保存签收
             */
            saveSign() {

                if (this.savingFlag) {
                    return;
                }

                this.$confirm('确定要【保存】签收实收信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    center: true
                }).then(async() => {

                    //数据处理 goodsList
                    this.signForm.waybillId = this.waybillId
                    this.signForm.sbgList = []
                    this.goodsList.forEach( g => {
                        this.signForm.sbgList.push({
                            goodsListId:g.goodsListId,
                            signBackNum:g.signBackNum,
                            hasException:g.hasException,
                            backExceptionReason:g.backExceptionReason,
                            backDutyPersonType:g.backDutyPersonType
                        })
                    })

                    const { code, message, data } = await api.post('/waybill/back/sign',this.signForm)
                    if(code == '200') {
                        this.$emit('update:pVisible', false)
                        this.$message({type: 'success',message: '退货签收实收登记成功!'});
                    }

                     this.savingFlag = false;
                }).catch(() => {
                })
            },
            /**
             * 数据加载
             */
            async loadData() {
                const { code, message, data } =await api.get('/waybill/back/sign/goodslist?id=' + this.waybillId)
                if(code == '200') {
                    this.waybill = data.waybill
                    this.goodsList = data.wglbsList

                    this.title = '退货签单实收-' +this.waybill.waybillNo
                }
            },
            allSignClick(row) {
                row.signBackNum = row.backNum
            },

            sumSignData(param) {//合计
                const { columns, data } = param; 
                const sums = [];
                columns.forEach((column, index) => {
                if (index === 1) {
                    sums[index] = '合计';
                    return; 
                }
                const values = data.map(item => Number(item[column.property]));
                const arr=['num','signNum','backNum','signBackNum']
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
        },
        created() {
              this.signForm.sbgList = []
                this.loadData()
        }
    }
</script>