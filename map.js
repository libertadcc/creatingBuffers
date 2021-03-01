var map, tb;

require(["dojo/dom",

        "dojo/_base/array",
        "dojo/parser",
        "dojo/on",

        "esri/Color",
        "esri/config",
        "esri/map",
        "esri/graphic",

        "esri/tasks/GeometryService",
        "esri/tasks/BufferParameters",
  
        "esri/toolbars/draw",
  
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/SimpleFillSymbol",
        
        "dijit/layout/BorderContainer",
        "dijit/layout/ContentPane",
        "dijit/form/Button", "dojo/domReady!"
        ],
      function(dom, array, parser, on, Color, esriConfig, Map, Graphic, GeometryService, BufferParameters, Draw, SimpleLineSymbol, SimpleFillSymbol){

        parser.parse();


        geomService = new GeometryService("https://utility.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");


       //Setup button click handlers
      on(dom.byId("clearGraphics"), "click", function(){
        if(map){
          map.graphics.clear();
          initToolbar(map)
        };
      });

      map = new Map("map", {
        basemap: "streets",
        center: [-3.70325, 40.4167],
        zoom: 7
      });
      map.on("load", initToolbar);

      function initToolbar() {
        tb = new Draw(map);
        tb.activate(Draw.POLYLINE);
        tb.on("draw-complete", doBuffer);
      }


      function doBuffer(evtObj) {
        console.log(evtObj)
        tb.deactivate();
        var geometry = evtObj.geometry;
        symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255,0,0]), 1);
       

          var graphic = new Graphic(geometry, symbol);
          map.graphics.add(graphic);

          //setup the buffer parameters
          var params = new BufferParameters();
          params.distances = [10];
          params.outSpatialReference = map.spatialReference;
          params.unit = GeometryService.UNIT_KILOMETER;
          params.geometries= [geometry];
          
          geomService.buffer(params, showBuffer);
          // geomService.buffer(params);
          // geomService.on('buffer-complete', showBuffer)
        }

        function showBuffer(bufferedGeometries) {
          console.log(bufferedGeometries)
          var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SOLID,
              new Color([255,0,0,0.65]), 2
            ),
            new Color([255,0,0,0.35])
          );

          array.forEach(bufferedGeometries, function(geometry) {
            var graphic = new Graphic(geometry, symbol);
            map.graphics.add(graphic);
          });

          // const poligono = bufferedGeometries[0];
          // var graphic = new Graphic(poligono, symbol);
          // map.graphics.add(graphic);

        }
  });