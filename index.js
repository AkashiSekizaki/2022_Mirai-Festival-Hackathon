// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.
// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">


/*ボタン関連で使われる定数 */
const no_view = '路線表示なし';//何も表示していないとき
const view_on = "路線を表示する";
const view_off = "路線を消す";
const change_1 = "バス停と道を表示";
const change_2 = "道のみを表示";
const change_3 = "全て表示";


const d_num = 15;
const c_num = d_num - 1;

const wait_time = 500;
let change_state = 0;//0:全て表示,1:バス停と道,2:道のみ

/*バス停の名前、緯度、経度を路線毎に管理する変数 */
let L55A_datas_g;
let L55A_datas_s;
let L67A_datas_g;
let L67A_datas_s;
let L55G_datas_g;
let L55G_datas_s;

/*路線全部を辞書型で管理する */
let LINE_datas = [{}];
let LINE_names = [{}];

var now_path;
var now_line;
var now_labels;
var now_datas;
var directionsService;
var routeList = [];//一時保存用の緯度経度のリスト
var now_routeList  = [];//最終的に使う方の
var nums = [];
var Labels = [];
var directionsServices = [];

function init_datas_g(){
 L55A_datas_g = [
    ["はこだて未来大学",41.8402827971786,140.767163094997],
    ["赤川貯水池",41.84223884,140.7712726],
    ["赤川3区",41.83870983,140.7691542],
    ["赤川小学校",41.83480462,140.7671827],
    ["浄水場下",41.83028391,140.7643582],
    ["低区貯水池",41.82796476,140.7628158],
    ["赤川入口",41.82473855,140.7605171],
    ["赤川1丁目ライフステージ白ゆり美原前",41.82238153,140.7589393],
    ["赤川通",41.82031293,140.7571199],
    ["函館地方気象台前",41.81753828,140.7548838],
    ["亀田支所前",41.81573033,140.7517184]
  ];
 //67A系統
 L67A_datas_g = [
  ["昭和営業所前",    41.8199909,    140.739861],
  ["昭和一丁目［函館市］",    41.82202799,    140.7389411],
  ["昭和Ｔ［村瀬鉄工所前］",    41.82159892,    140.7410453],
  ["亀田中学校前",    41.81807683,    140.7467594],
  ["亀田支所前［ヤマダ電機前］",    41.81485691,    140.7545946],
  ["中央小学校前",    41.81380081,    140.7592423],
  ["神山通［鍛神小学校前］",    41.81142156,    140.7647091],
  ["鍛冶二丁目",    41.80964445,    140.7637006],
  ["鍛冶団地",    41.80684288,    140.7622159],
  ["西堀病院前",    41.80439786,    140.7600262],
  ["鍛冶さくら認定こども園",    41.80241255,    140.7579477],
  ["五稜郭公園裏",    41.79920478,    140.7548548],
  ["中央図書館前（図書館向かい）",    41.79861195,    140.7541928],
  ["五稜郭公園入口",    41.79194173,    140.7517388],
  ["五稜郭［シエスタハコダテ前］",    41.78991597,    140.7518094],
  ["五稜郭［丸井今井横］",    41.78811989,    140.751459],
  ["中央病院前",  41.78713372,    140.7512005],
  ["千代台",    41.78356902,    140.7480955],
  ["堀川町",    41.78022526,    140.7438901],
  ["昭和橋",    41.77806492,    140.7411596],
  ["千歳町",    41.77619821,    140.7388405],
  ["新川町",    41.77338558,    140.7353288],
  ["松風町［成田山前］",    41.77218631,    140.73399],
  ["棒二森屋前",    41.77172442,    140.7293291],
  ["函館駅前",    41.77323994,    140.7278341]
  ];
  L55G_datas_g = [
    ["赤川",    41.85474818,    140.7801762],
    ["下赤川",    41.84935873,    140.7772669],
    ["赤川４区",    41.84549416,    140.7739175],
    ["はこだて未来大学",    41.8402827971786,    140.767163094997],
    ["赤川貯水池",    41.84223884,    140.7712726],
    ["赤川小学校",    41.83480462,    140.7671827],
    ["浄水場下",    41.83028391,    140.7643582],
    ["低区貯水池",    41.82796476,    140.7628158],
    ["赤川入口",    41.82473855,    140.7605171],
    ["赤川1丁目ライフステージ白ゆり美原前",    41.82238153,    140.7589393],
    ["赤川通",    41.82031293,    140.7571199],
    ["函館地方気象台前",    41.81753828,    140.7548838],
    ["亀田支所前",    41.81573033,    140.7517184],
    ["亀田中学校前",    41.81802728,    140.7467492],
    ["昭和T[村瀬鉄工所前]",    41.82157898,    140.7410483],
    ["昭和一丁目",    41.82137059,    140.7392431],
    ["昭和営業所前",    41.81994019,    140.7398799]
];
  LINE_datas[0] = {
    "55A系統" :  L55A_datas_g,
    "67A系統" : L67A_datas_g,
    "55G系統" : L55G_datas_g,
  };
  LINE_names[0] = {
    "55A系統" : L55A_datas_g[L55A_datas_g.length - 1][0],
    "67A系統" : L67A_datas_g[L67A_datas_g.length - 1][0],
    "55G系統" : L55G_datas_g[L55G_datas_g.length - 1][0],
  };
}

