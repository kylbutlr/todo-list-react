import React, { Component } from 'react';
import TodoItem from './TodoItem';

export default class TodosComplete extends Component {
  renderCompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.props.formatDateToRead(date);
    const formattedTime = this.props.formatAmPm(time);
    return (
      <li key={id} style={{ display: complete ? 'block' : 'none' }} className='complete'>
        <TodoItem
          id={id}
          title={title}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          handleEditTodo={this.props.handleEditTodo}
          handleDeleteTodo={this.props.handleDeleteTodo}
          handleCheckComplete={this.props.handleCheckComplete}
        />
      </li>
    );
  }

  render() {
    return (
      <div
        className='todo-list card'
        style={{
          display: this.props.activeTab === this.props.tabs.VIEW ? 'block' : 'none',
        }}>
        <div
          onClick={() => this.props.handleHideList('complete')}
          className='card-header has-background-dark'>
          <h1 className='card-header-title subtitle is-centered has-text-light'>Complete</h1>
        </div>
        <div id='completeList' className='complete-list card-content'>
          <ol>{this.props.todos.map(n => this.renderCompleteTodo(n))}</ol>
        </div>
      </div>
    );
  }
}
