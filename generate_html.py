# -*- coding: utf-8 -*-

import pprint
import os

import yaml
import jinja2
from typing import *

class Chapter(object):

    # One Chapter corresponds to one file in the /chapters folder
    #
    # Note: `yaml_file` should be Dict[str, Any], but since `safe_load`
    # returns a str for whatever reason, this doesn't pass the mypy tests
    # Why `str["description"]` even works is beyond my knowledge
    def __init__(self, yaml_file: str) -> None:
        super(Chapter, self).__init__()
        pprint.PrettyPrinter().pprint(yaml_file)
        self.yaml_file = yaml_file

    def render(self, template: jinja2.Template) -> str:
        rendered = template.render(
            title = self.yaml_file["title"],
            description = self.yaml_file["description"],
            playing_as = self.yaml_file["playing_as"],
            choices = self.yaml_file["choices"])
        return rendered

# Loads a YAML file from a file
#
# @except IoException, YamlDecodeException
def load_yaml(path: str) -> Chapter:

    with open(path, "r") as chapter_file:
        data = chapter_file.read()
        chapter_file.close()
        data = yaml.safe_load(data)
        return Chapter(data)

    raise IOError("Could not find chapter file: {}!".format(path))

def main():

    template_path = "./chapter.template.html"
    chapters_path = "./chapters"
    chapters_output_path = "./chapters_rendered"

    with open(template_path, "r") as template_file:
        template = template_file.read()
        template_file.close()
        template = jinja2.Template(template)

        for chapter_path in os.listdir(chapters_path):
            file_name = os.path.join(chapters_path, chapter_path)
            chapter = load_yaml(file_name)
            rendered = chapter.render(template)
            with open(os.path.join(chapters_output_path, os.path.splitext(chapter_path)[0] + ".html"), "w+") as output_file:
                output_file.write(rendered)

if __name__ == "__main__":
    main()