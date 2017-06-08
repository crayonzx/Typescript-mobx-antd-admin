import { observable, computed, action, runInAction } from 'mobx'
import { getUserInfo, logout } from '../services/app'
import { config } from '../utils'
import { RouterStore } from 'mobx-react-router'
const { prefix } = config
import { IStore } from './istore'

export interface IAppStore extends IStore {
  user: any,
  loginButtonLoading: boolean,
  menuPopoverVisible: boolean,
  siderFold: boolean,
  darkTheme: boolean,
  isNavbar: boolean,
  navOpenKeys: Array<string>,

  queryUser: (payload: any) => void,
  logout: (payload: any) => void,
  switchSider: () => void,
  changeTheme: () => void,
  changeNavbar: () => void,
  switchMenuPopver: () => void,
  handleNavOpenKeys: (navOpenKeys: Array<string>) => void,
}

export class AppStore implements IAppStore{
  namespace = "app"

  @observable user: any = {};
  @observable loginButtonLoading: boolean = false;
  @observable menuPopoverVisible: boolean = false;
  @observable siderFold: boolean = localStorage.getItem(`${prefix}siderFold`) === 'true';
  @observable darkTheme: boolean = localStorage.getItem(`${prefix}darkTheme`) === 'true';
  @observable isNavbar: boolean = document.body.clientWidth < 769;
  @observable navOpenKeys: Array<string> = [];

  router: RouterStore;

  constructor(router: RouterStore) {
    this.router = router
  }

  @action.bound
  async queryUser(payload: any) {
    const data = await getUserInfo(payload);

    runInAction('queryUserSuccess', () => {
      if (data.success && data.user) {
        this.user = data.user
        if (this.router.location && (this.router.location.pathname === '/login')) {
          this.router.push('/dashboard')
        }
      } else {
        if (this.router.location && (this.router.location.pathname !== '/login')) {
          let from = this.router.location.pathname
          this.router.push(`/login?from=${from}`)
        }
      }
    })
  }

  @action.bound
  async logout(payload: any) {
    const data = await logout(payload)
    runInAction('logoutCallback', ()=>{
      if ( data.success) {
        this.queryUser(null)
      }else{
        throw (data)
      }
    })
  }

  @action.bound
  switchSider(){
    this.siderFold = !this.siderFold
    localStorage.setItem(`${prefix}siderFold`, JSON.stringify(this.siderFold))
  }

  @action.bound
  changeTheme(){
    this.darkTheme = !this.darkTheme
    localStorage.setItem(`${prefix}darkTheme`, JSON.stringify(this.darkTheme))
  }

  @action.bound
  changeNavbar(){
    if(document.body.clientWidth < 769){
      this.isNavbar = true
    }else{
      this.isNavbar = false
    }
  }

  @action.bound
  switchMenuPopver(){
    this.menuPopoverVisible = !this.menuPopoverVisible
  }

  @action.bound
  handleNavOpenKeys(navOpenKeys: Array<string>) {
    this.navOpenKeys = navOpenKeys
  }
}
