# Install

Run:
```shell
pip install -r requirements.txt
```

# Usage
```shell
python main.py DOT_FILE
```
Where a DOT_FILE is a file with a graph in DOT format.

The script then generates an HTML where it renders a graph with the same structure as the DOT_FILE, using `vs-network.js` library.

By default, a simplified version of the graph is rendered. To render extra details about the node (show all its edges), select the node.

# Limitations
If you want to see details about another node, first click on a free space to deselect the current node. Otherwise, all the details of the previous node will be shown.
