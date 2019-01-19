<template>
    <div class="MagList">
        <div class="J-main-body">
          <div class="homeMain-header"> 
            <div class="J-main-search J-flexSbc" >
              <el-form :inline="true" :model="searchForm" class="demo-form-inline" ref="searchForm">
                  <el-form-item label="模糊查询" prop="word">
                    <el-input v-model="searchForm.word" placeholder="车牌、司机名称、手机号" style="width:215px"></el-input>
                  </el-form-item>
                  <el-form-item label="车型" prop="truckType">
                    <el-select v-model="searchForm.truckType"  multiple collapse-tags clearable placeholder="请选择">
                      <el-option
                        v-for="item in base.truckTypeOptions"
                        :key="item.value"
                        :label="item.item"
                        :value="item.value">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item class="J-main-search-button">
                    <el-button type="primary" v-if="checkHasPermission('cart:read')" @click='handlesearch'>查询</el-button>
                  <el-button type="warning" v-if="checkHasPermission('cart:read')" @click="resetForm('searchForm')">重置</el-button>
                  </el-form-item>
              </el-form>
              <el-button type="primary" style="margin-top: -18px;margin-right:18px" v-if="checkHasPermission('cart:create')" @click="newModifyFun()">新增</el-button>
            </div>
          </div>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border  @selection-change="handleSelectionChange">
              <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true">
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-2" v-if="checkHasPermission('cart:update')" @click="newModifyFun(scope.row)">修改</el-menu-item> 
                          <!-- <el-menu-item index="1-3" v-if="checkHasPermission('cart:delete')" @click="batchDeletion(scope.row)">删除</el-menu-item>   -->
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="plateNumber" label="车牌号" min-width="110" align='center'></el-table-column>
              <el-table-column prop="sourceType" label="车辆来源" min-width="110" align='center'>
                <template slot-scope="scope"> 
                  <div v-html="statusBackground(sourceType(scope.row.sourceType))" class="J-statusBackground"></div>     
                </template>
              </el-table-column>
              <el-table-column prop="driverName" label="司机" min-width="110" align='center'></el-table-column>
              <el-table-column prop="driverMobile" label="司机手机" min-width="120" align='center'></el-table-column>
              <el-table-column prop="truckType" label="车型" min-width="110" align='center'>
                 <template slot-scope="scope">
                    {{vehicleTypeFun(scope.row.truckType)}}
                  </template>
              </el-table-column>
              <el-table-column label="车长/宽/高" min-width="110" align='center'>
                <template slot-scope="scope"> 
                  <span>{{ scope.row.truckLength?scope.row.truckLength:0}}/</span>
                  <span>{{ scope.row.truckWidth?scope.row.truckWidth:0}}/</span>
                  <span>{{ scope.row.truckHeight?scope.row.truckHeight:0}}</span>
                </template>
              </el-table-column>
              <el-table-column label="载重/体积" min-width="110" align='center'>
                <template slot-scope="scope"> 
                  <span>{{ scope.row.maxWeight?scope.row.maxWeight:0}}/</span>
                  <span>{{ scope.row.maxBulk?scope.row.maxBulk:0}}</span>
                </template>
              </el-table-column>
              <el-table-column prop="truckLicense" label="行驶证" min-width="170" align='center'></el-table-column>       
              <el-table-column prop="driverLicense" label="司机驾驶证" min-width="170" align='center'></el-table-column>       
              <el-table-column prop="driverCard" label="司机身份证" min-width="170" align='center'></el-table-column>       
              <el-table-column prop="" label="图片" min-width="110" align='center'></el-table-column>       
              <el-table-column prop="memo" label="备注" min-width="160" align='center'></el-table-column>       
              <el-table-column prop="createTime" label="新增时间" min-width="170" align='center'></el-table-column>       
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
                <!-- <el-select v-model="value" placeholder="批量操作">
                  <el-option value="">
                    <div class='J-batchDeletion' v-if="checkHasPermission('cart:delete')" @click='batchDeletion'>删除</div>
                  </el-option> 
                </el-select>
                <span>已选择{{batchNum}}项</span> -->
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

        <el-dialog :close-on-click-modal="false" :title="newModifyTitle" :visible.sync="InformationsOpinionList.Vehicle.vehicleOpinion"  width="1200px" center class="Maglist-HairCar J-dialog-vh J-el-dialog__body">
          <div class="J-detail J-inputBorder0 J-yx-error" > 
            <el-form ref="vehicleNewModifyForm"  :rules="vehicleRules" :model="vehicleNewModifyForm"  >
              <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    基本信息 
                </div>
                <el-col :span="6">
                    <div class="labal">车牌号码</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="plateNumber">
                        <el-input placeholder="车牌号码 如：GK12001" v-model="vehicleNewModifyForm.plateNumber"></el-input>                      
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">车型</div>
                    <div class="input J-borderBot ">
                      <el-form-item prop="truckType">
                        <el-select v-model="vehicleNewModifyForm.truckType" placeholder="请选择">
                          <el-option
                            v-for="item in base.truckTypeOptions"
                            :key="item.value*1"
                            :label="item.item"
                            :value="item.value*1">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">车辆来源</div>
                    <div class="input J-borderBot">
                      <el-select v-model="vehicleNewModifyForm.sourceType" placeholder="请选择">
                        <el-option
                          v-for="item in base.sourceType"
                          :key="item.value"
                          :label="item.code"
                          :value="item.value">
                        </el-option>
                      </el-select>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">核定载重</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="maxWeight">
                        <el-input placeholder="核定载重" v-model="vehicleNewModifyForm.maxWeight"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">核定体积</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="maxBulk">
                        <el-input placeholder="核定体积" v-model="vehicleNewModifyForm.maxBulk"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">车长</div>
                    <div class="input J-borderBot ">
                      <el-form-item prop="truckType">
                        <el-select v-model="vehicleNewModifyForm.truckLength" placeholder="请选择">
                          <el-option
                            v-for="item in base.conductorOptions"
                            :key="item.value*1"
                            :label="item.item"
                            :value="item.value*1">
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">车宽</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="truckWidth">
                        <el-input placeholder="车宽" v-model="vehicleNewModifyForm.truckWidth"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">车高</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="truckHeight">
                        <el-input placeholder="车高" v-model="vehicleNewModifyForm.truckHeight"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                
                <el-col :span="6">
                    <div class="labal">行驶证</div>
                    <div class="input">
                      <el-form-item prop="truckLicense">
                        <el-input placeholder="行驶证" v-model="vehicleNewModifyForm.truckLicense"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal"></div>
                    <div class="input"></div>
                </el-col>
                <el-col :span="6">
                    <div class="labal"></div>
                    <div class="input"></div>
                </el-col>
                <el-col :span="6">
                    <div class="labal"></div>
                    <div class="input"></div>
                </el-col>
                
              </el-row>
              <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    司机信息  
                </div>
                <el-col :span="6">
                    <div class="labal">姓名</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="driverName">
                        <el-input placeholder="姓名" v-model="vehicleNewModifyForm.driverName"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">手机</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="driverMobile">
                        <el-input placeholder="手机" v-model="vehicleNewModifyForm.driverMobile"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">身份证</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="driverCard">
                        <el-input placeholder="身份证" v-model="vehicleNewModifyForm.driverCard"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="labal">驾驶证</div>
                    <div class="input J-borderBot">
                      <el-form-item prop="driverLicense">
                        <el-input placeholder="驾驶证" v-model="vehicleNewModifyForm.driverLicense"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12">
                    <div class="labal">详细地址</div>
                    <div class="input ">
                      <el-form-item prop="driverAddress">
                        <el-input placeholder="详细地址" v-model="vehicleNewModifyForm.driverAddress"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
                <el-col :span="12" >
                    <div class="labal">备注</div>
                    <div class="input "> 
                      <el-form-item prop="memo">
                        <el-input placeholder="备注" v-model="vehicleNewModifyForm.memo"></el-input>
                      </el-form-item>
                    </div>
                </el-col>
              </el-row>
              <!-- <el-row>
                <div class="J-detail-title">
                  <div class="J-detail-title-yuan"></div> 
                  车辆、司机照片
                </div>
              </el-row> -->
            </el-form>
            <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
              <el-button type="primary" :loading="savingFlag" @click="newModifyPreservation('vehicleNewModifyForm')">保 存</el-button>
            </span>
          </div>  
        </el-dialog>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
