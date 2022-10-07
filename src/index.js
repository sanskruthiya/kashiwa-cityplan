import * as maplibregl from "maplibre-gl";
import 'maplibre-gl/dist/maplibre-gl.css';
import './style.css';

function getDescription(d) {
    return d == '第1種低層住居専用地域' ? '低層住宅の良好な環境を守るための地域です。小規模な店舗や事務所をかねた住宅や小中学校などが建てられます。' :
        d == '第2種低層住居専用地域' ? '主に低層住宅の良好な環境を守るための地域です。小中学校などのほか、150平方メートルまでの一定のお店などが建てられます。' :
        d == '第1種中高層住居専用地域' ? '中高層住宅の良好な環境を守るための地域です。病院、大学、500平方メートルまでの一定のお店などが建てられます。' :
        d == '第2種中高層住居専用地域' ? '主に中高層住宅の良好な環境を守るための地域です。病院、大学などのほか、1,500平方メートルまでの一定のお店や事務所などが建てられます。' :
        d == '第1種住居地域' ? '住居の環境を守るための地域です。3,000平方メートルまでの店舗、事務所、ホテルなどは建てられます。' :
        d == '第2種住居地域' ? '主に住居の環境を守るための地域です。店舗、事務所、ホテル、ぱちんこ屋、カラオケボックスなどは建てられます。' :
        d == '準住居地域' ? '道路の沿道において、自動車関連施設などの立地と、これと調和した住居の環境を保護するための地域です。' :
        d == '近隣商業地域' ? '近隣の住民が日用品の買い物をする店舗等の業務の利便の増進を図る地域です。住宅や店舗のほかに小規模の工場も建てられます。' :
        d == '商業地域' ? '銀行、映画館、飲食店、百貨店、事務所などの商業等の業務の利便の増進を図る地域です。住宅や小規模の工場も建てられます。' :
        d == '準工業地域' ? '主に軽工業の工場等の環境悪化の恐れのない工業の業務の利便を図る地域です。危険性、環境悪化が大きい工場のほかは、ほとんど建てられます。' :
        d == '工業地域' ? '主として工業の業務の利便の増進を図る地域で、どんな工場でも建てられます。住宅やお店は建てられますが、学校、病院、ホテルなどは建てられません。' :
        d == '工業専用地域' ? '専ら工業の業務の利便の増進を図る地域です。どんな工場でも建てられますが、住宅、お店、学校、病院、ホテルなどは建てられません。' :
        '市街化調整区域です。市街化を抑制する区域で、新しい宅地・商業地の開発は原則的に認められません。';
}

function getColor(d) {
    return d == '第1種低層住居専用地域' ? '#00b285' :
           d == '第2種低層住居専用地域' ? '#7bd2b7' :
           d == '第1種中高層住居専用地域' ? '#78ce3f' :
           d == '第2種中高層住居専用地域' ? '#addf21' :
           d == '第1種住居地域' ? '#ebee5e' :
           d == '第2種住居地域' ? '#ffd2b6' :
           d == '準住居地域' ? '#ffa638' :
           d == '近隣商業地域' ? '#ffb0c3' :
           d == '商業地域' ? '#ff593d' :
           d == '準工業地域' ? '#a794c5' :
           d == '工業地域' ? '#b9eaff' :
           d == '工業専用地域' ? '#0ec7ff' :
           '#333';
}

function getUsage(d) {
    return d == '401' ? '業務施設（事業所など）' :
           d == '402' ? '商業施設' :
           d == '403' ? '宿泊施設' :
           d == '404' ? '商業系複合施設' :
           d == '411' ? '住宅' :
           d == '412' ? '共同住宅（マンション・アパートなど）' :
           d == '413' ? '店舗等併用住宅' :
           d == '414' ? '店舗等併用共同住宅' :
           d == '415' ? '作業所併用住宅' :
           d == '421' ? '官公庁施設' :
           d == '422' ? '文教厚生施設（学校、病院、寺社など）' : //文教厚生施設
           d == '431' ? '運輸倉庫施設' :
           d == '441' ? '工場' :
           d == '451' ? '農林漁業用施設' :
           d == '452' ? '水・電気等の供給用施設' : //供給処理施設
           d == '453' ? '防衛施設' :
           //d == '454' ? 'その他' :
           //d == '461' ? '不明' :
           '未調査';
}

