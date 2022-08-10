requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.4.1.min'
    }
});

define(['jquery','/js/modules/cartStorage.js'],function($,{getStorage,setStorage}){
    let $cart_list = $('.cart_list');
    let $cart_computed_all = $('.cart_computed_all');
    let $cart_computed_num = $('.cart_computed_num');
    initCart();
    bindCart();
    //初始化购物车
    function initCart(){
        let cartList = getStorage();
        let cartHtml = cartList.map((v)=>{
            return `
            <li>
                <div>${v.isChecked ? '<input class="cart_list_choose" checked type="checkbox">' : '<input class="cart_list_choose" type="checkbox">'}</div>
                <div>${v.goodsName} ( ${v.goodsType} )</div>
                <div>¥ ${v.goodsPrice}.00</div>
                <div>
                    <span class="cart_list_remove cart_list_btn">-</span>
                    <input class="cart_list_text" type="text" value="${v.goodsNumber}">
                    <span class="cart_list_add cart_list_btn">+</span>
                </div>
                <div>¥ ${v.goodsNumber * v.goodsPrice}.00</div>
                <div class="cart_list_delete">删除</div>
            </li>
            `
        }).join('')
        //合计
        $cart_list.html(cartHtml);
        let cartAll = 0;
        let cartNum = 0;
        for(let i = 0;i<cartList.length;i++){
            if(cartList[i].isChecked === true){

                cartNum += cartList[i].goodsNumber;
                cartAll += cartList[i].goodsPrice * cartList[i].goodsNumber;
            }
        }
        $cart_computed_all.html(cartAll);
        $cart_computed_num.html(cartNum);
    }
    //操作购物车
    function bindCart(){
        let cartList = getStorage();
        //加
        $cart_list.on('click','.cart_list_add',function(){  //事件委托的写法
            let index =  $(this).closest('li').index();
            cartList[index].goodsNumber++;
            setStorage(cartList);
            initCart();
        });
        //减
        $cart_list.on('click','.cart_list_remove',function(){  //事件委托的写法
            let index =  $(this).closest('li').index();
            if(cartList[index].goodsNumber > 1){
                cartList[index].goodsNumber--;
                setStorage(cartList);
                initCart();
            }
            
        })
        //修改输入框的数量
        $cart_list.on('change','.cart_list_text',function(){
            let value = Number($(this).val());
            let index = $(this).closest('li').index();
            if(isNaN(value) || value == ''){
                $(this).val(cartList[index].goodsNumber);
            }
            else{
                cartList[index].goodsNumber = value;
                setStorage(cartList);
                initCart();
            }
        })

        //删除功能
        $cart_list.on('click','.cart_list_delete',function(){
            let index = $(this).closest('li').index();
            cartList.splice(index,1);
            setStorage(cartList);
            initCart();
        })

        //选中状态
        $cart_list.on('click','.cart_list_choose',function(){
            let index = $(this).closest('li').index();
            cartList[index].isChecked = this.checked;
            setStorage(cartList);
            initCart();

            //影响全选按钮
            let allCheck = cartList.every((v)=>v.isChecked);
            $('.cart_title_selectAll').prop('checked',allCheck);
        })
        
        //全选功能
        $('.cart_title_selectAll').on('click',function(){
            //console.log(this.checked);
           for(let i = 0;i<cartList.length;i++){
                cartList[i].isChecked = this.checked;
           }
            setStorage(cartList);
            initCart();
        })
    }

})