
<template>
    <div class="MagList">
        <div class="J-main-body">
            <div class="J-detail"> 
                <!--货物信息设置-->
                <el-row>
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        货物信息设置
                    </div>
                    <div class="J-elTable" style="width:500px;margin-left:50px">
                        <el-table  :data="packageListTableData" border  >
                            <el-table-column fixed type="index" width="50" label="编号" align='center'></el-table-column>
                          
                            <el-table-column prop="name" label="类型名称"  align='center'></el-table-column>
                            <el-table-column fixed="right" label="操作" width="100" align='center'>
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" v-if="checkHasPermission('param:update')" @click="deletePackageList(scope.row)">删除</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                        <div class="J-system J-flexSbc">
                            <div class="J-system-left J-flexSbc"> 
                                <el-form ref="packageForm"  :rules="packageRules" :model="packageForm" class="J-from-el-form-item">
                                    <el-form-item  prop="name" class="J-el-form-item-syetem" style="margin-left:20px">
                                        <el-input v-model="packageForm.name" placeholder="包装类型名称"></el-input>
                                    </el-form-item>
                                </el-form>
                            </div>
                            <div style="width:100px;text-align:center">
                                <el-button type="primary" size="small" v-if="checkHasPermission('param:update')" @click="addPackageList('packageForm')">增加</el-button>
                            </div>
                        </div>
                    </div>
                </el-row>
                <!--异常设置-->
                <!-- <el-row>
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        异常设置
                    </div>
                    <div class="J-elTable" style="width:500px;margin-left:50px">
                        <el-table  :data="exceptionTypeListTableData" border  >
                            <el-table-column fixed type="index" width="50" label="编号" align='center'></el-table-column>
                          
                            <el-table-column prop="typeName" label="类型名称"  align='center'></el-table-column>
                            <el-table-column fixed="right" label="操作" width="100" align='center'>
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" v-if="checkHasPermission('param:update')"  @click="deleteExceptionTypeList(scope.row)">删除</el-button>
                                </template> 
                            </el-table-column>
                        </el-table>
                        <div class="J-system J-flexSbc">
                            <div class="J-system-left J-flexSbc"> 
                                <el-form ref="exceptionTypeForm"  :rules="exceptionTypeRules" :model="exceptionTypeForm" class="J-from-el-form-item">
                                    <el-form-item  prop="typeName" class="J-el-form-item-syetem" style="margin-left:20px">
                                        <el-input v-model="exceptionTypeForm.typeName" placeholder="异常类型名称"></el-input>
                                    </el-form-item>
                                </el-form>

                            </div>
                            <div style="width:100px;text-align:center">
                                <el-button type="primary" size="small"  v-if="checkHasPermission('param:update')" @click="addExceptionTypeList('exceptionTypeForm')">增加</el-button>
                            </div>
                        </div>
                    </div>
                </el-row> -->
                <!--审核设置-->
                <el-row>
                    <div class="J-detail-title">
                        <div class="J-detail-title-yuan"></div>
                        审核设置      
                    </div>
                    <div class="J-elTable" >
                        <el-form  :model="auditForm" class="demo-form-inline">
                            <el-form-item label="调度后，运单变更审核" label-width="200px">
                                <el-radio @change='updateAuditList' v-model="auditForm.waybillNeed" label="1">需要</el-radio>
                                <el-radio @change='updateAuditList' v-model="auditForm.waybillNeed" label="0">不需要</el-radio>
                            </el-form-item>
                            <el-form-item label="调度变更审核"  label-width="200px">
                                <el-radio @change='updateAuditList' v-model="auditForm.dispatchNeed" label="1">需要</el-radio>
                                <el-radio @change='updateAuditList' v-model="auditForm.dispatchNeed" label="0">不需要</el-radio>
                            </el-form-item>
                            <el-form-item label="开票审核" label-width="200px" >
                                <el-radio @change='updateAuditList' v-model="auditForm.invoiceNeed" label="1">需要</el-radio>
                                <el-radio @change='updateAuditList' v-model="auditForm.invoiceNeed" label="0">不需要</el-radio>
                            </el-form-item>
                            <el-form-item label="财务结算审核" label-width="200px">
                                <el-radio @change='updateAuditList' v-model="auditForm.balanceNeed" label="1">需要</el-radio>
                                <el-radio @change='updateAuditList' v-model="auditForm.balanceNeed" label="0">不需要</el-radio>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-row>
            </div>        
        </div>
         
    </div>