const zoning_legend = document.getElementById('zoning-legend')
const zone_type = ['第1種低層住居専用地域', '第2種低層住居専用地域', '第1種中高層住居専用地域', '第2種中高層住居専用地域', '第1種住居地域', '第2種住居地域', '準住居地域', '近隣商業地域', '商業地域', '準工業地域', '工業地域', '工業専用地域']

for (let i = 0; i < zone_type.length; i++){
    zoning_legend.innerHTML += '<i style="background:' + getColor(zone_type[i]) + '"></i> ' + zone_type[i] + (zone_type[i + 1] ? '<br>' : '<hr>');
}
zoning_legend.innerHTML += '<i style="background:#ffffe0"></i>浸水想定：0.5m未満<br><i style="background:#f5deb3"></i>浸水想定：0.5m〜3m<br><i style="background:#ffc0cb"></i>浸水想定：3m〜5m<br><i style="background:#f08080"></i>浸水想定：5m〜10m<br><i style="background:#ee82ee"></i>浸水想定：20m以上<br><i style="background:#00bfff; border-radius: 50%;"></i>水害報告があった箇所周辺<hr><i style="border: 2px solid #1e90ff"></i>市・町丁目の境界'

const init_coord = [139.9709, 35.8622-0.025];
const init_zoom = 13;
const init_bearing = 0;
const init_pitch = 60;

