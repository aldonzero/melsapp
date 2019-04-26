import router from 'umi/router';
import {message,Modal} from 'antd';
export function submitForm(form,type,dispatch,url,callback) {
    if(type == 'new'){
        handleAdd(form,dispatch,url,callback);
    }else{
        handleUpdate(form,dispatch,url,callback);
    }
  }

  
function handleAdd(_form,dispatch,url,_callback){
    _form.props.form.validateFields((err, values) => {
        if (!err) {
            dispatch({
                type: url+'/add',
                payload: values,
                callback: (response) => {
                    if (response.code == '0' || response.code == '201') {
                        message.info("新建成功");
                       _callback(false)
                    }
                }
            });
        }
    });
}

function handleUpdate(_form,dispatch,url,_callback){
    _form.props.form.validateFields((err, values) => {
        if (!err) {
            dispatch({
                type: url+'/update',
                payload: values,
                callback: (response) => {
                    if (response.code == '0' || response.code == '201') {
                        message.info(response.msg);
                       _callback(false)
                    }
                }
            });
        }
    });
}

export function submitDelete(dispatch,url,id,_callback){
    Modal.confirm({
        title: '删除提醒',
        content: '确定删除该数据吗？',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            dispatch({
                type: url+'/remove',
                payload: id,
                callback: (response) => {
                    if (response.code == '0' || response.code == '204') {
                        _callback();
                        message.info('删除成功')
                    }
                }
            });
        }
    });
}