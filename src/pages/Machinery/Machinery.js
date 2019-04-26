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


@connect(({ machinery, loading }) => ({
    machinery,
    loading: loading,
}))
@Form.create()
export default class Machinery extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'machinery'
    };
    params = {
        page: 1,
        pageSize: 10,
        name: ''
    }

    columns = [
        {
            title: '设备编号',
            dataIndex: 'no',
            key:'id'
        }, {
            title: '类型',
            dataIndex: 'model'
        }, {
            title: '型号',
            dataIndex: 'brand'
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

                    <NewForm disabled='true' formInfo={this.state.formInfo} type={this.state.type} wrappedComponentRef={(inst) => { this.newForm = inst; }} />
                </Modal>
            </PageHeaderWrapper>
        );
    }

    componentDidMount() {
        console.log('componentDidMount')
        this.handleFetch();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'machinery/fetch',
            payload: this.params,
            callback: (response) => {
                console.log(123)
                if (response.code == 200 || response == 0) {
                    console.log(response)
                    this.setState({
                        list: response.data.list,
                        pagination: pagination(response, (current) => {
                            _this.params.page = current;
                            _this.handleFetch();
                        })
                    })
                    console.log(this.state)
                }
            }
        });
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
                type: 'machinery/fetchId',
                payload: id,
                callback: (response) => {
                    if (response.code == '200' || response.code == '0') {
                        this.setState({
                            formInfo: response.data
                        })
                        console.log(this.state)
                    }
                }
            });
        }
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
        this.handleFetch();
    }
}


@connect(({ machineryType, loading }) => ({
    machineryType,
    loading: loading,
}))
class NewForm extends React.Component {

    state = {
        machineryType: []
    }
    componentDidMount() {
        this.handleFetchType();
    }

    handleFetchType = () => {
        let _this = this;
        this.props.dispatch({
            type: 'machineryType/fetch',
            payload: { "page": 0, "pageSize": 0, "orderBy": "id" },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    console.log(response)
                    this.setState({
                        machineryType: response.data.list
                    })
                    console.log(this.state)
                }
            }
        });
    }

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
            <Form layout="horizontal" disabled='true' >
                {
                    formInfo && type == 'id' ? formInfo.id :
                        getFieldDecorator('id', {
                            initialValue: formInfo.id,
                        })(
                            <Input type='hidden' />
                        )}
                <Form.Item label="设备编号" {...formItemLayout} disabled='true'>
                    {
                        formInfo && type == 'no' ? formInfo.no :
                            getFieldDecorator('no', {
                                initialValue: formInfo.no,
                                rules: [{
                                    required: true, message: '请填写设备类型',
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="设备类别" {...formItemLayout}>
                    {
                        formInfo && type == 'machineryId' ? formInfo.machineryId :
                            getFieldDecorator('machineryId', {
                                initialValue: formInfo.machineryId + "",
                                rules: [{
                                    required: true, message: '请选择设备类型',
                                }],
                            })(
                                <Select placeholder="-请选择-">

                                    {
                                        this.state.machineryType.map(d => <Option key={d.id}>{d.name}</Option>)
                                    }
                                </Select>
                            )
                    }
                </Form.Item>
                <Form.Item label="类型" {...formItemLayout}>
                    {
                        formInfo && type == 'model' ? formInfo.model :
                            getFieldDecorator('model', {
                                initialValue: formInfo.model,
                                rules: [{
                                    required: true, message: '请填写设备类型',
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="品牌" {...formItemLayout}>
                    {
                        formInfo && type == 'brand' ? formInfo.brand :
                            getFieldDecorator('brand', {
                                initialValue: formInfo.brand,
                                rules: [{
                                    required: true, message: '请填写设备品牌',
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="购买价格" {...formItemLayout}>
                    {
                        formInfo && type == 'purchasingPrice' ? formInfo.purchasingPrice :
                            getFieldDecorator('purchasingPrice', {
                                initialValue: formInfo.purchasingPrice,
                                rules: [{
                                    required: true, message: '请填写设备价格',
                                }],
                            })(
                                <InputNumber min={0} step={0.01} />
                            )}
                </Form.Item>
                <Form.Item label="购买日期" {...formItemLayout}>
                    {
                        formInfo && type == 'purchasingDate' ? formInfo.purchasingDate :
                            getFieldDecorator('purchasingDate', {
                                initialValue: formInfo.purchasingDate == null ? moment(moment().locale('zh-cn').format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment(formInfo.purchasingDate, 'YYYY-MM-DD'),
                                rules: [{
                                    required: true, message: '请选择购买日期',
                                }],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                </Form.Item>
                <Form.Item label="描述" {...formItemLayout}>
                    {
                        formInfo && type == 'description' ? formInfo.description :
                            getFieldDecorator('description', {
                                initialValue: formInfo.description,
                                rules: [{
                                    max: 200, message: '长度不超过200个字符',
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

