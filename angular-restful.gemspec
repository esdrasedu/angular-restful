# -*- encoding: utf-8 -*-
require File.expand_path('../lib/angular-restful/version', __FILE__)

Gem::Specification.new do |gem|
  gem.authors       = "Esdras Eduardo"
  gem.email         = "esdrasedu@gmail.com"
  gem.description   = %q{AngularJS factory for restful Rails.}
  gem.summary       = %q{}
  gem.homepage      = "https://github.com/esdrasedu/angular-restful"

  gem.files         = `git ls-files`.split($\)
  gem.executables   = gem.files.grep(%r{^bin/}).map{ |f| File.basename(f) }
  gem.test_files    = gem.files.grep(%r{^(test|spec|features)/})
  gem.name          = "angular-restful"
  gem.require_paths = ["lib"]
  gem.version       = Angular::Restful::VERSION
end