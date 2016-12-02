/**
 * Created by humengtao on 2016/12/1.
 */
(function ($, document) {
    function Game(el, option, callback) {
        this.el = el;
//          包括所有block对象的数组
        this.blocks = [];
//          值为空的block对象的数组
        this.emptyBlocks = [];

        this.defaults = {
//              定义空白格颜色
            emptyColor: '#eeeeee',
//              定义从 2 到 2048 的颜色
            blockColor_2: '#2e6da4',
            blockColor_4: '#31b0d5',
            blockColor_8: '#eea236',
            blockColor_16: '#f0ad4e',
            blockColor_32: '#c9302c',
            blockColor_64: '#337ab7',
            blockColor_128: '#398439',
            blockColor_256: '#449d44',
            blockColor_512: '#269abc',
            blockColor_1024: '#ac2925',
            blockColor_2048: '#2c2c2c',
            size: 500
        };
//         限制最小的size为200
        option.size = (option.size < 200) ? 200 : option.size;

        this.options = $.extend({}, this.defaults, option);
        this.callback = (!!callback) ? callback : function () {
            alert('game over');
        };
    }

//      定义Game的所有方法
    Game.prototype = {
        start() {
            for (var i = 0; i < 16; i++) {

                //初始化16个block对像，并把 isEmpty 设置为 true
                this.blocks.push(new Block('', i, true));
                this.emptyBlocks.push(new Block('', i, true));

                //容器加入16个div映射
                this.el.append('<div class="block" id="block' + i + '" data-position=' + i + '>').css({
                    width: this.options.size + 'px',
                    height: this.options.size + 'px',
                });

                $('.block').css({
                    margin: 0,
                    padding: 10 + 'px',
                    width: ((this.options.size / 4) - 23) + 'px',
                    height: ((this.options.size / 4) - 23) + 'px',
                    float: 'left',
                    color: '#fff',
                    borderWidth: 1 + 'px',
                    borderColor: '#fff',
                    borderStyle: 'double',
                    fontSize: (((this.options.size / 4) - 23) / 2) + 'px',
                    lineHeight: ((this.options.size / 4) - 23) + 'px',
                    textAlign: 'center',
                    transition: 0.4 + 's',
                    borderRadius: 10 + '%',
                    backgroundColor: this.options.emptyColor,
                });
            }

//              渲染页面
            this.loadHtml();

//              启动键盘事件监听
            this.moveListener();
        },

        moveListener() {
            var _this = this;
            var rowAll = [];

            $(document).keypress(function (e) {
//                  检测按下键的charCode
                switch (e.charCode) {
                    case 119:
                        rowAll = _this.getArrByFormat('column', 'asc');
                        break;
                    case 115:
                        rowAll = _this.getArrByFormat('column', 'desc');
                        break;
                    case 100:
                        rowAll = _this.getArrByFormat('row', 'desc');
                        break;
                    case 97:
                        rowAll = _this.getArrByFormat('row', 'asc');
                        break;
                    default:
                        return false;
                }

//                  开始移动
                _this.move(rowAll);

//                  移动完成产生新的block
                _this.newBlock();

//                  渲染页面
                _this.loadHtml();

            });
        },

        move(rowAll){
            var _this = this;
            rowAll.map(function (el, index) {

//                  标记位，表示有值且不能合并的 block 个数
                var count = 0;

                for (var i = 1; i < 4; i++) {
                    for (var j = i; j > count; j--) {
                        if (el[j - 1].value == 0) {
                            el[j - 1].value = el[j].value;
                            el[j].value = 0;
                        } else if (el[j].value != 0 && el[j - 1].value != 0) {
                            if (el[j].value == el[j - 1].value) {
                                el[j - 1].value *= 2;
                                el[j].value = 0;
                            }
//                              每合并成功或者失败以后 count++
                            count++;
                        }
                        _this.setValue(el[j].value, el[j].position);
                        _this.setValue(el[j - 1].value, el[j - 1].position);
                    }
                }
            });
        },

//          根据输入参数将16个block 按行或列，顺序和倒序分为四个数组
        getArrByFormat(direction, order){
            var _this = this;

//              获取所有block
            var arr = this.getAllBlocks();

//              建立四个数组分别承载每 行/列 的block
            var row1 = [];
            var row2 = [];
            var row3 = [];
            var row4 = [];

//              rowAll用于承载格式化后的 row1 ,row2, row3, row4
            var rowAll = [];

            switch (direction) {

//                  按行进行格式化
                case 'row':
                    arr.map(function (el) {
                        if (el.position >= 0 && el.position <= 3) {
                            row1.push(el)
                        }
                        else if (el.position >= 4 && el.position <= 7) {
                            row2.push(el)
                        }
                        else if (el.position >= 8 && el.position <= 11) {
                            row3.push(el)
                        }
                        else if (el.position >= 12 && el.position <= 15) {
                            row4.push(el)
                        }
                    });
                    switch (order) {

                        case 'asc':
                            break;
                        case 'desc':
                            row1.reverse();
                            row2.reverse();
                            row3.reverse();
                            row4.reverse();
                            break;
                    }
                    break;

//                  按列进行格式化
                case 'column':
                    arr.map(function (el) {
                        if (el.position % 4 == 0) {
                            row1.push(el)
                        }
                        else if (el.position % 4 == 1) {
                            row2.push(el)
                        }
                        else if (el.position % 4 == 2) {
                            row3.push(el)
                        }
                        else if (el.position % 4 == 3) {
                            row4.push(el)
                        }
                    });
                    switch (order) {
                        case 'asc':
                            break;
                        case 'desc':
                            row1.reverse();
                            row2.reverse();
                            row3.reverse();
                            row4.reverse();
                            break;
                    }
                    break;
                default:
                    break;
            }

            rowAll.push(row1, row2, row3, row4);
            return rowAll;
        },

        getAllBlocks(){
            var arr = [];
            this.blocks.map(function (el) {
                arr.push(el);
            });
            return arr;
        },

        newBlock() {
            var _this = this;
            if (this.emptyBlocks.length == 1) {
                _this.createBlock();
            } else {
                for (var i = 0; i < 2; i++) {
                    _this.createBlock();
                }
            }
        },

        createBlock() {

//              刷新 emptyBlocks 数组(因为再方块移动后产生了变化，必须刷新)
            this.freshEmptyBlocks();

//              产生随机数，最大不能超过emptyBlocks 数组的长度
            var randomPosition = ~~(Math.random() * (this.emptyBlocks.length));

//              设置新block的初始值
            this.setValue(2, this.emptyBlocks[randomPosition].position);

//              再次刷新 emptyBlocks(因为产生了变化，必须刷新)；
            this.freshEmptyBlocks();
        },

        freshEmptyBlocks() {
            var _this = this;
            this.emptyBlocks = [];
            this.blocks.map(function (el) {
                if (el.value == 0) {
                    el.value = '';
                }
                if (el.isEmpty == true) {
                    _this.emptyBlocks.push(el);
                }

            });
        },

        loadHtml(){
            var _this = this;
            $('.block').map(function (index) {
                var bgColor = _this.blocks[index].bgColor;
                $('.block:nth-child(' + (index + 1) + ')').css('backgroundColor', bgColor).html(_this.blocks[index].value);
            });

//                当没有空block 进行判断游戏是否结束
            if (_this.emptyBlocks.length == 0) {
                if (_this.isEnd()) {
                    setTimeout(()=> {
                        _this.callback();
                    }, 500);
                }
            }
        },

        setEmpty(isEmpty, index){
            this.blocks[index].isEmpty = isEmpty;
        },

        setValue(value, index){
            var _this = this;
            this.blocks[index].value = value;
            if (value == 0) {
                this.blocks[index].bgColor = _this.options.emptyColor;
                _this.setEmpty(true, index);
            } else {
                switch (value) {
                    case 2:
                        this.blocks[index].bgColor = this.options.blockColor_2;
                        break;
                    case 4:
                        this.blocks[index].bgColor = this.options.blockColor_4;
                        break;
                    case 8:
                        this.blocks[index].bgColor = this.options.blockColor_8;
                        break;
                    case 16:
                        this.blocks[index].bgColor = this.options.blockColor_16;
                        break;
                    case 32:
                        this.blocks[index].bgColor = this.options.blockColor_32;
                        break;
                    case 64:
                        this.blocks[index].bgColor = this.options.blockColor_64;
                        break;
                    case 128:
                        this.blocks[index].bgColor = this.options.blockColor_128;
                        break;
                    case 256:
                        this.blocks[index].bgColor = this.options.blockColor_256;
                        break;
                    case 512:
                        this.blocks[index].bgColor = this.options.blockColor_512;
                        break;
                    case 1024:
                        this.blocks[index].bgColor = this.options.blockColor_1024;
                        break;
                    case 2048:
                        this.blocks[index].bgColor = this.options.blockColor_2048;
                        break;
                }
                _this.setEmpty(false, index);
            }
        },

        isEnd(){
            var arr = this.getAllBlocks();
            var isEnd = true;
            arr.map(function (el, index) {
                if (!!arr[index + 1]) {
                    if (arr[index].value == arr[index + 1].value) {
                        isEnd = false;
                    }
                }
                if (!!arr[index - 1]) {
                    if (arr[index].value == arr[index - 1].value) {
                        isEnd = false;
                    }
                }
                if (!!arr[index + 4]) {
                    if (arr[index].value == arr[index + 4].value) {
                        isEnd = false;
                    }
                }
                if (!!arr[index - 4]) {
                    if (arr[index].value == arr[index - 4].value) {
                        isEnd = false;
                    }
                }
            });
            return isEnd;
        }
    };

    function Block(value, position, isEmpty) {
        this.value = value;
        this.position = position;
        this.isEmpty = isEmpty;
        this.bgColor = null;
    }

    $.fn.game = function (option, callback) {
        new Game(this, option, callback).start();
        return this;
    }
})(jQuery, document);