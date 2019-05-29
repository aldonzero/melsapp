import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { routerRedux } from 'dva/router';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Alert, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import { pagination } from '@/utils/utils'
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
let Authorized = RenderAuthorized(getAuthority());
const noMatch = '';

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
        no: ''
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
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '状态',
            dataIndex: 'state',
            render(val) {
                let config = {
                    '0': '暂存', '1': '审核中', '2': '审核未通过', '4': '施工中', '5': '竣工', '6': '放弃'
                }
                return config[val];
            }
        },
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleToUpdatePage(data.id)}>编辑</a>
                    
                    <Authorized authority={['projectAudit']} >
                    <Divider type="vertical" />
                        <a type="ghost" onClick={() => this.handleToAuditPage(data.id)} >审核</a>
                    </Authorized>
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
                        <FormItem label="项目编号">
                            {getFieldDecorator('projectNo')(<Input placeholder="请输入" />)}
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


    render() {
        return (
            <PageHeaderWrapper title="项目列表" content=''>

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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

    //查询
    /*******************************************************************/
    handleFormReset = () => {
        const { form, dispatch } = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.params.no = '',
        this.handleFetch();
    };

    handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            this.params.no = fieldsValue.projectNo,
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

    handleToUpdatePage = (_id) => {
        this.props.dispatch(routerRedux.push({
            pathname: './projectAdd',
            query: { id: _id }
        }))
    }

    handleToWorkingPage = (_id) => {
        this.props.dispatch(routerRedux.push({
            pathname: './profile',
            query: { id: _id }
        }))
    }
    
    handleToAuditPage = (_id) => {
        this.props.dispatch(routerRedux.push({
            pathname: './audit',
            query: { id: _id }
        }))
    }
}
