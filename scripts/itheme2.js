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
        label: 'CRICBUZZ',
        url: 'http://cricbuzz.com/'
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
    },
    {
        label: 'Wikipedia',
        url: 'http://www.wikipedia.org/'
    },
    {
        label: 'Ebay',
        url: 'http://m.ebay.com/'
    },
    {
        label: 'Microsoft',
        url: 'http://www.microsoft.com'
    },
    {
        label: 'BBC',
        url: 'http://m.bbc.co.uk/'
    },
    {
        label: 'CNN',
        url: 'http://edition.cnn.com/'
    },
    {
        label: 'Adobe',
        url: 'http://adobe.com/'
    },
    {
        label: 'CNet',
        url: 'http://cnet.com'
    },
    {
        label: 'Slideshare',
        url: 'http://www.slideshare.net/mobile/'
    },
    {
        label: 'Forbes',
        url: 'http://www.forbes.com/'
    },
    {
        label: 'Easyports',
        url: 'http://www.easports.com/'
    }
];


var titleList = [
    {
        title: 'Native Ads without Integration.',
        button: 'Show More'
    },
    {
        title: 'Skin-Up your Ads with iTheme.',
        button: 'Know How'
    },
    {
        title: 'Get rid of boring Ads.',
        button: 'Go Dynamic'
    }
]


var getGlobalCallback = function (context) {
    var callback = function (fullData) {
        var data = fullData.colors;
        var colors = [];
        for (var i = 0; i < 20; i++) {
            var dataObj = data[i];
            if (dataObj && dataObj.color) {
                var colorObj = dataObj.color;

                colors.push({color: pusher.color('rgb', colorObj.red, colorObj.green, colorObj.blue).hex6(), pixelCount: dataObj.value});
            }
        }
        context.renderBanner(colors, fullData.font);
    }
    var callbackName = 'callback_' + new Date().getTime().toString() + '_' + Math.round(Math.random() * 1000000);
    window[callbackName] = callback;
    return callbackName;
}

var bannerTemplateFunction = _.template($('#bannerTemplate').html());

var AdDemo = function (config) {
    var _this = this;
    this.root = $('<div class="demo-item"></div>');


    /*
     this.root.css({
     right: config.rightPos
     })

     */
    this.root.prependTo('#demoContainer');
    this.scriptUrl = config.scriptUrl;
    this.onRenderAd = config.onRenderAd;

    this.container = config.container;

    this.getButtonColor = config.getButtonColor;


}

