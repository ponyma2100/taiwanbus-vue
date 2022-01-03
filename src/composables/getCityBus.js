import { ref } from 'vue'

function getAuthorizationHeader() {
  const AppID = process.env.VUE_APP_APPID;
  const AppKey = process.env.VUE_APP_APPKEY;

  let GMTString = new Date().toGMTString();
  let ShaObj = new jsSHA('SHA-1', 'TEXT');
  ShaObj.setHMACKey(AppKey, 'TEXT');
  ShaObj.update(`x-date: ${GMTString}`)
  let HMAC = ShaObj.getHMAC('B64');
  let Authorization = 'hmac username=\"' + AppID + '\", algorithm=\"hmac-sha1\", headers=\"x-date\", signature=\"' + HMAC + '\"';

  return { 'Authorization': Authorization, 'X-Date': GMTString };
}


// https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/Taipei?$top=10&$format=JSON

const getCityBus = () => {
  const busData = ref([])
  const busStopData = ref([])
  const goBusData = ref([])
  const backBusData = ref([])
  const estimateTime = ref([])
  const estimateGoBus = ref([])
  const estimateBackBus = ref([])
  const plateNumb = ref([])
  const busPosition = ref([])
  const busShape = ref([])

  const loadBus = async (city = 'Taipei') => {
    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/Route/City/${city}?$select=RouteName,DepartureStopNameZh,destinationStopNameZh,RouteUID&$format=JSON`, { headers: getAuthorizationHeader() })
      const data = await res.json()
      busData.value = data

    } catch (error) {
      console.log(error)
    }

  }
  // https://ptx.transportdata.tw/MOTC/v2/Bus/StopOfRoute/City/Taipei/12?$filter=contains(RouteID%2C%2710864%27)&$format=JSON
  // https://ptx.transportdata.tw/MOTC/v2/Bus/DisplayStopOfRoute/City/Taipei/311?$filter=contains(RouteUID%2C%27TPE15563%27)&$format=JSON
  const loadBusStop = async (city, routeName, routeUID) => {
    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/DisplayStopOfRoute/City/${city}/${routeName}?$filter=contains(RouteUID%2C%27${routeUID}%27)&$format=JSON`, { headers: getAuthorizationHeader() })
      const data = await res.json()
      busStopData.value = data

      busStopData.value.map(bus => {
        if (bus.Direction === 0) {
          goBusData.value = bus
          goBusData.value['isFav'] = false
        } else {
          backBusData.value = bus
          backBusData.value['isFav'] = false
        }
      })


    } catch (error) {
      console.log(error)
    }
  }



  // https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/Taipei/12?$filter=contains(RouteUID%2C%27TPE10864%27)&$format=JSON

  const loadBusTime = async (city, routeName, routeUID) => {

    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/EstimatedTimeOfArrival/City/${city}/${routeName}?$filter=contains(RouteUID%2C%27${routeUID}%27)&$format=JSON`, { headers: getAuthorizationHeader() })

      const data = await res.json()
      estimateTime.value = data

      estimateTime.value.map(bus => {
        if (bus.Direction === 0) {
          estimateGoBus.value.push(bus)
        } else {
          estimateBackBus.value.push(bus)
        }
      })
      if (estimateTime.value) {
        goBusData.value.Stops.reduce((needElements, item) => {
          estimateGoBus.value.filter(bus => {
            if (item.StopUID === bus.StopUID) {

              // EstimateTime
              if (bus.EstimateTime <= 30) {
                item['EstimateTime'] = '進站中'
              } else if (bus.EstimateTime <= 60) {
                item['EstimateTime'] = '即將進站'
              } else {
                item['EstimateTime'] = Math.floor(bus.EstimateTime / 60) + '分'
              }

              // Bus Status [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運'] 
              if (bus.StopStatus === 1) {
                item['StopStatus'] = '尚未發車'
              } else if (bus.StopStatus === 2) {
                item['StopStatus'] = '交管不停靠'
              } else if (bus.StopStatus === 3) {
                item['StopStatus'] = '末班車已過'
              } else if (bus.StopStatus === 4) {
                item['StopStatus'] = '今日未營運'
              } else {
                item['StopStatus'] = bus.StopStatus
              }
            }
          })
          return goBusData.value
        }, [])

        backBusData.value.Stops.reduce((needElements, item) => {
          estimateBackBus.value.filter(bus => {
            if (item.StopUID === bus.StopUID) {
              if (bus.EstimateTime <= 30) {
                item['EstimateTime'] = '進站中'
              } else if (bus.EstimateTime <= 60) {
                item['EstimateTime'] = '即將進站'
              } else {
                item['EstimateTime'] = Math.floor(bus.EstimateTime / 60) + '分'
              }

              // [0:'正常',1:'尚未發車',2:'交管不停靠',3:'末班車已過',4:'今日未營運'] 
              if (bus.StopStatus === 1) {
                item['StopStatus'] = '尚未發車'
              } else if (bus.StopStatus === 2) {
                item['StopStatus'] = '交管不停靠'
              } else if (bus.StopStatus === 3) {
                item['StopStatus'] = '末班車已過'
              } else if (bus.StopStatus === 4) {
                item['StopStatus'] = '今日未營運'
              } else {
                item['StopStatus'] = bus.StopStatus
              }
            }
          })

          return backBusData.value
        }, [])


      }


      return { goBusData, backBusData }

    } catch (error) {
      console.log(error)
    }
  }


  const loadPlateNumb = async (city, routeName, routeUID) => {

    const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeNearStop/City/${city}/${routeName}?$filter=contains(RouteUID%2C%27${routeUID}%27)&$format=JSON`, { headers: getAuthorizationHeader() })
    const data = await res.json()
    plateNumb.value = data

    if (plateNumb.value) {
      goBusData.value.Stops.reduce((needElements, item) => {
        plateNumb.value.filter(bus => {

          if (item.StopUID === bus.StopUID) {
            item['PlateNumb'] = bus.PlateNumb ? bus.PlateNumb : ''
          }
        })
        return goBusData.value
      })

      backBusData.value.Stops.reduce((needElements, item) => {
        plateNumb.value.filter(bus => {

          if (item.StopUID === bus.StopUID) {
            item['PlateNumb'] = bus.PlateNumb ? bus.PlateNumb : ''
          }
        })
        return backBusData.value
      })

    }
  }

  // https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/Taipei/505?$format=JSON
  const loadBusPosition = async (city, routeName, routeUID) => {

    const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/RealTimeByFrequency/City/${city}/${routeName}?$filter=contains(RouteUID%2C%27${routeUID}%27)&$format=JSON`, { headers: getAuthorizationHeader() })
    const data = await res.json()
    busPosition.value = data

    goBusData.value.Stops.reduce((needElements, item) => {
      busPosition.value.filter(bus => {
        if (item.PlateNumb === bus.PlateNumb) {
          item['BusPosition'] = bus.BusPosition ? bus.BusPosition : ''
        }
      })
      return goBusData.value
    })

    backBusData.value.Stops.reduce((needElements, item) => {
      busPosition.value.filter(bus => {

        if (item.PlateNumb === bus.PlateNumb) {
          item['BusPosition'] = bus.BusPosition ? bus.BusPosition : ''
        }
      })
      return backBusData.value
    })
  }

  // https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/Taipei/505?$format=JSON

  const loadBusShape = async (city, routeName, routeUID) => {
    try {
      const res = await fetch(`https://ptx.transportdata.tw/MOTC/v2/Bus/Shape/City/${city}/${routeName}?$filter=contains(RouteUID%2C%27${routeUID}%27)&$format=JSON`, { headers: getAuthorizationHeader() })
      const data = await res.json()
      busShape.value = data

    } catch (error) {
      console.log(error)
    }
  }

  return { loadBus, busData, loadBusStop, busStopData, loadBusTime, goBusData, backBusData, loadPlateNumb, loadBusPosition, loadBusShape, busShape }
}

export default getCityBus