import chinaAddress from './src/main';

chinaAddress.install = function(Vue) {
    Vue.component(chinaAddress.name, chinaAddress);
};

export default chinaAddress;