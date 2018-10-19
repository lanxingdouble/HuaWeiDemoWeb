let startData = {
    "nodes": [],
    "relationships": []
};
let labelProperty = [];
let all_labels_color = ["Software Concept", "Descriptive Knowledge", "API Concept", "API Package", "API Class", "API Interface", "API Field", "API Method", "API Parameter", "API Return Value", "Exception"];
var labelList = [];
var labelStatusList = [];
var relationStatusList = [];
var nodesAndRelations = [];
var relationList = [];
var labels_set = [];
var color_index = 0;
var search_type=0;
// var id1;
// var id2;
// var id3;
// var id4;
// var id5;
let neo4jd3 = new Neo4jD3('#GraphContainer', {
    D3Data: startData,
    zoomFit: false,
    infoPanel: true,
    infoPanelSelector: "#flowPanel",
    onNodeDoubleClick: onNodeDoubleClick,
    onNodeClick: onNodeClick,
    icons: {
        'Api': 'gear',
        'Cookie': 'paw',
        'Email': 'at',
        'Git': 'git',
        'Github': 'github',
        'Google': 'google',
        'Ip': 'map-marker',
        'Issues': 'exclamation-circle',
        'Language': 'language',
        'Options': 'sliders',
        'Password': 'lock',
        'Phone': 'phone',
        'Project': 'folder-open',
        'SecurityChallengeAnswer': 'commenting',
        'User': 'user',
        'zoomFit': 'arrows-alt',
        'zoomIn': 'search-plus',
        'zoomOut': 'search-minus'
    },
    images: {
        'wikidata': 'img/twemoji/1f3e0.svg',
        'entity': 'img/twemoji/1f382.svg',
        'Cookie': 'img/twemoji/1f36a.svg',
        'CreditCard': 'img/twemoji/1f4b3.svg',
        'Device': 'img/twemoji/1f4bb.svg',
        'Email': 'img/twemoji/2709.svg',
        'Git': 'img/twemoji/1f5c3.svg',
        'Github': 'img/twemoji/1f5c4.svg',
        'icons': 'img/twemoji/1f38f.svg',
        'Ip': 'img/twemoji/1f4cd.svg',
        'Issues': 'img/twemoji/1f4a9.svg',
        'Language': 'img/twemoji/1f1f1-1f1f7.svg',
        'Options': 'img/twemoji/2699.svg',
        'Password': 'img/twemoji/1f511.svg',
        'Project': 'img/twemoji/2198.svg',
        'Project|name|neo4jd3': 'img/twemoji/2196.svg',
        'User': 'img/twemoji/1f600.svg'
    },
});

//获取当前节点的label,加至label_list
function getLabelSet(labels) {
    if (labels) {
        for (let i = 0; i < labels.length; i++) {
            if ($.inArray(labels[i], labelList) === -1) {
                for (let j = 0; j < labelProperty.length; j++) {
                    if (labels[i] === labelProperty[j].name) {
                        let data = {
                            name: labels[i],
                            color: labelProperty[j].color
                        };
                        $("#labelTemplate").tmpl(data).appendTo("#labelList");
                        labelList.push(labels[i]);
                    }
                }

            }
        }
    }

}


