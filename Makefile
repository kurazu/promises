all:
	for file in examples/*.c examples/*.cpp examples/*.py examples/*.pyx examples/*.sh examples/*.txt examples/*.pytb examples/*.pycon examples/*.patch; \
	do \
		if test '(' "$${file}" '!=' 'examples/*.sh' ')' -a '(' "$${file}" '!=' 'examples/*.txt' ')' -a '(' "$${file}" '!=' 'examples/*.pytb' ')' -a '(' "$${file}" '!=' 'examples/*.py' ')' -a '(' "$${file}" '!=' 'examples/*.pycon' ')' -a '(' "$${file}" '!=' 'examples/*.patch' ')'; \
		then \
			echo -n "Pygmentizing $${file} ... "; \
			outfile="$${file}.html"; \
			case "$${file}" in \
				*.c) \
					lexer="c"; \
					;; \
				*.cpp) \
					lexer="cpp"; \
					;; \
				*.pyx) \
					lexer="cython"; \
					;; \
				*.py) \
					lexer="python"; \
					;; \
				*.sh) \
					lexer="bash"; \
					;; \
				*.txt) \
					lexer="text"; \
					;; \
				*.pytb) \
					lexer="pytb"; \
					;; \
				*.pycon) \
					lexer="pycon"; \
					;; \
				*.patch) \
					lexer="udiff"; \
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
