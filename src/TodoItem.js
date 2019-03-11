import React from 'react';

export default ({ id, title, formattedDate, formattedTime, handleEditTodo, handleDeleteTodo, handleCheckComplete }) => (
  <div className='todo'>
    <div
      className='todo-info'
      onClick={() => {
        handleCheckComplete(id);
      }}>
      <p className='p1'>{title}</p>
      <p
        className='p2'
        style={{
          display: formattedDate ? 'block' : 'none',
        }}>
        by: {formattedDate}
      </p>
      <p
        className='p3'
        style={{
          display: formattedTime ? 'block' : 'none',
        }}>
        at: {formattedTime}
      </p>
    </div>
    <div className='todo-buttons'>
      <button className='edit-button' data-id={id} onClick={() => handleEditTodo(id)}>
        Edit
      </button>
      <button className='delete-button' data-id={id} onClick={() => handleDeleteTodo(id)}>
        Delete
      </button>
    </div>
  </div>
);
