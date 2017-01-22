import React, { Component } from 'react';
import Connection from './Connection';

export default class Connections extends Component {
    render() {
        const { selectedConnection, connections, dispatch } = this.props;
        return (
            <div className="connections">
                <p>Connected Clients:</p>
                <ul className="connectionList">
                    {connections.map((connection, key) => {
                        return (
                            <Connection
                                key={key}
                                text={connection}
                                selected={connection === selectedConnection}
                                dispatch={dispatch}
                            />
                        );
                    })}
                </ul>
            </div>
        );
    }
}
