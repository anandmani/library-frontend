import React, { Component } from 'react'
import { Form, FormGroup, Button, Table, Pagination } from 'react-bootstrap'
import { fetchReturns as fetchReturnsAction } from '../actions/returns'
import DatePicker from 'react-datepicker'
import moment from 'moment'

const pageSize = 20

export default class Returns extends Component {

    state = {
        date: moment(),
        isFetching: false,
        error: false,
        returns: {
            count: 0,
            data: []
        },
        activePage: 1
    }

    componentDidMount() {
        this.fetchReturns(this.state.activePage)
    }

    fetchReturns = (page) => {
        this.setState({ isFetching: true })
        fetchReturnsAction(this.state.date.format('x'), page)
            .then((response) => {
                console.log(response)
                this.setState({
                    returns: response,
                    isFetching: false
                })
            })
            .catch((error) => this.setState({
                isFetching: false,
                error: error
            }))
    }

    handlePageSelect = (activePage) => {
        this.fetchReturns(activePage)
        this.setState({
            activePage
        })
    }

    renderTableRow = (row, index) => <tr key={row._id}>
        <td>{index + 1}</td>
        <td>{row.bookId}</td>
        <td>{row.memberId}</td>
        <td>{moment(row.issueDate).format('DD/MM/YYYY')}</td>
        <td>{row.status}</td>
        <td>{moment(row.returnDate).format('DD/MM/YYYY')}</td>
    </tr>

    handleDateChange = (date) => this.setState({ date })

    render() {
        return (
            <div style={{ padding: 15 }}>
                <Form inline onSubmit={(e) => {
                    e.preventDefault()
                    this.fetchReturns()
                }}>
                    <FormGroup controlId="formInlineEmail">
                        <DatePicker
                            selected={this.state.date}
                            onChange={this.handleDateChange}
                        />
                    </FormGroup>
                    {' '}
                    <Button type="submit">
                        Search
                    </Button>
                </Form>

                <br />

                {
                    this.state.isFetching ?
                        <div>Loading...</div>
                        :
                        <Table striped condensed hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Book</th>
                                    <th>Member</th>
                                    <th>Issue Date</th>
                                    <th>Status</th>
                                    <th>Return Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.returns.data.map(this.renderTableRow)
                                }
                            </tbody>
                        </Table>
                }
                <Pagination
                    prev
                    next
                    ellipsis
                    boundaryLinks
                    items={this.state.returns.count / pageSize}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handlePageSelect} />
            </div>
        )
    }

}