import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';

const FormItem = Form.Item;

const { TextArea } = Input;
const { Option } = Select;

@Form.create()
export default class AuditModal extends React.Component {
   
    render() {
        const { isShowAudit,handleAudit, handleAuditVisible } = this.props;
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        }
       const okHandle = () => {
            this.props.form.validateFields((err, fieldsValue) => {
                if (err) return;
                this.props.form.resetFields();
                handleAudit(fieldsValue)
            });
        };

        const { getFieldDecorator } = this.props.form;
        const formInfo = this.props.formInfo || {};
        const type = this.props.type;
        return (
            <Modal
                title='审核'
                visible={isShowAudit}
                onOk={okHandle}
                onCancel={() =>handleAuditVisible()}
            >
                <Form layout="horizontal">
                    <FormItem label='审核' {...formItemLayout}>
                        {
                            formInfo && type == 'state' ? formInfo.state :
                                getFieldDecorator('state', {
                                    initialValue: formInfo.state,
                                    rules: [
                                        {
                                            required: true,
                                            message: '审核不能为空'
                                        }
                                    ]
                                })(
                                    <Select placeholder="-请选择-">
                                        <Option value='1'>通过</Option>
                                        <Option value='2'>不通过</Option>
                                    </Select>
                                )
                        }
                    </FormItem>
                    <FormItem label='备注' {...formItemLayout}>
                        {
                            formInfo && type == 'remark' ? formInfo.remark :
                                getFieldDecorator('remark', {
                                    initialValue: formInfo.remark,
                                    rules: [
                                        {
                                            max: 200,
                                            message: '最多输入200字符'
                                        }
                                    ]
                                })(
                                    <TextArea rows={4} placeholder="请输入备注" />
                                )
                        }
                    </FormItem>
                </Form>
            </Modal>

        )
    }

}

