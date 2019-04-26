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


@connect(({ machineryType, loading }) => ({
    machineryType,
    loading: loading,
}))
@Form.create()
export default class MachineryType extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'machineryType'
    };
    params = {
        page: 1,
        pageSize: 10,
        name: ''
    }

    columns = [
        {
            title: '名称',
            dataIndex: 'name',
        },
        {
            title: '描述',
            dataIndex: 'description',
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
        console.log('componentDidMount')
        this.handleFetch();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'machineryType/fetch',
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
                type: 'machineryType/fetchId',
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
        const type = this.props.type;
        return (
            <Form layout="horizontal">
                {
                    formInfo && type == 'id' ? formInfo.id :
                        getFieldDecorator('id', {
                            initialValue: formInfo.id,
                        })(
                            <Input  type='hidden'/>
                        )}
                <Form.Item label="名称" {...formItemLayout}>
                    {
                        formInfo && type == 'name' ? formInfo.name :
                            getFieldDecorator('name', {
                                initialValue: formInfo.name,
                                rules: [{
                                    required: true, message: '请填写类别名称'
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="备注" {...formItemLayout}>
                    {
                        formInfo && type == 'description' ? formInfo.description :
                            getFieldDecorator('description', {
                                initialValue: formInfo.description,
                                rules: [{
                                    max: 150, message: '长度不超过200个字符',
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

