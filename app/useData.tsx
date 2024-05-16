import { useState, useEffect } from "react";
import { message } from "antd";
import { DataItem } from "./table.types";

const useData = () => {
  const [data, setData] = useState<DataItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [searchColumn, setSearchColumn] = useState("");
  const [sorter, setSorter] = useState({ field: "id", order: "ascend" });

  useEffect(() => {
    fetchData();
  }, [pagination.current, pagination.pageSize, search, searchColumn, sorter]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/data?page=${pagination.current}&pageSize=${pagination.pageSize}&search=${search}&searchColumn=${searchColumn}&sortField=${sorter.field}&sortOrder=${sorter.order}`
      );
      const result = await response.json();
      setData(result.data);
      setTotal(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Failed to fetch data");
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${id}`, { method: "DELETE" });
      message.success("Deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting data:", error);
      message.error("Failed to delete");
    }
  };

  const handleSave = async (values, editingItem) => {
    try {
      values.start_date = values.start_date.format("YYYY-MM-DD");
      values.reviews = Number(values.reviews);
      if (isNaN(values.reviews)) {
        message.error("Reviews must be a number");
        return;
      }

      const method = editingItem ? "PUT" : "POST";
      const url = editingItem
        ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/data/${editingItem.id}`
        : `${process.env.NEXT_PUBLIC_API_BASE_URL}/data`;
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      message.success("Saved successfully");
      fetchData();
    } catch (error) {
      console.error("Error saving data:", error);
      message.error("Failed to save");
    }
  };

  const handleTableChange = (pagination, _filters, sorter) => {
    setPagination(pagination);
    setSorter({ field: sorter.field, order: sorter.order });
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setPagination({ ...pagination, current: 1 });
  };

  const handleClearSearch = () => {
    setSearch("");
    setSearchColumn("");
    setPagination({ ...pagination, current: 1 });
  };

  return {
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
  };
};

export default useData;
