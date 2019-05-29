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


@connect(({ user,userRole, loading }) => ({
    user,userRole,
    loading: loading,
}))
@Form.create()
export default class UserRole extends PureComponent {
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
            title: '入职时间',
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
                    <Divider type="vertical" />
                    <a type="ghost" onClick={() => this.handleModalVisible(data.id)}>用户角色</a>
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
                            rowKey={record => record.id}
                            scroll={{ x: 768 }}
                            dataSource={this.state.list}
                            pagination={this.state.pagination}
                        />

                    </div>
                </Card>
                <Modal
                    title='编辑用户角色'
                    visible={this.state.isShowForm}
                    width={1000}
                    onOk={() => this.handleSubmit()}
                    onCancel={() => {
                        this.setState({
                            isShowForm: false,
                            userId: ''
                        })
                    }}
                >

                    <NewForm userId={this.state.userId} 
                    patchUserRoleInfo={(selectedRowKeys) => {
                        this.setState({
                            userRoleInfo: selectedRowKeys
                        });
                    }}
                    wrappedComponentRef={(inst) => { this.newForm = inst; }} />
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
            type: 'user/fetchList',
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

    handleModalVisible = (id) => {
        this.setState({
            isShowForm: true,
            userId: id,
        })
    }

    handleSubmit=()=>{
        this.props.dispatch({
            type: 'userRole/update',
            payload: { userId: this.state.userId, roleIds: this.state.userRoleInfo },
            callback: (response) => {
                if (response.code == '0' || response.code == '201') {
                    message.info("修改成功");
                }
            }
        });
    }

}





@connect(({ role,userRole, loading }) => ({
    role,userRole,
    loading: loading,
}))
class NewForm extends React.Component {
    state = {
        roleList: [],
        selectedRowKeys:[],
    }
    columns = [
        {
            title: '名称',
            dataIndex: 'name'
        },
        {
            title: '角色编码',
            dataIndex: 'code'
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

    ];
    componentDidMount() {
       this.fetchUserRole();
    }

    fetchRole = () => {
        let _this = this;
        this.props.dispatch({
            type: 'role/fetch',
            payload: { "page": 0, "pageSize": 0 },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        roleList: response.data.list
                    })
                }
            }
        });
    }

    fetchUserRole=()=>{
        this.props.dispatch({
            type: 'userRole/fetch',
            payload: { "userId": this.props.userId },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    let list = response.data.list.map((item) => {
                        return item.roleId;
                    });
                    this.setState({
                        selectedRowKeys: list,
                    })
                    this.fetchRole();
                }
            }
        });
    }

    
    render() {
        const { selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
                this.props.patchUserRoleInfo(selectedRowKeys);
                this.setState({ selectedRowKeys });
              console.log(`selectedRowKeys: ${selectedRowKeys}`);
            },
            getCheckboxProps: record => ({
              disabled: record.name === 'Disabled User', // Column configuration not to be checked
              name: record.name,
            }),
          };
        return (
            <div>
                <Table
                    bordered
                    columns={this.columns}
                    rowSelection={rowSelection}
                    rowKey={record => record.id}
                    dataSource={this.state.roleList}
                />
            </div>
        )
    }

}


NewForm = Form.create({ name: 'new_form' })(NewForm);
