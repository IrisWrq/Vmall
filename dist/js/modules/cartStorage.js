//本地存储数据

define(['jquery','/api/server.js'],function($,{getGoodsDetail}){
    //设置本地存储
    //判断存储的数据,是否已存在,存在累加,不存在新增
    /* [{
        goodsName:xxx,
        goodsType:xxx,
        goodsPrice:xxx,
        goodsNumber:xxx,
        isChecked:false
    }]     */
    let key = 'cartList';
    //添加数据
    function addStorage(data){
        let cartList = getStorage();
        let flag = true;
        let index = -1;
        for(let i = 0;i<cartList.length;i++){
            if(cartList[i].goodsName === data.goodsName && cartList[i].goodsType === data.goodsType){
                flag=false;
                index = i;
            }
        }
        if(flag){
            cartList.unshift(data);
        }else{
            cartList[index].goodsNumber += data.goodsNumber;
        }
        setStorage(cartList);
        alert('添加购物车成功');
    }
    //设置数据
    function setStorage(cartList){
        localStorage.setItem(key,JSON.stringify(cartList))
    }
    //获取数据
    function getStorage(){
        return JSON.parse(localStorage.getItem(key)||'[]');
    }

    return {
        addStorage,
        setStorage,
        getStorage
    }

})