function draw() {
    var dotStr = "` + dotStr + `";
    var graph = vis.parseDOTNetwork(dotStr);
    var options = {
        manipulation: {
            enabled: true
        }
    };
    var container = document.getElementById('mynetwork');
    var network = new vis.Network(container, graph, options);

    var allEdges = graph.edges;
    var selectedNode;
    network.on("selectNode", function (params) {
        if (params.nodes.length == 1) {
            selectedNode = params.nodes[0];
            allEdges.forEach(function (edge) {
                if (edge.from != selectedNode && edge.to != selectedNode) {
                    network.updateEdge(edge.id, {hidden: true});
                } else {
                    network.updateEdge(edge.id, {hidden: false});
                }
            });
        }
    });

    network.on("deselectNode", function (params) {
        if (params.previousSelection.nodes.length == 1) {
            var previousSelectedNode = params.previousSelection.nodes[0];
            allEdges.forEach(function (edge) {
                if (edge.from == previousSelectedNode || edge.to == previousSelectedNode) {
                    network.updateEdge(edge.id, {hidden: false, label: ""});
                }
            });
        }
    });
}