AdDemo.prototype = {
    setSite: function (site) {
        this.site = site;
        this.renderIFrame();
        //this.loadColors();

        this.root.find('button').removeClass('btn-loading')

        if (this.bannerElement) {
            TweenLite.to(this.bannerElement, animationSpeed, {css: {opacity: 0, scale: 0}});
        }

        if (this.iframeElement) {
            //TweenLite.to(this.iframeElement, animationSpeed, {css: {opacity: 0, scale: 0}});
        }

        var paletteElement = $('#' + this.container);
        paletteElement.empty();
    },
    renderIFrame: function () {
        var _this = this;
        var element = this.iframeElement;
        if (!element) {
            var button = $('<div class="button-div"><button class="btn-regular btn-block">Show Add</button></div>')
            button.appendTo(this.root);
            button.on('click', 'button', function () {
                var url = $('#sitePicker').val();
                if (url === '') {
                    return;
                }
                _this.loadColors();
            })


            element = $('<iframe  class="preview"  width="320" height="430"></iframe>')
            element.appendTo(this.root);
            this.iframeElement = element;
        }
        element.prop('src', this.site);
        //TweenLite.to(element, animationSpeed, {css: {opacity: 1, scale: 1}});
    },
    loadColors: function () {
        var _this = this;
        this.root.addClass('loading');
        var element = this.scriptElement;
        if (element) {
            element.remove();
        }
        element = $('<script></script>')
        var callbackName = getGlobalCallback(this);
        /*
         element.prop('onload', function () {
         if (_this.onRenderAd) {
         setTimeout(_this.onRenderAd, 3500);
         }
         });

         */
        element.prop('src', this.scriptUrl + '&callback=' + callbackName + '&url=' + this.site);
        element.appendTo(this.root);
        this.scriptElement = element;


        this.root.find('button').addClass('btn-loading')


    },
    renderBanner: function (colorArray, font) {

        var grayCount = 0;

        var colorObjectsArray = _.map(colorArray, function (item) {
            return  pusher.color(item.color);
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

        var randomTitle = titleList[Math.floor(Math.random()*titleList.length)];

        if(element){
            element.remove();
        }

        element = $(bannerTemplateFunction(randomTitle));
        element.appendTo(this.root);
        this.bannerElement = element;

        element.css({
            'background-color': colors[0]
        })

        element.find('.color2').css({
            'color': pusher.color(colors[0]).contrastText().hex6()
        })

        //cosnole.log('1px 1px 1px '+colors[1].complement().hex6());


        var buttonBackgroundColor = this.getButtonColor(colorObjectsArray);


        element.find('.color3').css({
            'color': pusher.color(buttonBackgroundColor).contrastText().hex6(),
            'background-color': buttonBackgroundColor,
            'box-shadow': '0 0 2px ' + pusher.color(buttonBackgroundColor).contrastText().hex6()
        })

        TweenLite.to(element, animationSpeed, {css: {opacity: 1, scale: 1}});


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

        var paletteElement = $('#' + this.container);
        paletteElement.empty();

        var buildBar2 = function (label) {
            var sortedArr = colorArray;


            var ul = $('<ul class="colorList"></ul>');

            _.each(sortedArr, function (item) {
                var color = pusher.color(item.color);

                var li = $('<li></li>');
                li.css({
                    'background-color': color.hex6(),
                    'color': color.contrastWhiteBlack().hex6()
                })

                li.append(item.pixelCount);

                li.appendTo(ul);

            })
            ul.appendTo(paletteElement);
        }


        buildBar2('Color Pallet')
        /*
         buildBar('saturation', function (item) {
         return item.saturation();
         })

         buildBar('hue', function (item) {
         return item.hue();
         })
         buildBar('isGray', function (item) {
         return item.grayvalue8()
         })




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

        this.root.find('button').removeClass('btn-loading')
    }
}

var animationSpeed = 1;


var renderSiteList = function () {
    var select = $('<select class="form-control" id="sitePicker"></select>')
    var option = $('<option value="">Select A Site</option>');
    option.appendTo(select);
    _.each(siteList, function (item) {
        var option = $('<option></option>');
        option.prop('value', item.url);
        option.append(item.label);
        option.appendTo(select);
    })
    select.appendTo('#siteListContainer');


    var demo3 = new AdDemo({
        scriptUrl: 'http://10.14.125.42:3000/dominantColors?pixelcount=330&noua=false&width=320&height=480',
        rightPos: 350,
        container: 'container3',
        getButtonColor: function (colorObjectsArray) {
            var sortedArr = _.sortBy(colorObjectsArray, function (item) {
                return item.grayvalue8();
            });
            return sortedArr[sortedArr.length - 1].hex6();
        }

    })

    var demo2 = new AdDemo({
        scriptUrl: 'http://10.14.125.42:3000/dominantColors?pixelcount=430&noua=false&width=320&height=480',
        rightPos: 350,
        container: 'container2',
        getButtonColor: function (colorObjectsArray) {
            var sortedArr = _.sortBy(colorObjectsArray, function (item) {
                return item.saturation();
            });
            return sortedArr[sortedArr.length - 1].hex6();
        },
        onRenderAd: function () {
            demo3.setSite(select.val());
        }

    })

    var demo1 = new AdDemo({
        scriptUrl: 'http://10.14.125.42:3000/dominantColors?pixelcount=100&noua=false&width=320&height=480',
        rightPos: 0,
        onRenderAd: function () {
            demo2.setSite(select.val());
        },
        container: 'container1',
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
        demo2.setSite(url);
        demo3.setSite(url);
    })
}


renderSiteList();

