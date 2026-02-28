import {
  Button,
  DatePicker,
  Form,
  Input,
  Layout,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  message,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { login, register } from '../api/auth';
import { createPlan, deletePlan, getPlans, Plan, updatePlan } from '../api/plans';

const { Header, Content } = Layout;

const statusColor: Record<string, string> = {
  todo: 'blue',
  doing: 'orange',
  done: 'green',
};

export function App() {
  const [authed, setAuthed] = useState(Boolean(localStorage.getItem('token')));
  const [plans, setPlans] = useState<Plan[]>([]);
  const [category, setCategory] = useState<string | undefined>();
  const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [editing, setEditing] = useState<Plan | null>(null);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = async () => {
    if (!authed) return;
    const data = await getPlans({
      category,
      startDate: dateRange?.[0]?.toISOString(),
      endDate: dateRange?.[1]?.toISOString(),
    });
    setPlans(data);
  };

  useEffect(() => {
    void load();
  }, [authed, category, dateRange]);

  const submitAuth = async (values: { username: string; password: string; mode: 'login' | 'register' }) => {
    const fn = values.mode === 'register' ? register : login;
    const data = await fn(values.username, values.password);
    localStorage.setItem('token', data.accessToken);
    message.success(values.mode === 'register' ? '注册成功' : '登录成功');
    setAuthed(true);
  };

  const onSavePlan = async () => {
    const values = await form.validateFields();
    const payload = {
      title: values.title,
      description: values.description,
      category: values.category,
      status: values.status,
      dueDate: values.dueDate.toISOString(),
    };
    if (editing) {
      await updatePlan(editing.id, payload);
      message.success('更新成功');
    } else {
      await createPlan(payload);
      message.success('新增成功');
    }
    setOpen(false);
    setEditing(null);
    form.resetFields();
    await load();
  };

  if (!authed) {
    return (
      <Layout style={{ minHeight: '100vh', placeItems: 'center' }}>
        <Content style={{ width: 360, marginTop: 120 }}>
          <Form onFinish={submitAuth} initialValues={{ mode: 'login' }} layout="vertical">
            <Form.Item name="mode" label="模式">
              <Select options={[{ value: 'login', label: '登录' }, { value: 'register', label: '注册' }]} />
            </Form.Item>
            <Form.Item name="username" label="用户名" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="password" label="密码" rules={[{ required: true }]}>
              <Input.Password />
            </Form.Item>
            <Button htmlType="submit" type="primary" block>
              提交
            </Button>
          </Form>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ color: '#fff', display: 'flex', justifyContent: 'space-between' }}>
        <span>工作计划管理系统</span>
        <Button
          onClick={() => {
            localStorage.removeItem('token');
            setAuthed(false);
          }}
        >
          退出登录
        </Button>
      </Header>
      <Content style={{ padding: 24 }}>
        <Space style={{ marginBottom: 16 }}>
          <Select
            placeholder="按分类筛选"
            allowClear
            style={{ width: 180 }}
            onChange={(v) => setCategory(v)}
            options={Array.from(new Set(plans.map((p) => p.category))).map((v) => ({ value: v, label: v }))}
          />
          <DatePicker.RangePicker onChange={(v) => setDateRange(v as [dayjs.Dayjs, dayjs.Dayjs] | null)} />
          <Button
            type="primary"
            onClick={() => {
              setEditing(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            新增计划
          </Button>
        </Space>

        <Table
          rowKey="id"
          dataSource={plans}
          columns={[
            { title: '标题', dataIndex: 'title' },
            { title: '描述', dataIndex: 'description' },
            { title: '分类', dataIndex: 'category' },
            {
              title: '状态',
              dataIndex: 'status',
              render: (v: string) => <Tag color={statusColor[v]}>{v}</Tag>,
            },
            {
              title: '截止日期',
              dataIndex: 'dueDate',
              render: (v: string) => dayjs(v).format('YYYY-MM-DD HH:mm'),
            },
            {
              title: '操作',
              render: (_, row) => (
                <Space>
                  <Button
                    onClick={() => {
                      setEditing(row);
                      form.setFieldsValue({ ...row, dueDate: dayjs(row.dueDate) });
                      setOpen(true);
                    }}
                  >
                    编辑
                  </Button>
                  <Button
                    danger
                    onClick={async () => {
                      await deletePlan(row.id);
                      message.success('删除成功');
                      await load();
                    }}
                  >
                    删除
                  </Button>
                </Space>
              ),
            },
          ]}
        />

        <Modal
          title={editing ? '编辑计划' : '新增计划'}
          open={open}
          onCancel={() => setOpen(false)}
          onOk={() => void onSavePlan()}
        >
          <Form form={form} layout="vertical" initialValues={{ status: 'todo' }}>
            <Form.Item name="title" label="标题" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="description" label="描述">
              <Input.TextArea rows={3} />
            </Form.Item>
            <Form.Item name="category" label="分类" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="status" label="状态" rules={[{ required: true }]}>
              <Select
                options={[
                  { label: '待办', value: 'todo' },
                  { label: '进行中', value: 'doing' },
                  { label: '已完成', value: 'done' },
                ]}
              />
            </Form.Item>
            <Form.Item name="dueDate" label="截止日期" rules={[{ required: true }]}>
              <DatePicker showTime style={{ width: '100%' }} />
            </Form.Item>
          </Form>
        </Modal>
      </Content>
    </Layout>
  );
}
