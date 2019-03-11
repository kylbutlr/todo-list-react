import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import CreateForm from './CreateForm';
import EditForm from './EditForm';

const API_ENDPOINT = 'http://localhost:3000';
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const tabs = {
  VIEW: 1,
  CREATE: 2,
  EDIT: 3,
};

class App extends Component {
  constructor(props) {
    super(props);
    this.onFormChange = this.onFormChange.bind(this);
    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.state = {
      activeTab: tabs.VIEW,
      todos: [],
      input: {
        id: '',
        title: '',
        date: '',
        time: '',
        complete: false,
      },
    };
  }

  componentDidMount() {
    this.getSavedTodos();
  }

  tabClick(activeTab) {
    if (activeTab === tabs.VIEW) {
      this.resetInput();
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

  resetInput() {
    this.setState({
      input: {
        id: '',
        title: '',
        date: '',
        time: '',
        complete: false,
      },
    });
  }

  onFormChange(field, e) {
    this.setState({
      input: { ...this.state.input, [field]: e.target.value },
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    const { id, title, complete } = this.state.input;
    let { date, time } = this.state.input;
    if (date === '') {
      date = null;
    }
    if (time === '') {
      time = null;
    }
    const newInput = { id, title, date, time, complete };
    if (this.state.input.id === '') {
      axios
        .post(`${API_ENDPOINT}/todos`, newInput)
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          if (res) {
            this.setState({
              todos: this.state.todos.concat({
                id: res.data.id,
                title: res.data.title,
                date: res.data.date,
                time: res.data.time,
                complete: res.data.complete,
              }),
            });
          }
        });
    } else {
      axios
        .put(`${API_ENDPOINT}/todos/${id}`, newInput)
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          if (res) {
            const items = this.state.todos.filter(x => x.id !== Number(id));
            this.setState({
              todos: items.concat({
                id: Number(id),
                title: title,
                date: date,
                time: time,
                complete: complete,
              }),
            });
          }
        });
    }
    this.resetInput();
    this.tabClick(tabs.VIEW);
  }

  handleComplete(id) {
    let todo = this.state.todos.filter(x => x.id === Number(id));
    if (todo[0].complete === false) {
      todo[0].complete = true;
    } else {
      todo[0].complete = false;
    }
    axios.put(`${API_ENDPOINT}/todos/${id}`, todo[0])
    .catch(err => {
      console.log(err)
    })
    .then(() => {
      const todos = this.state.todos.filter(x => x.id !== Number(id));
      this.setState({
        todos: todos.concat({
          id: Number(id),
          title: todo[0].title,
          date: todo[0].date,
          time: todo[0].time,
          complete: todo[0].complete,
        })
      })
    })
  }

  handleEditTodo(id) {
    const todo = this.state.todos.filter(x => x.id === Number(id));
    this.setState(
      {
        input: todo[0],
      },
      () => {
        this.tabClick(tabs.EDIT);
      }
    );
  }

  handleDeleteTodo(id) {
    axios
      .delete(`${API_ENDPOINT}/todos/${id}`)
      .catch(err => {
        console.log(err);
      })
      .then(() => {
        const todos = this.state.todos.filter(x => x.id !== Number(id));
        console.log(todos);
        this.setState({
          todos: todos,
        });
      });
  }

  handleDeleteAll() {
    if (
      window.confirm(
        'Are you sure you want to delete all (' + this.state.todos.length + ') saved todos?'
      )
    ) {
      axios
        .delete(`${API_ENDPOINT}/todos`)
        .catch(err => {
          console.log(err);
        })
        .then(() => {
          this.setState({
            todos: [],
          });
        });
    }
  }

  renderIncompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const newDate = this.formatDate(date);
    return (
      <li
        key={id}
        onClick={() => {
          this.handleComplete(id);
        }}
        style={{display: !complete ? 'block' : 'none'}}>
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

  renderCompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const newDate = this.formatDate(date);
    return (
      <li
        key={id}
        onClick={() => {
          this.handleComplete(id);
        }}
        style={{display: complete ? 'block' : 'none'}}
        className='strike-through'>
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
                display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
              }}
              onClick={() => this.tabClick(tabs.CREATE)}>
              Create Todo
            </button>
            <button
              id='tabsVIEW_TODOS'
              style={{
                display: this.state.activeTab !== tabs.VIEW ? 'block' : 'none',
              }}
              onClick={() => this.tabClick(tabs.VIEW)}>
              Go Back
            </button>
          </div>

          <div
            className='Create-Form'
            style={{
              display: this.state.activeTab === tabs.CREATE ? 'block' : 'none',
            }}>
            <CreateForm
              onSubmit={this.onFormSubmit}
              onChange={this.onFormChange}
              {...this.state.input}
            />
          </div>

          <div
            className='Edit-Form'
            style={{
              display: this.state.activeTab === tabs.EDIT ? 'block' : 'none',
            }}>
            <EditForm
              onSubmit={this.onFormSubmit}
              onChange={this.onFormChange}
              {...this.state.input}
            />
          </div>

          <div
            className='todo-list'
            style={{
              display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
            }}>
            <div className='incomplete-list'>
              <ol>{this.state.todos.map(n => this.renderIncompleteTodo(n))}</ol>
            </div>
            <div className='complete-list'>
              <ol>{this.state.todos.map(n => this.renderCompleteTodo(n))}</ol>
            </div>
            <div
              className='delete-all'
              style={{
                display: this.state.todos.length > 0 ? 'block' : 'none',
              }}>
              <button onClick={() => this.handleDeleteAll()}>
                Delete All
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
