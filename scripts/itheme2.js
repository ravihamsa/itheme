var siteList = [
    {
        label: 'My Super Movies',
        url: 'http://mysupermovies.com'
    },
    {
        label: 'DSNR Media Group',
        url: 'http://www.dsnrmg.com'
    },
    {
        label: 'BIGLOBE',
        url: 'http://s.webry.info/'
    },
    {
        label: 'ESPN Cricinfo',
        url: 'http://m.espncricinfo.com/'
    },
    {
        label: 'Techcrunch',
        url: 'http://techcrunch.com/'
    },
    {
        label: 'IMDB',
        url: 'http://m.imdb.com/'
    },
    {
        label: 'Star Sports',
        url: 'http://m.starsports.com/smartwap/main.aspx#home-tab_featured'
    },
    {
        label: 'Goal',
        url: 'http://m.goal.com/s/en-india'
    },
    {
        label: 'Myntra',
        url: 'http://www.myntra.com/'
    },
    {
        label: 'Jabong',
        url: 'http://m.jabong.com/'
    },
    {
        label: 'NDTV',
        url: 'http://m.ndtv.com/'
    },
    {
        label: 'Business Insider',
        url: 'http://www.businessinsider.in/'
    }
];


var getGlobalCallback = function (context) {
    var callback = function (fullData) {
        var data = fullData.colors;
        var colors = [];
        for (var i = 0; i < 25; i++) {
            var colorObj = data[i];
            if (colorObj && colorObj.color) {
                colorObj = colorObj.color;
                colors.push(pusher.color('rgb', colorObj.red, colorObj.green, colorObj.blue).hex6());
            }
        }
        context.renderBanner(colors, fullData.font);
    }
    var callbackName = 'callback_' + new Date().getTime().toString() + '_' + Math.round(Math.random() * 1000000);
    window[callbackName] = callback;
    return callbackName;
}


var AdDemo = function (config) {
    this.root = $('<div class="demo-item"></div>');
    /*
     this.root.css({
     right: config.rightPos
     })

     */
    this.root.appendTo('#demoContainer');
    this.scriptUrl = config.scriptUrl;
    this.onRenderAd = config.onRenderAd;

    this.container = config.container;

    this.getButtonColor = config.getButtonColor;
}

