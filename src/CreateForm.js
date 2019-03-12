import React from 'react';

export default ({ onSubmit, onChange, title, date, time }) => (
  <div className='card'>
    <div className='card-header has-background-primary'>
      <h1 className='card-header-title title is-4 is-centered'>New Todo</h1>
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
        <button className='button is-primary is-fullwidth' onClick={onSubmit}>Create Todo</button>
      </div>
    </div>
  </div>
);
