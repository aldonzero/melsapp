import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Switch , Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import { pagination } from '@/utils/utils'

import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const RadioGroup = Radio.Group;


@connect(({ user, loading }) => ({
    user,
    loading: loading,
}))
@Form.create()
export default class User extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'user'
    };
    params = {
        page: 1,
        pageSize: 10,
        name: '',
        phone:''
    }

    columns = [
        {
            title: '工号',
            dataIndex: 'id'
        }, {
            title: '姓名',
            dataIndex: 'name'
        }, {
            title: '性别',
            dataIndex: 'sex',
            render(val) {
                let config = {
                    '0': '女', '1': '男'
                }
                return config[val];
            }
        }, {
            title: '手机号',
            dataIndex: 'phone'
        },
        {
            title: '创建时间',
            dataIndex: 'createDate',
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '状态',
            dataIndex: 'available',
            render(val) {
                let config = {
                    'true': '在职', 'false': '离职'
                }
                return config[val];
            }
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
                        <FormItem label="姓名">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                    <FormItem label="手机号">
                            {getFieldDecorator('phone')(<Input placeholder="请输入" />)}
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
                           
                        </span>
                    </Col>
                </Row>
            </Form>
        );
    }



    render() {
        return (
            <PageHeaderWrapper title="人员列表" content=''>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                    <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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

    //查询
    /*******************************************************************/

   

    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
          formValues: {},
        });
        this.params.name = '',
        this.params.phone = '';
        this.handleFetch();
      };

      handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.params.name = fieldsValue.name,
          this.params.phone = fieldsValue.phone;
          this.handleFetch();
        });
      };
    /*******************************************************************/

    componentDidMount() {
        this.handleFetch();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'user/fetchList',
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

    //显示form
    handleModalVisible = (id) => {
        let _title = "新建";
        let type = 'new';
        if (id != null && id != '') {
            _title = "修改";
            type = 'edit';
            const { dispatch } = this.props
            dispatch({
                type: 'user/fetchId',
                payload: id,
                callback: (response) => {
                    if (response.code == '200' || response.code == '0') {
                        this.setState({
                            formInfo: response.data
                        })
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
        const type = this.props.type;
        return (
            <Form layout="horizontal">
                {
                    formInfo && type == 'id' ? formInfo.id :
                        getFieldDecorator('id', {
                            initialValue: formInfo.id,
                        })(
                            <Input type='hidden' />
                        )}
                <Form.Item label="姓名" {...formItemLayout}>
                    {
                        formInfo && type == 'name' ? formInfo.name :
                            getFieldDecorator('name', {
                                initialValue: formInfo.name,
                                rules: [{
                                    required: true, message: '请填写姓名'
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="性别" {...formItemLayout}>
                    {
                        formInfo && type == 'sex' ? formInfo.sex :
                            getFieldDecorator('sex', {
                                initialValue: '1',
                            })(
                                <RadioGroup >
                                <Radio value='1'>男</Radio>
                                <Radio value='0'>女</Radio>
                              </RadioGroup>
                            )}
                </Form.Item>
                <Form.Item label="手机号" {...formItemLayout}>
                    {
                        formInfo && type == 'phone' ? formInfo.phone :
                            getFieldDecorator('phone', {
                                initialValue: formInfo.phone,
                                rules: [{
                                    required: true, message: '请填写手机号'
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="密码" {...formItemLayout}>
                    {
                        formInfo && type == 'password' ? formInfo.password :
                            getFieldDecorator('password', {
                                initialValue: formInfo.password,
                                rules: [{
                                    required: true, message: '请填写密码'
                                }],
                            })(
                                <Input type="password" />
                            )}
                </Form.Item>
                <Form.Item label="状态" {...formItemLayout}>
                    {
                        formInfo && type == 'available' ? formInfo.available :
                            getFieldDecorator('available', {
                                valuePropName: 'checked',
                                initialValue: formInfo.available==null?'false':formInfo.available,
                            })(
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                            )}
                </Form.Item>
                <Form.Item label="备注" {...formItemLayout}>
                    {
                        formInfo && type == 'remark' ? formInfo.remark :
                            getFieldDecorator('remark', {
                                initialValue: formInfo.remark,
                                rules: [{
                                    max: 240, message: '长度不超过240个字符',
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