//获取节点
function get_expand_nodes(kg_id) {
    $.ajax({
        async: true,
        url: "http://bigcode.fudan.edu.cn/dysd3/expandNode/",
        type: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"id": kg_id}),
        error: function (xhr, status, errorThrown) {
            console.log("Error " + errorThrown);
            console.log("Status: " + status);
            console.log(xhr);
        },
        success: function (d) {
            if (d === "fail") {
                return
            }
            var labels = [];
            $.each(d.nodes, function (i, val) {
                labels.push(d.nodes[i]["labels"][0]);
            });
            //console.log("labels:", labels);
            labels_set = new Set(labels);
            //console.log("labels_set", labels_set);
            for (var value of labels_set) {
                var color_label = {};
                color_index=all_labels_color.indexOf(value);
                //console.log("color index : ",color_index);
                color_label["color"] = generateRandomColor(color_index);
                color_label["name"] = value;
                //console.log("color_label", color_label);
                //console.log(labelProperty);
                //console.log(labelProperty.push("@@@@@@@@@@@@@@2"));
                labelProperty.push(color_label);
                // color_index += 1;
            }
            //console.log("labelProperty:", labelProperty);
            neo4jd3.cleanGraph();
            $.each(d.nodes, function (i, val) {
                // if(d.nodes[i]["labels"][0]=="API Method") {
                //     d.nodes[i]["name"] = get_simple_name(d.nodes[i]["name"]);
                // }
                d.nodes[i]["x"] = $("#GraphContainer").width() / 2;
                d.nodes[i]["y"] = $("#GraphContainer").height() / 2;
                getLabelSet(val.labels);
                getLabelStatusList(val.labels);
            });
            let new_nodes = d.nodes;
            let new_relations = [];
            for (let relation of d.relations) {
                let new_relation = {};
                new_relation["id"] = relation.id;
                new_relation["source"] = relation.start_id;
                new_relation["target"] = relation.end_id;
                new_relation["startNode"] = relation.start_id;
                new_relation["endNode"] = relation.end_id;
                new_relation["type"] = relation.name;
                new_relation["properties"] = {};
                if(relation.start_id!= relation.end_id) {
                    new_relations.push(new_relation);
                }
            }
            //console.log("第一次加载new_relations:",new_relations);
            let D3Data = {
                "nodes": new_nodes,
                "relationships": new_relations
            };
            neo4jd3.updateWithD3Data(D3Data);
            neo4jd3.nodesColor();
            nodesAndRelations.push(D3Data);
            console.log("第一次加载nodeandrelation :",nodesAndRelations);
            //console.log("加载时labelstuteliae:",labelStatusList);
            console.log(d);
        }
    });
}

//双击扩展节点
function onNodeDoubleClick(d) {
    let nodeID = d.id;
    let dx = d.x;
    let dy = d.y;
    let parametersJson = {"id": nodeID};
    $.ajax({
        url: "http://bigcode.fudan.edu.cn/dysd3/expandNode/",
        type: "post",
        data: JSON.stringify(parametersJson),
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        error: function (xhr, status, errorThrown) {
            // alert("ERROR");
            // alert("Error: " + errorThrown);
            // alert("Status: " + status);
            console.log(xhr);
        },
        success: function (d) {
            if (d === "fail") {
                return
            }
            var labels = []
            $.each(d.nodes, function (i, val) {
                if (!labels_set.has(d.nodes[i]["labels"][0])) {
                    labels_set.add(d.nodes[i]["labels"][0]);
                    var color_label = {};
                    color_index = all_labels_color.indexOf(d.nodes[i]["labels"][0]);
                    color_label["color"] = generateRandomColor(color_index);
                    color_label["name"] = d.nodes[i]["labels"][0];
                    //console.log("color_label", color_label);
                    labelProperty.push(color_label);
                    //color_index += 1;
                }
            });
            //console.log("labelProperty:", labelProperty);
            $.each(d.nodes, function (i, val) {
                // if(d.nodes[i]["labels"][0]=="API Method") {
                //     d.nodes[i]["name"] = get_simple_name(d.nodes[i]["name"]);
                // }
                d.nodes[i]["x"] = dx;
                d.nodes[i]["y"] = dy;
                getLabelSet(val.labels);
                getLabelStatusList(val.labels);
            });
            let new_nodes = d.nodes;
            let new_relations = [];
            for (let relation of d.relations) {
                let new_relation = {};
                new_relation["id"] = relation.id;
                new_relation["source"] = relation.start_id;
                new_relation["target"] = relation.end_id;
                new_relation["startNode"] = relation.start_id;
                new_relation["endNode"] = relation.end_id;
                new_relation["type"] = relation.name;
                new_relation["properties"] = {};
                if(relation.start_id!= relation.end_id) {
                    new_relations.push(new_relation);
                }
            }
            //console.log("扩展new_relations:",new_relations);
            //修复双击扩展后不能选择label的bug，因为有部分["source"]["target"],不是节点
            for (var i = 0; i < new_relations.length; i++) {
                //console.log(new_relations[i]);
                //console.log(i,typeof(new_relations[i]["source"]));
                if (typeof(new_relations[i]["source"]) == "number") {
                    for (var j = 0; j < new_nodes.length; j++) {
                        if (new_nodes[j]["id"] == new_relations[i]["source"]) {
                            new_relations[i]["source"] = new_nodes[j];
                            break;
                        }
                    }
                    for (var j = 0; j < new_nodes.length; j++) {
                        if (new_nodes[j]["id"]==new_relations[i]["target"]) {
                            new_relations[i]["target"] = new_nodes[j];
                            break;
                        }
                    }
                }
            }
            //console.log("扩展改后new_relations:",new_relations);
            let D3Data = {
                "nodes": new_nodes,
                "relationships": new_relations
            };
            console.log("D3Data:", D3Data);
            nodesAndRelations.push(D3Data);
            neo4jd3.updateWithD3Data(D3Data);
            //getRelationStatusList(d.relations);
            neo4jd3.nodesColor();
            //getRelationSet(d.relations);
            //getRelationStatusList(d.relations);
            repaintNodes();//修复被双击点拖动后点和关系脱离的bug
            //console.log("扩展nodeandrelation :",nodesAndRelations);
            //console.log("click expand node: ",d);
        }
    });

}

