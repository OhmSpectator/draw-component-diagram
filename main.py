import argparse
from jinja2 import Environment, FileSystemLoader

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('dot_file', help='Path to the dot file')
    args = parser.parse_args()
    env = Environment(loader=FileSystemLoader('.'))
    template = env.get_template('template.html')
    with open(args.dot_file, 'r') as f:
        dot = f.read()
    output = template.render(dot_str=dot)
    print(output)
