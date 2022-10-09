//关键词sug
var hotList = 0;
$(function() {
    //当键盘键被松开时发送Ajax获取数据
    $('#search-text').keyup(function() {
        var keywords = $(this).val();
        if (keywords == '') { $('#word').hide(); return };
        $.ajax({
            url: 'https://suggestion.baidu.com/su?wd=' + keywords,
            dataType: 'jsonp',
            jsonp: 'cb', //回调函数的参数名(键值)key
            // jsonpCallback: 'fun', //回调函数名(值) value
            beforeSend: function() {
                // $('#word').append('<li>正在加载。。。</li>');
            },
            success: function(res) {
                $('#word').empty().show();
                hotList = res.s.length;
                if (hotList) {
                    $("#word").css("display", "block");
                    for (var i = 0; i < hotList-1; i++) {
                        if (i===hotList-1){
                            $("#word").append('<li id="lastHot"><span>' + (i + 1) + "</span>" + res.s[i] + "</li>");
                        }
                        else{
                            $("#word").append("<li><span>" + (i + 1) + "</span>" + res.s[i] + "</li>");
                        }
                        $("#word li").eq(i).click(function() {
                            $('#search-text').val(this.childNodes[1].nodeValue);
                            window.open(thisSearch + this.childNodes[1].nodeValue);
                            $('#word').css('display', 'none')
                        });
                        if (i === 0) {
                            $("#word ul li").eq(i).css({
                                "border-top": "none"
                            });
                            $("#word ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#f54545"
                            })
                        } else if (i === 1) {
                            $("#word ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#ff8547"
                            })
                        } else if (i === 2) {
                            $("#word ul span").eq(i).css({
                                "color": "#fff",
                                "background": "#ffac38"
                            })
                        }
                    } 
                } else {
                        $("#word").css("display", "none")
                }
                    
                /*
                if (data.s == '') {
                    //$('#word').append('<div class="error">Not find  "' + keywords + '"</div>');
                    $('#word').empty();
                    $('#word').hide();
                }
                $.each(data.s, function() {
                    $('#word').append('<li>' + this + '</li>');
                })*/
            },
            error: function() {
                $('#word').empty().show();
                //$('#word').append('<div class="click_work">Fail "' + keywords + '"</div>');
                $('#word').hide();
            }
        })
    })

    //点击搜索数据复制给搜索框
    $(document).on('click', '#word li', function() {
        var word = $(this).text().replace(/^[0-9]/, '');
        $('#search-text').val(word);
        $('#word').empty();
        $('#word').hide();
        //$("form").submit();
         $('.submit').trigger('click');//触发搜索事件
    })
    //$(document).on('click', '.container,.banner-video,nav', function() {
    $(document).on('click', '.io-grey-mode', function() {
        $('#word').empty();
        $('#word').hide();
    })

})
