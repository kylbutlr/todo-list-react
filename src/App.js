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
        complete: false 
      } 
    });
  }

  onFormChange(field, e) {
    this.setState({
      input: { ...this.state.input, [field]: e.target.value },
    });
  }

  onFormSubmit(e) {
    e.preventDefault();
    if (this.state.input.id !== '') {
      console.log('EDIT NOTE');
    } else {
      console.log('CREATE NOTE');
    }
    console.log(this.state.input);
    this.resetInput();
    this.tabClick(tabs.VIEW);

    /*const input = this.state.noteInput;
    input.user_id = this.state.loggedIn.user_id;
    this.checkTagsInput(input.tags, tags => {
      this.convertTagsToId(tags, newTags => {
        input.tags = newTags;
        if (input.tags !== false) {
          if (input.title === ' ' || input.text === ' ') {
            alert('New note must not contain a blank title or text.');
            this.resetNoteInput();
          } else {
            this.getConfig(this.state.loggedIn, config => {
              axios
                .post(`${API_ENDPOINT}/notes`, input, config)
                .catch(err => {
                  if (err.response.status === 401) {
                    alert('Error: Session has expired, please log in again.');
                    this.logoutUser('user');
                  } else {
                    alert('Error: ' + err.message);
                  }
                })
                .then(res => {
                  if (res) {
                    this.cleanString(res.data.tags, cleanTags => {
                      this.convertIdToTags(cleanTags, convertedTags => {
                        this.parseTags(convertedTags, parsedTags => {
                          const newNote = {
                            title: res.data.title,
                            text: res.data.text,
                            tags: parsedTags,
                            id: res.data.id,
                          };
                          this.setState(
                            {
                              noteInput: newNote,
                              notes: this.state.notes.concat(newNote),
                            },
                            () => {
                              this.resetNoteInput();
                              this.tabClick(tabs.VIEW_NOTES);
                            }
                          );
                        });
                      });
                    });
                  }
                });
            });
          }
        }
      });
    });*/
  }

  handleEditTodo(id) {
    console.log(`EDIT: ${id}`);
    this.tabClick(tabs.EDIT);
  }

  handleDeleteTodo(id) {
    console.log(`DELETE: ${id}`);
  }

  renderTodo(todo) {
    const { id, title, date, time, complete } = todo;
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
            <ol>{this.state.todos.map(n => this.renderTodo(n))}</ol>
          </div>

        </div>
      </div>
    );
  }
}

export default App;
