import React from 'react';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({ id, title, formattedDate, formattedTime, handleEditTodo, handleDeleteTodo, handleCheckComplete }) => (
  <div className='todo'>
    <div className='box has-fullwidth'>
      <div
        className='todo-info'
        onClick={() => {
          handleCheckComplete(id);
        }}>
        <p className='is-size-5 has-text-centered'>{title}</p>
        <p
          className='is-size-7 has-text-centered'
          style={{
            display: formattedDate ? 'block' : 'none',
          }}>
          by: {formattedDate}
        </p>
        <p
          className='is-size-7 has-text-centered'
          style={{
            display: formattedTime ? 'block' : 'none',
          }}>
          at: {formattedTime}
        </p>
      </div>
    </div>
    <div className='todo-buttons'>
      <div className='button'>
        <FontAwesomeIcon icon={faEdit} data-id={id} onClick={() => handleEditTodo(id)}/>
      </div>
      <div className='button'>
        <FontAwesomeIcon icon={faTrashAlt} data-id={id} onClick={() => handleDeleteTodo(id)}/>
      </div>
      {/*<button className='edit-button' data-id={id} onClick={() => handleEditTodo(id)}>
        Edit
      </button>
      <button className='delete-button' data-id={id} onClick={() => handleDeleteTodo(id)}>
        Delete
      </button>*/}
    </div>
  </div>
);
