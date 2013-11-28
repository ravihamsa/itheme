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
    }
];


var getGlobalCallback = function(context){
    var callback = function(fullData){
        var data = fullData.colors;
        var colors = [];
        for (var i = 0; i < 25; i++) {
            var colorObj = data[i];
            if (colorObj && colorObj.color) {
                colorObj = colorObj.color;
                colors.push(pusher.color('rgb', colorObj.red, colorObj.green, colorObj.blue).hex6());
            }
        }
        context.renderBanner(colors);
    }
    var callbackName = 'callback_'+new Date().getTime();
    window[callbackName] = callback;
    return callbackName;
}


var AdDemo = function(config){
    this.root = $('<div></div>');
    this.root.appendTo('#demoContainer');
    this.scriptUrl = config.scriptUrl;
}

AdDemo.prototype ={
    setSite:function(site){
        this.site = site;
        this.renderIFrame();
        this.loadColors();
    },
    renderIFrame:function(){
        var element = this.iframeElement;
        if(!element){
            element = $('<iframe  class="preview"  width="320" height="430"></iframe>')
            element.appendTo(this.root);
            this.iframeElement = element;
        }
        element.src =  this.site.url;
    },
    loadColors:function(){
        var element = this.scriptElement;
        if(element){
            element.remove();
        }
        element = $('<script></script>')

        element.src =  this.scriptUrl + '&url='+this.site.url+'&callback='+getGlobalCallback(this);
        element.appendTo(this.root);
        this.scriptElement = element;
    },
    renderBanner:function(colorArray){

        var grayCount = 0;

        var colorObjectsArray = _.map(colorArray, function (colorString) {
            return  pusher.color(colorString);
        })

        colorObjectsArray = _.filter(colorObjectsArray, function (item) {
            var isGray = (item.red() === item.blue() && item.red() === item.green());
            if(isGray && grayCount > 0){
                return false;
            }else if(item.grayvalue() !== 0 && item.grayvalue() !== 1){
                if(isGray){
                    grayCount++;
                }
                return true;
            }
        })

        if(colorObjectsArray.length === 1) {
            colorObjectsArray.push(pusher.color('#000000'));
        }


        var colors = _.map(colorObjectsArray, function (item) {
            return item.hex6();
        })


        var element = this.bannerElement;
        if(!element){
            element = $($('#bannerTemplate').html());
            element.appendTo(this.root);
            this.bannerElement = element;
        }

        $('.color1', this.bannerElement).css({
            'background-color':colors[0]
        })

        $('.color2', this.bannerElement).css({
            'color':pusher.color(colors[0]).contrastText().hex6()
        })

        $('.color3', this.bannerElement).css({
            'color':pusher.color(colors[1]).contrastText().hex6(),
            'background-color':colors[1]
        })

    }
}

var animationSpeed = 1;


var initColorRendering = function (colorArray) {
    //

    var grayCount = 0;

    var colorObjectsArray = _.map(colorArray, function (colorString) {
        return  pusher.color(colorString);
    })

    colorObjectsArray = _.filter(colorObjectsArray, function (item) {
        var isGray = (item.red() === item.blue() && item.red() === item.green());
        if(isGray && grayCount > 0){
            return false;
        }else if(item.grayvalue() !== 0 && item.grayvalue() !== 1){
            if(isGray){
                grayCount++;
            }
            return true;
        }
    })

    if(colorObjectsArray.length === 1) {
        colorObjectsArray.push(pusher.color('#000000'));
    }


    var element = $('#container');
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

    buildBar('hue', function (item) {
        return item.hue();
    })

    buildBar('saturation', function (item) {
        return item.saturation();
    })
    buildBar('value', function (item) {
        return item.value();
    })

    buildBar('red', function (item) {
        return item.red();
    })

    buildBar('isGray', function (item) {
        return item.grayvalue8()
    })

    buildBar('hex', function (item) {
        return item.hex6()
    })

    updateBanner(_.map(colorObjectsArray, function (item) {
        return item.hex6();
    }))
}


function populateColors1(fullData) {

    var data = fullData.colors;
    var colors = [];
    for (var i = 0; i < 25; i++) {
        var colorObj = data[i];
        if (colorObj && colorObj.color) {
            colorObj = colorObj.color;
            colors.push(pusher.color('rgb', colorObj.red, colorObj.green, colorObj.blue).hex6());
        }
    }
    showBanners();
    initColorRendering(colors);
}

function populateColors2(fullData) {

    var data = fullData.colors;
    var colors = [];
    for (var i = 0; i < 6; i++) {
        var colorObj = data[i];
        if (colorObj && colorObj.color) {
            colorObj = colorObj.color;
            colors.push(pusher.color('rgb', colorObj.red, colorObj.green, colorObj.blue).hex6());
        }
    }
    showBanners();
    initColorRendering(colors);
}



var renderUrl = function (url) {
    hideBanners();


    $('#colorLoader').remove();
    $('#colorLoader2').remove();

    $('#previewIframe').prop('src', url);
    $('#previewIframe2').prop('src', url);


    var script = $('<script id="colorLoader"></script>')
    script.prop('src', 'http://10.14.119.108:3000/dominantColors?callback=populateColors1&pixelcount=100&noua=true&width=320&height=480&url=' + url);
    script.appendTo('body');


    var script2 = $('<script id="colorLoader2"></script>')
    script2.prop('src', 'http://10.14.119.108:3000/dominantColors?callback=populateColors2&noua=true&width=320&height=480&url=' + url);
    script2.appendTo('body');
    //$('#colorLoader').load();

}

var renderSiteList = function () {
    var select = $('<select></select>')
    var option = $('<option value="">Select A Site</option>');
    option.appendTo(select);
    _.each(siteList, function (item) {
        var option = $('<option></option>');
        option.prop('value', item.url);
        option.append(item.label);
        option.appendTo(select);
    })
    select.appendTo('#siteListContainer');

    select.on('change', function (e) {
        var url = select.val();
        if (url === '') {
            return;
        }
        renderUrl(url)
    })
}

var hideBanners = function () {

    TweenLite.to('.preview', animationSpeed, {css: {opacity: 0, scale: 0}});
    TweenLite.to('.banner', animationSpeed, {css: {opacity: 0, scale: 0}});


}

var showBanners = function () {
    TweenLite.to('.preview', animationSpeed, {css: {opacity: 1, scale: 1}});
    TweenLite.to('.banner', animationSpeed, {css: {opacity: 1, scale: 1}});
}


renderSiteList();
hideBanners();