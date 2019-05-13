import React, { Component, Fragment } from 'react';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { Form, Select, Input, Button } from 'antd';

const { Option } = Select;

@Form.create()
class SecurityView extends React.Component {
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }

    
  checkPassword = (rule, value, callback) => {
    let newPassword = this.props.form.getFieldValue('newPassword');
    if(value != newPassword){
      callback("两次密码不一致");
    }
  };

  

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 12 }} onSubmit={this.handleSubmit}>
        <Form.Item label="旧密码">
          {getFieldDecorator('oldPassword', {
            rules: [{ required: true, message: '请输入旧密码!' }],
          })(
            <Input type="password" placeholder="旧密码" />
          )}
        </Form.Item>

        <Form.Item label="新密码">
          {getFieldDecorator('newPassword', {
            rules: [{ 
              
              required: true, message: '请输入新密码!',
              min:6,message:'密码最少为6个字符',
             }],
          })(
            <Input type="newPassword" placeholder="输入新密码" />
          )}
        </Form.Item>
        <Form.Item label="确认密码">
          {getFieldDecorator('newPassword2', {
            rules: [{ 
              required: true, message: '两次密码不一致!' ,
              validator: this.checkPassword,
            }],
          })(
            <Input type="password" placeholder="确认新密码" />
          )}
        </Form.Item>
       
        <Form.Item
          wrapperCol={{ span: 12, offset: 5 }}
        >
          <Button type="primary" htmlType="submit">
            确定
          </Button>
        </Form.Item>
      </Form>
    );
  }
}


export default SecurityView;
