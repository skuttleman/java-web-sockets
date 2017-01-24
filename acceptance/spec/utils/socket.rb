require 'websocket-client-simple'

class SocketHelper
    @socket = nil
    @open = false

    def connect id, &block
        @socket = WebSocket::Client::Simple.connect "ws://localhost:8080/socket?id=#{id}" do |ws|
            ws.on :open do
                block.call
                @open = true
            end

            ws.on :close do
                @open = false
            end

            ws.on :error do |e|
                @open = false
            end
        end

        self
    end

    def send payload
        @socket.send({ type: 'broadcast', payload: payload }.to_json)

        self
    end

    def on &block
        @socket.on :message do |msg|
            msg = JSON.parse msg.to_s
            block.call msg
        end

        self
    end

    def open?
        @open
    end

    def close
        @socket.close if @socket
        @open = false
    end
end