import React from 'react';

export default ({ onSubmit, onChange, title, date, time }) => (
  <form onSubmit={onSubmit}>
    <label>
      <span>Todo:</span>
      <br />
      <input
        name='title'
        type='text'
        autoComplete='off'
        required
        value={title}
        onChange={e => onChange('title', e)}
      />
    </label>
    <label>
      <span>Date:</span>
      <br />
      <input
        name='date'
        type='text'
        autoComplete='off'
        value={date}
        onChange={e => onChange('date', e)}
      />
    </label>
    <label>
      <span>Time:</span>
      <br />
      <input
        name='time'
        type='text'
        autoComplete='off'
        value={time}
        onChange={e => onChange('time', e)}
      />
    </label>
    <input type='submit' value='Create Todo' />
  </form>
);
