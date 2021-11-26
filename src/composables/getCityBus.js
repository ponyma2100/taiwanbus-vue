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


  const loadBus = async (city = 'Taipei') => {
    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${city}?$select=RouteName&$format=JSON`, { headers })
      const data = await res.json()
      busData.value = data

    } catch (error) {
      console.log(error)
    }

  }


  return { loadBus, busData }
}


export default getCityBus