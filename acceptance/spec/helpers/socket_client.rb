class SocketClient
    def initialize port
        @port = port
    end

    def start
        unless app_running?
            @pid = Process.spawn(
                "rackup -p #{@port} config.ru",
                chdir: './',
                pgroup: true,
                out: 'socket.std.log',
                err: 'socket.err.log'
            )

            puts 'Starting Socket Client'

            retry_for 20 do
                raise 'Socket Client never started' unless app_running?
            end
        end

        puts 'Socket Client Started'
    end

    def app_running?
        begin
            HTTParty.get("http://localhost:#{@port}/health").code == 200
        rescue
            false
        end
    end

    def stop
        if @pid
            puts 'Stopping Socket Client'
            Process.kill('TERM', @pid)
        end
    end
end