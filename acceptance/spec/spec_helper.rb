require 'rubygems'
require 'rspec'
require 'require_all'
require 'httparty'
require 'httparty'

require_relative './helpers/retry'
require_relative './helpers/server'
require_relative './helpers/socket_client'

SERVER_PORT = 8080
SOCKET_PORT = 8000
server = Server.new SERVER_PORT
client = SocketClient.new SOCKET_PORT

RSpec.configure do |config|
    config.order = :random

    config.before :suite do
        server.start
        client.start
    end

    config.after :suite do
        server.stop
        client.stop
    end
end

def connect_socket id
    HTTParty.post "http://localhost:#{SOCKET_PORT}/connect/#{id}"
end

def disconnect_all
    HTTParty.post "http://localhost:#{SOCKET_PORT}/disconnect"
end

def disconnect_one id
    HTTParty.post "http://localhost:#{SOCKET_PORT}/disconnect/#{id}/one"
end

def disconnect_socket id
    HTTParty.post "http://localhost:#{SOCKET_PORT}/disconnect/#{id}"
end

def broadcast_socket id, message
    body = {:type => 'broadcast', :payload => { :message => message }}.to_json
    HTTParty.post "http://localhost:#{SOCKET_PORT}/messages/#{id}", :body => body
end

def send_to_socket id, to, message
    body = {:type => 'broadcast', :payload => { :to => to, :message => message }}.to_json
    HTTParty.post "http://localhost:#{SOCKET_PORT}/messages/#{id}", :body => body
end

def get_messages id
    body = JSON.parse HTTParty.get("http://localhost:#{SOCKET_PORT}/messages/#{id}").body
    body['messages']
end
