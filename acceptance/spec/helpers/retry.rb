def retry_for seconds = 5, &block
    begin
        block.call
    rescue Exception => e
        if seconds > 0
            sleep 1
            retry_for seconds - 1, &block
        else
            raise e
        end
    end
end
