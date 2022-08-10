define(['jquery'],function($){

    function getIndexBanner(){
        return $.ajax('/api/mock/banner.json');
    }

    function getDetailBanner(){
        return $.ajax('/api/mock/banner2.json')
    }

    function getPhpData(){
        return $.ajax('http://localhost/vmall-data/users.php')
    }

    function getGoodsData(type){
        return $.ajax(`/api/mock/${type}.json`)
    }

    function getGoodsDetail(type,id){
        return $.ajax(`/api/mock/${type}.json`).then((data)=>{
            return data.goods_list.find((v)=>{return v.goodsId === id});
        });
    }
    
    return {
        getIndexBanner,
        getDetailBanner,
        getPhpData,
        getGoodsData,
        getGoodsDetail,
    };
})