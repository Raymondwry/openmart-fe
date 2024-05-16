"use client";

import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Space, message } from 'antd';
import 'antd/dist/reset.css'; // 使用 antd v5+ 的正确路径
import './globals.css'; // 假设 Tailwind CSS 全局配置

export interface DataItem {
  id: number;
  name: string;
  reviews: number;
  start_date: string;
  picture: string;
}

const AppTable = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:3001/data');
      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: DataItem) => {
    setEditingItem(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:3001/data/${id}`, { method: 'DELETE' });
      message.success('Deleted successfully');
      fetchData();
    } catch (error) {
      console.error('Error deleting data:', error);
      message.error('Failed to delete');
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const method = editingItem ? 'PUT' : 'POST';
      const url = editingItem ? `http://localhost:3001/data/${editingItem.id}` : 'http://localhost:3001/data';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      message.success('Saved successfully');
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving data:', error);
      message.error('Failed to save');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      className: 'p-4',
      onCell: () => ({
        style: { width: 200, height: 34 },
      }),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      className: 'p-4',
      onCell: () => ({
        style: { width: 200, height: 34 },
      }),
    },
    {
      title: 'Reviews',
      dataIndex: 'reviews',
      key: 'reviews',
      className: 'p-4 text-right',
      onCell: () => ({
        style: { width: 200, height: 34 },
      }),
    },
    {
      title: 'Start Date',
      dataIndex: 'start_date',
      key: 'start_date',
      className: 'p-4',
      onCell: () => ({
        style: { width: 200, height: 34 },
      }),
    },
    {
      title: 'Picture',
      dataIndex: 'picture',
      key: 'picture',
      className: 'p-4',
      render: (text:string) => <a href={text} target="_blank" rel="noopener noreferrer">{text}</a>,
      onCell: () => ({
        style: { width: 200, height: 34 },
      }),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record:DataItem) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <Button type="primary" onClick={handleAdd} className="mb-4">Add Item</Button>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        className="hover-blue-columns"
      />
      <Modal
        title={editingItem ? 'Edit Item' : 'Add Item'}
        visible={isModalOpen}
        onOk={handleSave}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter name' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="reviews" label="Reviews" rules={[{ required: true, message: 'Please enter reviews' }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="start_date" label="Start Date" rules={[{ required: true, message: 'Please enter start date' }]}>
            <Input />
          </Form.Item>
          <Form.Item name="picture" label="Picture" rules={[{ required: true, message: 'Please enter picture URL' }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppTable;
