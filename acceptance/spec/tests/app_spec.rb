require_rel '../spec_helper'
require_rel '../helpers/retry'

describe 'Application' do
    before :each do
        connect_socket 'manager'
        connect_socket 'client1'
        connect_socket 'client2'
    end

    after :each do
        disconnect_all
    end

    it 'receives broadcasted messages' do
        broadcast_socket 'client1', 'some message'

        retry_for 3 do
            client1_messages = get_messages 'client1'
            client2_messages = get_messages 'client2'
            manager_messages = get_messages 'manager'

            expect(manager_messages).to include({ 'type' => 'broadcast', 'payload' => { 'from' => 'client1', 'message' => 'some message' } })
            expect(client1_messages).to include({ 'type' => 'broadcast', 'payload' => { 'from' => 'client1', 'message' => 'some message' } })
            expect(client2_messages).to include({ 'type' => 'broadcast', 'payload' => { 'from' => 'client1', 'message' => 'some message' } })
        end
    end

    it 'receives targeted messages' do
        send_to_socket 'manager', 'client2', 'some message'

        retry_for 3 do
            client1_messages = get_messages 'client1'
            client2_messages = get_messages 'client2'
            manager_messages = get_messages 'manager'

            expect(manager_messages).not_to include({ 'type' => 'broadcast', 'payload' => { 'from' => 'manager', 'message' => 'some message' } })
            expect(client1_messages).not_to include({ 'type' => 'broadcast', 'payload' => { 'from' => 'manager', 'message' => 'some message' } })
            expect(client2_messages).to include({ 'type' => 'broadcast', 'payload' => { 'from' => 'manager', 'message' => 'some message' } })
        end
    end

    it 'receives all connection notifications if connected as a manager' do
        retry_for 3 do
            manager_messages = get_messages 'manager'

            expect(manager_messages).to include({ 'type' => 'connected', 'payload' => { 'id' => 'client1' } })
            expect(manager_messages).to include({ 'type' => 'connected', 'payload' => { 'id' => 'client2' } })
        end
    end

    it 'receives all disconnection notifications if connected as a manager' do
        disconnect_socket 'client1'
        disconnect_socket 'client2'

        retry_for 3 do
            manager_messages = get_messages 'manager'

            expect(manager_messages).to include({ 'type' => 'disconnected', 'payload' => { 'id' => 'client1' } })
            expect(manager_messages).to include({ 'type' => 'disconnected', 'payload' => { 'id' => 'client2' } })
        end
    end

    it 'only receives disconnection notification if all clients of the same id disconnect' do
        connect_socket 'client1'
        disconnect_one 'client1'

        retry_for 3 do
            manager_messages = get_messages 'manager'

            expect(manager_messages).not_to include({ 'type' => 'disconnected', 'payload' => { 'id' => 'client1' } })
        end
    end
end
