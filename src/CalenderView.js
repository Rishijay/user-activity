import React, { Component } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Button, Spinner, Col, Row } from 'reactstrap';
import axios from 'axios';

const localizer = momentLocalizer(moment);

class CalenderView extends Component {
  constructor() {
    super();
    this.state = {
      events : [],
      members : [],
      userId : null,
      title : '',
      activity : []
    };
  }

  componentDidMount() {
    this.getUserId()
  }

  getUserId=()=>{
    var urlParams;
    (window.onpopstate = function () {
        var match,
            pl     = /\+/g,  // Regex for replacing addition symbol with a space
            search = /([^:=]+)=?([^;]*)/g,
            decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
            query  = window.location.search.substring(1);
    
        urlParams = {};
        while (match = search.exec(query))
           urlParams[decode(match[1])] = decode(match[2]);
    })();
    if(Object.keys(urlParams).length === 0){
      this.props.history.replace('/')
    }else{
      this.setState({userId : urlParams['user']},()=>this.callMockAPI())
    }
  }

  callMockAPI=()=>{
    axios.get('https://run.mocky.io/v3/d3a41cbc-a56f-4ba9-9817-4e419803f395')
    .then((response) => {
      if(response.data.ok){
        this.members = response.data.members
        this.getCalendarData()
      }
    })
  }

  getCalendarData = () =>{
    const userData = this.members.filter( member => { 
      return member.id === this.state.userId
    })
    this.setState({ title: userData[0].real_name+"'s Activities"})
    let tempArr = [];
    userData[0].activity_periods.forEach(item => {
      let newObj = {}
      newObj.title = userData[0].real_name+"'s Activity"
      newObj.start = new Date(moment(item.start_time, 'MMM DD YYYY h:m:s A').format('YYYY-MM-DD HH:mm:ss'))
      newObj.end = new Date(moment(item.end_time, 'MMM DD YYYY h:m:s A').format('YYYY-MM-DD HH:mm:ss'))
      tempArr.push(newObj)
    });
    this.setState({activity: tempArr})
  }

  render() {
    return (
        <div style={{ height: '500pt'}}>
          {this.state.activity.length !== 0 ? <>
          <div style={{backgroundColor: '#333333'}}>
            <Row style={{padding:10, marginBottom:10}}>
            <Col>
              <h5 style={{float: 'center', marginTop:10, color: 'white'}}>
              <i class="fa fa-user-circle" aria-hidden="true" style={{marginRight: 10}}></i>
              {this.state.title}
              <a style={{fontSize:10, marginLeft:20}}>[Last Active : {""+this.state.activity[this.state.activity.length - 1].start}]</a>
              </h5>
            </Col>
            <Col classname="text-right" >
              <Button classname="text-right" color="primary" href="/users" style={{float:'right', textAlign:'center'}}> 
              {"<< " + " Go To Users List"} 
              </Button>
            </Col>
            </Row>
          </div> 
          <Calendar
            events={this.state.activity}
            startAccessor="start"
            endAccessor="end"
            defaultDate={this.state.activity[this.state.activity.length - 1].start} // To directly focus calender on last activity
            localizer={localizer}
            defaultView={'week'}
          /> 
          </> : <h5 classname="text-center" style={{margin: 20}}><Spinner type="grow" color="primary" style={{ marginRight: 10 }} />Loading..Please Wait...</h5>}
        </div>
    );
  }
}

export default CalenderView;
