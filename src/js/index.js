//首页逻辑开发

requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.4.1.min'
    }
})

define(['jquery','/js/modules/banner.js','/api/server.js'],function($,initBanner,{getIndexBanner}){

    getIndexBanner().then((data)=>{
        initBanner(data);
    })
});