import React, { Component } from 'react';

export default class CreateForm extends Component {
  render() {
    return (
      <div
        className='Create-Form'
        style={{
          display: this.props.activeTab === this.props.tabs.CREATE ? 'block' : 'none',
        }}>
        <div className='card'>
          <div className='card-header has-background-dark'>
            <h1 className='card-header-title subtitle is-centered has-text-light'>Create Todo</h1>
          </div>
          <form className='card-content'>
            <div className='field'>
              <label className='label'>Title</label>
              <div className='control'>
                <input
                  className='input'
                  id='create-input'
                  name='title'
                  type='text'
                  autoComplete='off'
                  required
                  value={this.props.title}
                  onChange={e => this.props.onChange('title', e)}
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
                  value={this.props.date}
                  onChange={e => this.props.onChange('date', e)}
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
                  value={this.props.time}
                  onChange={e => this.props.onChange('time', e)}
                />
              </div>
            </div>
            <div className='control'>
              <button
                className='button is-primary is-fullwidth has-text-light subtitle has-text-weight-semibold'
                onClick={this.props.onSubmit}>
                Create Todo
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}
