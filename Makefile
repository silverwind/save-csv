# os dependencies: jq git npm

VERSION := $(shell jq -r .version < package.json)
BIN := node_modules/.bin

lint:
	$(BIN)/eslint --color --quiet --ignore-pattern *.min.js .

test:
	$(MAKE) lint

min:
	$(BIN)/uglifyjs save-csv.js -o save-csv.min.js --mangle --compress --unsafe --comments '/save-csv/' && wc -c save-csv.min.js
	cat README.md | sed -E "s/[0-9]+ bytes/$$($(BIN)/gzip-size --raw save-csv.min.js) bytes/" > README.md
	git diff --exit-code &>/dev/null || git commit -am "rebuild"

update:
	$(BIN)/updates -u
	rm -rf node_modules
	yarn

publish:
	npm publish
	git push -u --follow-tags

patch:
	$(MAKE) lint
	cat save-csv.min.js | sed -E "s/v[0-9\.]+/v$$($(BIN)/semver -i patch $(VERSION))/" > save-csv.min.js
	cat save-csv.js | sed -E "s/v[0-9\.]+/v$$($(BIN)/semver -i patch $(VERSION))/" > save-csv.js
	git diff --exit-code &>/dev/null || git commit -am "bump version"
	$(MAKE) min
	npm version patch
	$(MAKE) publish

minor:
	$(MAKE) lint
	cat save-csv.min.js | sed -E "s/v[0-9\.]+/v$$($(BIN)/semver -i minor $(VERSION))/" > save-csv.min.js
	cat save-csv.js | sed -E "s/v[0-9\.]+/v$$($(BIN)/semver -i minor $(VERSION))/" > save-csv.js
	git diff --exit-code &>/dev/null || git commit -am "bump version"
	$(MAKE) min
	npm version minor
	$(MAKE) publish

major:
	$(MAKE) lint
	cat save-csv.min.js | sed -E "s/v[0-9\.]+/v$$($(BIN)/semver -i major $(VERSION))/" > save-csv.min.js
	cat save-csv.js | sed -E "s/v[0-9\.]+/v$$($(BIN)/semver -i major $(VERSION))/" > save-csv.js
	git diff --exit-code &>/dev/null || git commit -am "bump version"
	$(MAKE) min
	npm version major
	$(MAKE) publish

.PHONY: lint test min publish patch minor major

