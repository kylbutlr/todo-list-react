import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import './bulma.css';
import Navbar from './Components/Navbar';
import CreateForm from './Components/CreateForm';
import EditForm from './Components/EditForm';
import TodosToday from './Components/TodosToday';
import TodosIncomplete from './Components/TodosIncomplete';
import TodosComplete from './Components/TodosComplete';

const API_ENDPOINT = 'https://kylbutlr-todos-api.herokuapp.com';
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
    this.handleDeleteAll = this.handleDeleteAll.bind(this);
    this.handleEditTodo = this.handleEditTodo.bind(this);
    this.handleCheckComplete = this.handleCheckComplete.bind(this);
    this.tabClick = this.tabClick.bind(this);
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
    this.runResize();
    this.setState(
      {
        todos: [],
      },
      () => {
        this.getSavedTodos();
      }
    );
  }

  runResize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
    window.addEventListener('resize', () => {
      let vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    });
  }

  tabClick(activeTab) {
    if (activeTab === tabs.VIEW) {
      this.resetInput();
    } else if (activeTab === tabs.CREATE) {
      this.resetInput('date');
    }
    this.setState({ activeTab }, () => {
      if (activeTab === tabs.CREATE) {
        document.getElementById('create-input').focus();
      } else if (activeTab === tabs.EDIT) {
        document.getElementById('edit-input').focus();
      }
    });
  }

  getSavedTodos() {
    axios
      .get(`${API_ENDPOINT}/todos`)
      .catch(err => {
        console.log(err);
      })
      .then(todos => {
        if (todos) {
          for (let i = 0; i < todos.data.length; i++) {
            todos.data[i].date = this.timezoneOffsetAdd(todos.data[i].date);
          }
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
      const newDate = this.timezoneOffsetAdd(date);
      console.log(newDate);
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
                date: newDate,
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

  render() {
    return (
      <div className='App container'>
        <Navbar
          tabs={tabs}
          activeTab={this.state.activeTab}
          tabClick={this.tabClick}
          handleDeleteAll={this.handleDeleteAll}
        />
        <div className='Body container has-navbar-fixed-top'>
          <div className='columns is-mobile'>
            <div className='column side-column' />
            <div className='column middle-column'>
              <CreateForm
                onSubmit={this.onFormSubmit}
                onChange={this.onFormChange}
                {...this.state.input}
                tabs={tabs}
                activeTab={this.state.activeTab}
              />
              <EditForm
                onSubmit={this.onFormSubmit}
                onChange={this.onFormChange}
                {...this.state.input}
                tabs={tabs}
                activeTab={this.state.activeTab}
              />
              <TodosToday
                tabs={tabs}
                activeTab={this.state.activeTab}
                todos={this.state.todos}
                renderTodayTodo={this.renderTodayTodo}
                handleHideList={this.handleHideList}
                formatAmPm={this.formatAmPm}
                formatDateToRead={this.formatDateToRead}
                formatDateToInput={this.formatDateToInput}
                handleEditTodo={this.handleEditTodo}
                handleDeleteTodo={this.handleDeleteTodo}
                handleCheckComplete={this.handleCheckComplete}
              />
              <TodosIncomplete
                tabs={tabs}
                activeTab={this.state.activeTab}
                todos={this.state.todos}
                renderIncompleteTodo={this.renderIncompleteTodo}
                handleHideList={this.handleHideList}
                formatAmPm={this.formatAmPm}
                formatDateToRead={this.formatDateToRead}
                formatDateToInput={this.formatDateToInput}
                handleEditTodo={this.handleEditTodo}
                handleDeleteTodo={this.handleDeleteTodo}
                handleCheckComplete={this.handleCheckComplete}
              />
              <TodosComplete
                tabs={tabs}
                activeTab={this.state.activeTab}
                todos={this.state.todos}
                handleHideList={this.handleHideList}
                formatAmPm={this.formatAmPm}
                formatDateToRead={this.formatDateToRead}
                handleEditTodo={this.handleEditTodo}
                handleDeleteTodo={this.handleDeleteTodo}
                handleCheckComplete={this.handleCheckComplete}
              />
            </div>
            <div className='column side-column' />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
