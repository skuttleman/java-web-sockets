require 'json'

def json_response(data, code=200)
    [code, {'Content-Type' => 'application/json'}, [data.to_json]]
end

def aok
    json_response :a => 'ok'
end

def silent &block
    begin
        block.call
    rescue
    end
end