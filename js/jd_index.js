window.onload=function(){
    headerOpacity();
    timeBack();
    bannerUpdate();
}
function headerOpacity(){
    //头
    var jd_header =document.querySelector('.jd_header')
    //轮播图高度
    var jd_bannerh= document.querySelector('.jd_banner').offsetHeight
    //window滚动事件
    window.onscroll=function(){
        var offsetTop =document.body.scrollTop +document.documentElement.scrollTop
        //计算透明度
        var opacity = offsetTop/jd_bannerh
        if(offsetTop>jd_bannerh){
            opacity=1
        }
        jd_header.style.backgroundColor=`rgba(233,35,34,${opacity})`

    }
}
function timeBack(){
    var allSpan =document.querySelectorAll(".sk_time > span")
    var total=30000
    var timerid=setInterval(()=>{
        total--
        if(total<0){
            clearInterval(timerid)
            return 
        }
        //获取时分秒
        var hour =Math.floor(total/3600)
        var minute =Math.floor(total%3600/60)
        var second =total % 60
        //span框里面的数值
        allSpan[0].innerHTML = Math.floor(hour/10)
        allSpan[1].innerHTML = Math.floor(hour % 10)
        allSpan[3].innerHTML = Math.floor(minute / 10)
        allSpan[4].innerHTML = Math.floor(minute % 10)
        allSpan[6].innerHTML = Math.floor(second / 10)
        allSpan[7].innerHTML = Math.floor(second % 10)
    },1000)
}
function bannerUpdate(){
    var jd_banner = document.querySelector('.jd_banner')
    var jd_bannerImg = document.querySelector('.jd_bannerImg')
    var jd_bannerImgW = jd_banner.offsetWidth

    // 1.获取第一张图片--本质来说应该是li结构
    var first = jd_bannerImg.querySelector('li:nth-of-type(1)')
    // 2.获取最后一张图片
    var last = jd_bannerImg.querySelector('li:nth-last-of-type(1)')
    // 3.将第一张图片追加到最后:cloneNode(true):深拷贝：拷贝节点为及里面的子元素
    jd_bannerImg.appendChild(first.cloneNode(true))
    // 4.将最后一张图片插入到最前面
    jd_bannerImg.insertBefore(last.cloneNode(true),first)
    // 5.由于新增了两张图片，所有样式也需要进行重置
    // 5.1 ul的宽度需要重新设置：li的新数量 * li宽度
    // li的数量：重新获取
    var allLi = jd_bannerImg.querySelectorAll('li')
    var count = allLi.length
    // li宽度：就是轮播图父容器宽度
    jd_bannerImg.style.width = (count * jd_bannerImgW) + "px"
    // 5.2 为每一个li元素设置宽度
    allLi.forEach((value,index) => {
        value.style.width = jd_bannerImgW + 'px'
    })
    // 5.3 实现默认 偏移
    jd_bannerImg.style.left = -jd_bannerImgW + 'px'

    // 将轮播图结构重新显示 
    jd_bannerImg.style.display = 'block'

    // 6.实现 自动 轮播
    var index = 1
    var timeId = setInterval(() => {
        index ++
        // 添加 过渡效果
        jd_bannerImg.style.transition = 'left .4s'
        jd_bannerImg.style.left = -(index * jd_bannerImgW) + 'px'
        
    }, 2000);

    // 7. 实现手动轮播
    // startX：手指起始x坐标,disX:在水平方向上的滑动距离 
    var startX,disX,moveX
    // 7.1 添加手指滑动事件
    jd_bannerImg.addEventListener('touchstart',function(e){
        // 清除定时器
        clearInterval(timeId)
        // 获取手指起始x坐标
        startX = e.targetTouches[0].clientX
    })
    jd_bannerImg.addEventListener("touchmove",function(e){
        // 在手指滑动过程 中重新获取手指的x坐标
        moveX = e.targetTouches[0].clientX
        // 计算本次事件触发需要偏移的距离 
        disX = moveX - startX
        // 清除之前 可能添加的过渡 效果
        jd_bannerImg.style.transition = 'none'
        // 实现偏移:一定要在当前 元素的偏移基础之上 再进行偏移
        jd_bannerImg.style.left = -(index * jd_bannerImgW) + disX + 'px'
    })

    jd_bannerImg.addEventListener('touchend',function(e){
        //
        flag =false
        // 滑动是否超过指定的距离 (100)
        if(Math.abs(disX) > 100){
            // 实现 翻页
            if(disX > 0){
                index --
            }else {
                index ++
            }
            jd_bannerImg.style.transition = 'left .4s'
            jd_bannerImg.style.left = -(index * jd_bannerImgW) + 'px'
        }else if(Math.abs(disX) > 0){
            // 则回到原始 的索引 位置
            jd_bannerImg.style.transition = 'left .4s'
            jd_bannerImg.style.left = -(index * jd_bannerImgW) + 'px'
        }
    })

    // 添加 过渡 效果结束 的监听 
    jd_bannerImg.addEventListener('transitionend',function(){
        // 判断索引 ：是否到了最后一 张
        if(index == count - 1){
            // 以用记看不清的方式移动到指定的索引位置
            // 过渡效果需要清除 如果对元素添加了过渡效果，那么除非手动清除，否则 过渡 效果会一直存在，所以我们需要清除之前可能添加的过渡效果
            index = 1
            jd_bannerImg.style.transition = 'none'
            jd_bannerImg.style.left = -(index * jd_bannerImgW) + 'px'
        }
        else if(index == 0){
            index = count - 2
            jd_bannerImg.style.transition = 'none'
            jd_bannerImg.style.left = -(index * jd_bannerImgW) + 'px'
        }
        setIndicator(index)
        setTimeout(()=>{
            flag = true
        },100)
    })
    //设置小点点
    var allLi = jd_banner.querySelector('.jd_bannerIn').querySelectorAll('li')
    function setIndicator(index){
        for(var i=0;i<allLi.length;i++){
            allLi[i].classList.remove('active')
        }
        allLi[index-1].classList.add('active')
    }

}