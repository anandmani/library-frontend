import React, { Component } from 'react'
import { MenuItem, DropdownButton, Form, FormGroup, Button, Table, Modal, Pagination } from 'react-bootstrap'
import { fetchMembers as fetchMembersAction } from '../actions/members'
import Member from './Member'

const pageSize = 20
const dropdownOptions = [{ name: 'Name', value: 'name' }, { name: 'Mobile', value: 'mobile' }]

export default class Members extends Component {

    state = {
        optionSelected: 0,
        isFetching: false,
        error: false,
        members: {
            count: 0,
            data: []
        },
        showModal: false,
        selectedMemberIndex: null,
        activePage: 1
    }

    componentDidMount() {
        this.fetchMembers({ page: this.state.activePage })
    }

    fetchMembers = (params) => {
        this.setState({ isFetching: true })
        fetchMembersAction(params)
            .then((response) => {
                console.log("response",response)
                this.setState({
                    members: response,
                    isFetching: false
                })
            })
            .catch((error) => this.setState({
                isFetching: false,
                error: error
            }))
    }

    renderDropdownOption = (dropdownOption, index) => <MenuItem
        key={dropdownOption.value}
        eventKey={index}
        active={this.state.optionSelected === index}
    >
        {dropdownOption.name}
    </MenuItem>

    handleSelect = (eventKey) => this.setState({ optionSelected: eventKey })

    renderTableRow = (row, index) => <tr key={row._id} onClick={this.handleRowClick.bind(this, index)}>
        <td>{index + 1}</td>
        <td>{row.name}</td>
        <td>{row.mobile}</td>
        <td>{row.canIssue}</td>
    </tr>

    handleRowClick = (index) => {
        this.setState({
            showModal: true,
            selectedMemberIndex: index
        })
    }

    handlePageSelect = (activePage) => {
        this.fetchMembers({
            [dropdownOptions[this.state.optionSelected].value]: this.searchInput.value,
            page: activePage
        })
        this.setState({
            activePage
        })
    }

    close = () => this.setState({ showModal: false })

    handleSubmit = () => {
        this.fetchMembers({
            [dropdownOptions[this.state.optionSelected].value]: this.searchInput.value,
            page: this.state.activePage
        })
    }

    render() {
        return (
            <div style={{ padding: 15 }}>
                <Modal show={this.state.showModal} onHide={this.close}>
                    {
                        this.state.selectedMemberIndex !== null ?
                            <Member member={this.state.members.data[this.state.selectedMemberIndex]} />
                            :
                            null
                    }
                </Modal>
                <Form inline onSubmit={(e) => {
                    e.preventDefault()
                    this.handleSubmit()
                }}>
                    <FormGroup controlId="formInlineEmail">
                        <DropdownButton title={dropdownOptions[this.state.optionSelected].name} id='searchOn' onSelect={this.handleSelect}>
                            {
                                dropdownOptions.map(this.renderDropdownOption)
                            }
                        </DropdownButton>
                    </FormGroup>

                    <FormGroup controlId="formInlineEmail">
                        <input placeholder="Search" ref={(input) => this.searchInput = input} />
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
                                    <th>Name</th>
                                    <th>Mobile</th>
                                    <th>Issues left</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.members.data.map(this.renderTableRow)
                                }
                            </tbody>
                        </Table>
                }
                <Pagination
                    prev
                    next
                    ellipsis
                    boundaryLinks
                    items={this.state.members.count / pageSize}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handlePageSelect} />
            </div>
        )
    }

}