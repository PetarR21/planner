/* eslint-disable react/prop-types */
import { useState } from 'react';

const NewItem = ({ addItem }) => {
  const [title, setTitle] = useState('');

  const create = (event) => {
    event.preventDefault();
    addItem(title);
    setTitle('');
  };

  return (
    <div>
      <h2>Add new item</h2>
      <form onSubmit={create}>
        title:{' '}
        <input name='title' value={title} onChange={({ target }) => setTitle(target.value)} />
        <button type='submit'>create</button>
      </form>
    </div>
  );
};

export default NewItem;
