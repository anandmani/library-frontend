import React, { Component } from 'react'
import { MenuItem, DropdownButton, Form, FormGroup, Button, Table, Modal, Pagination } from 'react-bootstrap'
import { fetchBooks as fetchBooksAction } from '../actions/books'
import { postIssue } from '../actions/issues'
import Book from './Book'

const pageSize = 20
const dropdownOptions = [{ name: 'Name', value: 'name' }, { name: 'Author', value: 'author' }, { name: 'Category', value: 'category' }]

export default class Books extends Component {

    state = {
        optionSelected: 0,
        isFetching: false,
        error: false,
        isPosting: false,
        books: {
            count: 0,
            data: []
        },
        showModal: false,
        selectedBookIndex: null,
        activePage: 1
    }

    componentDidMount() {
        this.fetchBooks({
            page: this.state.activePage
        })
    }

    componentWillUpdate(nextProps, nextState) {
        if (this.state.isPosting && !nextState.isPosting && !nextState.error) {
            this.fetchBooks({
                page: this.state.activePage
            })
        }
    }

    handlePageSelect = (activePage) => {
        this.fetchBooks({
            page: activePage
        })
        this.setState({
            activePage
        })
    }

    fetchBooks = (params) => {
        this.setState({ isFetching: true })
        fetchBooksAction(params)
            .then((response) => {
                this.setState({
                    books: response,
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
        <td>{row.authors.toString()}</td>
        <td>{row.categories.toString()}</td>
        <td>{row.quantity}</td>
    </tr>

    handleRowClick = (index) => {
        this.setState({ showModal: true, selectedBookIndex: index })
    }

    close = () => this.setState({ showModal: false })

    handleSearch = () => {
        this.fetchBooks({ [dropdownOptions[this.state.optionSelected].value]: this.searchInput.value })
    }

    issueBook = (bookId, memberId) => {
        this.setState({
            showModal: false,
            isPosting: true
        })
        postIssue(bookId, memberId)
            .then(() => this.setState({ isPosting: false }))
            .catch((error) => this.setState({ isPosting: false, error }))
    }

    render() {
        console.log("state", this.state)
        return (
            <div style={{ padding: 15 }}>
                <Modal show={this.state.showModal} onHide={this.close}>
                    {
                        this.state.selectedBookIndex !== null ?
                            <Book
                                book={this.state.books.data[this.state.selectedBookIndex]}
                                issueBook={this.issueBook}
                            />
                            :
                            null
                    }
                </Modal>
                <Form inline onSubmit={(e) => {
                    e.preventDefault()
                    this.handleSearch()
                }}>
                    <FormGroup controlId="formInlineEmail">
                        <DropdownButton title={dropdownOptions[this.state.optionSelected].name} id='searchOn' onSelect={this.handleSelect}>
                            {
                                dropdownOptions.map(this.renderDropdownOption)
                            }
                        </DropdownButton>
                    </FormGroup>

                    <FormGroup controlId="formInlineEmail">
                        <input placeholder="Search" ref={input => this.searchInput = input} />
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
                                    <th>Authors</th>
                                    <th>Categories</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.books.data.map(this.renderTableRow)
                                }
                            </tbody>
                        </Table>
                }

                <Pagination
                    prev
                    next
                    ellipsis
                    boundaryLinks
                    items={this.state.books.count / pageSize}
                    maxButtons={5}
                    activePage={this.state.activePage}
                    onSelect={this.handlePageSelect} />

            </div>
        )
    }

}