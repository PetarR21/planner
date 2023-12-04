import { useEffect, useState } from 'react';
import List from './components/List';
import NewItem from './components/NewItem';
import Notification from './components/Notification';
import itemService from './services/items';

const App = () => {
  const [list, setList] = useState([]);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    itemService.getAll().then((initialList) => setList(initialList));
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const addItem = async (title) => {
    const newItem = await itemService.create(title);
    setList(list.concat(newItem));
    showNotification(`added new item '${title}'`, 'success');
  };

  const removeItem = async (item) => {
    await itemService.remove(item.id);
    showNotification(`removed item '${item.title}'`, 'success');
    setList(list.filter((i) => i.id !== item.id));
  };

  const updateItem = async (item) => {
    const updatedItem = await itemService.update(item);
    showNotification(`updated item '${item.title}'`, 'success');
    setList(list.map((i) => (i.id === item.id ? updatedItem : i)));
  };

  return (
    <div>
      <h1>My Planner</h1>
      <Notification notification={notification} />
      <List list={list} removeItem={removeItem} updateItem={updateItem} />
      <NewItem addItem={addItem} />
    </div>
  );
};

export default App;