AdDemo.prototype = {
    setSite: function (site) {
        this.site = site;
        this.renderIFrame();
        this.loadColors();

        if (this.bannerElement) {
            TweenLite.to(this.bannerElement, animationSpeed, {css: {opacity: 0, scale: 0}});
        }

        if (this.iframeElement) {
            //TweenLite.to(this.iframeElement, animationSpeed, {css: {opacity: 0, scale: 0}});
        }
    },
    renderIFrame: function () {
        var element = this.iframeElement;
        if (!element) {
            element = $('<iframe  class="preview"  width="320" height="430"></iframe>')
            element.appendTo(this.root);
            this.iframeElement = element;
        }
        element.prop('src', this.site);
        //TweenLite.to(element, animationSpeed, {css: {opacity: 1, scale: 1}});
    },
    loadColors: function () {
        var _this = this;
        var element = this.scriptElement;
        if (element) {
            element.remove();
        }
        element = $('<script></script>')
        var callbackName = getGlobalCallback(this);
        element.prop('onload', function () {
            if (_this.onRenderAd) {
                setTimeout(_this.onRenderAd, 1000);
            }
        });

        element.prop('src', this.scriptUrl + '&callback=' + callbackName + '&url=' + this.site);
        element.appendTo(this.root);
        this.scriptElement = element;


    },
    renderBanner: function (colorArray, font) {

        var grayCount = 0;

        var colorObjectsArray = _.map(colorArray, function (colorString) {
            return  pusher.color(colorString);
        })

        colorObjectsArray = _.filter(colorObjectsArray, function (item) {
            var isGray = (item.red() === item.blue() && item.red() === item.green());
            if (isGray && grayCount > 0) {
                return false;
            } else if (item.grayvalue() !== 0 && item.grayvalue() !== 1) {
                if (isGray) {
                    grayCount++;
                }
                return true;
            }
        })

        if (colorObjectsArray.length === 1) {
            colorObjectsArray.push(pusher.color('#000000'));
        }


        var colors = _.map(colorObjectsArray, function (item) {
            return item.hex6();
        })


        var element = this.bannerElement;
        if (!element) {
            element = $($('#bannerTemplate').html());
            element.appendTo(this.root);
            this.bannerElement = element;
        }

        element.css({
            'background-color': colors[0]
        })

        element.find('.color2').css({
            'color': pusher.color(colors[0]).contrastText().hex6()
        })

        //cosnole.log('1px 1px 1px '+colors[1].complement().hex6());

        element.find('.color3').css({
            'color': pusher.color(colors[1]).contrastText().hex6(),
            'background-color': this.getButtonColor(colorObjectsArray),
            'box-shadow': '0 0 2px '+pusher.color(colors[1]).contrastText().hex6()
        })

        TweenLite.to(element, animationSpeed, {css: {opacity: 1, scale: 1}});

        var element = $('#' + this.container);
        element.empty();

        var buildBar = function (label, fn) {
            var sortedArr = _.sortBy(colorObjectsArray, fn);
            var h1 = $('<h1></h1>');
            h1.append(label);
            h1.appendTo(element);

            var ul = $('<ul class="colorList"></ul>');

            _.each(sortedArr, function (item) {
                var li = $('<li></li>');
                li.css({
                    'background-color': item.hex6(),
                    'color': item.contrastWhiteBlack().hex6()
                })

                li.append(fn.call(null, item));

                li.appendTo(ul);

            })
            ul.appendTo(element);
        }

        buildBar('no sorting', function (item) {
            return 0;
        })

        buildBar('saturation', function (item) {
            return item.saturation();
        })

        buildBar('hue', function (item) {
            return item.hue();
        })
        buildBar('isGray', function (item) {
            return item.grayvalue8()
        })
        /*



         buildBar('hue', function (item) {
         return item.hue();
         })

         buildBar('isGray', function (item) {
         return item.grayvalue8()
         })


         buildBar('value', function (item) {
         return item.value();
         })

         buildBar('red', function (item) {
         return item.red();
         })



         buildBar('hex', function (item) {
         return item.hex6()
         })
         */
    }
}

var animationSpeed = 1;


var renderSiteList = function () {
    var select = $('<select class="form-control"></select>')
    var option = $('<option value="">Select A Site</option>');
    option.appendTo(select);
    _.each(siteList, function (item) {
        var option = $('<option></option>');
        option.prop('value', item.url);
        option.append(item.label);
        option.appendTo(select);
    })
    select.appendTo('#siteListContainer');

    var demo2 = new AdDemo({
        scriptUrl: 'http://10.14.119.108:3000/dominantColors?pixelcount=430&noua=false&width=320&height=480',
        rightPos: 350,
        container: 'container1',
        getButtonColor: function (colorObjectsArray) {
            var sortedArr = _.sortBy(colorObjectsArray, function (item) {
                return item.saturation();
            });
            return sortedArr[sortedArr.length - 1].hex6();
        }

    })

    var demo1 = new AdDemo({
        scriptUrl: 'http://10.14.119.108:3000/dominantColors?pixelcount=100&noua=false&width=320&height=480',
        rightPos: 0,
        onRenderAd: function () {
            demo2.setSite(select.val());
        },
        container: 'container2',
        getButtonColor: function (colorObjectsArray) {
            return colorObjectsArray[1].hex6();
        }
    })


    select.on('change', function (e) {
        var url = select.val();
        if (url === '') {
            return;
        }
        demo1.setSite(url);
    })
}


renderSiteList();

