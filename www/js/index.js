document.addEventListener('deviceready', onDeviceReady, false);
var douban_api_url = 'https://api.douban.com/v2/movie/';
douban_api_key = '0cfdeb465927f92f26f9c1d30b77eb8d';
function onDeviceReady() {
  navigator.splashscreen.hide();
  //注册后退按钮
  document.addEventListener("backbutton", function (e) {
    if (J.hasMenuOpen) {
      J.Menu.hide();
    } else if (J.hasPopupOpen) {
      J.closePopup();
    } else {
      var sectionId = $('section.active').attr('id');
      if (sectionId == 'index_section') {
        J.confirm('提示', '是否退出程序？', function () {
          navigator.app.exitApp();
        });
      } else {
        window.history.go(-1);
      }
    }
  }, false);
};
var view_movieid = null;
var view_celebrityid = null;
//处理电影搜索列表
function parseMovielist(json) {
  var html = '';
  if (json.total == 0) {
    J.hideMask();
    J.showToast('没搜到相关电影:(', 'error');
  } else {
    $.each(json.subjects, function (i, item) {
      html += '<li id="' + item.id + '" data-selected="selected">'
        + '<a href="#movie_section" data-target="section">'
        + '<strong>' + item.title + '</strong>'
        + '<p>评分:<span class="label">' + item.rating.average + '/' + item.rating.max + '</span>' + parseInt(item.rating.stars) + '&hearts;</p>'
        + '<p>年份:' + item.year + '</p></a>'
        + '<span><img src="' + item.images.small + '?apikey=' + douban_api_key + '" alt="' + item.title + '" title="' + item.title + '"/></span>'
        + '</li>';
    });
    $('#movie_search_list').html(html);
    J.Scroll('#index_section article');//刷新滚动条
    J.hideMask();
  }
  return false;
};

var App = (function () {
  var pages = {};
  var run = function () {
    //代理每个 section为一个page页面
    $.each(pages, function (k, v) {
      var sectionId = '#' + k + '_section';
      $('body').delegate(sectionId, 'pageinit', function () {
        v.init && v.init.call(v);
      });
      $('body').delegate(sectionId, 'pageshow', function (e, isBack) {
        //页面加载的时候都会执行
        v.show && v.show.call(v);
        //后退时不执行
        if (!isBack && v.load) {
          v.load.call(v);
        }
      });
    });

    //添加动画效果
    J.Transition.add('flip', 'slideLeftOut', 'flipOut', 'slideRightOut', 'flipIn');

    //启动时动作初始化
    Jingle.launch({
      showWelcome: true,
      welcomeSlideChange: function (i) {
        switch (i) {
          case 0 :
            J.anim('#welcome_jingle', 'welcome_jinlge', 1000);
            break;
          case 1 :
            $('#r_head,#r_body,#r_hand_left,#r_hand_right,#r_foot_left,#r_foot_right').hide()
            J.anim($('#r_head').show(), 'r_head', 500, function () {
              J.anim($('#r_body').show(), 'r_body', 1200, function () {
                J.anim($('#r_hand_left').show(), 'r_hand_l', 500);
                J.anim($('#r_hand_right').show(), 'r_hand_r', 500, function () {
                  J.anim($('#r_foot_left').show(), 'r_foot_l', 500);
                  J.anim($('#r_foot_right').show(), 'r_foot_r', 500, function () {
                    J.anim('#welcome_robot', 'welcome_robot', 2000);
                  });
                });
              });
            });
            break;
          case 2 :
            $('#w_box_1,#w_box_2,#w_box_3,#w_box_4').hide()
            J.anim($('#w_box_1').show(), 'box_l', 500, function () {
              J.anim($('#w_box_2').show(), 'box_r', 500, function () {
                J.anim($('#w_box_3').show(), 'box_l', 500, function () {
                  J.anim($('#w_box_4').show(), 'box_r', 500);
                });
              });
            });
            break;
        }
      },
      showPageLoading: true,
      remotePage: {
        '#about_section': 'html/about_section.html'
      }
    });

  };
  var page = function (id, factory) {
    return ((id && factory) ? _addPage : _getPage).call(this, id, factory);
  }
  var _addPage = function (id, factory) {
    pages[id] = new factory();
  };
  var _getPage = function (id) {
    return pages[id];
  }
  //动态计算chart canvas的高度，宽度，以适配终端界面
  var calcChartOffset = function () {
    return {
      height: $(document).height() - 44 - 30 - 60,
      width: $(document).width()
    }

  }
  return {
    run: run,
    page: page,
    calcChartOffset: calcChartOffset
  }
}());

