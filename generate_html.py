import pprint
from yaml import load, dump
try:
    from yaml import CLoader as Loader, CDumper as Dumper
except ImportError:
    from yaml import Loader, Dumper

class Chapter(object):

    # One Chapter corresponds to one file in the /chapters folder
    def __init__(self, arg):
        super(Chapter, self).__init__()
        self.arg = arg

# Loads a YAML file from a file
#
# @except IoException, YamlDecodeException
def load_yaml(path: str) -> Chapter:
    file = open(path, "rt")
    data = load(file, Loader=Loader)
    return data

def main():
    the_hostage = load_yaml("./The_Hostage.yml")
    pprint.PrettyPrinter(indent=2).pprint(the_hostage)

if __name__ == "__main__":
    main()