const map = new maplibregl.Map({
    container: 'map',
    style: 'https://tile2.openstreetmap.jp/styles/osm-bright-ja/style.json',
    center: init_coord,
    interactive: true,
    zoom: init_zoom,
    minZoom: 5,
    maxZoom: 20,
    maxPitch: 85,
    maxBounds: [[110.0000, 25.0000],[170.0000, 50.0000]],
    bearing: init_bearing,
    pitch: init_pitch,
    attributionControl:false
});
/*
function convert_coord(lat, lng) {
    const japan_lat = lat * 1.000106961 - lng * 0.000017467 - 0.004602017;
    const japan_lng = lng * 1.000083049 + lat * 0.000046047 - 0.010041046;
    return [japan_lat, japan_lng]
};
*/
map.on('load', function () {
    map.addSource('floodrisk-area', {
        'type': 'raster',
        'tiles': ['https://disaportaldata.gsi.go.jp/raster/01_flood_l2_shinsuishin_data/{z}/{x}/{y}.png'],
        'tileSize': 256,
        'minzoom': 0,
        'maxzoom': 17
    });
    map.addLayer({
        'id': 'hazard_flood',
        'type': 'raster',
        'source': 'floodrisk-area',
        'layout': {
            'visibility': 'none',
        },
        'minzoom': 5,
        'maxzoom': 17
    });

    map.addSource('waterhazard-record', {
        'type': 'geojson',
        'data': './app/waterhazard_kashiwa.geojson',
    });
    map.addLayer({
        'id': 'waterhazard',
        'type': 'heatmap',
        'source': 'waterhazard-record',
        'minzoom': 10,
        //'maxzoom': 17,
        'paint': {
            'heatmap-weight': ['interpolate',['linear'],['get', 'count'],0,0,10,1],
            'heatmap-intensity': ['interpolate',['linear'],['zoom'],0,1,20,10],
            'heatmap-color': ['interpolate',['linear'],['heatmap-density'],0,'rgba(200,255,255,0)', 0.4, '#e0ffff', 1, '#00bfff'],
            'heatmap-radius': ['interpolate',['linear'],['zoom'],0,1,12,12,20,100],
            'heatmap-opacity': ['interpolate',['linear'],['zoom'],15,1,20,0]
        },  
        'layout': {
            'visibility': 'none',
        }
    });

    map.addSource('zoning-layer', {
        'type': 'geojson',
        'data': './app/zoning_kashiwa.geojson',
    });
    map.addLayer({
        'id': 'zoning_area_1',
        'type': 'fill',
        'source': 'zoning-layer',
        "minzoom": 10,
        'layout': {
            'visibility': 'none',
        },
        'paint': {
            'fill-color': ['get', 'fill'],
            'fill-opacity': 0.5,
        }
    });
    map.addLayer({
        'id': 'zoning_area_0',
        'type': 'fill',
        'source': 'zoning-layer',
        "minzoom": 10,
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'fill-color': 'transparent'
        }
    });

    const fc = {'type': 'FeatureCollection','features': []}

    map.addLayer({
        'id': 'admin_area0',
        'type': 'fill',
        'source': {
            'type':'geojson',
            'data':fc,
        },
        'filter': ['==', 'layer', 'area0'],
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': 'transparent',
        }
    });

    map.addLayer({
        'id': 'admin_line0',
        'type': 'line',
        'source': {
            'type':'geojson',
            'data':fc,
        },
        'filter': ['==', 'layer', 'area0'],
        'minzoom': 14,
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'line-color': '#1e90ff',
            'line-opacity': 0.8,
            'line-width': 1.5
        }
    });
    map.addLayer({
        'id': 'admin_line1',
        'type': 'line',
        'source': {
            'type':'geojson',
            'data':fc,
        },
        'filter': ['==', 'layer', 'area1'],
        "maxzoom": 14,
        'minzoom': 12,
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'line-color': '#1e90ff',
            'line-opacity': 0.8,
            'line-width': 2
        }
    });
    map.addLayer({
        'id': 'admin_line3',
        'type': 'line',
        'source': {
            'type':'geojson',
            'data':fc,
        },
        'filter': ['==', 'layer', 'area3'],
        "maxzoom": 12,
        'minzoom': 10,
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'line-color': '#1e90ff',
            'line-opacity': 0.8,
            'line-width': 2
        }
    });
    map.addLayer({
        'id': 'admin_line4',
        'type': 'line',
        'source': {
            'type':'geojson',
            'data':fc,
        },
        'filter': ['==', 'layer', 'area4'],
        'maxzoom': 10,
        //"minzoom": 5,
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'line-color': '#1e90ff',
            'line-opacity': 0.8,
            'line-width': 2
        }
    });

    let fgb_src01 = map.getSource('admin_area0')
    let fgb_src10 = map.getSource('admin_line0')
    let fgb_src11 = map.getSource('admin_line1')
    //let fgb_src12 = map.getSource('admin_line2')
    let fgb_src13 = map.getSource('admin_line3')
    let fgb_src14 = map.getSource('admin_line4')

    let loadFGB = async (url, updateCount) => {
        const response = await fetch(url);
        let meta, iter = flatgeobuf.deserialize(response.body, null, m => meta = m)
        for await (let feature of iter) {
          fc.features.push(feature)
          if (fc.features.length == meta.featuresCount || (fc.features.length % updateCount) == 0) {
            fgb_src01.setData(fc)
            fgb_src10.setData(fc)
            fgb_src11.setData(fc)
            //fgb_src12.setData(fc)
            fgb_src13.setData(fc)
            fgb_src14.setData(fc)
          }
        }
      }
    loadFGB('./app/censusarea_kashiwa.fgb', 512);

    map.addSource('townplan-layer', {
        'type': 'geojson',
        'data': './app/townplan_kashiwa.geojson'
    });
    map.addLayer({
        'id': 'townplan_area',
        'type': 'fill',
        'source': 'townplan-layer',
        'minzoom': 10,
        'layout': {
            'visibility': 'visible',
        },
        'paint': {
            'fill-color':  'transparent',
            'fill-outline-color':  '#555',
        }
    })

    map.addSource('plateau', {
        'type': 'vector',
        'tiles': [location.href+"/app/zxy/{z}/{x}/{y}.pbf"],
        "minzoom": 5,
        "maxzoom": 15,
    });
    map.addLayer({
        'id': 'kashiwa_building_all',
        'source': 'plateau',
        'source-layer': 'kashiwa_building_all',
        "minzoom": 5,
        "maxzoom": 21,
        'layout': {
            'visibility': 'visible',
        },
        'type': 'fill-extrusion',
        'paint': {
            "fill-extrusion-color": "#aaa",
            "fill-extrusion-opacity": 0.5,
            "fill-extrusion-height": ["get", "bldg_measuredHeight"]
        }
    });

    map.addSource('a-point-layer', {
        'type': 'geojson',
        'data': './app/population_kashiwa_202204.geojson',
    });
    map.addLayer({
        'id': 'point_area0',
        'type': 'symbol',
        'source': 'a-point-layer',
        'filter': ['==', 'area_flag', 'area0'],
        "minzoom": 14,
        'layout': {
            'icon-image': '',
            'text-field': ["format",['get', 'pop_string'], { "font-scale": 1, 'text-color': '#111'}, "人\n", ['get', 'name'], { "font-scale": 1, 'text-color': '#111'}],
            'text-anchor': 'top',
            'text-allow-overlap': true,
            'text-size': 12,
            'text-offset': [0, -1]
        }
    });
    map.addLayer({
        'id': 'point_area1',
        'type': 'symbol',
        'source': 'a-point-layer',
        'filter': ['==', 'area_flag', 'area1'],
        "maxzoom": 14,
        "minzoom": 12,
        'layout': {
            'icon-image': '',
            'text-field': ["format",['get', 'pop_string'], { "font-scale": 1, 'text-color': '#111'}, "人\n", ['get', 'name'], { "font-scale": 1, 'text-color': '#111'}],
            'text-anchor': 'top',
            'text-allow-overlap': true,
            'text-size': 12,
            'text-offset': [0, -1]
        }
    });
    /*
    map.addLayer({
        'id': 'point_area2',
        'type': 'symbol',
        'source': 'a-point-layer',
        'filter': ['==', 'area_flag', 'area2'],
        "maxzoom": 13,
        "minzoom": 12,
        'layout': {
            'icon-image': '',
            'text-field': ["format",['get', 'population'], { "font-scale": 1, 'text-color': '#111'}, "人\n", ['get', 'name'], { "font-scale": 0.8, 'text-color': '#111'}],
            'text-anchor': 'top',
        }
    });
    */
    map.addLayer({
        'id': 'point_area3',
        'type': 'symbol',
        'source': 'a-point-layer',
        'filter': ['==', 'area_flag', 'area3'],
        "maxzoom": 12,
        "minzoom": 10,
        'layout': {
            'icon-image': '',
            'text-field': ["format",['get', 'pop_string'], { "font-scale": 1, 'text-color': '#111'}, "人\n", ['get', 'name'], { "font-scale": 1, 'text-color': '#111'}],
            'text-anchor': 'top',
            'text-allow-overlap': true,
            'text-size': 13,
            'text-offset': [0, -1]
        }
    });
    map.addLayer({
        'id': 'point_area4',
        'type': 'symbol',
        'source': 'a-point-layer',
        'filter': ['==', 'area_flag', 'area4'],
        "maxzoom": 10,
        //"minzoom": 5,
        'layout': {
            'icon-image': '',
            'text-field': ["format",['get', 'pop_string'], { "font-scale": 1, 'text-color': '#111'}, "人\n", ['get', 'name'], { "font-scale": 1, 'text-color': '#111'}],
            'text-anchor': 'top',
            'text-allow-overlap': true,
            'text-size': 14,
            'text-offset': [0, -1]
        }
    });

    map.addSource('boundary-layer', {
        'type': 'geojson',
        'data': './app/boundary_kashiwa.geojson',
    });
    map.addLayer({
        'id': 'boundary_area',
        'type': 'fill',
        'source': 'boundary-layer',
        'layout': {
            'visibility': 'visible'
        },
        'paint': {
            'fill-color': 'transparent',
            'fill-outline-color': 'transparent'
        }
    });
});

