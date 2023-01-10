import $ from 'jquery'
const FoundationTools = {
    /**
     * 获取url参数
     */
    getUrlParam: function (name) {
        let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        let r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        else return "";
    },
    /**
     * 获取时间标准格式
     */
    getFormatDate: function (date) {
        let seperator1 = "-",
            seperator2 = ":",
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate
            + " " + date.getHours() + seperator2 + date.getMinutes()
            + seperator2 + date.getSeconds();
        return currentdate;
    },
    //获取日期
    getFormatDate2: function (date) {
        let seperator1 = "-",
            year = date.getFullYear(),
            month = date.getMonth() + 1,
            strDate = date.getDate();
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }
        if (strDate >= 0 && strDate <= 9) {
            strDate = "0" + strDate;
        }
        let currentdate = year + seperator1 + month + seperator1 + strDate;
        return currentdate;
    },
    /**
     * 设置与获取浏览器cookie
     */
    //存储为天数
    setCookie: function (c_name, value, expiredays) {
        let exdate = new Date();
        exdate.setDate(exdate.getDate() + expiredays);
        document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
    },
    //存储为小时
    setCookie1: function setCookie(name, value, time) {
        let exp = new Date();
        exp.setTime(exp.getTime() + time * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getCookie: function (name) {
        let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))return (unescape(arr[2]));
        else return null;
    },
    //删除cookie
    delCookie: function (name) {
        let exp = new Date();
        exp.setTime(exp.getTime() - 1);
        let cval = this.getCookie(name);
        if (cval != null) {
            document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }
    },
    //同步ajax事件
    syncRequest: function (param, url) {
        let result = null;
        $.ajax({
            timeout: 3000,
            type: "post",
            url: url,
            //dataType: "json",
            //contentType: "application/json",
            data: param,
            async: false,
            success: function (data) {
                result = data;
            },
            error: function (data) {
                result = data;
            }
        });
        return result;
    },
    //截取链接
    getUrlvue (linkUrl) {
        let str, arr, newArr, num, num2, i, j, newJson
        if (linkUrl) {
            str = decodeURIComponent (linkUrl.split('?')[1])
            arr = str.split('&')
            num = arr.length
            newJson = {}
            for (i = 0; i < num; i++) {
                newArr = arr[i].split('=')
                num2 = newArr.length
                newJson[newArr[0]] = newArr[1]
            }
            return newJson
        } else {
            return {}
        }
    }
}
export default FoundationTools