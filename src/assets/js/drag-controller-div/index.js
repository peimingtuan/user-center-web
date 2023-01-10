import store from '@/store'
let echarts=require('echarts')
class dragControllerDiv{
    init(){
        let that=this;
        let boxDraggable = document.getElementsByClassName('list-complete-drap'),
            resizeW = document.getElementsByClassName('resize-w'),
            resizeH = document.getElementsByClassName('resize-h'),
            componentBox = document.getElementsByClassName('component-box');
        for (let i = 0; i < resizeW.length; i++) {
            // 鼠标按下事件
            resizeW[i].onmousedown = function (e) {
                let parentNode=e.target.parentNode;
                let startX = e.clientX;
                resizeW[i].left = resizeW[i].offsetLeft;
                // 鼠标拖动事件
                document.onmousemove = function (e) {
                    let endX = e.clientX;
                    let moveLen = resizeW[i].left + (endX - startX);
                    let maxT = boxDraggable[0].clientWidth - resizeW[i].offsetWidth; // 容器宽度 - 左边区域的宽度 = 右边区域的宽度
                    if (moveLen < 150) moveLen = 150; // 左边区域的最小宽度为10px
                    if (moveLen > maxT - 10) moveLen = maxT - 10; //右边区域最小宽度为10px
                    parentNode.style.width = that.getPercent(moveLen,boxDraggable[0].clientWidth);
                };
                // 鼠标松开事件
                document.onmouseup = function (evt) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    store.dispatch('editPortal',{userPortletId:resizeW[i].getAttribute('setid'),type:'X',length:parentNode.style.width})
                    if(componentBox[i].firstChild.className==='echarts-resize-box')echarts.getInstanceByDom(componentBox[i].firstChild).resize()
                    resizeW[i].releaseCapture && resizeW[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                };
                resizeW[i].setCapture && resizeW[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                return false;
            };
        }
        for (let i = 0; i < resizeH.length; i++) {
            // 鼠标按下事件
            resizeH[i].onmousedown = function (e) {
                let parentNode=e.target.parentNode;
                let startY = e.clientY;
                resizeH[i].top = resizeH[i].offsetTop;
                // 鼠标拖动事件
                document.onmousemove = function (e) {
                    let endY = e.clientY;
                    let moveLen = resizeH[i].top + (endY - startY);
                    if (moveLen < 60) moveLen = 60;
                    resizeH[i].style.top = moveLen;
                    parentNode.style.height = moveLen+'px';
                };
                // 鼠标松开事件
                document.onmouseup = function (evt) {
                    document.onmousemove = null;
                    document.onmouseup = null;
                    store.dispatch('editPortal',{userPortletId:resizeW[i].getAttribute('setid'),type:'Y',length:parentNode.style.height})
                    if(componentBox[i].firstChild.className==='echarts-resize-box')echarts.getInstanceByDom(componentBox[i].firstChild).resize()
                    resizeH[i].releaseCapture && resizeH[i].releaseCapture(); //当你不在需要继续获得鼠标消息就要应该调用ReleaseCapture()释放掉
                };
                resizeH[i].setCapture && resizeH[i].setCapture(); //该函数在属于当前线程的指定窗口里设置鼠标捕获
                return false;
            };
        }
    }
    getPercent(num, total) {
        num = parseFloat(num);
        total = parseFloat(total);
        if (isNaN(num) || isNaN(total)) {
            return "-";
        }
        return total <= 0 ? "0%" : parseInt((Math.round(num / total * 10000) / 100.00))+"%";
    }
}
export default new dragControllerDiv()