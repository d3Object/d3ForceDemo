/**
 * Created by yanb on 2018/06/27
 * 需要实现的功能：
 * 1、首次页面布局好看（d3自带 这也是吸引我用d3的原因）实现
 * 2、点的自定义属性 实现
 * 3、点的自定义颜色 实现
 * 4、点的自定义大小 实现
 * 5、点的自定义图片（可实现 此demo未做体现）
 * 6、点的mouseover事件 实现
 * 7、点的mouseout事件 实现
 * 8、点的dblclick事件 实现
 * 9、点的拖拽功能 实现
 * 10、点的自定义位置 不受力的作用（暂未研究）
 * 11、点的自定义文字 实现
 * 12、点的文字hover控制功能 实现
 * 13、线的自定义颜色 实现
 * 14、线的自定义粗细 实现
 * 15、线的自定义属性 实现
 * 16、线的箭头及其它形形状（可实现 此demo未做体现）
 * 17、线的流动性样式（未做研究）
 * 18、虚线（未做研究）
 * 19、曲线（未做研究）
 * 20、拆线（未做研究）
 * 21、贝塞尔曲线（未做研究）
 * 22、线的mouseover事件 实现
 * 23、线的mouseout事件 实现
 * 24、线的dblclick事件 实现
 * 25、线的自定义文字 实现
 * 26、根据连线值的大小渲染连线颜色的深浅功能 实现一半
 * 27、双击点增加新点并与之相连的功能 已实现但并不友好
 *   要求钻取点的时候不受力的作用自己定点的位置（暂不知如何实现）
 *
 * 28、清除所有的点线功能 完成
 * 29、鼠标缩放画布功能 完成
 * 30、鼠标拖动画布功能 完成
 * 31、拖动以及缩放画布后居中和还原缩放的功能（暂未实现）
 * 32、画布自适应浏览器大小变化重载功能（暂未实现）
 * 33、鹰眼功能（暂未实现）
 *  目前有两个功能特别重要且暂未实现！！！
 *  1、点线的保存带位置坐标重新请求此已保存数据并渲染到页面中的代码实现（我实现的时候点我可以控制 但是线不知道如何控制或者说不受控）
 *  2、点的钻取时不受力的作用力自定义位置的代码实现 （这个我是完全不知道该如何写）
 *
 *
 *
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
            // targetAry.push(Math.round(Math.random() * numNodes))
            targetAry.push(Math.round(Math.random() * (numNodes-1)))
        }
        if(!targetAry.length){
            targetAry.push(Math.round(Math.random() * (numNodes-1)))
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
                    .attr('stroke-width', 5);
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
                    .attr('stroke-width', '5')
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
                                .attr('stroke-width', 5);
                            d3.select('#node_' + links[x].source.id).select('text')
                                .attr('font-size', '14')
                                .attr('font-weight', 'bold')
                                .attr("class","nodeText");
                        }
                    }
                }
                d3.selectAll('.line_' + d.id)
                    .attr('stroke-width', 5)
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
            .on("mousedown",function (d) {
                if(flag){
                    console.log(d.x);
                    console.log(d.y);
                }
            })
            .on("mouseup",function (d) {
                if(flag){
                    console.log(d.x);
                    console.log(d.y);
                }
            })
            .call(forceLayout.drag);
        node.append('circle')
            .attr('cx', function(d,i,n) {
                if(flag){
                    // return d.x;
                }
                // return d.x;
            })
            .attr('cy', function(d,i,n) {
                if(flag){
                    // return d.y;
                }
                // return d.y;
            })
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
