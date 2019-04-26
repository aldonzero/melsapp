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
        name: ''
    }

    columns = [
        {
            title: '工号',
            dataIndex: 'userId'
        }, {
            title: '姓名',
            dataIndex: 'userName'
        },{
            title: '性别',
            dataIndex: 'sex',
            render(val){
                let config  = {
                    '0':'女','1':'男'
                }
                return config[val];
            }
        }, {
            title: '手机号',
            dataIndex: 'userPhone'
        },
        {
            title: '入职时间',
            dataIndex: 'createDate',
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '状态',
            dataIndex: 'userState',
            render(val){
                let config  = {
                    '0':'启用','1':'禁用'
                }
                return config[val];
            }
        },
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <Divider type="vertical" />
                    <a type="danger" onClick={() => submitDelete(this.props.dispatch, this.state.url, data.id, this.handleFetch)} >删除</a>
                </Fragment>
            ),
        },
    ];


    render() {
        return (
            <PageHeaderWrapper title="人员列表" content=''>

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <Table
                            bordered
                            columns={this.columns}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                        />

                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }

    componentDidMount() {
        this.handleFetch();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'user/fetch',
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
                    
                }
            }
        });
    }
}
