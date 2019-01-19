<template>
    <div>
        <el-dialog title="凭证上传" :visible.sync="dialog.visible" @close="$emit('update:pVisible', false)"
             width="900px" center class="Maglist-HairCar J-el-dialog__body J-dialog-vh" append-to-body>     
            <el-tabs v-model="activeName" type="card" @tab-click="tabClick" class="J-width100 J-uploadFiles  J-dialog-vh-body" id='J-elTable' :style="'min-height:'+(getScreenHeight-jElTableOffsetTop)+'px;max -height:'+(getScreenHeight-jElTableOffsetTop)+'px'">
                <el-tab-pane label="签单上传" name="qdTab">
                    <div class="J-flexSbc" style='margin-top:20px' @click="checkDataIdFun">                   
                        <el-upload action=""
                        :disabled="flag"
                         
                           multiple
                           list-type="picture-card"
                           :on-preview="handleFilePictureCardPreview"
                           :on-remove="handleFileRemove"
                           :file-list="qdFile.fileListView"
                           :http-request="uploadFile">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="运单/明细上传" name="ydmxTab">
                    <div class="J-flexSbc" style='margin-top:20px'>                   
                        <el-upload action=""
                           multiple
                           list-type="picture-card"
                           :on-preview="handleFilePictureCardPreview"
                           :on-remove="handleFileRemove"
                           :file-list="ydmxFile.fileListView"
                           :http-request="uploadFile">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="承运单上传" name="cydTab">
                    <div class="J-flexSbc" style='margin-top:20px'>                   
                        <el-upload action=""
                           multiple
                           list-type="picture-card"
                           :on-preview="handleFilePictureCardPreview"
                           :on-remove="handleFileRemove"
                           :file-list="cydFile.fileListView"
                           :http-request="uploadFile">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="发货异常凭证上传" name="fhycTab">
                    <div class="J-flexSbc" style='margin-top:20px'>                   
                        <el-upload action=""
                           multiple
                           list-type="picture-card"
                           :on-preview="handleFilePictureCardPreview"
                           :on-remove="handleFileRemove"
                           :file-list="fhycFile.fileListView"
                           :http-request="uploadFile">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="退货异常凭证上传" name="thycTab">
                    <div class="J-flexSbc" style='margin-top:20px'>                   
                        <el-upload action=""
                           multiple 
                           list-type="picture-card"
                           :on-preview="handleFilePictureCardPreview"
                           :on-remove="handleFileRemove"
                           :file-list="thycFile.fileListView"
                           :http-request="uploadFile">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>
                <el-tab-pane label="其他凭证上传" name="qtTab">
                    <div class="J-flexSbc" style='margin-top:20px'>                   
                        <el-upload action=""
                           multiple
                           list-type="picture-card"
                           :on-preview="handleFilePictureCardPreview"
                           :on-remove="handleFileRemove"
                           :file-list="qtFile.fileListView"
                           :http-request="uploadFile">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </div>
                </el-tab-pane>

            </el-tabs>
        </el-dialog>
        <el-dialog append-to-body center width="90%" :title="imgViewDialog.title" :visible.sync="imgViewDialog.visible">
            <img width="100%" :src="imgViewDialog.imageUrl" alt="">
        </el-dialog>
    </div>
</template> 
<script>
import List from "@/utils/list.js";

