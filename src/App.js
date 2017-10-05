import React, { Component } from "react";
import "./App.css";
import "./react-datepicker.min.css";
import { Navbar, Nav, NavItem } from "react-bootstrap";
import Books from "./views/Books";
import Members from "./views/Members";
import Issues from "./views/Issues";
import Returns from "./views/Returns";

import { BrowserRouter as Router, Route } from "react-router-dom";

class App extends Component {
  state = {
    selectedKey: "/books"
  };

  handleSelect = selectedKey => {
    this.props.history.push(selectedKey);
    this.setState({ selectedKey });
  };

  componentDidMount() {
    if (this.props.location.pathname === "/")
      this.props.history.replace("/books");
  }

  render() {
    return (
      <div>
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>Library</Navbar.Brand>
          </Navbar.Header>
          <Nav activeKey={this.state.selectedKey} onSelect={this.handleSelect}>
            <NavItem eventKey="/books">Books</NavItem>
            <NavItem eventKey="/members">Members</NavItem>
            <NavItem eventKey="/issues">Issues</NavItem>
            <NavItem eventKey="/returns">Returns</NavItem>
          </Nav>
        </Navbar>

        <Route exact path="/books" component={Books} />
        <Route path="/members" component={Members} />
        <Route path="/issues" component={Issues} />
        <Route path="/returns" component={Returns} />
      </div>
    );
  }
}

export default () => (
  <Router>
    <Route path="/" component={App} />
  </Router>
);
