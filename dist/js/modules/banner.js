
//轮播图模块
define(['jquery'],function($){
    let $bannerList = $('.banner-list');
    //从后端拿到轮播图的数据
    function initBanner(data){
        //data是后端传来的数据
        
        let html = `
        <ul>
            ${
                data.banner_list.map((v,i)=>{
                return `<li class="${i===0 ? 'show' : ''}"><a href="${v.imgLink}"><img src="${v.imgUrl}" alt=""></a></li>
                    `
                }).join('')
            }
        </ul>
        <ol>
        ${
            data.banner_list.map((v,i)=>{
            return `<li class="${i===0 ? 'active' : ''}"></li>
                `
            }).join('')
        } 
        </ol>
        `
        $bannerList.html(html); 
        bindBanner();
    }
//轮播图功能开发 实现自动播放,鼠标移入暂停播放,移出继续;点击按钮可切换对应图片
    function bindBanner(){
        let $ulLis = $bannerList.find('ul li');
        let now = -1;
        let timer = setInterval(move,3000)
        function move(){
            if(now === $ulLis.length - 1){
                now = 0;
              }else{
                now++;
              };
            $('ol li').eq(now).addClass('active').siblings().removeClass('active');
            $ulLis.eq(now).addClass('show').siblings().removeClass('show');
        };
        $bannerList.hover(
            function(){
            clearInterval(timer)},
            function(){
              timer = setInterval(move,3000)}
            );
        $('ol li').on('click',function(){
            let $index = $(this).index();
            $(this).addClass('active').siblings().removeClass('active');
            $ulLis.eq($index).addClass('show').siblings().removeClass('show');
            now = $index;
        })
    }

    return initBanner;
})