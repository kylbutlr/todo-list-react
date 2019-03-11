import React from 'react';

export default ({ onSubmit, onChange, title, date, time, id }) => (
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
        type='date'
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
        type='time'
        autoComplete='off'
        value={time}
        onChange={e => onChange('time', e)}
      />
    </label>
    <input name='id' className='id-input' type='text' value={id} onChange={e => onChange('id', e)} />
    <input type='submit' value='Save Todo' />
  </form>
);
