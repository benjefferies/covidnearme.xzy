import React from "react";
import { LineChart } from "react-chartkick";
import "chart.js";
import axios from "axios";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import ReactGA from "react-ga";
import CookieConsent from "react-cookie-consent";
import smooth from 'array-smooth';

ReactGA.initialize("UA-165366022-1");
ReactGA.pageview(window.location.pathname + window.location.search);

const api = "https://pn6ecfl253.execute-api.eu-west-2.amazonaws.com/prod";

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
    width: "auto",
    height: "32px",
  },
  footer: {
    display: "flex",
    maxHeight: "100vh",
    // position: 'fixed;',
    bottom: "0",
    paddingBottom: "20px",
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      districts: [""],
      districtCases: {},
      districtDeaths: {},
      districtTotals: {},
      charts: ["Cases", "Deaths", "Total"],
      chart: "Cases",
      selectedDistrict: "",
    };
  }
  componentDidMount() {
    axios
      .get(`${api}/districts`)
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
        .get(`${api}/covid/all?district=` + encodeURI(newValue))
        .then((response) => {
          let casesDaily = {};
          let casesTotal = {};
          let deathsDaily = {};
          let deathsTotal = {};
          Object.keys(response.data).forEach((r) => {
            if (response.data[r]["casesDaily"] !== undefined)
              casesDaily[r] = response.data[r]["casesDaily"];
            if (response.data[r]["deathsDaily"] !== undefined)
              deathsDaily[r] = response.data[r]["deathsDaily"];
            if (response.data[r]["casesTotal"] !== undefined)
              casesTotal[r] = response.data[r]["casesTotal"];
            if (response.data[r]["deathsTotal"] !== undefined)
            deathsTotal[r] = deathsTotal[r] = response.data[r]["deathsTotal"];
          });
          this.setState({
            districtCases: this.calculateAverage("Cases", casesDaily),
            districtDeaths: this.calculateAverage("Cases", deathsDaily),
            districtTotals: [
              { name: "Cases", data: casesTotal },
              { name: "Deaths", data: deathsTotal },
            ],
            selectedDistrict: newValue,
          });
        })
        .catch((error) => {
          // handle error
          console.log(error);
        });
    }
  }

  calculateAverage(label, casesDaily) {
    let allcasesDaily = [];

    let keys = [];
    let values = [];

    for (let [key, value] of Object.entries(casesDaily)) {
      if(value !== 0) {
        keys.push(key);
        values.push(value);
      }
    }

    let smaValues = smooth(values, 7);

    let smaRoundValues = smaValues.map(num => {
      return Math.round(num * 10) / 10;
    });

    let smaResults = {};

    for (let index = 0; index < smaRoundValues.length; index++) {
      smaResults[keys[index]] = parseFloat(smaRoundValues[index]);
    }

    allcasesDaily.push(this.createLine(label, casesDaily));
    allcasesDaily.push(this.createLine("7 Day SMA", smaResults));

    return allcasesDaily;
  }

  createLine(name, lineData) {
    return {
      name: name,
      data: lineData,
    };
  }

  formatDate(date) { 
    if (date < 10) {
      date = "0" + date;
    }
    return date;
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
                  category: "User",
                  action: "Search district " + newValue,
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
                  category: "User",
                  action:
                    "Switch chart to " +
                    event.target.value +
                    " for " +
                    this.state.selectedDistrict,
                });
                this.setState({ chart: event.target.value });
              }}
            >
              {this.state.charts.map((value, index) => {
                return <MenuItem key={index} value={value}>{value}</MenuItem>;
              })}
            </Select>
          </Grid>
          <Grid item xs={12} className={classes.lineChart}>
            <div>
              {this.state.chart === "Cases" ? (
                <LineChart
                  ytitle="Daily cases"
                  height="70vh"
                  data={this.state.districtCases}
                  library={{spanGaps: true}}
                />
              ) : null}
              {this.state.chart === "Deaths" ? (
                <LineChart
                  ytitle="Daily deaths"
                  height="70vh"
                  data={this.state.districtDeaths}
                  library={{spanGaps: true}}
                />
              ) : null}
              {this.state.chart === "Total" ? (
                <LineChart
                  ytitle="Total cases"
                  height="70vh"
                  data={this.state.districtTotals}
                  library={{spanGaps: true}}
                />
              ) : null}
            </div>
          </Grid>
        </Grid>
        <CookieConsent>
          This website uses cookies to enhance the user experience.
        </CookieConsent>
      </div>
    );
  }
}

export default withStyles(styles)(App);