import api from '@/utils/api.js'
export default {
  name:'i-vehicle',
  mixins: [Base,List],
  data() {
    return {     
        batchNum:0,//已选择n项
        ids:[],//选择删除的id数组
        batchDeletionTitle:"",//删除弹框title的内容
        newModifyMessage:false,//判断是新增还是修改
        newModifyTitle:'',//新增或修改弹框title的内容
        //信息管理-车辆管理新增或修改
        vehicleNewModifyForm:{
          plateNumber:'',//车牌号GK12001
          truckType:'',//车型
          sourceType:1,//车辆来源
          maxWeight:'',//核定载重
          maxBulk:'',//核定体积
          truckLength:'',//车长
          truckWidth:'',//车宽
          truckHeight:'',//车高
          truckLicense:'',//行驶证
          driverName:'',//司机姓名
          driverMobile:'',//司机手机
          driverCard:'',//司机身份证
          driverLicense:'',//司机驾驶证
          driverAddress:'',//详细地址
          memo:'',//备注   
          id:''  
        },  
        searchForm: { //信息管理-车辆管理 查询   
          truckType:'',
          word:'',
          pageSize: 10,
          pageNo: 1
        },
        tableData: [], 
        multipleSelection: [], //多选
        vehicleRules: {
          plateNumber: [
            { required: true, message: '请输入车牌号码' ,trigger: ['blur', 'change'] },
            { validator: this.plateNumberRules, trigger: ['blur', 'change']}
          ],
          truckType: [
            { required: true, message: '请选择车型' ,trigger: ['blur', 'change'] },
          ],
          maxWeight: [
            { validator: this.numberRules, trigger: ['blur', 'change']},
          ],
          maxBulk: [
            { validator: this.numberRules, trigger: ['blur', 'change']}
          ],
          truckLength: [
            { validator: this.numberRules, trigger: ['blur', 'change']}
          ],
          truckWidth: [
            { validator: this.numberRules, trigger: ['blur', 'change']}
          ],
          truckHeight: [
            { validator: this.numberRules, trigger: ['blur', 'change']}
          ],
          //行驶证只进行了长度验证
          truckLicense:[
            { min: 0, max: 50, message: '超出长度限制{0~50}' ,trigger: 'blur'}   
          ],
          driverName: [
            { required: true, message: '请输入司机姓名' ,trigger: ['blur', 'change'] },
            { min: 1, max: 50, message: '超出长度限制{1~50}' ,trigger: 'blur'}
          ],
          driverMobile: [
            { required: true, message: '请输入手机' ,trigger: ['blur', 'change'] },
            { validator: this.linkmanMobileRules, trigger: ['blur', 'change']}
          ],
          driverCard: [
            { message: '请输入身份证' ,trigger: ['blur', 'change'] },
            { validator: this.iDRules, trigger: ['blur', 'change']}
          ],
          driverLicense:[
            { min: 0, max: 50, message: '超出长度限制{0~50}' ,trigger: 'blur'}   
          ],
          driverAddress:[
            { min: 0, max: 100, message: '超出长度限制{0~100}' ,trigger: 'blur'}
          ],
          memo:[
            { min: 1, max: 500, message: '超出长度限制{1~500}' ,trigger: 'blur'}  
          ]
        },
      };
    },

    methods: {
      //车辆修改/新增  判断弹框时是否传递row       
      newModifyFun(row){
        this.closeDialog('vehicleNewModifyForm')
        if(row){
          this.newModifyMessage=false
          this.newModifyTitle='车辆修改'
          this.vehicleNewModifyForm.plateNumber=row.plateNumber
          this.vehicleNewModifyForm.truckType=row.truckType
          this.vehicleNewModifyForm.sourceType=row.sourceType
          this.vehicleNewModifyForm.maxWeight=row.maxWeight
          this.vehicleNewModifyForm.maxBulk=row.maxBulk
          this.vehicleNewModifyForm.truckLength=row.truckLength
          this.vehicleNewModifyForm.truckWidth=row.truckWidth
          this.vehicleNewModifyForm.truckHeight=row.truckHeight
          this.vehicleNewModifyForm.truckLicense=row.truckLicense
          this.vehicleNewModifyForm.driverName=row.driverName
          this.vehicleNewModifyForm.driverMobile=row.driverMobile
          this.vehicleNewModifyForm.driverCard=row.driverCard
          this.vehicleNewModifyForm.driverLicense=row.driverLicense
          this.vehicleNewModifyForm.driverAddress=row.driverAddress
          this.vehicleNewModifyForm.memo=row.memo
          this.vehicleNewModifyForm.id=row.id
        }else{
          this.newModifyMessage=true
          this.newModifyTitle='车辆新增'
        }     
        this.InformationsOpinionList.Vehicle.vehicleOpinion=true
      },
      //点击保存验证
      newModifyPreservation(formName){
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.saveDataSubmit()
          } else {
           
            return false;
          }
        });
      },
      saveDataSubmit(){  //点击保存到-执行修改或增加
        this.$confirm('确定要【保存】, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
        }).then(() => {   
            this.savingFlag=true
            api.post('car/addoredit',this.vehicleNewModifyForm).then(data=>{
              if(data.code==200){
                if(this.newModifyMessage){
                  this.$message({
                        type: 'success',
                        message: '恭喜您，车辆已新增!'
                    });
                }else{
                  this.$message({
                      type: 'success',
                      message: '恭喜您，已成功修改该车辆信息!'
                  }); 
                }
                this.querySpecialList()
                this.InformationsOpinionList.Vehicle.vehicleOpinion=false
                }
            }).then(() => {          // 点击确认
            this.savingFlag=false
          }) 
        }).catch(() => {})
      },  
      async querySpecialList() {//获取页面初始数据
        const { code, message,data } =await api.post('car/list', this.searchForm)
        if(code==="200"){
          this.tableData = data.records;
          this.page.total = data.total;  
        }
      },   
     
      handleSelectionChange(val) {
        var delsete=[]
        this.multipleSelection = val;
        for (const item of this.multipleSelection) {
            delsete.push(item.id)  
        }
        this.batchNum=delsete.length
        this.ids=delsete
      },
      batchDeletion(row){//批量删除      
        if(row.id){
            this.batchDeletionTitle='此操作将永久删除当前车辆, 是否继续?'
        }else{
           this.batchDeletionTitle='此操作将永久删除已选择车辆, 是否继续?'
        }
        this.$confirm(this.batchDeletionTitle, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(async () => {
          if(row.id){
            this.ids.splice(0,this.ids.length,row.id);
          }
          if(this.ids!=''){
            const { code, message,data } =await api.get('car/delete?ids='+this.ids)
            if(code==200){
              this.$message({
                type: 'success',
                message: '恭喜您，删除成功!'
              });
              if (this.tableData.length===1) {
                this.searchForm.pageNo--
              }   
              this.querySpecialList()
            }    
          }else{
            this.$message({
              type: 'warning',
              message: '请选择需要删除的车辆'
            });   
          }             
        }).catch(() => {
               
        });
      }, 
      //车型
      vehicleTypeFun : function(truckType){
             let param = this.base.truckTypeOptions.find((n) => (n.value == truckType));
            if (param === undefined) {
                return ""
            }
            return param.item;

        }

    },
    created(){
      this.vehicleTypeInterface()
      this.conductorInterfacee()

    }
  };
</script>
<style>

</style>
