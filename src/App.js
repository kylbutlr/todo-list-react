import React, { Component } from 'react';
import axios from 'axios';
import './App.css';

const API_ENDPOINT = 'http://localhost:3000';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const tabs = {
  VIEW_TODOS: 1,
  CREATE_TODO: 2,
  EDIT_TODO: 3,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeTab: tabs.VIEW_TODOS,
      todos: [],
    };
  }

  componentDidMount() {
    this.getSavedTodos();
  }

  tabClick(activeTab) {
    if (activeTab === tabs.VIEW_TODOS) {
      // CANCEL CREATE TODO (CLEAR INPUT)
      // CANCEL EDIT TODO (CLEAR INPUT)
    }
    this.setState({ activeTab });
  }

  getSavedTodos() {
    axios
      .get(`${API_ENDPOINT}/todos`)
      .catch(err => {
        console.log(err);
      })
      .then(todos => {
        if (todos) {
          this.setState({
            todos: todos.data,
          });
        }
      });
  }

  formatDate(date) {
    if (date) {
      const dateObject = new Date(date);
      const newDate = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60000);
      const formattedDate =
        days[newDate.getDay()] + ', ' + months[newDate.getMonth()] + ' ' + newDate.getDate();
      return formattedDate;
    }
  }

  handleEditTodo(id) {
    console.log(`EDIT: ${id}`);
    this.tabClick(tabs.EDIT_TODO);
  }

  handleDeleteTodo(id) {
    console.log(`DELETE: ${id}`);
  }

  renderTodo(todo) {
    const { id, title, date, time, complete } = todo;
    console.log(todo);
    const newDate = this.formatDate(date);
    return (
      <li key={id}>
        <div className='todo-item'>
          <p className='p1'>{title}</p>
          <p
            className='p2'
            style={{
              display: newDate ? 'block' : 'none',
            }}>
            by: {newDate}
          </p>
          <p
            className='p3'
            style={{
              display: time ? 'block' : 'none',
            }}>
            at: {time}
          </p>
          <p
            className='p4'
            style={{
              display: complete ? 'block' : 'none',
            }}>
            COMPLETE
          </p>
          <p
            className='p4'
            style={{
              display: !complete ? 'block' : 'none',
            }}>
            INCOMPLETE
          </p>
        </div>
        <div className='todo-buttons'>
          <button className='edit-button' data-id={id} onClick={() => this.handleEditTodo(id)}>
            Edit
          </button>
          <button className='delete-button' data-id={id} onClick={() => this.handleDeleteTodo(id)}>
            Delete
          </button>
        </div>
      </li>
    );
  }

  render() {
    return (
      <div className='App'>
        <div className='Header'>
          <h1>Todo List</h1>
        </div>
        <div className='Body'>
          <div className='app-buttons'>
          <button
              id='tabsCREATE_TODO'
              style={{
                display: this.state.activeTab === tabs.VIEW_TODOS ? 'block' : 'none',
              }}
              onClick={() => this.tabClick(tabs.CREATE_TODO)}>
              Create Todo
            </button>
            <button
              id='tabsVIEW_TODOS'
              style={{
                display: this.state.activeTab !== tabs.VIEW_TODOS ? 'block' : 'none',
              }}
              onClick={() => this.tabClick(tabs.VIEW_TODOS)}>
              Go Back
            </button>
          </div>
          <div
            className='todo-list'
            style={{
              display: this.state.activeTab === tabs.VIEW_TODOS ? 'block' : 'none',
            }}>
            <ol>{this.state.todos.map(n => this.renderTodo(n))}</ol>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
