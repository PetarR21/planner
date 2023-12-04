/* eslint-disable react/prop-types */
const Item = ({ item, removeItem, updateItem }) => {
  return (
    <li onClick={() => updateItem(item)}>
      <span className={item.completed ? 'completedItem' : ''}>{item.title}</span>
      <button
        onClick={() => {
          removeItem(item);
        }}
      >
        remove
      </button>
    </li>
  );
};

export default Item;
