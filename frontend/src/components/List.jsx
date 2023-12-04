/* eslint-disable react/prop-types */
import Item from './Item';

const List = ({ list, removeItem, updateItem }) => {
  return (
    <ul>
      {list.map((item) => (
        <Item key={item.id} item={item} removeItem={removeItem} updateItem={updateItem} />
      ))}
    </ul>
  );
};

export default List;
