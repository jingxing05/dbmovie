document.addEventListener('deviceready', onDeviceReady, false);
var douban_api_url = 'https://api.douban.com/v2/movie/';
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
      if (parseInt(view_movieid) == 0) {
        return false;
      }
    });

    $('#btn_show_welcome').on('tap', function () {


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
          });
          record_viewed_Item(remoteData, 'movie');
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
    var viewedid = $('#celebritydetail').attr('viewed');
    if (viewedid != view_celebrityid) {
    J.showMask();
    $.getJSON(douban_api_url + 'celebrity/' + view_celebrityid + '?apikey=' + douban_api_key + '&callback=?', function (remoteData) {
      J.tmpl('#celebrity_section', 'celebrity_tpl', remoteData);
      $('.celebritywork').on('tap', function (e) {
        var obj = e.target || e.srcElement;
        view_movieid = $(obj).parents('.celebritywork').attr('id');
      });
      record_viewed_Item(remoteData, 'celebrity');
      J.Scroll('#celebritydetail');//刷新滚动条
      J.hideMask();
    });
    }
  }
});
var histroy_type = ['movie', 'celebrity'];

App.page('viewhistory', function () {
  this.init = function () {
    $('#empty_history').on('tap', function () {
      if (window.localStorage && window.localStorage.getItem) {
        $.each(histroy_type, function (i, atp) {
          window.localStorage.removeItem('history' + atp);
          $('#history_' + atp).find('ul').html('<li>木有lishi</li>');
          J.Scroll('#history_' + atp);
        });
      }
    });

    $('#history_movie ul').on('tap', function (e) {
      var obj = e.target || e.srcElement;
      view_movieid = $(obj).parents('li').attr('id');
    });

    $('#history_celebrity ul').on('tap', function (e) {
      var obj = e.target || e.srcElement;
      view_celebrityid = $(obj).parents('li').attr('id');
    });
  }


  //每次show的时候，加载数据更新模板数据
  this.show = function () {
    //localStorage里面 查询数据
    if (window.localStorage && window.localStorage.getItem) {

      $.each(histroy_type, function (i, atp) {
        var history_items = window.localStorage.getItem('history' + atp);
        if (null !== history_items && undefined !== history_items) {
          history_items = $.parseJSON(history_items);
          var lihtml = '';
          $.each(history_items, function (i, item) {
            lihtml += '<li id="' + item.id + '" data-selected="selected">'
              + '<a href="#' + atp + '_section" data-target="section">'
              + '<strong>' + item.name + '</strong>'
              + '<p>&nbsp;</p></a>'
              + '<span><img src="' + item.image + '?apikey=' + douban_api_key + '" alt="' + item.name + '" title="' + item.name + '"/></span>'
              + '</li>';
          });
          $('#history_' + atp).find('ul').html(lihtml);
          J.Scroll('#history_' + atp);
        }
      });
    } else {
      console.log('浏览器不支持本地存储');
    }
  }
});


$(function () {
  App.run();
});
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

function record_viewed_Item(item, type) {
  if (window.localStorage && window.localStorage.getItem) {
    var viewed_type = type || 'movie';
    var item_brief = {};
    item_brief.id = item.id;
    if ('movie' == viewed_type) {
      item_brief.name = item.title;
      item_brief.image = item.images.medium;
    } else {
      item_brief.name = item.name;
      item_brief.image = item.avatars.small;
    }
    var history_items = window.localStorage.getItem('history' + viewed_type);

    if (null === history_items || undefined === history_items) {
      history_items = [];
    } else if (history_items.indexOf(JSON.stringify(item_brief)) >= 0) {
      return false;
    } else {
      history_items = $.parseJSON(history_items);
    }
    history_items.push(item_brief);
    window.localStorage.setItem('history' + viewed_type, JSON.stringify(history_items));
  } else {
       console.error('浏览器不支持本地存储');
  }
}