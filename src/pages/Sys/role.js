import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Switch,
    Tree, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete } from '@/utils/event';
import { pagination } from '@/utils/utils'

import styles from './TableList.less';

const FormItem = Form.Item;
const { TextArea } = Input;
const { TreeNode } = Tree;


@connect(({ role, rolePermission, loading }) => ({
    role,
    rolePermission,
    loading: loading,
}))
@Form.create()
export default class Role extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'role',
        isShowRolePermission: false
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
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleModalVisible(data.id)}>编辑</a>
                    <Divider type="vertical" />
                    <a type="ghost" onClick={() => this.handleModalRolePermission(data.id)}>编辑权限</a>
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
                <Modal
                    destroyOnClose
                    title='编辑角色权限'
                    visible={this.state.isShowRolePermission}
                    onOk={this.handleSubmitRolePermission}
                    onCancel={() => {
                        // this.rolePermissionForm.props.form.resetFields();
                        this.setState({
                            isShowRolePermission: false,
                            roleId: ''
                        })
                    }}
                >
                    <RolePermissionForm
                        roleId={this.state.roleId}
                        patchPermissionInfo={(checkedKeys) => {
                            this.setState({
                                rolePermissionInfo: checkedKeys
                            });
                        }}
                        wrappedComponentRef={(inst) => { this.rolePermissionForm = inst; }} />
                </Modal>
            </PageHeaderWrapper>
        );
    }

    componentDidMount() {
        this.handleFetch();
    }

    handleFetch = () => {
        this.props.dispatch({
            type: 'role/fetch',
            payload: { "page": 0, "pageSize": 0 },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
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
                type: 'role/fetchId',
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


    /**********************************************************************/
    // 角色权限管理
    handleModalRolePermission = (id) => {
        this.setState({
            isShowRolePermission: true,
            roleId: id
        })
    }

    handleSubmitRolePermission = () => {
        this.props.dispatch({
            type: 'rolePermission/update',
            payload: { roleId: this.state.roleId, permissions: this.state.rolePermissionInfo },
            callback: (response) => {
                if (response.code == '0' || response.code == '201') {
                    message.info("修改成功");
                    this.setState({
                        isShowRolePermission: false,
                        roleId: ''
                    })

                }
            }
        });
    }


}

@connect(({ role, loading }) => ({
    role,
    loading: loading,
}))
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
                <Form.Item label="角色编码" {...formItemLayout}>
                    {
                        formInfo && type == 'code' ? formInfo.code :
                            getFieldDecorator('code', {
                                initialValue: formInfo.code,
                                rules: [{
                                    required: true, message: '请填写角色编码'
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
                                initialValue: formInfo.available,
                                rules: [{
                                    required: true, message: '请选择状态'
                                }],
                            })(
                                <Switch checkedChildren="启用" unCheckedChildren="禁用" />
                            )}
                </Form.Item>
                <Form.Item label="角色描述" {...formItemLayout}>
                    {
                        formInfo && type == 'description' ? formInfo.description :
                            getFieldDecorator('description', {
                                initialValue: formInfo.description,
                                rules: [{
                                    max: 240, message: '最多输入240字符'
                                }],
                            })(
                                <Input.TextArea />
                            )}
                </Form.Item>
            </Form>
        )
    }

}
NewForm = Form.create({ name: 'new_form' })(NewForm);



@connect(({ permission, rolePermission, loading }) => ({
    permission, rolePermission,
    loading: loading,
}))
class RolePermissionForm extends React.Component {
    state = {
        permissionList: [],
        selectPermissionList: [],
        autoExpandParent: true,
        checkedKeys:[]
    }


    componentDidMount() {
        this.fetchRolePermission();
    }

    fetchRolePermission = () => {
        this.props.dispatch({
            type: 'rolePermission/fetch',
            payload: { "roleId": this.props.roleId },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    let list = response.data.list.map((item) => {
                        return item.permissionId;
                    });
                    this.setState({
                        checkedKeys: list,
                    })
                    this.handleFetch();
                }
            }
        });
    }

    handleFetch = () => {
        this.props.dispatch({
            type: 'permission/fetch',
            payload: { "page": 0, "pageSize": 0 },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        permissionList: response.data.list,
                    })

                }
            }
        });
    }





    onCheck = (checkedKeys) => {
        this.props.patchPermissionInfo(checkedKeys);
        this.setState({ checkedKeys });
    }

    renderTreeNodes = data => data.map((item) => {
        if (item.children) {
            return (
                <TreeNode title={item.name} key={item.id} >
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        return <TreeNode key={item.id} title={item.name} />;
    })

    render() {
        return (
            <Form layout="horizontal">
                <Tree
                    checkable
                    onCheck={this.onCheck}
                    autoExpandParent
                    defaultExpandAll
                    checkedKeys={this.state.checkedKeys}
                >
                    {
                        this.renderTreeNodes(this.state.permissionList)
                    }
                </Tree>
            </Form>
        )
    }

}
RolePermissionForm = Form.create({ name: 'rolePermission_form' })(RolePermissionForm);




