require_rel '../spec_helper'
require_rel '../helpers/retry'

fdescribe 'Application' do
    after :each do
        @client1.socket.close
        @client2.socket.close
        @manager.socket.close
    end

    it 'receives broadcasted messages' do
        @client1 = SocketTest.new 'client1'
        @client2 = SocketTest.new 'client2' do
            @manager = SocketTest.new 'manager' do |socket|
                socket.send message: 'this is the message'
            end
        end

        retry_for 5 do
            expect(@client1.messages).to include exp_broadcast 'this is the message'
            expect(@client2.messages).to include exp_broadcast 'this is the message'
        end
    end

    it 'receives targeted messages' do
        @client1 = SocketTest.new 'client1'
        @client2 = SocketTest.new 'client2' do
            @manager = SocketTest.new 'manager' do |socket|
                socket.send to: 'client1', message: 'this is the message'
            end
        end

        retry_for 5 do
            expect(@client1.messages).to include exp_broadcast 'this is the message'
            expect(@client2.messages).to eq []
        end
    end

    it 'receives all connection notifications if connected as a manager' do
        @client1 = SocketTest.new 'client1'
        @client2 = SocketTest.new 'client2'
        sleep 0.1
        @manager = SocketTest.new 'manager'

        retry_for 5 do
            expect(@manager.messages).to include exp_connected 'client1'
            expect(@manager.messages).to include exp_connected 'client2'
        end
    end

    it 'receives all disconnection notifications if connected as a manager' do
        @client1 = SocketTest.new 'client1'
        @client2 = SocketTest.new 'client2' do
            @manager = SocketTest.new 'manager' do
                @client1.socket.close
                @client2.socket.close
            end
        end

        retry_for 5 do
            expect(@manager.messages).to include exp_disconnected 'client1'
            expect(@manager.messages).to include exp_disconnected 'client2'
        end
    end
end
