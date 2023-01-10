<template>
    <div class="index-main">
        <edit-password-dialog ref="editPasswordDialog"/>
        <certification-dialog ref="certificationDialog"/>
        <add-portal-dialog ref="addPortalDialog"/>
        <div class="head">
            <div class="head-left">
                <img src="../assets/imgs/head/u18499.png" />
                {{systemNameValue}}
            </div>
            <div class="head-con">
                <div v-for="(item,index) in titleMenuList" :class="topActiveAd===item.id?'active':''" :key="index" @click="choiceModule(item)">
                    <router-link :to="item.url" tag="div">{{item.name}}</router-link>
                </div>
            </div>
            <div class="head-right">
               <div v-show="topActiveAd===0" @click="openAddPortal">
                   <el-badge :value="valueLength" class="portal-info-box">
                       <i class="el-icon-setting"></i>
                   </el-badge>
               </div>
                <!--<el-popover-->
                        <!--placement="bottom"-->
                        <!--width="400"-->
                        <!--trigger="click">-->
                    <!--<div class="info-main">-->
                        <!--<div class="info-main-title">-->
                            <!--<div>消息通知</div>-->
                            <!--<div>全部已读</div>-->
                        <!--</div>-->
                        <!--<div class="info-main-content" v-for="(item,index) in infoList" :key="index">-->
                            <!--<div>{{item.text}}</div>-->
                            <!--<div>{{item.time}}</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<el-badge :value="12" class="info-box" slot="reference">-->
                        <!--<i class="el-icon-bell"></i>-->
                    <!--</el-badge>-->
                <!--</el-popover>-->
                <!--<div>-->
                    <!--<el-popover-->
                            <!--placement="bottom"-->
                            <!--width="400"-->
                            <!--trigger="click">-->
                        <!--<div class="work-date">-->
                            <!--<div class="work-date-title">-->
                                <!--<div>工作日历</div>-->
                                <!--<div>添加事项</div>-->
                            <!--</div>-->
                            <!--<div class="work-date-content">-->
                                <!--<div>-->
                                    <!--<el-date-picker-->
                                            <!--v-model="value1"-->
                                            <!--type="date"-->
                                            <!--placeholder="选择日期">-->
                                    <!--</el-date-picker>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                        <!--<i class="el-icon-date" slot="reference"></i>-->
                    <!--</el-popover>-->
                <!--</div>-->
                <div class="user-box">
                    <el-dropdown trigger="click">
                        <span class="el-dropdown-link">
                            <i class="el-icon-s-custom"></i>
                            <i class="el-icon-caret-bottom el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(item,index) in selectList" :key="item.id"  @click.native="openItem(item.id)">
                                {{item.name}}
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div>
                    欢迎{{userName}}
                </div>
            </div>
        </div>
        <div class="main">
            <transition name="slide2-fade">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>

