require "rubygems"
require "sinatra"

require "net/http"
require "uri"

::REMOTE_CI_SERVER = "http://ci.codefire.com.au/" # Trailing slash required

get "/remote/:action" do
  body Net::HTTP.get(URI.parse("#{::REMOTE_CI_SERVER}#{params[:action]}.json"))
end

get "/" do
  erb :index
end