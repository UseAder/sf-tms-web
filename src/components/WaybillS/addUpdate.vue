<template>
    <div>
        <div class="waybill_detail_top" v-if="addForm.id==null">
            <div class="waybill_detail_top_list"></div>
            <div class="waybill_detail_top_list">
                <span>货 物 托 运 单</span>
                <div class="chuxian"></div>
            </div>
            <div class="waybill_detail_top_list">经办人：<span class="jinbanr">{{this.$store.getters.userName}}</span></div>
        </div>
        <div class="Invoice">
                <el-form ref="addForm" :model="addForm" :rules="addFormRules"  status-icon :show-message=false>
                <div class="borderc">
                    <div class="from-hd">
                        <el-form-item label="开单日期 ："  prop="billTime"  class="J-label-small">
                            <el-date-picker class="el-form-item" :clearable=false ref="billTime" v-model="addForm.billTime" type="date" placeholder="">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="运单号 ："  prop="waybillNo">
                            <el-input ref="waybillNo" placeholder="不输入自动生成"
                                        v-model="addForm.waybillNo" ></el-input>
                        </el-form-item>
                        <!-- <el-form-item label="委托单号 ："  prop="outWaybillNo">
                            <el-input ref="outWaybillNo" placeholder="委托单/回单号"
                                        v-model="addForm.outWaybillNo" ></el-input>
                        </el-form-item> -->
                        <el-form-item label="发站 ："  prop="beginSiteName">
                             <el-input ref="beginSiteName" placeholder=""
                                        v-model="addForm.beginSiteName" ></el-input>
                        </el-form-item>
                        <el-form-item label="到站 ："  prop="endSiteName">
                             <el-input ref="endSiteName" placeholder=""
                                        v-model="addForm.endSiteName" ></el-input>
                        </el-form-item>
                        <el-form-item label="业务类别 ："  prop="businessType" class="J-label-small">
                            <el-select ref="businessType"
                                    v-model="addForm.businessType" automatic-dropdown placeholder="">
                                <el-option
                                        v-for="item in base.businessTypeOptions"
                                        :key="item.value"
                                        :label="item.code"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="电商仓库 ："  prop="ebWarehouseId" class="J-label-small">
                            <el-select ref="ebWarehouseId" filterable clearable
                                    @change="changeWarehouse"
                                    v-model="addForm.ebWarehouseId" automatic-dropdown placeholder="">
                                <el-option
                                        v-for="item in base.ebWarehouseList"
                                        :key="item.id"
                                        :label="item.warehouseName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        </div>
                        <div  class="from-hd-receive J-flex">
                            <div class="from-hd-receive-collect">
                            <div class="collect-left">
                                <div>
                                    <span>
                                    <img src="../../assets/ren.png">
                                </span>
                                    <span>发货方</span>
                                </div>
                            </div>
                            <div class="collect-right">
                                <el-form-item label="发货单位 ：" prop="consignorName" class="J-label-small">
                                    <el-autocomplete ref="consignorName"
                                                    value-key="name"
                                                    select-when-unmatched
                                                    hide-loading
                                                    popper-class="my-autocomplete"
                                                    v-model="addForm.consignorName"
                                                    placeholder="可以通过 发货人名称 或 手机号查询"
                                                    :fetch-suggestions="querySearchConsignor"
                                                    @select="handleSelectConsignor">
                                        <template slot-scope="{ item }">
                                            <div class="J-autocomplete J-flex">
                                                <span class="J-autocomplete-name">{{ item.name }}</span>
                                                <span class="J-autocomplete-linkman">{{ item.linkman }}</span>
                                                <span class="J-autocomplete-linkmanMobile">{{ item.linkmanMobile }}</span>
                                                <span class="J-autocomplete-address">{{ item.address }}</span>
                                            </div>
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                                <div class="J-collect-shouji J-flex">
                                    <el-form-item label="发货人 ：" prop="consignorLinkman" class="J-label-small">
                                    <el-input ref="consignorLinkman" v-model="addForm.consignorLinkman" ></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号 ：" prop="consignorLinkmanMobile" >
                                    <el-input ref="consignorLinkmanMobile" v-model="addForm.consignorLinkmanMobile"></el-input>
                                    </el-form-item>
                                </div>
                                <div class="J-flex">
                                     <el-form-item label="发货地址 ：" prop="consignorSSQ" class="J-label-small">
                                        <div class="J-collect J-flex">
                                            <div class="J-collect-left">
                                                <el-cascader
                                                    placeholder="可以 输入地区名称查询"
                                                    :options="area.areaOptions"
                                                    :props="area.areaProps"
                                                    filterable
                                                    clearable
                                                    v-model="area.selectedConsignorSSQ"
                                                    @change="handleConsignorSSQChange">
                                                </el-cascader>
                                            </div>
                                        
                                        </div>
                                    </el-form-item>
                                    <el-form-item prop="consignorAddress" class="J-width100">
                                        <div class="J-collect-right">
                                            <el-input ref="consignorAddress" v-model="addForm.consignorAddress" placeholder="详细地址"></el-input>
                                        </div>
                                    </el-form-item>   
                                </div>
                                
                            </div>
                        </div>
                        <div class="from-hd-receive-hair">
                            <div class="hair-left">
                                <div>
                                    <span>
                                    <img src="../../assets/sh.png">
                                </span>
                                    <span>收货人</span>
                                </div>

                            </div>
                            <div class="hair-right">
                                <el-form-item label="收货单位 ：" prop="consigneeName" class="J-label-small">
                                    <el-autocomplete ref="consigneeName"
                                        value-key="name"
                                        select-when-unmatched
                                        hide-loading
                                        popper-class="my-autocomplete"
                                        v-model="addForm.consigneeName"
                                        :fetch-suggestions="querySearchConsignee"
                                        placeholder="可以通过 收货人名称 或 手机号查询"
                                        @select="handleSelectConsignee">
                                        <template slot-scope="{ item }">
                                            <div class="J-autocomplete J-flex">
                                                <span class="J-autocomplete-name">{{ item.name }}</span>
                                                <span class="J-autocomplete-linkman">{{ item.linkman }}</span>
                                                <span class="J-autocomplete-linkmanMobile">{{ item.linkmanMobile }}</span>
                                                <span class="J-autocomplete-address">{{ item.address }}</span>
                                            </div>
                                            
                                        </template>
                                    </el-autocomplete>
                                </el-form-item>
                                
                                <div class="J-collect-shouji J-flex">
                                    <el-form-item label="收货人 ：" prop="consigneeLinkman" class="J-label-small">
                                        <el-input ref="consigneeLinkman" v-model="addForm.consigneeLinkman" ></el-input>
                                    </el-form-item>
                                    <el-form-item label="手机号 ：" prop="consigneeLinkmanMobile">
                                    <el-input ref="consigneeLinkmanMobile" v-model="addForm.consigneeLinkmanMobile" ></el-input>
                                    </el-form-item>
                                </div>
                                <div class="J-flex">
                                    <el-form-item label="收货地址 ：" prop="consigneeSSQ" class="J-label-small">
                                        <div class="J-collect J-flex">
                                            <div class="J-collect-left">
                                                <el-cascader
                                                placeholder="可以 输入地区名称查询"
                                                :options="area.areaOptions"
                                                :props="area.areaProps"
                                                filterable
                                                clearable
                                                v-model="area.selectedConsigneeSSQ"
                                                @change="handleConsigneeSSQChange">
                                                </el-cascader>
                                            </div>
                                        </div>
                                    </el-form-item>
                                    <el-form-item prop="consigneeAddress"  class="J-width100">
                                        <div class="J-collect-right">
                                                <el-input ref="consigneeAddress" v-model="addForm.consigneeAddress" placeholder="详细地址"></el-input>
                                            </div>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="from-bd-nav J-flex">
                        <el-form-item label="货物名称 ：" prop="goodsName" class="J-label-small">
                            <el-autocomplete
                                ref="goodsName"
                                value-key="goodsName"
                                select-when-unmatched
                                v-model="addForm.goodsName"
                                @select="handleGoodsNameSelect"
                                :fetch-suggestions="queryGoodsNameSearch">
                                <template slot-scope="{ item }">
                                    <span style="float: left;">{{ item.goodsName }}</span>
                                    <span style="float: right; color: #8492a6; font-size: 13px;text-align: right;">{{ item.pack }}</span>
                                </template>
                            </el-autocomplete>
                        </el-form-item>
                        <el-form-item label="包装方式 ：" prop="pack" class="J-label-small">
                            <el-select ref="pack"
                                    v-model="addForm.pack" automatic-dropdown placeholder="">
                                <el-option
                                        v-for="item in base.packOptions"
                                        :key="item.name"
                                        :label="item.name"
                                        :value="item.name">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="件数 ：" prop="goodsNum">
                            <el-input ref="goodsNum"
                                    v-model.number="addForm.goodsNum"></el-input>
                        </el-form-item>
                        <el-form-item label="单品数 ：" prop="productNum">
                            <el-input ref="productNum"
                                    v-model="addForm.productNum"></el-input>
                        </el-form-item>
                        <el-form-item label="重量(kg) ：" prop="goodsWeight" class="J-label-small">
                            <el-input ref="goodsWeight"
                                    v-model.number="addForm.goodsWeight"></el-input>
                        </el-form-item>
                        <el-form-item label="体积(m³) ：" prop="goodsBulk" class="J-label-small">
                            <el-input ref="goodsBulk"
                                    v-model.number="addForm.goodsBulk"></el-input>
                        </el-form-item>
                    </div>
                    <div class="from-bd J-flex">
                        <div class="from-bd-total">
                            <div class="total-top">
                                <span class="xain" ></span>
                            <img src="../../assets/qian.png"> <span>合计 : ￥<b class="red">{{ totalFee }}</b>元</span>
                            </div>
                            <div class="total-bottom ">
                                <el-form-item label="运费 ：" prop="specialFee">
                                    <el-input ref="specialFee"
                                            v-model.number="addForm.specialFee"></el-input>
                                </el-form-item>
                                <el-form-item label="提货费 ：" prop="pickFee">
                                    <el-input ref="pickFee"
                                            v-model.number="addForm.pickFee"></el-input>
                                </el-form-item>
                                <el-form-item label="送货费 ：" prop="deliverFee">
                                    <el-input ref="deliverFee"
                                            v-model.number="addForm.deliverFee"></el-input>
                                </el-form-item>
                                <el-form-item label="装货费 ：" prop="loadFee">
                                    <el-input ref="loadFee"
                                            v-model.number="addForm.loadFee"></el-input>
                                </el-form-item>
                                <el-form-item label="卸货费 ：" prop="unloadFee">
                                    <el-input ref="unloadFee"
                                            v-model.number="addForm.unloadFee"></el-input>
                                </el-form-item>
                                <el-form-item label="上楼费 ：" prop="upFee">
                                    <el-input ref="upFee"
                                            v-model.number="addForm.upFee"></el-input>
                                </el-form-item>
                                <el-form-item label="进仓费 ：" prop="instoreFee">
                                    <el-input ref="instoreFee"
                                            v-model.number="addForm.instoreFee"></el-input>
                                </el-form-item>
                                <el-form-item label="仓储费 ：" prop="storeFee">
                                    <el-input ref="storeFee"
                                            v-model.number="addForm.storeFee"></el-input>
                                </el-form-item>
                                <el-form-item label="申明价值 ：" class="J-mode-bottom-label4 J-label-small" prop="goodsValue">
                                    <el-input ref="goodsValue"
                                            v-model.number="addForm.goodsValue"></el-input>
                                </el-form-item>
                                <el-form-item label="保价费 ：" prop="insuranceFee">
                                    <el-input ref="insuranceFee"
                                            v-model.number="addForm.insuranceFee"></el-input>
                                </el-form-item>
                                <el-form-item >
                                   
                                </el-form-item>
                                <el-form-item >
                                    
                                </el-form-item>
                            </div>
                        </div>

                        <div class="from-bd-mode">
                            <div class="mode-top">
                                <span class="xain" ></span>
                                <img src="../../assets/fukuan.png"><span>付款方式</span>
                            </div>
                            <div class="mode-bottom ">
                                <el-form-item label="付款方式 ：" prop="payType" class="mode-bottom-fkfs J-label-max">
                                    <el-select ref="payType"
                                            v-model.number="addForm.payType" automatic-dropdown placeholder="">
                                        <el-option
                                                v-for="item in base.payTypeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="现付 ：" prop="xfFee">
                                    <el-input ref="xfFee"
                                            :disabled="viewData.xfFeeDisable"
                                            v-model.number="addForm.xfFee"></el-input>
                                </el-form-item>

                                <el-form-item label="到付 ：" prop="dfFee">
                                    <el-input ref="dfFee"
                                            :disabled="viewData.dfFeeDisable"
                                            v-model.number="addForm.dfFee"></el-input>
                                </el-form-item>

                                <el-form-item label="回付 ：" prop="hfFee">
                                    <el-input ref="hfFee"
                                            :disabled="viewData.hfFeeDisable"
                                            v-model.number="addForm.hfFee"></el-input>
                                </el-form-item>
                                <el-form-item label="月结 ：" prop="yjFee">
                                    <el-input ref="yjFee"
                                            :disabled="viewData.yjFeeDisable"
                                            v-model.number="addForm.yjFee"></el-input>
                                </el-form-item>
                                <el-form-item label="回扣 ：" prop="hkFee">
                                    <el-input ref="hkFee"
                                            v-model.number="addForm.hkFee"></el-input>
                                </el-form-item>
                            </div>
                        </div>
                        <div class="from-bd-collection">
                            <div class="collection-top">
                                <span class="xain" ></span>
                                <img src="../../assets/dsk.png"><span>代收款</span>
                            </div>
                            <div class="collection-bottom ">
                                <el-form-item label="代收款 ：" prop="goodsFee">
                                    <el-input ref="goodsFee"
                                            v-model.number="addForm.goodsFee"></el-input>
                                </el-form-item>
                                <el-form-item label="手续费 ：" prop="goodsServiceFee">
                                    <el-input ref="goodsServiceFee"
                                            v-model.number="addForm.goodsServiceFee"></el-input>
                                </el-form-item>
                                <el-form-item ></el-form-item>
                            </div>
                        </div>
                    </div>   


                    <div class="from-md J-flex">
                        <div class="widthleft">
                            <el-form-item label="交接方式 ：" prop="deliveryType" class="J-label-small">
                                <el-select ref="deliveryType"
                                        v-model="addForm.deliveryType" automatic-dropdown placeholder="">
                                    <el-option
                                            v-for="item in base.deliveryTypeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="需要提货 ：" prop="pickFlag" class="J-label-max">
                                <el-select ref="pickFlag"
                                        v-model="addForm.pickFlag" automatic-dropdown placeholder="">
                                    <el-option
                                            v-for="item in base.pickTypeOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <div class="J-flex J-dzhd-num" style="width: 158px;" >
                                <el-form-item  prop="receipt" class="J-el-form-item-receipt">
                                <el-select ref="receipt"
                                        v-model.number="addForm.receipt" automatic-dropdown placeholder="">
                                    <el-option
                                            v-for="item in base.receiptMagListgl"
                                            :key="item.value"
                                            :label="item.code"
                                            :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item  prop="receiptNum">
                                 <el-input ref="receiptNum" class="return-input" v-model.number="addForm.receiptNum">
                                        <i slot="suffix">份</i>
                                </el-input>
                            </el-form-item>
                            </div>
                            
                            
                            <el-form-item label="要求发货时间 ：" prop="requireSendTime"  class="J-el-form-item-picke">
                                <el-date-picker class="el-form-item " ref="requireSendTime"  prop="requireSendTime" v-model="addForm.requireSendTime" type="date" placeholder="">
                                </el-date-picker>
                            </el-form-item>
                             <el-form-item label="要求到货时间 ："  prop="requireArriveTime"  class="J-el-form-item-picke">
                                <el-date-picker class="el-form-item " ref="requireArriveTime"  prop="requireArriveTime" v-model="addForm.requireArriveTime" type="date" placeholder="">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="业务员 ："  prop="buEmployeeId" class="J-el-form-item-bEmployeeName">
                                <el-select ref="buEmployeeId" clearable
                                        v-model="addForm.buEmployeeId" automatic-dropdown placeholder="">
                                    <el-option
                                            v-for="item in base.buEmployeeList"
                                            :key="item.id"
                                            :label="item.name"
                                            :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>

                        <div class="from-md J-flex">
                        </div>

                        <div class="widthright">
                            <el-form-item label="备注 ：" prop="memo">
                                <el-input ref="memo"
                                        v-model="addForm.memo"></el-input>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <el-form-item class="from-fd-anniu J-flexCc">
                    <div class="tool-button ">
                        <el-button v-if="addForm.id==null && checkHasPermission('waybill:create')" type="primary" :loading="savingFlag" icon="el-icon-news"  @click="submitWaybill(1)">保存并新增</el-button>
                        <el-button type="primary" :loading="savingFlag" icon="el-icon-tickets" v-if="checkHasPermission('waybill:create')"  @click="submitWaybill(0)">保存</el-button>
                    </div>
                    <div>
                    </div>
                </el-form-item>
            </el-form>
        </div>
        <!-- 修改提示框 -->
        <el-dialog title="修改原因/审核"
            :visible.sync="dialog.waybillModifyVisible"
            width="40%"
            center
            :modal=false
            :close-on-click-modal=false
            @open="openEventWaybillModifyDialog"
            @close="closeEventWaybillModifyDialog">
            <el-form label-width="90px">
                <el-form-item label="修改原因：">
                    <el-input ref="reason" v-model="addForm.reason"></el-input>
                </el-form-item>
                <el-form-item label="审核人：" v-if="dialog.waybillModifyVisible" >
                    <v-auditorSelect @auditorSelect='selectAuditEmployee'></v-auditorSelect> 
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer" >
                <el-button @click="dialog.waybillModifyVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveWaybill(0)" :loading="savingFlag">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import Base from "@/utils/base.js"
