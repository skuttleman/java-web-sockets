import React, { Component } from 'react';
import { SET_SELECTED_CONNECTION } from '../constants/actionTypes';

export default class Connection extends Component {
    render() {
        const { text, selected } = this.props;
        const className = `connection${selected ? ' connection--selected' : ''}`;
        return (
            <li className={className} onClick={() => this.click()}>
                {text}
            </li>
        );
    }

    click() {
        const { selected, text, dispatch } = this.props;
        dispatch({
            type: SET_SELECTED_CONNECTION,
            connection: selected ? null : text
        });
    }
}
