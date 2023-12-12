import { useEffect, useRef, useState } from 'react';
import List from './components/List';
import NewItem from './components/NewItem';
import LoginForm from './components/LoginForm';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import itemService from './services/items';
import loginService from './services/login';

const App = () => {
  const [list, setList] = useState([]);
  const [notification, setNotification] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      itemService.setToken(user.token);
      itemService.getAll().then((initialList) => setList(initialList));
    }
  }, []);

  const showNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const addItem = async (title) => {
    try {
      const newItem = await itemService.create(title);
      setList(list.concat(newItem));
      showNotification(`added new item '${title}'`, 'success');
      newItemRef.current.toggleVisibility();
    } catch (error) {
      showNotification(error.response.data.error, 'error');
    }
  };

  const removeItem = async (item) => {
    try {
      await itemService.remove(item.id);
      showNotification(`removed item '${item.title}'`, 'success');
      setList(list.filter((i) => i.id !== item.id));
    } catch (error) {
      showNotification(error.response.data.error, 'error');
    }
  };

  const updateItem = async (item) => {
    try {
      const updatedItem = await itemService.update(item);
      showNotification(`updated item '${item.title}'`, 'success');
      setList(list.map((i) => (i.id === item.id ? updatedItem : i)));
    } catch (error) {
      showNotification(error.response.data.error, 'error');
    }
  };

  const loginFormRef = useRef();

  const loginUser = async (credentials) => {
    loginService
      .login(credentials)
      .then((user) => {
        setUser(user);
        window.localStorage.setItem('loggedUser', JSON.stringify(user));
        itemService.setToken(user.token);
        loginFormRef.current.setUsername('');
        loginFormRef.current.setPassword('');
        showNotification('Logged in successfully', 'success');
        itemService.getAll().then((initialList) => setList(initialList));
      })
      .catch(() => {
        showNotification('Wrong credentials', 'error');
      });
  };

  const loginForm = () => {
    return (
      <div>
        <h2>Log in to application</h2>
        <LoginForm handleLogin={loginUser} ref={loginFormRef} />
      </div>
    );
  };

  const logout = () => {
    setUser(null);
    window.localStorage.removeItem('loggedUser');
    itemService.setToken(null);
    showNotification('Logged out successfully', 'success');
    setList([]);
  };

  const newItemRef = useRef();

  const itemList = () => {
    return (
      <div>
        <div>
          {user.name} logged in <button onClick={logout}>logout</button>
        </div>
        <List list={list} removeItem={removeItem} updateItem={updateItem} />
        <Togglable buttonLabel='add' ref={newItemRef}>
          <NewItem addItem={addItem} />
        </Togglable>
      </div>
    );
  };

  return (
    <div>
      <h1>My Planner</h1>
      <Notification notification={notification} />
      {user === null ? loginForm() : itemList()}
    </div>
  );
};

export default App;