</template>

<script>
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    name:'c-system',
    mixins: [Base],
    data() {
        return {

            auditForm: {
                waybillNeed :'0',
                dispatchNeed :'0',
                invoiceNeed :'0',
                
                balanceNeed :'0'
            },
            //货物信息设置-包装类型table数据
            packageListTableData:[],
            //异常设置-异常类型table数据
            // exceptionTypeListTableData:[],
            //货物信息设置-包装类型传递fORM
            packageForm:{
                name:""
            },
            //异常设置-异常类型传递fORM
            // exceptionTypeForm:{
                // typeName:""
            // },
            packageRules:{
                name: [
                    { required: true, message: '请输入包装类型名称', trigger: 'blur' },
                ],
            },
            // exceptionTypeRules:{
            //     typeName: [
            //         { required: true, message: '请输入异常类型名称', trigger: 'blur' },
            //     ],
            // },
        };
        },

        created() {
            this.packageList()
            this.exceptionTypeList()     
            this.auditList() 
        },
        methods: {
            //货物信息设置-包装类型列表
            async packageList(){
                const { code, message,data } =await api.get('/ent/set/operative/package/list')
                if(code==="200"){
                    this.packageListTableData = data;
                }
            }, 
            //货物信息设置-包装类型删除
            async deletePackageList(row){
                const { code, message,data } =await api.post('/ent/set/operative/package/delete',{name:row.name})
                if(code==="200"){
                    this.$message({
                        type: 'success',
                        message: '恭喜您，该包装类型已删除'
                    });   
                    this.packageList()
                }   
            },
            //货物信息设置-包装类型新增
            addPackageList(formName){
                this.$refs[formName].validate(async(valid) => {
                    if (valid) {
                        const { code, message,data } =await api.post('/ent/set/operative/package/add',{name:this.packageForm.name})
                        if(code==="200"){
                            this.$message({
                                type: 'success',
                                message: '恭喜您，包装类型已新增'
                            });   
                            this.packageList()  
                            this.packageForm.name=''
                        }   
                    } else {   
                        return false;
                    }
                })

                
            },
            //异常设置-异常类型列表
            async exceptionTypeList(){
                const { code, message,data } =await api.get('/exception/type/list')
                if(code==="200"){
                    this.exceptionTypeListTableData = data;
                }
            },
            //异常设置-异常类型删除
            async deleteExceptionTypeList(row){
                const { code, message,data } =await api.post('/ent/set/operative/exception/delete',{name:row.typeName})
                if(code==="200"){
                    this.$message({
                        type: 'success',
                        message: '恭喜您，该异常类型已删除'
                    });   
                    this.exceptionTypeList()
                }   
            },
            //异常设置-异常类型新增
            async addExceptionTypeList(formName){
                this.$refs[formName].validate(async(valid) => {
                    if (valid) {
                        const { code, message,data } =await api.post('/ent/set/operative/exception/add',{name:this.exceptionTypeForm.typeName})
                        if(code==="200"){
                            this.$message({
                                type: 'success',
                                message: '恭喜您，异常类型已新增'
                            });   
                            this.exceptionTypeList()  
                            this.exceptionTypeForm.typeName=''
                        }   
                    } else {   
                        return false;
                    }
                })
            },
            //审核设置
            async auditList(){
                const { code, message,data } =await api.get('/ent/set/audit/list')
                if(code=="200"){
                    this.auditListTableData = data;
             
                    this.auditForm.waybillNeed = data.waybillNeed+"";
                    this.auditForm.dispatchNeed = data.dispatchNeed+"";
                    this.auditForm.invoiceNeed = data.invoiceNeed+"";
                    this.auditForm.balanceNeed = data.balanceNeed+"";
                 
                }
            }, 
            //审核设置-更改
            async updateAuditList(){
                const { code, message,data } =await api.post('/ent/set/audit/update',this.auditForm)
                if(code==="200"){
                    this.$message({
                        type: 'success',
                        message: '恭喜您，审核设置已更新'
                    });   
                    this.auditList()  
                }   
            },

        }
  };
</script>


<style>
.J-system{
    border: 1px solid #ebeef5;height: 47px;
    border-top: 0;box-sizing: border-box
}
.J-system-left{
   height: 47px;box-sizing: border-box;
    line-height: 46px;
    text-align: right;
}
.J-system-left input{
   width: 170px;
}
</style>
