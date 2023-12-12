import axios from 'axios';
const baseUrl = '/api/items';

let token = null;

const setToken = (newToken) => {
  token = `bearer ${newToken}`;
};

const getAll = async () => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.get(baseUrl, config);
  return response.data;
};

const create = async (title) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.post(baseUrl, { title, completed: false }, config);
  return response.data;
};

const update = async (item) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.put(
    `${baseUrl}/${item.id}`,
    {
      completed: !item.completed,
    },
    config
  );
  return response.data;
};

const remove = async (id) => {
  const config = {
    headers: { Authorization: token },
  };
  const response = await axios.delete(`${baseUrl}/${id}`, config);
  return response.data;
};

export default {
  getAll,
  create,
  update,
  remove,
  setToken,
};
