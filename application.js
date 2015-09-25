$(document).ready(function(){
  console.log("jquery is running")
  //
  // var h = $(window).height();
  // var w = $(window).width()*.9;
  //
  // console.log("h", h)
  // $('.pic').css('height', h+'px');
  // $('.pic').css('width', w+'px');

  // function set_body_height() { // set body height = window height
  //   $('body').height($(window).height());
  // }
  //
  // $(window).bind('resize', set_body_height);
  // set_body_height();


  $("img").photoResize({
    bottomSpacing: 15
  });


})
