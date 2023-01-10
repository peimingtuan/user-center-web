import * as validate from './validator'

export const isMobile = (rule, value, callback) => {
    if(!value){
        callback(new Error('请输入手机号!'))
    }else if (value && !validate.isMobile(value)) {
        callback(new Error('请输入正确的手机号!'))
    } else {
        callback()
    }
}

export const isPhone = (rule, value, callback) => {
    if (value && !validate.isPhone(value)) {
        callback(new Error('请输入正确的电话号码!'))
    } else {
        callback()
    }
}

export const isNum = (rule, value, callback) => {
    if (value && !validate.isNum(value, 1)) {
        callback(new Error('请输入整数!'))
    } else {
        callback()
    }
}

export const isEmail = (rule, value, callback) => {
    if (value && !validate.isEmail(value)) {
        callback(new Error('请输入有效的邮箱!'))
    } else {
        callback()
    }
}

export const isURL = (rule, value, callback) => {
    if (value && !validate.isURL(value)) {
        callback(new Error('请输入有效的URL!'))
    } else {
        callback()
    }
}

export const isLowerCase = (rule, value, callback) => {
    if (value && !validate.isLowerCase(value)) {
        callback(new Error('请输入小写字母!'))
    } else {
        callback()
    }
}

export const isUpperCase = (rule, value, callback) => {
    if (value && !validate.isUpperCase(value)) {
        callback(new Error('请输入大写字母!'))
    } else {
        callback()
    }
}

export const isAlphabets = (rule, value, callback) => {
    if (value && !validate.isAlphabets(value)) {
        callback(new Error('请输入大小写字母!'))
    } else {
        callback()
    }
}

export const isName = (rule, value, callback) => {
    if (!value) {
        callback(new Error('请输入姓名!'))
    }else if(!validate.isName(value)){
        callback(new Error('请输入有效的姓名!'))
    }else{
        callback()
    }
}

export const isFloat = (rule, value, callback) => {
    if (value && !validate.isFloat(value)) {
        callback(new Error('请输入浮点数!'))
    } else {
        callback()
    }
}

export const isNull = (rule, value, callback) => {
    if (value && !validate.isNull(value)) {
        callback(new Error('必须为空!'))
    } else {
        callback()
    }
}

export const isCardId = (rule, value, callback) => {
    if (value && !validate.isCardId(value)) {
        callback(new Error('请输入合法的身份证号!'))
    } else {
        callback()
    }
}

export const isIntEqZero = (rule, value, callback) => {
    if (value && !validate.isIntEqZero(value)) {
        callback(new Error('请输入0!'))
    } else {
        callback()
    }
}
export const isIntGtZero = (rule, value, callback) => {
    if (value && !validate.isIntGtZero(value)) {
        callback(new Error('整数必须大于0!'))
    } else {
        callback()
    }
}
export const isIntGteZero = (rule, value, callback) => {
    if (value && !validate.isIntGteZero(value)) {
        callback(new Error('整数必须大于或等于0!'))
    } else {
        callback()
    }
}
export const isIntNEqZero = (rule, value, callback) => {
    if (value && !validate.isIntNEqZero(value)) {
        callback(new Error('整数必须不等于0!'))
    } else {
        callback()
    }
}

export const isIntLtZero = (rule, value, callback) => {
    if (value && !validate.isIntLtZero(value)) {
        callback(new Error('整数必须小于0!'))
    } else {
        callback()
    }
}

export const isIntLteZero = (rule, value, callback) => {
    if (value && !validate.isIntLteZero(value)) {
        callback(new Error('整数必须小于或等于0!'))
    } else {
        callback()
    }
}

export const isFloatEqZero = (rule, value, callback) => {
    if (value && !validate.isFloatEqZero(value)) {
        callback(new Error('浮点数必须为0!'))
    } else {
        callback()
    }
}

export const isFloatGtZero = (rule, value, callback) => {
    if (value && !validate.isFloatGtZero(value)) {
        callback(new Error('浮点数必须大于0!'))
    } else {
        callback()
    }
}
export const isFloatGteZero = (rule, value, callback) => {
    if (value && !validate.isFloatGteZero(value)) {
        callback(new Error('浮点数必须大于或等于0!'))
    } else {
        callback()
    }
}
export const isFloatNEqZero = (rule, value, callback) => {
    if (value && !validate.isFloatNEqZero(value)) {
        callback(new Error('浮点数必须不等于0!'))
    } else {
        callback()
    }
}

