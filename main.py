import argparse
from jinja2 import Environment, FileSystemLoader

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('dot_file', type=str, required=True)
    args = parser.parse_args()
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('template.html')
    output = template.render(dot_file=args.dot_file)
    print(output)
