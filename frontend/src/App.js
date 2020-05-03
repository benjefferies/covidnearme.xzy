import React from "react";
import "./App.css";
import { LineChart } from "react-chartkick";
import "chart.js";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { withStyles } from '@material-ui/core/styles'

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  search: {
    marginTop: "15px",
    padding: theme.spacing(4),
  },
  lineChart: {
    padding: theme.spacing(2),
  }
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      districts: [""],
      districtResults: {},
      districtTotalResults: {},
      charts: ["daily", "total"],
      chart: "daily",
    };
  }
  componentDidMount() {
    axios
      .get(
        "https://psy7t39iz9.execute-api.eu-west-2.amazonaws.com/dev/districts"
      )
      .then((response) => {
        this.setState({ districts: response.data });
      })
      .catch((error) => {
        // handle error
        console.log(error);
      });
  }

  updateChart(newValue) {
    if (this.state.districts.includes(newValue)) {
      axios
        .get(
          "https://psy7t39iz9.execute-api.eu-west-2.amazonaws.com/dev/covid?district=" +
            encodeURI(newValue)
        )
        .then((response) => {
          let dailyResults = {};
          let districtTotalResults = {};
          response.data.forEach((r) => (dailyResults[r.date] = r.daily));
          response.data.forEach(
            (r) => (districtTotalResults[r.date] = r.total)
          );
          this.setState({
            districtResults: dailyResults,
            districtTotalResults: districtTotalResults,
          });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={11} className={classes.search}>
            <Autocomplete
              id="district"
              freeSolo
              options={this.state.districts}
              renderInput={(params) => (
                <TextField {...params} label="Search for your district" variant="outlined" />
              )}
              onChange={(event, newValue) => {
                this.updateChart(newValue);
              }}
            />
          </Grid>
          <Grid item xs={1} className={classes.search}>
            <Select
              variant="outlined"
              id="daily-or-total-select"
              value={this.state.chart}
              label="Search for your district"
              onChange={(event) => this.setState({ chart: event.target.value })}
            >
              {this.state.charts.map((value, index) => {
                return <MenuItem value={value}>{value}</MenuItem>;
              })}
            </Select>
          </Grid>
          <Grid item xs={12} className={classes.lineChart}>
            <div>
          {this.state.chart === "daily" ? (
            <LineChart height="70vh" data={this.state.districtResults} />
          ) : null}
          {this.state.chart === "total" ? (
            <LineChart height="70vh" data={this.state.districtTotalResults} />
          ) : null}
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(App);
