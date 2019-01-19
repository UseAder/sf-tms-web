import Vuex from 'vuex'
import Vue from 'vue'
import * as types from './types'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        user: {},
        aliveRoute:[],
        //监听页面高度变化 
        screenHeight:'',
        //监听页面宽度变化 
        screenWidth:''

    },
    mutations: {
        [types.COMMAND_LOGIN]: (state, data) => {
            state.user = data.user;
            sessionStorage.setItem('token',data.token)
            sessionStorage.setItem('user',JSON.stringify(data.user))
        },
        [types.COMMAND_REFRESH]: (state) => {
            state.user = JSON.parse(sessionStorage.getItem('user'))
        },
        [types.COMMAND_LOGOUT]: (state) => {
            sessionStorage.clear();
            state.user = null
        },
        deleteKeepAliveRoute:(state,payload)=>{
                for(var i=0; i<state.aliveRoute.length; i++) {
                    if(state.aliveRoute[i] == payload) {
                        state.aliveRoute.splice(i, 1);
                    }
              }
        },
        addKeepAliveRoute:(state,payload)=>{
            let param = state.aliveRoute.find((n) => (n == payload));    
            if(!param){
                state.aliveRoute.push(payload);
            }
        },
        changeScreenHeight:(state,payload)=>{
                state.screenHeight=payload
        },
        changeScreenWidth:(state,payload)=>{
            state.screenWidth=payload
        },    
    },
    getters:{
        //获取数据的方法
        userName:  (state) => { 
            return state.user.employeeName 
        },
        //获取数据的方法
        enterpriseName:  (state) => { 
            return state.user.enterpriseName 
        },
        shortEnterpriseName:  (state) => { 
            return state.user.shortEnterpriseName 
        },
        gaicounter:state=>{
            return state.aliveRoute
        },    
        keepAliveRoute:  (state) => {
            return state.aliveRoute
        },
        getScreenHeight:  (state) => {
            return state.screenHeight
        },
        getScreenWidth:  (state) => {
            return state.screenWidth
        }
    },
    actions:{
        //
    }
})