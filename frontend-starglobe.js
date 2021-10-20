var wcdf_functions = {};
    var _constellation_on = true;
    var _grid_on = true;
    var _width_new = 300;
    var _height_new = 300;
    var _port = 'portrait';
    var _port_inch = 'default';
var planetarium;
        S(document).ready(function(){
            skydefault = S.virtualsky();
            planetarium = S.virtualsky({id:'starmapPreview',width:_width_new,height:_height_new});
            planetarium.draw();
            update();
        });
        var changedtime = false;
        function update(el) {
            property = (el) ? el.name : "";
            value = (el) ? el.value : "";

            planetarium.selectProjection('polar');
            planetarium.mouse = false;
            planetarium.keyboard = false;
            planetarium.gradient = false;
            planetarium.negative = false;
            planetarium.cardinalpoints = false;
            planetarium.constellation.lines = _constellation_on;
            planetarium.constellation.labels = false;
            planetarium.constellation.boundaries = false;
            planetarium.meteorshowers = false;
            planetarium.showstars = true;
            planetarium.showstarlabels = false;
            planetarium.showplanets = false;
            planetarium.showplanetlabels = false;
            planetarium.showorbits = false;
            planetarium.showdate = false;
            planetarium.showposition = false;
            planetarium.grid.az = false;
            planetarium.grid.eq = _grid_on;
            planetarium.grid.gal = false;

            if(property == 'clock'){
                if(value){
                    planetarium.clock = new Date(value);
                    changedtime = true;
                }else{
                    planetarium.clock = new Date();
                    changedtime = false;
                }
            }
            var langcode = planetarium.langcode;
            if(property == 'position') planetarium.setGeo(value);
            if(property == 'background') planetarium.background = value;
            if(property == 'color') planetarium.color = value;
            if(property == 'magnitude') planetarium.magnitude = parseFloat(10);
            if(property == 'scalestars') planetarium.scalestars = parseFloat(1);

            if(property == 'grid') planetarium.grid.eq = value;
//             if(property == 'constellation') planetarium.constellation.lines = value;


            planetarium.updateColours();
            planetarium.draw();
            planetarium.setClock(0);


            if(property == 'live') planetarium.liveSky();
        }


