var m4 = m4 || {};

m4.puzzle = new function(){
  this.init = function(){
    this.$puzzleWrap = m4.$body.find(".puzzleWrap");
    this.$imgWrap = this.$puzzleWrap.find("li");
    this.$imgButton = this.$imgWrap.find("button");
    this.$resetBtn = m4.$body.find(".btnReset");
    this.imgLen = this.$imgWrap.not(".none").length;
    this.rowCount = 3;
    this.imgSize = parseInt(this.$imgWrap.width());
    this.$none = this.$puzzleWrap.find("li.none");


    if(localStorage.getItem("log") !== null){
        m4.log = JSON.parse(localStorage.getItem("log")); // 문자열로 저장된게 객체로 바꿔줌
        this.setHTML();
    } else{
        m4.log = [];
    }


    // 퍼즐 위치, 이미지 위치
    this.imgSetting();

    // 이미지 클릭
    this.$imgButton.on("click",this.handleClick);

    // 리셋버튼
    this.$resetBtn.on("click",this.reset);
  };

  this.imgSetting = function(){
    var arr = [];

    for(i=0; i<m4.puzzle.imgLen; i++){
      arr.push(i);
    }

    var randomKey = m4.puzzle.randomSet(arr);

    m4.puzzle.$imgWrap.each(function(idx){
      $(this).attr("data-key",idx).not(".none").each(function(){
        $(this).attr("random-key",randomKey[idx]);
      });
      var dataKey = m4.puzzle.$imgWrap.eq(idx).attr("data-key");
      var topSet =  m4.puzzle.imgSize * parseInt(dataKey/m4.puzzle.rowCount);
      var leftSet = m4.puzzle.imgSize * parseInt(dataKey%m4.puzzle.rowCount); 
      $(this).css({
        "top":topSet,
        "left":leftSet
      });

      var bgSet = $(this).not(".none").attr("random-key");      
      var bgLeftSet = -(m4.puzzle.imgSize * parseInt(bgSet%m4.puzzle.rowCount)); 
      var bgTopSet = -(m4.puzzle.imgSize * parseInt(bgSet/m4.puzzle.rowCount));

      $(this).find("button").css({
        "background-position-x":bgLeftSet,
        "background-position-y":bgTopSet
      });
    });
  };

  this.randomSet = function(num){
    for (var i = num.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = num[i];
        num[i] = num[j];
        num[j] = temp;
    }
    return num;
  }

  this.handleClick = function(){
    var _this = $(this).parent();
    var clickTop = parseInt(_this.css("top"));
    var clickLeft = parseInt(_this.css("left"));
    var noneTop = parseInt(m4.puzzle.$none.css("top"));
    var noneLeft = parseInt(m4.puzzle.$none.css("left"));
    var _thisKey = parseInt($(this).parent().attr("random-key"))+1;

    // 빈 퍼즐 상하좌우
    var topPlus = noneTop+m4.puzzle.imgSize;
    var topMinus = noneTop-m4.puzzle.imgSize;
    var leftPlus = noneLeft+m4.puzzle.imgSize;
    var leftMinus = noneLeft-m4.puzzle.imgSize;
    
    if(clickTop === noneTop && clickLeft === leftMinus || clickTop === noneTop && clickLeft === leftPlus || clickTop === topMinus && clickLeft === noneLeft || clickTop === topPlus && clickLeft === noneLeft){
      if(_this.is(":animated") === false && m4.puzzle.$none.is(":animated") === false){
        m4.puzzle.$none.animate({
          "top":clickTop,
          "left":clickLeft
        }, 200);
        
        _this.animate({
          "top":noneTop,
          "left":noneLeft
        }, 200);
      }
    }

    m4.log.push({ key:_thisKey, x:clickTop, y:clickLeft });
    localStorage.setItem('log', JSON.stringify(m4.log)); //저장
    JSON.parse(localStorage.getItem('log')); //받을때
    m4.puzzle.addHTML(_thisKey, clickTop, clickLeft);
  }

  this.setHTML = function(){
    var html = "";
    for(var i=0; i<m4.log.length; i++){
        html += "<p>Key : "+m4.log[i].key+" X : "+m4.log[i].x+" Y : "+m4.log[i].y+"</p>";
    }
    $( ".logWrap" ).append(html);
  }

  this.addHTML = function(key,x,y){
    var html = "";
    html += "<p>Key : "+key+" X : "+x+" Y : "+y+"</p>";
    $( ".logWrap" ).append(html);
  }

  this.reset = function(){
    m4.puzzle.imgSetting();
    localStorage.removeItem("log");
    $( ".logWrap" ).html("");
  }
  

};

$(function(){
  m4.$body = $("body");
  m4.puzzle.init();
});