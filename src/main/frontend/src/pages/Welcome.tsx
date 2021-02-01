import { Button, Card, Col, List, Menu, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, useIntl } from 'umi';

import { PlusOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';

import styles from './Welcome.less';
import { IHostCategory, IProtocolForm, IHostEntity } from './Welcome.interface';
import { protocolForms } from './Welcome.config';
import db from '@/services/welcome.db';
import { useLiveQuery } from 'dexie-react-hooks';
import { connect } from './guacamole';

export default () => {
  const intl = useIntl();

  const [hostModalVisible, handleModalVisible] = useState<boolean>(false);
  const [categoryModalVisible, setCategoryVisible] = useState<boolean>(false);
  const [hostConnectVisible, setHostConnectVisible] = useState<boolean>(false);
  const [currentHost, setCurrentHost] = useState<IHostEntity>({} as any);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | number>('all');
  const [selectedCategoryKeys, setSelectedKeys] = useState<string[]>(['all']);
  const [formlist, setformlist] = useState<IProtocolForm[]>([]);
  const [guac, setGuac] = useState<any>({});
  const clist = useLiveQuery(async () => {
    let datas = await db.categorys.toArray();
    console.log('datas ...', datas.unshift({ name: '全部主机', id: 'all' }));
    return datas;
  });
  const list = useLiveQuery(async () => {
    let datas = await db.hosts.toArray();
    console.log('datas ...', datas.unshift({} as any));
    return datas;
  });

  const connectHost = (host: IHostEntity) => {
    console.log('connect host is ...', host);
    setCurrentHost(host);
    setHostConnectVisible(true);
    setTimeout(() => {
      setGuac(connect(host));
    }, 1000);
  };

  function deletecategory() {
    if (selectedCategoryId !== 'all') {
      db.categorys.delete(selectedCategoryId);
      setSelectedKeys(['all']);
    }
  }

  const genThumbnail = () => {
    const canvas = document.querySelector("#display canvas") as HTMLCanvasElement;
    const image = canvas.toDataURL('image/jpeg');
    db.hosts.update(currentHost.id as any,{thumbnail: image});
  };

  const hideHostConnect = () => {
    genThumbnail();
    setHostConnectVisible(false);
    guac.disconnect();
  };
  const clistdom = clist
    ? clist.map((it) => (
        <Menu.Item
          onClick={() => {
            setSelectedCategoryId(it.id);
          }}
          key={it.id}
        >
          {it.name}
        </Menu.Item>
      ))
    : null;

  const formlistdom = formlist.map((item) => {
    if (item.type === 'number') {
      return (
        // <List.Item key={item.name}>
        <ProFormDigit
          label={item.message}
          name={item.name}
          min={1}
          max={65536}
          fieldProps={{ precision: 0, defaultValue: item.defaultValue }}
          rules={[{ required: item.required, message: item.message }]}
        />
        // </List.Item>
      );
    } else if (item.type === 'switch') {
      return (
        // <List.Item key={item.name}>
        <ProFormSwitch name={item.name} label={item.message} />
        // </List.Item>
      );
    } else {
      return (
        <ProFormText
          rules={[
            {
              required: item.required,
              message: (
                <FormattedMessage id={'pages.welcome.' + item.name} defaultMessage={item.message} />
              ),
            },
          ]}
          label={item.message}
          name={item.name}
        />
      );
    }
  });
  // if (!clist || !list) return null;
  return (
    <ProCard split="vertical">
      <ProCard title="分类列表" colSpan="30%">
        <Row>
          <Col span={24}>
            <div className="text-right my-8">
              <Button
                type="primary"
                onClick={() => {
                  setCategoryVisible(true);
                }}
              >
                新增分类
              </Button>
              <Button danger className="ml-8" onClick={deletecategory}>
                选中删除
              </Button>
            </div>
            <Menu
              mode="inline"
              selectedKeys={selectedCategoryKeys}
              onSelect={({ selectedKeys }) => {
                setSelectedKeys(selectedKeys as any);
              }}
            >
              <Menu.ItemGroup key="allC" title="全部分类">
                {clistdom}
              </Menu.ItemGroup>
            </Menu>
          </Col>
        </Row>
      </ProCard>
      <ProCard title="主机列表" headerBordered>
        <div style={{ height: 360 }}>
          <div className={styles.cardList}>
            <List<IHostEntity>
              rowKey="id"
              // grid={{ gutter: 24, lg: 3, md: 2, sm: 1, xs: 1 }}
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 3,
                lg: 3,
                xl: 4,
                xxl: 4,
              }}
              dataSource={list}
              renderItem={(item: IHostEntity) => {
                if (item && item.id) {
                  return (
                    <List.Item key={item.id}>
                      <Card
                        hoverable
                        className={styles.card}
                        cover={
                          <img
                            alt="image"
                            src={item.thumbnail}
                          />
                        }
                        actions={[
                          <a
                            key="option1"
                            onClick={() => {
                              connectHost(item);
                              // console.log("do connect ...");
                            }}
                          >
                            连接
                          </a>,
                          <a
                            key="option2"
                            onClick={() => {
                              db.hosts.delete(item.id as any);
                            }}
                          >
                            删除
                          </a>,
                        ]}
                      >
                        <Card.Meta title={<a>{item.name}</a>} />
                      </Card>
                    </List.Item>
                  );
                }
                return (
                  <List.Item>
                    <Button
                      type="dashed"
                      className={styles.newButton}
                      onClick={() => {
                        handleModalVisible(true);
                      }}
                    >
                      <PlusOutlined /> 新增主机
                    </Button>
                  </List.Item>
                );
              }}
            />
          </div>
        </div>
      </ProCard>

      <ModalForm
        title={intl.formatMessage({
          id: 'pages.welcome.createForm.newRule',
          defaultMessage: '新增主机',
        })}
        width="400px"
        visible={hostModalVisible}
        onVisibleChange={handleModalVisible}
        onValuesChange={(changeValues) => {
          console.log('changeValues ...', changeValues);
          if (changeValues.protocol) {
            setformlist(protocolForms[changeValues.protocol]);
          }
        }}
        onFinish={async (value: IHostEntity) => {
          console.log('value is ...', value);
          db.hosts.add(value);
          handleModalVisible(false);
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.welcome.name" defaultMessage="主机名称" />,
            },
          ]}
          name="name"
          label="主机名称"
        />
        <ProFormSelect
          name="protocol"
          label="连接协议"
          valueEnum={{
            ssh: 'ssh',
            rdp: 'rdp',
            vnc: 'vnc',
            telnet: 'telnet',
          }}
          rules={[{ required: true, message: '连接协议' }]}
        />
        {formlistdom}
      </ModalForm>
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.welcome.createForm.newRule',
          defaultMessage: '新增分类',
        })}
        width="400px"
        visible={categoryModalVisible}
        onVisibleChange={setCategoryVisible}
        onValuesChange={(changeValues) => {
          console.log('changeValues ...', changeValues);
          // if (changeValues.protocol) {
          //   setformlist(protocolForms[changeValues.protocol]);
          // }
        }}
        onFinish={async (value: IHostCategory) => {
          console.log('value is ...', value);
          db.categorys.add(value);
          setCategoryVisible(false);
        }}
      >
        <ProFormText
          rules={[
            {
              required: true,
              message: <FormattedMessage id="pages.welcome.name" defaultMessage="主机分类" />,
            },
          ]}
          name="name"
          label="主机分类"
        />
      </ModalForm>
      <Modal
        visible={hostConnectVisible}
        title={currentHost.name}
        onOk={hideHostConnect}
        onCancel={hideHostConnect}
        footer={null}
        maskClosable={false}
        width="1100px"
        destroyOnClose={true}
        centered={true}
      >
        <div id="display"></div>
      </Modal>
    </ProCard>
  );
};

// export default Welcome;
