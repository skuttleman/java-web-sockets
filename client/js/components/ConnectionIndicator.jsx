import React, { Component } from 'react'

export default class ConnectionIndicator extends Component {
    render() {
        const { connected } = this.props;
        if (connected) {
            return this.renderConnected();
        }
        return this.renderNotConnect();
    }

    renderConnected() {
        const { channelId } = this.props;
        return (
            <div className="indicator indicator--connected">
                <h2>Id: {channelId}</h2>
            </div>
        );
    }

    renderNotConnect() {
        return (
            <div className="indicator indicator--disconnected">
                <p>Not Connected</p>
            </div>
        );
    }
}