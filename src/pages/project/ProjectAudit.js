import React, { Component, Fragment } from 'react';
import Debounce from 'lodash-decorators/debounce';
import Bind from 'lodash-decorators/bind';
import { connect } from 'dva';
import moment from 'moment';
import {
    Popover,
    Tooltip,
    Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider, Steps, Radio, Table
} from 'antd';
import FooterToolbar from '@/components/FooterToolbar';
import DescriptionList from '@/components/DescriptionList';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './AdvancedProfile.less';
import { pagination } from '@/utils/utils'
import { submitForm, submitDelete } from '@/utils/event';

const { Description } = DescriptionList;
const ButtonGroup = Button.Group;
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

@connect(({ working, project, loading }) => ({
    working,
    project,
    loading: loading,
}))
@Form.create()
export default class ProjectProfile extends Component {
    state = {
        list: [],
        projectInfo: [],
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
            title: '项目编号',
            dataIndex: 'project.no',
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
                    <a type="danger" onClick={() => submitDelete(this.props.dispatch, 'working', data.id, this.handleFetch)} >删除</a>
                </Fragment>
            ),
        },
    ];




    componentDidMount() {
        const query_params = new URLSearchParams(this.props.location.search);
        const id = query_params.get('id');
        this.handleFetch();
        if (id != null && id != '') {
            this.handleFetchProject(id)
        }
    }

    handleFetch = () => {
        let _this = this;
        this.props.dispatch({
            type: 'working/fetch',
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

    handleFetchProject = (id) => {
        const { dispatch } = this.props;
        dispatch({
            type: 'project/fetchId',
            payload: id,
            callback: (response) => {
                if (response.code == '200' || response.code == '0') {
                    this.setState({
                        projectInfo: response.data
                    })
                }
            }
        });
    }

    render() {
        const { projectInfo } = this.state;
        const { profile, loading } = this.props;
        const description = (
            <DescriptionList className={styles.headerList} size="small" col="2">
                <Description term="项目名">{projectInfo.projectName}</Description>
                <Description term="地址">{projectInfo.address}</Description>
                <Description term="开始日期">{projectInfo.startDate}</Description>
                <Description term="关联单据">{projectInfo.endDate}</Description>
                <Description term="结束日期">{projectInfo.endDate}</Description>
                <Description term="备注">{projectInfo.description}</Description>
            </DescriptionList>
        );
        const extra = (
            <Row>
                <Col xs={24} sm={12}>
                    <div className={styles.textSecondary}>状态</div>
                    <div className={styles.heading}>待审批</div>
                </Col>
                <Col xs={24} sm={12}>
                    <div className={styles.textSecondary}>订单金额</div>
                    <div className={styles.heading}></div>
                </Col>
            </Row>
        );

        return (
            <PageHeaderWrapper
                title="项目编号：123131"
                logo={
                    <img alt="" src="https://gw.alipayobjects.com/zos/rmsportal/nxkuOJlFJuAUhzlMTCEe.png" />
                }
                content={description}
            // extraContent={extra}
            >
                <Card title="建设单位信息" style={{ marginBottom: 24 }} bordered={false}>
                    <DescriptionList style={{ marginBottom: 24 }} title={projectInfo.constructionUnit}>
                        <Description term="联系人">{projectInfo.unitContacts}</Description>
                        <Description term="联系电话">{projectInfo.unitPhone}</Description>
                        <Description>&nbsp;</Description>
                        <Description term="单位地址">{projectInfo.unitAddress}</Description>
                    </DescriptionList>
                </Card>
                <Modal
                    title='项目审核'
                    visible={this.state.isShowForm}
                    onOk={() => submitForm(this.newForm, this.state.type, this.props.dispatch, 'project', this.formCallback)}
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
                <FooterToolbar style={{width:"100%"}}>
                        <Button type="primary" onClick={() => { this.submitForm(1) }} > 提交</Button>
                        <Button type="primary" onClick={() => { this.submitForm(0) }}> 暂存</Button>
                        <Button > 取消</Button>
                    </FooterToolbar>
            </PageHeaderWrapper>
        );
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
                                    <Option value=''>{d.projectName}</Option>
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
