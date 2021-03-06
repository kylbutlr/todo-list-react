import React, { Component } from 'react';
import TodoItem from './TodoItem';

export default class TodosIncomplete extends Component {
  renderIncompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.props.formatDateToRead(date);
    const todayDate = this.props.formatDateToInput(new Date());
    const newDate = this.props.formatDateToInput(new Date(date));
    const formattedTime = this.props.formatAmPm(time);
    return (
      <li key={id} style={{ display: !complete && todayDate !== newDate ? 'block' : 'none' }}>
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
          onClick={() => this.props.handleHideList('incomplete')}
          className='card-header has-background-dark'>
          <h1 className='card-header-title subtitle is-centered has-text-light'>Incomplete</h1>
        </div>
        <div id='incompleteList' className='incomplete-list card-content'>
          <ol>{this.props.todos.map(n => this.renderIncompleteTodo(n))}</ol>
        </div>
      </div>
    );
  }
}
