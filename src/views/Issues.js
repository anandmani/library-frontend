import React, { Component } from "react";
import { Form, FormGroup, Button, Table, Pagination } from "react-bootstrap";
import { fetchIssues as fetchIssuesAction } from "../actions/issues";
import { postReturn as postReturnAction } from "../actions/returns";
import DatePicker from "react-datepicker";
import moment from "moment";

const pageSize = 20;

export default class Issues extends Component {
  state = {
    date: moment(),
    isFetching: false,
    isPosting: false,
    error: false,
    issues: {
      count: 0,
      data: []
    },
    activePage: 1
  };

  componentDidMount() {
    this.fetchIssues(this.state.activePage);
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.isPosting && !nextState.isPosting && !nextState.error) {
      this.fetchIssues(this.state.activePage);
    }
  }

  fetchIssues = page => {
    this.setState({ isFetching: true });
    fetchIssuesAction(this.state.date.format("x"), page)
      .then(response => {
        console.log("response", response);
        this.setState({
          issues: response,
          isFetching: false
        });
      })
      .catch(error =>
        this.setState({
          isFetching: false,
          error: error
        })
      );
  };

  handlePageSelect = activePage => {
    this.fetchIssues(activePage);
    this.setState({
      activePage
    });
  };

  renderTableRow = (row, index) => (
    <tr key={row._id}>
      <td>{index + 1}</td>
      <td>{row.book.name}</td>
      <td>{row.member.name}</td>
      <td>{moment(row.issueDate).format("DD/MM/YYYY")}</td>
      <td>{row.status}</td>
      <td>{moment(row.returnDate).format("DD/MM/YYYY")}</td>
      <td>
        {row.status === "issued" ? (
          <Button
            bsStyle="primary"
            bsSize="xsmall"
            onClick={this.postReturn.bind(this, row._id)}
          >
            Return
          </Button>
        ) : null}
      </td>
    </tr>
  );

  handleDateChange = date => this.setState({ date });

  postReturn = issueId => {
    this.setState({
      isPosting: true
    });
    postReturnAction(issueId)
      .then(() => {
        this.setState({ isPosting: false });
      })
      .catch(error => this.setState({ isPosting: false, error }));
  };

  render() {
    return (
      <div style={{ padding: 15 }}>
        <Form
          inline
          onSubmit={e => {
            e.preventDefault();
            this.fetchIssues();
          }}
        >
          <FormGroup controlId="formInlineEmail">
            <DatePicker
              selected={this.state.date}
              onChange={this.handleDateChange}
            />
          </FormGroup>{" "}
          <Button type="submit">Search</Button>
        </Form>

        <br />

        {this.state.isFetching ? (
          <div>Loading...</div>
        ) : (
          <Table striped condensed hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Member</th>
                <th>Issue Date</th>
                <th>Status</th>
                <th>Return Date</th>
                <th />
              </tr>
            </thead>
            <tbody>{this.state.issues.data.map(this.renderTableRow)}</tbody>
          </Table>
        )}
        <Pagination
          prev
          next
          ellipsis
          boundaryLinks
          items={this.state.issues.count / pageSize}
          maxButtons={5}
          activePage={this.state.activePage}
          onSelect={this.handlePageSelect}
        />
      </div>
    );
  }
}
