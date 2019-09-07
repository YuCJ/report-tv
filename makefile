BIN_DIR ?= node_modules/.bin
P="\\033[32m[+]\\033[0m"

help:
	@echo "\033[33mmake dev TARGET={project-folder-name}\033[0m - start dev servers"
	@echo "\033[33mmake build TARGET={project-folder-name}\033[0m - build production webpack assets and transiple es6 files to es5"

# build webpacks client side needed
build: 
	@echo "Check dependencies of the project"
	yarn
	@echo "$(P) [webpack] build client side bundles"
	NODE_ENV=production $(BIN_DIR)/webpack --config webpack.config.js --progress --colors --mode production
	@echo "move dist files to root"
	cp dist/* ./

dev:
	@echo "Check dependencies of the project"
	yarn
	@echo "$(P) start webpack-dev-server"
	cd ..
	NODE_ENV=development $(BIN_DIR)/webpack-dev-server

.PHONY: help build dev
