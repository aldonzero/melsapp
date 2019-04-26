import JsonP from 'jsonp'
import axios from 'axios'
import { Modal } from 'antd'
const requstApi = 'https://www.easy-mock.com/mock/5cac9d333040f52aa81fa9d9/api/';
export default class Axios {
    
    static jsonp(options) {
        return new Promise((resolve, reject) => {
            JsonP(options.url, {
                param: 'callback'
            }, function (err, response) {
                if (response.status == 'success') {
                    resolve(response);
                } else {
                    reject(response.messsage);
                }
            })
        })
    }
    
    

    static ajax(options){
        let loading ;
        if (options.data && options.data.isShowLoading !== false){
            // loading = document.getElementById('ajaxLoading');
            // loading.style.display = 'block';
        }
        return new Promise((resolve,reject)=>{
            console.log(9632588)
            axios({
                url:options.url,
                method:options.method || 'get',
                baseURL:requstApi,
                timeout:5000,
                data:options.data,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                //  document.getElementById('ajaxLoading').style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            }).catch((response)=>{
                Modal.info({
                    title:"提示",
                    content:"系统错误请重试"
                })
                // document.getElementById('ajaxLoading').style.display = 'none';
            })
        });
    }

    static get(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            // loading = document.getElementById('ajaxLoading');
            // loading.style.display = 'block';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'get',
                baseURL:requstApi,
                timeout:5000,
                params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    // loading = document.getElementById('ajaxLoading');
                    // loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }

    static post(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            // loading = document.getElementById('ajaxLoading');
            // loading.style.display = 'block';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'post',
                baseURL:requstApi,
                timeout:5000,
                data:options.data
                // params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    // loading = document.getElementById('ajaxLoading');
                    // loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }

    static delete(options){
        let loading;
        if (options.data && options.data.isShowLoading !== false){
            // loading = document.getElementById('ajaxLoading');
            // loading.style.display = 'block';
        }
        return new Promise((resolve,reject)=>{
            axios({
                url:options.url,
                method:'delete',
                baseURL:requstApi,
                timeout:5000,
                data:options.data
                // params: (options.data && options.data.params) || ''
            }).then((response)=>{
                if (options.data && options.data.isShowLoading !== false) {
                    // loading = document.getElementById('ajaxLoading');
                    // loading.style.display = 'none';
                }
                if (response.status == '200'){
                    let res = response.data;
                    if (res.code == '0'){
                        resolve(res);
                    }else{
                        Modal.info({
                            title:"提示",
                            content:res.msg
                        })
                    }
                }else{
                    reject(response.data);
                }
            })
        });
    }
}