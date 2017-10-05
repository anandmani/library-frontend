import React, { Component } from 'react'
import { Label, Row, Col, Table } from 'react-bootstrap'

export default class Member extends Component {
    render() {
        console.log(this.props)
        return (
            <div>
                <div style={{ paddingLeft: 15, paddingRight: 15, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <h4>{this.props.member.name}</h4>
                    <div>
                        <h5><Label bsStyle="success">{this.props.member.mobile}</Label></h5>
                    </div>
                </div>
                <div style={{ padding: 15 }}>
                    <Row>
                        <Col xs={3}><strong>Issues left:</strong></Col>
                        <Col>{this.props.member.canIssue}</Col>
                    </Row>
                    <br />
                    <strong>Issues:</strong>
                    <Table>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Username</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Mark</td>
                                <td>Otto</td>
                                <td>@mdo</td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Jacob</td>
                                <td>Thornton</td>
                                <td>@fat</td>
                            </tr>
                        </tbody>
                    </Table>

                </div>

            </div>
        )
    }
}