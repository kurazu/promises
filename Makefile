all:
	for file in examples/*.js examples/*.txt; \
	do \
		if test "$${file}" '!=' 'examples/*.js'; \
		then \
			echo -n "Pygmentizing $${file} ... "; \
			outfile="$${file}.html"; \
			case "$${file}" in \
				*.js) \
					lexer="js"; \
					;; \
				*.txt) \
					lexer="text"; \
					;; \
				*) \
					echo "Unknown file type $${file} extension $${extension}" ; \
					exit 1; \
					;; \
			esac; \
			if test '(' '!' -f "$${outfile}" ')' -o '(' "$${file}" -nt "$${outfile}" ')'; \
			then \
				pygmentize -f html -l "$${lexer}" -o "$${outfile}" "$${file}"; \
				echo "DONE"; \
			else \
				echo "SKIPPED"; \
			fi; \
		fi; \
	done

clean:
	rm examples/*.html

watch:
	while true; do make ; sleep 5; done

run:
	python -m SimpleHTTPServer 8000
