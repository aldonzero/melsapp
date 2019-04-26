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
export default class BillAdd extends PureComponent {
    state = {
        project: [],
        type:'new'
    };

    params = {
        page: 0,
        pageSize: 0,
    }

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

        const formInfo = this.state.formInfo || {};
        const type = this.state.type;
        return (
            <PageHeaderWrapper
                title="项目结算" content=" "
            >

                <Form layout="horizontal">
                    <Card>

                        {
                            formInfo && type == 'id' ? formInfo.id :
                                getFieldDecorator('id', {
                                    initialValue: formInfo.id,
                                })(
                                    <Input type='hidden' />
                                )}

                        <FormItem label='结款编号' {...formItemLayout}>
                            {
                                formInfo && type == 'billNo' ? formInfo.billNo :
                                    getFieldDecorator('billNo', {
                                        initialValue: formInfo.billNo == null ? 'bill' + moment().format('YYYYMMDDHHmmss') : formInfo.billNo,
                                        rules: [
                                            {
                                                required: true,
                                                message: '结款编号不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入结款编号' disabled />
                                    )
                            }
                        </FormItem>

                        <FormItem label='项目' {...formItemLayout}>
                            {
                                formInfo && type == 'projectId' ? formInfo.projectId :
                                    getFieldDecorator('projectId', {
                                        initialValue: formInfo.projectId,
                                        rules: [
                                            {
                                                required: true,
                                                message: '项目不能为空'
                                            }
                                        ]
                                    })(
                                        <Select placeholder="-请选择-">
                                            {
                                                this.state.project.map(d => <Option value={d.id}>{d.projectName}</Option>)
                                            }
                                        </Select>
                                    )
                            }
                        </FormItem>

                        <FormItem label='工程量（小时）' {...formItemLayout}>
                            {
                                formInfo && type == 'quantities' ? formInfo.quantities :
                                    getFieldDecorator('quantities', {
                                        initialValue: formInfo.quantities,
                                        rules: [
                                            {
                                                required: true,
                                                message: '工程量不能为空'
                                            }
                                        ]
                                    })(
                                        <InputNumber min={0} step={0.1} style={{ width: 150 }} placeholder="请输入工程量" />
                                    )
                            }
                        </FormItem>

                        <FormItem label='单价' {...formItemLayout}>
                            {
                                formInfo && type == 'price' ? formInfo.price :
                                    getFieldDecorator('price', {
                                        initialValue: formInfo.price,
                                        rules: [
                                            {
                                                required: true,
                                                message: '单价不能为空'
                                            }
                                        ]
                                    })(
                                        <InputNumber min={0} step={0.01} style={{ width: 150 }} placeholder="请输入单价" />
                                    )
                            }
                        </FormItem>

                        <FormItem label='经办人' {...formItemLayout}>
                            {
                                formInfo && type == 'agent' ? formInfo.agent :
                                    getFieldDecorator('agent', {
                                        initialValue: formInfo.agent,
                                        rules: [
                                            {
                                                required: true,
                                                message: '经办人不能为空'
                                            }
                                        ]
                                    })(
                                        <Input placeholder='请输入经办人' />
                                    )
                            }
                        </FormItem>

                        <FormItem label='状态' {...formItemLayout}>
                            {
                                formInfo && type == 'state' ? formInfo.state :
                                    getFieldDecorator('state', {
                                        initialValue: formInfo.state == null ? '-1' : formInfo.state,
                                        rules: [
                                            {
                                                required: true,
                                                message: '状态不能为空'
                                            }
                                        ]
                                    })(
                                        <Select placeholder="-请选择-" style={{ width: 150 }} disabled>
                                            <Option value="-1">未提交</Option>
                                            <Option value="0">暂存</Option>
                                            <Option value="1">审核中</Option>
                                            <Option value="2">结款</Option>
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
                                                max: 200, message: '最多输入200字符'
                                            }
                                        ]
                                    })(
                                        <TextArea rows={4} placeholder="请输入备注" />
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

            </PageHeaderWrapper >
        );
    }

    componentDidMount() {
        this.handleFetchProject();
    }

    handleFetchProject = () => {
        console.log('this.handleFetchProject();')
        const {dispatch} = this.props;
        dispatch({
            type: 'project/fetch',
            payload: this.params,
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        project: response.data.list,
                    })
                }
            }
        });
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


