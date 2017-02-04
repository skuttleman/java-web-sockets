import React, { Component } from 'react';
import { SOCKET_CLEAR_MESSAGES } from '../constants/actionTypes';

export default class Messages extends Component {
    click() {
        this.props.dispatch({ type: SOCKET_CLEAR_MESSAGES });
    }

    render() {
        const { messages } = this.props;
        return (
            <div className="messages">
                <p>Messages Received:</p>
                <ul className="messageList">
                    {messages.map(({ message }, key) => {
                        return <li className="message" key={key}>{message}</li>
                    })}
                </ul>
                <button
                    className="clear"
                    disabled={messages.length === 0}
                    onClick={() => this.click()}
                    >
                    Clear Messages
                </button>
            </div>
        );
    }
}
