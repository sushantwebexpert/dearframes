var wcdf_functions = {};

jQuery(function ($) {
    
    const canvas = document.getElementById('cpkCanvas');
    const ctx = canvas.getContext('2d');
    
    var background_img = '';
    var background_color = 'rgb(0,0,0,.5)';
    var background_txt = '';
    var size_txt = 6;
    var current_theme = 'dark';

    var line_1 = '';
    var line_2 = '';
    var line_3 = '';
    var line_4 = '';

        var style = {
            modern :'#fff',
            asphalt :'#172731',
            nautical :'#fdf7ef',
            cloud :'#a0afb8',
            dark :'#222',
            black :'#000'
        };
        var bg_style = {
            modern :'#000',
            asphalt :'#fff',
            nautical :'#172731',
            cloud :'#fff',
            dark :'#fff',
            black :'#fff'
        };


    function drawTxt(txt) {

        ctx.globalAlpha = .6;

         ctx.font= size_txt + "px Arial";
         var txtHeight=size_txt;
         var offset=5;

         var w=Math.ceil(ctx.measureText(txt).width);

         var txt=new Array(w*2).join(txt+' ');

         for(var i=0;i<Math.ceil((canvas.height -100)/txtHeight);i++){
            var _x = -(i*offset);
            var _y = i*txtHeight+10;
            ctx.fillText(txt,_x,_y);
        }

        ctx.lineWidth = 10;
        ctx.strokeStyle="#FFFFFF";
        ctx.strokeRect(0, 0, canvas.width, canvas.height);

    }


    function cpkDrawCanvasWithBG() {

        ctx.globalAlpha = 1;
        ctx.textAlign = "center";
        ctx.fillStyle = bg_style[current_theme];
        ctx.font = "bold 1em Arial";
        ctx.fillText(line_1, (canvas.width)/2, (canvas.height - 75));
        ctx.font = "bold .8em Arial";
        ctx.fillText(line_2, (canvas.width)/2, (canvas.height - 55));
        ctx.font = "bold .6em Arial";
        ctx.fillText(line_3, (canvas.width)/2, (canvas.height - 35));
        ctx.font = "bold .6em Arial";
        ctx.fillText(line_4, (canvas.width)/2, (canvas.height - 20));

    }

    function cpkDrawCanvas() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = style[current_theme];
        ctx.globalAlpha = 1;
        ctx.fillRect(0,0,canvas.width,canvas.height);

        if( background_img != "" ) { 

            let background = new Image();
            background.src = background_img;
            background.onload = function() {
                ctx.globalAlpha = .4;
                ctx.drawImage(background,0,0,canvas.width,(canvas.height - 100));
                let _txt_val = $('#repeated-text textarea').val();
                drawTxt(_txt_val);

                cpkDrawCanvasWithBG();
            }
        } else {console.log('no');
            cpkDrawCanvasWithBG();
        }

    }


    function initCanvas() {
        line_1 = $("#textart-headline input").val();if(line_1){line_1=line_1.toUpperCase()}
        line_2 = $("#textart-divider input").val();    if(line_2){line_2=line_2.toUpperCase()}
        line_3 = $("#textart-tagline input").val();if(line_3){line_3=line_3.toUpperCase()}
        line_4 = $("#textart-subline input").val();if(line_4){line_4=line_4.toUpperCase()}
        $("#canvas-textart .street-labels .street-header").html(line_1);
        $("#canvas-textart .street-labels .street-divider").html(line_2);
        $("#canvas-textart .street-labels .street-tagline").html(line_3);
        $("#canvas-textart .street-labels .street-subline").html(line_4);


        cpkDrawCanvas();
    }

    function initPreview() {
        var _html = '<div id="textart-upload-preview" ><img src="" /><span class="cpk-close">x</span></div>';
        $("#textart-upload .tm-epo-field-label").append(_html);
    }

    initCanvas();
    initPreview();
    cpktextartMultiText();

    function resizeCanvas() {
        canvas.width = $("#canvas-textart").innerWidth() - '40';
        canvas.height = $("#canvas-textart").innerHeight() - '40';
        cpkDrawCanvas(); 
    }

    function trimValue(val){
        var val_1 = val.split("_");
        if(val_1[0]){
            return val_1[0];
        } else {
            return false;
        }
    }

    $("#textart-headline,#textart-divider,#textart-tagline,#textart-subline").each(function(){
        $(this).keyup(function(){
            initCanvas();
        });
    });

    $("#textart-theme input").change(function(){
        var stic = jQuery("#textart-theme input:checked").val();
        var theme = stic.split("_");
        current_theme = theme[0].toLowerCase();
        $("#canvas-container").removeClass();
        $("#canvas-container").addClass("canvas-container");
        $("#canvas-container").addClass(theme[0].toLowerCase());
        cpkDrawCanvas();
    });

    $('#cpk-size-selector input').change(function(){
        var layout = $("#cpk-size-selector input:checked").val();
        $("#canvas-textart").removeClass();
        $("#canvas-textart").addClass("canvas-default-size");
        $("#canvas-textart").addClass(trimValue(layout));
        resizeCanvas();
    });

    $('.cpk-size-inch').change(function(){
        var size = $(".cpk-size-inch-div.tc-container-enabled input:checked").val();
        $("#canvas-textart").removeClass();
        $("#canvas-textart").addClass("canvas-default-size");
        var layout = $("#cpk-size-selector input:checked").val();
        $("#canvas-textart").addClass(trimValue(layout));
        $("#canvas-textart").addClass("s_"+trimValue(size).toString());
        resizeCanvas();
    });

    function cpkGetBase64(file) {
       var reader = new FileReader();
       reader.readAsDataURL(file);
       reader.onload = function () {
           background_img = reader.result;
           $("#textart-upload-preview img").attr('src',reader.result);
           $("#textart-upload-preview").show();
            $('.cpk-inner').css('background-image', 'url(' + background_img + ')');
            cpktextartMultiText();
            cpkDrawCanvas();
       };
       reader.onerror = function (error) {
         console.log('Error: ', error);
       };
    }

    function cpktextartMultiText() {
        if( background_img == ''){
            $('.textart-multi-text').hide();
        } else {
            let _txt_val = $('#repeated-text textarea').val();
            _txt_val = _txt_val + ' ';
            _txt_val = _txt_val.repeat(5000);
            background_txt = _txt_val;
            $('.textart-multi-text').html(_txt_val);
            $('.textart-multi-text').show();
            cpkDrawCanvas();
        }
    }

    $('input.textart-upload').change(function() {
        let file = document.querySelector('#textart-upload input[type="file"]').files[0];
        cpkGetBase64(file);
    });

    $('#repeated-text textarea').change(function() {
        cpktextartMultiText();
    });

    $('#text-pattern-size input').change(function() {
        let _size = $(this).val() + 'px';
        $('.textart-multi-text').css('font-size',_size);
        size_txt = $(this).val();
        cpkDrawCanvas();
    });


    $(document).on('click','#textart-upload-preview .cpk-close',function(e){
        e.preventDefault();
        jQuery("#textart-upload-preview input").val('');
        jQuery("#textart-upload-preview img").attr('src','');
        jQuery("#textart-upload-preview").hide();
        jQuery(".tm-filename").html('');
        $('.cpk-inner').css('background-image', '');
        background_img = '';
        cpktextartMultiText();
        cpkDrawCanvas();
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
    
});