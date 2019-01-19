<template>
    <div class="MagList">
        <div class="J-main-body">
          <el-button type="primary" style="margin-bottom:20px" @click="InformationsOpinionList.Price.priceOpinion=true">新增报价</el-button>
           <el-button type="primary" style="margin-bottom:20px" @click="InformationsOpinionList.Price.weiqueding=true">新增报价-零担</el-button>
           <el-button type="primary" style="margin-bottom:20px" @click="InformationsOpinionList.Price.priceXqOpinion=true">报价详情</el-button>
          <div class="J-elTable" id="J-elTable" >
            <el-table  :max-height="getScreenHeight-jElTableOffsetTop>=111?getScreenHeight-jElTableOffsetTop:'none'"  :data="tableData" border  @selection-change="handleSelectionChange">
              <el-table-column fixed type="selection" width="40" align='center'></el-table-column>
              <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
              <el-table-column label="操作"  width="50" align='center' header-align="center" fixed>
                <template slot-scope="scope">
                  <div class="table-menu">
                    <el-menu  :collapse="true"  @select="handleSelect">
                      <el-submenu index="1" >
                        <template slot="title" >
                          <i class="el-icon-edit-outline"></i>
                        </template>
                        <el-menu-item-group> 
                          <el-menu-item index="1-1" @click="InformationsOpinionList.Price.priceOpinion=true">新增报价</el-menu-item>  
                          <el-menu-item index="1-2" @click="InformationsOpinionList.Price.priceOpinion=true">修改</el-menu-item> 
                          <el-menu-item index="1-3" @click="DeleteConfirm(scope.row)">删除</el-menu-item>  
                        </el-menu-item-group>
                      </el-submenu> 
                    </el-menu>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="xxx" label="报价名称" width="180" align='center'></el-table-column>
              <el-table-column prop="" label="报价方式"  width='180' align='center'></el-table-column>
              <el-table-column prop="" label="是否含税" width="180" align='center'></el-table-column>
              <el-table-column prop="" label="报价备注" width="180" align='center'></el-table-column>
              <el-table-column prop="" label="创建时间" align='center'></el-table-column>       
            </el-table>
            <div class="main-table-page">
              <div class="main-table-page-left"> 
                <!-- <el-select v-model="value" placeholder="批量操作">
                  <el-option value="">
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

        
        <el-dialog title="新增报价" :visible.sync="InformationsOpinionList.Price.priceOpinion" width="1200px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
            <div class="price-title">
              
              <div class="price-title-left">
                <span class="price-yuan">1</span>
                <div>报价信息</div>
              </div>
              <div class="price-title-xian"></div>
              <div class="price-title-right">
                <span class="price-yuan">2</span>
                <div>线路价格信息</div>
              </div>
            </div>
            
            <el-form>
              <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    基本信息  
                </div>
                <el-col :span="12">
                    <div class="labal">报价名称</div>
                    <div class="input "><el-input v-model="PriceFormList.priceAddForm.XXX" placeholder="请输入内容"></el-input></div>
                </el-col>
                <el-col :span="12">
                    <div class="labal">始发地</div>
                    <div class="input"><el-input v-model="PriceFormList.priceAddForm.XXX" placeholder="请输入内容"></el-input></div>
                </el-col>
                <el-col :span="24">
                    <div class="labal">备注</div>
                    <div class="input J-borderTop"><el-input v-model="PriceFormList.priceAddForm.XXX" placeholder="请输入内容"></el-input></div>
                </el-col>
              </el-row>
              <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    计算方式  
                </div>
                <el-col :span="6">
                    <div class="input J-borderLeft" >
                      <el-radio v-model="PriceFormList.priceAddForm.radio" label="1">按零担报价计算</el-radio>
                    </div>
                </el-col>
                <el-col :span="6">
                    <div class="input "> <el-radio v-model="PriceFormList.priceAddForm.radio" label="2">按整车报价计算</el-radio></div>
                </el-col>
                <el-col :span="6">
                    <div class="input "> <el-radio v-model="PriceFormList.priceAddForm.radio" label="3">按件计价</el-radio></div>
                </el-col>
                <el-col :span="6">
                    <div class="input "> <el-radio v-model="PriceFormList.priceAddForm.radio" label="4">报价含税</el-radio></div>
                </el-col>
                <el-col :span="24">
                    <div class="input J-borderLeft J-borderTop"></div>
                </el-col>
                <el-col :span="24">
                  <div class="input J-borderLeft J-borderTop J-textLeft J-flex  "> 
                        <el-form-item>
                          <span  class="J-marginL30">当不足时，按指定计算：</span>
                          <el-input class="miniInput"></el-input>
                          <span>方</span>
                        </el-form-item>
                  </div>
                </el-col>
                <el-col :span="24">
                  <div class="input J-borderLeft J-borderTop J-textLeft " > 
                        <el-form-item>
                          <span class="J-marginL30">体积区间：</span>
                          <el-input class="miniInput"></el-input>
                          <span>-</span>
                          <el-input class="miniInput"></el-input>
                          <span>方</span>
                          <el-input class="miniInput"></el-input>
                          <span>-</span>
                          <el-input class="miniInput"></el-input>
                          <span>方</span>
                          <el-input class="miniInput"></el-input>
                          <span>-</span>
                          <el-input class="miniInput"></el-input>
                          <span>方</span>
                        </el-form-item>
                  </div>
                </el-col>
              </el-row>
            </el-form>
            <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
              <el-button type="primary" >保 存</el-button>
            </span> 
          </div>
        </el-dialog>

        <el-dialog title="新增报价-零担" :visible.sync="InformationsOpinionList.Price.weiqueding" width="1200px" center class="Maglist-HairCar">
          <div class="J-detail  "> 
            <div class="price-title">
              
              <div class="price-title-left">
                <span class="price-yuan">1</span>
                <div>基本信息</div>
              </div>
              <div class="price-title-xian"></div>
              <div class="price-title-right">
                <span class="price-yuan">2</span>
                <div>线路价格信息</div>
              </div>
            </div>
            
            <el-form>
              <el-row>
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    基本信息  
                </div>
                <el-col :span="4">
                    <div class="input J-borderLeft ">体积/重量>=  3.8</div>
                </el-col>
                <el-col :span="4">
                    <div class="input">3>=体积/重量>=  3.8</div>
                </el-col>
                <el-col :span="4">
                    <div class="input">体积/重量&lt; 3</div>
                </el-col>
              </el-row>
             
              <el-row :gutter="20">
                <div class="J-detail-title">
                    <div class="J-detail-title-yuan"></div>
                    其他信息  
                </div>
                <el-col :span="9">
                  <el-row class="J-width100">
                    <el-col :span="12">
                      <div class="input J-borderLeft ">省</div>
                    </el-col>
                    <el-col :span="12">
                      <div class="input ">市（   同时填写     ）</div>
                    </el-col>
                  </el-row>
                </el-col>
                <el-col :span="15">
                  <el-row class="J-width100">
                    <el-col :span="12">
                      <div class="labal">运输时效</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">小时</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">回单时效</div>
                      <div class="input J-borderLeft J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">小时</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">区间</div>
                      <div class="input J-borderBot"><el-input class="smallInput" value="0<x<=5"></el-input></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">报价</div>
                      <div class="input J-borderBot"><el-input class="smallInput" value="0<x<=5"></el-input><span style="margin-left:6px">元/方</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">区间</div>
                      <div class="input J-borderBot"><el-input class="smallInput" value="0<x<=5"></el-input></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal ">报价</div>
                      <div class="input J-borderBot"><el-input class="smallInput" value="0<x<=5"></el-input><span style="margin-left:6px">元/方</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">区间</div>
                      <div class="input J-borderBot"><el-input class="smallInput" value="0<x<=5"></el-input></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">报价</div>
                      <div class="input J-borderBot"><el-input class="smallInput" value="0<x<=5"></el-input><span style="margin-left:6px">元/方</span></div>
                    </el-col>
                    <el-col :span="24">
                      <div class="input  J-borderLeft"><span style="margin-left:6px">提货费</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按票计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/票</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按体积计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/方  </span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按重量计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/吨</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">免提货费</div>
                      <div class="input J-borderLeft  J-borderBot"><span style="margin-left:6px">大于 </span><el-input class="zuiminiInput"></el-input><span style="margin-left:6px">方，大于 </span><el-input class="zuiminiInput"></el-input><span style="margin-left:6px">吨</span></div>
                    </el-col>
                    <el-col :span="24">
                      <div class="input  J-borderLeft"><span style="margin-left:6px">送货费</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按票计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/票</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按体积计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/方  </span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按重量计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/吨</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">免提货费</div>
                      <div class="input J-borderLeft  J-borderBot"><span style="margin-left:6px">大于 </span><el-input class="zuiminiInput"></el-input><span style="margin-left:6px">方，大于 </span><el-input class="zuiminiInput"></el-input><span style="margin-left:6px">吨</span></div>
                    </el-col>
                    <el-col :span="24">
                      <div class="input  J-borderLeft"><span style="margin-left:6px">装卸费</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按体积计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/方</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按重量计价</div>
                      <div class="input J-borderLeft  J-borderBot"><el-input class="smallInput"></el-input><span style="margin-left:6px">元/吨</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal">按件计价</div>
                      <div class="input J-borderLeft "><el-input class="smallInput"></el-input><span style="margin-left:6px">元/件</span></div>
                    </el-col>
                    <el-col :span="12">
                      <div class="labal"></div>
                      <div class="input J-borderLeft  "></div>
                    </el-col>
                  </el-row> 
                </el-col>
              </el-row>
            </el-form>
            <span class="dialog-footer" style="display: block; text-align: center;margin-top:18px">
              <el-button type="primary" >保 存</el-button>
            </span> 
          </div>
        </el-dialog>

        <el-dialog title="报价详情" :visible.sync="InformationsOpinionList.Price.priceXqOpinion" width="1200px" center class="Maglist-HairCar">
          <div class="J-detail"> 
            <el-row>
                <el-col :span="8">
                    <div class="labal">报价名称</div>
                    <div class="input"></div>
                </el-col>
                <el-col :span="8">
                    <div class="labal">始发地</div>
                    <div class="input"></div>
                </el-col>
                <el-col :span="8">
                    <div class="labal"> </div>
                    <div class="input"></div>
                </el-col>
                <el-col :span="24" >
                    <div class="labal">备注</div>
                    <div class="input J-borderTop"></div>
                </el-col>
            </el-row>
            <el-row>
              <div class="J-detail-title">
                  <div class="J-detail-title-yuan"></div>
                  计算方式  
              </div>
              <el-col :span="6">
                  <div class="input J-borderLeft" >
                    <el-radio disabled  v-model="PriceFormList.priceAddForm.radio" label="1">按零担报价计算</el-radio>
                  </div>
              </el-col>
              <el-col :span="6">
                  <div class="input "> <el-radio disabled  v-model="PriceFormList.priceAddForm.radio" label="2">按整车报价计算</el-radio></div>
              </el-col>
              <el-col :span="6">
                  <div class="input "> <el-radio disabled  v-model="PriceFormList.priceAddForm.radio" label="3">按件计价</el-radio></div>
              </el-col>
              <el-col :span="6">
                  <div class="input "> <el-radio disabled  v-model="PriceFormList.priceAddForm.radio" label="4">报价含税</el-radio></div>
              </el-col>
            </el-row>
            <br>
            <el-row > 
              <el-col :span="4">
                  <div class="input J-borderLeft  J-borderBot">体积/重量>=  3.8</div>
              </el-col>
              <el-col :span="4">
                  <div class="input  J-borderBot">3>=体积/重量>=  3.8</div>
              </el-col>
              <el-col :span="4">
                  <div class="input J-borderBot">体积/重量&lt; 3</div>
              </el-col>
              <el-col :span="24">
                <div class="input J-borderLeft  J-textLeft J-flex  "> 
                  <span  class="J-marginL30">当不足时，按指定计算：</span>
                  <el-input class="miniInput"></el-input> 
                  <span style="margin-left:7px">  方</span>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <div class="J-detail-title">
                  <div class="J-detail-title-yuan"></div>
                  计算方式  
              </div>
              <el-table  :data="PriceTableList.qjPriceTable" border  >
                <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                <el-table-column prop="XXX" label="目的地" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="区间1"  width='180' align='center'></el-table-column>
                <el-table-column prop="" label="区间2" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="运输时效" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="回单时效" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每票" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每方" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="提货费-免提（方）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="提货费-免提（吨）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每票" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每方" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-免提（方）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-免提（吨）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每方" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每件" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="添加时间" width="180" align='center'></el-table-column>       
                <el-table-column label="操作"  width="200" align='center' header-align="center"  fixed="right">
                  <template slot-scope="">
                    <div class="table-menu">
                      <el-menu  :collapse="true"  @select="handleSelect">
                        <el-submenu index="1" >
                          <template slot="title" >
                            <i class="el-icon-edit-outline"></i>
                          </template>
                          <el-menu-item-group> 
                            <el-menu-item index="1-1" >修改</el-menu-item> 
                            <el-menu-item index="1-3" >删除</el-menu-item>   
                          </el-menu-item-group>
                        </el-submenu> 
                      </el-menu>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <br> 
              <el-table  :data="PriceTableList.cxPriceTable" border  >
                <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                <el-table-column prop="XXX" label="目的地" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="车型：6.8米"  width='180' align='center'></el-table-column>
                <el-table-column prop="" label="车型：6.8米"  width='180' align='center'></el-table-column>
                <el-table-column prop="" label="车型：6.8米"  width='180' align='center'></el-table-column>
                <el-table-column prop="" label="车型：6.8米" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="运输时效" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="回单时效" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每票" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每方" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="提货费-免提（方）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="提货费-免提（吨）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每票" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每方" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-免提（方）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-免提（吨）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每方" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每件" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="添加时间" width="180" align='center'></el-table-column>       
                <el-table-column label="操作"  width="200" align='center' header-align="center"  fixed="right">
                  <template slot-scope="">
                    <div class="table-menu">
                      <el-menu  :collapse="true"  @select="handleSelect">
                        <el-submenu index="1" >
                          <template slot="title" >
                            <i class="el-icon-edit-outline"></i>
                          </template>
                          <el-menu-item-group> 
                            <el-menu-item index="1-1" >修改</el-menu-item> 
                            <el-menu-item index="1-3" >删除</el-menu-item>   
                          </el-menu-item-group>
                        </el-submenu> 
                      </el-menu>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
              <br>
              <el-table  :data="PriceTableList.djjgPriceTable" border  >
                <el-table-column fixed type="index" width="50" label="序号" align='center'></el-table-column>
                <el-table-column prop="" label="目的地" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="单件价格"  width='180' align='center'></el-table-column>
                <el-table-column prop="" label="运输时效" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="回单时效" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每票" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每方" width="180" align='center'></el-table-column>
                <el-table-column prop="" label="提货费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="提货费-免提（方）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="提货费-免提（吨）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每票" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每方" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-免提（方）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="送货费-免提（吨）" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每方" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每吨" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="装卸费-每件" width="180" align='center'></el-table-column>       
                <el-table-column prop="" label="添加时间" width="180" align='center'></el-table-column>       
                <el-table-column label="操作"  width="200" align='center' header-align="center"  fixed="right">
                  <template slot-scope="">
                    <div class="table-menu">
                      <el-menu  :collapse="true"  @select="handleSelect">
                        <el-submenu index="1" >
                          <template slot="title" >
                            <i class="el-icon-edit-outline"></i>
                          </template>
                          <el-menu-item-group> 
                            <el-menu-item index="1-1" >修改</el-menu-item> 
                            <el-menu-item index="1-3" >删除</el-menu-item>   
                          </el-menu-item-group>
                        </el-submenu> 
                      </el-menu>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </el-row>
          </div>  
        </el-dialog>
    </div>