function onNodeClick(d) {
    $("#flowPanel").show();
    let nodeID = d.id;
    let hide = "<b><i onclick=hide_flow_panel()><span class='glyphicon glyphicon-arrow-right'></span>Click to hide</i></b><br>";

    currentnodeID = nodeID;
    currentnodeX = d.x;
    currentnodeY = d.y;

    if (neo4jd3) {
        neo4jd3.updateInfo(d);
    }
    $("#flowPanel").prepend(hide);
    $("#flowPanel").fadeIn();
}

function hide_flow_panel() {
    var getDisplay = $("#flowPanel").css('display');
    if (getDisplay != "none") {
        $("#flowPanel").css('display', 'none');
    }
}

function click_for_result() {
    labelProperty = [];
    labelList = [];
    labelStatusList = [];
    relationStatusList = [];
    nodesAndRelations = [];
    relationList = [];
    labels_set = [];
    $("#labelList").html("");
    $("#searchresult").html("");
    $(".showGroup").css('display', 'none');
    $("#searchresult").css('display', 'none');
    $("#Graph").css('display', 'none');
    //判断搜索方式
    if(search_type==0) {
        var query = {
            "name": $(".cat_header input").val(),
            "clone_from": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(0).children("li").eq(1).attr("id")),
            "related_developer": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(1).children("li").eq(1).attr("id")),
            "call_same_common_api": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(2).children("li").eq(1).attr("id")),
            "from_project": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(3).children("li").eq(1).attr("id")),
            "concept": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(4).children("li").eq(1).attr("id"))
        }
        // console.log("@@@@@@@@@@@@@@@",isNaN(query["clone_from"]));
        if(isNaN(query["clone_from"])){
            console.log("@@@@@@@@@@@@@@@");
            query["clone_from"]=-1;
        }
        if(isNaN(query["related_developer"])){
            query["related_developer"]=-1;
        }
        if(isNaN(query["call_same_common_api"])){
            query["call_same_common_api"]=-1;
        }
        if(isNaN(query["from_project"])){
            query["from_project"]=-1;
        }
        if(isNaN(query["concept"])){
            query["concept"]=-1;
        }
        console.log("query: ",query);
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/MethodSearch/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": query}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
                alert("error,can't find result");
            },
            success: function (d) {
                if (d.length > 0) {
                    get_expand_nodes(d[0].kg_id);
                    console.log("api concept:" + d);
                    $(".showGroup").show();
                    $("#searchresult").show();
                    $("#Graph").show();
                    $("#method_search_script").tmpl(d).appendTo("#searchresult");
                } else {
                    alert("can't find result");
                }
            }
        });
    }else if(search_type==1){
        var query = {
            "name": $(".cat_header input").val(),
            "concept": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(0).children("li").eq(1).attr("id")),
            "solver": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(1).children("li").eq(1).attr("id")),
            "reporter": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(2).children("li").eq(1).attr("id")),
            "has_solve":2
        }
        if(isNaN(query["concept"])){
            query["concept"]=-1;
        }
        if(isNaN(query["solver"])){
            query["solver"]=-1;
        }
        if(isNaN(query["reporter"])){
            query["reporter"]=-1;
        }
        console.log("query: ",query);
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/IssueSearch/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": query}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
                alert("error,can't find result");
            },
            success: function (d) {
                if (d.length > 0) {
                    get_expand_nodes(d[0].kg_id);
                    console.log("api concept:" + d);
                    $(".showGroup").show();
                    $("#searchresult").show();
                    //$("#Graph").show();
                    $("#method_search_script").tmpl(d).appendTo("#searchresult");
                } else {
                    alert("can't find result");
                }
            }
        });
    }else{
        var query = {
            "name": $(".cat_header input").val(),
            "concept": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(0).children("li").eq(1).attr("id")),
            "solve_issue": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(1).children("li").eq(1).attr("id")),
            "report_issue": parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(2).children("li").eq(1).attr("id")),
            "joint_project":parseInt($(".cat_header .cat_list").children(".float").children(".clearfix").eq(3).children("li").eq(1).attr("id")),
        }
        if(isNaN(query["solve_issue"])){
            query["solve_issue"]=-1;
        }
        if(isNaN(query["report_issue"])){
            query["report_issue"]=-1;
        }
        if(isNaN(query["joint_project"])){
            query["joint_project"]=-1;
        }
        console.log("query: ",query);
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/ReporterSearch/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": query}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
                alert("error,can't find result");
            },
            success: function (d) {
                if (d.length > 0) {
                    get_expand_nodes(d[0].kg_id);
                    console.log("api concept:" + d);
                    $(".showGroup").show();
                    $("#searchresult").show();
                    //$("#Graph").show();
                    $("#method_search_script").tmpl(d).appendTo("#searchresult");
                } else {
                    alert("can't find result");
                }
            }
        });
    }
}



