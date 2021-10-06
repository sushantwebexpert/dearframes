var wcdf_functions = {};

jQuery(function ($) {
    var canvas = document.getElementById("cpkCanvas");
    var ctx = canvas.getContext("2d");
    var map;
    var default_center = [-73.99433764815745,40.72453156588816];
    var default_zoom = 10;
    var default_style = 'mapbox://styles/samcefforts/ckq55s44i61l217n6rcnhcu1y';
    var default_marker_url = cpk_param.server_url + '/wp-content/plugins/custom-product-kit/assets/streetmap/icons/';
    var default_marker = default_marker_url + 'icon_8.png';
    var default_class = 'silver';
    var bounds;
    /** for canvas**/
    var _new_marker = "";
    var _new_bg_img = '';
    var _new_header = 'NEW YORK';
    var _new_divider = 'UNITED STATES';
    var _new_tagline = '40.713°N / 74.006°W';
    var geoJSON;
    /** for canvas**/

    function trimValue(val){
        var val_1 = val.split("_");
        if(val_1[0]){
            return val_1[0];
        } else {
            return false;
        }
    }

    function _int() {
        var _geocoder = '<div id="street_geocoder" class="geocoder"></div>';
        $("#streetmap-location li.tmcp-field-wrap").append(_geocoder);
        $('#street_geocoder').change(function(){
            var _loc = $(this).find('input').val();
            $("#streetmap-location input").val(_loc);
        });

    }

    function draw_map(center = default_center, zoom = default_zoom, map_style = default_style, marker = default_marker) {
        jQuery("#street-map").html('');
        $(".cpk-simple-cart-button").prop('disabled',true);
        mapboxgl.accessToken = 'pk.eyJ1Ijoic2FtY2VmZm9ydHMiLCJhIjoiY2txMjV0cmZhMDBnYTJvdXM0dWZydTc3OSJ9.LwKBKUp5AQkI4_P_kx6wdQ';
            map = new mapboxgl.Map({
                    container: "street-map",
                    style: map_style,
                    center: center,
                    attributionControl: false,
                    preserveDrawingBuffer: true,
                    zoom: zoom // starting zoom
                });
                map.addControl(new mapboxgl.NavigationControl({showCompass:false}));
                bounds = new mapboxgl.LngLatBounds();

                geoJSON = {
                'type': 'FeatureCollection',
                'features': [{
                    'type': 'Feature',
                        'geometry': {
                        'type': 'Point',
                        'coordinates': center
                        }
                    }
                ]};

                map.on('load', function() {
                        // map.on('move', function (e) {
                        let _bg_img = map.getCanvas().toDataURL();
                        console.log(3);canvasDraw();
                        $("#copy_street-map").css('background-image', 'url(' + _bg_img + ')');
                        $("#cpk-map-lat-lng").val(JSON.stringify(default_center));
                        $(".cpk-simple-cart-button").prop('disabled',false);
                });
                map.on('moveend', (e)=> {
                    default_center =  map.getCenter();
                    default_zoom = map.getZoom();
                    let _bg_img = map.getCanvas().toDataURL();
                    console.log(2);canvasDraw();
                    var _ne = map.getBounds().getNorthEast();
                    var _sw = map.getBounds().getSouthWest();
                    var _Ne = [_ne.lng,_ne.lat];
                    var _Sw = [_sw.lng,_sw.lat];
                    $("#cpk-map-bound").val(JSON.stringify({_Sw,_Ne}));
                    $("#copy_street-map").css('background-image', 'url(' + _bg_img + ')');
                    $("#cpk-map-lat-lng").val(JSON.stringify(default_center));
                    $(".cpk-simple-cart-button").prop('disabled',false);
                });

            // map.scrollZoom.disable();
            // map.boxZoom.disable();
            // map.dragRotate.disable();
            // map.dragPan.disable();
            // map.keyboard.disable();
            // map.doubleClickZoom.disable();
            // map.touchZoomRotate.disable();
            
        }

    function mapResize() {
        map.resize();
        setTimeout( function() { canvasDraw(); }, 2000);
    }

    function canvasDraw() {

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = document.getElementById('canvas-streetmap').offsetHeight;
        canvas.width = document.getElementById('canvas-streetmap').offsetWidth;

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = 1;

        _new_bg_img = map.getCanvas().toDataURL();
        var background = new Image();
        background.src = _new_bg_img;
        background.onload = function() {
            ctx.drawImage(background,0,0,canvas.width,canvas.height);
                drawLabels();
        };

        if(_new_marker != "" ) {
              let icon_image = new Image();
              icon_image.src = _new_marker;
              icon_image.onload = function() {
                  ctx.drawImage(icon_image, (canvas.width / 2 ) - 12, (canvas.height / 2 ) - 12, 24, 24);
              }
        }
    }


    function drawLabels() {


            let _max_width = 0;
            let _txt_width_header = ctx.measureText(_new_header).width;
            let _txt_width_divider = ctx.measureText(_new_divider).width;
            let _txt_width_tagline = ctx.measureText(_new_tagline).width;
            _max_width = Math.max(_txt_width_header, _txt_width_divider, _txt_width_tagline);

            let _bottom_header = 50;
            let _bottom_divider = 30;
            let _bottom_tagline = 10;

            ctx.textAlign = "center";
            let _text_position = (canvas.width)/2;


            if( default_class == "silver" ) {

            }

            let _x1 = 20;
            let _y2 = ( canvas.width - 20 );

            if( default_class == "silver" || default_class == "blueprint" ) {
                ctx.fillStyle = 'rgba(255,255,255,.4)';
            } else{
                ctx.fillStyle = 'rgba(255,255,255,1)';
            }

            if ( default_class == "ink" || default_class == "pride" ) {
                ctx.fillRect(10, (canvas.height - 100), ( canvas.width - 20 ), 80);
                _bottom_header = 70;
                _bottom_divider = 50;
                _bottom_tagline = 30;
            }
            else if( default_class == "denim" || default_class == "cinnamon" ) {
                ctx.fillRect(0, 0, canvas.width, 60);
            } else {
                ctx.fillRect(0, (canvas.height - 80), canvas.width, 80);
            }

            if( default_class == "joy" ){
                ctx.textAlign = "left";
                _text_position = 10;
                ctx.beginPath();
                ctx.lineWidth = 4;
                ctx.moveTo(0, (canvas.height - 80));
                ctx.lineTo(canvas.width, (canvas.height - 80));
                ctx.stroke();
                ctx.lineWidth = 1;
            }
                        


            if( default_class == "allure" || default_class == "skyway" ) {
                ctx.textAlign = "left";
                _text_position = 10;
                ctx.fillStyle = '#000';
                ctx.font = "bold 18px Arial";
                ctx.fillText(_new_header.toUpperCase(), _text_position, (canvas.height - 35));
                ctx.textAlign = "right";
                ctx.font = "12px Arial";
                ctx.fillText(_new_divider.toUpperCase(), (canvas.width - _text_position), (canvas.height - 45));
                ctx.font = "10px Arial";
                ctx.fillText(_new_tagline.toUpperCase(), (canvas.width - _text_position), (canvas.height - 25));
            }
            else if( default_class == "denim" || default_class == "cinnamon" ) {
                ctx.textAlign = "left";
                _text_position = 10;
                ctx.fillStyle = '#000';
                ctx.font = "bold 18px Arial";
                ctx.fillText(_new_header.toUpperCase(), _text_position, 35);
                ctx.textAlign = "right";
                ctx.font = "12px Arial";
                ctx.fillText(_new_divider.toUpperCase(), (canvas.width - _text_position), 45);
                ctx.font = "10px Arial";
                ctx.fillText(_new_tagline.toUpperCase(), (canvas.width - _text_position), 25);

            } else {

                ctx.fillStyle = '#000';
                ctx.font = "bold 18px Arial";
                ctx.fillText(_new_header.toUpperCase(), _text_position, (canvas.height - _bottom_header));
                ctx.font = "12px Arial";
                ctx.fillText(_new_divider.toUpperCase(), _text_position, (canvas.height - _bottom_divider));
                ctx.font = "10px Arial";
                ctx.fillText(_new_tagline.toUpperCase(), _text_position, (canvas.height - _bottom_tagline));

            }

            ctx.strokeStyle = "black";

            if( default_class == "silver" ) {

            let _txt_w = ctx.measureText(_new_divider).width;
            let _full_txt = canvas.width - 10 - _txt_w;
            let _x2 = ( canvas.width / 2 ) - ( _txt_w / 2 ) - 10;
            let _y1 = canvas.width - _x2;

                ctx.moveTo(_x1, (canvas.height -35 ));
                ctx.lineTo(_x2, (canvas.height -35 ));

                ctx.moveTo(_y1, (canvas.height -35 ));
                ctx.lineTo(_y2, (canvas.height -35 ));

                ctx.stroke();
            }


            ctx.strokeStyle = "#FFFFFF";
            ctx.lineWidth = 10;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
    }


    function map_geocoder() {
        var geocoder = new MapboxGeocoder({ accessToken: mapboxgl.accessToken });
            geocoder.addTo('#street_geocoder');
            geocoder.on('result', function (e) {
              console.log(e);
              console.log(e.result.center);
              default_center = e.result.center;
              draw_map();
             });

    }    

    _int();
    draw_map();
    map_geocoder();

    /**** street map actions ****/
    $("#streetmap-location input").change(function(){
        console.log($(this).val());
    });

    $("#street_geocoder input").attr('placeholder','Enter a location');


    var style = {
        forest : 'mapbox://styles/samcefforts/ckq4tg8ne4mt017mggrn52uu5',
        ink : 'mapbox://styles/samcefforts/ckq4su26v0e1e18p3hxe414hb',
        rose : 'mapbox://styles/samcefforts/ckq568ss90r3718p3y35ibfw2',
        pride : 'mapbox://styles/samcefforts/ckq4v9ffa1oek18qcbs11n0in',
        silver : 'mapbox://styles/samcefforts/ckq55s44i61l217n6rcnhcu1y',
        dimention : 'mapbox://styles/samcefforts/ckq4vrl7x3oz818mjcqvoadma',
        joy : 'mapbox://styles/samcefforts/ckq4xu0p2085817leddmjmfdy',
        allure : 'mapbox://styles/samcefforts/ckq4xrhwo1qty18qcnn6km0gj',
        berry : 'mapbox://styles/samcefforts/ckq4tk5a11tnn17lahm5wzoj1',
        blueprint : 'mapbox://styles/samcefforts/ckq4wwgz91wvk17lauqjuapfm',
        teal : 'mapbox://styles/samcefforts/ckq4trorl048a17lecn2ea6h2',
        emerald : 'mapbox://styles/samcefforts/ckq4thlud1tl217lajiycm170',
        turquoise : 'mapbox://styles/samcefforts/ckq4rzjx10ekx17rr4tdpah40',
        skyway : 'mapbox://styles/samcefforts/ckq4sddk201p317n21r40gz6r',
        wine : 'mapbox://styles/samcefforts/ckq4sglkr01s817n2m9gyr9uk',
        marine : 'mapbox://styles/samcefforts/ckq4wg1km1wg317laop0ad3el',
        sepia : 'mapbox://styles/samcefforts/ckq4sr4n076nu18rlk3y6ulak',
        binary : 'mapbox://styles/samcefforts/ckq4vkjkl0jmq18pkrv3t5toi',
        gold : 'mapbox://styles/samcefforts/ckq4u468l1qix17o6lx6eczhd',
        cinnamon : 'mapbox://styles/samcefforts/ckq4tmlud3fj917mrqxvqtdyx',
        route : 'mapbox://styles/samcefforts/ckq4sbugs5oip17n6y1na5ziq',
        denim : 'mapbox://styles/samcefforts/ckq4s2izd1lat18qcedxwiias'
    };

    var customStyle = {
        Modern :   'silver',
        Legend :   'ink',
        dimention :   'joy',
        Smooth :   'blueprint',
        Valentine :   'allure',
        Humble :   'turquoise',
        Playroom :   'cinnamon',
        Nära :   'skyway',
        Gaia :   'denim'
    };

    $("#streetmap-theme input").change(function(){
        var stic = jQuery("#streetmap-theme input:checked").val();
        console.log(stic);
        var theme = stic.split("_");
        default_style = style[theme[0]];
        default_class = theme[0];
        draw_map(default_center, default_zoom, default_style, default_marker);
        $("#canvas-container").removeClass();
        $("#canvas-container").addClass("canvas-container");
        $("#canvas-container").addClass(theme[0]);
        $("#copy_canvas-container").removeClass();
        $("#copy_canvas-container").addClass("canvas-container");
        $("#copy_canvas-container").addClass(theme[0]);
        $("#cpk-theme-style").val(theme[0]);
    });
    jQuery("#cpk-custom-style input").change(function(){
        var custom_style = jQuery("#cpk-custom-style input:checked").val();
        console.log(custom_style);
        var theme = custom_style.split("_");
        console.log(theme);
        default_class = customStyle[theme[0]];
        draw_map(default_center, default_zoom, default_style, default_marker);
        $("#canvas-container").removeClass();
        $("#canvas-container").addClass("canvas-container");
        $("#canvas-container").addClass(default_class);
        $("#copy_canvas-container").removeClass();
        $("#copy_canvas-container").addClass("canvas-container");
        $("#copy_canvas-container").addClass(default_class);
        $("#cpk-custom-style").val(theme[0]);
    });
    $('#streetmap-size-selector input').change(function(){
        var layout = $("#streetmap-size-selector input:checked").val();
        $("#canvas-streetmap").removeClass();
        $("#canvas-streetmap").addClass("canvas-default-size");
        $("#canvas-streetmap").addClass(trimValue(layout));
        $("#copy_canvas-streetmap").removeClass();
        $("#copy_canvas-streetmap").addClass("canvas-default-size");
        $("#copy_canvas-streetmap").addClass(trimValue(layout));
        mapResize();
    });
    $('.streetmap-size-inch').change(function(){
        var size = $(".streetmap-size-inch-div.tc-container-enabled input:checked").val();
        $("#canvas-streetmap").removeClass();
        $("#canvas-streetmap").addClass("canvas-default-size");
        $("#copy_canvas-streetmap").removeClass();
        $("#copy_canvas-streetmap").addClass("canvas-default-size");
        var layout = $("#streetmap-size-selector input:checked").val();
        $("#canvas-streetmap").addClass(trimValue(layout));
        $("#canvas-streetmap").addClass("s_"+trimValue(size).toString());
        $("#copy_canvas-streetmap").addClass(trimValue(layout));
        $("#copy_canvas-streetmap").addClass("s_"+trimValue(size).toString());
        mapResize();
    });

    /**** street map actions ****/
    $("#streetmap-headline input").keyup(function(){
        _new_header = $(this).val();
        $(".street-labels .street-header").text($(this).val());
    });
    $("#streetmap-divider input").keyup(function(){
        _new_divider = $(this).val();
        $(".street-labels .street-divider").text($(this).val());
    });
    $("#streetmap-tagline input").keyup(function(){
        _new_tagline = $(this).val();
        $(".street-labels .street-tagline").text($(this).val());
    });
    $("#streetmap-headline input").change(function(){
        canvasDraw();
    });
    $("#streetmap-divider input").change(function(){
        canvasDraw();
    });
    $("#streetmap-tagline input").change(function(){
        canvasDraw();
    });
    
    function getActiveSize() {
        var _size = jQuery("#streetmap-size-selector input:checked").val();
        var _conversion = jQuery("#cpk-conversion input:checked").val();
        var _final_size = '';
        var _size_type = '';
        if( _size == "portrait_0" ){
            _final_size = jQuery(".cpk-port-size-inch-div.tc-container-enabled input:checked").val();
        }
        if( _size == "landscape_1" ) {
            _final_size = jQuery(".cpk-land-size-inch-div.tc-container-enabled input:checked").val();
        }
        if( _size == "square_2" ) {
            _final_size = jQuery(".cpk-square-size-inch-div.tc-container-enabled input:checked").val();
        }
        return trimValue(_final_size);
    }
    
    function priceCalculation() {
        var _size = getActiveSize();
console.log(_size);
    }
    
    //$("form.cpk-simple-cart-form").change(function(){ priceCalculation(); });
    


    jQuery("#streetmap-icon input[type=radio]").change(function() {
        var new_marker = default_marker_url + 'icon_' + trimValue(jQuery(this).val()) + '.png';
        _new_marker = new_marker;
        default_marker = _new_marker;
        var _marker_img = '<img src="' + new_marker + '" />';
        $(".cpk-icon").html(_marker_img);
        // draw_map(default_center, default_zoom, default_style, default_marker);
//         map.loadImage(default_marker, function(error, image) {
//             if (error) throw error;
//             map.addImage(_marker_img, image);
//             map.setLayoutProperty('cpk_points', 'icon-image', _marker_img);
//             canvasDraw();
//         });
    });

    $(document).on('click','.cpk-simple-cart-button',function(e){
        e.preventDefault();

        var _xcenter3 = map.getCenter();
        $("#cpk-map-lat-lng").val(JSON.stringify(_xcenter3));
        var _xzoom4 = map.getZoom();
        $("#cpk-map-zoom").val(Math.round(_xzoom4));
        
        var _ne = map.getBounds().getNorthEast();
        var _sw = map.getBounds().getSouthWest();
        var _Ne = [_ne.lng,_ne.lat];
        var _Sw = [_sw.lng,_sw.lat];
        $("#cpk-map-bound").val(JSON.stringify([_Sw,_Ne]));

        $('.cpk-loading').show();
    
        var _canvas_cpk = document.getElementById("cpkCanvas");

        var base_64 = _canvas_cpk.toDataURL('image/jpeg');

         console.log(base_64);

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