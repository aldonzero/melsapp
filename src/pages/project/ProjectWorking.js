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


@connect(({ working, loading }) => ({
    working,
    loading: loading,
}))
@Form.create()
export default class ProjectWorking extends PureComponent {
    state = {
        list: [],
        isShowForm: false,
        url: 'working'
    };
    params = {
        page: 1,
        pageSize: 10,
    }

    columns = [
        {
            title: '编号',
            dataIndex: 'no',
        },
        {
            title: '项目',
            dataIndex: 'project.projectName',
        },
        {
            title: '设备编号',
            dataIndex: 'machinery.no',
        },
        {
            title: '工时',
            dataIndex: 'workingHour',
        },
        {
            title: '单价',
            dataIndex: 'price',
        },
        {
            title: '经办人',
            dataIndex: 'agent',
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
            <PageHeaderWrapper title="工时列表">

                <Card bordered={false}>
                    <div className={styles.tableList}>
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(null)}>
                                新建
                         </Button>
                        </div>
                        <div className={styles.tableListForm}>{this.renderSimpleForm()}</div>
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
            type: 'working/fetch',
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

                }
            }
        });
    }

    handleShowUpdateForm = (id) => {

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
                type: 'working/fetchId',
                payload: id,
                callback: (response) => {
                    if (response.code == '200' || response.code == '0') {
                        this.setState({
                            formInfo: response.data
                        })
                        console.log(this.state.formInfo)
                    }
                }
            });
        }
        console.log(_title)
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


@connect(({ project,machinery, loading }) => ({
    project,
    machinery,
    loading: loading,
}))
class NewForm extends React.Component {
    state = {
        project: [],
        machinery: []
    }
    componentDidMount() {
        this.handleFetchProject();
        this.handleFetchMachinery();
    }

    handleFetchProject = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/fetch',
            payload: {page:0,pageSize:0},
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        project: response.data.list,
                    })
                }
            }
        });
    }

    handleFetchMachinery = () => {
        const { dispatch } = this.props;
        dispatch({
            type: 'machinery/fetch',
            payload: {page:0,pageSize:0},
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        machinery: response.data.list,
                    })
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
        console.log('formInfo')
        console.log(formInfo)
        return (
            <Form layout="horizontal">
                {
                    formInfo && type == 'id' ? formInfo.id :
                        getFieldDecorator('id', {
                            initialValue: formInfo.id,
                        })(
                            <Input type='hidden' />
                        )}
                <FormItem label='工时编号' {...formItemLayout}>
                    {
                        formInfo && type == 'no' ? formInfo.no :
                            getFieldDecorator('no', {
                                initialValue: formInfo.no == null ? 'w' + moment().format('YYYYMMDDHHmmss') : formInfo.no,
                                rules: [
                                    {
                                        required: true,
                                        message: '工时不能为空'
                                    }
                                ]
                            })(
                                <Input placeholder='请输入工时编号' disabled />
                            )
                    }
                </FormItem>
                <FormItem label='项目' {...formItemLayout}>
                    {
                        formInfo && type == 'projectId' ? formInfo.projectId :
                            getFieldDecorator('projectId', {
                                initialValue: formInfo.projectId,
                                rules: [
                                    {
                                        required: true,
                                        message: '项目不能为空'
                                    }
                                ]
                            })(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.project.map(d => <Option value={d.id}>{d.projectName}</Option>)
                                    }
                                </Select>
                            )
                    }
                </FormItem>

                <FormItem label='设备编号' {...formItemLayout}>
                    {
                        formInfo && type == 'machineryId' ? formInfo.machineryId :
                            getFieldDecorator('machineryId', {
                                initialValue: formInfo.machineryId,
                                rules: [
                                    {
                                        required: true,
                                        message: '设备编号不能为空'
                                    }
                                ]
                            })(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.machinery.map(d => <Option value={d.id}>{d.no}</Option>)
                                    }
                                </Select>
                            )
                    }
                </FormItem>

                <FormItem label='工时' {...formItemLayout}>
                    {
                        formInfo && type == 'workingHour' ? formInfo.workingHour :
                            getFieldDecorator('workingHour', {
                                initialValue: formInfo.workingHour,
                                rules: [
                                    {
                                        required: true,
                                        message: '工时不能为空'
                                    }
                                ]
                            })(
                                <InputNumber min={0} step={0.1} style={{ width: 150 }} placeholder="请输入工时" />
                            )
                    }
                </FormItem>

                <FormItem label='单价' {...formItemLayout}>
                    {
                        formInfo && type == 'price' ? formInfo.price :
                            getFieldDecorator('price', {
                                initialValue: formInfo.price,
                                rules: [
                                    {
                                        required: true,
                                        message: '单价不能为空'
                                    }
                                ]
                            })(
                                <InputNumber min={0} step={0.01} style={{ width: 150 }} placeholder="请输入单价" />
                            )
                    }
                </FormItem>

                <FormItem label='工作日期' {...formItemLayout}>
                    {
                        formInfo && type == 'workingDate' ? formInfo.workingDate :
                            getFieldDecorator('workingDate', {
                                initialValue: formInfo.workingDate == null ? moment(moment().format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment(formInfo.workingDate, 'YYYY-MM-DD'),
                                rules: [
                                    {
                                        required: true,
                                        message: '工作日期不能为空'
                                    }
                                ]
                            })(
                                <DatePicker placeholder='请输入工作日期' />
                            )
                    }
                </FormItem>

                <FormItem label='经办人' {...formItemLayout}>
                    {
                        formInfo && type == 'agent' ? formInfo.agent :
                            getFieldDecorator('agent', {
                                initialValue: formInfo.agent,
                                rules: [
                                    {
                                        required: true,
                                        message: '经办人不能为空'
                                    }
                                ]
                            })(
                                <Input placeholder='请输入经办人' />
                            )
                    }
                </FormItem>

                <FormItem label='备注' {...formItemLayout}>
                    {
                        formInfo && type == 'remark' ? formInfo.remark :
                            getFieldDecorator('remark', {
                                initialValue: formInfo.remark,
                                rules: [
                                    {
                                        max: 200,
                                        message: '最多输入200字符'
                                    }
                                ]
                            })(
                                <TextArea rows={4} placeholder="请输入备注" />
                            )
                    }
                </FormItem>


            </Form>
        )
    }

}


NewForm = Form.create({ name: 'new_form' })(NewForm);