export const isFloatLtZero = (rule, value, callback) => {
    if (value && !validate.isFloatLtZero(value)) {
        callback(new Error('浮点数必须小于0!'))
    } else {
        callback()
    }
}

export const isFloatLteZero = (rule, value, callback) => {
    if (value && !validate.isFloatLteZero(value)) {
        callback(new Error('浮点数必须小于或等于0!'))
    } else {
        callback()
    }
}

export const isInteger = (rule, value, callback) => {
    if (value && !validate.isInteger(value)) {
        callback(new Error('必须为整数!'))
    } else {
        callback()
    }
}

export const isNumber = (rule, value, callback) => {
    if (value && !validate.isNumber(value)) {
        callback(new Error('请输入数字!'))
    } else {
        callback()
    }
}

export const isDigits = (rule, value, callback) => {
    if (value && !validate.isDigits(value)) {
        callback(new Error('只能输入[0-9]数字!'))
    } else {
        callback()
    }
}

export const isEnglish = (rule, value, callback) => {
    if (value && !validate.isEnglish(value)) {
        callback(new Error('只能包含英文字符。'))
    } else {
        callback()
    }
}
export const isTel = (rule, value, callback) => {
    if (value && !validate.isTel(value)) {
        callback(new Error('请正确填写您的联系方式'))
    } else {
        callback()
    }
}

export const isQq = (rule, value, callback) => {
    if (value && !validate.isQq(value)) {
        callback(new Error('请正确填写您QQ号码'))
    } else {
        callback()
    }
}

export const isZipCode = (rule, value, callback) => {
    if (value && !validate.isZipCode(value)) {
        callback(new Error('请正确填写您的邮政编码'))
    } else {
        callback()
    }
}

export const isPwd = (rule, value, callback) => {
    if (value && !validate.isPwd(value)) {
        callback(new Error('以字母开头，长度在6-12之间，只能包含字符、数字和下划线'))
    } else {
        callback()
    }
}

export const ip = (rule, value, callback) => {
    if (value && !validate.ip(value)) {
        callback(new Error('请填写正确的IP地址。'))
    } else {
        callback()
    }
}

export const stringCheck = (rule, value, callback) => {
    if (value && !validate.stringCheck(value)) {
        callback(new Error('只能包含中文、英文、数字、下划线等字符'))
    } else {
        callback()
    }
}

export const isChinese = (rule, value, callback) => {
    if (value && !validate.isChinese(value)) {
        callback(new Error('匹配汉字'))
    } else {
        callback()
    }
}

export const isChineseChar = (rule, value, callback) => {
    if (value && !validate.isChineseChar(value)) {
        callback(new Error('匹配中文(包括汉字和字符)'))
    } else {
        callback()
    }
}
export const isRightfulString = (rule, value, callback) => {
    if (value && !validate.isRightfulString(value)) {
        callback(new Error('判断是否为合法字符(a-zA-Z0-9-_)'))
    } else {
        callback()
    }
}

export const isPlateNo = (rule, value, callback) => {
    if (value && !validate.isPlateNo(value)) {
        callback(new Error('请输入合法车牌号'))
    } else {
        callback()
    }
}

export const isPort = (rule, value, callback) => {
    if (value && !validate.isPort(value)) {
        callback(new Error('请输入正确端口'))
    } else {
        callback()
    }
}

export const checkMac = (rule, value, callback) => {
    if (value && !validate.checkMac(value)) {
        callback(new Error('请输入正确Mac地址'))
    } else {
        callback()
    }
}

export default {
    isAlphabets,
    isCardId,
    isChinese,
    isChineseChar,
    ip,
    isFloatGteZero,
    isNum,
    stringCheck,
    isDigits,
    isEmail,
    isEnglish,
    isFloat,
    isFloatEqZero,
    isFloatGtZero,
    isFloatLtZero,
    isFloatLteZero,
    isFloatNEqZero,
    isIntEqZero,
    isIntGtZero,
    isIntGteZero,
    isIntLtZero,
    isIntLteZero,
    isIntNEqZero,
    isInteger,
    isLowerCase,
    isMobile,
    isName,
    isNull,
    isNumber,
    isPhone,
    isPlateNo,
    isPwd,
    isQq,
    isRightfulString,
    isTel,
    isURL,
    isUpperCase,
    isZipCode,
    isPort,
    checkMac
}
