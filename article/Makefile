all: promises.html

promises.html: content.html
	cat header.html.in content.html footer.html.in > promises.html

content.html: promises.md
	markdown_py -f content.html -e UTF-8 -o html5 promises.md

count:
	./words.py
