import { ref } from 'vue'

function getAuthorizationHeader() {
  const AppID = '9cf5f22a363c4058b1262cbf3be0eef9';
  const AppKey = 'jojLjf4QvzK_2rNOLGNDh2qEJk0';

  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update('x-date: ' + GMTString);
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

  return { 'Authorization': Authorization, 'X-Date': GMTString /*,'Accept-Encoding': 'gzip'*/ };
}


// https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taipei?$top=10&$format=JSON

const getCityBus = () => {
  const headers = getAuthorizationHeader()
  const busData = ref([])
  const busStopData = ref([])


  const loadBus = async (city = 'Taipei') => {
    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${city}?$select=RouteName,DepartureStopNameZh,destinationStopNameZh,RouteUID&$format=JSON`, { headers })
      const data = await res.json()
      busData.value = data

    } catch (error) {
      console.log(error)
    }

  }
  // https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/Taipei/12?$filter=contains(RouteID%2C%2710864%27)&$format=JSON
  const loadBusStop = async (city, routeName, routeUID) => {
    console.log("🚀 ~ file: getCityBus.js ~ line 39 ~ loadBusStop ~ routeId", routeUID)
    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/${city}/${routeName}?$filter=contains(RouteUID%2C%27${routeUID}%27)&$format=JSON`, { headers })
      const data = await res.json()
      busStopData.value = data

    } catch (error) {
      console.log(error)
    }

  }


  return { loadBus, busData, loadBusStop, busStopData }
}


export default getCityBus