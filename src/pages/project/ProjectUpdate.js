import React, { PureComponent } from 'react';
import {
    Card, message,
    Button,
    Form,
    Icon,
    Col,
    Row,
    DatePicker,
    TimePicker,
    Input,
    Select,
    Popover,
    InputNumber
} from 'antd';
import moment from 'moment';
import { connect } from 'dva';
import FooterToolbar from '@/components/FooterToolbar';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import styles from './style.less';
const FormItem = Form.Item;
const { Option } = Select;
const { RangePicker } = DatePicker;
const TextArea = Input.TextArea;


@connect(({ project, loading }) => ({
    project,
    loading: loading,
}))
@Form.create()
export default class ProjectAdd extends PureComponent {
    state = {
        width: '100%',
        type: 'new'
    };

    render() {

        const { width } = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: 24,
                sm: 4
            },
            wrapperCol: {
                xs: 24,
                sm: 12
            }
        }
        const offsetLayout = {
            wrapperCol: {
                xs: 24,
                sm: {
                    span: 12,
                    offset: 4
                }
            }
        }
        const rowObject = {
            minRows: 4, maxRows: 6
        }
        const formInfo = this.state.formInfo || {};
        const type = this.state.type;
        return (
            <PageHeaderWrapper
                title="项目立项" content=" "
            >

                <Form layout="horizontal">
                    <Card title="项目信息">
                        {
                            formInfo && type == 'id' ? formInfo.id :
                                getFieldDecorator('id', {
                                    initialValue: formInfo.id,
                                })(
                                    <Input type='hidden' />
                                )}
                        <FormItem label="项目编号" {...formItemLayout}>
                            {
                                formInfo && type == 'no' ? formInfo.no :
                                    getFieldDecorator('no', {
                                        initialValue: formInfo.no == null ? 'pro' + moment().format('YYYYMMDDHHmmss') : formInfo.no,
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目编号不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入项编号" disabled />
                                    )
                            }
                        </FormItem>
                        <FormItem label="项目名称" {...formItemLayout}>
                            {
                                formInfo && type == 'projectName' ? formInfo.projectName :
                                    getFieldDecorator('projectName', {
                                        initialValue: formInfo.projectName,
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目名不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入项目名" />
                                    )
                            }
                        </FormItem>
                        <FormItem label="项目地址" {...formItemLayout}>
                            {
                                formInfo && type == 'address' ? formInfo.address :
                                    getFieldDecorator('address', {
                                        initialValue: formInfo.address,
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目地址不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入项目地址" />
                                    )
                            }
                        </FormItem>
                        <FormItem label="预估量（小时）" {...formItemLayout}>
                            {
                                formInfo && type == 'estimate' ? formInfo.estimate :
                                    getFieldDecorator('estimate', {
                                        initialValue: formInfo.estimate,
                                    })(
                                        <InputNumber min={0} step={1} placeholder="请输入工程预计量" />
                                    )
                            }
                        </FormItem>
                        <FormItem label="开始日期" {...formItemLayout}>
                            {
                                formInfo && type == 'startDate' ? formInfo.startDate :
                                    getFieldDecorator('startDate', {
                                        initialValue: moment(formInfo.startDate, 'YYYY-MM-DD'),
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目开始日期不能为空'
                                            }
                                        ]
                                    })(
                                        <DatePicker placeholder="请输入项目开始日期" format="YYYY-MM-DD" />
                                    )
                            }
                        </FormItem>
                        <FormItem label="项目状态" {...formItemLayout}>
                            {
                                formInfo && type == 'state' ? formInfo.state :
                                    getFieldDecorator('state', {
                                        initialValue: formInfo.state,
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目状态不能为空'
                                            }
                                        ]
                                    })(
                                        <Select placeholder="-请选择-">
                                            <Option value="0">立项</Option>
                                            <Option value="1">施工</Option>
                                            <Option value="2">竣工</Option>
                                            <Option value="3">放弃</Option>
                                        </Select>
                                    )
                            }
                        </FormItem>
                        <FormItem label="项目描述" {...formItemLayout}>
                            {
                                formInfo && type == 'description' ? formInfo.description :
                                    getFieldDecorator('description', {
                                        initialValue: formInfo.description,
                                        rules: [
                                            {
                                                max: 300,
                                                message: '项目地址不能超过300字符'
                                            }
                                        ]
                                    })(
                                        <TextArea rows={4} placeholder="请输入项目描述" />
                                    )
                            }
                        </FormItem>
                    </Card>
                    <Card title="建设单位信息">
                        <FormItem label="建设单位" {...formItemLayout}>
                            {
                                formInfo && type == 'constructionUnit' ? formInfo.constructionUnit :
                                    getFieldDecorator('constructionUnit', {
                                        initialValue: formInfo.constructionUnit,
                                        rules: [
                                            {
                                                required: true,
                                                message: '建设单位不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入建设单位" />
                                    )
                            }
                        </FormItem>
                        <FormItem label="联系人" {...formItemLayout}>
                            {
                                formInfo && type == 'unitContacts' ? formInfo.unitContacts :
                                    getFieldDecorator('unitContacts', {
                                        initialValue: formInfo.unitContacts,
                                        rules: [
                                            {
                                                required: true,
                                                message: '联系人不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入联系人" />
                                    )
                            }
                        </FormItem>
                        <FormItem label="联系电话" {...formItemLayout}>
                            {
                                formInfo && type == 'unitPhone' ? formInfo.unitPhone :
                                    getFieldDecorator('unitPhone', {
                                        initialValue: formInfo.unitPhone,
                                        rules: [
                                            {
                                                required: true,
                                                message: '联系人电话不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder="请输入联系人电话" />
                                    )
                            }
                        </FormItem>
                    </Card>

                    <FooterToolbar style={{ width }}>
                        <Button type="primary" onClick={() => { this.submitForm(1) }} > 提交</Button>
                        <Button type="primary" onClick={() => { this.submitForm(0) }}> 暂存</Button>
                        <Button > 取消</Button>
                    </FooterToolbar>
                </Form>

            </PageHeaderWrapper>
        );
    }

    submitForm = (projectState) => {
        console.log("submit form")
        if (this.state.type == 'new') {
            this.handleAdd(projectState);
        }
    }
    handleAdd = (projectState) => {
        console.log('handleAdd ....')
        this.props.form.validateFields((err, values) => {
            values.state = projectState;
            if (!err) {
                this.props.dispatch({
                    type: 'project/add',
                    payload: values,
                    callback: (response) => {
                        if (response.code == '0' || response.code == '201') {
                            message.info("新建成功");
                           
                        }
                    }
                });
            }
        });
    }
}


