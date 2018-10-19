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
        if ($.trim($('.cat_subcont .cat_sublist').eq(thisUB).html()).length>0) {
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
                console.log("clone_searchP:",d);
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
                console.log("common_api_search:",d);
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
                console.log("concept_search:",d);
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
            console.log("project_search:",d);
            $(item).parent().children("ul").html("");
            for (var i = 0; i < d.length; i++) {
                $(item).parent().children("ul").append("<li><a href=\"#\" onclick=\"add_to_the_left(this)\" id="+d[i].kg_id+">"+d[i].project_name+"</a></li>");
            }
        }
    });
}