function navigation_bar_style_change(item, index) {
    // $("#nav .w li").css("background","#00a1ea");
    // $("#nav .w li").css("color","#ffffff");
    // $(item).css("background","#fff000");
    // $(item).css("color","#00a1ea");
    $("#nav .w li").removeClass('active');
    $(item).addClass('active');
    $('.cat_wrap .cat_list').html("");
    d = [{"name": "ewqf"}];
    search_type=index;
    if (index == 0) {
        $("#api_concept_bar_script").tmpl(d).appendTo('.cat_wrap .cat_list');
        $('.cat_subcont').html("");
        $("#api_concept_cat_subcont_bar_script").tmpl(d).appendTo('.cat_subcont');
        mouseon();
    } else if (index == 1) {
        $("#issue_bar_script").tmpl(d).appendTo('.cat_wrap .cat_list');
        $('.cat_subcont').html("");
        $("#issue_cat_subcont_bar_script").tmpl(d).appendTo('.cat_subcont');
        mouseon();
    } else {
        $("#developer_bar_script").tmpl(d).appendTo('.cat_wrap .cat_list');
        $('.cat_subcont').html("");
        $("#developer_cat_subcont_bar_script").tmpl(d).appendTo('.cat_subcont');
        mouseon();
    }
}


//搜索按钮事件
function jumpClick() {
    labelProperty = [];
    labelList = [];
    labelStatusList = [];
    relationStatusList = [];
    nodesAndRelations = [];
    relationList = [];
    labels_set = [];
    $("#labelList").html("");
    $("#searchresult").html("");
    $(".showGroup").css('display', 'none');
    $("#searchresult").css('display', 'none');
    $("#Graph").css('display', 'none');
    var search_type = parseInt($('#search_type option:selected').val());
    var textvalue = $("input[class='form-control']").val();
    if (textvalue.length > 0) {
        //判断搜索方式
        if (search_type == 1) {
            $.ajax({
                async: true,
                url: "http://bigcode.fudan.edu.cn/dysd3/MethodSearch/",
                type: "post",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"query": textvalue}),
                error: function (xhr, status, errorThrown) {
                    console.log("Error " + errorThrown);
                    console.log("Status: " + status);
                    console.log(xhr);
                    alert("can't find result");
                },
                success: function (d) {
                    if (d.length > 0) {
                        get_expand_nodes(d[0].kg_id);
                        console.log("api concept:" + d);
                        $(".showGroup").show();
                        $("#searchresult").show();
                        $("#Graph").show();
                        $("#method_search_script").tmpl(d).appendTo("#searchresult");
                    } else {
                        alert("can't find result");
                    }
                }
            });
        } else if (search_type == 2) {
            $.ajax({
                async: true,
                url: "http://bigcode.fudan.edu.cn/dysd3/IssueQuery/",
                type: "post",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"query": textvalue}),
                error: function (xhr, status, errorThrown) {
                    console.log("Error " + errorThrown);
                    console.log("Status: " + status);
                    console.log(xhr);
                },
                success: function (d) {
                    if (d.length > 0) {
                        get_expand_nodes(d[0].kg_id);
                        console.log("issue:" + d);
                        $(".showGroup").show();
                        $("#searchresult").show();
                        $("#Graph").show();
                        $("#issue_search_script").tmpl(d).appendTo("#searchresult");
                    } else {
                        alert("can't find result");
                    }
                }
            });

        } else {
            $.ajax({
                async: true,
                url: "http://bigcode.fudan.edu.cn/dysd3/DeveloperQuery/",
                type: "post",
                contentType: "application/json; charset=utf-8",
                data: JSON.stringify({"query": textvalue}),
                error: function (xhr, status, errorThrown) {
                    console.log("Error " + errorThrown);
                    console.log("Status: " + status);
                    console.log(xhr);
                },
                success: function (d) {
                    if (d.length > 0) {
                        get_expand_nodes(d[0].kg_id);
                        console.log("developer:" + d);
                        $(".showGroup").show();
                        $("#searchresult").show();
                        $("#Graph").show();
                        $("#developer_search_script").tmpl(d).appendTo("#searchresult");
                    } else {
                        alert("can't find result");
                    }
                }
            });
        }
    } else {
        $("#searchresult").html("");
        $(".showGroup").css('display', 'none');
        $("#searchresult").css('display', 'none');
        $("#Graph").css('display', 'none');
        alert("empty input");
    }
}

