all: promises.html

promises.html: promises.md
	pandoc --from markdown_github --to html --standalone promises.md --output promises.html

count:
	./words.py
