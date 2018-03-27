(function(){

  'use strict';

  // 记录执行次数
  var n_int_num = 0;
  var n_int_numForTest = 0;

  // 测试函数
  var fun_calculateLayout = function (params) {
    n_int_num++;
    console.log("calculateLayout do : "+n_int_num);
    console.log(params);
  }

  //测试函数
  var fun_test = function(params){
    n_int_numForTest++;
    console.log("fun_test do : "+n_int_numForTest);
  }

  var fun_delayDo = _.debounce(fun_calculateLayout, 1000);

  var fun_delayNormal = _.debounce(fun_calculateLayout, 1000);

  var fun_delayDoAllFalse =  _.debounce(
      fun_calculateLayout, 
      1000,
      {
        'leading': false,
        'trailing': false
      }
  );

  var fun_delayLeadingTrue =  _.debounce(
      fun_calculateLayout, 
      1000,
      {
        'leading': true,
        'trailing': false
      }
  );

  var fun_delayLeadingTrueAndNone =  _.debounce(
      fun_calculateLayout, 
      1000,
      {
        'leading': true
      }
  );

  var fun_delayTrailingTrue =  _.debounce(
      fun_calculateLayout, 
      1000,
      {
        'leading': false,
        'trailing': true
      }
  );

  var fun_delayAllTrue =  _.debounce(
      fun_calculateLayout, 
      1000,
      {
        'leading': true,
        'trailing': true
      }
  );

  var fun_delayDoTime0 = _.debounce(fun_calculateLayout, 0);

  var fun_delayleadingFalseTime0 =  _.debounce(
      fun_calculateLayout, 
      0,
      {
        'leading': false
      }
  );

  var fun_delayMaxWait =  _.debounce(
      fun_calculateLayout, 
      1000,
      {
        maxWait:'2000'
      }
  );

  // 此方法只会在 resize 结束时，延后一秒执行
  jQuery(window).on('resize', fun_delayDo);
  // 此方法只会在 resize 过程中一直执行
  jQuery(window).on('resize', fun_test);

  //取消下一次的延迟函数的执行
  $(".js-btn-stop").click(function(){
    fun_delayDo.cancel();
  });

  //默认无参数
  $(".js-btn-normal").click(function(){
    fun_delayNormal("normal");
  });

  //trailing，leading都为false
  $(".js-btn-all-false").click(function(){
    fun_delayDoAllFalse("allFalse");
  });

  //leading为true，trailing为false
  $(".js-btn-leading").click(function(){
    fun_delayLeadingTrue("leading");
  });

  //参数：leading为true，trailing没有
  $(".js-btn-leading-notrailing").click(function(){
    fun_delayLeadingTrueAndNone("leading-notrailing");
  });

  //参数：trailing 为 true 时
  $(".js-btn-trailing").click(function(){
    fun_delayTrailingTrue("trailing");
  });

  //参数：trailing，leading都为true
  $(".js-btn-trailing-leading").click(function(){
    fun_delayAllTrue("trailing-leading");
  });

  //执行时间设置为 0 的执行
  $(".js-btn-time0").click(function(){
    fun_delayDoTime0("time0");
  });

  //参数：leading 为 false 时 并且 wait 为 0
  $(".js-btn-leadingTime0").click(function(){
    fun_delayleadingFalseTime0("leading 为 false 时 并且 wait 为 0");
  });

  //参数：maxWait
  $(".js-btn-maxWait").click(function(){
    fun_delayMaxWait("参数：maxWait");
  });




}());