//输入框判断回车
function keyup_submit(e) {
    var evt = window.event || e;
    if (evt.keyCode == 13) {
        jumpClick();
    }
}

//添加labelStatueList
function getLabelStatusList(labels) {
    if (labels) {
        for (let i = 0; i < labels.length; i++) {
            let flag = true;
            for (let j = 0; j < labelStatusList.length; j++) {
                if (labels[i] === labelStatusList[j].name) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                let temp = {};
                temp["name"] = labels[i];
                temp["status"] = true;
                labelStatusList.push(temp);
            }

        }
    }
}

function getRelationStatusList(relations) {
    if (relations) {
        for (let i = 0; i < relations.length; i++) {
            let flag = true;
            for (let j = 0; j < relationStatusList.length; j++) {
                if (relations[i] === relationStatusList[j].name) {
                    flag = false;
                    break;
                }
            }
            if (flag) {
                let temp = {};
                temp["name"] = relations[i];
                temp["status"] = true;
                relationStatusList.push(temp);
            }
        }

    }
}

let inputType = "search";

$("#SX").click(function () {
    neo4jd3.nodesData()
});

function keyDown() {
    if (event.keyCode == 46) deletaNode();
}

document.onkeydown = keyDown;

function deletaNode() {
    if (currentnodeID === "-1") {
        return alert("Please choose a node!")
    }

    neo4jd3.removeNodeAndRelationshipsByNodeID(currentnodeID);
    $("#flowPanel").html("<span>You can cilck the node to know about the information about it.<br>The information you want to know will display here.</span>");
}

