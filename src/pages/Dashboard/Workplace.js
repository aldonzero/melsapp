import React, { PureComponent,Fragment } from 'react';
import moment from 'moment';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import {  Card, Table, Avatar,Divider } from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { pagination } from '@/utils/utils'
import styles from './Workplace.less';


@connect(({ user, project, loading, login }) => ({
  currentUser: user.currentUser,
  project,
  userId: login.userId,
  loading: loading,
}))
class Workplace extends PureComponent {
  state = {
    list: [],
    url: 'project'
  };
  params = {
    page: 1,
    pageSize: 10,
    name: ''
  }
  componentDidMount() {
    const { dispatch, userId } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
      payload: userId
    });
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
          console.log('response',response.data.list)
          this.setState({
            list: response.data.list,
            pagination: pagination(response, (current) => {
              _this.params.page = current;
              _this.handleFetch();
            })
          })
          console.log('state list',this.state.list)
        }
      }
    });
  }

  handleToWorkingPage=(_id)=>{
    this.props.dispatch(routerRedux.push({ 
        pathname: '../project/profile',
        query: {id: _id}
        }))
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
      render(val) {
        let config = {
          '0': '暂存', '1': '审核中', '2': '立项', '3': '施工', '4': '竣工', '5': '放弃'
        }
        return config[val];
      }
    },

  ];



  render() {
    const {
      currentUser,
    } = this.props;

    const pageHeaderContent =
      currentUser && Object.keys(currentUser).length ? (
        <div className={styles.pageHeaderContent}>
          <div className={styles.avatar}>
            <Avatar size="large" src={currentUser.avatar} />
          </div>
          <div className={styles.content}>
            <div className={styles.contentTitle}>
              欢迎，
              {currentUser.name}
              ，访问设备租赁信息管理系统！
            </div>
            {/* <div>
              {currentUser.title} |{currentUser.group}
            </div> */}
          </div>
        </div>
      ) : null;



    return (
      
      <PageHeaderWrapper
        title=" "
        content={pageHeaderContent}
      // extraContent={extra}
      >
        {/* <Card bordered={false} title='项目列表'>
          <div className={styles.tableList}>
            <Table
              bordered
              columns={this.columns}
              dataSource={this.state.list}
              pagination={this.state.pagination}
            />

          </div>
        </Card> */}
      </PageHeaderWrapper>
    );
  }
}

export default Workplace;
