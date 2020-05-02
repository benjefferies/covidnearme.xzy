import React from 'react';
import './App.css';
import { LineChart } from 'react-chartkick';
import 'chart.js';
import axios from 'axios';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

class App extends React.Component {

  constructor() {
    super()
    this.state = {
      districts: [""],
      districtResults: {}
    }
  }
  componentDidMount() {
    axios.get('https://psy7t39iz9.execute-api.eu-west-2.amazonaws.com/dev/districts')
      .then((response) => {
        this.setState({districts: response.data})
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
  }

  updateChart(newValue) {
    if (this.state.districts.includes(newValue)) {
      axios.get('https://psy7t39iz9.execute-api.eu-west-2.amazonaws.com/dev/covid?district=' + encodeURI(newValue))
      .then((response) => {
        let dailyResults = {}
        response.data.forEach(r => dailyResults[r.date] = r.daily)
        this.setState({districtResults: dailyResults})
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
    }
  }

  render() {
    return (
      <div className="App">
        <Autocomplete
          id="district"
          freeSolo
          options={this.state.districts}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} label="District" variant="outlined" />}
          onChange={(event, newValue) => {
            this.updateChart(newValue);
          }}
        />
        <LineChart data={this.state.districtResults} />
      </div>
    );
  }
}

export default App;