//选择label
function labelCheckClick(name) {
    //console.log("前labelStatusList: ",labelStatusList);
    let checkName = "label-" + name;
    /*    console.log(checkName);
        console.log(document.getElementById(checkName));
        console.log(document.getElementById(checkName).checked);*/
    if (document.getElementById(checkName).checked) {
        changeLabelStatus(name, true);
        repaintNodes();
    } else {
        changeLabelStatus(name, false);
        repaintNodes();
    }
}

function repaintNodes() {
    //console.log("画点repaintNodes @@@ nodesAndRelations" ,nodesAndRelations);
    let originTypeList = getRelationTypes(nodesAndRelations);
    neo4jd3.cleanGraph();
    let tempNR = cloneObj(nodesAndRelations);
    //console.log("画点labelStatusList :",labelStatusList);
    for (let i = 0; i < labelStatusList.length; i++) {
        for (let j = 0; j < tempNR.length; j++) {
            for (let k = 0; k < tempNR[j].relationships.length; k++) {
                let source = tempNR[j].relationships[k].source;
                let target = tempNR[j].relationships[k].target;
                // console.log("source labels :", k ,source.labels);
                if (labelStatusList[i].status === false && (labelStatusList[i].name === source.labels[0] || labelStatusList[i].name === target.labels[0])) {
                    tempNR[j].relationships.splice(k, 1);
                    k = k - 1;
                }

            }
        }
    }
    for (let i = 0; i < labelStatusList.length; i++) {
        for (let j = 0; j < tempNR.length; j++) {
            for (let k = 0; k < tempNR[j].nodes.length; k++) {
                let labels = tempNR[j].nodes[k].labels;
                if (labelStatusList[i].status === false && labelStatusList[i].name === labels[0]) {
                    tempNR[j].nodes.splice(k, 1);
                    k = k - 1;
                }
            }
        }

    }

    let newTypeList = getRelationTypes(tempNR);
    //console.log(newTypeList);

    changeRelationCheckboxStatus(originTypeList, newTypeList);

    //repaintEntityList(tempNR);

    for (let i = 0; i < tempNR.length; i++) {
        for (let j = 0; j < tempNR[i].relationships.length; j++) {
            let new_relation = {};
            new_relation["id"] = tempNR[i].relationships[j].id;
            new_relation["source"] = tempNR[i].relationships[j].startNode;
            new_relation["target"] = tempNR[i].relationships[j].endNode;
            new_relation["startNode"] = tempNR[i].relationships[j].startNode;
            new_relation["endNode"] = tempNR[i].relationships[j].endNode;
            new_relation["type"] = tempNR[i].relationships[j].type;
            new_relation["properties"] = {};
            tempNR[i].relationships.splice(j, 1, new_relation);
        }
    }

    for (let i = 0; i < tempNR.length; i++) {
        console.log("repaint node:", tempNR);
        neo4jd3.updateWithD3Data(tempNR[i]);
    }
    //console.log("画点nodesAndRelations： ",nodesAndRelations);
}

function cloneObj(obj) {
    let str, newobj = obj.constructor === Array ? [] : {};
    if (typeof obj !== 'object') {
        return;
    } else if (window.JSON) {
        str = JSON.stringify(obj); //系列化对象
        newobj = JSON.parse(str); //还原
    } else {
        for (let i in obj) {
            newobj[i] = typeof obj[i] === 'object' ?
                cloneObj(obj[i]) : obj[i];
        }
    }
    return newobj;
}

function changeLabelStatus(label, status) {
    for (let i = 0; i < labelStatusList.length; i++) {
        if (labelStatusList[i].name === label) {
            labelStatusList[i].status = !labelStatusList[i].status;
            return;
        }
    }
    //console.log("labelStatusList+++: ",labelStatusList);
    let temp = {};
    temp["name"] = label;
    temp["status"] = status;
    labelStatusList.push(temp);
    //console.log("labelStatusList___: ",labelStatusList);
}

function changeRelationStatus(relation, status) {
    for (let i = 0; i < relationStatusList.length; i++) {
        if (relationStatusList[i].name === relation) {
            relationStatusList[i].status = !relationStatusList[i].status;
            return;
        }
    }
    let temp = {};
    temp["name"] = relation;
    temp["status"] = status;
    relationStatusList.push(temp);
}