import Base from "@/utils/base.js";
import api from '@/utils/api.js'
const OSS = require('ali-oss');
export default {
    mixins: [Base,List],
     
    props: ['pVisible','pTabName','pWaybillId'],
    data() {
        return {
            activeName: 'qdTab',
            currentTab:'',
            dialog:{
                visible:this.pVisible
            },
            qdFile:{
                fileListView: []
            },
            ydmxFile:{
                fileListView: []
            },
            cydFile:{
                fileListView: []
            },
            fhycFile:{
                fileListView: []
            },
            thycFile:{
                fileListView: []
            },
            qtFile:{
                fileListView: []
            },
            
            imgViewDialog:{
                visible:false,
                imageUrl:'',
                title:''
            },
            flag:false
        }
    },
    //弹框出现  
    watch: { 
        pVisible() {
            this.dialog.visible = this.pVisible
            if(this.pTabName){
                this.activeName=this.pTabName
            }
        }, 
    },
    methods:{
        checkDataIdFun(){
            console.log(this.pWaybillId );
            
            if(this.pWaybillId == '' || this.pWaybillId == null){
                this.flag = true;
                this.$message({
                message: '请选择运单',
                type: 'error'
                
        });
            }else{
                this.flag =false
            }
        },
        
        tabClick(tab, event) {
            // if (this.currentTab != this.activeName) {
            //      this.loadData()
            //      this.currentTab = this.activeName
            // }
        },

        //图片上传
        handleFileRemove(file, fileList) {
            
            if(file.dataId == undefined){
                    return;
            }

            api.post('/file/delete?id=' + file.dataId).then(data=>{
                if(data.code=='200'){

                    switch (this.activeName) {
                        case 'qdTab': {
                            this.qdFile.fileListView = fileList;
                        }break;
                        case 'ydmxTab': {
                            this.ydmxFile.fileListView = fileList;
                        }break;
                        case 'cydTab': {
                            this.cydFile.fileListView = fileList;
                        }break;
                        case 'fhycTab': {
                            this.fhycFile.fileListView = fileList;
                        }break;
                        case 'thycTab': {
                            this.thycFile.fileListView = fileList;
                        }break;
                        case 'qtTab': {
                            this.qtFile.fileListView = fileList;
                        }break;
                        default:
                            break;
                    }

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
            if(file.size > 1024 * 1024 * 20){
                    this.$message({
                    message: '警告哦，上传文件不能大于20M,请重新选择上传',
                    type: 'warning'
                });   
                return; 
            }else{
 
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

                    let dataBusType = -1
                    switch (this.activeName) {
                        case 'qdTab': {
                            dataBusType = 1
                            this.qdFile.fileListView.push(fileView);
                        }break;
                        case 'ydmxTab': {
                            dataBusType = 2
                            this.ydmxFile.fileListView.push(fileView);
                        }break;
                        case 'cydTab': {
                            dataBusType = 3
                            this.cydFile.fileListView.push(fileView);
                        }break;
                        case 'fhycTab': {
                            dataBusType = 4
                            this.fhycFile.fileListView.push(fileView);
                        }break;
                        case 'thycTab': {
                            dataBusType = 5
                            this.thycFile.fileListView.push(fileView);
                        }break;
                        case 'qtTab': {
                            dataBusType = 6
                            this.qtFile.fileListView.push(fileView);
                        }break;
                        default:
                            break;
                    }

                    //上传成功后直接提交服务端保存
                    let ad = { dataId:this.pWaybillId, 
                                dataType:1, 
                                dataBusType:dataBusType,
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
            }
        },
        //列表加载
        loadData(){

            this.qdFile.fileListView=[];
            this.ydmxFile.fileListView=[];
            this.cydFile.fileListView=[];
            this.fhycFile.fileListView=[];
            this.thycFile.fileListView=[];
            this.qdFile.fileListView=[];
            api.get('/file/list?type=1&id='+ this.pWaybillId ).then(data=>{
                if(data.code=='200'){
                    //图片
                    if (data.data && data.data.length > 0) {
                        data.data.forEach(file => {
                            let fileView = {
                                dataId:file.id,
                                name: file.name,
                                url: file.url + '?x-oss-process=image/resize,m_fill,h_200,w_200',
                                bigUrl: file.url
                            };

                            switch (file.dataBusType) {
                                case 1:this.qdFile.fileListView.push(fileView);break;
                                case 2:this.ydmxFile.fileListView.push(fileView);break;
                                case 3:this.cydFile.fileListView.push(fileView);break;
                                case 4:this.fhycFile.fileListView.push(fileView);break;
                                case 5:this.thycFile.fileListView.push(fileView);break;
                                case 6:this.qdFile.fileListView.push(fileView);break;
                                default:
                                    break;
                            }
                        });
                    }
                }
            })

        //     switch (this.activeName) {
        //         case 'qdTab': {
        //             this.qdFile.fileListView = []
        //             api.get('/file/list?type=1&btype=1&id='+ this.pWaybillId ).then(data=>{
        //                 if(data.code=='200'){
        //                     //图片
        //                     if (data.data && data.data.length > 0) {
        //                         data.data.forEach(file => {
        //                             let fileView = {
        //                                 dataId:file.id,
        //                                 name: file.name,
        //                                 url: file.url + '?x-oss-process=image/resize,m_fill,h_200,w_200',
        //                                 bigUrl: file.url
        //                             };
        //                             this.qdFile.fileListView.push(fileView);
        //                         });
        //                     }
        //                 }
        //             })
        //         }break;
        //         case 'ydmxTab': {
        //             this.ydmxFile.fileListView = []
        //             api.get('/file/list?type=1&btype=2&id='+ this.pWaybillId ).then(data=>{
        //                 if(data.code=='200'){
        //                     //图片
        //                     if (data.data && data.data.length > 0) {
        //                         data.data.forEach(file => {
        //                             let fileView = {
        //                                 dataId:file.id,
        //                                 name: file.name,
        //                                 url: file.bigUrl + '?x-oss-process=image/resize,m_fill,h_200,w_200',
        //                                 bigUrl: file.bigUrl
        //                             };
        //                             this.ydmxFile.fileListView.push(fileView);
        //                         });
        //                     }
        //                 }
        //             })
        //         }break;
        //         case 'cydTab': {
        //             this.cydFile.fileListView = []
        //             api.get('/file/list?type=1&btype=3&id='+ this.pWaybillId ).then(data=>{
        //                 if(data.code=='200'){
        //                     //图片
        //                     if (data.data && data.data.length > 0) {
        //                         data.data.forEach(file => {
        //                             let fileView = {
        //                                 dataId:file.id,
        //                                 name: file.name,
        //                                 url: file.bigUrl + '?x-oss-process=image/resize,m_fill,h_200,w_200',
        //                                 bigUrl: file.bigUrl
        //                             };
        //                             this.cydFile.fileListView.push(fileView);
        //                         });
        //                     }
        //                 }
        //             })
        //         }break;
        //         case 'fhycTab': {
        //             this.fhycFile.fileListView = []
        //             api.get('/file/list?type=1&btype=4&id='+ this.pWaybillId ).then(data=>{
        //                 if(data.code=='200'){
        //                     //图片
        //                     if (data.data && data.data.length > 0) {
        //                         data.data.forEach(file => {
        //                             let fileView = {
        //                                 dataId:file.id,
        //                                 name: file.name,
        //                                 url: file.bigUrl + '?x-oss-process=image/resize,m_fill,h_200,w_200',
        //                                 bigUrl: file.bigUrl
        //                             };
        //                             this.fhycFile.fileListView.push(fileView);
        //                         });
        //                     }
        //                 }
        //             })
        //         }break;
        //         case 'thycTab': {
        //             this.thycFile.fileListView = []
        //             api.get('/file/list?type=1&btype=5&id='+ this.pWaybillId ).then(data=>{
        //                 if(data.code=='200'){
        //                     //图片
        //                     if (data.data && data.data.length > 0) {
        //                         data.data.forEach(file => {
        //                             let fileView = {
        //                                 dataId:file.id,
        //                                 name: file.name,
        //                                 url: file.bigUrl + '?x-oss-process=image/resize,m_fill,h_200,w_200',
        //                                 bigUrl: file.bigUrl
        //                             };
        //                             this.thycFile.fileListView.push(fileView);
        //                         });
        //                     }
        //                 }
        //             })
        //         }break;
        //         case 'qtTab': {
        //             this.qtTFile.fileListView = []
        //             api.get('/file/list?type=1&btype=6&id='+ this.pWaybillId ).then(data=>{
        //                 if(data.code=='200'){
        //                     //图片
        //                     if (data.data && data.data.length > 0) {
        //                         data.data.forEach(file => {
        //                             let fileView = {
        //                                 dataId:file.id,
        //                                 name: file.name,
        //                                 url: file.url + '?x-oss-process=image/resize,m_fill,h_200,w_200',
        //                                 bigUrl: file.url
        //                             };
        //                             this.qtTFile.fileListView.push(fileView);
        //                         });
        //                     }
        //                 }
        //             })
        //         }break;
        //         default:
        //             break;
        //     }
        }
    }, 
    mounted() {
        this.loadData();
    }
}                    
</script>
<style>
.J-uploadFiles{
    justify-content: space-around
}


.J-uploadFiles .el-tabs__nav{
    width: 100%
}
.J-uploadFiles .el-tabs__item{
    width: 16.7%;
}
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>