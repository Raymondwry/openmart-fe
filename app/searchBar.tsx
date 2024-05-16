import React, { useState } from "react";
import { Button, Input, Space, Select } from "antd";
import "antd/dist/reset.css";
import "tailwindcss/tailwind.css";

const { Option } = Select;
const SearchBar = ({
  searchColumn,
  setSearchColumn,
  search,
  setSearch,
  handleSearch,
  handleClearSearch,
}) => {
  return (
    <Space className="flex">
      <Select
        value={searchColumn}
        onChange={setSearchColumn}
        style={{ width: 120 }}
        placeholder="select"
      >
        <Option value="id">ID</Option>
        <Option value="name">Name</Option>
        <Option value="start_date">Start Date</Option>
      </Select>
      <Input.Search
        placeholder="Search"
        enterButton
        onSearch={handleSearch}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <Button onClick={handleClearSearch}>Clear</Button>
    </Space>
  );
};
export default SearchBar;
