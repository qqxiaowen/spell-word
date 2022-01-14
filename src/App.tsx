/*
 * @Author: xiaoWen
 * @Date: 2021-12-31 15:05:26
 * @LastEditors: xiaoWen
 * @LastEditTime: 2022-01-14 10:43:19
 */
import { Switch, Route, Redirect, BrowserRouter as Router } from 'react-router-dom';

import home from './page/home/home';
import main from './page/main/main';

function App() {
  return (
    <Router>
      <Switch>
        <Redirect exact path="/" to="/main" />
        <Route exact path="/home" component={home} />
        <Route exact path="/main" component={main} />
      </Switch>
    </Router>
  );
}

export default App;