<script>
    import * as api from "@/api/common-api"
    import {mapState,mapMutations,mapActions} from "vuex"
    export default {
        name: 'indexMain',
        components: {
            editPasswordDialog:()=>import("@/views/common/EditPasswordDialog"),
            certificationDialog:()=>import("@/views/common/CertificationDialog"),
            addPortalDialog:()=>import("@/views/common/AddPortalDialog")
        },
        data() {
            return {
                infoList:[
                    {
                        id:0,text:'【结案审批】您于2020-08-01 13:19 提请的(2020)鲁民初字123号，张孙明已审批未通过！原因：…审批未通过。',time:'2019-05-31   08:55'
                    },
                    {
                        id:1,text:'【结案审批】您于2019-05-31   08:55提请的(2019)鲁1民初001号案件，审批通过。',time:'2019-05-31   08:55'
                    }
                ],
                selectList:[
                    {id:0,name:'修改密码'},
                    // {id:1,name:'实名认证'},
                    // {id:2,name:'帮助'},
                    // {id:3,name:'建议'},
                    // {id:4,name:'关于'},
                    {id:5,name:'退出'}
                ],
            }
        },
        watch: {
            topActiveAd(v){
                switch (v) {
                    case 1:
                        this.setDefaultActive('1');
                        break;
                    case 2:
                        this.saveActive('1')
                }
            }
        },
        computed:{
            ...mapState("indexmain",[
                "topActiveAd"
            ]),
            titleMenuList(){
                return this.$store.state.titleMenuList
            },
            valueLength(){
                let arr=[];
                this.$store.state.portalList.map(item=>{
                    if(item.isDisplay===2)arr.push(item)
                })
                return arr.length
            },
            userName(){
                return this.$store.state.userName
            },
            systemNameValue(){
                return this.$store.state.systemNameValue
            }
        },
        created() {
            this.getUserName()
        },
        mounted() {

        },
        methods: {
            ...mapMutations("indexmain", ["setTopActiveAd"]),
            ...mapMutations("systemmanagement",["setDefaultActive"]),
            ...mapActions("logmanagement",["saveActive"]),
            //获取用户名称
            async getUserName(){
                let res=await api.getUserName(this.$store.state.userId)
                this.$store.commit('setUserName',res.body.name)
            },
            choiceModule(item) {
                this.setTopActiveAd(item.id)
            },
            //打开添加Portal
            openAddPortal(){
                if(this.valueLength!==0)this.$refs.addPortalDialog.show()
                else this.$msgW("没有可添加的项")
            },
            openItem(id){
                switch(id){
                    case 0:
                        this.editPassword();
                        break;
                    case 1:
                        this.certification();
                        break;
                    case 5:
                        this.goOut();
                        break;
                }
            },
            //修改密码
            editPassword(){
                this.$refs.editPasswordDialog.show()
            },
            //实名认证
            certification(){
                this.$refs.certificationDialog.show()
            },
            async goOut(){
                await api.logout()
                if(sessionStorage.getItem('loginType')==1)this.$router.push({path:'/Login'})
                else this.$router.push({path:'/IntranetLogin'})
            }
        }
    }
</script>

<style lang="less" scoped>
    .index-main {
        background: #ededed;

        .head {
            position:relative;
            padding: 0 20px;
            height: 60px;
            cursor: pointer;
            /*background:rgba(27, 102, 170, 1);*/
            /*box-shadow: 2px 2px 10px 0 rgba(0, 0, 0, 0.10);*/
            background-image: url("../assets/imgs/head/bg.png");
            background-size: 100%;
            background-position: bottom;
            background-repeat: no-repeat;
            display: flex;
            justify-content: space-between;
            align-items: center;
            div {
                color: #fff;
            }

            &-left {
                font-size: 20px;
                img{
                    width: 35px;
                    vertical-align: middle;
                    margin-right: 5px;
                    position:relative;
                    top:-1px;
                }
            }
            &-right{
                display: flex;
                justify-content: space-between;
                align-items: center;
                .portal-info-box{
                    margin-right:20px;
                }
                &>div{
                    margin-left:20px;
                }
                i{
                    font-size:20px;
                    color:#fff;
                }
                .info-box{
                    margin-right:5px;
                }
                .user-box{

                }
            }
            &-con{
                position:absolute;
                left:400px;
                display:flex;
                justify-content: center;
                align-items: center;
                &>div{
                    div{
                        /*line-height:60px;*/
                        line-height:35px;
                        padding:0 20px;
                        font-size:16px;
                    }
                }
            }
            .active{
                //background: #5598FF;
                /*background-color:rgba(73, 133, 187, 1);*/
                border-radius:20px;
                background:#fff;
                div{
                    color:#2F8DED;
                }
            }
        }

        .main {
            height:calc(100vh - 60px);
            background: #FFFFFF;
        }
    }
</style>
<style lang="less">
    @import "../assets/css/common.less";
    .el-popover{
        .info-main{
            &-title{
                line-height:20px;
                padding:10px 0;
                border-bottom:1px solid #dcdcdc;
                .fb();
                &>div:first-child{
                    padding-left:5px;
                    border-left:2px solid #409EFF;
                    .f16()
                }
                &>div:last-child{
                   cursor:pointer;
                }
            }
            &-content{
                padding:10px 0;
                border-bottom:1px dashed #dcdcdc;
                &>div:last-child{
                    margin-top:5px;
                    color:#D2D2D2;
                }
            }
        }
        .work-date{
            &-title{
                line-height:20px;
                padding:10px 0;
                border-bottom:1px solid #dcdcdc;
                .fb();
                &>div:first-child{
                    padding-left:5px;
                    border-left:2px solid #409EFF;
                    .f16()
                }
                &>div:last-child{
                    color:#409EFF;
                    cursor:pointer;
                }
            }
            &-content{
                padding:10px 0;
            }
        }
    }
</style>