App.page('index', function () {
  this.init = function () {
    //搜索关键字
    $('#search_btn').on('tap', function () {
      var search_key = $('#input_search_key').val().trim();
      if (search_key.length == 0) {
        J.showToast('你想搜啥...', 'info');
        $('#input_search_key').focus();
        return false;
      }
      if (!(/^[\u0391-\uFFE5A-Z0-9a-z]+$/.test(search_key))) {
        J.showToast('只能输中英文、数字，中间无空格', 'error');
        $('#input_search_key').focus();
        return false;
      } else {
        J.showMask();
        //这里可以去抓取数据了 url, data, success, dataType
        $.getJSON(douban_api_url + 'search?q=' + search_key + '&apikey=' + douban_api_key + '&count=10&callback=?', function (remoteData) {
          parseMovielist(remoteData)
        });
      }
    });


    //点击电影条目
    $('#movie_search_list').on('tap', function (e) {
      var obj = e.target || e.srcElement;
      view_movieid = $(obj).parents('li').attr('id');
    });

    $('#btn_show_welcome').on('tap', function () {
      console.log('shioiiiit ititiiti ');

      //$('#btn_show_welcome').attr('href', '#movie_seciton');
    });


  }
});

App.page('movie', function () {
  //每次show的时候，加载数据更新模板数据
  this.show = function () {
    if (view_movieid && parseInt(view_movieid) > 0) {
      var viewedid = $('#moviedetail').attr('viewed');
      if (viewedid != view_movieid) {
        J.showMask();
        //获取是哪部电影哦
        $.getJSON(douban_api_url + 'subject/' + view_movieid + '?apikey=' + douban_api_key + '&callback=?', function (remoteData) {
          J.tmpl('#movie_section', 'movie_tpl', remoteData);
          //点击影人条目
          $('.celebrity').on('tap', function (e) {
            var obj = e.target || e.srcElement;
            var celebrityid = $(obj).parents('.celebrity').attr('id');
            view_celebrityid = celebrityid;
            if (parseInt(celebrityid) == 0) {
              return false;
            }
            J.showMask();
            $.getJSON(douban_api_url + 'celebrity/' + celebrityid + '?apikey=' + douban_api_key + '&callback=?', function (remoteData) {
              J.tmpl('#celebrity_section', 'celebrity_tpl', remoteData);
              $('.celebritywork').on('tap', function (e) {
                var obj = e.target || e.srcElement;
                view_movieid = $(obj).parents('.celebritywork').attr('id');
                console.log(view_movieid);
              });
              J.Scroll('#celebritydetail');//刷新滚动条
              J.hideMask();
            });
          });

          J.Scroll('#moviedetail');//刷新滚动条
          J.hideMask();
        });
      }

    } else {
      window.history.go(-1);
    }
  }
});

App.page('celebrity', function () {
  //每次show的时候，加载数据更新模板数据
  this.show = function () {
    if (view_celebrityid == null || parseInt(view_celebrityid) == 0) {
      window.history.go(-1);
    }
  }
});


App.page('viewhistory', function () {
  //每次show的时候，加载数据更新模板数据
  this.show = function () {
    //cong localstorage里面 查询数据


    if (view_celebrityid == null || parseInt(view_celebrityid) == 0) {
      window.history.go(-1);
    }
  }
});


$(function () {
  App.run();
});