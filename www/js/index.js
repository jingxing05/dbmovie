document.addEventListener('deviceready', onDeviceReady, false);
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
}
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
    $('#btn_show_welcome').on('tap', J.Welcome.show);
  }
});
App.page('form', function () {
  this.init = function () {
    $('#checkbox_1').on('change', function () {
      alert($(this).data('checkbox'));
    })
  }
});
$(function () {
  App.run();
});