
<template>
    <div>
        <el-dialog :title="newModifyTitle" :visible.sync="isDialog" @close="$emit('update:dialog', false)"
             width="500px" center class="Maglist-HairCar J-dialog-vh">      
            <div>
                <div class="J-elTable" id="J-elTable">
                    <el-table :max-height="getScreenHeight-jElTableOffsetTop-60" :data="tableData" highlight-current-row style="width: 100%" border >
                        <el-table-column type="index" label="序号" width="50"  align='center'></el-table-column>
                        <el-table-column prop="colorValue" label="颜色" width="100"  align='center'>
                            <template slot-scope="scope">
                            <el-color-picker class="J-el-color-picker__mask"
                                v-model="scope.row.colorValue" :disabled='true' show-alpha>
                                </el-color-picker>
                            </template>    
                        </el-table-column>
                        
                        <el-table-column label="描述"  align='center'>
                            <template slot-scope="scope" >
                                {{ scope.row.memo }}
                                <!-- <el-input v-if="scope.row.seen" v-model="scope.row.name" @blur="loseFcous(scope.$index, scope.row)" > </el-input>
                                <span v-else  @click="cellClick(scope.row)">{{ scope.row.name }}</span> -->
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="120"  align='center'>
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="newModifySignFun(scope.row)" >修改</el-button>
                                <el-button type="text" size="small" @click="deleteSignFun(scope.row)" >删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>    
                <span class="dialog-footer" style="display: block; text-align: center;margin-top:30px">
                    <el-button type="primary" @click='newModifySignFun()'>添 加</el-button>
                </span>
            </div>
        </el-dialog>
        <el-dialog width="430px" :title="signTitle" :visible.sync="showDialog" center append-to-body>     
            <el-form ref="newModifyForm"  :rules="newModifyRules" :inline="true" :model="newModifyForm" class="demo-form-inline " >    
                <el-form-item label="颜色" prop="colorValue" >
                    <el-color-picker style="width:200px"
                        v-model="newModifyForm.colorValue"
                        show-alpha
                        :predefine="predefineColors">
                        </el-color-picker>
                </el-form-item>
                <el-form-item label="描述" class="J-sign-textarea">
                    <el-input type="textarea"  placeholder="请输入描述" :autosize="{ minRows: 3, maxRows: 4}" v-model="newModifyForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <span style="display: block; text-align: center;margin-top:10px">   
                <el-button type="primary" :loading="savingFlag"  @click="preservation('newModifyForm')">保 存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
    computed:{
        //获取stroe 中 state的方法 相当于this.$store.getters.xx
        ...mapGetters([
            'getScreenHeight'
        ])
    },
    mixins: [Base,List],
    props: ['dialog'],
    data() {
        return {
            showDialog: false,
            isDialog: this.dialog,
            newModifyTitle:'',
            signTitle:'',
            tableData:[],
            newModifyForm:{
                colorValue:"rgba(255, 69, 0, 0.68)",
                memo:''
            },
            predefineColors: [
                '#ff4500',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577'
            ],
            newModifyRules: {
                colorValue: [
                    { required: true, message: '颜色选择不能为空', trigger: ['blur', 'change']},
                ]
            },
        }
    },
    methods:{
        /**
         * 初始化
         */
        init(){
            this.newModifyTitle= '标签管理'
            this.createdList()
        },
        //列表加载
        async createdList(){
            const { code, message,data } =await api.get('/mark/list')
            if(code == "200"){
                this.tableData = data;
            }
        },
        //新增或修改
        newModifySignFun(row){            
            if(row){
                this.signTitle='修改标签'
                this.newModifyForm.colorValue=row.colorValue
                this.newModifyForm.memo=row.memo
                this.newModifyForm.id=row.id
            }else{
                this.signTitle='新增标签'
                this.newModifyForm={}
            }
            this.showDialog=true
        },
        //删除
        deleteSignFun(row){

            this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            center:true,
            type: 'warning'
            }).then(() => {
                api.get('/mark/delete?id='+row.id).then(data=>{
                    if(data.code == "200"){
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.createdList()
                        this.$emit('reloadData',true)
                    }
                })
                
            })
        },
        //确认确认保存？
        preservation(formName){
            this.$refs[formName].validate((valid) => {
            if (valid) {
                this.$confirm('确认保存？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    center:true,
                    type: 'warning'
                }).then(_ => {
                    this.saveFun()
                })
                .catch(_ => {  
                });
            } else {
                return false;
            }
            });    
        },  
        //确认
        async saveFun(){
            const { code, message,data } =await api.post('/mark/add_edit',this.newModifyForm)
            if(code == "200"){
                this.createdList()
                this.showDialog=false
                this.$emit('reloadData',true)

            }
        }  
    }, 
    created() {
        this.init()
    } 
}                    
</script>

                          
  
                          
  
                        
 
              
                          
  
                        
 