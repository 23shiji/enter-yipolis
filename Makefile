publish:
	git add .
	git commit -m autosave || echo "master clear"
	git push origin master
	git checkout gh-pages
	git merge master -m 'auto merge'
	yarn build
	git add .
	git commit -m 'auto build'
	git push origin gh-pages
	git checkout master
	rm -rf dist

init_ghpages:
	git branch gh-pages