import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
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


@connect(({ project, loading }) => ({
    project,
    loading: loading,
}))
@Form.create()
export default class Project extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'project'
    };
    params = {
        page: 1,
        pageSize: 10,
        name: ''
    }

    columns = [
        {
            title: '项目编号',
            dataIndex: 'no'
        }, {
            title: '项目名称',
            // dataIndex: 'projectName',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleToWorkingPage(data.id)}>{data.projectName}</a>
                    <Divider type="vertical" />
                </Fragment>
            ),
        }, {
            title: '项目地址',
            dataIndex: 'address'
        },
        {
            title: '开始日期',
            dataIndex: 'startDate',
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '状态',
            dataIndex: 'state',
            render(val){
                let config  = {
                    '0':'暂存','1':'审核中','2':'立项','3':'施工','4':'竣工','5':'放弃'
                }
                return config[val];
            }
        },
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleToUpdatePage(data.id)}>编辑</a>
                    <Divider type="vertical" />
                    <a type="danger" onClick={() => submitDelete(this.props.dispatch, this.state.url, data.id, this.handleFetch)} >删除</a>
                </Fragment>
            ),
        },
    ];

    render() {
        return (
            <PageHeaderWrapper title="设备类别列表" content=''>

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
            type: 'project/fetch',
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

    handleToUpdatePage=(_id)=>{
        this.props.dispatch(routerRedux.push({ 
            pathname: './projectAdd',
            query: {id: _id}
            }))
    }

    handleToWorkingPage=(_id)=>{
        this.props.dispatch(routerRedux.push({ 
            pathname: './profile',
            query: {id: _id}
            }))
    }
}