import Tab from "@/utils/tab.js"
import api from '@/utils/api'
import areaData from '@/utils/area_tree'
import moment from 'moment'
import auditorSelect from '@/widget/auditorSelect'
export default {
    name:'w-addapdate',
    mixins: [Base,Tab],
    props: ['waybillId', 'showFlag','reloadListFlag'],
    components: {    
        'v-auditorSelect':auditorSelect
    },
    data() {
        return {
            addForm: {
                id:this.waybillId,
                waybillNo: '', outWaybillNo: '', billTime:'', beginSiteName:'',endSiteName:'',businessType:1,ebWarehouseId:'',
                consignorId:'',consignorName: '', consignorLinkman: '', consignorLinkmanMobile: '', consignorProvinceId:'', consignorCityId:'', consignorCountyId:'',consignorAddress: '',
                consigneeName: '', consigneeLinkman: '', consigneeLinkmanMobile: '', consigneeProvinceId:'', consigneeCityId:'', consigneeCountyId:'', consigneeAddress: '',
                goodsName: '', pack:'无', goodsNum:1, goodsWeight:'', goodsBulk:'',productNum:'',
                specialFee:'', pickFee:'', deliverFee:'', loadFee:'',unloadFee:'', upFee:'', instoreFee:'', storeFee:'',
                goodsValue:'', insuranceFee:'', goodsFee:'',goodsServiceFee:'',
                payType:'', xfFee:'', dfFee:'', hfFee:'', yjFee:'',hkFee:'',
                deliveryType:2,pickFlag:0,fastFlag:'',receipt:1,receiptNum:0,requireSendTime:'',requireArriveTime:'',
                buEmployeeId:'',memo:'',
                reason:'',
                auditEmployeeIds:[]//审核人员Tags
            },
            addFormRules: {
                billTime: [
                    { required: true, message: '请选择开单日期', trigger: 'change' }
                ],
                beginSiteName: [
                    { required: true, message: '请输入发站', trigger: 'change' },
                    { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                endSiteName: [
                    { required: true, message: '请输入到站', trigger: 'change' },
                    { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                consignorLinkmanMobile: [
                    { validator: this.linkmanMobileRules,trigger: ['blur', 'change'] }     
                ],
                consigneeLinkmanMobile: [
                    { validator: this.linkmanMobileRules,trigger: ['blur', 'change'] }     
                ],
                goodsName: [
                    { required: true, message: '请输入货物名称', trigger: 'change' },
                    { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                goodsNum: [
                    { type: 'number', required: true, message: '请输入货物件数', trigger: 'blur' }
                ],
                consignorName: [
                    { required: true, message: '请输入发货单位', trigger: 'change' },
                    { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                consigneeName: [
                    { required: true, message: '请输入收货单位', trigger: 'change' },
                    { min: 1, max: 50, message: '长度在 1 到 20 个字符', trigger: 'change' }
                ],
                deliveryType: [
                    { required: true, message: '请选择交接方式', trigger: 'change' }
                ],
                payType: [
                    { required: true, message: '请选择支付方式', trigger: 'change' }
                ]
            },
            base:{
                payTypeOptions: [{value: 1, label: '现付'}, {value: 2, label: '到付'}, {value: 3, label: '回付'}, {value: 4, label: '月结'}],
                deliveryTypeOptions:[{value: 1, label: '自提'}, {value: 2, label: '送货'}],
                pickTypeOptions:[{value: 0, label: '否'}, {value: 1, label: '是'}],
                packOptions: [],
                goodsNameOptions: [],
                consignorList: [],
                consigneeList: [],
                buEmployeeList:[],
                ebWarehouseList:[]
            },
            area:{
                areaOptions: areaData.dataAll,
                areaProps:{ value: 'id',label:'areaName', children: 'childAreaList'},
                selectedConsignorSSQ:[], // 发货地址省市区选择
                selectedConsigneeSSQ:[], // 收货地址省市区选择
            },
            viewData: {
                xfFeeDisable : false,
                dfFeeDisable : false,
                hfFeeDisable : false,
                yjFeeDisable : false,
                qfFeeDisable : false,
            }, 
            dialog:{
                waybillModifyVisible:false
            },
            savingFlag:false,
        }
    },
    filters: {
        // dateformat(dataStr, pattern = 'YYYY-MM-DD HH:mm:ss') {
        //     return moment(dataStr).format(pattern)
        // }
    },
    computed: {
        totalFee: function () {
            /*v.toFixed(2)*/

            return(Number(this.addForm.specialFee ? this.addForm.specialFee : 0) 
                 + Number(this.addForm.pickFee ? this.addForm.pickFee : 0) 
                 + Number(this.addForm.deliverFee ? this.addForm.deliverFee : 0) 
                 + Number(this.addForm.loadFee ? this.addForm.loadFee : 0) 
                 + Number(this.addForm.unloadFee ? this.addForm.unloadFee : 0) 
                 + Number(this.addForm.upFee ? this.addForm.upFee : 0) 
                 + Number(this.addForm.storeFee ? this.addForm.storeFee : 0) 
                 + Number(this.addForm.instoreFee ? this.addForm.instoreFee : 0) 
                 + Number(this.addForm.insuranceFee ? this.addForm.insuranceFee : 0)
                 );
        },
        totalFeePayType: function () {
            /*v.toFixed(2)*/
            return Number(this.addForm.xfFee ? this.addForm.xfFee : 0) 
                 + Number(this.addForm.dfFee ? this.addForm.dfFee : 0) 
                 + Number(this.addForm.hfFee ? this.addForm.hfFee : 0) 
                 + Number(this.addForm.yjFee ? this.addForm.yjFee : 0)
        }
    },
    watch: {
        totalFee: function(val,oldval){
            this.changeFeeOrPayType()
        },
        'addForm.payType': function (val,oldval) {
            this.changeFeeOrPayType()
        },
    },
    methods: {
        /**
         * 审核人员选择回调事件
         */
        selectAuditEmployee(employeeList) {
            var eIds = employeeList.map( (v,i) => v.id)
            this.addForm.auditEmployeeIds = eIds
        },
        //仓库改变
        changeWarehouse(val) {
            let wh = this.base.ebWarehouseList.find((w)=> w.id == val)
            if (wh) {
                this.addForm.consigneeName=wh.warehouseName
                this.addForm.consigneeLinkman = wh.linkman
                this.addForm.consigneeLinkmanMobile = wh.linkmanMobile
                this.addForm.consigneeAddress = wh.address
                if (wh.countyId) {
                    this.area.selectedConsigneeSSQ = [wh.provinceId,wh.cityId,wh.countyId]
                    this.addForm.consigneeProvinceId = wh.provinceId
                    this.addForm.consigneeCityId = wh.cityId
                    this.addForm.consigneeCountyId = wh.countyId
                } else {
                    this.area.selectedConsigneeSSQ = []
                }
            }
        },
        changeFeeOrPayType () {
            //在费用变化后或者在支付方式变化后要联动修改费

            this.addForm.xfFee = ''
            this.addForm.dfFee = ''
            this.addForm.hfFee = ''
            this.addForm.yjFee = ''

            this.viewData.xfFeeDisable = true
            this.viewData.dfFeeDisable = true
            this.viewData.hfFeeDisable = true
            this.viewData.yjFeeDisable = true

            switch (this.addForm.payType) {
                case 1 : {
                    this.addForm.xfFee = this.totalFee
                    this.viewData.xfFeeDisable = false
                }break
                case 2 : {
                    this.addForm.dfFee = this.totalFee
                    this.viewData.dfFeeDisable = false
                }break
                case 3 : {
                    this.addForm.hfFee = this.totalFee
                    this.viewData.hfFeeDisable = false
                }break
                case 4 : {
                    this.addForm.yjFee = this.totalFee
                    this.viewData.yjFeeDisable = false
                }break
                default: {
                    this.viewData.xfFeeDisable = false
                    this.viewData.dfFeeDisable = false
                    this.viewData.hfFeeDisable = false
                    this.viewData.yjFeeDisable = false
                    this.viewData.qfFeeDisable = false
                }
            }
        },
        /**
         * 获取发货方信息-下拉框
         */
        async querySearchConsignor(queryString, cb) {
            const { code, data, message } = await api.get('/consignor/list/ddl?word=' + queryString)
            if (code === '200') {
                this.base.consignorList = data;
            } else {
                this.base.consignorList = [];
            }
            cb(this.base.consignorList);
        },
        /**
         * 下拉事件-获取发货方信息-下拉框
         */
        handleSelectConsignor(item) {
            if (item.id)  {
                this.addForm.consignorId = item.id
                this.addForm.consignorLinkmanMobile = item.linkmanMobile
                this.addForm.consignorAddress = item.address
                this.addForm.consignorLinkman = item.linkman
                if (item.countyId) {
                    this.area.selectedConsignorSSQ = [item.provinceId,item.cityId,item.countyId]
                    this.addForm.consignorProvinceId = item.provinceId
                    this.addForm.consignorCityId = item.cityId
                    this.addForm.consignorCountyId = item.countyId
                }
                this.loadGoodNameOptions()
            }
        },
        /**
         * 获取收货方信息-下拉框
         */
        querySearchConsignee(queryString, cb) {
            api.get('/consignee/list/ddl?word=' + queryString).then(data=>{
                if (data.code === '200') {
                    this.base.consigneeList = data.data;
                } else {
                    this.base.consigneeList = [];
                }
                cb(this.base.consigneeList);
            })
        },
        /**
         * 下拉事件-获取收货方信息-下拉框
         */
        handleSelectConsignee(item) {
            //在未选择建议项时，item的内容为输入的数据，而不是列表内容
            if (item.linkmanMobile)  {
                this.addForm.consigneeLinkman = item.linkman
                this.addForm.consigneeLinkmanMobile = item.linkmanMobile
                this.addForm.consigneeAddress = item.address
                if (item.countyId) {
                    this.area.selectedConsigneeSSQ = [item.provinceId,item.cityId,item.countyId]
                    this.addForm.consigneeProvinceId = item.provinceId
                    this.addForm.consigneeCityId = item.cityId
                    this.addForm.consigneeCountyId = item.countyId
                }
            }
        },
        /**
         * 加载货物名称
         */
        loadGoodNameOptions() {
            api.get('/consignor/goods/list/ddl?consignorId=' + this.addForm.consignorId).then(data=>{
                this.base.goodsNameOptions = data.data;
            })
        },
        /**
         * //发货方地址选择
         */
        handleConsignorSSQChange(value) {
            if (value.length > 0)  {
                this.addForm.consignorProvinceId = value[0]
                this.addForm.consignorCityId = value[1]
                this.addForm.consignorCountyId = value[2]
            } else {
                this.addForm.consignorProvinceId = null
                this.addForm.consignorCountyId = null
                this.addForm.consignorCityId = null
            }
        },
        /**
         * //收货方地址选择
         */
        handleConsigneeSSQChange(value) {
            if (value.length > 0)  {
                this.addForm.consigneeProvinceId = value[0]
                this.addForm.consigneeCityId = value[1]
                this.addForm.consigneeCountyId = value[2]
            } else {
                this.addForm.consigneeProvinceId = null
                this.addForm.consigneeCountyId = null
                this.addForm.consigneeCityId = null
            }
        },
        queryGoodsNameSearch(queryString, cb){
            let results = this.base.goodsNameOptions
            cb(results);
        },
        /**
         * 货物名称选择
         */
        handleGoodsNameSelect(item) {
            if (item.pack) {
                this.addForm.pack = item.pack
                this.addForm.spec = item.spec
            }
        },

        /**
         * 修改运单审核窗口打开事件
         */
        async openEventWaybillModifyDialog() {
            //修改, 修改前检测是否需要介入审核选项-先不考虑这个判断
            // const { code, data, message } = await api.post('/waybill/edit/check?id='+this.addForm.id)
            // if (code === '200') {
            //     if (data == true) {
            //         //需要审核，显示选择审核流程选择
            //         //TODO:: 显示选择审核流程选择
            //     }
            // }
        },
        closeEventWaybillModifyDialog(){
            this.addForm.reason = ''
        },
        /**
         * 保存运单
         *  action   按钮类型
         */
        submitWaybill(action) {

            this.$refs.addForm.validate((valid, object) => {
                let validFlag = valid;
                let msg = "";
                if (!valid) {
                    for (let key in object){
                        msg = msg + object[key][0].message + "；";
                    }
                }

                if (this.totalFee !== this.totalFeePayType) {
                    msg = msg + "运费合计(" + this.totalFee + ") 和 现/到/回/月 付合计(" + this.totalFeePayType + ")不一致）,请调整费用!";
                    if (validFlag) {
                        validFlag = false;
                    }
                }

                //电商进仓
                if (this.addForm.businessType == 2 && !this.addForm.ebWarehouseId) {
                    msg = msg + "选择进仓业务时，必须同时选择电商仓库!";
                    if (validFlag) {
                        validFlag = false;
                    }
                }

                if (!validFlag)  {
                    this.$message({showClose: true, message: msg, type: 'error'});
                    return false;
                }
                
                if ( this.addForm.id > 0) {
                    //显示填写修改原因
                    this.addForm.auditEmployeeIds=[]
                    this.dialog.waybillModifyVisible = true
                } else {
                    this.saveWaybill(action)
                }
            });
        },
        /**
         * 
         */
        saveWaybill(action) {

            if (this.savingFlag) {
                return;
            }

            this.$confirm('确定要【保存】运单, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                center: true
            }).then(async() => {
                this.savingFlag = true

                if(this.addForm.id==null) {
                    //新增
                    const { code, data, message } = await api.post('/waybill/add', this.addForm)
                    if (code === '200') {
                        if (action === 1) {
                            //重置Form表单
                            this.resetWaybillForm()
                        } else {
                            //跳转到列表
                            this.addTab('/Ways/magList')
                        }
                        this.$message({showClose: true, message: message, type: 'success'});
                    }
                } else {
                    
                    let nextFlag = false;

                    //检测是否需要强制进行审核
                    const result = await api.post('/waybill/edit/check?id='+this.addForm.id)
                    if (result.code === '200') {
                        if (result.data == true) {
                            //需要审核，
                            if (this.addForm.auditEmployeeIds.length == 0 ) {
                                this.$message.error({message: '运单修改时需要审核，请选择审核人员！'});
                            } else {
                                nextFlag = true;
                            }
                        } 
                    }

                    if (nextFlag) {
                        const { code, data, message } = await api.post('/waybill/edit', this.addForm)
                        if (code === '200') {
                            //关闭弹窗
                            this.dialog.waybillModifyVisible = false
                            //更新列表
                            this.$emit('update:reloadListFlag', true)
                            //关闭运单修改界面
                            this.$emit('update:showFlag', false)
                            this.$message({showClose: true, message: message, type: 'success'});
                        }
                    }
                }

                this.savingFlag = false;
            }).catch(() => {
            })
        },
        loadData() {

            //加载业务员信息
            api.get('/emp/ddl/list').then(data=>{
                this.base.buEmployeeList = data.data;
            })
            //加载包装方式
            api.get('/ent/set/operative/package/list').then(data=>{
                this.base.packOptions = data.data;
            })

            //加载电商仓库
            api.get('/eb/warehouses/list/able').then(data=>{ 
                this.base.ebWarehouseList = data.data;
            })

            if(this.addForm.id == null) {
                //重新赋值，触发watch，确保按照支付方式禁用其他输入框
                this.addForm.payType = 4
                this.addForm.billTime = moment(new Date()).format('YYYY-MM-DD')
            } else {
                //加载运单信息
                api.get('/waybill/detail?waybillId=' + this.addForm.id).then(data=>{
                    this.addForm.waybillNo=data.data.waybillNo
                    // this.addForm.outWaybillNo=data.data.outWaybillNo  
                    this.addForm.beginSiteName=data.data.beginSiteName
                    this.addForm.endSiteName=data.data.endSiteName
                    this.addForm.businessType=data.data.businessType
                    this.addForm.ebWarehouseId=data.data.ebWarehouseId
                    this.addForm.billTime=data.data.billTime
                    this.addForm.consignorId=data.data.consignorId
                    this.addForm.consignorName=data.data.consignorName
                    this.addForm.consignorLinkman=data.data.consignorLinkman
                    this.addForm.consignorLinkmanMobile=data.data.consignorLinkmanMobile
                    this.addForm.consignorProvinceId=data.data.consignorProvinceId
                    this.addForm.consignorCityId=data.data.consignorCityId
                    this.addForm.consignorCountyId=data.data.consignorCountyId
                    this.addForm.consignorAddress=data.data.consignorAddress
                    this.addForm.consigneeName=data.data.consigneeName
                    this.addForm.consigneeLinkman=data.data.consigneeLinkman
                    this.addForm.consigneeLinkmanMobile=data.data.consigneeLinkmanMobile
                    this.addForm.consigneeProvinceId=data.data.consigneeProvinceId
                    this.addForm.consigneeCityId=data.data.consigneeCityId
                    this.addForm.consigneeCountyId=data.data.consigneeCountyId
                    this.addForm.consigneeAddress=data.data.consigneeAddress
                    this.addForm.goodsName=data.data.goodsName
                    this.addForm.pack=data.data.pack
                    this.addForm.goodsNum=data.data.goodsNum
                    this.addForm.productNum=data.data.productNum
                    this.addForm.goodsWeight=data.data.goodsWeight
                    this.addForm.goodsBulk=data.data.goodsBulk
                    this.addForm.spec=data.data.spec
                    this.addForm.specialFee=data.data.specialFee
                    this.addForm.pickFee=data.data.pickFee
                    this.addForm.deliverFee=data.data.deliverFee
                    this.addForm.loadFee=data.data.loadFee
                    this.addForm.unloadFee=data.data.unloadFee
                    this.addForm.upFee=data.data.upFee
                    this.addForm.instoreFee=data.data.instoreFee
                    this.addForm.storeFee=data.data.storeFee
                    this.addForm.goodsValue=data.data.goodsValue
                    this.addForm.insuranceFee=data.data.insuranceFee
                    this.addForm.goodsFee=data.data.goodsFee
                    this.addForm.goodsServiceFee=data.data.goodsServiceFee
                    this.addForm.payType=data.data.payType
                    this.addForm.xfFee=data.data.xfFee
                    this.addForm.dfFee=data.data.dfFee
                    this.addForm.hfFee=data.data.hfFee
                    this.addForm.yjFee=data.data.yjFee
                    this.addForm.hkFee=data.data.hkFee
                    this.addForm.deliveryType=data.data.deliveryType
                    this.addForm.pickFlag=data.data.pickFlag
                    this.addForm.fastFlag=data.data.fastFlag
                    this.addForm.receipt=data.data.receipt
                    this.addForm.receiptNum=data.data.receiptNum
                    this.addForm.requireSendTime=data.data.requireSendTime
                    this.addForm.requireArriveTime=data.data.requireArriveTime
                    this.addForm.buEmployeeId=data.data.buEmployeeId
                    this.addForm.memo=data.data.memo

                    //特殊处理
                    this.area.selectedConsignorSSQ = [this.addForm.consignorProvinceId,this.addForm.consignorCityId,this.addForm.consignorCountyId];
                    this.area.selectedConsigneeSSQ = [this.addForm.consigneeProvinceId,this.addForm.consigneeCityId,this.addForm.consigneeCountyId];
                })
            }
        },
        resetWaybillForm() {
             this.$refs.addForm.resetFields()
             //不form-item下需要手动处理
             this.area.selectedConsignorSSQ = []
             this.area.selectedConsigneeSSQ = []
        }
    },
    created(){
        this.loadData()
    }
}
</script>

<style>

</style>
