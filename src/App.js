import React, { Component } from 'react';
import './App.css';
import PageNavbar from './PageNavbar';
import { Button, Card, CardHeader, CardBody, Modal, ModalHeader, ModalBody, Table, ModalFooter } from "reactstrap";
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userTableRows : [],
      activityTableRows : [],
      showActivity : false,
      selectedUserId : null,
      selectedUserName : null,
    }
    this.userTableHeader = ["S no.", "Name", "Action"]
    this.activityTableHeader = ["S no.", "From", "Upto"]
    this.members = [];
  }

  componentDidMount() {
    this.callMockAPI()
  }

  callMockAPI=()=>{
    axios.get('https://run.mocky.io/v3/d3a41cbc-a56f-4ba9-9817-4e419803f395')
    .then((response) => {
      if(response.data.ok){
        this.members = response.data.members
        this.createUserTableContent(response.data.members)
      }
    })
  }

  createUserTableContent = (arr) => {
    let count = 0;
    let tempArray = [];
    arr.map((prop) => {
      count++;
      var newObj = {};
      var innerArray = [];
      innerArray.push(prop.id === null ? "Not Available" : prop.id)
      innerArray.push(count+'.')
      innerArray.push(prop.real_name === null ? "Not Available" : prop.real_name)
      innerArray.push("Show Activity")
      newObj.data = innerArray
      tempArray.push(newObj)
      return true;
    })
    this.setState({userTableRows : tempArray})
  }

  createActivityTableContent = (arr) => {
    let count = 0;
    let tempArray = [];
    arr.map((prop) => {
      count++;
      var newObj = {};
      var innerArray = [];
      innerArray.push(count+'.')
      innerArray.push(prop.start_time === null ? "Not Available" : prop.start_time)
      innerArray.push(prop.end_time === null ? "Not Available" : prop.end_time)
      newObj.data = innerArray
      tempArray.push(newObj)
      return true;
    })
    this.setState({activityTableRows : tempArray})
  }

  getUserActivityData = () => {
    const userData = this.members.filter( member => { 
      return member.id === this.state.selectedUserId
    })
    this.createActivityTableContent(userData[0].activity_periods);
  }

  render() {
    return (
      <div className="App">
        <PageNavbar/>
        <header >
          <div>
            <Modal isOpen={this.state.showActivity} toggle={() => this.setState({ showActivity: !this.state.showActivity })}>
              <ModalHeader style={{backgroundColor:'#333333', color:'white'}}>
              <i class="fa fa-user-circle" aria-hidden="true" style={{marginRight: 10}}></i>
              {this.state.selectedUserName}'s Activity</ModalHeader>
              <ModalBody>
                  <Table responsive >
                    <thead className="text-primary">
                      <tr>
                        {this.activityTableHeader.map((prop, key) => {
                          if (key === this.activityTableHeader.length - 1)
                            return (
                              <th key={key} className="text-right">
                                {prop}
                              </th>
                            );
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.activityTableRows.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.data.map((prop2, key) => {
                              if (key === this.activityTableHeader.length -1)
                                return (
                                  <td key={key} className="text-right">
                                    <a>{prop2}</a>
                                  </td>
                                );
                              return <td key={key}>{prop2}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" 
                href={"/calendar?user="+this.state.selectedUserId} 
                onClick={()=>this.setState({showActivity : false})}>
                  <i class="fa fa-calendar" aria-hidden="true" style={{marginRight: 10}}></i>
                  Show in calendar</Button>{' '}
                <Button color="primary" onClick={()=>this.setState({showActivity : false})}>
                <i class="fa fa-times" aria-hidden="true" style={{marginRight: 10}}></i>
                Close</Button>
              </ModalFooter>
            </Modal>
          </div>
          <Card style={{margin: 20}}>
            <CardHeader>
            <h5 className="title text-left">
            <i class="fa fa-user-circle" aria-hidden="true" style={{marginRight: 10}}></i>
            Users List</h5>
            </CardHeader>
            <CardBody>
            <Table responsive >
                    <thead className="text-primary">
                      <tr>
                        {this.userTableHeader.map((prop, key) => {
                          if (key === this.userTableHeader.length - 1)
                            return (
                              <th key={key} className="text-right">
                                {prop}
                              </th>
                            );
                          return <th key={key}>{prop}</th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.userTableRows.map((prop, key) => {
                        return (
                          <tr key={key}>
                            {prop.data.map((prop2, key) => {
                              if (key === 0)
                              return (
                                <td key={key} style={{display: 'none'}}>
                                  <a>{prop2}</a>
                                </td>
                              );
                              if (key === 2)
                              return (
                                <td key={key}>
                                  <a>
                                  <i class="fa fa-user" aria-hidden="true" style={{marginRight: 10}}></i>
                                  {prop2}</a>
                                </td>
                              );
                              if (key === this.userTableHeader.length)
                                return (
                                  <td key={key} className="text-right">
                                    <a 
                                    href="JavaScript:Void(0);" 
                                    onClick={()=>this.setState({showActivity : true, selectedUserId: prop.data[0], selectedUserName: prop.data[2]},()=> this.getUserActivityData())}>
                                      <i class="fa fa-info-circle" aria-hidden="true" style={{marginRight: 10}}></i>
                                      {prop2}</a>
                                  </td>
                                );
                              return <td key={key}>{prop2}</td>;
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
            </CardBody>
          </Card>
        </header>
      </div>
    );
  }
}

export default App;
