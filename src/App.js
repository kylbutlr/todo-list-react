import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import TodoItem from './TodoItem';

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
    this.handleDeleteTodo = this.handleDeleteTodo.bind(this);
    this.handleEditTodo = this.handleEditTodo.bind(this);
    this.handleCheckComplete = this.handleCheckComplete.bind(this);
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
    this.setState(
      {
        todos: [],
      },
      () => {
        this.getSavedTodos();
      }
    );
  }

  tabClick(activeTab) {
    if (activeTab === tabs.VIEW) {
      this.resetInput();
    } else if (activeTab === tabs.CREATE) {
      this.resetInput('date');
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

  formatDateToRead(date) {
    if (date) {
      const newDate = new Date(date);
      const formattedDate =
        days[newDate.getDay()] + ', ' + months[newDate.getMonth()] + ' ' + newDate.getDate();
      return formattedDate;
    }
  }

  formatDateToInput(aDate) {
    //const newDate = this.timezoneOffsetSubtract(aDate);
    const newDate = new Date(aDate);
    const year = newDate.getFullYear();
    let month = newDate.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    let date = newDate.getDate();
    if (date < 10) {
      date = '0' + date;
    }
    return year + '-' + month + '-' + date;
  }

  formatAmPm(displayTime) {
    if (displayTime) {
      let AmPm;
      if (displayTime.charAt(0) === 0) {
        displayTime = displayTime.slice(1, 5);
        if (displayTime.charAt(0) === 0) {
          displayTime = '12:' + displayTime.charAt(2) + displayTime.charAt(3);
        }
        AmPm = 'am';
      } else {
        displayTime = displayTime.slice(0, 5);
        const firstTwo = displayTime.charAt(0) + displayTime.charAt(1);
        if (firstTwo < '12') {
          AmPm = 'am';
        }
        if (firstTwo === '12') {
          AmPm = 'pm';
        }
        if (firstTwo > '12') {
          AmPm = 'pm';
          displayTime = Number(firstTwo) - 12 + ':' + displayTime.charAt(3) + displayTime.charAt(4);
        }
      }
      displayTime = displayTime + AmPm;
      return displayTime;
    }
  }

  timezoneOffsetSubtract(date) {
    const dateObject = new Date(date);
    const timeObject = new Date(dateObject.getTime() - dateObject.getTimezoneOffset() * 60000);
    return timeObject;
  }

  // NOT NEEDED???
  timezoneOffsetAdd(date) {
    const dateObject = new Date(date);
    const timeObject = new Date(dateObject.getTime() + dateObject.getTimezoneOffset() * 60000);
    return timeObject;
  }

  resetInput(date) {
    if (date) {
      this.setState({
        input: {
          id: '',
          title: '',
          //date: this.formatDateToInput(this.timezoneOffsetSubtract(new Date())),
          date: this.formatDateToInput(new Date()),
          time: '',
          complete: false,
        },
      });
    } else {
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

  handleCheckComplete(id) {
    let todo = this.state.todos.filter(x => x.id === Number(id));
    if (todo[0].complete === false) {
      todo[0].complete = true;
    } else {
      todo[0].complete = false;
    }
    axios
      .put(`${API_ENDPOINT}/todos/${id}`, todo[0])
      .catch(err => {
        console.log(err);
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
          }),
        });
      });
  }

  handleEditTodo(id) {
    const todo = this.state.todos.filter(x => x.id === Number(id));
    const temp = todo[0].date;
    if (todo[0].date) {
      todo[0].date = this.formatDateToInput(todo[0].date);
    } else {
      todo[0].date = '';
    }
    if (!todo[0].time) {
      todo[0].time = '';
    }
    this.setState(
      {
        input: {
          id: todo[0].id,
          title: todo[0].title,
          date: todo[0].date,
          time: todo[0].time,
        }
      },
      () => {
        todo[0].date = temp;
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

  renderTodayTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.formatDateToRead(date);
    const todayDate = this.formatDateToInput(new Date());
    // timezone offset?
    const newDate = this.formatDateToInput(new Date(date));
    const formattedTime = this.formatAmPm(time);
    return (
      <li
        key = {id}
        className ='due-today'
        style = {{ display: !complete && todayDate === newDate ? 'block' : 'none' }}>
        <TodoItem
          id = {id}
          title = {title}
          formattedDate = {formattedDate}
          formattedTime = {formattedTime}
          handleEditTodo = {this.handleEditTodo}
          handleDeleteTodo = {this.handleDeleteTodo}
          handleCheckComplete = {this.handleCheckComplete}
        />
      </li>
    );
  }

  renderIncompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.formatDateToRead(date);
    const todayDate = this.formatDateToInput(new Date());
    // timezone offset?
    const newDate = this.formatDateToInput(new Date(date));
    const formattedTime = this.formatAmPm(time);
    return (
      <li key = {id} style = {{ display: !complete && todayDate !== newDate ? 'block' : 'none' }}>
        <TodoItem
          id = {id}
          title = {title}
          formattedDate = {formattedDate}
          formattedTime = {formattedTime}
          handleEditTodo = {this.handleEditTodo}
          handleDeleteTodo = {this.handleDeleteTodo}
          handleCheckComplete = {this.handleCheckComplete}
        />
      </li>
    );
  }

  renderCompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.formatDateToRead(date);
    const formattedTime = this.formatAmPm(time);
    return (
      <li key = {id} style = {{ display: complete ? 'block' : 'none' }} className ='strike-through'>
        <TodoItem
          id = {id}
          title = {title}
          formattedDate = {formattedDate}
          formattedTime = {formattedTime}
          handleEditTodo = {this.handleEditTodo}
          handleDeleteTodo = {this.handleDeleteTodo}
          handleCheckComplete = {this.handleCheckComplete}
          
        />
      </li>
    );
  }

  render() {
    return (
      <div className ='App'>
        <div className ='Header'>
          <h1>Todo List</h1>
        </div>
        <div className ='Body'>
          <div className ='app-buttons'>
            <button
              id ='tabsCREATE'
              style = {{
                display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
              }}
              onClick = {() => this.tabClick(tabs.CREATE)}>
              Create Todo
            </button>
            <button
              id ='tabsVIEW'
              style = {{
                display: this.state.activeTab !== tabs.VIEW ? 'block' : 'none',
              }}
              onClick = {() => this.tabClick(tabs.VIEW)}>
              Go Back
            </button>
          </div>

          <div
            className ='Create-Form'
            style = {{
              display: this.state.activeTab === tabs.CREATE ? 'block' : 'none',
            }}>
            <CreateForm
              onSubmit = {this.onFormSubmit}
              onChange = {this.onFormChange}
              {...this.state.input}
            />
          </div>

          <div
            className ='Edit-Form'
            style = {{
              display: this.state.activeTab === tabs.EDIT ? 'block' : 'none',
            }}>
            <EditForm
              onSubmit = {this.onFormSubmit}
              onChange = {this.onFormChange}
              {...this.state.input}
            />
          </div>

          <div
            className ='todo-list'
            style = {{
              display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
            }}>
            <div className ='today-list'>
              <ol>{this.state.todos.map(n => this.renderTodayTodo(n))}</ol>
            </div>
            <div className ='incomplete-list'>
              <ol>{this.state.todos.map(n => this.renderIncompleteTodo(n))}</ol>
            </div>
            <div className ='complete-list'>
              <ol>{this.state.todos.map(n => this.renderCompleteTodo(n))}</ol>
            </div>
            <div
              className ='delete-all'
              style = {{
                display: this.state.todos.length > 0 ? 'block' : 'none',
              }}>
              <button onClick = {() => this.handleDeleteAll()}>Delete All</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
