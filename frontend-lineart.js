var wcdf_functions = {};

jQuery(function ($) {
    
    const canvas = document.getElementById('cpkCanvas');
    const ctx = canvas.getContext('2d');

    const default_illustrations_url = '';//'http://127.0.0.1/shop/wp-content/plugins/custom-product-kit/assets/lineart/illustrations/';
    var _current_ill = 'dolphin';
    var _current_color = 'black';
    
    var background_img = '';
    var background_img_name = 'dolphin';
    var background_img_color = 'black';
    var background_img_category = 'animals';
    var background_color = 'rgb(255,255,255,1)';
    var font_color = 'rgb(0,0,0,1)';
    var _current_height = 0;

    const lineArtStyle = [];
    lineArtStyle['Minimal'] = {fontSize: ' 1em ',fontWeight: 'normal',fontFamily: 'adobe-garamond-pro,sans-serif'};
    lineArtStyle['Bold'] = {fontSize: ' 1em ',fontWeight: 'bold',fontFamily: 'adobe-garamond-pro,sans-serif'};
    lineArtStyle['Script'] = {fontSize: ' 1.4em ',fontWeight: 'normal',fontFamily: 'quickpen'};
    lineArtStyle['Divided'] = {fontSize: ' 1em ',fontWeight: 'normal',fontFamily: 'adobe-garamond-pro,sans-serif'};
    lineArtStyle['Boxed'] = {fontSize: ' 1em ',fontWeight: 'normal',fontFamily: 'adobe-garamond-pro,sans-serif'};
    lineArtStyle['Quote (Script)'] = {fontSize: ' 1.4em ',fontWeight: 'normal',fontFamily: 'quickpen'};
    lineArtStyle['Quote (Sharp)'] = {fontSize: ' 1em ',fontWeight: 'normal',fontFamily: 'proxima-nova'};
    lineArtStyle['Quote (Classic)'] = {fontSize: ' 1em ',fontWeight: 'normal',fontFamily: 'adobe-garamond-pro'};
    lineArtStyle['Quote (Playful)'] = {fontSize: ' 1em ',fontWeight: 'normal',fontFamily: 'cursive'};

    const _bgcolor = [];
    _bgcolor['white'] = {font_color : '#000000',background_color: '#ffffff'};
    _bgcolor['gold'] = {font_color : '#ffffff',background_color: '#ca8e72'};
    _bgcolor['greygold'] = {font_color : '#000000',background_color: '#dcccc0'};
    _bgcolor['black'] = {font_color : '#ffffff',background_color: '#000000'};
    _bgcolor['lightblack'] = {font_color : '#ca8e72',background_color: '#333333'};
    _bgcolor['lightgold'] = {font_color : '#ffffff',background_color: '#fdf7ef'};
    _bgcolor['lightcloud'] = {font_color : '#000000',background_color: '#f1f1f1'};
    _bgcolor['cloudwhite'] = {font_color : '#000000',background_color: '#a0afb8'};
    _bgcolor['cloud'] = {font_color : '#000000',background_color: '#a0afb8'};
    _bgcolor['asphalt'] = {font_color : '#000000',background_color: '#172731'};
    _bgcolor['lightmoss'] = {font_color : '#000000',background_color: '#f8f6f1'};
    _bgcolor['mosswhite'] = {font_color : '#000000',background_color: '#767d6a'};
    _bgcolor['moss'] = {font_color : '#000000',background_color: '#767d6a'};
    _bgcolor['wise'] = {font_color : '#000000',background_color: '#1A2B23'};
    _bgcolor['lightrose'] = {font_color : '#000000',background_color: '#FFF9FB'};
    _bgcolor['rosewhite'] = {font_color : '#000000',background_color: '#B6959E'};
    _bgcolor['rose'] = {font_color : '#000000',background_color: '#B6959E'};
    _bgcolor['burgundy'] = {font_color : '#000000',background_color: '#42252E'};
    _bgcolor['lightlila'] = {font_color : '#000000',background_color: '#DCD2DF'};
    _bgcolor['lilawhite'] = {font_color : '#000000',background_color: '#7C6B82'};
    _bgcolor['lila'] = {font_color : '#000000',background_color: '#7C6B82'};
    _bgcolor['aubergine'] = {font_color : '#000000',background_color: '#ffffff'};

    const _color = [];
    _color['white'] = {font_color : '#ffffff',background_color: '#ffffff'};
    _color['black'] = {font_color : '#000000',background_color: '#000000'};
    _color['gold'] = {font_color : '#ca8e72',background_color: '#ca8e72'};

    const myStyle = ['Minimal','Bold','Script','Divided','Boxed'];

    var style = 'Quote (Script)';
    var _h = 20;
    
    var line_1 = '';
    var line_2 = '';
    var line_3 = '';
    var line_4 = '';

    function cpkDrawCanvasWithBG() {

        let _x = (canvas.width)/2;
        let _y = canvas.height - 20;
        if(jQuery.inArray(style, myStyle) !== -1){
            _y = canvas.height - 20;
        } else {
            _y = (canvas.height)/2;
        }

        let _Style = lineArtStyle[style];
        console.log(style);
        console.log(_Style);

        ctx.globalAlpha = 1;

        if( style == 'Boxed' ) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, (_y - 80), canvas.width, (_y - 80));
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = font_color;
        }

        ctx.textAlign = "center";
        ctx.font = _Style.fontWeight + _Style.fontSize + _Style.fontFamily;
//         ctx.fillText(line_1, _x, (_y - 60));
        wrapText(line_1, _x, (_y - 60));
        ctx.font = "normal .8em Arial";
        ctx.fillText(line_2, _x, (_current_height + 10));
        ctx.font = "normal .6em Arial";
        ctx.fillText(line_3, _x, (_current_height + 25));
        ctx.font = "normal .6em Arial";
        ctx.fillText(line_4, _x, (_current_height + 35));

    }
    
    function wrapText(text, x, y) {
            var line_width = canvas.width - 40;
            var line_height = 24;
            var line = '';
            var paragraphs = text.split('\n');
            for (var i = 0; i < paragraphs.length; i++)
            {
                var words = paragraphs[i].split(' ');
                for (var n = 0; n < words.length; n++)
                {
                    var testLine = line + words[n] + ' ';
                    var metrics = ctx.measureText(testLine);
                    var testWidth = metrics.width;
                    if (testWidth > line_width && n > 0)
                    {
                        ctx.fillText(line, x, y);
                        line = words[n] + ' ';
                        y += line_height;
                    }
                    else
                    {
                        line = testLine;
                    }
                }
                ctx.fillText(line, x, y);
                y += line_height;
                line = '';
                _current_height = y;
            }
        }

    function cpkDrawCanvas() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(jQuery.inArray(style, myStyle) !== -1){
            _h = 110;
        } else {
            _h = 20;
        }

        ctx.fillStyle = background_color;
        ctx.globalAlpha = 1;
        ctx.fillRect(0,0,canvas.width,canvas.height);


        if( background_img != "" ) { console.log('Yes');
            let background = new Image();
            background.src = background_img;
            background.onload = function() {
                ctx.globalAlpha = .4;
                ctx.drawImage(background,10,10,(canvas.width - 20),(canvas.height - _h));
                cpkDrawCanvasWithBG();
            }
        } else {console.log('no');
            cpkDrawCanvasWithBG();
        }

    }


    function trimValue(val) {
        var val_1 = val.split("_");
        if(val_1[0]){
            return val_1[0];
        } else {
            return false;
        }
    }

    function trimFullValue(val) {
        return val.split("_");
    }

    function setLieart() {

        line_1 = $("#lineart-headline input").val();
        line_2 = $("#lineart-divider input").val();
        line_3 = $("#lineart-tagline input").val();
        line_4 = $("#lineart-subline input").val();

        $(".street-labels .street-header").text(line_1);
        $(".street-labels .street-divider").text(line_2);
        $(".street-labels .street-tagline").text(line_3);
        $(".street-labels .street-subline").text(line_4);

        background_img = cpk_param.server_url + '/wp-content/plugins/custom-product-kit/assets/lineart/' + background_img_category + '/' +background_img_name + '_' + background_img_color + '.png';//jQuery(".tc-container-enabled .lineart-illustration-ul img.radio_image").attr('src');
        $(".cpk-inner").css('background-image', 'url(' + background_img + ')');

        cpkDrawCanvas();
    }

    function resizeCanvas() {
        // canvas.width = $("#canvas-lineart").innerWidth() - '40';
        // canvas.height = $("#canvas-lineart").innerHeight() - '40';
        // cpkDrawCanvas(); 
    }
    
    function updateCanvasClass(_bg,_ft) {
        $("#canvas-container").removeClass();
        $("#canvas-container").addClass("canvas-container");
        $("#canvas-container").addClass(_ft.toLowerCase());
        $("#cpk-canvas").removeClass();
        $("#cpk-canvas").addClass("cpk-canvas");
        $("#cpk-canvas").addClass(_bg.toLowerCase());
        setLieart();
    }

   jQuery(".lineart-illustration-ul input").change(function() {
        var ill = jQuery(".tc-container-enabled .lineart-illustration-ul input:checked").val();
        var cat = jQuery("#illustrations-category select").val();
       let _ill = trimFullValue(ill);
       background_img_category = trimValue(cat).toLowerCase();
       background_img_name = _ill[0];
       setLieart();
//         var illustration = default_illustrations_url + ill + '.png';
//         background_img = illustration;
//         cpkDrawCanvas();
    });

    $("#lineart-color input").change(function(){
        var color = jQuery("#lineart-color input:checked").val();
        let _clr = trimFullValue(color);
        background_img_color = _clr[0];
        console.log(_clr);
        updateCanvasClass(_clr[1], _clr[0]);
        var _bg_n = _clr[1].toLowerCase();
        var bcc = _bgcolor[_bg_n];
        background_color = bcc.background_color;
        font_color = _color[_clr[0]].font_color;
        cpkDrawCanvas();
    });

    $("#lineart-theme input").change(function() {
        var stic = jQuery("#lineart-theme input:checked").val();
        var theme = stic.split("_");
        var _thm = theme[0].replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ' ').toLowerCase();
        $("#outer-lineart").removeClass();
        $("#outer-lineart").addClass("outer-lineart");
        $("#outer-lineart").addClass(_thm);
        style = trimValue(stic);
        setLieart();
    });


    // $(".lineart-style-div input").change(function(){
    //     // var _style = jQuery(".lineart-style-div input:checked").val();
    //     // style = trimValue(_style);
    //     // cpkDrawCanvas();
    // });

   $("#lineart-headline,#lineart-divider,#lineart-tagline,#lineart-subline").each(function(){
        $(this).keyup(function(){
            setLieart();
        });
    });

    $('#cpk-size-selector input').change(function(){
        var layout = $("#cpk-size-selector input:checked").val();
        $("#canvas-lineart").removeClass();
        $("#canvas-lineart").addClass("canvas-default-size");
        $("#canvas-lineart").addClass(trimValue(layout));
        resizeCanvas();
    });
    $('.cpk-size-inch').change(function(){
        var size = $(".cpk-size-inch-div.tc-container-enabled input:checked").val();
        $("#canvas-lineart").removeClass();
        $("#canvas-lineart").addClass("canvas-default-size");
        var layout = $("#cpk-size-selector input:checked").val();
        $("#canvas-lineart").addClass(trimValue(layout));
        $("#canvas-lineart").addClass("s_"+trimValue(size).toString());
        resizeCanvas();
    });

    function cpkGetBase64(file) {
       var reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = function () {
           background_img = reader.result;
           $("#lineart-upload-preview img").attr('src',reader.result);
           $("#lineart-upload-preview").show();
           cpkDrawCanvas();
       };
       reader.onerror = function (error) {
         console.log('Error: ', error);
       };
    }



    $('input.lineart-upload').change(function(){
        let file = document.querySelector('#lineart-upload input[type="file"]').files[0];
        cpkGetBase64(file);
    });

    $(document).on('click','.cpk-simple-cart-button',function(e){
        e.preventDefault();

        $('.cpk-loading').show();
    
        var canvas = document.getElementById("cpkCanvas");

        var base_64 = canvas.toDataURL('image/jpeg');

        $.ajax({

        type: 'POST',
        url: woocommerce_params.ajax_url,
        data: {"action": "cpk_ajax_base64_uplaod","base_64":base_64},
        success: function(data) {
                var _data = JSON.parse(data);
                if(_data.attach_id) {
                    $("#cpk-product-image-id").val(_data.attach_id);
                    $(".cpk-simple-cart-form .single_add_to_cart_button").trigger('click');
                }
                $('.cpk-loading').hide();
            }
        });


    });

    setLieart();
});