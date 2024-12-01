import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SidebarMenu from "./datasheet"; 


function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/records" component={SidebarMenu} /> {/* For datasheet */}
          
          
          <Route path="*">
            <h1>404 - Page Not Found</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
