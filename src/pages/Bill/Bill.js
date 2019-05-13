import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import { pagination } from '@/utils/utils'
import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


@connect(({ bill, loading }) => ({
    bill,
    loading: loading,
}))
@Form.create()
export default class Bill extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'bill'
    };
    params = {
        page: 1,
        pageSize: 10,
    }

    columns = [
        {
            title: '编号',
            dataIndex: 'no',
        },
        {
            title: '工程量',
            dataIndex: 'quantities',
        },
        {
            title: '单价',
            dataIndex: 'price',
        },
        {
            title: '结款',
            render: (data) => {
                let t = data.price * data.quantities;
                return t;
            }
        },
        {
            title: '经办人',
            dataIndex: 'agent',
        },
        {
            title: '结款时间',
            dataIndex: 'settlementDate',
        },
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleModalVisible(data.id)}>编辑</a>
                    <Divider type="vertical" />
                    <a type="danger" onClick={() => submitDelete(this.props.dispatch, this.state.url, data.id, this.handleFetch)} >删除</a>
                </Fragment>
            ),
        },
    ];

    render() {
        return (
            <PageHeaderWrapper title="设备类别列表">

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(null)}>
                                新建
                         </Button>
                        </div>
                        <Table
                            bordered
                            columns={this.columns}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                        />

                    </div>
                </Card>
                <Modal
                    title={this.state.title}
                    visible={this.state.isShowForm}
                    onOk={() => submitForm(this.newForm, this.state.type, this.props.dispatch, this.state.url, this.formCallback)}
                    onCancel={() => {
                        this.newForm.props.form.resetFields();
                        this.setState({
                            isShowForm: false,
                            formInfo: ''
                        })
                    }}
                >
                    <NewForm formInfo={this.state.formInfo} type={this.state.type} wrappedComponentRef={(inst) => { this.newForm = inst; }} />
                </Modal>
            </PageHeaderWrapper>
        );
    }

    componentDidMount() {
        this.handleFetch();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'bill/fetch',
            payload: this.params,
            callback: (response) => {
                console.log(123)
                if (response.code == 200 || response == 0) {
                    this.setState({
                        list: response.data.list,
                        pagination: pagination(response, (current) => {
                            _this.params.page = current;
                            _this.handleFetch();
                        })
                    })

                }
            }
        });
    }

    handleShowUpdateForm = (id) => {

    }

    //显示form
    handleModalVisible = (id) => {
        let _title = "新建";
        let type = 'new';
        if (id != null && id != '') {
            _title = "修改";
            type = 'edit';
            const { dispatch } = this.props
            dispatch({
                type: 'bill/fetchId',
                payload: id,
                callback: (response) => {
                    if (response.code == '201' || response.code == '0') {
                        this.setState({
                            formInfo: response.data
                        })
                    }
                }
            });
        }
        console.log(_title)
        this.setState({
            title: _title,
            type: type,
            isShowForm: true,
        })
    }


    //formCallback
    formCallback = (flag) => {
        this.newForm.props.form.resetFields();
        this.setState({
            isShowForm: flag,
            formInfo: ''
        })
    }
}



class NewForm extends React.Component {
    render() {
        const formItemLayout = {
            labelCol: {
                span: 5
            },
            wrapperCol: {
                span: 19
            }
        }
        const { getFieldDecorator } = this.props.form;
        const formInfo = this.props.formInfo || {};
        const type = this.props.type;
        return (
            <Form layout="horizontal">
                <Form.Item label="编号" {...formItemLayout}>
                    {
                        formInfo && type == 'no' ? formInfo.no :
                            getFieldDecorator('no', {
                                initialValue: formInfo.no == null ? 'pro' + moment().format('YYYYMMDDHHmmss') : formInfo.no,
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="项目名称" {...formItemLayout}>
                    {
                        formInfo && type == 'projectName' ? formInfo.projectName :
                            getFieldDecorator('projectName', {
                                initialValue: formInfo.projectName,
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="工程量（h）" {...formItemLayout}>
                    {
                        formInfo && type == 'quantities' ? formInfo.quantities :
                            getFieldDecorator('quantities', {
                                initialValue: formInfo.quantities,
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <InputNumber min={0} step={1} />
                            )}
                </Form.Item>
                <Form.Item label="单价（元）" {...formItemLayout}>
                    {
                        formInfo && type == 'price' ? formInfo.price :
                            getFieldDecorator('price', {
                                initialValue: formInfo.price,
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <InputNumber min={0} step={0.01} />
                            )}
                </Form.Item>
                <Form.Item label="结算日期" {...formItemLayout}>
                    {
                        formInfo && type == 'settlementDate' ? formInfo.settlementDate :
                            getFieldDecorator('settlementDate', {
                                initialValue: formInfo.settlementDate == null ? moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment(formInfo.settlementDate, 'YYYY-MM-DD'),
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                </Form.Item>
                <Form.Item label="经办人" {...formItemLayout}>
                    {
                        formInfo && type == 'agent' ? formInfo.agent :
                            getFieldDecorator('agent', {
                                initialValue: formInfo.agent,
                                rules: [{
                                    required: true,
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="备注" {...formItemLayout}>
                    {
                        formInfo && type == 'remark' ? formInfo.remark :
                            getFieldDecorator('remark', {
                                initialValue: formInfo.remark,
                                rules: [{
                                    max: 150, message: '长度不超过150个字符',
                                }],
                            })(
                                <TextArea rows={4} />
                            )}
                </Form.Item>
            </Form>
        )
    }

}


NewForm = Form.create({ name: 'new_form' })(NewForm);

