import React, { Component } from 'react';

export default class Messages extends Component {
    onClick() {
        this.props.dispatch({ type: 'SOCKET_CLEAR_MESSAGES' });
    }

    render() {
        return (
            <div className="messages">
                <p>Messages:</p>
                <ul className="messageList">
                    {this.props.messages.map(({ message }, key) => {
                        return <li className="message" key={key}>{message}</li>
                    })}
                </ul>
                <button onClick={() => this.onClick()}>Clear Message</button>
            </div>
        );
    }
}