function init_datas_s(){
  L55A_datas_s = [];
  for(var i = 0; i < L55A_datas_g.length; i++){
    L55A_datas_s.unshift(L55A_datas_g[i]);
  }
  L67A_datas_s = [
    ["函館駅前",41.77360242,140.72696991],
    ["松風町[プレイガイド前]",41.77181745,140.73098866],
    ["松風町[旧セブンイレブン前]",41.77223703,140.73375594],
    ["新川町",41.77340512,140.73498446],
    ["千歳町",41.77582413,140.73805816],
    ["昭和橋",41.77796774,140.74073759],
    ["堀川町",41.78115264,140.744691],
    ["千代台",41.78362623,140.74781997],
    ["中央病院前",41.78665555,140.75079546],
    ["五稜郭[シダックス前]",41.79055579,140.75167306],
    ["五稜郭公園入口",41.791976,140.75186618],
    ["中央図書館前[図書館側]",41.79853827,140.75407644],
    ["五稜郭公園裏",41.79922299,140.75462703],
    ["鍛冶さくら認定こども園",41.80241255,140.75794766],
    ["西堀病院前",41.80439786,140.76002621],
    ["鍛冶団地",41.80684288,140.76221587],
    ["鍛冶二丁目",41.80964445,140.76370064],
    ["神山通り[北陸銀行近く]",41.81230193,140.7639715],
    ["中央小学校前",41.81423861,140.75636427],
    ["亀田支所前[バスターミナル]",41.81572455,140.75171103],
    ["亀田中学校前",41.81807683,140.74675942],
    ["昭和T[村瀬鉄工所前]",41.82114536,140.74130549]
    ];
    L55G_datas_s = [
      ["昭和T[村瀬鉄工所前]", 41.82157898, 140.7410483],
      ["亀田中学校前", 41.81802728, 140.7467492],
      ["亀田支所前", 41.81573033, 140.7517184],
      ["函館地方気象台前", 41.81753828, 140.7548838],
      ["赤川通", 41.82031293, 140.7571199],
      ["赤川1丁目ライフステージ白ゆり美原前", 41.82238153, 140.7589393],
      ["赤川入口", 41.82473855, 140.7605171],
      ["低区貯水池", 41.82796476, 140.7628158],
      ["浄水場下", 41.83028391, 140.7643582],
      ["赤川小学校", 41.83480462, 140.7671827],
      ["赤川貯水池", 41.84223884, 140.7712726],
      ["はこだて未来大学", 41.8402827971786, 140.767163094997],
      ["赤川４区", 41.84549416, 140.7739175],
      ["下赤川", 41.84935873, 140.7772669],
      ["赤川", 41.85474818, 140.7801762],
  ];
  LINE_datas[1] = {
    "55A系統" : L55A_datas_s,
    "67A系統": L67A_datas_s,
    "55G系統": L55G_datas_s,
    
  };
  LINE_names[1] = {
    "55A系統" : L55A_datas_s[L55A_datas_s.length-1][0],
    "67A系統" : L67A_datas_s[L67A_datas_s.length-1][0],
    "55G系統" : L55G_datas_s[L55G_datas_s.length-1][0],
  };
}
function initAutocomplete() {
  init_datas_g();
  init_datas_s();
    var map = new google.maps.Map(document.getElementById("map"), {
      center: { lat: 41.8418758, lng: 140.7669339 },
      zoom: 13,
      mapTypeId: "roadmap",
      styles: [{
        featureType: 'road',
         stylers: [{
             hue: '#ff0' //色相 16進数のRGB値を記載
         }, {
             saturation: -50 //彩度 -100〜100の値を記載
         }, {
             lightness: 0 //明度 -100〜100の値を記載
         }, {
             gamma: 0.5 //ガンマ値 0.01〜10.0の値を記載
         }]
     }]
    });

    // Create the search box and link it to the UI element.
    const input = document.getElementById("pac-input");

    const searchBox = new google.maps.places.SearchBox(input);
    
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);
    
    // Bias the SearchBox results towards current map's viewport.
    map.addListener("bounds_changed", () => {
      searchBox.setBounds(map.getBounds());
    });
    
    let markers = [];
    // Listen for the event fired when the user selects a prediction and retrieve
    // more details for that place.
    searchBox.addListener("places_changed", () => {
      const places = searchBox.getPlaces();
  
      if (places.length == 0) {
        return;
      }
      // Clear out the old markers.
      markers.forEach((marker) => {
        marker.setMap(null);
      });
      markers = [];
      // For each place, get the icon, name and location.
      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.log("Returned place contains no geometry");
          return;
        }
        const icon = {
          url: 'note.png',
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(65, 50),
        };
        // Create a marker for each place.
        markers.push(
          new google.maps.Marker({
            map,
            icon,
            title: place.name,
            position: place.geometry.location,
          })
        );
  
        if (place.geometry.viewport) {
          // Only geocodes have viewport.
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      map.fitBounds(bounds);
    });

    /*文字列の末尾に「へ」をつけるだけの関数 */
    function to(s){
      return s + "へ";
    }
    const LINE_name = document.getElementById("choose");
    const button = document.getElementById("Directions");
    const view_button = document.getElementById("view");
    const change_button = document.getElementById("change");
    button.addEventListener('click', updateButton);
    view_button.addEventListener('click',Controle_view);
    LINE_name.addEventListener('click',Controle_box);
    change_button.addEventListener('click',Controle_change);
    var pre_LINE = LINE_name.value;
    function Controle_change(){
      if(change_button.value == change_1){
        change_state = 1;
        change_button.value = change_2;
      }else if(change_button.value == change_2){
        change_state = 2;
        change_button.value = change_3;
      }else{
        change_state = 0;
        change_button.value = change_1;
      }
      if(view_button.value == view_off){
      change(map,change_state);
      }
    }
    function Controle_box(){//セレクトボックスの処理
      if(pre_LINE != LINE_name.value){
        if(view_button.value == view_off){
          remove_lines();
          button.value = to(LINE_names[1][LINE_name.value]);
          init_data(LINE_datas[0][LINE_name.value]);
          viewPrepare(map,LINE_datas[0][LINE_name.value]);
            view(map);
        }
        pre_LINE = LINE_name.value;
      }
    }
    function Controle_view(){//表示するボタンを押したときの処理
      if(view_button.value == view_on){
         view_button.value = view_off;
         button.value = to(LINE_names[1][LINE_name.value]);
        init_data(LINE_datas[0][LINE_name.value]);
        viewPrepare(map,LINE_datas[0][LINE_name.value]);
          view(map);
      }else{//路線を消すボタンが押されたときの処理
        view_button.value = view_on;
        button.value = no_view;
        remove_lines();
      }
    }   
    function init_label(){
      for(var i = 0; i < Labels.length; i++){
        Labels[i].setMap(null);
      }
      Labels = [];
    }
    function change(map,n){//表示を切り替える処理
      init_label();
      for(var i = 0; i < now_datas.length; i++){
        switch(n){
          case 0://全ての表示
          console.log("全て表示")
            Labels.push(new google.maps.Marker({
              position: new google.maps.LatLng(now_datas[i][1], now_datas[i][2]),
              map,
              title: now_datas[i][0],
              icon: {
                url: 'cute.png',
                scaledSize: new google.maps.Size(40, 40),
                labelOrigin: new google.maps.Point(20, 5)  //ラベルの基点
              },
              
              label: {
                text: now_datas[i][0],         //ラベル文字
                color: '#ff0000',          //ラベル文字の色
                fontFamily: 'sans-serif',  //フォント 
                fontWeight: 'bold',        //フォントの太さ 
                fontSize: '12px',           //フォントのサイズ 
             } ,
            }));
            break;
          case 1://ラベル消す
          console.log("ラベルを消す");
          Labels.push(new google.maps.Marker({
            position: new google.maps.LatLng(now_datas[i][1], now_datas[i][2]),
            map,
            icon: {
              title: now_datas[i][0],
              url: 'cute.png',
              scaledSize: new google.maps.Size(40, 40),
              labelOrigin: new google.maps.Point(20, 5)  //ラベルの基点
            },
            
            label: {
              text: " ",
              color: '#ff0000',          //ラベル文字の色
              fontFamily: 'sans-serif',  //フォント 
              fontWeight: 'bold',        //フォントの太さ 
              fontSize: '12px',           //フォントのサイズ 
           } ,
          }));
            break;
          case 2://道のみ
            console.log("道だけにした");
            Labels[i].setMap(null);
            break;
        }
      }
    }
    function remove(){
      console.log(Labels);
      for(var i = 0; i < Labels.length;i++ ){
        Labels[i].setMap(null);
      }

    }
    function inits(){
      now_path;
      now_line;
      directionsService;
      routeList = [];//一時保存用の緯度経度のリスト
      now_routeList  = [];//最終的に使う方の
      nums = [];
      Labels = [];
      for(var i = 0; i < directionsServices.length; i++){
        directionsServices[i] = null;
      }
      directionsServices = [];

    }

    /*線を消す処理 */
    function remove_lines(){
      now_path.setMap(null);
      now_line.setMap(null);
      remove();
      inits();
    }
    function animateCircle(line) {
      let count = 0;
    console.log(line);
      window.setInterval(() => {
        count = (count + 1) % 200;
    
        const icons = line.get("icons");
        icons[0].offset = count / 2 + "%";
        line.set("icons", icons);
      }, 20);
  
    }

    
    function updateButton() {//表示の向きを切り替える
      
      if(button.value == no_view){
        console.log("データを表示させてください");
      }else{
        remove_lines();
        if(view_button.value == view_off){
          var han = 0;
          var num = 1;
          console.log(button.value);
          console.log(LINE_names[1][LINE_name.value]);
          if(button.value  == to(LINE_names[1][LINE_name.value])){
            han = 1;
          }
          if(han == 1){
            num  = 0;
          }
          button.value = to(LINE_names[num][LINE_name.value]);
         init_data(LINE_datas[han][LINE_name.value]);
         viewPrepare(map,LINE_datas[han][LINE_name.value]);
           view(map);
       }

      }


  
  }

  function viewPrepare(map,datas){
    now_datas = datas;
    var rdatas = Array(datas.length);
    for(var i = 0; i < datas.length; i++){
      rdatas[i] = datas[i][1];
    }
    console.log("rdatas:" + rdatas);
    var j = 0;
    console.log("準備開始!!");
    Labels = [];
    directionsServices = Array(datas.length - 1);
    directionsServices.fill(new google.maps.DirectionsService());

    console.log(directionsServices);
    var n = Math.floor(datas.length / d_num);//もし地点の数が20を超えるのであれば複数回に分ける
    var l_position = [];
    for(var i = 0; i <= n; i++){
      l_position.push(datas[i*c_num][1]);
      var max_index = c_num*(i+1);
      if(max_index > datas.length-1){
        max_index = datas.length-1;
      }
      console.log("max_index:" + max_index);
      var D_waypoints = [];
      for(var j = c_num*i + 1; j < max_index-1; j++){
        var point = new google.maps.LatLng(datas[j][1],datas[j][2]);
        D_waypoints.push({
          location:point
        });
      }
      var s_point = new google.maps.LatLng(datas[c_num*i][1],datas[c_num*i][2]);
      var g_point = new google.maps.LatLng(datas[max_index][1],datas[max_index][2]);
      console.log(i + ":" + datas[c_num*i][0]);
      console.log(i + ":" + datas[max_index][0]);
      var request = {
        origin: s_point,
        destination: g_point,
        travelMode: google.maps.DirectionsTravelMode.DRIVING,
        waypoints : D_waypoints
      };
      directionsServices[i].route(request,function(result, status){
        console.log(l_position);
        console.log(result);
        console.log(result["request"]["origin"]["location"].lat());
        console.log(l_position.indexOf(result["request"]["origin"]["location"].lat()));
        insert(result.routes[0].overview_path,l_position.indexOf(result["request"]["origin"]["location"].lat()));
      });
    }
  }
  function view(map){
    setTimeout(function(){
    const lineSymbol = {
      //path: google.maps.SymbolPath.CIRCLE,
      path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
      scale: 3,
      strokeColor: "#000000",
    };
    console.log("描画開始");
    console.log(now_routeList);
    now_line = new google.maps.Polyline({
      path:now_routeList,
      strokeColor: "#00bfff",
      icons: [
        {
          icon: lineSymbol,
          offset: "100%",
          fillColor: "#ffffff",                //塗り潰し色
          fillOpacity: 1.0,                    //塗り潰し透過率
        },
      ],
      map: map,
    });
    animateCircle(now_line);
    now_path = new google.maps.Polyline({
      path: now_routeList,
      geodesic: true,
      strokeColor: "#00bfff",//線の色
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    //now_path.setMap(map);
    change(map,change_state);
  },wait_time);
  }
  function init_data(datas){
    if(datas.length <= d_num){
      nums = Array(1);
    }else{
      nums = Array(Math.floor((datas.length-d_num)/c_num) + 1);
    }
    nums.fill(0);
  }
  function insert(datas,r){
    console.log("r:" + r);
    var sum = 0;
    for(var i = 0; i < r ; i++){
      if(nums[i] != 0){
        sum++;
      }
    }
      console.log("sum:" + sum);
      routeList.splice(sum,0,datas);
    nums[r] = datas.length;
    for(var i = 0; i < nums.length; i++){
      if(nums[i] == 0){
        console.log(nums);
        console.log("まだ準備終わっていない");
        console.log(routeList);
        break;
      }
      if(i == nums.length - 1){
        console.log("準備完了!!");
        for(var i = 0; i < routeList.length; i++){
          for(var j = 0; j < routeList[i].length; j++){
            now_routeList.push(routeList[i][j]);
          }
        }
        routeList = [];
        nums = [];
      }
    }
  }
}