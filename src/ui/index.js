import {Message,Loading} from 'element-ui'

// 封装全局loading
let loading = null;
const openLoading = obj => {
  loading = Loading.service({
    lock: obj ? obj.lock ? obj.lock : true : true,
    text: obj ? obj.text ? obj.text : '正在加载...' : '正在加载...',
    spinner: obj ? obj.spinner ? obj.spinner : 'el-icon-loading' : 'el-icon-loading',
    background: obj ? obj.background ? obj.background : 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.9)'
  });
  return true;
}
const closeLoading = () => {
  if (loading) {
    loading.close();
    loading = null;
  }
}
// 封装elementui成功提示弹框
const successMsg = msg => {
  Message({
    showClose: true,
    message: msg,
    type: 'success'
  });
};
// 封装elementui失败提示弹框
const errorMsg = msg => {
  Message({
    showClose: true,
    message: msg,
    type: 'error'
  });
};
// 封装elementui警告提示弹框
const warningMsg = msg => {
  Message({
    showClose: true,
    message: msg,
    type: 'warning'
  });
};

export { 
  loading,
  openLoading,
  closeLoading,
  successMsg,
  errorMsg,
  warningMsg
}