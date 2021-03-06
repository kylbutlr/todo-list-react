import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faTrashAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';

export default class Navbar extends Component {
  render() {
    return (
      <div>
        <nav className='navbar is-fixed-top is-primary'>
          <div className='navbar-brand'>
            <div className='navbar-item' onClick={() => this.props.tabClick(this.props.tabs.VIEW)}>
              <h1 className='title has-text-light'>To-do List</h1>
            </div>
            <div className='navbar-item navbar-buttons'>
              <div className='is-vertical-center'>
                <button
                  className='button is-primary'
                  onClick={() => this.props.tabClick(this.props.tabs.VIEW)}
                  style={{
                    display: this.props.activeTab !== this.props.tabs.VIEW ? 'flex' : 'none',
                  }}>
                  <FontAwesomeIcon icon={faTimesCircle} size='lg' style={{ color: '#F5F5F5' }} />
                  <h1 className='subtitle has-text-light'>
                    Back<span> to List</span>
                  </h1>
                </button>
              </div>
              <div className='is-vertical-center'>
                <button
                  className='button is-primary'
                  onClick={() => this.props.tabClick(this.props.tabs.CREATE)}
                  style={{
                    display: this.props.activeTab === this.props.tabs.VIEW ? 'flex' : 'none',
                  }}>
                  <FontAwesomeIcon icon={faPlusCircle} size='lg' style={{ color: '#F5F5F5' }} />
                  <h1 className='subtitle has-text-light'>
                    Create<span> To-do</span>
                  </h1>
                </button>
              </div>
              <div className='is-vertical-center'>
                <button className='button is-primary' onClick={() => this.props.handleDeleteAll()}>
                  <FontAwesomeIcon icon={faTrashAlt} size='lg' style={{ color: '#F5F5F5' }} />
                  <h1 className='subtitle has-text-light'>
                    Delete<span> All</span>
                  </h1>
                </button>
              </div>
            </div>
          </div>
        </nav>
      </div>
    )
  }
}
