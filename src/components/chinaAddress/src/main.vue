<template>
    <div class="area">
        <el-select v-model="provinceCode" placeholder="省" class="select" clearable @clear="clear">
            <el-option v-for="item in provinceList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
        </el-select>
        <div>&nbsp;省&nbsp;</div>
        <el-select v-model="cityCode" placeholder="市" class="select">
            <el-option v-for="item in cityList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
        </el-select>
        <div>&nbsp;市&nbsp;</div>
        <el-select v-model="countryCode" placeholder="区" class="select">
            <el-option v-for="item in countryList" :key="item.value" :label="item.name" :value="item.value">
            </el-option>
        </el-select>
        <div>&nbsp;区&nbsp;</div>
    </div>
</template>
<script>
import chinaAddressData from './china-address-data'
export default {
    name: 'chinaAddress',
    data() {
        return {
            provinceCode: '', //省code
            cityCode: '', //市code
            countryCode: '', //县code
            provinceList: [], //省表数据
            cityList: [], //具体省下面市列表数据
            countryList: [], //具体市下面县列表数据
            addressCode: [], //组件内部省市县code数组
        }
    },
    props: {
        value: {
            type: Array,
            default () {
                return []
            }
        },
    },
    computed: {

    },
    components: {

    },
    watch: {
        value(newVal, oldVal) {
            if (newVal.length) {
                const [provinceCode, cityCode, countryCode] = newVal
                this.provinceCode = provinceCode ? provinceCode : ''
                this.cityCode = cityCode ? cityCode : ''
                this.countryCode = countryCode ? countryCode : ''
            }
        },
        provinceCode(newVal, oldVal) {
            if (newVal) {
                this.cityList = chinaAddressData.filter(val => val.parent === newVal)
                this.cityCode = this.cityList[0].value
            }
            this.emitValueChange()
        },
        cityCode(newVal, oldVal) {
            if (newVal) {
                this.countryList = chinaAddressData.filter(val => val.parent === newVal)
                this.countryCode = this.countryList[0].value

            }
            this.emitValueChange()
        },
        countryCode(newVal, oldVal) {
            this.emitValueChange()
        }
    },
    mounted() {

    },
    created() {
        this.provinceList = chinaAddressData.filter(val => !val.parent)
    },
    methods: {
        emitValueChange() {
            this.$nextTick(() => {
                this.addressCode = [].concat(this.provinceCode, this.cityCode, this.countryCode).filter(val => val)
                this.$emit('input', this.addressCode)
                const addressInfo = {
                    provinceCode: '',
                    provinceName: '',
                    cityCode: '',
                    cityName: '',
                    countryCode: '',
                    countryName: '',
                }
                if (this.addressCode.length) {
                    const [provinceCode, cityCode, countryCode] = this.addressCode
                    addressInfo.provinceCode = provinceCode
                    addressInfo.cityCode = cityCode
                    addressInfo.countryCode = countryCode
                    addressInfo.provinceName = chinaAddressData.find(val => val.value === provinceCode)['name']
                    addressInfo.cityName = chinaAddressData.find(val => val.value === cityCode)['name']
                    addressInfo.countryName = chinaAddressData.find(val => val.value === countryCode)['name']
                }
                this.$emit('change', addressInfo)
            })
        },
        clear() {
            this.provinceCode = ''
            this.cityCode = ''
            this.countryCode = ''
            //清空select框
            this.cityList=[]
            this.countryList=[]
            this.emitValueChange()
        }
    },

}
</script>
<style lang="less" scoped>
.area {
    width: 100%;
    display: flex;
   .select {
       width: 26%;
   }
}
</style>