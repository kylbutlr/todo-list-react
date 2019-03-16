import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import './bulma.css';
//import '../node_modules/bulma/css/bulma.min.css';
import CreateForm from './CreateForm';
import EditForm from './EditForm';
import TodoItem from './TodoItem';
import { faPlusCircle, faTrashAlt, faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const API_ENDPOINT = 'http://localhost:5432';
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
    document.documentElement.classList.add('background');
    document.body.classList.add('has-navbar-fixed-top');
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
          time: '12:00',
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
    const { id, title } = this.state.input;
    const complete = false;
    let { date, time } = this.state.input;
    if (date === '') {
      date = null;
    }
    if (time === '') {
      time = null;
    }
    const newInput = { id, title, date, time, complete };
    if (id === '') {
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
      const newDate = this.timezoneOffsetAdd(date);
      const items = this.state.todos.filter(x => x.id !== Number(id));
      axios
        .put(`${API_ENDPOINT}/todos/${id}`, newInput)
        .catch(err => {
          console.log(err);
        })
        .then(res => {
          if (res) {
            this.setState({
              todos: items.concat({
                id: Number(id),
                title: title,
                date: newDate,
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
        },
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

  handleHideList(list) {
    if (list === 'today') {
      if (document.getElementById('todayList').classList.contains('display-none')) {
        document.getElementById('todayList').classList.remove('display-none');
      } else {
        document.getElementById('todayList').classList.add('display-none');
      }
    }
    if (list === 'incomplete') {
      if (document.getElementById('incompleteList').classList.contains('display-none')) {
        document.getElementById('incompleteList').classList.remove('display-none');
      } else {
        document.getElementById('incompleteList').classList.add('display-none');
      }
    }
    if (list === 'complete') {
      if (document.getElementById('completeList').classList.contains('display-none')) {
        document.getElementById('completeList').classList.remove('display-none');
      } else {
        document.getElementById('completeList').classList.add('display-none');
      }
    }
  }

  renderTodayTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.formatDateToRead(date);
    const todayDate = this.formatDateToInput(new Date());
    console.log(todayDate);
    // timezone offset?
    const newDate = this.formatDateToInput(new Date(date));
    const formattedTime = this.formatAmPm(time);
    return (
      <li
        key={id}
        className='due-today'
        style={{ display: !complete && todayDate === newDate ? 'block' : 'none' }}>
        <TodoItem
          id={id}
          title={title}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          handleEditTodo={this.handleEditTodo}
          handleDeleteTodo={this.handleDeleteTodo}
          handleCheckComplete={this.handleCheckComplete}
        />
      </li>
    );
  }

  renderIncompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.formatDateToRead(date);
    const todayDate = this.formatDateToInput(new Date());
    console.log(todayDate);
    // timezone offset?
    const newDate = this.formatDateToInput(new Date(date));
    const formattedTime = this.formatAmPm(time);
    return (
      <li key={id} style={{ display: !complete && todayDate !== newDate ? 'block' : 'none' }}>
        <TodoItem
          id={id}
          title={title}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          handleEditTodo={this.handleEditTodo}
          handleDeleteTodo={this.handleDeleteTodo}
          handleCheckComplete={this.handleCheckComplete}
        />
      </li>
    );
  }

  renderCompleteTodo(todo) {
    const { id, title, date, time, complete } = todo;
    const formattedDate = this.formatDateToRead(date);
    const formattedTime = this.formatAmPm(time);
    return (
      <li key={id} style={{ display: complete ? 'block' : 'none' }} className='complete'>
        <TodoItem
          id={id}
          title={title}
          formattedDate={formattedDate}
          formattedTime={formattedTime}
          handleEditTodo={this.handleEditTodo}
          handleDeleteTodo={this.handleDeleteTodo}
          handleCheckComplete={this.handleCheckComplete}
        />
      </li>
    );
  }

  render() {
    return (
      <div className='App container'>
        <nav className='navbar is-fixed-top is-primary'>
          <div className='navbar-brand'>
            <div className='navbar-item' onClick={() => this.tabClick(tabs.VIEW)}>
              <h1 className='title has-text-light'>Todo List</h1>
            </div>
            <div className='navbar-item navbar-buttons'>
              <div className='is-vertical-center'>
                <button
                  className='button is-primary'
                  onClick={() => this.tabClick(tabs.VIEW)}
                  style={{
                    display: this.state.activeTab !== tabs.VIEW ? 'flex' : 'none',
                  }}>
                  <FontAwesomeIcon icon={faTimesCircle} size='lg' style={{ color: '#F5F5F5' }} />
                  <h1 className='subtitle has-text-light'>
                    Back<span> to Notes</span>
                  </h1>
                </button>
              </div>
              <div className='is-vertical-center'>
                <button
                  className='button is-primary'
                  onClick={() => this.tabClick(tabs.CREATE)}
                  style={{
                    display: this.state.activeTab === tabs.VIEW ? 'flex' : 'none',
                  }}>
                  <FontAwesomeIcon icon={faPlusCircle} size='lg' style={{ color: '#F5F5F5' }} />
                  <h1 className='subtitle has-text-light'>
                    Create<span> Note</span>
                  </h1>
                </button>
              </div>
              <div className='is-vertical-center'>
                <button className='button is-primary' onClick={() => this.handleDeleteAll()}>
                  <FontAwesomeIcon icon={faTrashAlt} size='lg' style={{ color: '#F5F5F5' }} />
                  <h1 className='subtitle has-text-light'>
                    Delete<span> All Notes</span>
                  </h1>
                </button>
              </div>
            </div>
          </div>
        </nav>
        <div className='container'>
          <div className='columns is-mobile'>
            <div className='column side-column' />
            <div className='column middle-column'>
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
                className='todo-list card'
                style={{
                  display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
                }}>
                <div
                  onClick={() => this.handleHideList('today')}
                  className='card-header has-background-dark'>
                  <h1 className='card-header-title subtitle is-centered has-text-light'>Today</h1>
                </div>
                <div id='todayList' className='today-list card-content'>
                  <ol>{this.state.todos.map(n => this.renderTodayTodo(n))}</ol>
                </div>
              </div>
              <div
                className='todo-list card'
                style={{
                  display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
                }}>
                <div
                  onClick={() => this.handleHideList('incomplete')}
                  className='card-header has-background-dark'>
                  <h1 className='card-header-title subtitle is-centered has-text-light'>
                    Incomplete
                  </h1>
                </div>
                <div id='incompleteList' className='incomplete-list card-content'>
                  <ol>{this.state.todos.map(n => this.renderIncompleteTodo(n))}</ol>
                </div>
              </div>
              <div
                className='todo-list card'
                style={{
                  display: this.state.activeTab === tabs.VIEW ? 'block' : 'none',
                }}>
                <div
                  onClick={() => this.handleHideList('complete')}
                  className='card-header has-background-dark'>
                  <h1 className='card-header-title subtitle is-centered has-text-light'>
                    Complete
                  </h1>
                </div>
                <div id='completeList' className='complete-list card-content'>
                  <ol>{this.state.todos.map(n => this.renderCompleteTodo(n))}</ol>
                </div>
              </div>
            </div>
            <div className='column side-column' />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
