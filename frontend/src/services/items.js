import axios from 'axios';
const baseUrl = '/api/items';

const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};

const create = async (title) => {
  const response = await axios.post(baseUrl, { title, completed: false });
  return response.data;
};

const update = async (item) => {
  const response = await axios.put(`${baseUrl}/${item.id}`, {
    ...item,
    completed: !item.completed,
  });
  return response.data;
};

const remove = async (id) => {
  const response = await axios.delete(`${baseUrl}/${id}`);
  return response.data;
};

export default {
  getAll,
  create,
  update,
  remove,
};
