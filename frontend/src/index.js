import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import linkedin from './linkedin.png';
import github from './github-64px.png';

ReactDOM.render(
  <React.StrictMode>
    <div class="content">
    <App />
    </div>
    <div class="footer">
      <a href='https://www.linkedin.com/in/ben-jefferies-0bb1b24b/'>
        <img src={linkedin} class="icon" alt="linkedin" />
        </a>
      <a href='https://github.com/benjefferies/covidnearme.xzy'>
      <img src={github} class="icon" alt="github" />
      </a>
    </div>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
