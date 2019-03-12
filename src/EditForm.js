import React from 'react';

export default ({ onSubmit, onChange, title, date, time, id }) => (
  <div className='card'>
    <div className='card-header has-background-dark'>
      <h1 className='card-header-title subtitle is-centered has-text-light'>Edit Todo:</h1>
    </div>
    <div className='card-content'>
      <div className='field'>
        <label className='label'>Title</label>
        <div className='control'>
          <input
            className='input'
            name='title'
            type='text'
            autoComplete='off'
            required
            value={title}
            onChange={e => onChange('title', e)}
          />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Date</label>
        <div className='control'>
          <input
            className='input'
            name='date'
            type='date'
            autoComplete='off'
            value={date}
            onChange={e => onChange('date', e)}
          />
        </div>
      </div>
      <div className='field'>
        <label className='label'>Time</label>
        <div className='control'>
          <input
            className='input'
            name='time'
            type='time'
            autoComplete='off'
            value={time}
            onChange={e => onChange('time', e)}
          />
        </div>
      </div>
      <div className='control'>
        <input
          name='id'
          className='id-input'
          type='text'
          value={id}
          onChange={e => onChange('id', e)}
        />
      </div>
      <div className='control'>
        <button
          className='button is-primary is-fullwidth has-text-dark subtitle has-text-weight-semibold'
          onClick={onSubmit}>
          Save Todo
        </button>
      </div>
    </div>
  </div>
);
