import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Switch,
    Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import { pagination } from '@/utils/utils'

import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;


@connect(({ permission, loading }) => ({
    permission,
    loading: loading,
}))
@Form.create()
export default class Permission extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'permission'
    };
    params = {
        page: 1,
        pageSize: 10,
        name: ''
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'name'
        },
        {
            title: '状态',
            dataIndex: 'available',
            render(val) {
                let config = {
                    'false': '禁用', 'true': '启用'
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



    render() {
        return (
            <PageHeaderWrapper title="权限列表" content=''>

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
                            pagination={false}
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
            type: 'permission/fetch',
            // payload: this.params,
            payload: { "page": 0, "pageSize": 0 },
            callback: (response) => {
                console.log(123)
                if (response.code == 200 || response == 0) {
                    console.log(response)
                    this.setState({
                        list: response.data.list,

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
                type: 'permission/fetchId',
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

@connect(({ permission, loading }) => ({
    permission,
    loading: loading,
}))
class NewForm extends React.Component {
    state = {
        parentPermission: []
    }
    componentDidMount() {
        console.log('handleParent')
        this.handleParent();
    }

    handleParent = () => {
        let _this = this;
        this.props.dispatch({
            type: 'permission/fetch',
            payload: { "page": 0, "pageSize": 0, "parentid": 0 },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    console.log('permission/fetch')
                    this.setState({
                        parentPermission: response.data.list
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
            <Form layout="horizontal">
                {
                    formInfo && type == 'id' ? formInfo.id :
                        getFieldDecorator('id', {
                            initialValue: formInfo.id,
                        })(
                            <Input type='hidden' />
                        )}
                <Form.Item label="父级权限" {...formItemLayout}>
                    {
                        formInfo && type == 'parentid' ? formInfo.parentid :
                            getFieldDecorator('parentid', {
                                // initialValue: formInfo.parentid!=null?formInfo.parentid+'':'0',
                                initialValue: formInfo.parentid
                            })(
                                <Select placeholder="-请选择-">
                                    {/* <Option key='0'>-请选择-</Option> */}
                                    {
                                        this.state.parentPermission.map(d => <Option value={d.id}>{d.name}</Option>)
                                    }
                                </Select>
                            )
                    }
                </Form.Item>
                <Form.Item label="名称" {...formItemLayout}>
                    {
                        formInfo && type == 'name' ? formInfo.name :
                            getFieldDecorator('name', {
                                initialValue: formInfo.name,
                                rules: [{
                                    required: true, message: '请填写权限名称'
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="编码" {...formItemLayout}>
                    {
                        formInfo && type == 'percode' ? formInfo.percode :
                            getFieldDecorator('percode', {
                                initialValue: formInfo.percode,
                                rules: [{
                                    required: true, message: '请填写权限编码'
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="状态" {...formItemLayout}>
                    {
                        formInfo && type == 'available' ? formInfo.available :
                            getFieldDecorator('available', {
                                valuePropName: 'checked',
                                initialValue: formInfo.available==null?'true':formInfo.available,
                                rules: [{
                                    required: true, message: '请选择状态'
                                }],
                            })(
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                            )}
                </Form.Item>
            </Form>
        )
    }

}


NewForm = Form.create({ name: 'new_form' })(NewForm);
