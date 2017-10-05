import React, { Component } from 'react'
import { Label, Row, Col, Table, Button } from 'react-bootstrap'
import Select from 'react-select'
import { fetchMembers as fetchMembersAction } from '../actions/members'
import 'react-select/dist/react-select.css';
import moment from 'moment'

export default class Book extends Component {
    state = {
        isFetching: false,
        data: [],
        error: false,
        selectedMember: null
    }

    componentDidMount() {
        this.fetchMembers()
    }

    fetchMembers = (name) => {
        this.setState({ isFetching: true })
        fetchMembersAction({ name })
            .then((response) => {
                console.log(response)
                this.setState({
                    data: response,
                    isFetching: false
                })
            })
            .catch((error) => this.setState({
                isFetching: false,
                error: error
            }))
    }

    onMemberSelected = (selectedMember) => this.setState({ selectedMember })

    getOptions = () => this.state.data.map((option, index) => ({ ...option, label: option.name, value: option._id }))

    renderCategory = (category, index) => <Label bsStyle="success" key={index} style={{ marginRight: 2 }}>{category}</Label>

    renderRow = (issue, index) => {
        console.log("renderRow", issue)
        return <tr key={issue._id}>
            <td>{issue._id}</td>
            <td>{issue.memberId}</td>
            <td>{moment(issue.issueDate).format('DD/MM/YYYY')}</td>
            <td>{moment(issue.returnDate).format('DD/MM/YYYY')}</td>
        </tr>
    }

    render() {
        console.log("rendering", this.props)
        return (
            <div>
                <div style={{ paddingLeft: 15, paddingRight: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4>{this.props.book.name}</h4>
                    <div>
                        {this.props.book.categories.map(this.renderCategory)}
                    </div>
                </div>
                <div style={{ padding: 15 }}>
                    <Row>
                        <Col xs={3}><strong>Authors:</strong></Col>
                        <Col xs={9}>{this.props.book.authors.toString()}</Col>
                    </Row>
                    <Row>
                        <Col xs={3}><strong>Quantity:</strong></Col>
                        <Col xs={9}>{this.props.book.quantity}</Col>
                    </Row>
                    <br />
                    {
                        this.props.book.quantity !== 0 ?
                            <Row>
                                <Col xs={3}><strong>Issue to:</strong></Col>
                                <Col xs={9}>
                                    <div style={{ width: 200, float: 'left' }}>
                                        <Select
                                            value={this.state.selectedMember}
                                            options={this.getOptions()}
                                            onInputChange={this.fetchMembers}
                                            onChange={this.onMemberSelected}
                                            isLoading={this.state.isFetching}
                                            placeholder='Member name...'
                                        />
                                    </div>
                                    <Button
                                        bsStyle='success'
                                        onClick={() => this.props.issueBook(this.props.book._id, this.state.selectedMember._id)}
                                        style={{ float: 'left' }}
                                    >
                                        Issue
                                    </Button>
                                </Col>
                            </Row>
                            :
                            null
                    }
                    <br />
                    <strong>Issues:</strong>
                    <Table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Member</th>
                                <th>Issue Date</th>
                                <th>Return Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                this.props.book.issues.map(this.renderRow)
                            }
                        </tbody>
                    </Table>

                </div>

            </div>
        )
    }
}