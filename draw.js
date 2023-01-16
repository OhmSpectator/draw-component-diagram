function draw() {
    let dot = vis.parseDOTNetwork(dotStr);
    let nodes = dot.nodes;
    let edges = dot.edges;
    const defaultColor = {color: 'black', highlight: 'red', hover: 'black'};

    let allEdges = new Map();
    nodes.forEach(function (node) {
        let nodeEdgesArray = edges.filter(function (edge) {
            if (edge.from === node.id || edge.to === node.id) {
                return true
            }
        });
        nodeEdgesArray = nodeEdgesArray.map(function (edge) {
            edge.color = defaultColor;
            return {edge: edge,
                storedLabel: edge.label,
                storedArrows: edge.arrows}
        });
        allEdges.set(node.id, nodeEdgesArray);
    });

    function getUniqueEdgeId(from, to) {
        return from + "-" + to;
    }

    let uniqueEdges = new Map();
    edges.forEach(function (edge) {
        let edgeId = getUniqueEdgeId(edge.from, edge.to);
        let reverseEdgeId = getUniqueEdgeId(edge.to, edge.from);
        let hide = true;
        if (!uniqueEdges.has(edgeId)) {
            uniqueEdges.set(edgeId, edge);
            edge.label = "";
            edge.arrows = "";
            hide = false;
        }
        if (!uniqueEdges.has(reverseEdgeId)) {
            uniqueEdges.set(reverseEdgeId, edge);
            edge.label = "";
            edge.arrows = "";
            hide = false;
        }
        if (hide) {
            edge.hidden = true;
        }
    });

    let container = document.getElementById("network");
    let data = {
        nodes: nodes,
        edges: edges
    };
    let options = {
        physics: {
            barnesHut: {
                gravitationalConstant: -100,
                centralGravity: 0.0,
                springLength: 0,
                springConstant: 0.0,
                avoidOverlap: 1
            }
        },
        layout: {
            improvedLayout: true
        },
    };

    let network = new vis.Network(container, data, options);

    function showDetailedView(event) {
        if (event.nodes.length > 0) {
            let selectedNodeId = event.nodes[0];
            let selectedNodeEdges = allEdges.get(selectedNodeId);
            selectedNodeEdges.forEach(function (edge) {
                network.updateEdge(edge.edge.id, {
                    hidden: false,
                    label: edge.storedLabel,
                    arrows: edge.storedArrows,
                });
            });
        }
    }

    function showGeneralView(event) {
        if (event.previousSelection.nodes.length > 0) {
            let selectedNodeId = event.previousSelection.nodes[0];
            let selectedNodeEdges = allEdges.get(selectedNodeId);
            selectedNodeEdges.forEach(function (edge) {
                let edgeId = getUniqueEdgeId(edge.edge.from, edge.edge.to);
                let reverseEdgeId = getUniqueEdgeId(edge.edge.to, edge.edge.from);
                if (uniqueEdges.get(edgeId) !== edge && uniqueEdges.get(reverseEdgeId) !== edge.edge) {
                    network.updateEdge(edge.edge.id, {hidden: true});
                } else {
                    network.updateEdge(edge.edge.id, {label: "\n", arrows: "",});
                }
            });
        }
    }

    network.on("selectNode", showDetailedView);
    network.on("dragStart", showDetailedView);
    network.on("deselectNode", showGeneralView);
}