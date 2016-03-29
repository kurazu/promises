#!/usr/bin/env python
from __future__ import unicode_literals, print_function

import os.path
import io
import re

pattern = re.compile('\W+', re.UNICODE | re.MULTILINE)

here = os.path.dirname(__file__)
article_path = os.path.join(here, 'promises.md')


def main():
    with io.open(article_path, 'r', encoding='utf-8') as f:
        content = f.read()

    parts = [part for part in pattern.split(content) if part]

    print(len(parts))


if __name__ == '__main__':
    main()
