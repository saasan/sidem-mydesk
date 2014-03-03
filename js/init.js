/* jshint indent: 2, browser: true */
/* global SideMMyDesk */

(function(){
  'use strict';

  var sidem = new SideMMyDesk();

  var doNothing = function(evt) {
    evt.stopPropagation();
    evt.preventDefault();
  };

  var getImage = function(dt, image) {
    // 選択されたファイルを取得
    var file = dt.files[0];

    if (typeof file === 'undefined') {
      var regexp = /^https?:\/\/.+\.(png|jpg|jpeg|gif)(\?[^\?]+)?$/;
      var uri = dt.getData('text/uri-list');
      var plain = dt.getData('text/plain');

      if (typeof uri === 'string' && regexp.test(uri)) {
        image.src = uri;
      }
      else if (typeof plain === 'string' && regexp.test(plain)) {
        image.src = plain;
      }
    }
    else {
      // 画像ファイル以外は処理中止
      if (!file.type.match(/^image\/(png|jpeg|gif)$/)) return;

      var reader = new FileReader();

      // ファイルの読み込みが完了したら設定する
      reader.addEventListener('load', function(evt) {
        image.src = evt.target.result;
      }, false);

      // ファイルを読み込む
      reader.readAsDataURL(file);
    }
  };

  var onDrop = function(evt) {
    doNothing(evt);

    var rect = evt.target.getBoundingClientRect();
    var x = evt.clientX - rect.left;
    var y = evt.clientY - rect.top;

    document.getElementById('message').textContent = 'pos: ' + x + ', ' + y + ' - ' + sidem.isPointInFrame(x, y);
/*
    var n = parseInt(this.dataset.number, 10);

    var dt = evt.dataTransfer;
    var image = new Image();

    // 画像の読み込みが完了したら設定する
    image.addEventListener('load', function() {
      sidem.setImage(n, this);
    }, false);

    // 画像を取得する
    getImage(dt, image);*/
  };

  var onChangeName = function(evt) {
    var n = parseInt(this.dataset.number, 10);
    sidem.setName(n, this.value);
  };

  var onChangeLine = function(evt) {
    var n = parseInt(this.dataset.number, 10);
    sidem.setLine(n, this.value);
  };

  var onLoad = function() {
    var i, e;

    // キャンバスを初期化
    var e = document.getElementById('sidem-mydesk');
    sidem.setCanvas(e).drawBase();
/*    e.addEventListener('mousemove', function(e){
      var rect = e.target.getBoundingClientRect();
      var x = e.clientX - rect.left;
      var y = e.clientY - rect.top;

      document.getElementById('message').textContent = 'pos: ' + x + ', ' + y + ' - ' + sidem.isPointInFrame(x, y);
    }, false);

    // ドロップエリアの設定
    e = document.querySelectorAll('div.drop-area');
    for (i = 0; i < e.length; i++) {
      e[i].addEventListener('dragenter', doNothing, false);
      e[i].addEventListener('dragover', doNothing, false);
      e[i].addEventListener('drop', onDrop, false);
    }*/
    e.addEventListener('dragenter', doNothing, false);
    e.addEventListener('dragover', doNothing, false);
    e.addEventListener('drop', onDrop, false);

    // 名前の設定
    var e = document.querySelectorAll('input.name');
    for (i = 0; i < e.length; i++) {
      e[i].addEventListener('input', onChangeName, false);
    }

    // 台詞の設定
    var e = document.querySelectorAll('input.line');
    for (i = 0; i < e.length; i++) {
      e[i].addEventListener('input', onChangeLine, false);
    }
  };

  window.addEventListener('load', onLoad, false);
})();
