import { observable, computed, action, runInAction } from 'mobx'
import { myCity, queryWeather, query } from '../services/dashboard'
import { IStore } from './istore'

interface IWeather {
  city: string,
  temperature: string,
  name: string,
  icon: string,
  dateTime: string
}

// zuimei 摘自 http://www.zuimeitianqi.com/res/js/index.js
let zuimei = {
  parseActualData (actual): IWeather {
    let weather = {
      icon: `http://www.zuimeitianqi.com/res/icon/${zuimei.getIconName(actual.wea, 'big')}`,
      name: zuimei.getWeatherName(actual.wea),
      temperature: actual.tmp,
      dateTime: new Date(actual.PTm).format('MM-dd hh:mm'),
      city: ''
    }
    return weather
  },

  getIconName (wea, flg) {
    let myDate = new Date()
    let hour = myDate.getHours()
    let num: number|string = 0
    if (wea.indexOf('/') !== -1) {
      let weas = wea.split('/')
      if (hour < 12) {
        num = zuimei.replaceIcon(weas[0])
        if (num < 6) {
          num = `${num}_${flg}_night.png`
        } else {
          num = `${num}_${flg}.png`
        }
      } else if (hour >= 12) {
        num = zuimei.replaceIcon(weas[1])
        if (hour >= 18) {
          num = `${num}_${flg}_night.png`
        } else {
          num = `${num}_${flg}.png`
        }
      }
    } else {
      if ((hour >= 18 && hour <= 23) || (hour >= 0 && hour <= 6)) {
        num = `${num}_${flg}_night.png`
      } else {
        num = `${num}_${flg}.png`
      }
    }

    return num
  },

  replaceIcon (num) {
    if (num === 21) {
      num = 7
    } else if (num === 22) {
      num = 8
    } else if (num === 10 || num === 11 || num === 12 || num === 23 || num === 24 || num === 25) {
      num = 9
    } else if (num === 13 || num === 15 || num === 26 || num === 27 || num === 34) {
      num = 14
    } else if (num === 17 || num === 28) {
      num = 16
    } else if (num === 35) {
      num = 18
    } else if (num === 31 || num === 32 || num === 33) {
      num = 20
    } else if (num === 30) {
      num = 29
    }

    return num
  },

  getWeatherName (wea) {
    let name = ''
    if (wea.indexOf('/') !== -1) {
      let weas = wea.split('/')
      name = `${zuimei.getWeatherByCode(weas[0])}转${zuimei.getWeatherByCode(weas[1])}`
    } else {
      name = zuimei.getWeatherByCode(wea)
    }

    return name
  },

  getWeatherByCode (num) {
    let wea = ''
    if (num === 0) {
      wea = '晴'
    } else if (num === 1) {
      wea = '多云'
    } else if (num === 2) {
      wea = '阴'
    } else if (num === 3) {
      wea = '阵雨'
    } else if (num === 4) {
      wea = '雷阵雨'
    } else if (num === 5) {
      wea = '雷阵雨并伴有冰雹'
    } else if (num === 6) {
      wea = '雨夹雪'
    } else if (num === 7) {
      wea = '小雨'
    } else if (num === 8) {
      wea = '中雨'
    } else if (num === 9) {
      wea = '大雨'
    } else if (num === 10) {
      wea = '暴雨'
    } else if (num === 11) {
      wea = '大暴雨'
    } else if (num === 12) {
      wea = '特大暴雨'
    } else if (num === 13) {
      wea = '阵雪'
    } else if (num === 14) {
      wea = '小雪'
    } else if (num === 15) {
      wea = '中雪'
    } else if (num === 16) {
      wea = '大雪'
    } else if (num === 17) {
      wea = '暴雪'
    } else if (num === 18) {
      wea = '雾'
    } else if (num === 19) {
      wea = '冻雨'
    } else if (num === 20) {
      wea = '沙尘暴'
    } else if (num === 21) {
      wea = '小雨-中雨'
    } else if (num === 22) {
      wea = '中雨-大雨'
    } else if (num === 23) {
      wea = '大雨-暴雨'
    } else if (num === 24) {
      wea = '暴雨-大暴雨'
    } else if (num === 25) {
      wea = '大暴雨-特大暴雨'
    } else if (num === 26) {
      wea = '小雪-中雪'
    } else if (num === 27) {
      wea = '中雪-大雪'
    } else if (num === 28) {
      wea = '大雪-暴雪'
    } else if (num === 29) {
      wea = '浮沉'
    } else if (num === 30) {
      wea = '扬沙'
    } else if (num === 31) {
      wea = '强沙尘暴'
    } else if (num === 32) {
      wea = '飑'
    } else if (num === 33) {
      wea = '龙卷风'
    } else if (num === 34) {
      wea = '若高吹雪'
    } else if (num === 35) {
      wea = '轻雾'
    } else if (num === 53) {
      wea = '霾'
    } else if (num === 99) {
      wea = '未知'
    }

    return wea
  },
}

interface INumber {
  icon: string,
  color: string,
  title: string,
  number: number,
  countUp: any
}

export interface IDashboardStore extends IStore {
  weather: IWeather,
  sales: Array<never>,
  quote: {
    avatar: string,
    name: string,
    content: string,
    title: string,
  },
  numbers: Array<INumber>,
  recentSales: Array<never>,
  comments: Array<never>,
  completed: Array<never>,
  browser: Array<never>,
  cpu: {
    usage: number,
    space: number,
    cpu: number,
    data: Array<any>
  },
  user: {
    avatar: string
  },

  query: (payload: any) => void,
  queryWeather: (payload: any) => void
}


export class DashboardStore implements IDashboardStore {
  namespace = 'dashboard'

  @observable weather:IWeather
  @observable sales = []
  @observable quote = {
    avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
    name: '',
    content: '',
    title: '',
  }
  @observable numbers = []
  @observable recentSales = []
  @observable comments = []
  @observable completed = []
  @observable browser = []
  @observable cpu = {
    usage: 0,
    space: 0,
    cpu: 0,
    data: []
  }
  @observable user = {
    avatar: 'http://img.hb.aicdn.com/bc442cf0cc6f7940dcc567e465048d1a8d634493198c4-sPx5BR_fw236',
  }

  @action.bound
  async query(payload: any) {
    const data = await query(payload)
    runInAction('querySuccess', ()=> {
      Object.assign(this, data)
    })
  }

  @action.bound
  async queryWeather(payload: any) {
    const myCityResult = await myCity({flg: 0})
    const result = await queryWeather({cityCode: myCityResult.selectCityCode})
    const weather = zuimei.parseActualData(result)
    weather.city = myCityResult.selectCityName
    runInAction('queryWeatherSuccess', ()=>{
      this.weather = weather
    })
  }
}


const dashboardStore = new DashboardStore()
export { dashboardStore as default }
