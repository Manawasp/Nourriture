#!/usr/bin/env ruby
require "rubygems"
require "json"
require "net/http"

# api_key = API-KEY 
# workspace_id = WORKSPACE-ID 
# assignee = ASSIGNEE-EMAIL

# set up HTTPS connection
uri = URI.parse("http://localhost:1337/users/")
http = Net::HTTP.new(uri.host, uri.port)
# http.use_ssl = true
# http.verify_mode = OpenSSL::SSL::VERIFY_PEER

# set up the request

req = Net::HTTP::Post.new(uri.path, header = { "Content-Type" => "application/json" })
# req.body = {
    # "data" => "helloworld"
# }.to_json()

# issue the request
res = http.request(req)
# output
body = JSON.parse(res.body)

if res.code.to_i != 200 then 
    puts "Server returned an error: #{body.inspect}" 
else
    puts "Created task with id: #{body.inspect}" 
end
