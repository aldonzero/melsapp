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


@connect(({ machinery,machineryType, loading }) => ({
    machinery,machineryType,
    loading: loading,
}))
@Form.create()
export default class Machinery extends PureComponent {
    state = {
        list: [],
        expandForm: false,
        isShowForm: false,
        url: 'machinery',
        machineryTypeInfo:[],
    };
    params = {
        page: 1,
        pageSize: 10,
        no: '',
        machineryId:''
    }

    columns = [
        {
            title: '设备编号',
            dataIndex: 'no',
            key: 'id'
        }, {
            title: '类型',
            dataIndex: 'machineryType.name'
        }, {
            title: '型号',
            dataIndex: 'model'
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

    renderSimpleForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="设备编号">
                            {getFieldDecorator('no')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="设备类别">
                            {getFieldDecorator('machineryId')(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.machineryTypeInfo.map(d => <Option key={d.id}>{d.name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                            <Button type="primary" htmlType="submit">
                                查询
                  </Button>
                            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                                重置
                  </Button>
                            {/* <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                                展开 <Icon type="down" />
                            </a> */}
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }

    renderAdvancedForm() {
        const {
            form: { getFieldDecorator },
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="规则名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="设备类别">
                            {getFieldDecorator('machineryId')(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.machineryTypeInfo.map(d => <Option key={d.id}>{d.name}</Option>)
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="调用次数">
                            {getFieldDecorator('number')(<InputNumber style={{ width: '100%' }} />)}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                    <Col md={8} sm={24}>
                        <FormItem label="更新日期">
                            {getFieldDecorator('date')(
                                <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status3')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status4')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    <Option value="0">关闭</Option>
                                    <Option value="1">运行中</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <div style={{ overflow: 'hidden' }}>
                    <div style={{ marginBottom: 24 }}>
                        <Button type="primary" htmlType="submit">
                            查询
                </Button>
                        <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                            重置
                </Button>
                        <a style={{ marginLeft: 8 }} onClick={this.toggleForm}>
                            收起 <Icon type="up" />
                        </a>
                    </div>
                </div>
            </Form>
        );
    }

    renderForm() {
        const { expandForm } = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
    }

    render() {
        return (
            <PageHeaderWrapper title="设备类别列表">

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
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

                    <NewForm
                        formInfo={this.state.formInfo}
                        machineryTypeInfo={this.state.machineryTypeInfo}
                        type={this.state.type}
                        wrappedComponentRef={(inst) => { this.newForm = inst; }} />
                </Modal>
            </PageHeaderWrapper>
        );
    }

    //查询
    /*******************************************************************/

    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        this.params.no = '',
        this.params.machineryId = '';
        this.handleFetch();
      };

      handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.params.no = fieldsValue.no,
          this.params.machineryId = fieldsValue.machineryId;
          this.handleFetch();
        });
      };
    /*******************************************************************/


    componentDidMount() {
        this.handleFetch();
        this.handleFetchType();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'machinery/fetch',
            payload: this.params,
            callback: (response) => {
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

    handleFetchType = () => {
        this.props.dispatch({
            type: 'machineryType/fetch',
            payload: { "page": 0, "pageSize": 0, "orderBy": "id" },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        machineryTypeInfo: response.data.list
                    })
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
        const machineryTypeInfo = this.props.machineryTypeInfo || {};
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
                                        machineryTypeInfo.map(d => <Option key={d.id}>{d.name}</Option>)
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