map.on('click', 'boundary_area', function (e) {
    //let jp_latlng = convert_coord(JSON.stringify(e.lngLat.wrap().lat), JSON.stringify(e.lngLat.wrap().lng));
    let fquery_01 = map.queryRenderedFeatures(e.point, { layers: ['admin_area0'] })[0] !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['admin_area0'] })[0].properties : "no-layer";
    let fquery_02 = map.queryRenderedFeatures(e.point, { layers: ['zoning_area_0'] })[0] !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['zoning_area_0'] })[0].properties : "no-layer";
    let fquery_03 = map.queryRenderedFeatures(e.point, { layers: ['townplan_area'] })[0] !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['townplan_area'] })[0].properties : "no-layer";
    let fquery_04 = map.queryRenderedFeatures(e.point, { layers: ['kashiwa_building_all'] })[0] !== undefined ? map.queryRenderedFeatures(e.point, { layers: ['kashiwa_building_all'] })[0].properties : "no-layer";
    
    let popupContent = '<p class="tipstyle02">地域名：' + (fquery_01 !== "no-layer" ? fquery_01["area0"] + '</p>': '区域外') + '<p class="tipstyle02">' + 
    (fquery_04 !== "no-layer" ? 'この建物は<span class="style01">' + getUsage(fquery_04["bldg_usage"])+'</span>です。<br>' : '') +'この地点は<span class="style01">' +
    (fquery_02 !== "no-layer" ? '市街化区域（市街化を推進する区域）' : '市街化調整区域（原則的に宅地や商業地の開発を制限する区域）') + '</span>に区分されています。' + 
    (fquery_02 !== "no-layer" ? '<br><span class="style01">' + fquery_02["用途"]+'</span>の用途地域に該当し、<span class="style01">'+ getDescription(fquery_02["用途"]) +'</span>' : '') +
    (fquery_03 !== "no-layer" ? '<br>さらに詳細な地区計画として「<span class="style01"><a href="' + fquery_03["url"] + '" target="_blank">'+ fquery_03["name"] +'</a></span>」に記載された規制がかけられています。' :  '') + 
    '</p><hr>'+'<p class="remark"><a href="https://www.google.com/maps/@?api=1&map_action=map&center='+e.lngLat.wrap().lat.toFixed(5)+','+e.lngLat.wrap().lng.toFixed(5)+'&zoom=18" target="_blank">この地点のGoogleマップへのリンク</a><br><a href="https://www.city.kashiwa.lg.jp/documents/4418/seigen02.pdf" target="_blank">用途地域の具体的な建物規制一覧（柏市HP）</a></p>'
    //'</p><hr>'+'<p class="remark"><a href="https://www.google.com/maps/@?api=1&map_action=map&center='+e.lngLat.wrap().lat.toFixed(5)+','+e.lngLat.wrap().lng.toFixed(5)+'&zoom=18" target="_blank">この地点のGoogleマップへのリンク</a><br><a href="https://www.city.kashiwa.lg.jp/documents/4418/seigen02.pdf" target="_blank">用途地域の具体的な建物規制一覧（柏市HP）</a><br><a href="https://www.machi-info.jp/machikado/kashiwa_city2/ToshikeiDisp.jsp?lon=' + jp_latlng[1] + '&lat=' + jp_latlng[0] + '">この地点の都市計画帳票を見る（柏市配信情報）</a></p>'
    
    new maplibregl.Popup({closeButton:true, focusAfterOpen:false})
    .setLngLat(e.lngLat)
    .setHTML(popupContent)
    .addTo(map);
});
map.on('mouseenter', 'boundary_area', function () {
    map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'boundary_area', function () {
    map.getCanvas().style.cursor = '';
});

document.getElementById('b_layer').style.backgroundColor = "#fff";
document.getElementById('b_layer').style.color = "#555";

document.getElementById('b_bldg').style.backgroundColor = "#2c7fb8";
document.getElementById('b_bldg').style.color = "#fff";

document.getElementById('b_legend').style.backgroundColor = "#fff";
document.getElementById('b_legend').style.color = "#555";

document.getElementById('b_location').style.backgroundColor = "#2c7fb8";
document.getElementById('b_location').style.color = "#fff";

document.getElementById('b_hazard').style.backgroundColor = "#fff";
document.getElementById('b_hazard').style.color = "#555";

document.getElementById('b_wrecord').style.backgroundColor = "#fff";
document.getElementById('b_wrecord').style.color = "#555";

document.getElementById('b_layer').addEventListener('click', function () {
    const visibility = map.getLayoutProperty('zoning_area_1', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('zoning_area_1', 'visibility', 'none');
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        map.setLayoutProperty('zoning_area_1', 'visibility', 'visible');
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

document.getElementById('b_bldg').addEventListener('click', function () {
    const visibility = map.getLayoutProperty('kashiwa_building_all', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('kashiwa_building_all', 'visibility', 'none');
        map.flyTo({pitch:0, bearing:0, speed:0.5, zoom:map.getZoom()-0.5});
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        map.setLayoutProperty('kashiwa_building_all', 'visibility', 'visible');
        map.flyTo({pitch:60, bearing:0, speed:0.5});
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

document.getElementById('b_hazard').addEventListener('click', function () {
    const visibility = map.getLayoutProperty('hazard_flood', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('hazard_flood', 'visibility', 'none');
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        map.setLayoutProperty('hazard_flood', 'visibility', 'visible');
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

document.getElementById('b_wrecord').addEventListener('click', function () {
    const visibility = map.getLayoutProperty('waterhazard', 'visibility');
    if (visibility === 'visible') {
        map.setLayoutProperty('waterhazard', 'visibility', 'none');
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        map.setLayoutProperty('waterhazard', 'visibility', 'visible');
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

document.getElementById('legend').style.display ="none";

document.getElementById('b_legend').addEventListener('click', function () {
    const visibility = document.getElementById('legend');
    if (visibility.style.display == 'block') {
        visibility.style.display = 'none';
        this.style.backgroundColor = "#fff";
        this.style.color = "#555"
    }
    else {
        visibility.style.display = 'block';
        this.style.backgroundColor = "#2c7fb8";
        this.style.color = "#fff";
    }
});

const loc_options = {
    enableHighAccuracy: false,
    timeout: 5000,
    maximumAge: 0
};

document.getElementById('icon-loader').style.display = 'none';

let popup_loc = new maplibregl.Popup({anchor:"bottom", focusAfterOpen:false});
let marker_loc = new maplibregl.Marker();

document.getElementById('b_location').addEventListener('click', function () {
    this.setAttribute("disabled", true);
    this.style.backgroundColor = "#fff";
    this.style.color = "#555"
    document.getElementById('icon-loader').style.display = 'block';
    navigator.geolocation.getCurrentPosition(
        (position) => {
            marker_loc.remove();
            popup_loc.remove();
            document.getElementById('icon-loader').style.display = 'none';
            this.removeAttribute("disabled");
            this.style.backgroundColor = "#2c7fb8";
            this.style.color = "#fff";

            let c_lat = position.coords.latitude;
            let c_lng = position.coords.longitude;
            //let jp_latlng = convert_coord(c_lat, c_lng);
            
            map.jumpTo({
                center: [c_lng, c_lat],
                zoom: init_zoom + 1,
            });

            let pcenter = [(document.documentElement.clientWidth / 2), (document.documentElement.clientHeight / 2)];
            
            let fquery_01 = map.queryRenderedFeatures(pcenter, { layers: ['admin_area0'] })[0] !== undefined ? map.queryRenderedFeatures(pcenter, { layers: ['admin_area0'] })[0].properties : "no-layer";
            let fquery_02 = map.queryRenderedFeatures(pcenter, { layers: ['zoning_area_0'] })[0] !== undefined ? map.queryRenderedFeatures(pcenter, { layers: ['zoning_area_0'] })[0].properties : "no-layer";
            let fquery_03 = map.queryRenderedFeatures(pcenter, { layers: ['townplan_area'] })[0] !== undefined ? map.queryRenderedFeatures(pcenter, { layers: ['townplan_area'] })[0].properties : "no-layer";

            function popupText(f_01, f_02) {
                return f_01 === "no-layer" ? '<p class="tipstyle02">柏市の市域外です。</p><hr><p class="remark">地点情報が正確に取得できなかった場合は、現在地確認をもう一度お試しください。'
                     : f_02 === "no-layer" ? '<p class="tipstyle02">地域名：' + f_01["area0"] + '</p><p class="tipstyle02">現在地は<span class="style01">市街化調整区域（原則的に宅地や商業地の開発を制限する区域</span>に区分されています。'
                     : '<p class="tipstyle02">地域名：' + f_01["area0"] + '</p><p class="tipstyle02">現在地は<span class="style01">市街化区域（市街化を推進する区域）</span>に区分されています。';
            }
            //市街化区域内は全て用途地域指定がされている前提
            let popupContent = popupText(fquery_01, fquery_02) + 
            (fquery_02 !== "no-layer" ? '<br><span class="style01">' + fquery_02["用途"]+'</span>の用途地域に該当し、<span class="style01">'+ getDescription(fquery_02["用途"]) +'</span>' : '') +
            (fquery_03 !== "no-layer" ? '<br>さらに詳細な地区計画として「<span class="style01"><a href="' + fquery_03["url"] + '" target="_blank">'+ fquery_03["name"] +'</a></span>」に記載された規制がかけられています。' :  '') + 
            '</p>' + 
            //(fquery_01 !== "no-layer" ? '<hr><p class="remark"><a href="https://www.city.kashiwa.lg.jp/documents/4418/seigen02.pdf" target="_blank">用途地域の具体的な建物規制一覧（柏市HP）</a><br><a href="https://www.machi-info.jp/machikado/kashiwa_city2/ToshikeiDisp.jsp?lon=' + jp_latlng[1] + '&lat=' + jp_latlng[0] + '">この地点の都市計画帳票を見る（柏市配信情報）</a></p>' :  '');
            (fquery_01 !== "no-layer" ? '<hr><p class="remark"><a href="https://www.city.kashiwa.lg.jp/documents/4418/seigen02.pdf" target="_blank">用途地域の具体的な建物規制一覧（柏市HP）</a></p>' :  '');
            popup_loc.setLngLat([c_lng, c_lat]).setHTML(popupContent).addTo(map);
            marker_loc.setLngLat([c_lng, c_lat]).addTo(map);
        },
        (error) => {
            popup_loc.remove();
            document.getElementById('icon-loader').style.display = 'none';
            this.style.backgroundColor = "#999";
            this.style.color = "#fff"
            console.warn(`ERROR(${error.code}): ${error.message}`)
            map.flyTo({
                center: init_coord,
                zoom: init_zoom,
                speed: 1,
            });
            popup_loc.setLngLat(init_coord).setHTML('現在地が取得できませんでした').addTo(map);
        },
        loc_options
    );
});

const attCntl = new maplibregl.AttributionControl({
    customAttribution: '<a href="https://disaportal.gsi.go.jp/hazardmap/copyright/opendata.html" target="_blank">洪水浸水想定区域:想定最大規模(ハザードマップポータルサイト, 国土交通省）</a>| <a href="https://www.geospatial.jp/ckan/dataset/plateau-12217-kashiwa-shi-2020" target="_blank">建物・用途地域（2020年度, 3D都市モデルPLATEAU）</a>| <a href="https://www.city.kashiwa.lg.jp/databunseki/shiseijoho/jouhoukoukai/opendate/flood_history.html" target="_blank">水害履歴(2022年7月1日更新, 柏市オープンデータ)</a> | <a href="https://geoshape.ex.nii.ac.jp/ka/resource/12217.html" target="_blank">町丁目字界</a> | <a href="https://www.city.kashiwa.lg.jp/databunseki/shiseijoho/toukei/jinko/daichooaza.html" target="_blank">柏市住民基本台帳人口（2022年4月）</a> | <a href="https://www.city.kashiwa.lg.jp/toshikeikaku/shiseijoho/keikaku/machizukuri/machizukuri/machizukuri.html" target="_blank">柏市のまちづくり</a> | 公開情報に基づき作成者が独自に加工（<a href="https://twitter.com/Smille_feuille" target="_blank">Twitter</a> | <a href="https://github.com/sanskruthiya/kashiwa-cityplan" target="_blank">Github</a>） ',
    compact: true
});

map.addControl(attCntl, 'bottom-right');
