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
 *  1、点线的保存带位置坐标重新请求此已保存数据并渲染到页面中的代码实现
 *  （我实现的时候点我可以控制 但是线不知道如何控制或者说不受控）
 *  2、点的钻取时不受力的作用力自定义位置的代码实现 （这个我是完全不知道该如何写）
 *
 *
 *
 *
 */
;
!function(){
    window.d3graph = new Object();
    var _this = window.d3graph;
    _this.options = {
        version:"1.0",
        elementID : "#element_id",
        style:{
            svgStyle:{
                class:'stage_svg',
                css:{
                    width:window.innerWidth,
                    height:window.innerHeight
                }
            },
            gStyle:{
                class:'stage_g',
                css:{}
            },
            lineStyle:{
                class:'link cursor',
                css:{}
            },
            nodeStyle:{
                class:'nodes cursor',
                attr:{
                    r:'5'
                },
                css:{}
            }
        },
        forc:{
            distance:200,
            collision:20,
            alpha:0.8,
            alphaTarget:0,
            alphaMin:0.005,
            velocityDecay:0.4,
            alphaDecay:0.02
        },
        datas:{
            nodes:[],
            edges:[]
        },
        palette : {
            "lightgray": "#D9DEDE",
            "gray": "#C3C8C8",
            "mediumgray": "#536870",
            "orange": "#BD3613",
            "purple": "#595AB7",
            "yellowgreen": "#738A05"
        },
        colorChoose :[
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
        stageEvent:{
            mousedown:function(d,i){
                // console.log("stage  mousedown");
            },
            mouseup:function(d,i){
                // console.log("stage mouseup");
            },
            mouseover:function(d,i){
                // console.log("stage mouseover");
            },
            mouseout:function(d,i){
                // console.log("stage mouseout");
            },
            click:function(d,i){
                // console.log("stage click");
            },
            dblclick:function(d,i){
                // console.log("stage dblclick");
            },
            contextmenu:function(d,i){
                // console.log("stage contextmenu");
                // d3.event.preventDefault();
            }
        },
        nodeEvent:{
            mousedown:function(d,i,n){
                console.log(d);
                _this.mouseDownNode = {
                    x:d.x,
                    y:d.y
                };
                // console.log("node mousedown");
            },
            mouseup:function(d,i,n){
                // console.log("node mouseup");
            },
            mouseover:function(d,i,n){
                d3.select(this).select('text')
                    .attr('font-size', '16')
                    .attr('font-weight', 'bold')
                    .attr("class","nodeText");
                d3.select(this).select('circle')
                    .attr('stroke-width', '5')
                    .attr('stroke',_this.options.palette.lightgray);
                for(var i = 0; i < d.target.length; i++) {
                    d3.select($(".nodeG")[d.target[i]]).select('text')
                        .attr('font-size', '14')
                        .attr('font-weight', 'bold')
                        .attr("class","nodeText");
                }
                for(var x = 0; x < d.target.length; x++) {
                    $("#"+d.index+"_"+d.target[x])
                        .attr('stroke-width', 5);
                }
            },
            mouseout:function(d,i,n){
                d3.select(this).select('text')
                    .attr("class","nodeText none");
                d3.select(this).select('circle')
                    .attr('stroke-width', '')
                    .attr('stroke',"");
                for(var i = 0; i < d.target.length; i++) {
                    // d3.select('#node_' + d.target[i]).select('text')
                    d3.select($(".nodeG")[d.target[i]]).select('text')
                        .attr("class","nodeText none");
                }
                d3.selectAll('.line')
                    .attr('stroke-width', 1);
                for(var x = 0; x < d.target.length; x++) {
                    $("#"+d.index+"_"+d.target[x])
                        .attr('stroke-width', 1);
                }
            },
            click:function(d,i,n){
                // console.log("node click");
            },
            dblclick:function(d,i,n){
                // console.log("node dblclick");
                d.center = true;
            },
            contextmenu:function(d,i,n){}
        },
        linkEvent :{
            mousedown:function(d,i,l){
                // console.log("link mousedown");
            },
            mouseup:function(d,i,l){
                // console.log("link mouseup");
            },
            mouseover:function(d,i,l){
                d3.select(this)
                    .attr('stroke-width', 5);
                $(this).next()
                    .attr("class","lineText")
            },
            mouseout:function(d,i,l){
                d3.select(this)
                    .attr('stroke-width', 1);
                $(this).next()
                    .attr("class","lineText none");
            },
            click:function(d,i,l){
                // console.log("link click");
            },
            dblclick:function(d,i,l){
                // console.log("link dblclick");
            },
            contextmenu:function(d,i,l){}
        }
    };
    _this.init=function(option){
        if(testObject(option)){
            $.extend(true, _this.options ,option);
        }
        _this.fdGraph = d3.select( _this.options.elementID)
            .append('svg')
            .attr('class', _this.options.style.svgStyle['class'])
            .attr('width', _this.options.style.svgStyle.width)
            .attr('height',  _this.options.style.svgStyle.height)
            .call(_this.d3css( _this.options.style.svgStyle.css ))
            .call(_this.zoom)
            .on("dblclick.zoom",null)
            .call(_this.d3event( _this.options.stageEvent));
        _this.mapG = _this.fdGraph.append("g")
            .attr('class', _this.options.style.gStyle['class'])
            .call(_this.d3css( _this.options.style.gStyle.css ))
            .call(_this.d3attr({
                "id":"forceGroup"
            }));
        return _this;
    };
    _this.zoom = d3.zoom().on("zoom",function(){_this.zoomed();});
    _this.zoomed=function(){
        _this.mapG.attr("transform", d3.event.transform);
    };
    _this.loadData=function(data){
        if( "object" === $.type(data) && testObject(data)){
            //添加新的节点数据，并根据id去重
            if(isnotarray(data.nodes) ){
                _this.options.datas.nodes =  ListUniq(ListAddList(_this.options.datas.nodes,data.nodes  ),'id');
            }
            //添加新的关系数据，并去重
            if(isnotarray(data.edges) ){
                _this.options.datas.edges =  ListUniq(ListAddList( _this.options.datas.edges,data.edges  ),[ 'fromID','toID'  ]);
            }
        }
        _this.removeAll();
        //重置数据索引
        _this.resetData();
        _this.force = d3.forceSimulation()  //力学模仿图
            .alpha(_this.options.forc.alpha)
            .nodes(_this.options.datas.nodes)
            .velocityDecay(_this.options.forc.velocityDecay)//衰减因子
            .alphaMin(_this.options.forc.alphaMin)
            .alphaDecay(_this.options.forc.alphaDecay)
            .alphaTarget( _this.options.forc.alphaTarget)
            .force("links", d3.forceLink(_this.options.datas.edges).distance(_this.options.forc.distance).id(function(d) { return d.index; }))
            .force("charge", d3.forceManyBody().strength(-50))          //force.charge - 取得或者设置电荷强度。
            .force("collision", d3.forceCollide(_this.options.forc.collision))     //控制相邻2点的排斥力度
            .force("center", d3.forceCenter(_this.options.style.svgStyle.css.width / 2,_this.options.style.svgStyle.css.height / 2));//设置力的中心

        _this.link = _this.mapG
            .selectAll(".lineG")
            .data(_this.options.datas.edges)
            .enter()
            .append("g")
            .attr("class","lineG");
        _this.link
            .append("line")
            .data(_this.options.datas.edges)
            .attr('class', _this.options.style.lineStyle['class'])
            .call(_this.d3css( _this.options.style.lineStyle.css ))
            .call(_this.d3attr({
                "stroke-width":"1",
                "stroke":"#65C3F9"
            }))
            .attr('id', function (d) {
                return d.source.index + '_' + d.target.index;
            })
            .call(_this.d3event( _this.options.linkEvent ));
        _this.link
            .append("text")
            .attr("class","lineText none")
            .attr('font-size', '14')
            .attr('font-weight', 'bold')
            .attr("dy","1.5em")
            .text(function(d) { return String(d.value) || '' });
        // .append('avg:textPath')
        // .attr("onselectstart","return false;" )
        // .attr("startOffset", "50%")
        // .attr("xlink:href", function(d) {
        // 	if (d.source.index === d.target.index) {
        // 		return false;
        // 	} else {
        // 		return "#" + d.source.index + "_" + d.target.index;
        // 	}
        // });
        _this.node = _this.mapG
            .selectAll(".nodeG")
            .data(_this.options.datas.nodes)
            .enter()
            .append("g")
            .attr("class","nodeG")
            .call(_this.d3event( _this.options.nodeEvent))
            .call(_this.nodeDrag);
        _this.node
            .append("circle")
            .attr('class', _this.options.style.nodeStyle['class'])
            .attr("fill",function (d,i) {
                if(i%2){
                    return _this.options.palette.yellowgreen
                }else {
                    return _this.options.palette.purple
                }
            })
            .call(_this.d3css( _this.options.style.nodeStyle.css ))
            .call(_this.d3attr( _this.options.style.nodeStyle.attr));
        _this.node
            .append('text')
            .attr('font-size', '12')
            .attr("dy","1.5em")
            .attr("class","nodeText none")
            .text(function(d){
                return d.name || "" ;
            });
        _this.startSport();
        return  _this;
    };
    _this.dragstart=function(d, i) {
        // if (!d3.event.active)  _this.force.alphaTarget(0.5).restart();
        // d.fx = d.x;
        // d.fy = d.y;
        if(!d3.event.active){
            _this.force.alphaTarget(0.5).restart();
            d.fx = d.x;
            d.fy = d.y;
        }
    };
    _this.dragmove=function(d, i) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    };
    _this.dragend=function(d, i) {
        //d.fixed = true;    //拖拽开始后设定被拖拽对象为固定
        if (!d3.event.active){
            _this.force.alphaTarget(0);
        }
        //_this.force.stop();
        if(d3.event.sourceEvent.type == "mouseup"){
            console.log(d);
            if(d.center){
                var x1 = _this.mouseDownNode.x - d.x,
                    y1 = _this.mouseDownNode.y - d.y,
                    centerNum = 0,
                    _tIndex = 0;
                for(var i = 0;i<d.target.length;i++){
                    for(j = 0;j<_this.options.datas.nodes.length;j++){
                        if(d.target[i] == _this.options.datas.nodes[j].id && _this.options.datas.nodes[j].center){
                            centerNum += 1;
                        }
                    }
                }
                console.log(centerNum);
                for(var i = 0;i<d.target.length;i++){
                    for(j = 0;j<_this.options.datas.nodes.length;j++){
                        if(d.target[i] == _this.options.datas.nodes[j].id && !_this.options.datas.nodes[j].center){
                            /**
                             * 此处应该继续调圆
                             * @type {number}
                             */
                            // _this.options.datas.nodes[j].x += x1;
                            // _this.options.datas.nodes[j].fx += x1;
                            // _this.options.datas.nodes[j].y += y1;
                            // _this.options.datas.nodes[j].fy += y1;
                            console.log(d.target.length-centerNum);
                            _this.options.datas.nodes[j].x = _this.LocationXy(_tIndex,d.x,d.y,(d.target.length-centerNum),100).x;
                            _this.options.datas.nodes[j].fx = _this.LocationXy(_tIndex,d.x,d.y,(d.target.length-centerNum),100).x;
                            _this.options.datas.nodes[j].y = _this.LocationXy(_tIndex,d.x,d.y,(d.target.length-centerNum),100).y;
                            _this.options.datas.nodes[j].fy = _this.LocationXy(_tIndex,d.x,d.y,(d.target.length-centerNum),100).y;
                            _tIndex +=1;
                            // console.log(j);
                            // console.log(_this.options.datas.nodes[j].x);
                            // console.log(_this.options.datas.nodes[j].y);
                        }
                    }
                }
                console.log(_this.options.datas);
                d3graph.loadData(_this.options.datas);
            }
        }
    };
    _this.nodeDrag = d3.drag()
        .on("start", _this.dragstart)
        .on("drag", _this.dragmove)
        .on("end", _this.dragend);
    _this.startSport=function(){
        _this.force.on("tick", _this.tick);
    };
    _this.tick=function() {
        _this.node.attr('transform', function(d, i) {
            return 'translate(' + d.x + ', ' + d.y + ')'
        });
        _this.link.select("text")
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
        _this.link.select("line")
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
            });
        _this.node.attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });
    };
    _this.removeAll=function(){
        _this.mapG.html("");
        return  _this;
    };
    _this.resetData=function(){
        var index = 0;
        if( isnotarray( _this.options.datas.nodes) ) {
            for(var j=0,k = _this.options.datas.nodes.length ;j<k;j++){
                _this.options.datas.nodes[j].index = j;
            }
            index =  _this.options.datas.nodes.length;
        }
        if(isnotarray( _this.options.datas.edges)) {
            for(var j=0,k=_this.options.datas.edges.length;j<k;j++){
                if( isnotarray( _this.options.datas.nodes) ) {
                    for(var i=0,m = _this.options.datas.nodes.length;i<m;i++){
                        if(_this.options.datas.edges[j].fromID === _this.options.datas.nodes[i].id) {
                            _this.options.datas.edges[j].source = _this.options.datas.nodes[i].index;
                        }
                        if(_this.options.datas.edges[j].toID === _this.options.datas.nodes[i].id) {
                            _this.options.datas.edges[j].target = _this.options.datas.nodes[i].index;
                        }
                        _this.options.datas.edges[j].uid = _this.options.datas.edges[j].source + "_" + _this.options.datas.edges[j].target ;
                    }
                }
            }
        }
        //清理断开的关系线
        for(var j=0;j<_this.options.datas.edges.length;j++){
            if( null !== _this.options.datas.edges[j].target && null !==  _this.options.datas.edges[j].source ){

            }else{
                _this.options.datas.edges = arraydelbyindex(_this.options.datas.edges,j );
                j--;
            }
        }
        return _this;
    };
    _this.d3css=function(value){
        function d3css(selection){
            if( testObject(selection)){
                if( 'object' == $.type(value) &&  testObject(value)){
                    for( var key in value ){
                        selection.style(key,value[key] );
                    }
                }
            }
        }
        return d3css;
    };
    _this.d3attr=function(value){
        function d3attr(selection){
            if( testObject(selection)){
                if( 'object' == $.type(value) &&  testObject(value)){
                    for( var key in value ){
                        selection.attr(key,value[key] );
                    }
                }
            }
        }
        return d3attr;
    };
    _this.d3event=function(value){
        function d3event(selection){
            if( testObject(selection)){
                if( 'object' == $.type(value) &&  testObject(value)){
                    for( var key in value ){
                        selection.on(key,value[key] );
                    }
                }
            }
        }
        return d3event;
    };
    _this.flag = false;
    _this.mouseDownNode = undefined;
    function testObject(obj){
        var flag = false;
        if(null !== obj && ""  !== obj){
            flag=true;
        }
        return flag;
    }
    /**
     * 数组去重
     * @param list
     * @param key 去重依据属性(字符串,字符串数组)
     * @returns {Array}
     */
    function ListUniq (list,key){
        var rs = [],keys={} ;
        if("array" == $.type(list)){
            $(list).each(function(){
                if($.inArray( this ,rs)<0 ){
                    if( null != key && "" != key  && 'object' == $.type( this)  ){
                        if( 'string' == $.type( key)  ){
                            if( !keys[this[key]] ){
                                rs.push(this);
                                keys[this[key]] = true;
                            }
                        }else if( 'array' == $.type( key)  ){
                            var temp = "";
                            for(var q =0,w=key.length;q<w;q++){
                                temp+=this[key[q]]||'_';
                            }
                            if( !keys[temp] ){
                                rs.push(this);
                                keys[temp] = true;
                            }
                        }
                    }else{
                        rs.push(this);
                    }
                }

            });
        }
        return rs;
    }
    /**
     * 将数组添加到另一数组中,未去重
     * @param list1
     * @param list2
     * @returns {Array}
     */
    function ListAddList(list1,list2){
        var arr = [];
        if("array"== $.type(list1) && "array"== $.type(list2)){
            arr = list1.concat(list2);
        }
        return arr;
    }
    /**
     * 将数组添加到另一数组中,去重
     * @param list1
     * @param list2
     * @returns {Array}
     */
    function  ListAddListUniq(list1,list2){
        var arr = [];
        if("array"== $.type(list1) && "array"== $.type(list2)){
            arr = list1.concat(list2);
            arr = ListUniq(arr);
        }
        return arr;
    }
    function isnotarray(list){
        var rs = false;
        if($.isArray(list)){
            if(list.length>0){
                rs = true;
            }
        }
        return rs;
    }
    function arraydelbyindex(arr,n){
        if("array" == $.type(arr) && n>=0 ){
            return arr.slice(0,n).concat(arr.slice(n+1,arr.length));
        }
        return arr;
    }

    /**
     *
     * @param i
     * @param centerPointX
     * @param centerPointY
     * @param Num
     * @param cicR
     * @returns {{x: *, y: *}}
     * @constructor
     */
    _this.LocationXy = function (i,centerPointX,centerPointY,Num,cicR) {
        /**
         *﻿﻿
         圆点坐标：(x0,y0)
         半径：r
         角度：a0
         则圆上任一点为：（x1,y1）
         x1   =   x0   +   r   *   cos(ao   *   3.14   /180   )
         y1   =   y0   +   r   *   sin(ao   *   3.14   /180   )
         *
         */
        var angle = 360/Num,
            hudu = (2*Math.PI/360) * angle * (i+1),
            x = centerPointX + Math.sin(hudu) * cicR,
            y = centerPointY + Math.cos(hudu) * cicR;
        return {
            x:x,
            y:y
        }
    }

}();
