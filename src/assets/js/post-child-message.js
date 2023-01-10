//向子页面发送消息
//document.getElementById("mainIframe").contentWindow.postMessage('我是来自父页面的内容','*')
export function sendChildMessage(){
    let $dom=document.querySelectorAll('.mainIframe');
    for(let i=0;i<$dom.length;i++){
        $dom[i].contentWindow.postMessage('我是来自父页面的内容','*')
    }
}
export function initF(){
    window.onbeforeunload=function(){
        window.removeEventListener('message',childMessageHandel)
    }
    // 注册消息事件监听，接受子元素给的数据
    if(window.addEventListener){
        window.addEventListener('message', childMessageHandel, false);
    }
    function childMessageHandel(event){
        console.log('我是来自子页面的消息',event)
    }
}

