import React from 'react';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default ({
  id,
  title,
  formattedDate,
  formattedTime,
  handleEditTodo,
  handleDeleteTodo,
  handleCheckComplete,
}) => (
  <div className='todo'>
    <div
      className='box has-fullwidth has-background-light'
      onClick={() => {
        handleCheckComplete(id);
      }}>
      <div className='todo-info has-text-dark'>
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
      <div className='button has-background-dark has-text-white' onClick={() => handleEditTodo(id)}>
        <FontAwesomeIcon icon={faEdit} data-id={id} />
      </div>
      <div
        className='button has-background-dark has-text-white'
        onClick={() => handleDeleteTodo(id)}>
        <FontAwesomeIcon icon={faTrashAlt} data-id={id} />
      </div>
    </div>
  </div>
);
