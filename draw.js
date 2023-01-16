

function draw() {
    // parse dot file to extract nodes and edges
    let dot = vis.parseDOTNetwork(dotStr);
    let nodes = dot.nodes;
    let edges = dot.edges;

    // create a map to store unique edges
    let uniqueEdges = new Map();

    function getUniqueEdgeId(from, to) {
        return from + "-" + to;
    }

    // iterate through edges and add unique edges to the map
    edges.forEach(function (edge) {
        let edgeId = getUniqueEdgeId(edge.from, edge.to);
        let reverseEdgeId = getUniqueEdgeId(edge.to, edge.from);

        let hide = true;
        if (!uniqueEdges.has(edgeId)) {
            uniqueEdges.set(edgeId, edge);
            hide = false;
        }
        if (!uniqueEdges.has(reverseEdgeId)) {
            uniqueEdges.set(reverseEdgeId, edge);
            hide = false;
        }
        if (hide) {
            edge.hidden = true;
        }
    });

    // create a map to store original edges for each node
    let nodeEdges = new Map();
    nodes.forEach(function (node) {
        let nodeId = node.id;
        let nodeEdgesArray = edges.filter(function (edge) {
            return edge.from === nodeId || edge.to === nodeId;
        });
        nodeEdges.set(nodeId, nodeEdgesArray);
    });

    // create a network visualization
    let container = document.getElementById("network");
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        physics: {
            barnesHut: {
                gravitationalConstant: -8000,
                centralGravity: 0.3,
                springLength: 95,
                springConstant: 0.04,
                avoidOverlap: 0
            }
        },
        layout: {
            improvedLayout: true
        },
    };

    let network = new vis.Network(container, data, options);

    // add event listener to handle node selection
    network.on("selectNode", function (params) {
        if (params.nodes.length > 0) {
            let selectedNodeId = params.nodes[0];
            let selectedNodeEdges = nodeEdges.get(selectedNodeId);
            selectedNodeEdges.forEach(function (edge) {
                network.updateEdge(edge.id, {hidden: false});
            });
        }
    });
    network.on("deselectNode", function (params) {
        edges.forEach(function (edge) {
            let edgeId = getUniqueEdgeId(edge.from, edge.to);
            let reverseEdgeId = getUniqueEdgeId(edge.to, edge.from);
            if (uniqueEdges.get(edgeId) !== edge && uniqueEdges.get(reverseEdgeId) !== edge) {
                network.updateEdge(edge.id, {hidden: true});
            }
        });
    });
}