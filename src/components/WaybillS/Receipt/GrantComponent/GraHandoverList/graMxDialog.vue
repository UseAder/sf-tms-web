
<template>
    <div>
        <el-dialog :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="1200px" center class="Maglist-HairCar">          
            <el-form  label-width="82px" class="demo-ruleForm J-flexRc " >
                 <el-form-item label="清单备注："   >
                    <div class="J-flex " >
                        <div class="input J-qdmemo">{{pcMemo}}</div>
                    </div>
                </el-form-item>                          
            </el-form>  
            <div class="J-elTable">
                <el-table  :data="tableData" border @selection-change="handleSelectionChange" class="table-checkboxLabel">
                    <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column> 
                    <el-table-column prop="waybillNo" label="运单号" min-width="110" align='center'>
                        <template slot-scope="scope">
                        <el-button @click="showWaybill(scope.row)" type="text" size="small">{{ scope.row.waybillNo }}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column prop="billTime" label="开单日期" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consignorName" label="发货单位" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="consignorLinkman" label="发货人" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="transferName" label="承运商" min-width="110" align='center'></el-table-column>
                    <el-table-column prop="receiptStatus" label="回单状态"  min-width="100" align='center'>
                        <template slot-scope="scope">
                            <div v-html="statusBackground(receiptStatus(scope.row.receiptStatus))" class="J-statusBackground"></div>     
                        </template>
                    </el-table-column>
                    <el-table-column prop="receiptNum" label="回单份数" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="memo" label="备注说明" min-width="200" align='center'></el-table-column>
                    <el-table-column prop="goodsName" label="货物名称" min-width="110" align='center'></el-table-column>       
                    <el-table-column prop="goodsNum" label="件数" min-width="100" align='center'></el-table-column>   
                    <el-table-column prop="goodsWeight" label="重量" min-width="100" align='center'></el-table-column>
                    <el-table-column prop="goodsBulk" label="体积" min-width="100" align='center'></el-table-column>       
                </el-table>  
            </div>

            <div class="J-detail-title">
                <div class="J-detail-title-yuan"></div>
                凭证上传
            </div>
            <div class="J-flexSbc">                   
                <el-upload action=""
                    multiple
                    list-type="picture-card"
                    :on-preview="handleFilePictureCardPreview"
                    :on-remove="handleFileRemove"
                    :file-list="fileListView"
                    :http-request="uploadFile">
                    <i class="el-icon-plus"></i>
                </el-upload>
            </div>
        </el-dialog>

        <el-dialog append-to-body center width="90%" :title="imgViewDialog.title" :visible.sync="imgViewDialog.visible">
            <img width="100%" :src="imgViewDialog.imageUrl" alt="">
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
import Base from "@/utils/base.js";
import api from '@/utils/api.js';
const OSS = require('ali-oss');
import waybillNoComponent from "@/components/Common/WaybillDetails/waybillNoComponent.vue";

export default {
    mixins: [Base],
    props: ['dialog','isContent','updateRow'],
    components: { 
         "waybillNo-component": waybillNoComponent,
    },
    data() {
        return { 
            isDialog: this.dialog,
            newModifyTitle:'交接清单明细',
            tableData:[],
            pcMemo:'',
             //运单详情框
            openWaybill: {
                waybillNo: "",
                waybillId: "",
                statusText: "",
                visiable: false,
            },

            //upload
            fileListView:[],
            imgViewDialog:{
                visible:false,
                imageUrl:'',
                title:''
            },
        }
    },
   
    methods:{
        showWaybill(row) {
            this.openWaybill.waybillNo = row.waybillNo
            this.openWaybill.waybillId = row.waybillId
            this.openWaybill.statusText = this.waybillStatusTxt(row.waybillStatus);
            this.openWaybill.visiable = true;
        },

        //图片上传
        handleFileRemove(file, fileList) {
            api.post('/file/delete?id=' + file.dataId).then(data=>{
                if(data.code=='200'){
                    this.fileListView = fileList;
                    this.$notify({message: file.name + '文件删除成功!',type: 'success'}); 
                }   
            })
        },
        handleFilePictureCardPreview(file) {
            this.imgViewDialog.imageUrl = file.bigUrl
            this.imgViewDialog.visible = true
            this.imgViewDialog.title = file.name
        },
        uploadFile(param) {
            
            let file = param.file
            api.get('/file/oss/sign/w').then(result => {
                var creds = result.data;
                var client = new OSS({
                    accessKeyId: creds.accessKeyId,
                    accessKeySecret: creds.accessKeySecret,
                    stsToken: creds.securityToken,
                    bucket: creds.bucketName
                })

                let pos = file.name.lastIndexOf('.'), suffix = '';
                if (pos != -1) {
                    suffix = file.name.substring(pos)
                }
                let timestamp = new Date().getTime();
                let tmpFileName = timestamp + suffix;

                client.multipartUpload(creds.rootPath + '/' + tmpFileName, file,
                    //进度条 
                    {progress:function(event){
                        param.file.percent = Math.floor(event * 100)
                        param.onProgress(param.file)
                    }}
                ).then(res => {

                    let bigUrl = creds.endpoint + '/' + res.name
                    let fileView = {name:file.name, url: bigUrl + '?x-oss-process=image/resize,m_fill,h_200,w_200', bigUrl: bigUrl};
                    this.fileListView.push(fileView);

                    //上传成功后直接提交服务端保存
                    let ad = { dataId:this.updateRow.id, 
                                dataType:2, 
                                originalName:tmpFileName,
                                name:file.name,
                                url:res.name,
                                size:file.size,
                                format:file.type
                            }
                    api.post('/file/save', ad).then(data=>{
                        if(data.code=='200'){
                            fileView.dataId = data.data
                            this.$notify({message: file.name + '文件上传成功!',type: 'success'});
                        }   
                    })
                }).catch(error => {
                    this.$message({showClose: true, message: error.message, type: 'error'});
                });
            });
        },
        //列表加载
        loadData(){

            this.pcMemo=this.updateRow.memo

            api.get('/receipt/pc/detail?pcId='+this.updateRow.id).then(result=>{
                if(result.code==="200"){
                    this.tableData = result.data;
                }   
            });

            this.fileListView=[];
            api.get('/file/list?type=2&id='+ this.updateRow.id ).then(result=>{
                if(result.code=='200'){
                    //图片
                    if (result.data && result.data.length > 0) {
                        result.data.forEach(file => {
                            let fileView = {
                                dataId:file.id,
                                name: file.name,
                                url: file.url + '?x-oss-process=image/resize,m_fill,h_200,w_200',
                                bigUrl: file.url
                            };
                            this.fileListView.push(fileView);
                        });
                    }
                }
            })
        }
    },
    created () {
        this.loadData()
    }
}          
</script>