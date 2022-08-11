URL ?= "http://localhost:8000"
	
build-dev-guide:
	@hugo --gc --minify --buildFuture -b $(URL)/dev-guide/ --config=dev-guide.toml

build-extension-dev-guide:
	@hugo --gc --minify --buildFuture -b $(URL)/extension-dev-guide/ --config=extension-dev-guide.toml

build: build-dev-guide build-extension-dev-guide
	@echo "ok"

all: build-dev-guide build-extension-dev-guide ;
	python3 -m http.server -d public 8000

dev-guide: 
	@hugo --config=dev-guide.toml server

extension-dev-guide:
	@hugo --config=extension-dev-guide.toml server