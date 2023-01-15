function draw() {
    // parse dot file to extract nodes and edges
    var dot = vis.parseDOTNetwork(dotStr);
    var nodes = dot.nodes;
    var edges = dot.edges;

    // create a map to store unique edges
    var uniqueEdges = new Map();

    // iterate through edges and add unique edges to the map
    edges.forEach(function (edge) {
        var from = edge.from;
        var to = edge.to;
        var edgeId = from + "-" + to;
        var reverseEdgeId = to + "-" + from;

        // check if the edge or its reverse already exists in the map
        if (!uniqueEdges.has(edgeId) && !uniqueEdges.has(reverseEdgeId)) {
            uniqueEdges.set(edgeId, edge);
        } else {
            edge.hidden = true;
        }
    });

    // convert map to an array of edges

    // create a map to store original edges for each node
    var nodeEdges = new Map();
    nodes.forEach(function (node) {
        var nodeId = node.id;
        var nodeEdgesArray = edges.filter(function (edge) {
            return edge.from === nodeId || edge.to === nodeId;
        });
        nodeEdges.set(nodeId, nodeEdgesArray);
    });

    // create a network visualization
    var container = document.getElementById("network");
    var data = {
        nodes: nodes,
        edges: edges
    };
    var options = {};
    var network = new vis.Network(container, data, options);

    // add event listener to handle node selection
    network.on("selectNode", function (params) {
        if (params.nodes.length > 0) {
            var selectedNodeId = params.nodes[0];
            var selectedNodeEdges = nodeEdges.get(selectedNodeId);
            selectedNodeEdges.forEach(function (edge) {
                network.updateEdge(edge.id, {hidden: false});
            });
        } else {
            edges.forEach(function (edge) {
                network.updateEdge(edge.id, {hidden: true});
            });
        }
    });
    network.on("deselectNode", function (params) {
        edges.forEach(function (edge) {
            edgeId = edge.from + "-" + edge.to;
            if (!uniqueEdges.has(edgeId)) {
                network.updateEdge(edge.id, {hidden: true});
            }
        });
    });
}