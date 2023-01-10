window.onbeforeunload=function(){
    window.removeEventListener('message',messageHandel)
}
if(window.addEventListener){
    window.addEventListener('message',messageHandel,false)
}
//接收父页面的传值
function messageHandel(event){
    let res=event.data;
    console.log('我是父页面传来的值',res)
    if(res.commandType){
        switch (res.commandType){
            case "setToken":
                localStorage.setItem("tokenKey",res.token)
                break;
            case "getToken":
                if(localStorage.getItem('tokenKey')){
                    parentHandleEvent({tokenVisible:1,token:localStorage.getItem('tokenKey')})
                }else{
                    parentHandleEvent({tokenVisible:0,token:''})
                }
                break;
        }
    }
}
// 触发父页面的监听事件
export function parentHandleEvent(data){
    parent.window.postMessage(data, '*');
}
