class Server
    def start
        unless app_running?
            @pid = Process.spawn(
                'java -jar build/libs/java-socket-0.1.0.jar',
                chdir: '../',
                pgroup: true,
                out: 'server.std.log',
                err: 'server.err.log'
            )

            puts 'Starting Server'

            retry_for 100 do
                raise 'Server never started' unless app_running?
            end
        end

        puts 'Server Started'
    end

    def app_running?
        begin
            HTTParty.get('http://localhost:8080/health').code == 200
        rescue Exception => e
            false
        end
    end

    def stop
        if @pid
            puts 'Stopping Server'
            Process.kill('TERM', @pid)
        end
    end
end