require 'sinatra'
require 'websocket-client-simple'
require_relative './socket_helpers'

SOCKET_URL = 'ws://localhost:8080/socket'

class SocketClient < Sinatra::Base
    @@SOCKETS = {}

    get '/health' do
        aok
    end

    post '/connect/:id' do
        id = params[:id]
        connect id
        sleep 0.1
        aok
    end

    post '/disconnect/:id/one' do
        id = params[:id]
        if @@SOCKETS[id]
            ws = @@SOCKETS[id][:ws].pop
            ws.close
        end
    end

    post '/disconnect/:id' do
        id = params[:id]
        close id
        aok
    end

    post '/disconnect' do
        @@SOCKETS.each do |key, _| close key end
    end

    get '/messages/:id' do
        id = params[:id]
        if @@SOCKETS[id]
            json_response :messages => @@SOCKETS[id][:messages]
        else
            json_response :messages => []
        end
    end

    post '/messages/:id' do
        id = params[:id]
        body = request.body.read
        if @@SOCKETS[id]
            @@SOCKETS[id][:ws].each do |ws| ws.send body end
        end
        aok
    end

    delete '/messages/:id' do
        id = params[:id]
        @@SOCKETS[id][:messages].clear
        aok
    end

    def close id
        if @@SOCKETS[id]
            @@SOCKETS[id][:ws].each do |ws| ws.close end
            @@SOCKETS.delete id
        end
    end

    def connect id
        connect_socket id
    end

    def connect_socket id
        @@SOCKETS[id] ||= {:sockets => [], :ws => [], :messages => []}
        @@SOCKETS[id][:sockets] << WebSocket::Client::Simple.connect("#{SOCKET_URL}?id=#{id}") do |ws|
            @@SOCKETS[id][:ws] << ws
            ws.on :message do |msg| @@SOCKETS[id][:messages] << JSON.parse(msg.data) end
        end
    end
end
