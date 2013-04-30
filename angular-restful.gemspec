# -*- encoding: utf-8 -*-
require File.expand_path('../lib/angular-restful/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = "Esdras Eduardo"
  gem.email         = "esdrasedu@gmail.com"
  gem.summary       = "AngularJS factory for restful."
  gem.description   = "AngularJS factory for restful, with methods default [get, query, create, update, destroy] and with associations."
  gem.homepage      = "https://github.com/esdrasedu/angular-restful"

  gem.files         = Dir['vendor/*']
  gem.name          = "angular-restful"
  gem.version       = Angular::Restful::VERSION
end