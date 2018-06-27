/**
 * Created by yanb on 2018/06/27
 */
;
$(function () {
    var width = window.innerWidth,
        height = window.innerHeight,
        circleWidth = 5,
        charge = -75,
        gravity = 0.1,
        flag,
        palette = {
            "lightgray": "#D9DEDE",
            "gray": "#C3C8C8",
            "mediumgray": "#536870",
            "orange": "#BD3613",
            "purple": "#595AB7",
            "yellowgreen": "#738A05"
        },
        colorChoose = [
            "#CFECF9",
            "#B6E5F9",
            "#9FE3F9",
            "#87DBF9",
            "#75D1F9",
            "#65C3F9",
            "#52B7F9",
            "#36A8F9",
            "#1e81f9"
        ],
        linkVal = [],
        nodes = [],
        numNodes = 125,
        links = [];
    for(var i=0;i<255;i++){
        linkVal.push(parseInt(Math.random()*1000))
    }
    for (var x = 0; x < numNodes; x++) {
        var targetAry = [];
        var connections = (Math.round(Math.random() * 5));
        for (var y = 0; y < connections; y++) {
            targetAry.push(Math.round(Math.random() * numNodes))
        }
        nodes.push({
            id: x,
            name: "Node " + x,
            target: targetAry,
            value:linkVal[x]
        })
    }
    for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].target !== undefined) {
            for (var j = 0; j < nodes[i].target.length; j++) {
                links.push({
                    source: nodes[i],
                    target: nodes[nodes[i].target[j]],
                    value:linkVal[i]
                })
            }
        }
    }

    var fdGraph = d3.select('#graphic')
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .call(
            d3.behavior.zoom()
                .scaleExtent([0.2, 4])
                .on("zoom", function (d) {
                    mapG.attr("transform",
                        'translate('+d3.event.translate+') scale('+d3.event.scale+')');
                })
        )
        .on("dblclick.zoom",null);
    var mapG = fdGraph.append("g")
        .attr("id","forceGroup");
    function updata(nodes,links) {
        var forceLayout = d3.layout.force()
            .nodes(nodes)
            .links([])
            .gravity(gravity)
            .charge(charge)
            .size([width, height]);

        var link = mapG
            .selectAll(".line").data(links).enter()
            .append("g")
            .attr("class","lineG")
            .on("mouseover",function (d) {
                d3.select(this).select(".line")
                    .attr('stroke-width', 2);
                d3.select(this).select(".lineText")
                    .attr("class","lineText")
            })
            .on("mouseout",function (d) {
                d3.select(this).select(".line")
                    .attr('stroke-width', 1);
                d3.select(this).select(".lineText")
                    .attr("class","lineText none");
            });
        link.append("line")
            .attr('stroke', function (d,i) {
                var customlinkVal = linkVal;
                var sortLinkVal = customlinkVal.sort(function (a,b) {
                    return a-b;
                });
                return colorChoose[Math.round(colorChoose.length*sortLinkVal.indexOf(d.value)/sortLinkVal.length)]
            })
            .attr('stroke-width', 1)
            .attr('class', function(d, i) {
                var theClass ='line_' + d.source.id + ' line';
                if(d.target !== undefined) {
                    theClass += ' to_' + d.target.id
                }
                return  theClass + " cursor"
            })
            .on("click",function (d) {
                console.log(d);
                console.log(this);
            });
        link.append("text")
            .attr("class","lineText none")
            .attr('font-size', '14')
            .attr('font-weight', 'bold')
            .attr("dy","1.5em")
            .text(function (d) {
                return d.value
            });
        var node = mapG
            .selectAll('.nodeCircle').data(nodes).enter()
            .append('g')
            .attr('id', function(d) { return 'node_' + d.id })
            .attr('class', 'nodeG')
            .on('mouseover', function(d) {
                d3.select(this).select('text')
                    .attr('font-size', '16')
                    .attr('font-weight', 'bold')
                    .attr("class","nodeText");
                d3.select(this).select('circle')
                    .attr('stroke-width', '2')
                    .attr('stroke',palette.lightgray);
                for(var i = 0; i < d.target.length; i++) {
                    d3.select('#node_' + d.target[i]).select('text')
                        .attr('font-size', '14')
                        .attr('font-weight', 'bold')
                        .attr("class","nodeText");
                }
                for(var x = 0; x < links.length; x++) {
                    if(links[x].target !== undefined) {
                        if(links[x].target.id === d.id) {
                            d3.selectAll('.to_' + links[x].target.id)
                                .attr('stroke-width', 2);
                            d3.select('#node_' + links[x].source.id).select('text')
                                .attr('font-size', '14')
                                .attr('font-weight', 'bold')
                                .attr("class","nodeText");
                        }
                    }
                }
                d3.selectAll('.line_' + d.id)
                    .attr('stroke-width', 2)
            })
            .on("mouseout",function (d) {
                d3.select(this).select('text')
                    .attr("class","nodeText none");
                d3.select(this).select('circle')
                    .attr('stroke-width', '')
                    .attr('stroke',"");
                for(var i = 0; i < d.target.length; i++) {
                    d3.select('#node_' + d.target[i]).select('text')
                        .attr("class","nodeText none");
                }
                d3.selectAll('.line')
                    .attr('stroke-width', 1);
                for(var x = 0; x < links.length; x++) {
                    if(links[x].target !== undefined) {
                        if(links[x].target.id === d.id) {
                            d3.selectAll('.to_' + links[x].target.id)
                                .attr('stroke-width', 1);
                            d3.select('#node_' + links[x].source.id).select('text')
                                .attr("class","nodeText none");
                        }
                    }
                }
            })
            .call(forceLayout.drag);
        node.append('circle')
            // .attr('cx', function(d) {
            //     return d.x
            // })
            // .attr('cy', function(d) {
            //     return d.y
            // })
            .attr('r', circleWidth)
            .attr('fill', function(d, i) {
                if(i%2){
                    return palette.yellowgreen
                }else {
                    return palette.purple
                }
            })
            .attr("class","nodeCircle cursor")
            .on("click",function (d) {
                console.log(d);
            })
            .on("dblclick",function (d) {
                if(flag){
                    if(d.id){
                        d3.selectAll(".lineG").remove();
                        d3.selectAll(".nodeG").remove();
                        var newTargetAry = [];
                        var newNumNodes = parseInt(Math.random() * 10);
                        var tempNodesLg = nodes.length;
                        for (var y = 0; y < newNumNodes; y++) {
                            newTargetAry.push(y + tempNodesLg + 1);
                            nodes.push({
                                id: y + tempNodesLg,
                                name: "Node" + (y + tempNodesLg),
                                target: [d.id]
                            })
                        }
                        for (var j = 0; j < newNumNodes; j++) {
                            if (nodes[tempNodesLg + j]) {
                                links.push({
                                    source: nodes[d.index],
                                    target: nodes[tempNodesLg + j],
                                    value: linkVal[tempNodesLg + j]
                                })
                            }
                        }
                        updata(nodes,links)
                    }
                }else {
                    d3.selectAll(".lineG").remove();
                    d3.selectAll(".nodeG").remove();
                    nodes = [];
                    nodes.push({
                        id: 0,
                        name: "Node0",
                        target: [1]
                    });
                    nodes.push({
                        id: 1,
                        name: "Node1",
                        target: [0]
                    });
                    links = [];
                    links.push({
                        source: nodes[0],
                        target: nodes[1],
                        value: linkVal[0]
                    });
                    updata(nodes,links);
                    flag = true;
                }});
        node.append('text')
            .text(function(d) {
                return d.name
            })
            .attr('font-size', '12')
            .attr("dy","1.5em")
            .attr("class","nodeText none");

        forceLayout.on('tick', function(e) {
            node.attr('transform', function(d, i) {
                return 'translate(' + d.x + ', ' + d.y + ')'
            });
            link.select(".lineText")
                .attr('dy', function(d){
                    if(d.target != undefined){
                        return (d.target.y-d.source.y)/2+d.source.y
                    }else {
                        return 0
                    }
                })
                .attr('dx',function(d){
                    if(d.target != undefined){
                        return (d.target.x-d.source.x)/2+d.source.x
                    }else {
                        return 0
                    }
                });
            link.select(".line")
                .attr('x1', function(d) {
                    return d.source.x
                })
                .attr('y1', function(d) {
                    return d.source.y
                })
                .attr('x2', function(d) {
                    if (d.target !== undefined) {
                        return d.target.x
                    } else {
                        return d.source.x
                    }
                })
                .attr('y2', function(d) {
                    if (d.target !== undefined) {
                        return d.target.y
                    } else {
                        return d.source.y
                    }
                })
        })
            .drag().on("dragstart",function (d) {
                if(flag){
                    d.fixed = true;
                }
                d3.layout.force().stop();
                d3.event.sourceEvent.stopPropagation();
        })
            .on("dragend",function (d,i) {
                d3.layout.force().tick();
                d3.layout.force().resume();
            })
            .on("drag",function (d) {
                d.px += d3.event.dx;
                d.py += d3.event.dy;
                d.x += d3.event.dx;
                d.y += d3.event.dy;
                d3.layout.force().tick();
            });
        forceLayout.start();
    }
    updata(nodes,links);


});