import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import router from 'umi/router';
import {
    Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import AuditModal from '../Forms/AuditModal'
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { submitForm, submitDelete,submitAudit } from '@/utils/event';
import { pagination } from '@/utils/utils'
import RenderAuthorized from '@/components/Authorized';
import { getAuthority } from '@/utils/authority';
let Authorized = RenderAuthorized(getAuthority());
import styles from './TableList.less';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;


@connect(({ ticket,ticketType, loading }) => ({
    ticket,ticketType,
    loading: loading,
}))
@Form.create()
export default class ticket extends PureComponent {
    state = {
        list: [],
        expandForm: false,
        isShowForm: false,
        url: 'ticket',
        ticketTypeInfo:[],
    };
    params = {
        page: 1,
        pageSize: 10,
        no: '',
        ticketType:''
    }

    columns = [
        {
            title: '项目',
            dataIndex: 'projectName',
        }, {
            title: '类型',
            dataIndex: 'ticketType'
        }, {
            title: '金额',
            dataIndex: 'cost'
        },
        {
            title: '经办人',
            dataIndex: 'agent'
        },
        {
            title: '日期',
            dataIndex: 'costDate',
            render: val => <span>{moment(val).format('YYYY-MM-DD')}</span>,
        },
        {
            title: '操作',
            render: (data) => (
                <Fragment>
                    <a type="ghost" onClick={() => this.handleModalVisible(data.id)}>编辑</a>
                    
                    <Authorized authority={['ticketAudit']} >
                    <Divider type="vertical" />
                    <a type="ghost" onClick={() => this.handleAuditVisible(data.id,true)}>审核</a>
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
                        <FormItem label="票据编号">
                            {getFieldDecorator('no')(<Input placeholder="请输入" />)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="票据类别">
                            {getFieldDecorator('ticketType')(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.ticketTypeInfo.map(d => <Option key={d.id}>{d.name}</Option>)
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

   
  

    render() {
        return (
            <PageHeaderWrapper title="票据类别列表">

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

                    <NewForm
                        formInfo={this.state.formInfo}
                        ticketTypeInfo={this.state.ticketTypeInfo}
                        type={this.state.type}
                        wrappedComponentRef={(inst) => { this.newForm = inst; }} />
                </Modal>
                <AuditModal  isShowAudit={this.state.isShowAudit} 
                handleAuditVisible={this.handleAuditVisible}
                handleAudit={(_values)=>{
                    _values['id']=this.state.auditId;
                    submitAudit(this.props.dispatch,this.state.url,_values,this.handleAuditVisible())}}
                >
                </AuditModal>
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
        this.params.ticketType = '';
        this.handleFetch();
      };

      handleSearch = e => {
        e.preventDefault();
        const { form } = this.props;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          this.params.no = fieldsValue.no,
          this.params.ticketType = fieldsValue.ticketType;
          this.handleFetch();
        });
      };
    /*******************************************************************/
    handleAuditVisible = (id,flag) => {
        this.setState({
            auditId:id,
            isShowAudit:!!flag,
        })
    }

    componentDidMount() {
        this.handleFetch();
        this.handleFetchType();
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'ticket/fetch',
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
            type: 'ticketType/fetch',
            payload: { "page": 0, "pageSize": 0, "orderBy": "id" },
            callback: (response) => {
                if (response.code == 200 || response == 0) {
                    this.setState({
                        ticketTypeInfo: response.data.list
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
                type: 'ticket/fetchId',
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


@connect(({ project, loading }) => ({
    project,
    loading: loading,
}))
class NewForm extends React.Component {
    state={

        projectInfo:[]
    }
    componentDidMount() {
        this.fetchProject();
    }
    fetchProject=()=>{
        const { dispatch } = this.props;
        dispatch({
            type: 'project/fetch',
            payload: { "page": 0, "pageSize": 0, "orderBy": "id" },
            callback: (response) => {
                if (response.code == '200' || response.code == '0') {
                    this.setState({
                        projectInfo: response.data.list
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
        const ticketTypeInfo = this.props.ticketTypeInfo || {};
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
               <Form.Item label="项目" {...formItemLayout}>
                    {
                        formInfo && type == 'projectId' ? formInfo.projectId :
                            getFieldDecorator('projectId', {
                                initialValue: formInfo.projectId,
                                rules: [{
                                    required: true, message: '请选择项目',
                                }],
                            })(
                                <Select placeholder="-请选择-">
                                    {
                                        this.state.projectInfo.map(d => <Option value={d.id}>{d.projectName}</Option>)
                                    }
                                </Select>
                            )
                    }
                </Form.Item>
                <Form.Item label="票据类别" {...formItemLayout}>
                    {
                        formInfo && type == 'ticketType' ? formInfo.ticketType :
                            getFieldDecorator('ticketType', {
                                initialValue: formInfo.ticketType,
                                rules: [{
                                    required: true, message: '请选择票据类型',
                                }],
                            })(
                                <Select placeholder="-请选择-">
                                    {
                                        ticketTypeInfo.map(d => <Option key={d.id}>{d.name}</Option>)
                                    }
                                </Select>
                            )
                    }
                </Form.Item>
                
                <Form.Item label="费用" {...formItemLayout}>
                    {
                        formInfo && type == 'cost' ? formInfo.cost :
                            getFieldDecorator('cost', {
                                initialValue: formInfo.cost,
                                rules: [{
                                    required: true, message: '请填写费用',
                                }],
                            })(
                                <InputNumber min={0} step={0.01} />
                            )}
                </Form.Item>
                <Form.Item label="花费日期" {...formItemLayout}>
                    {
                        formInfo && type == 'costDate' ? formInfo.costDate :
                            getFieldDecorator('costDate', {
                                initialValue: formInfo.costDate == null ? moment(moment().locale('zh-cn').format('YYYY-MM-DD'), 'YYYY-MM-DD') : moment(formInfo.costDate, 'YYYY-MM-DD'),
                                rules: [{
                                    required: true, message: '请选择购买日期',
                                }],
                            })(
                                <DatePicker format="YYYY-MM-DD" />
                            )}
                </Form.Item>
                <Form.Item label="经办人" {...formItemLayout} disabled='true'>
                    {
                        formInfo && type == 'agent' ? formInfo.agent :
                            getFieldDecorator('agent', {
                                initialValue: formInfo.agent,
                                rules: [{
                                    required: true, message: '请填写经办人',
                                }],
                            })(
                                <Input />
                            )}
                </Form.Item>
                <Form.Item label="备注" {...formItemLayout}>
                    {
                        formInfo && type == 'remark' ? formInfo.remark :
                            getFieldDecorator('remark', {
                                initialValue: formInfo.remark,
                                rules: [{
                                    max: 200, message: '长度不超过255个字符',
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