(function(S){

    // An init function for the plugin
    function init(){
        // Attach a callback to the loadedPlanets event to calculate and draw the planets
        this.bind("loadedPlanets",function(d){
            this.jd = this.times.JD;
            var p = new Planets();
            var days = 365.25;
            this.planets = p.build(Math.floor(this.jd)-days*0.25,days*1.25);
            var loadtime = this.times.JD;
            var i = this.calendarevents.length;
            this.calendarevents.push(function(){
                if(Math.abs(loadtime-this.times.JD) >= days*0.25){
                    this.calendarevents.splice(i,1);    // Remove this one-time event
                    this.trigger('loadedPlanets');
                    this.draw();
                }
            })
            this.draw();
        });
    }

    // Create an object to deal with planet ephemerides
    function Planets(){
        // Heliocentric Osculating Orbital Elements Referred to the Mean Equinox and Ecliptic of Date for 2013: http://asa.usno.navy.mil/static/files/2013/Osculating_Elements_2013.txt
        // Values of the Osculating Orbital Elements for 8th August 1997: http://www.stargazing.net/kepler/ellipse.html
        // Uncertainties in RA (pre 2050) should be: <400" (Jupiter); <600" (Saturn); <50" everything else
        // See also: https://ssd.jpl.nasa.gov/txt/p_elem_t1.txt
        //           https://ssd.jpl.nasa.gov/?planet_pos
        this.planets = [{
            "name": "Me",
            "radius":2439.7,    // km
            "interval": 0.5,
            "colour": "rgb(170,150,170)",
            "magnitude": function(d){ return -0.36 + 5*log10(d.r*d.R) + 0.027 * d.FV + 2.2E-13 * Math.pow(d.FV,6); },
            "elements": [
                {"jd":2456280.5,"i":7.0053,"o":48.485,"p":77.658,"a":0.387100,"n":4.09232,"e":0.205636,"L":191.7001},
                {"jd":2456360.5,"i":7.0052,"o":48.487,"p":77.663,"a":0.387098,"n":4.09235,"e":0.205646,"L":159.0899},
                {"jd":2456440.5,"i":7.0052,"o":48.490,"p":77.665,"a":0.387097,"n":4.09236,"e":0.205650,"L":126.4812},
                {"jd":2456520.5,"i":7.0052,"o":48.493,"p":77.669,"a":0.387098,"n":4.09235,"e":0.205645,"L":93.8725},
                {"jd":2456600.5,"i":7.0052,"o":48.495,"p":77.672,"a":0.387099,"n":4.09234,"e":0.205635,"L":61.2628},
                {"jd":2456680.5,"i":7.0052,"o":48.498,"p":77.677,"a":0.387098,"n":4.09234,"e":0.205633,"L":28.6524}
            ]
        },{
            "name": "V",
            "radius": 6051.9,    // km
            "interval": 1,
            "colour": "rgb(245,222,179)",
            "magnitude": function(d){ return -4.34 + 5*log10(d.a*d.R) + 0.013 * d.FV + 4.2E-7*Math.pow(d.FV,3); },
            "elements": [
                {"jd":2456280.5,"i":3.3949,"o":76.797,"p":132.00,"a":0.723328,"n":1.60214,"e":0.006777,"L":209.0515},
                {"jd":2456360.5,"i":3.3949,"o":76.799,"p":132.07,"a":0.723327,"n":1.60215,"e":0.006787,"L":337.2248},
                {"jd":2456440.5,"i":3.3949,"o":76.802,"p":131.97,"a":0.723333,"n":1.60213,"e":0.006780,"L":105.3980},
                {"jd":2456520.5,"i":3.3949,"o":76.804,"p":131.99,"a":0.723327,"n":1.60215,"e":0.006769,"L":233.5729},
                {"jd":2456600.5,"i":3.3949,"o":76.807,"p":132.03,"a":0.723326,"n":1.60215,"e":0.006775,"L":1.7475},
                {"jd":2456680.5,"i":3.3948,"o":76.808,"p":131.63,"a":0.723345,"n":1.60209,"e":0.006770,"L":129.9169}
            ]
        },{
            "name":"E",
            "elements" : [
                {"jd":2450680.5,"i":0.00041,"o":349.2,"p":102.8517,"a":1.0000200,"n":0.9855796,"e":0.0166967,"L":328.40353},
                {"jd":2456320.5,"i":0.0,"o":349.2,"p":103.005,"a":0.999986,"n":0.985631,"e":0.016682,"L":127.4201},
                {"jd":2456400.5,"i":0.0,"o":349.2,"p":103.022,"a":0.999987,"n":0.985630,"e":0.016677,"L":206.2740},
                {"jd":2456480.5,"i":0.0,"o":349.2,"p":103.119,"a":1.000005,"n":0.985603,"e":0.016675,"L":285.1238},
                {"jd":2456560.5,"i":0.0,"o":349.2,"p":103.161,"a":0.999995,"n":0.985618,"e":0.016682,"L":3.9752},
                {"jd":2456680.5,"i":0.0,"o":349.2,"p":103.166,"a":1.000005,"n":0.985603,"e":0.016693,"L":122.2544}
            ]
        },{
            "name":"Ma",
            "radius": 3386,    // km
            "interval": 1,
            "colour": "rgb(255,50,50)",
            "magnitude": function(d){ return -1.51 + 5*log10(d.r*d.R) + 0.016 * d.FV; },
            "elements":[
                {"jd":2450680.5,"i":1.84992,"o":49.5664,"p":336.0882,"a":1.5236365,"n":0.5240613,"e":0.0934231,"L":262.42784},
                {"jd":2456320.5,"i":1.8497,"o":49.664,"p":336.249,"a":1.523605,"n":0.524079,"e":0.093274,"L":338.1493},
                {"jd":2456400.5,"i":1.8497,"o":49.666,"p":336.268,"a":1.523627,"n":0.524068,"e":0.093276,"L":20.0806},
                {"jd":2456480.5,"i":1.8496,"o":49.668,"p":336.306,"a":1.523731,"n":0.524014,"e":0.093316,"L":62.0048},
                {"jd":2456560.5,"i":1.8495,"o":49.666,"p":336.329,"a":1.523748,"n":0.524005,"e":0.093385,"L":103.9196},
                {"jd":2456680.5,"i":1.8495,"o":49.665,"p":336.330,"a":1.523631,"n":0.524066,"e":0.093482,"L":166.8051}
            ]
        },{
            "name":"J",
            "radius": 69173,    // km
            "interval": 10,
            "colour": "rgb(255,150,150)",
            "magnitude": function(d){ return -9.25 + 5*log10(d.r*d.R) + 0.014 * d.FV; },
            "elements":[
                {"jd":2456280.5,"i":1.3033,"o":100.624,"p":14.604,"a":5.20269,"n":0.083094,"e":0.048895,"L":68.0222},
                {"jd":2456360.5,"i":1.3033,"o":100.625,"p":14.588,"a":5.20262,"n":0.083095,"e":0.048895,"L":74.6719},
                {"jd":2456440.5,"i":1.3033,"o":100.627,"p":14.586,"a":5.20259,"n":0.083096,"e":0.048892,"L":81.3228},
                {"jd":2456520.5,"i":1.3033,"o":100.629,"p":14.556,"a":5.20245,"n":0.083099,"e":0.048892,"L":87.9728},
                {"jd":2456600.5,"i":1.3033,"o":100.631,"p":14.576,"a":5.20254,"n":0.083097,"e":0.048907,"L":94.6223},
                {"jd":2456680.5,"i":1.3033,"o":100.633,"p":14.592,"a":5.20259,"n":0.083096,"e":0.048891,"L":101.2751}
            ]
        },{
            "name":"S",
            "radius": 57316,    // km
            "interval": 10,
            "colour": "rgb(200,150,150)",
            "magnitude": function(d){
                var slon = Math.atan2(d.y,d.x);
                var slat = Math.atan2(d.z, Math.sqrt(d.x*d.x + d.y*d.y));
                while(slon < 0){ slon += 2*Math.PI; }
                while(slon >= 360){ slon -= 2*Math.PI; }
                var ir = d.d2r*28.06;
                var Nr = d.d2r*(169.51 + 3.82E-5 * (d.jd-2451543.5));    // Compared to J2000 epoch
                var B = Math.asin(Math.sin(slat) * Math.cos(ir) - Math.cos(slat) * Math.sin(ir) * Math.sin(slon-Nr));
                return -9.0  + 5*log10(d.r*d.R) + 0.044 * d.FV + (-2.6 * Math.sin(Math.abs(B)) + 1.2 * Math.pow(Math.sin(B),2));
            },
            "elements":[
                {"jd":2456280.5,"i":2.4869,"o":113.732,"p":90.734,"a":9.51836,"n":0.033583,"e":0.055789,"L":208.6057},
                {"jd":2456360.5,"i":2.4869,"o":113.732,"p":90.979,"a":9.52024,"n":0.033574,"e":0.055794,"L":211.2797},
                {"jd":2456440.5,"i":2.4869,"o":113.732,"p":91.245,"a":9.52234,"n":0.033562,"e":0.055779,"L":213.9525},
                {"jd":2456520.5,"i":2.4869,"o":113.732,"p":91.500,"a":9.52450,"n":0.033551,"e":0.055724,"L":216.6279},
                {"jd":2456600.5,"i":2.4870,"o":113.732,"p":91.727,"a":9.52630,"n":0.033541,"e":0.055691,"L":219.3014},
                {"jd":2456680.5,"i":2.4870,"o":113.733,"p":92.021,"a":9.52885,"n":0.033528,"e":0.055600,"L":221.9730}
            ]
        },{
            "name":"U",
            "radius": 25266,    // km
            "interval": 20,
            "colour": "rgb(130,150,255)",
            "magnitude": function(d){ return -7.15 + 5*log10(d.r*d.R) + 0.001 * d.FV; },
            "elements":[
                {"jd":2456280.5,"i":0.7726,"o":74.004,"p":169.227,"a":19.2099,"n":0.011713,"e":0.046728,"L":9.1400},
                {"jd":2456360.5,"i":0.7727,"o":73.997,"p":169.314,"a":19.2030,"n":0.011720,"e":0.047102,"L":10.0873},
                {"jd":2456440.5,"i":0.7728,"o":73.989,"p":169.434,"a":19.1953,"n":0.011727,"e":0.047509,"L":11.0340},
                {"jd":2456520.5,"i":0.7728,"o":73.989,"p":169.602,"a":19.1882,"n":0.011733,"e":0.047874,"L":11.9756},
                {"jd":2456600.5,"i":0.7728,"o":73.985,"p":169.740,"a":19.1816,"n":0.011739,"e":0.048215,"L":12.9200},
                {"jd":2456680.5,"i":0.7728,"o":73.983,"p":169.962,"a":19.1729,"n":0.011747,"e":0.048650,"L":13.8617}
            ]
        },{
            "name":"N",
            "radius": 24553,    // km
            "interval": 20,
            "colour": "rgb(100,100,255)",
            "magnitude": function(d){ return -6.90 + 5*log10(d.r*d.R) + 0.001 * d.FV; },
            "elements":[
                {"jd":2456280.5,"i":1.7686,"o":131.930,"p":53.89,"a":30.0401,"n":0.005990,"e":0.010281,"L":333.6121},
                {"jd":2456360.5,"i":1.7688,"o":131.935,"p":56.47,"a":30.0259,"n":0.005994,"e":0.010138,"L":334.0856},
                {"jd":2456440.5,"i":1.7690,"o":131.940,"p":59.24,"a":30.0108,"n":0.005999,"e":0.009985,"L":334.5566},
                {"jd":2456520.5,"i":1.7692,"o":131.946,"p":61.52,"a":29.9987,"n":0.006002,"e":0.009816,"L":335.0233},
                {"jd":2456600.5,"i":1.7694,"o":131.951,"p":63.84,"a":29.9867,"n":0.006006,"e":0.009690,"L":335.4937},
                {"jd":2456680.5,"i":1.7697,"o":131.957,"p":66.66,"a":29.9725,"n":0.006010,"e":0.009508,"L":335.9564}
            ]
        }];
    
        this.d2r = Math.PI/180;
        this.r2d = 180/Math.PI;
        this.AUinkm = 149597870.700;
        return this;
    }

    // Build an array containing all the planets
    // Inputs:
    //  jd = the Julian Date to calculate from
    //  days = the number of days to calculate ephemerides for
    Planets.prototype.build = function(jd,days){
        var arr = new Array(this.planets.length-1);
        var b = 0;
        if(!days) days = 365.25;
        for(var a = 0 ; a < this.planets.length ; a++){
            if(this.planets[a].colour) arr[b++] = this.buildPlanet(a,jd,days);
        }
        return arr;
    }
    
    // Build the data array for a particular planet
    // Inputs:
    //  planet = the ID of the planet
    //  jd = the Julian Date to calculate from
    //  days = the number of days to calculate ephemerides for
    Planets.prototype.buildPlanet = function(planet,jd,days){
        var p,coord,interval,n,jdcurr;
        if(typeof planet==="number"){
            p = planet;
        }else{
            var match = -1;
            for(var a = 0 ; a < this.planets.length ; a++){
                if(this.planets[a].name==planet) match = a;
            }
            if(match < 0) return this;
            if(match == 2) return this;    // Can't calculate Earth
            p = match;
        }
    
        interval = (typeof this.planets[p].interval==="number" ? this.planets[p].interval : 1);
    
        // Build an array of the form:
        // [Planet name,colour,[jd_1, ra_1, dec_1, mag_1, jd_2, ra_2, dec_2, mag_2....]]
        n = Math.floor(days/interval);
        var arr = new Array(3);
        arr[0] = this.planets[p]["name"];
        arr[1] = this.planets[p]["colour"];
        arr[2] = new Array(n*4);

        jdcurr = jd;
        for(var i = 0 ; i < n; i++){
            jdcurr += interval;
            coord = this.getEphem(p,jdcurr);
            arr[2][i*4+0] = jdcurr;
            arr[2][i*4+1] = coord[0];
            arr[2][i*4+2] = coord[1];
            arr[2][i*4+3] = coord[2];
        }
        return arr;
    }
    
    
    // Get the ephemeris for the specified planet number
    // Input:
    //   planet = ID
    //   day = Julian Date to calculate the ephemeris for
    // Method from http://www.stargazing.net/kepler/ellipse.html#twig06
    Planets.prototype.getEphem = function(planet,day){
    
        var i,v,e,x,y,z,ec,q,ra,dc,R,mag,FV,phase;
    
        if(typeof planet==="number"){
            i = planet;
        }else{
            var match = -1;
            for(var a = 0 ; a < this.planets.length ; a++){
                if(this.planets[a].name==planet) match = a;
            }
            if(match < 0) return this;
            if(match == 2) return this;    // Can't calculate Earth
            i = match;
        }

        // Heliocentric coordinates of planet
        v = this.getHeliocentric(this.planets[i],day);
    
        // Heliocentric coordinates of Earth
        e = this.getHeliocentric(this.planets[2],day);
    
        // Geocentric ecliptic coordinates of the planet
        x = v.xyz[0] - e.xyz[0];
        y = v.xyz[1] - e.xyz[1];
        z = v.xyz[2] - e.xyz[2];
    
        // Geocentric equatorial coordinates of the planet
        ec = 23.439292*this.d2r; // obliquity of the ecliptic for the epoch the elements are referred to
        q = [x,y * Math.cos(ec) - z * Math.sin(ec),y * Math.sin(ec) + z * Math.cos(ec)];
    
        ra = Math.atan(q[1]/q[0])*this.r2d;
        if(q[0] < 0) ra += 180;
        if(q[0] >= 0 && q[1] < 0) ra += 360;
    
        dc = Math.atan(q[2] / Math.sqrt(q[0]*q[0] + q[1]*q[1]))*this.r2d;
    
        R = Math.sqrt(q[0]*q[0] + q[1]*q[1] + q[2]*q[2]);
    
        // Calculate the magnitude (http://stjarnhimlen.se/comp/tutorial.html)
        var angdiam = (this.planets[i].radius*2/(R*this.AUinkm));
        mag = 1;
    
        // planet's heliocentric distance, v.r, its geocentric distance, R, and the distance to the Sun, e.r.
        FV = Math.acos( ( v.r*v.r + R*R - e.r*e.r ) / (2*v.r*R) );
        phase = (1 + Math.cos(FV))/2;
        mag = this.planets[i].magnitude({a:v.r,r:v.r,R:R,FV:FV*this.r2d,x:x,y:y,z:z,jd:day,d2r:this.d2r});

        return [ra,dc,mag];
    }
    
    Planets.prototype.getHeliocentric = function(planet,jd,i){
        var min = 1e10;
        var mn,p,d,M,v,r;
    
        // Choose a set of orbital elements
        if(!i){
            // Loop over elements and pick the one closest in time
            for(var j = 0; j < planet.elements.length ;j++){
                mn = Math.abs(planet.elements[j].jd-jd);
                if(mn < min){
                    i = j;
                    min = mn;
                }
            }
        }
        p = planet.elements[i];

        // The day number is the number of days (decimal) since epoch of elements.
        d = (jd - p.jd);
    
        // Heliocentric coordinates of planet
        M = this.meanAnomaly(p.n,d,p.L,p.p)
        v = this.trueAnomaly(M*this.d2r,p.e,10);
        r = p.a * (1 - Math.pow(p.e,2)) / (1 + p.e * Math.cos(v*this.d2r));
        return {xyz: this.heliocentric(v*this.d2r,r,p.p*this.d2r,p.o*this.d2r,p.i*this.d2r), M:M, v:v, r:r, i:i, d:d, elements:p};
    }
    
    // Find the Mean Anomaly (M, degrees) of the planet where
    //  n is daily motion
    //  d is the number of days since the date of the elements
    //  L is the mean longitude (deg)
    //  p is the longitude of perihelion (deg) 
    //  M should be in range 0 to 360 degrees
    Planets.prototype.meanAnomaly = function(d,n,L,p){
        var M = n * d + L - p;
        while(M < 0){ M += 360; }
        while(M >= 360){ M -= 360; }
        return M;
    }
    
    // Heliocentric coordinates of the planet where:    
    //  o is longitude of ascending node (radians)
    //  p is longitude of perihelion (radians)
    //  i is inclination of plane of orbit (radians)
    // the quantity v + o - p is the angle of the planet measured in the plane of the orbit from the ascending node
    Planets.prototype.heliocentric = function(v,r,p,o,i){
        var vpo = v + p - o;
        var svpo = Math.sin(vpo);
        var cvpo = Math.cos(vpo);
        var co = Math.cos(o);
        var so = Math.sin(o);
        var ci = Math.cos(i);
        var si = Math.sin(i);
        return [r * (co * cvpo - so * svpo * ci),r * (so * cvpo + co * svpo * ci),r * (svpo * si)]
    }
    
    /*
        Find the True Anomaly given
        m  -  the 'mean anomaly' in orbit theory (in radians)
        ecc - the eccentricity of the orbit
    */
    Planets.prototype.trueAnomaly = function(m,ecc,eps){
        var e = m;        // first guess
    
        if(typeof eps==="number"){
            var delta = 0.05; // set delta equal to a dummy value
            var eps = 10;     // eps - the precision parameter - solution will be within 10^-eps of the true value. Don't set eps above 14, as convergence can't be guaranteed
        
            while(Math.abs(delta) >= Math.pow(10,-eps)){    // converged?
                delta = e - ecc * Math.sin(e) - m;          // new error
                e -= delta / (1 - ecc * Math.cos(e));    // corrected guess
            }
            var v = 2 * Math.atan(Math.pow(((1 + ecc) / (1 - ecc)),0.5) * Math.tan(0.5 * e));
            if(v < 0) v+= Math.PI*2;
        }else{
            v = m + ( (2 * ecc - Math.pow(ecc,3)/4)*Math.sin(m) + 1.25*Math.pow(ecc,2)*Math.sin(2*m) + (13/12)*Math.pow(ecc,3)*Math.sin(3*m) );
        }
        return v*this.r2d; // return estimate
    }
    
    function formatRADec(ra,dec){
        var rah,ram,ras,dcd,dcm,dcs;
        ra /= 15;
        rah = Math.floor(ra);
        ram = Math.floor((ra-rah)*60);
        ras = (ra-rah-ram/60)*3600;
        dcd = Math.floor(dec);
        dcm = Math.floor((dec-dcd)*60);
        dcs = (dec-dcd-dcm/60)*3600;
        return (Math.abs(rah) < 10 ? "0":"")+rah+":"+(ram < 10 ? "0":"")+ram+":"+(ras < 10 ? "0":"")+ras.toFixed(2)+" "+(Math.abs(dcd) < 10 ? "0":"")+dcd+":"+(dcm < 10 ? "0":"")+dcm+":"+(dcs < 10 ? "0":"")+dcs.toFixed(2);
    }
    
    function getJD(today){
        if(!today) today = new Date();
        return ( today.getTime() / 86400000.0 ) + 2440587.5;
    }
    
    function rev(x) {
      return  x - Math.floor(x/360.0)*360.0
    }
    
    function log10(x) {
        return Math.LOG10E * Math.log(x);
    }

    var match = false;
    for(var i = 0; i < S.virtualsky.plugins.length; i++){
        if(S.virtualsky.plugins[i].name=="planets") match = true;
    }

    if(!match){
        S.virtualsky.plugins.push({
            init: init,
            name: 'planets',
            version: '1.0'
        });
    }

})(S);

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

    var _current_lat = '';
    var _current_lng = '';
    var _current_center = '';
    var _current_Style = '';

    var _time = '00:00';
    var _dateD = new Date();
    var _date = (_dateD.getMonth() + 1) + '/' + _dateD.getDate() + '/' + _dateD.getFullYear();

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
    _bgcolor['modern'] = {font_color : '#000000',background_color: '#ffffff',bg_color: '#ffffff'};
    _bgcolor['asphalt'] = {font_color : '#ffffff',background_color: '#172731',bg_color: '#2c404b'};
    _bgcolor['nautical'] = {font_color : '#335e61',background_color: '#fdf7ef',bg_color: '#b9dccd'};
    _bgcolor['retro'] = {font_color : '#df2828',background_color: '#a0d2cf',bg_color: '#f6fae5'};
    _bgcolor['dark'] = {font_color : '#ffffff',background_color: '#333333',bg_color: '#333333'};
    _bgcolor['bright'] = {font_color : '#ffffff',background_color: '#ffffff',bg_color: '#333333'};
    _bgcolor['nisshki'] = {font_color : '#ffffff',background_color: '#ffffff',bg_color: '#c00b32'};
    _bgcolor['gaia'] = {font_color : '#ffffff',background_color: '#f9f1e7',bg_color: '#aa5c14'};

    const _color = [];
    _color['white'] = {font_color : '#ffffff',background_color: '#ffffff'};
    _color['black'] = {font_color : '#000000',background_color: '#000000'};
    _color['gold'] = {font_color : '#ca8e72',background_color: '#ca8e72'};

    const myStyle = ['Minimal','Bold','Script','Divided','Boxed'];

    var style = 'Quote (Script)';
    var _h = 20;

    const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    function getOrdinalNum(n) {
      return n + (n > 0 ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : '');
    }
    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;

        return [monthNames[d.getMonth()], getOrdinalNum(day), year].join(' ');
    }

    var line_1 = '';
    var line_2 = '';
    var line_3 = formatDate(Date());
    var line_4 = '';

    $("#lineart-tagline input").val(line_3);

    function cpkDrawCanvasWithBG() {

        let _x = (canvas.width)/2;
        let _y = canvas.height - 20;

        let _Style = lineArtStyle[style];
//         console.log(style);
//         console.log(_Style);

        ctx.globalAlpha = 1;

        if( style == 'Boxed' ) {
            ctx.fillStyle = "white";
            ctx.fillRect(0, (_y - 80), canvas.width, (_y - 80));
            ctx.fillStyle = 'black';
        } else {
            ctx.fillStyle = _current_Style.font_color;
        }
 ctx.fillStyle = _current_Style.font_color;
        ctx.textAlign = "center";
        ctx.font = _Style.fontWeight + _Style.fontSize + 'adobe-garamond-pro,sans-serif';
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
        
        
        let _this_canvas = document.getElementById("starmapPreview_inner");
        if (_this_canvas != null)
        background_img = _this_canvas.toDataURL();

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if(jQuery.inArray(style, myStyle) !== -1){
            _h = 110;
        } else {
            _h = 20;
        }

        ctx.fillStyle = _current_Style.background_color;
        ctx.globalAlpha = 1;
        ctx.fillRect(0,0,canvas.width,canvas.height);


        if( background_img != "" ) { //console.log('Yes');
            let background = new Image();
            background.src = background_img;
            background.onload = function() {
                ctx.globalAlpha = 1;
                ctx.drawImage(background,10,10,300,300);
                cpkDrawCanvasWithBG();
            }
        } else {//console.log('no');
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

    function trimPlace(val) {
        return val.split(",");
    }

    function _int() {
        var _geocoder = '<div id="street_geocoder" class="geocoder"></div>';
        $("#streetmap-location li.tmcp-field-wrap").append(_geocoder);
        $('#street_geocoder').change(function(){
            var _loc = $(this).find('input').val();
            $("#streetmap-location input").val(_loc);
        });
    }

    function map_geocoder() {
        var mapboxgl_accessToken = 'pk.eyJ1Ijoic2FtY2VmZm9ydHMiLCJhIjoiY2txMjV0cmZhMDBnYTJvdXM0dWZydTc3OSJ9.LwKBKUp5AQkI4_P_kx6wdQ';
        var geocoder = new MapboxGeocoder({ accessToken: mapboxgl_accessToken });
            geocoder.addTo('#street_geocoder');
            geocoder.on('result', function (e) {

              console.log(e);
              let _loc = trimPlace(e.result.place_name);
              line_1 = _loc[0];
              line_2 = _loc.slice(-1).pop();
              $("#lineart-headline input").val(line_1);
              $("#lineart-divider input").val(line_2);

              _current_center = e.result.center;
              _current_lat = e.result.center[1];
              _current_lng = e.result.center[0];
              let _cl = _current_lat + ',' + _current_lng;
              line_4 = _current_lat + '°N' + ' / ' + _current_lng +'°E';

              _el = {name:'position',value: _cl.toString()};
    
              update(_el);

              $("#lineart-subline input").val(line_4);
              setStarMap();
                
            $("#cpk-map-lat-lng").val(JSON.stringify(_current_center));

             });

    }

    function setStarMap() {

        line_1 = $("#lineart-headline input").val();
        line_2 = $("#lineart-divider input").val();
        line_3 = $("#lineart-tagline input").val();
        line_4 = $("#lineart-subline input").val();

        $(".street-labels .street-header").text(line_1);
        $(".street-labels .street-divider").text(line_2);
        $(".street-labels .street-tagline").text(line_3);
        $(".street-labels .street-subline").text(line_4);

        if( _date && _time ){
            console.log(typeof _date);
            console.log(typeof _time);
            console.log(_date);
            console.log(_time);

//             let _ned = new Date(_date + ' ' + _time);
//                         console.log(typeof _ned);
//                         console.log(_ned);
//              let _el = {name:'clock',value: _ned.toString()};
//             update(_el);
        }
        
        if( _current_Style ) {
             let _el16 = {name:'background',value: _current_Style.bg_color};
            update(_el16);
             let _el2 = {name:'color',value: _current_Style.font_color};
            update(_el2);
        }

//             let _el12 = {name:'constellation',value: _constellation_on};
//             update(_el12);

//             let _el13 = {name:'grid',value: _grid_on};
//             update(_el13);


        $("#outer-lineart").css('background-color', _current_Style.background_color );

       setTimeout(function(){ 
            cpkDrawCanvas();
       },1500);

    }
    
//     setInterval(function(){ 

//           var _this_canvas = document.getElementById("starmapPreview_inner");
//         if (_this_canvas != null)
//         background_img = _this_canvas.toDataURL();
        
//     }, 500);

    function resizeCanvas() {
        let $_globSize = [];
$_globSize['portrait'] = {
						's_12x18' : {'width' : '800','height': '800'},
						's_30x45' : {'width' : '800','height': '800'},
						's_18x24' : {'width' : '1200','height': '1200'},
						's_45x60' : {'width' : '1200','height': '1200'},
						's_24x36' : {'width' : '1600','height': '1600'},
						's_60x90' : {'width' : '1600','height': '1600'},
						'default' : {'width' : '800','height': '800'}
					};
$_globSize['landscape'] = {
						's_18x12' : {'width' : '700','height': '700'},
						's_45x30' : {'width' : '700','height': '700'},
						's_24x18' : {'width' : '1000','height': '1000'},
						's_60x45' : {'width' : '1000','height': '1000'},
						's_36x24' : {'width' : '1400','height': '1400'},
						's_90x60' : {'width' : '1400','height': '1400'},
						'default' : {'width' : '700','height': '700'}
					};
$_globSize['square'] = {
						's_12x12' : {'width' : '650','height': '650'},
						's_30x30' : {'width' : '650','height': '650'},
						's_18x18' : {'width' : '1000','height': '1000'},
						's_45x45' : {'width' : '1000','height': '1000'},
						's_30x30' : {'width' : '1700','height': '1700'},
						's_76x76' : {'width' : '1700','height': '1700'},
						'default' : {'width' : '650','height': '650'}
					};
            let __siize = $_globSize[_port][_port_inch];
            _width_new = __siize.width;
            _height_new = __siize.height;
             setStarMap();
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
        setStarMap();
    }

   jQuery(".lineart-illustration-ul input").change(function() {
        var ill = jQuery(".tc-container-enabled .lineart-illustration-ul input:checked").data('image-variations');
        background_img = ill.image.full_src;
        setStarMap();
//         cpkDrawCanvas();
    });
    
    
   jQuery("input.sp-input").change(function() {
        var __background_color = jQuery("input.sp-input").val();
       // console.log(__background_color);
    });

    jQuery("#starmap-constellation input").change(function() {
      var background_color1 = jQuery("#starmap-constellation input:checked").val();
        
    if(background_color1){
    _constellation_on = true;
    } else {_constellation_on = false;}
    console.log(_constellation_on);update();
        });

   jQuery("#starmap-grid input").change(function() {
      var background_color1 = jQuery("#starmap-grid input:checked").val();
        
    if(background_color1){
    _grid_on = true;
    } else {_grid_on = false;}
    console.log(_grid_on);update();
        });

    
    
   jQuery("#modern-labels-color input").change(function() {
        font_color = jQuery("#modern-labels-color input").val();
       //console.log(font_color);
        setStarMap();
//         cpkDrawCanvas();
    });

    $("#lineart-color input").change(function(){
        var color = jQuery("#lineart-color input").val();
//         let _clr = trimFullValue(color);
//         background_img_color = _clr[0];
//         console.log(_clr);
//         updateCanvasClass(_clr[1], _clr[0]);
//         var _bg_n = _clr[1].toLowerCase();
//         var bcc = _bgcolor[_bg_n];
//         background_color = bcc.background_color;
//         font_color = _color[_clr[0]].font_color;
//         cpkDrawCanvas();
    });

    $("#lineart-theme input").change(function() {
        var stic = jQuery("#lineart-theme input:checked").val();
        var theme = stic.split("_");
        var _thm = theme[0].replace(/[^a-z0-9\s]/gi, '').replace(/[_\s]/g, ' ').toLowerCase();
        // console.log(_thm);
        $("#outer-lineart").removeClass();
        $("#outer-lineart").addClass("outer-lineart");
        $("#outer-lineart").addClass(_thm);
        _current_Style = _bgcolor[_thm];
        setStarMap();
    });

    $("#starglobe-date input").change(function() {
        _date = jQuery("#starglobe-date input").val();
              let _ned = new Date(_date + ' ' + _time);
                        console.log(typeof _ned);
                        console.log(_ned);
             let _el = {name:'clock',value: _ned.toString()};
            update(_el);
        setStarMap();
    });

    $("#starglobe-time input").change(function() {
        _time = jQuery("#starglobe-time input").val();
              let _ned = new Date(_date + ' ' + _time);
                        console.log(typeof _ned);
                        console.log(_ned);
             let _el = {name:'clock',value: _ned.toString()};
            update(_el);
        setStarMap();
    });

    


    // $(".lineart-style-div input").change(function(){
    //     // var _style = jQuery(".lineart-style-div input:checked").val();
    //     // style = trimValue(_style);
    //     // cpkDrawCanvas();
    // });

   $("#lineart-headline,#lineart-divider,#lineart-tagline,#lineart-subline").each(function(){
        $(this).keyup(function(){
            setStarMap();
        });
    });

    $('#cpk-size-selector input').change(function(){
        var layout = $("#cpk-size-selector input:checked").val();
        $("#canvas-lineart").removeClass();
        $("#canvas-lineart").addClass("canvas-default-size");
        $("#canvas-lineart").addClass(trimValue(layout));
        _port = trimValue(layout);
        _port_inch = 'default';
        resizeCanvas();
    });
    $('.cpk-size-inch').change(function(){
        var size = $(".cpk-size-inch-div.tc-container-enabled input:checked").val();
        $("#canvas-lineart").removeClass();
        $("#canvas-lineart").addClass("canvas-default-size");
        var layout = $("#cpk-size-selector input:checked").val();
        $("#canvas-lineart").addClass(trimValue(layout));
        $("#canvas-lineart").addClass("s_"+trimValue(size).toString());
        _port_inch = "s_"+trimValue(size).toString();
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

    _int();
    map_geocoder();
    setStarMap();
});
