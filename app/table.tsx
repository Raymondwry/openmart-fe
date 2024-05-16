"use client";

import React, { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Row,
  Col,
  DatePicker,
  message,
  TablePaginationConfig,
} from "antd";
import { ColumnsType, SortOrder, SorterResult } from "antd/lib/table/interface";
import moment from "moment";
import useData from "./useData";
import { DataItem } from "./table.types";
import SearchBar from "./searchBar";

const AppTable: React.FC = () => {
  const [editingItem, setEditingItem] = useState<DataItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const {
    data,
    total,
    loading,
    pagination,
    search,
    searchColumn,
    sorter,
    setSearchColumn,
    handleDelete,
    handleSave,
    handleTableChange,
    handleSearch,
    handleClearSearch,
    setSearch,
  } = useData();

  const columns: ColumnsType<DataItem> = [
    {
      key: "order",
      render: (_: any, __: DataItem, index: number) => (
        <div className="table-cell">{index + 1}</div>
      ),
    },
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: DataItem, b: DataItem) => a.id - b.id,
      sortOrder: (sorter.field === "id" ? sorter.order : undefined) as SortOrder,
      render: (text: number) => <div className="table-cell">{text}</div>,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      sorter: (a: DataItem, b: DataItem) => a.name.localeCompare(b.name),
      sortOrder: (sorter.field === "name" ? sorter.order : undefined) as SortOrder,
      render: (text: string) => <div className="table-cell">{text}</div>,
    },
    {
      title: "Reviews",
      dataIndex: "reviews",
      key: "reviews",
      sorter: (a: DataItem, b: DataItem) => a.reviews - b.reviews,
      sortOrder: (sorter.field === "reviews" ? sorter.order : undefined) as SortOrder,
      className: "text-right",
      render: (text: number) => <div className="table-cell">{text}</div>,
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      key: "start_date",
      sorter: (a: DataItem, b: DataItem) =>
        moment(a.start_date).unix() - moment(b.start_date).unix(),
      sortOrder: (sorter.field === "start_date" ? sorter.order : undefined) as SortOrder,
      render: (text: string) => (
        <div className="table-cell">{moment(text).format("YYYY-MM-DD")}</div>
      ),
    },
    {
      title: "Picture",
      dataIndex: "picture",
      key: "picture",
      render: (text: string) => (
        <div className="table-cell">
          <a href={text} target="_blank" rel="noopener noreferrer">
            {text}
          </a>
        </div>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: DataItem) => (
        <Space size="middle">
          <Button onClick={() => handleEdit(record)}>Edit</Button>
          <Button onClick={() => handleDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const handleAdd = () => {
    setEditingItem(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleEdit = (record: DataItem) => {
    setEditingItem(record);
    form.setFieldsValue({
      ...record,
      start_date: moment(record.start_date),
    });
    setIsModalOpen(true);
  };

  const handleSaveData = async () => {
    try {
      const values = await form.validateFields();
      await handleSave(values, editingItem);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error validating fields:", error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await Promise.all(
        selectedRowKeys.map((key) => handleDelete(key as number))
      );
      setSelectedRowKeys([]);
      message.success("Selected items deleted successfully");
    } catch (error) {
      message.error("Error deleting selected items");
    }
  };

  const onTableChange = (
    pagination: TablePaginationConfig,
    filters: Record<string, (string | number | boolean)[] | null>,
    sorter: SorterResult<DataItem> | SorterResult<DataItem>[]
  ) => {
    handleTableChange(
      {
        current: pagination.current!,
        pageSize: pagination.pageSize!,
      },
      filters,
      sorter as SorterResult<DataItem>
    );
  };

  return (
    <div className="p-0 m-0" style={{ height: "100vh", padding: 0, margin: 0 }}>
      <Row gutter={16} className="mb-4" justify="space-between" style={{ margin: 0, padding: 0 }}>
        <Col style={{ margin: 0, padding: 0 }}>
          <SearchBar
            searchColumn={searchColumn}
            setSearchColumn={setSearchColumn}
            search={search}
            setSearch={setSearch}
            handleSearch={handleSearch}
            handleClearSearch={handleClearSearch}
          />
        </Col>
        <Col style={{ margin: 0, padding: 0 }}>
          <Space>
            <span>
              {selectedRowKeys.length} / {data.length} rows selected
            </span>
            <Button
              onClick={handleDeleteSelected}
              disabled={selectedRowKeys.length === 0}
              type="primary"
              danger
            >
              Delete Selected
            </Button>
          </Space>
        </Col>
      </Row>
      <div className="flex flex-col">
        <Table<DataItem>
          columns={columns}
          dataSource={data}
          rowKey="id"
          pagination={{ ...pagination, total, style: { marginBottom: 0 } }} 
          loading={loading}
          onChange={onTableChange}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          className="custom-table"
          style={{ width: "100%", height: "calc(100% - 60px)", margin: 0, padding: 0 }} 
        />
        <Button onClick={handleAdd} className="border-none hover:bg-gray-500 mt-2" style={{ width: "5cm", height: "5cm" }}>
          + Add Item
        </Button>
      </div>
      <Modal
        title={editingItem ? "Edit Item" : "Add Item"}
        visible={isModalOpen}
        onOk={handleSaveData}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input className="w-full" />
          </Form.Item>
          <Form.Item
            name="reviews"
            label="Reviews"
            rules={[{ required: true, message: "Please enter reviews" }]}
          >
            <Input type="number" min={0} className="w-full" />
          </Form.Item>
          <Form.Item
            name="start_date"
            label="Start Date"
            rules={[{ required: true, message: "Please enter start date" }]}
          >
            <DatePicker style={{ width: "100%" }} className="w-full" />
          </Form.Item>
          <Form.Item
            name="picture"
            label="Picture"
            rules={[
              {
                required: true,
                message: "Please enter picture URL",
                type: "url",
              },
            ]}
          >
            <Input className="w-full" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AppTable;