function getRelationTypes(nodesAndRelations) {
    let type_list = [];
    for (let i = 0; i < nodesAndRelations.length; i++) {
        for (let j = 0; j < nodesAndRelations[i].relationships.length; j++) {
            if ($.inArray(nodesAndRelations[i].relationships[j].type, type_list) === -1) {
                type_list.push(nodesAndRelations[i].relationships[j].type);
            }
        }
    }
    return type_list;
}

function changeRelationCheckboxStatus(originTypes, newTypes) {
    for (let i = 0; i < originTypes.length; i++) {
        let relationCheckboxName = "relation-" + originTypes[i];
        if ($.inArray(originTypes[i], newTypes) === -1) {
            // $(relationCheckboxName).attr("checked", false);
            // document.getElementById(relationCheckboxName).checked = false;
            // console.log(document.getElementById(relationCheckboxName).checked);
            relationStatusList[originTypes[i]] = false;
            for (let j = 0; j < relationStatusList.length; j++) {
                if (relationStatusList[j].name === originTypes[i]) {
                    relationStatusList[j].status = false;
                }
            }
        } else {
            // $(relationCheckboxName).attr("checked", true);
            //document.getElementById(relationCheckboxName).checked = true;
            // console.log(document.getElementById(relationCheckboxName).checked);
            for (let j = 0; j < relationStatusList.length; j++) {
                if (relationStatusList[j].name === originTypes[i]) {
                    relationStatusList[j].status = true;
                }
            }
        }
    }
}

function getNodeLabels(nodesAndRelations) {
    let label_list = [];
    for (let i = 0; i < nodesAndRelations.length; i++) {
        for (let j = 0; j < nodesAndRelations[i].relationships.length; j++) {
            for (let k = 0; k < nodesAndRelations[i].relationships[j].source.labels.length; k++) {
                if ($.inArray(nodesAndRelations[i].relationships[j].source.labels[k], label_list) === -1) {
                    label_list.push(nodesAndRelations[i].relationships[j].source.labels[k]);
                }
            }
            for (let k = 0; k < nodesAndRelations[i].relationships[j].target.labels.length; k++) {
                if ($.inArray(nodesAndRelations[i].relationships[j].target.labels[k], label_list) === -1) {
                    label_list.push(nodesAndRelations[i].relationships[j].target.labels[k]);
                }
            }
        }
    }
    return label_list;
}

function changeLabelCheckboxStatus(newLabels) {
    for (let i = 0; i < newLabels.length; i++) {
        let labelCheckboxName = "label-" + newLabels[i];
        if (document.getElementById(labelCheckboxName).checked === false) {
            document.getElementById(labelCheckboxName).checked = true;
            for (let j = 0; j < labelStatusList.length; j++) {
                if (labelStatusList[j].name === newLabels[i]) {
                    labelStatusList[j].status = true;
                }
            }
        }
    }
}