</template>

<script>
import List from "@/utils/list.js";
import Base from "@/utils/base.js";
export default {
  mixins: [Base,List],
  data() {
    return {
        batchNum:0,//已选择0项
        PriceFormList:{
          priceAddForm:{//新增报价
            XXX:'',
            radio:'1'
          }
        },
        PriceTableList:{
          qjPriceTable:[{//区间table
            XXX:'',
          }],
           cxPriceTable:[{//车型table
            XXX:'',
          }],
           djjgPriceTable:[{//单件价格table
            XXX:'',
          }]
        },

        searchFrom: { //信息管理-价格管理 查询   
          XXX:'',
          pageSize: 10,
          pageNo: 1
        },



        startEndBillTime:[ //时间的搜索是一个数组
        ],
        DuizTable: [//信息管理-价格管理 表格
        ], 
        page:{
          pageSizes: [5, 10, 15, 20], //分页
          pageSize: 10, //当前选择分页数
          total: 0
        },
        multipleSelection: [], //多选
      };
    },

    created() {
      
    },
    methods: {
       DeleteConfirm(row){
        this.$confirm('此操作将永久删除该报价, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          center:true,
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
        }).catch(() => {
              
        });
      },
      handleSelect(key, keyPath) {//key: 选中菜单项的 key, keyPath: 选中菜单项的 key path  key==index
        // console.log(key, keyPath);
      },
      handleClick(row, id) {//点击运单号 传递了运单号和运单id
      },
      tabMagListClick(tab, event) {
        //tab切换  **
        this.searchfrom.status = tab.$vnode.data.key;
      },
    }
  };
</script>


<style>
.price-yuan{
  border:1px solid #000000;
  width:29px;
  height:29px;
  border-radius:100%;font-size:20px;text-align: center;line-height: 29px;display: inline-block;margin-bottom: 10px
}
.price-title-xian{
  border-bottom:1px solid #000000;
  position: absolute;
  top: 15px;
  left: 56px;
  width: 497px;
}
.price-title{
  position: relative;
  width: 610px;
    display: flex;
    margin: 0 auto;
    justify-content: space-between;
}
.price-title-right,.price-title-left{
  width: 84px;text-align: center;
}
</style>
