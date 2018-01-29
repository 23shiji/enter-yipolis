publish_code:
	git add .
	git commit -m autosave || echo "master clear"
	git checkout gh-pages
	git merge master -m 'auto merge'
	yarn build
	git add .
	git commit -m 'auto build' || echo "gh-pages clear"
	git checkout master
	rm -rf dist
	git push

publish_data:
	git add .
	git commit -m autosave || echo "master clear"
	git checkout gh-pages
	git merge master -m 'auto merge'
	git checkout master
	rm -rf dist
	git push

init_ghpages:
	git branch gh-pages
	git push origin gh-pages