import React, { Component } from 'react';

export default class Connection extends Component {
    onClick() {
        const { selected, text, dispatch } = this.props;
        dispatch({
            type: 'SET_SELECTED_CONNECTION',
            connection: selected ? null : text
        });
    }

    render() {
        const { text, selected } = this.props;
        const className = `connection${selected ? ' connection--selected' : ''}`;
        return (
            <li className={className} onClick={() => this.onClick()}>
                {text}
            </li>
        );
    }
}
