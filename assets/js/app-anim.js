(function($){ 
    $(document).ready(function(){
        // 侧栏菜单初始状态设置
        if(theme.minNav != '1')trigger_resizable(true);
        // 主题状态
        switch_mode(); 
        // 搜索模块
        intoSearch();
        // 粘性页脚
        stickFooter();
        // 网址块提示 
        if(isPC()){ $('[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }else{ $('.qr-img[data-toggle="tooltip"]').tooltip({trigger: 'hover'}); }
        // 初始化tab滑块
        intoSlider();
        // 初始化theiaStickySidebar
        $('.sidebar').theiaStickySidebar({
            additionalMarginTop: 90,
            additionalMarginBottom: 20
        });
        // 初始化游客自定义数据
        /*if(theme.isCustomize == '1'){
            intoSites(false);
            intoSites(true);
        }*/
    });
    $(".panel-body.single img").each(function(i) {
        if (!this.parentNode.href) {
            if(theme.lazyload)
                $(this).wrap("<a href='" + $(this).data('src') + "' data-fancybox='fancybox' data-caption='" + this.alt + "'></a>")
            else
                $(this).wrap("<a href='" + this.src + "' data-fancybox='fancybox' data-caption='" + this.alt + "'></a>")
        }
    })
    // Enable/Disable Resizable Event
    var wid = 0;
    $(window).resize(function() {
        clearTimeout(wid);
        wid = setTimeout(go_resize, 200); 
    });
    function go_resize() {
        stickFooter(); 
        //if(theme.minNav != '1'){
            trigger_resizable(false);
        //}
    }
    // count-a数字动画
    $('.count-a').each(function () {
        $(this).prop('Counter', 0).animate({
            Counter: $(this).text()
        }, {
            duration: 1000,
            easing: 'swing',
            step: function (now) {
                $(this).text(Math.ceil(now));
            }
        });
    });
    $(document).on('click', "a[target!='_blank']", function() {
        if( theme.loading=='1' && $(this).attr('href') && $(this).attr('href').indexOf("#") != 0 && $(this).attr('href').indexOf("java") != 0 && !$(this).data('fancybox')  && !$(this).data('commentid') && !$(this).hasClass('nofx') ){
            var load = $('<div id="load-loading"></div>');
            $("body").prepend(load);
            load.animate({opacity:'1'},200,'swing').delay(2000).hide(300,function(){ load.remove() });
        }
    });
    // 点赞
    $(".btn-like").click(function() {
        var t = $(this);
        if(t.data('action') == "post_like"){
            if (t.hasClass('liked')) {
                showAlert(JSON.parse('{"status":3,"msg":"您已经赞过了!"}'));
            } else {
                var icop = t.children('.flex-column');
                t.addClass('liked'); 
                $.ajax({
                    type : 'POST',
                    url : theme.ajaxurl,  
                    data : {
                        action: t.data('action'),
                        post_id: t.data("id"),
                        ticket: t.data("ticket")
                    },
                    success : function( data ){
                        $am = $('<i class="iconfont icon-heart" style="color: #f12345;transform: scale(1) translateY(0);position: absolute;transition: .6s;opacity: 1;"></i>');
                        icop.prepend($am);
                        showAlert(JSON.parse('{"status":1,"msg":"谢谢点赞!"}'));
                        $('.like-count').html(data);
                        $am.addClass('home-like-hide');
                    },
                    error:function(){ 
                        showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
                    }
                });
            }
        }else{
            if (t.hasClass('disabled'))
                return false;
            var _delete = 0;
            var id = t.data("id");
            if (t.hasClass('liked')) {
                _delete = 1;
            }
            t.addClass('disabled'); 
            $.ajax({
                type : 'POST',
                url : theme.ajaxurl,  
                data : {
                    action: t.data("action"),
                    post_id: t.data("id"),
                    post_type: t.data("post_type"),
                    delete: _delete,
                    ticket: t.data("ticket")
                },
                success : function( data ){
                    t.removeClass('disabled'); 
                    if(data.status==1){
                        $('.star-count-'+id).html(data.count);
                        if(_delete==1){
                            t.removeClass('liked'); 
                            t.find('.star-ico').removeClass('icon-collection').addClass('icon-collection-line');
                        }
                        else{
                            t.addClass('liked'); 
                            t.find('.star-ico').removeClass('icon-collection-line').addClass('icon-collection');
                        }
                        ioPopupTips(data.status, data.msg);
                        return false;
                    }
                    ioPopupTips(data.status, data.msg);
                },
                error:function(){ 
                    t.removeClass('disabled'); 
                    ioPopupTips(4, "网络错误 --.");
                }
            });
            
        }
        return false;
    });
    // 卡片点赞
    $(document).on('click', '.home-like', function() {
        if ($(this).hasClass('liked')) {
            showAlert(JSON.parse('{"status":3,"msg":"您已经赞过了!"}'));
        } else {
            var icop = $(this);
            var id = $(this).data("id");
            $(this).addClass('liked'); 
            $.ajax({
                type : 'POST',
                url : theme.ajaxurl,  
                data : {
                    action: "post_like",
                    post_id: id
                },
                success : function( data ){
                    $am = $('<i class="iconfont icon-heart" style="color: #f12345;transform: scale(1) translateY(0);position: absolute;transition: .6s;opacity: 1;"></i>');
                    icop.prepend($am);
                    showAlert(JSON.parse('{"status":1,"msg":"谢谢点赞!"}'));
                    $(".home-like-"+id).html(data);
                    $am.addClass('home-like-hide');
                },
                error:function(){ 
                    showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
                }
            });
        }
        return false;
    });
    //未开启详情页计算访客方法
    $(document).on('click', '.url-card a.is-views[data-id]', function() {
        $.ajax({
            type:"GET",
            url:theme.ajaxurl,
            data:{
                action:'io_postviews',
                postviews_id:$(this).data('id'),
            },
            cache:false,
        });
    });
    // app下载统计
    var clipboard = new ClipboardJS('a.down_count', {
        text: $(document).on('click','a.down_count', function(e) {
            var mm = $(e.target).data('clipboard-text');  
            $.ajax({
                type:"POST",
                url:theme.ajaxurl,
                data: $(this).data(),
                success : function( data ){
                    $('.down-count-text').html(data);
                }
            });
            if( mm ){
                return mm; 
            }
        })
    });
    clipboard.on("success",function (e) {
        alert("网盘密码已复制，点“确定”进入下载页面。");
    });

    //夜间模式
    $(document).on('click', '.switch-dark-mode', function(event) {
        event.preventDefault();
        $.ajax({
            url: theme.ajaxurl,
            type: 'POST',
            dataType: 'html',
            data: {
                mode_toggle: $('body').hasClass('io-black-mode') === true ? 1 : 0,
                action: 'switch_dark_mode',
            },
        })
        .done(function(response) {
            $('body').toggleClass('io-black-mode '+theme.defaultclass);
            switch_mode(); 
            $("#"+ $('.switch-dark-mode').attr('aria-describedby')).remove();
            //$('.switch-dark-mode').removeAttr('aria-describedby');
        })
    });
    function switch_mode(){
        if($('body').hasClass('io-black-mode')){
            if($(".switch-dark-mode").attr("data-original-title"))
                $(".switch-dark-mode").attr("data-original-title","日间模式");
            else
                $(".switch-dark-mode").attr("title","日间模式");
            $(".mode-ico").removeClass("icon-night");
            $(".mode-ico").addClass("icon-light");
        }
        else{
            if($(".switch-dark-mode").attr("data-original-title"))
                $(".switch-dark-mode").attr("data-original-title","夜间模式");
            else
                $(".switch-dark-mode").attr("title","夜间模式");
            $(".mode-ico").removeClass("icon-light");
            $(".mode-ico").addClass("icon-night");
        }
    }
    //返回顶部
    $(window).scroll(function () {
        if ($(this).scrollTop() >= 50) {
            $('#go-to-up').fadeIn(200);
            $('.big-header-banner').addClass('header-bg');
        } else {
            $('#go-to-up').fadeOut(200);
            $('.big-header-banner').removeClass('header-bg');
        }
    });
    $('.go-up').click(function () {
        $('body,html').animate({
            scrollTop: 0
        }, 500);
    return false;
    }); 

 
    //滑块菜单
    $('.slider_menu').children("ul").children("li").not(".anchor").hover(function() {
        $(this).addClass("hover"),
        //$('li.anchor').css({
        //    transform: "scale(1.05)",
        //}),
        toTarget($(this).parent(),true,true) 
    }, function() {
        //$('li.anchor').css({
        //    transform: "scale(1)",
        //}),
        $(this).removeClass("hover") 
    });
    $('.slider_menu').mouseleave(function(e) {
        var menu = $(this).children("ul");
        window.setTimeout(function() { 
            toTarget(menu,true,true) 
        }, 50)
    }) ;  
    function intoSlider() {
        $(".slider_menu[sliderTab]").each(function() {
            if(!$(this).hasClass('into')){
                var menu = $(this).children("ul");
                menu.prepend('<li class="anchor" style="position:absolute;width:0;height:28px"></li>');
                var target = menu.find('.active').parent();
                if(0 < target.length){
                    menu.children(".anchor").css({
                        left: target.position().left + target.scrollLeft() + "px",
                        width: target.outerWidth() + "px",
                        height: target.height() + "px",
                        opacity: "1"
                    })
                }
                $(this).addClass('into');
            }
        })
    }
    //粘性页脚
    function stickFooter() {
        $('.main-footer').attr('style', '');
        if($('.main-footer').hasClass('text-xs'))
        {
            var win_height                 = jQuery(window).height(),
                footer_height             = $('.main-footer').outerHeight(true),
                main_content_height         = $('.main-footer').position().top + footer_height ;
            if(win_height > main_content_height - parseInt($('.main-footer').css('marginTop'), 10))
            {
                $('.main-footer').css({
                    marginTop: win_height - main_content_height  
                });
            }
        }
    }
 

    $('#sidebar-switch').on('click',function(){
        $('#sidebar').removeClass('mini-sidebar');
	//221024: 调整左导航展开时,点击图标锚定定位失效
        //$('.sidebar-nav .change-href').attr('href','javascript:;');

    }); 
 
    // Trigger Resizable Function
    var isMin = false,
        isMobileMin = false;
    function trigger_resizable( isNoAnim ) {
        if( (theme.minNav == '1' && !isMin && 767.98<$(window).width() )||(!isMin && 767.98<$(window).width() && $(window).width()<1024) ){
            //$('#mini-button').removeAttr('checked');
            $('#mini-button').prop('checked', false);
            trigger_lsm_mini(isNoAnim);
            isMin = true;
            if(isMobileMin){
                $('#sidebar').addClass('mini-sidebar');
                $('.sidebar-nav .change-href').each(function(){$(this).attr('href',$(this).data('change'))});
                isMobileMin = false;
            }
        }
        else if( ( theme.minNav != '1')&&((isMin && $(window).width()>=1024) || ( isMobileMin && !isMin && $(window).width()>=1024 ) ) ){
            $('#mini-button').prop('checked', true);
            trigger_lsm_mini(isNoAnim);
            isMin = false;
            if(isMobileMin){
                isMobileMin = false;
            }
        }
        else if($(window).width() < 767.98 && $('#sidebar').hasClass('mini-sidebar')){
            $('#sidebar').removeClass('mini-sidebar');
            //221024: 调整左导航展开时,点击图标锚定定位失效
            //$('.sidebar-nav .change-href').attr('href','javascript:;');
            isMobileMin = true;
            isMin = false;
        }
    }
    // sidebar-menu-inner收缩展开
    $('.sidebar-menu-inner a').on('click',function(){//.sidebar-menu-inner a //.has-sub a  

        //console.log('--->>>'+$(this).find('span').text());
        if (!$('.sidebar-nav').hasClass('mini-sidebar')) {//菜单栏没有最小化   
            $(this).parent("li").siblings("li.sidebar-item").children('ul').slideUp(200);
            if ($(this).next().css('display') == "none") { //展开
                //展开未展开
                // $('.sidebar-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(200);
                $(this).parent('li').addClass('sidebar-show').siblings('li').removeClass('sidebar-show');
            }else{ //收缩
                //收缩已展开
                $(this).next('ul').slideUp(200);
                //$('.sidebar-item.sidebar-show').removeClass('sidebar-show');
                $(this).parent('li').removeClass('sidebar-show');
            }
        }
    });
    //菜单栏最小化
    $('#mini-button').on('click',function(){
        console.log('start trigger_lsm_mini');
        trigger_lsm_mini(true);

    });
    function trigger_lsm_mini(isNoAnim){
        if (!$('.header-mini-btn input[type="checkbox"]').prop("checked")) {
            $('.sidebar-nav').removeClass('mini-sidebar');
	    //221024: 调整左导航展开时,点击图标锚定定位失效
            //$('.sidebar-nav .change-href').attr('href','javascript:;');
            $('.sidebar-menu ul ul').css("display", "none");
	    console.log('checked=true');
            if(isNoAnim){
		console.log('isNoAnim=true');
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(170);
            }
            else{
		console.log('isNoAnim=false');
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width: 170},200);
            }
        }else{
            console.log('checked=false');
            $('.sidebar-item.sidebar-show').removeClass('sidebar-show');
            $('.sidebar-menu ul').removeAttr('style');
            $('.sidebar-nav').addClass('mini-sidebar');
            $('.sidebar-nav .change-href').each(function(){$(this).attr('href',$(this).data('change'))});
            if(isNoAnim){
                $('.sidebar-nav').removeClass('animate-nav');
                $('.sidebar-nav').width(60);
            }
            else{
                $('.sidebar-nav').addClass('animate-nav');
                $('.sidebar-nav').stop().animate({width: 60},200);
            }
        }
        //$('.sidebar-nav').css("transition","width .3s");
    }
    //显示2级悬浮菜单
    $(document).on('mouseover','.mini-sidebar .sidebar-menu ul:first>li,.mini-sidebar .flex-bottom ul:first>li',function(){
        var offset = 2;
        if($(this).parents('.flex-bottom').length!=0)
            offset = -3;
        $(".sidebar-popup.second").length == 0 && ($("body").append("<div class='second sidebar-popup sidebar-menu-inner text-sm'><div></div></div>"));
        $(".sidebar-popup.second>div").html($(this).html());
        $(".sidebar-popup.second").show();
        var top = $(this).offset().top - $(window).scrollTop() + offset; 
        var d = $(window).height() - $(".sidebar-popup.second>div").height();
        if(d - top <= 0 ){
            top  = d >= 0 ?  d - 8 : 0;
        }
        $(".sidebar-popup.second").stop().animate({"top":top}, 50);
    });
    //隐藏悬浮菜单面板
    $(document).on('mouseleave','.mini-sidebar .sidebar-menu ul:first, .mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").hide();
    });
    //常驻2级悬浮菜单面板
    $(document).on('mouseover','.mini-sidebar .slimScrollBar,.second.sidebar-popup',function(){
        $(".sidebar-popup.second").show();
    });
 
    $(document).on('click', '.ajax-cm-home .ajax-cm', function(event) {
        event.preventDefault();
        var t = $(this); 
        var id = t.data('id');
        var box = $(t.attr('href')).children('.site-list');
        //console.log(box.children('.url-card').length);
        if( box.children('.url-card').length==0 ){ 
            t.addClass('disabled');
            $.ajax({
                url: theme.ajaxurl,
                type: 'POST', 
                dataType: 'html',
                data : {
                    action: t.data('action'),
                    term_id: id,
                },
                cache: true,
            })
            .done(function(response) { 
                if (response.trim()) { 
                    var url = $(response);
                    box.html(url);
                    if(isPC()) url.find('[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
                } else { 
                }
                t.removeClass('disabled');
            })
            .fail(function() { 
                t.removeClass('disabled');
            }) 
        }
    });

    //首页tab模式请求内容
    $(document).on('click', '.ajax-list a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list') , '.'+$(this).data('target'));
    });

    $(document).on('click', '.ajax-list-home a', function(event) {
        event.preventDefault();
        loadAjax( $(this), $(this).parents('.ajax-list-home'), '.ajax-'+$(this).parents('.ajax-list-home').data('id') );
    });

    function loadAjax(t,parent,body){
        if( !t.hasClass('active') ){ 
            parent.find('a').removeClass('active');
            t.addClass('active');
            if($(body).children(".ajax-loading").length == 0)
                $(body).append('<div class="ajax-loading text-center rounded" style="position:absolute;display:flex;left:0;width:100%;top:-1rem;bottom:.5rem;background:rgba(125,125,125,.5)"><div class="col align-self-center"><i class="iconfont icon-loading icon-spin icon-2x"></i></div></div>');
            $.ajax({
                url: theme.ajaxurl,
                type: 'POST', 
                dataType: 'html',
                data : t.data(),
                cache: true,
            })
            .done(function(response) { 
                if (response.trim()) { 
                    $(body).html('');
                    $(body).append(response); 
                    //if(theme.lazyload == '1') {
                    //    $(body+" img.lazy").lazyload();
                    //} 
                    var url =  $(body).children('#ajax-cat-url').data('url');
                    if(url)
                        t.parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').show().attr('href', url);
                    else
                        t.parents('.d-flex.flex-fill.flex-tab').children('.btn-move.tab-move').hide();
                    if(isPC()) $('.ajax-url [data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
                } else { 
                    $('.ajax-loading').remove();
                }
            })
            .fail(function() { 
                $('.ajax-loading').remove();
            }) 
        }
    }
    
    // 自定义模块-----------------
    $(".add-link-form").on("submit", function() {
        var siteName = $(".site-add-name").val()
          , siteUrl = $(".site-add-url").val();
          addSiteList({
            id: +new Date,
            name: siteName,
            url: siteUrl
        });
        this.reset();
        this.querySelector("input").focus();
        $(this).find(".btn-close-fm").click();
    });
    var isEdit = false;
    $('.customize-menu .btn-edit').click(function () {
        if(isEdit){
            $('.url-card .remove-site,#add-site').hide();
            $('.url-card .remove-site,.add-custom-site').hide();
            $('.url-card .remove-cm-site').hide();
            $('.customize-sites').removeClass('edit');
            ioSortable();
            $('.customize-menu .btn-edit').html("编辑");
        }else{
            $('.url-card .remove-site,#add-site').show();
            $('.url-card .remove-site,.add-custom-site').show();
            $('.url-card .remove-cm-site').show();
            $('.customize-sites').addClass('edit');
            ioSortable();
            $('.customize-menu .btn-edit').html("确定");
        }
        isEdit = !isEdit;
    }); 
    function addSiteList(site){
        var sites = getItem("myLinks");
        //判断是否重复
        for (var i = 0; i < sites.length; i++) {
            if(sites[i].url==site.url)
            {
                showAlert(JSON.parse('{"status":4,"msg":"该网址已经存在了 --."}'));
                return;
            }
        }
        sites.unshift(site);
        addSite(site,false,false);
        setItem(sites,"myLinks");
    }
    function addSite(site,isLive,isHeader) {
        if(!isLive) $('.customize_nothing').remove();
        else $('.customize_nothing_click').remove(); 
        var url_f,matches = site.url.match(/^(?:https?:\/\/)?((?:[-A-Za-z0-9]+\.)+[A-Za-z]{2,6})/);
        if (!matches || matches.length < 2) url_f=site.url; 
        else {
            url_f=matches[0];
            if(theme.urlformat == '1')
                url_f = matches[1];
        } 
        var newSite = $('<div class="url-card  col-6 '+theme.classColumns+' col-xxl-10a">'+
            '<div class="url-body mini"><a href="'+site.url+'" target="_blank" class="card new-site mb-3 site-'+site.id+'" data-id="'+site.id+'" data-url="'+site.url+'" data-toggle="tooltip" data-placement="bottom" title="'+site.name+'" rel="external nofollow">'+
                '<div class="card-body" style="padding:0.4rem 0.5rem;">'+
                '<div class="url-content d-flex align-items-center">'+
                    '<div class="url-img rounded-circle mr-2 d-flex align-items-center justify-content-center">'+
                        '<img src="' + theme.icourl + url_f + theme.icopng + '">'+
                    '</div>'+
                    '<div class="url-info flex-fill">'+
                        '<div class="text-sm overflowClip_1">'+
                            '<strong>'+site.name+'</strong>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '</div>'+
            '</a></div>' +
            '<a href="javascript:;" class="text-center remove-site" data-id="'+site.id+'" style="display: none"><i class="iconfont icon-close-circle"></i></a>'+
        '</div>');
        if(isLive){
            if(isHeader)
                $(".my-click-list").prepend(newSite);
            else
                $(".my-click-list").append(newSite);
            newSite.children('.remove-site').on("click",removeLiveSite);
        } else {
            $("#add-site").before(newSite);
            newSite.children('.remove-site').on("click",removeSite);
        }
        if(isEdit)
            newSite.children('.remove-site').show();
        if(isPC()) $('.new-site[data-toggle="tooltip"]').tooltip({ trigger: 'hover' });
    }
    function getItem(key) {
        var a = window.localStorage.getItem(key);
        return a ? a = JSON.parse(a) : [];
    }
    function setItem(sites,key) {
        window.localStorage.setItem(key, JSON.stringify(sites));
    }
    function intoSites(isLive) {
        var sites = getItem( isLive ? "livelists" : "myLinks" );
        if(sites.length && !isLive && !$("#add-site")[0]){  
            $(".customize_nothing.custom-site").children(".nothing").html('<a href="javascript:;" class="add-new-custom-site" data-action="add_custom_urls" data-term_name="我的导航" data-urls="'+Base64.encode(JSON.stringify( sites ))+'" >您已登录，检测到您的设备上有数据，点击<strong style="color:#db2323">同步到服务器</strong>。</a>');
            return;
        }
        if (sites.length) {
            for (var i = 0; i < sites.length; i++) {
                addSite(sites[i],isLive,false);
            }
        }
    }
    function removeSite() {
        var id = $(this).data("id"), 
            sites = getItem("myLinks");
        for (var i = 0; i < sites.length; i++){
            if ( parseInt(sites[i].id) === parseInt(id)) {
                console.log(sites[i].id, id);
                sites.splice(i, 1);
                break;
            }
        }
        setItem(sites,"myLinks");
        $(this).parent().remove();
    }
    function removeLiveSite() {
        var id = $(this).data("id"), 
            sites = getItem("livelists");
        for (var i = 0; i < sites.length; i++){
            if ( parseInt(sites[i].id) === parseInt(id)) {
                console.log(sites[i].id, id);
                sites.splice(i, 1);
                break;
            }
        }
        setItem(sites,"livelists");
        $(this).parent().remove();
    }
    $(document).on('click', '.add-new-custom-site', function(event) { 
        var t = $(this);
        $.ajax({
            url: theme.ajaxurl,
            type: 'POST', 
            dataType: 'json',
            data : t.data(),
        })
        .done(function(response) {   
            showAlert(response);
        })
        .fail(function() { 
            showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
        }) 
    });
    $(".add-custom-site-form").on("submit", function() {
        var t = $(this); 
        var tt = this;
        var url = t.find("input[name=url]").val();
        var name = t.find("input[name=url_name]").val();
        var term_id = t.find('input:radio:checked').val(); 
        var term_name = t.find('input[name=term_name]').val();  
        if(term_name=='' && term_id==undefined){
            showAlert(JSON.parse('{"status":3,"msg":"为什么不选分类"}'));
            return false;
        }
        $.ajax({
            url: theme.ajaxurl,
            type: 'POST', 
            dataType: 'json',
            data : t.serialize()+"&action=add_custom_url",
        })
        .done(function(response) {   
            if(response.status !=1){
                showAlert(response);
                return;
            }
            var url_f,matches = url.match(/^(?:https?:\/\/)?((?:[-A-Za-z0-9]+\.)+[A-Za-z]{2,6})/);
            if (!matches || matches.length < 2) url_f=url; 
            else {
                url_f=matches[0];
                if(theme.urlformat == '1')
                    url_f = matches[1];
            } 
            var id = response.id;
            var newSite = $('<div id="url-'+id+'" class="url-card sortable col-6 '+theme.classColumns+' col-xxl-10a">'+
            '<div class="url-body mini"><a href="'+url+'" target="_blank" class="card new-site mb-3 site-'+id+'" data-id="'+id+'" data-url="'+url+'" data-toggle="tooltip" data-placement="bottom" title="'+name+'" rel="external nofollow">'+
                '<div class="card-body" style="padding:0.4rem 0.5rem;">'+
                '<div class="url-content d-flex align-items-center">'+
                    '<div class="url-img rounded-circle mr-2 d-flex align-items-center justify-content-center">'+
                        '<img src="' + theme.icourl + url_f + theme.icopng + '">'+
                    '</div>'+
                    '<div class="url-info flex-fill">'+
                        '<div class="text-sm overflowClip_1">'+
                            '<strong>'+name+'</strong>'+
                        '</div>'+
                    '</div>'+
                '</div>'+
                '</div>'+
            '</a></div>' +
            '<a href="javascript:;" class="text-center remove-cm-site" data-action="delete_custom_url" data-id="'+id+'"><i class="iconfont icon-close-circle"></i></a>'+
            '</div>');
            $(".add-custom-site[data-term_id="+term_id+"]").before(newSite); 
            tt.reset();
            tt.querySelector("input").focus();
            t.find(".btn-close-fm").click();
            showAlert(JSON.parse('{"status":1,"msg":"添加成功。"}'));
        })
        .fail(function() {  
            showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
            return;
        })
    });
    $(document).on("click",'.url-card .remove-cm-site', function(event){ 
        var t = $(this); 
        t.addClass('disabled');
        $.ajax({
            url: theme.ajaxurl,
            type: 'POST', 
            dataType: 'json',
            data : t.data(),
        })
        .done(function(response) {   
            if(response.status == 1){
                t.parent().remove();
            }
            t.removeClass('disabled');
            showAlert(response);
        })
        .fail(function() { 
            t.removeClass('disabled');
            showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
        }) 
    });
    function ioSortable() {
        if($('.customize-sites').hasClass('edit')){
            if(isPC()) $('.customize-sites .new-site[data-toggle="tooltip"]').tooltip('disable');
            //$('.customize-sites').find('a').attr('href','javascript:void(0)');
            $('.customize-sites .site-list').sortable({
                items: '.sortable', 
                containment: ".main-content",
                //'placeholder': "ui-state-highlight",
                update : function(e, ui) {
                    $('.customize-sites .site-list').sortable('disable');
                    var term_id = $(this).data('term_id');
                    var order   = $(this).sortable('serialize');
                    
                    
                    var queryData = { "action": "update_custom_url_order", "term_id" : term_id, "order" : order };
                    $.ajax({
                        url: theme.ajaxurl,
                        type: 'POST',
                        data: queryData,
                        cache: false,
                        dataType: "json",
                        success: function(data){
                            if(data.status != 1){
                                showAlert(data);
                            }
                            $('.customize-sites .site-list').sortable('enable');
                        },
                        error: function(html){
                            $('.customize-sites .site-list').sortable('enable');
                            showAlert(JSON.parse('{"status":4,"msg":"网络错误 --."}'));
                        }
                    });
                
                }
            }); 
        }else{
            if(isPC()) $('.customize-sites .new-site[data-toggle="tooltip"]').tooltip('enable');
            //$('.customize-sites').find('a').attr('href',$(this).data('url'));
            $( ".customize-sites .site-list" ).sortable( "destroy" );
        }

    }

    $("input[name=term_name]").focus(function(){
        var this_input = $("input[name=term_id]"); 
        this_input.prop('checked', false);
    }); 
    $('.form_custom_term_id').on("click", function(event){ 
        $("input[name=term_name]").val("");
    });
    $(document).on('click', '.url-card a.card', function(event) {
        var site = {
            id: $(this).data("id"),
            name: $(this).find("strong").html(),
            url: $(this).data("url")
        };
        if(site.url==="")
            return;
        var liveList = getItem("livelists");
        var isNew = true;
        for (var i = 0; i < liveList.length; i++){
            if (liveList[i].name === site.name) {
                isNew = false;
            }
        }
        if(isNew){
            var maxSite = theme.customizemax;
            if(liveList.length > maxSite-1){
                $(".my-click-list .site-"+liveList[maxSite-1].id).parent().remove();
                liveList.splice(maxSite-1, 1);
            }
            addSite(site,true,true);
            liveList.unshift(site);
            setItem(liveList,"livelists");
        }
    });
    // 搜索模块 -----------------------
    function intoSearch() {
        if(window.localStorage.getItem("searchlist")){
            $(".hide-type-list input#"+window.localStorage.getItem("searchlist")).prop('checked', true);
            $(".hide-type-list input#m_"+window.localStorage.getItem("searchlist")).prop('checked', true);
        }
        if(window.localStorage.getItem("searchlistmenu")){
            $('.s-type-list.big label').removeClass('active');
            $(".s-type-list [data-id="+window.localStorage.getItem("searchlistmenu")+"]").addClass('active');
        }
        toTarget($(".s-type-list.big"),false,false);
        $('.hide-type-list .s-current').removeClass("s-current");
        $('.hide-type-list input:radio[name="type"]:checked').parents(".search-group").addClass("s-current"); 
        $('.hide-type-list input:radio[name="type2"]:checked').parents(".search-group").addClass("s-current");

        $(".super-search-fm").attr("action",$('.hide-type-list input:radio:checked').val());
        $(".search-key").attr("placeholder",$('.hide-type-list input:radio:checked').data("placeholder")); 
        if(window.localStorage.getItem("searchlist")=='type-zhannei'){
            $(".search-key").attr("zhannei","true"); 
        }
    }
    $(document).on('click', '.s-type-list label', function(event) {
        //event.preventDefault();
        $('.s-type-list.big label').removeClass('active');
        $(this).addClass('active');
        window.localStorage.setItem("searchlistmenu", $(this).data("id"));
        var parent = $(this).parents(".s-search");
        parent.find('.search-group').removeClass("s-current");
        parent.find('#'+$(this).attr("for")).parents(".search-group").addClass("s-current"); 
        toTarget($(this).parents(".s-type-list"),false,false);
    });
    $('.hide-type-list .search-group input').on('click', function() {
        var parent = $(this).parents(".s-search");
        window.localStorage.setItem("searchlist", $(this).attr("id").replace("m_",""));
        parent.children(".super-search-fm").attr("action",$(this).val());
        parent.find(".search-key").attr("placeholder",$(this).data("placeholder"));

        if($(this).attr('id')=="type-zhannei" || $(this).attr('id')=="m_type-zhannei")
            parent.find(".search-key").attr("zhannei","true");
        else
            parent.find(".search-key").attr("zhannei","");

        parent.find(".search-key").select();
        parent.find(".search-key").focus();
    });
    $(document).on("submit", ".super-search-fm", function() {
        var key = encodeURIComponent($(this).find(".search-key").val())
        if(key == "")
            return false;
        else{
            window.open( $(this).attr("action") + key);
            return false;
        }
    });
    function getSmartTipsGoogle(value,parents) {
        $.ajax({
            type: "GET",
            url: "//suggestqueries.google.com/complete/search?client=firefox&callback=iowenHot",
            async: true,
            data: { q: value },
            dataType: "jsonp",
            jsonp: "callback",
            success: function(res) {
                var list = parents.children(".search-smart-tips");
                list.children("ul").text("");
                tipsList = res[1].length;
                if (tipsList) {
                    for (var i = 0; i < tipsList; i++) {
                        list.children("ul").append("<li>" + res[1][i] + "</li>");
                        list.find("li").eq(i).click(function() {
                            var keyword = $(this).html();
                            parents.find(".smart-tips.search-key").val(keyword);
                            parents.children(".super-search-fm").submit();
                            list.slideUp(200);
                        });
                    };
                    list.slideDown(200);
                } else {
                    list.slideUp(200)
                }
            },
            error: function(res) {
                tipsList = 0;
            }
        })
    }
    function getSmartTipsBaidu(value,parents) {
        $.ajax({
            type: "GET",
            url: "//sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=iowenHot",
            async: true,
            data: { wd: value },
            dataType: "jsonp",
            jsonp: "cb",
            success: function(res) {
                var list = parents.children(".search-smart-tips");
                list.children("ul").text("");
                tipsList = res.s.length;
                if (tipsList) {
                    for (var i = 0; i < tipsList; i++) {
                        list.children("ul").append("<li>" + res.s[i] + "</li>");
                        list.find("li").eq(i).click(function() {
                            var keyword = $(this).html();
                            parents.find(".smart-tips.search-key").val(keyword);
                            parents.children(".super-search-fm").submit();
                            list.slideUp(200);
                        });
                    };
                    list.slideDown(200);
                } else {
                    list.slideUp(200)
                }
            },
            error: function(res) {
                tipsList = 0;
            }
        })
    }
    var listIndex = -1;
    var parent;
    var tipsList = 0;
    var isZhannei = false;
    $(document).on("blur", ".smart-tips.search-key", function() {
        parent = '';
        $(".search-smart-tips").delay(150).slideUp(200)
    });
    $(document).on("focus", ".smart-tips.search-key", function() {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val() && !isZhannei) {
            switch(theme.hotWords) {
                case "baidu": 
                    getSmartTipsBaidu($(this).val(),parent)
                    break;
                case "google": 
                    getSmartTipsGoogle($(this).val(),parent)
                    break;
                default: 
            } 
        }
    });
    $(document).on("keyup", ".smart-tips.search-key", function(e) {
        isZhannei = $(this).attr('zhannei')!=''?true:false;
        parent = $(this).parents('#search');
        if ($(this).val()) {
            if (e.keyCode == 38 || e.keyCode == 40 || isZhannei) {
                return
            }
            switch(theme.hotWords) {
                case "baidu": 
                    getSmartTipsBaidu($(this).val(),parent)
                    break;
                case "google": 
                    getSmartTipsGoogle($(this).val(),parent)
                    break;
                default: 
            } 
            listIndex = -1;
        } else {
            $(".search-smart-tips").slideUp(200)
        }
    });
    $(document).on("keydown", ".smart-tips.search-key", function(e) {
        parent = $(this).parents('#search');
        if (e.keyCode === 40) {
            listIndex === (tipsList - 1) ? listIndex = 0 : listIndex++;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
        if (e.keyCode === 38) {
            if (e.preventDefault) {
                e.preventDefault()
            }
            if (e.returnValue) {
                e.returnValue = false
            }
            listIndex === 0 || listIndex === -1 ? listIndex = (tipsList - 1) : listIndex--;
            parent.find(".search-smart-tips ul li").eq(listIndex).addClass("current").siblings().removeClass("current");
            var hotValue = parent.find(".search-smart-tips ul li").eq(listIndex).html();
            parent.find(".smart-tips.search-key").val(hotValue)
        }
    });
    $('.nav-login-user.dropdown').hover(function(){
        if(!$(this).hasClass('show'))
            $(this).children('a').click();
    },function(){
        //$(this).removeClass('show');
        //$(this).children('a').attr('aria-expanded',false);
        //$(this).children('.dropdown-menu').removeClass('show');
    });
    $('#add-new-sites-modal').on('show.bs.modal', function (event) {
        var button = $(event.relatedTarget); 
        var modal = $(this);
        modal.find('[name="term_id"]').val(  button.data('terms_id') );
        modal.find('[name="url"]').val(  button.data('new_url') );
        modal.find('[name="url_name"]').val('');
        modal.find('[name="url_summary"]').removeClass('is-invalid').val('');
        button.data('new_url','');
        var _url = modal.find('[name="url"]').val();
        if(_url!=''){
            getUrlInfo(_url,modal);
            urlStartValue = _url;
        }
    });
    var urlStartValue = '';
    $('#modal-new-url').on('blur',function(){
        var t = $(this);
        if(t.val()!=''){
            if(isURL(t.val())){
                if(urlStartValue!=t.val()){
                    urlStartValue = t.val();
                    getUrlInfo(t.val(),$('.add_new_sites_modal'));
                }
            }else{
                showAlert(JSON.parse('{"status":4,"msg":"URL 无效！"}'));
            }
        }
    });
    $('#modal-new-url-summary').on('blur',function(){
        var t = $(this);
        if(t.val()!=''){
            t.removeClass('is-invalid');
        }
    });
    function getUrlInfo(_url,modal){
        $('#modal-new-url-ico').show();
		$.post("//apiv2.iotheme.cn/webinfo/get.php", { url: _url ,key: theme.apikey },function(data,status){ 
			if(data.code==0){
                $('#modal-new-url-ico').hide();
				$("#modal-new-url-summary").addClass('is-invalid');
			}
			else{
                $('#modal-new-url-ico').hide();
                if(data.site_title=="" && data.site_description==""){
                    $("#modal-new-url-summary").addClass('is-invalid');
                }else{
                    modal.find('[name="url_name"]').val(data.site_title);   
                    modal.find('[name="url_summary"]').val(data.site_description);
                }
			}
		}).fail(function () {
            $('#modal-new-url-ico').hide();
			$(".refre_msg").html('访问超时，请再试试，或者手动填写').show(200).delay(4000).hide(200);
		});
    }
})(jQuery);
function isURL(URL){
    var str=URL;
    var Expression=/http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
    var objExp=new RegExp(Expression);
    if(objExp.test(str)==true){
        return true;
    }else{
        return false;
    }
}
function isPC() {
    let u = navigator.userAgent;
    let Agents = ["Android", "iPhone", "webOS", "BlackBerry", "SymbianOS", "Windows Phone", "iPad", "iPod"];
    let flag = true;
    for (let i = 0; i < Agents.length; i++) {
        if (u.indexOf(Agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
}
function chack_name(str){
    //var pattern = RegExp(/[( )(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\&)(\*)(\()(\))(\-)(\_)(\+)(\=)(\[)(\])(\{)(\})(\|)(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\»)(\«)(\“)(\”)(\?)(\)]+/);
    var pattern = RegExp(/[( )(\ )(\~)(\!)(\@)(\#)(\$)(\%)(\^)(\*)(\()(\))(\+)(\=)(\[)(\])(\{)(\})(\\)(\;)(\:)(\')(\")(\,)(\.)(\/)(\<)(\>)(\»)(\«)(\“)(\”)(\?)(\)]+/);
    if (pattern.test(str)){
        return true;
    }
    return false;
}
function showAlert(data) {
    var title,alert,ico;
    switch(data.status) {
        case 1: 
            title = '成功';
            alert='success';
            ico='icon-adopt';
            break;
        case 2: 
            title = '信息';
            alert='info';
            ico='icon-tishi';
            break;
        case 3: 
            title = '警告';
            alert='warning';
            ico='icon-warning';
            break;
        case 4: 
            title = '错误';
            alert='danger';
            ico='icon-close-circle';
            break;
        default: 
    } 
    var msg = data.msg;
    if(!$('#alert_placeholder').hasClass('text-sm')){
        $('body').append('<div id="alert_placeholder" class="text-sm" style="position: fixed;bottom: 10px;right: 10px;z-index: 2000;text-align: right;text-align: -webkit-right"></div>')
    }
    $html = $('<div class="alert-body" style="display:none;"><div class="alert alert-'+alert+' text-lg pr-4 pr-md-5" style="text-align:initial"><i class="iconfont '+ico+' icon-lg" style="vertical-align: middle;margin-right: 10px"></i><span style="vertical-align:middle">'+title+'</span><br><span class="text-md" style="margin-left:30px;vertical-align:middle">'+msg+'</span></div></div>');
    $('#alert_placeholder').append( $html );//prepend
    $html.show(200).delay(3500).hide(300, function(){ $(this).remove() }); 
} 
function toTarget(menu, padding, isMult) {
    var slider =  menu.children(".anchor");
    var target = menu.children(".hover").first() ;
    if (target && 0 < target.length){
    }
    else{
        if(isMult)
            target = menu.find('.active').parent();
        else
            target = menu.find('.active');
    }
    if(0 < target.length){
        if(padding)
        slider.css({
            left: target.position().left + target.scrollLeft() + "px",
            width: target.outerWidth() + "px",
            opacity: "1"
        });
        else
        slider.css({
            left: target.position().left + target.scrollLeft() + (target.outerWidth()/4) + "px",
            width: target.outerWidth()/2 + "px",
            opacity: "1"
        });
    }
    else{
        slider.css({
            opacity: "0"
        })
    }
}
var ioadindex = 0;
function loadingShow(parent = "body"){
    if($('.load-loading')[0]){
        ioadindex ++;
        return $('.load-loading');
    }
    var load = $('<div class="load-loading" style="display:none"><div class="bg"></div><div class="rounded-lg bg-light" style="z-index:1"><div class="spinner-border m-4" role="status"><span class="sr-only">Loading...</span></div></div></div>');
    $(parent).prepend(load);
    load.fadeIn(200);
    return load;
}
function loadingHid(load){
    if(ioadindex>0)
        ioadindex--;
    else{
        ioadindex = 0;
        load.fadeOut(300,function(){ load.remove() });
    }
}
function ioPopupTips(type, msg, callBack) {
	var ico = '';
    switch(type) {
        case 1: 
            ico='icon-adopt';
            break;
        case 2: 
            ico='icon-tishi';
            break;
        case 3: 
            ico='icon-warning';
            break;
        case 4: 
            ico='icon-close-circle';
            break;
        default: 
    } 
	var c = type==1 ? 'tips-success' : 'tips-error';
	var html = '<section class="io-bomb '+c+' io-bomb-sm io-bomb-open">'+
					'<div class="io-bomb-overlay"></div>'+
                    '<div class="io-bomb-body text-center">'+
                        '<div class="io-bomb-content bg-white px-5"><i class="iconfont '+ico+' icon-8x"></i>'+
                            '<p class="text-md mt-3">'+msg+'</p>'+
                        '</div>'+
                    '</div>'+
                '</section>';
    var tips = $(html);
	$('body').addClass('modal-open').append(tips);
	setTimeout(function(){
        $('body').removeClass('modal-open');
        if ($.isFunction(callBack)) callBack(true); 
		tips.removeClass('io-bomb-open').addClass('io-bomb-close');
		setTimeout(function(){
			tips.removeClass('io-bomb-close');
			setTimeout(function(){
				tips.remove();
			}, 200);
		},400);
	},2000);
}
function ioPopup(type, html, maskStyle, btnCallBack) {
	var maskStyle = maskStyle ? 'style="' + maskStyle + '"' : '';
	var size = '';
	if( type == 'big' ){
		size = 'io-bomb-lg';
	}else if( type == 'no-padding' ){
		size = 'io-bomb-nopd';
	}else if( type == 'cover' ){
		size = 'io-bomb-cover io-bomb-nopd';
	}else if( type == 'full' ){
		size = 'io-bomb-xl';
	}else if( type == 'small' ){
		size = 'io-bomb-sm';
	}else if( type == 'confirm' ){
		size = 'io-bomb-md';
	}
	var template = '\
	<div class="io-bomb ' + size + ' io-bomb-open">\
		<div class="io-bomb-overlay" ' + maskStyle + '></div>\
		<div class="io-bomb-body text-center">\
			<div class="io-bomb-content bg-white">\
				'+html+'\
			</div>\
			<div class="btn-close-bomb mt-2">\
                <i class="iconfont icon-close-circle"></i>\
            </div>\
		</div>\
	</div>\
	';
	var popup = $(template);
	$('body').addClass('modal-open').append(popup);
	var close = function(){
        $('body').removeClass('modal-open');
		$(popup).removeClass('io-bomb-open').addClass('io-bomb-close');
		setTimeout(function(){
			$(popup).removeClass('io-bomb-close');
			setTimeout(function(){
				popup.remove();
			}, 200);
		},600);
	}
	$(popup).on('click touchstart', '.btn-close-bomb i, .io-bomb-overlay', function(event) {
		event.preventDefault();
        if ($.isFunction(btnCallBack)) btnCallBack(true); 
		close();
	}); 
	return popup;
} 
function ioConfirm(message, btnCallBack) {
	var template = '\
	<div class="io-bomb io-bomb-confirm io-bomb-open">\
		<div class="io-bomb-overlay"></div>\
		<div class="io-bomb-body">\
			<div class="io-bomb-content bg-white">\
				'+message+'\
                <div class="text-center mt-3">\
                    <button class="btn btn-danger mx-2" onclick="_onclick(true);">确定</button>\
                    <button class="btn btn-light mx-2" onclick="_onclick(false);">取消</button>\
                </div>\
			</div>\
		</div>\
	</div>\
	';
	var popup = $(template);
	$('body').addClass('modal-open').append(popup);
    _onclick = function (r) { 
        close();
        if ($.isFunction(btnCallBack)) btnCallBack(r); 
    };
	var close = function(){
        $('body').removeClass('modal-open');
		$(popup).removeClass('io-bomb-open').addClass('io-bomb-close');
		setTimeout(function(){
			$(popup).removeClass('io-bomb-close');
			setTimeout(function(){
				popup.remove();
			}, 200);
		},600);
	}
	return popup;
}
console.log("\n %c WebStack-Hugo 导航主题 By ShumLab %c https://www.shumlab.com/ \n", "color: #ffffff; background: #f1404b; padding:5px 0;", "background: #030307; padding:5px 0;");

/**
 * Minified by jsDelivr using Terser v5.3.5.
 * Original file: /npm/js-base64@3.6.0/base64.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?module.exports=t():"function"==typeof define&&define.amd?define(t):function(){const r=e.Base64,o=t();o.noConflict=()=>(e.Base64=r,o),e.Meteor&&(Base64=o),e.Base64=o}()}("undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:this,(function(){"use strict";const e="3.6.0",t="function"==typeof atob,r="function"==typeof btoa,o="function"==typeof Buffer,n="function"==typeof TextDecoder?new TextDecoder:void 0,a="function"==typeof TextEncoder?new TextEncoder:void 0,f=[..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="],i=(e=>{let t={};return e.forEach(((e,r)=>t[e]=r)),t})(f),c=/^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/,u=String.fromCharCode.bind(String),s="function"==typeof Uint8Array.from?Uint8Array.from.bind(Uint8Array):(e,t=(e=>e))=>new Uint8Array(Array.prototype.slice.call(e,0).map(t)),d=e=>e.replace(/[+\/]/g,(e=>"+"==e?"-":"_")).replace(/=+$/m,""),l=e=>e.replace(/[^A-Za-z0-9\+\/]/g,""),h=e=>{let t,r,o,n,a="";const i=e.length%3;for(let i=0;i<e.length;){if((r=e.charCodeAt(i++))>255||(o=e.charCodeAt(i++))>255||(n=e.charCodeAt(i++))>255)throw new TypeError("invalid character found");t=r<<16|o<<8|n,a+=f[t>>18&63]+f[t>>12&63]+f[t>>6&63]+f[63&t]}return i?a.slice(0,i-3)+"===".substring(i):a},p=r?e=>btoa(e):o?e=>Buffer.from(e,"binary").toString("base64"):h,y=o?e=>Buffer.from(e).toString("base64"):e=>{let t=[];for(let r=0,o=e.length;r<o;r+=4096)t.push(u.apply(null,e.subarray(r,r+4096)));return p(t.join(""))},A=(e,t=!1)=>t?d(y(e)):y(e),b=e=>{if(e.length<2)return(t=e.charCodeAt(0))<128?e:t<2048?u(192|t>>>6)+u(128|63&t):u(224|t>>>12&15)+u(128|t>>>6&63)+u(128|63&t);var t=65536+1024*(e.charCodeAt(0)-55296)+(e.charCodeAt(1)-56320);return u(240|t>>>18&7)+u(128|t>>>12&63)+u(128|t>>>6&63)+u(128|63&t)},g=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,B=e=>e.replace(g,b),x=o?e=>Buffer.from(e,"utf8").toString("base64"):a?e=>y(a.encode(e)):e=>p(B(e)),C=(e,t=!1)=>t?d(x(e)):x(e),m=e=>C(e,!0),U=/[\xC0-\xDF][\x80-\xBF]|[\xE0-\xEF][\x80-\xBF]{2}|[\xF0-\xF7][\x80-\xBF]{3}/g,F=e=>{switch(e.length){case 4:var t=((7&e.charCodeAt(0))<<18|(63&e.charCodeAt(1))<<12|(63&e.charCodeAt(2))<<6|63&e.charCodeAt(3))-65536;return u(55296+(t>>>10))+u(56320+(1023&t));case 3:return u((15&e.charCodeAt(0))<<12|(63&e.charCodeAt(1))<<6|63&e.charCodeAt(2));default:return u((31&e.charCodeAt(0))<<6|63&e.charCodeAt(1))}},w=e=>e.replace(U,F),S=e=>{if(e=e.replace(/\s+/g,""),!c.test(e))throw new TypeError("malformed base64.");e+="==".slice(2-(3&e.length));let t,r,o,n="";for(let a=0;a<e.length;)t=i[e.charAt(a++)]<<18|i[e.charAt(a++)]<<12|(r=i[e.charAt(a++)])<<6|(o=i[e.charAt(a++)]),n+=64===r?u(t>>16&255):64===o?u(t>>16&255,t>>8&255):u(t>>16&255,t>>8&255,255&t);return n},E=t?e=>atob(l(e)):o?e=>Buffer.from(e,"base64").toString("binary"):S,v=o?e=>s(Buffer.from(e,"base64")):e=>s(E(e),(e=>e.charCodeAt(0))),D=e=>v(z(e)),R=o?e=>Buffer.from(e,"base64").toString("utf8"):n?e=>n.decode(v(e)):e=>w(E(e)),z=e=>l(e.replace(/[-_]/g,(e=>"-"==e?"+":"/"))),T=e=>R(z(e)),Z=e=>({value:e,enumerable:!1,writable:!0,configurable:!0}),j=function(){const e=(e,t)=>Object.defineProperty(String.prototype,e,Z(t));e("fromBase64",(function(){return T(this)})),e("toBase64",(function(e){return C(this,e)})),e("toBase64URI",(function(){return C(this,!0)})),e("toBase64URL",(function(){return C(this,!0)})),e("toUint8Array",(function(){return D(this)}))},I=function(){const e=(e,t)=>Object.defineProperty(Uint8Array.prototype,e,Z(t));e("toBase64",(function(e){return A(this,e)})),e("toBase64URI",(function(){return A(this,!0)})),e("toBase64URL",(function(){return A(this,!0)}))},O={version:e,VERSION:"3.6.0",atob:E,atobPolyfill:S,btoa:p,btoaPolyfill:h,fromBase64:T,toBase64:C,encode:C,encodeURI:m,encodeURL:m,utob:B,btou:w,decode:T,isValid:e=>{if("string"!=typeof e)return!1;const t=e.replace(/\s+/g,"").replace(/=+$/,"");return!/[^\s0-9a-zA-Z\+/]/.test(t)||!/[^\s0-9a-zA-Z\-_]/.test(t)},fromUint8Array:A,toUint8Array:D,extendString:j,extendUint8Array:I,extendBuiltins:()=>{j(),I()},Base64:{}};return Object.keys(O).forEach((e=>O.Base64[e]=O[e])),O}));
/**
 * Chrome Bookmarks Converter
 * v1.0.0
 *
 * Convert a standard exported Google Chrome bookmarks HTML file into a JavaScript oject structure.
 * 
 * Dependencies: jQuery (latest).
 *
 * @summary Use JavaScript to convert an exported Chrome bookmarks HTML file. Export the results to JSON.
 * @author Jason Snelders <jason@jsnelders.com>
 *
 * Created at     : 2019-11-14 22:34:00
 * Last modified  : 2019-11-14 22:34:00
 */
function ChromBookmarkConverter(){this.bookmarks={folders:[]},this.stripUnneededTags=function(a){return a=a.replace(/<p>/gi,""),a=a.replace(/<P>/gi,""),a=a.replace(/<dt>/gi,""),a=a.replace(/<DT>/gi,"")},this.processChromeBookmarksContent=function(a){var c,b=this;a=this.stripUnneededTags(a),c=$.parseHTML(a),$.each(c,function(a,c){if("DL"==c.tagName){var d={type:"folder",title:"未命名",items:[]};b.bookmarks.folders.push(d),b.processDL(c,1,d)}})},this.processDL=function(a,b,c){var d=this,e=0,f={},g={type:"folder",title:"",add_date:"",last_modified:"",items:[]},h={},i=$(a),j=!1;$.each(i.children(),function(a,i){var k,l,m,n,o,p,q,r,s;e+=1,k=b+"."+e,1==j&&i.tagName.toLowerCase()!="DL".toLowerCase()&&(j=!1,console.log("h3",f),g.items.push(f)),i.tagName.toLowerCase()=="DL".toLowerCase()&&(g={type:"folder",title:f.title,add_date:f.add_date,last_modified:f.last_modified,items:[]},1==j&&(j=!1),d.bookmarks.folders.push(g),d.processDL(i,k,g)),i.tagName.toLowerCase()=="H3".toLowerCase()&&(l=$(i),m=l.text()?l.text():"未命名",n=l.attr("add_date"),o=l.attr("last_modified"),f={type:"header",title:m,add_date:n,last_modified:o},j=!0),"a"==i.tagName.toLowerCase()&&isURL($(i).attr("href"))&&""!=$(i).text()&&(p=$(i),q=p.text(),r=p.attr("href"),s=p.attr("add_date"),p.attr("icon"),h={type:"link",title:q,href:r,add_date:s},c.items.push(h))})}}
