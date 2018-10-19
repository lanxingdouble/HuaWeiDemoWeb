//banner左侧内容栏
var thisTime;
$(mouseon());

function mouseon() {
    //var thisTime;
    //鼠标离开左侧内容栏
    $('.cat_wrap .cat_list .float').mouseleave(function (even) {
        thisTime = setTimeout(thisMouseOut, 1000);
    });
    //鼠标点击左侧内容栏   滑动出弹层
    $('.cat_wrap .cat_list .float').mouseenter(function () {
        console.log("###########");
        $(this).addClass("active").siblings().removeClass("active");
        clearTimeout(thisTime);
        var thisUB = $('.cat_wrap .cat_list .float').index($(this));
        if ($.trim($('.cat_subcont .cat_sublist').eq(thisUB).html()) != "") {
            $('.cat_subcont').addClass('active');
            $('.cat_sublist').hide();
            $('.cat_sublist').eq(thisUB).show();
        } else {
            $('.cat_subcont').removeClass('active');
        }
    });
}

//函数——执行鼠标离开左侧内容栏的动作
function thisMouseOut() {
    $('.cat_subcont').removeClass('active');
    $('.cat_wrap .cat_list .float').removeClass('active');
}

$('.cat_subcont').mouseenter(function () {
    clearTimeout(thisTime);
    $('.cat_subcont').addClass('active');
});
$('.cat_subcont').mouseleave(function () {
    $('.cat_subcont').removeClass('active');
    $('.cat_wrap .cat_list .float').removeClass('active');
});

function add_to_the_left(item) {
    var thisUB = $('.cat_subcont .cat_sublist').index($(item).parent().parent().parent().parent().parent());
    $('.cat_list .float').eq(thisUB).children().eq(0).children().eq(1).html($(item).text());
    // console.log('id:',$(item).attr("id"));
    $('.cat_list .float').eq(thisUB).children().eq(0).children().eq(1).attr("id",$(item).attr("id"));
    // console.log('id2:',$('.cat_list .float').eq(thisUB).children().eq(0).children().eq(1).attr("id"));
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
        mouseon();
    }
}



function search_criteria_clone(item) {
    var name = $(item).prev("input").val();
    console.log("44444444", name);
    if (name.length == 0) {
        alert("empty input!")
    } else {
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/CloneAPI/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": {"name": name}}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
            },
            success: function (d) {
                if (d === "fail") {
                    return
                }
                $(item).parent().children("ul").html("");
                for (var i = 0; i < d.length; i++) {
                    $(item).parent().children("ul").append("<li><a href=\"#\" onclick=\"add_to_the_left(this)\" id="+d[i].kg_id+">"+d[i].name+"</a></li>");
                }
            }
        });
    }
}

function search_criteria_developer(item) {
    var name = $(item).prev("input").val();
    if (name.length == 0) {
        alert("empty input!")
    } else {
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/DeveloperSearch/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": {"name": name}}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
            },
            success: function (d) {
                console.log("developer: ",d);
                if (d === "fail") {
                    return
                }
                $(item).parent().children("ul").html("");
                for (var i = 0; i < d.length; i++) {
                    $(item).parent().children("ul").append("<li><a href=\"#\" onclick=\"add_to_the_left(this)\" id="+d[i].kg_id+">"+d[i].name+"</a></li>");
                }
            }
        });
    }
}

function search_criteria_CommonAPISearch(item) {
    var name = $(item).prev("input").val();
    console.log("44444444", name);
    if (name.length == 0) {
        alert("empty input!")
    } else {
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/CommonAPISearch/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": {"name": name}}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
            },
            success: function (d) {
                if (d === "fail") {
                    return
                }
                $(item).parent().children("ul").html("");
                for (var i = 0; i < d.length; i++) {
                    $(item).parent().children("ul").append("<li><a href=\"#\" onclick=\"add_to_the_left(this)\" id="+d[i].kg_id+">"+d[i].name+"</a></li>");
                }
            }
        });
    }
}

function search_criteria_ConceptSearch(item) {
    var name = $(item).prev("input").val();
    console.log("44444444", name);
    if (name.length == 0) {
        alert("empty input!")
    } else {
        $.ajax({
            async: true,
            url: "http://bigcode.fudan.edu.cn/dysd3/ConceptSearch/",
            type: "post",
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({"query": {"name": name}}),
            error: function (xhr, status, errorThrown) {
                console.log("Error " + errorThrown);
                console.log("Status: " + status);
                console.log(xhr);
            },
            success: function (d) {
                if (d === "fail") {
                    return
                }
                $(item).parent().children("ul").html("");
                for (var i = 0; i < d.length; i++) {
                    $(item).parent().children("ul").append("<li><a href=\"#\" onclick=\"add_to_the_left(this)\" id="+d[i].kg_id+">"+d[i].name+"</a></li>");
                }
            }
        });
    }
}

function search_criteria_project(item) {
    $.ajax({
        async: true,
        url: "http://bigcode.fudan.edu.cn/dysd3/ProjectInfo/",
        type: "post",
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({"query": {"name": name}}),
        error: function (xhr, status, errorThrown) {
            console.log("Error " + errorThrown);
            console.log("Status: " + status);
            console.log(xhr);
        },
        success: function (d) {
            if (d === "fail") {
                return
            }
            $(item).parent().children("ul").html("");
            for (var i = 0; i < d.length; i++) {
                $(item).parent().children("ul").append("<li><a href=\"#\" onclick=\"add_to_the_left(this)\" id="+d[i].kg_id+">"+d[i].project_name+"</a></li>");
            }
        }
    });
}