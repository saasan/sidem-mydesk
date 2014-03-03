/* jshint indent: 2, browser: true */
/* global SideMMyDesk */
var SideMMyDeskUI;

(function(){
  'use strict';

  /**
   * SideMマイデスク風ジェネレーターのUI
   * @constructor
   */
  SideMMyDeskUI = function() {
  };

  SideMMyDeskUI.prototype = {
    /** SideMMyDesk */
    sidem : null,

    /**
     * D&Dのデフォルトの動作をキャンセルする
     */
    _doNothing: function(evt) {
      evt.stopPropagation();
      evt.preventDefault();
    },

    /**
     * 画像を取得する
     */
    _getImage: function(dt, image) {
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
    },

    /**
     * ドロップ時の処理を行う
     */
    _onDrop: function() {
      var self = this;
      return (function(evt) {
        self._doNothing(evt);

        // ドロップされた座標を調べる
        var rect = evt.target.getBoundingClientRect();
        var x = evt.clientX - rect.left;
        var y = evt.clientY - rect.top;
        // ドロップされた場所のコマを得る
        var n = self.sidem.isPointInFrame(x, y);

        document.getElementById('message').textContent = 'pos: ' + x + ', ' + y + ' - ' + n;

        // ドロップされた場所がコマ外なら終了
        if (n === null) return;

        var dt = evt.dataTransfer;
        var image = new Image();

        // 画像の読み込みが完了したら設定する
        image.addEventListener('load', function() {
          self.sidem.setImage(n, image);
        }, false);

        // 画像を取得する
        self._getImage(dt, image);
      });
    },

    /**
     * 名前が変更された時の処理を行う
     */
    _onChangeName: function() {
      var self = this;
      return (function() {
        var n = parseInt(this.dataset.number, 10);
        self.sidem.setName(n, this.value);
      });
    },

    /**
     * 台詞が変更された時の処理を行う
     */
    _onChangeLine: function(evt) {
      var self = this;
      return (function() {
        var n = parseInt(this.dataset.number, 10);
        self.sidem.setLine(n, this.value);
      });
    },

    /**
     * ロード時の処理を行う
     */
    onLoad: function() {
      var i, e;

      this.sidem = new SideMMyDesk();

      // キャンバスを初期化
      e = document.getElementById('sidem-mydesk');
      this.sidem.setCanvas(e).drawBase();
  /*
        e.addEventListener('mousemove', function(e){
        var rect = e.target.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;

        document.getElementById('message').textContent = 'pos: ' + x + ', ' + y + ' - ' + this.sidem.isPointInFrame(x, y);
      }, false);
  */
      // D&Dの設定
      e.addEventListener('dragenter', this._doNothing, false);
      e.addEventListener('dragover', this._doNothing, false);
      e.addEventListener('drop', this._onDrop(), false);

      // 名前の設定
      e = document.querySelectorAll('input.name');
      for (i = 0; i < e.length; i++) {
        e[i].addEventListener('input', this._onChangeName(), false);
      }

      // 台詞の設定
      e = document.querySelectorAll('input.line');
      for (i = 0; i < e.length; i++) {
        e[i].addEventListener('input', this._onChangeLine(), false);
      }
    }
  };
})();
