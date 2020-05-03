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
import ReactGA from 'react-ga';
import CookieConsent from "react-cookie-consent";
import linkedin from './linkedin.png';
import github from './github-64px.png';

ReactGA.initialize('UA-165366022-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const api = "https://api.covidnearme.xyz/prod"

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
  search: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(9),
  },
  lineChart: {
    padding: theme.spacing(2),
  },
  chartType: {
    paddingTop: theme.spacing(4),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
  },
  icon: {
    width: 'auto',
    height: '32px',
  },
  footer: {
    display: 'flex',
    maxHeight: '100vh',
    position: 'fixed;',
    bottom: '0',
    paddingBottom: '20px'
  }
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      districts: [""],
      districtResults: {},
      districtTotalResults: {},
      charts: ["Daily", "Total"],
      chart: "Daily",
      selectedDistrict: ""
    };
  }
  componentDidMount() {
    axios
      .get(
        `${api}/districts`
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
          `${api}/covid?district=` +
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
            selectedDistrict: newValue
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
          <Grid item lg={3} xs={8} className={classes.search}>
            <Autocomplete
              id="district"
              freeSolo
              options={this.state.districts}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="District search"
                  variant="outlined"
                />
              )}
              onChange={(event, newValue) => {
                ReactGA.event({
                  category: 'User',
                  action: 'Search district ' + newValue,
                });
                this.updateChart(newValue);
              }}
            />
          </Grid>

          <Grid item lg={3} xs={4} className={classes.chartType}>
            <Select
              variant="outlined"
              id="daily-or-total-select"
              value={this.state.chart}
              onChange={(event) => {
                ReactGA.event({
                  category: 'User',
                  action:
                    'Switch chart to ' +
                    event.target.value +
                    ' for ' +
                    this.state.selectedDistrict,
                });
                this.setState({ chart: event.target.value });
              }}
            >
              {this.state.charts.map((value, index) => {
                return <MenuItem value={value}>{value}</MenuItem>;
              })}
            </Select>
          </Grid>
          <Grid item xs={12} className={classes.lineChart}>
            <div>
              {this.state.chart === 'Daily' ? (
                <LineChart
                  ytitle="Daily cases"
                  height="70vh"
                  data={this.state.districtResults}
                />
              ) : null}
              {this.state.chart === 'Total' ? (
                <LineChart
                  ytitle="Total cases"
                  height="70vh"
                  data={this.state.districtTotalResults}
                />
              ) : null}
            </div>
          </Grid>
        </Grid>
        <Grid
          className={classes.footer}
          container
          direction="row"
          justify="center"
          alignItems="flex-end"
        >
          <a href='https://www.linkedin.com/in/ben-jefferies-0bb1b24b/'>
            <img src={linkedin} className={classes.icon} />
            </a>
          <a href='https://github.com/benjefferies/covidnearme.xzy'>
          <img src={github} className={classes.icon} />
          </a>
        </Grid>
        <CookieConsent>
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      </div>
    );
  }
}

export default withStyles(styles)(App);
