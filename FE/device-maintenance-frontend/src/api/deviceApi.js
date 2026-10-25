// File này chứa các hàm gọi API thiết bị (danh sách, chi tiết, bảo trì).

import axiosClient from "./axiosClient";

const deviceApi = {
  getAll: () => axiosClient.get("/api/v1/devices"),
  getById: (id) => axiosClient.get(`/api/v1/devices/${id}`),
};

export default deviceApi;
