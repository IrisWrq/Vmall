requirejs.config({
    paths:{
        'jquery':'/lib/jquery-3.4.1.min'
    }
});

define(['jquery','/js/modules/banner.js','/api/server.js','/js/modules/cartStorage.js'],function($,initBanner,{getDetailBanner,getPhpData,getGoodsDetail},{addStorage}){
    //详情页轮播图
    getDetailBanner().then((data)=>{
        initBanner(data);
    })

    /* getPhpData().then((data)=>{
        console.log(data);
    }) */

    let type = location.search.match(/type=([^&]+)/)[1];
    let id = location.search.match(/id=([^&]+)/)[1];
    /* 利用type(拿到商品类型,访问type类型的JSON文件),id(拿到指定的一条商品数据集合) 获取详情页数据 */

    getGoodsDetail(type,id).then((data)=>{
        //data 详情页数据
        //console.log(data);
        initGoods(data);
        bindGallery();
        bindMassage(data);
    })
    //详情页渲染初始数据
    function initGoods(data){
        //图片
        let $detail_gallery = $('.detail_gallery');
        let htmlGallery = 
             `
            <div class="detail_gallery_normal">
                <img src="${data.photoNormal}" alt="">
                <span></span>
            </div>
            <div class="detail_gallery_large">
                <img src="${data.photoLarge}" alt="">
            </div>`;
       
       $detail_gallery.html(htmlGallery);

       //商品信息
       let $detail_message = $('.detail_message');
       let htmlMassage = `
        <h2>${data.goodsName}</h2>
        <p>价 格 <span class="detail_message_price">¥${data.goodsPrice}.00</span></p>
        <p>选择颜色 
        ${
            data.chooseColor.map((v,i)=>{
                return `
                <span class="${i === 0 ? 'active' : ''} detail_message_box">${v}</span> 
                `
            }).join('')
        }
        </p>
        <div class="detail_message_btn clearfix">
            <div class="detail_message_num l">
                <input class="detail_message_number" type="text" value="1">
                <span class="detail_message_add">+</span>
                <span class="detail_message_remove">-</span>
            </div>
            <div class="detail_message_cart l"><a href="javascript:;">加入购物车</a></div>
            <div class="detail_message_computed l"><a href="/views/cart.html" target="_blank">立即下单</a></div>
        </div>
       `
       $detail_message.html(htmlMassage);

        //商品详情信息渲染 
       let $detailGoods = $('#detailGoods');
       let htmlDetail = `
        <h3>-- 商品详情 --</h3>
        ${

            data.goodsInfo.map((v)=>{
                return `
                <img src="${v}" alt="">
                `
            }).join('')
        }
       `;
       $detailGoods.html(htmlDetail);
    }

    //放大镜功能
    function bindGallery(){
        let $detail_gallery_normal = $('.detail_gallery_normal');
        let $span = $detail_gallery_normal.find('span');
        let $detail_gallery_large = $('.detail_gallery_large');
        let $img = $detail_gallery_large.find('img');
        $detail_gallery_normal.hover(
            //鼠标移入
            function(){
                $span.show();
                $detail_gallery_large.show();
            },
            //鼠标移出
            function(){
                $span.hide();
                $detail_gallery_large.hide();
            })
        $detail_gallery_normal.on('mousemove',function(ev){
            let L = ev.pageX - $detail_gallery_normal.offset().left - $span.width()/2;
            let T = ev.pageY - $detail_gallery_normal.offset().top - $span.height()/2;
            if(L < 0 ){
                L = 0;
            }else if(L > $detail_gallery_normal.width() - $span.width()){
                L = $detail_gallery_normal.width() - $span.width()
            };
            if(T < 0 ){
                T = 0;
            }else if(T > $detail_gallery_normal.height() - $span.height()){
                T = $detail_gallery_normal.height() - $span.height()
            };
            $span.css({
                left:L,
                top:T 
            })

            let LL = L / ($detail_gallery_normal.width() - $span.width());
            let TT = T / ($detail_gallery_normal.height() - $span.height());
            
            $img.css({
                left: - LL * ( $img.width() - $detail_gallery_large.width() ),
                top:- TT * ( $img.height() - $detail_gallery_large.height() )
            })

        })

    }

    //点击右侧信息切换选项
    function bindMassage(data){
        let $detail_message_box = $('.detail_message_box');
        let $detail_message_add = $('.detail_message_add');
        let $detail_message_number = $('.detail_message_number');
        let $detail_message_remove = $('.detail_message_remove');
        let $detail_message_cart = $('.detail_message_cart');
        //切换颜色
        $detail_message_box.on('click',function(){
            $(this).addClass('active').siblings().removeClass('active');
        })
        //加减
        $detail_message_add.on('click',function(){
            let value = $detail_message_number.val();
            value++;
            $detail_message_number.val(value);
            
        })
        $detail_message_remove.on('click',function(){
            let value = $detail_message_number.val();
            if(value > 1){
                value--;
                $detail_message_number.val(value);
            }else{
                value = 1;
            }
        })
        $detail_message_number.on('change',function(){
            let value = Number($detail_message_number.val()); 
            if(isNaN(value) || value == ''){
                $detail_message_number.val(1);
            }
        });

        //添加购物车功能
    $detail_message_cart.on('click',function(){
        let ret = {
            goodsName:data.goodsName,
            goodsType:$detail_message_box.filter('.active').html(),
            goodsPrice:data.goodsPrice,
            goodsNumber:Number($detail_message_number.val()),
            isChecked:false
        }
        addStorage(ret);
    })

    }

    
    
    
})