// $(function () {
//     //通用头部搜索切换
//     $('#search-hd .search-input').on('input propertychange', function () {
//         var val = $(this).val();
//         if (val.length > 0) {
//             $('#search-hd .pholder').hide(0);
//         } else {
//             var index = $('#search-bd li.selected').index();
//             $('#search-hd .pholder').eq(index).show().siblings('.pholder').hide(0);
//         }
//     })
//     $('#search-bd li').click(function () {
//         var index = $(this).index();
//         $('#search-hd .pholder').eq(index).show().siblings('.pholder').hide(0);
//         $('#search-hd .search-input').eq(index).show().siblings('.search-input').hide(0);
//         $(this).addClass('selected').siblings().removeClass('selected');
//         $('#search-hd .search-input').val('');
//     });
// })
//
//
// $(function(){
//
//     //定义一个存储数据的数组，用于下面重复选择判断，删除标签
//     var oliIdArray = [];
//
//     //点击输入框时候
//     $(".selectBox .imitationSelect").on("click",function(event){
//         $(this).parent().next().toggle();//ul弹窗展开
//         $(this).next().toggleClass("fa-caret-up")//点击input选择适合，小图标动态切换
//         if($(this).next().hasClass("fa-caret-down")){
//             $(this).next().removeClass("fa-caret-down").addClass("fa-caret-up")//点击input选择适合，小图标动态切换
//         }else{
//             $(this).next().addClass("fa-caret-down").removeClass("fa-caret-up")//点击input选择适合，小图标动态切换
//         }
//         if (event.stopPropagation) {
//             // 针对 Mozilla 和 Opera
//             event.stopPropagation();
//         }else if (window.event) {
//             // 针对 IE
//             window.event.cancelBubble = true;
//         }
//     });
//
//     //点击右边箭头icon时候
//     $(".selectBox .fa").on("click",function(event){
//         $(this).parent().next().toggle();//ul弹窗展开
//         if($(this).hasClass("fa-caret-down")){
//             $(this).removeClass("fa-caret-down").addClass("fa-caret-up")//点击input选择适合，小图标动态切换
//         }else{
//             $(this).addClass("fa-caret-down").removeClass("fa-caret-up")//点击input选择适合，小图标动态切换
//         }
//         if (event.stopPropagation) {
//             // 针对 Mozilla 和 Opera
//             event.stopPropagation();
//         }else if (window.event) {
//             // 针对 IE
//             window.event.cancelBubble = true;
//         }
//     });
//
//     $(".selectUl button").click(function(event){
//         event=event||window.event;
//         $(this).addClass("actived_li");//点击当前的添加actived_li这个类；
//         //var oliId = $(this).attr("oliId");
//         var oliId = $(this).parent().attr("oliId");
//         console.log("oliid",oliId);
//         console.log("oliIdArray",oliIdArray);
//         if(oliIdArray.indexOf(oliId)>-1){
//
//         }else{
//             oliIdArray.push(oliId);
//             console.log("oliid",oliId);
//             console.log("oliIdArray",oliIdArray);
// //            $(this).parent().prev().children().attr("oliId",oliIdArray);//把当前点击的oliId赋值到显示的input的oliId里面
//             $(this).parent().parent().prev().children().attr("oliId",oliIdArray);//把当前点击的oliId赋值到显示的input的oliId里面
//             console.log("^^^",$(this).parent().parent().prev(".inputCase").children()[0]);
//             // console.log("###",$(this).parent().val());
//             console.log("@@@",$(this).prev().val());
//             $(this).parent().parent().prev(".inputCase").firstChild().append("<span class='person_root'><span>"+$(this).prev().val()+"</span><i class='close' oliId='" + oliId + "' >x</i></span>");
//         }
//         console.log(oliIdArray)
//         oliDelete();
//
//
//     });
//
//     function oliDelete(){
//         //进行绑定事件，每个删除事件得以进行
//         var role_select = document.getElementById("role_select");
//         var role_span= role_select.getElementsByTagName('i');
//         var id;
//         //console.log("span的选择个数"+role_span.length)l
//         for(var i=0;i<role_span.length;i++){
//             role_span[i].onclick = function(){
//                 $(".selectUl").hide();
//                 var oliId = $(this).attr("oliId");
//                 //console.log("oliId"+oliId)
//                 for (var i = 0; i < oliIdArray.length; i++){
//                     if (oliIdArray[i] === oliId){ //表示数组里面有这个元素
//                         id = i;//元素位置
//                         oliIdArray.splice(i,1);
//                         console.log('删除当前的序号'+oliId+';'+'剩下数组'+oliIdArray)
//                     }
//                 }
//                 $(".selectUl li").eq(oliId-1).removeClass("actived_li");
//                 $(this).parent().remove();
//             }
//         }
//     }
//
//     //点击任意地方隐藏下拉
//     // $(document).click(function(event){
//     //     event=event||window.event;
//     //     $(".inputCase .fa").removeClass("fa-caret-up").addClass("fa-caret-down")//当点隐藏ul弹窗时候，把小图标恢复原状
//     //     $(".selectUl").hide();//当点击空白处，隐藏ul弹窗
//     // });
//
// })
//
