require 'rubygems'
require 'rspec'
require 'require_all'
require 'httparty'
require_relative './helpers/retry'
require_relative './helpers/server'
require_rel './utils/socket'

server = Server.new

RSpec.configure do |config|
    config.order = :random
    config.filter_run :focus

    config.before :suite do
        server.start
    end

    config.after :suite do
        server.stop
    end
end

class SocketTest
    def initialize name, &block
        @name = name
        @messages = []
        @socket = SocketHelper.new
        @socket.connect(name) do
            block.call @socket
        end
        @socket.on do |msg|
            @messages.push msg
        end
    end

    def messages
        @messages
    end

    def socket
        @socket
    end
end

def exp_broadcast msg
    {
        'type' => 'broadcast',
        'payload' => {
            'from' => 'manager',
            'message' => msg
        }
    }
end

def exp_connected id
    {
        'type' => 'connected',
        'payload' => {
            'id' => id
        }
    }
end

def exp_disconnected id
    {
        'type' => 'disconnected',
        'payload' => {
            'id' => id
        }
    }
end
