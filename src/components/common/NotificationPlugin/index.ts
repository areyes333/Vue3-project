import { App, reactive } from 'vue'
import Notifications from './Notifications.vue';

export enum NotificationType {
  Success = 'success',
  Error = 'danger',
  Info = 'info',
  Warning = 'warning',
}

export type NotificationSettings = {
  overlap: boolean,
  verticalAlign: string,
  horizontalAlign: string,
  type: NotificationType,
  timeout: number,
  closeOnClick: boolean,
  showClose: boolean,
}

export type Notification = {
  message: string | Notification,
  timestamp?: number | Date,
  verticalAlign?: string ,
  horizontalAlign?: string,
  type?: NotificationType,
  timeout?: number,
  closeOnClick?: boolean,
  showClose?: boolean,
}

type NotificationStoreType = {
  state: Notification[],
  settings: NotificationSettings,
}

const NotificationStore = {
  state: [], // here the notifications will be added
  settings: {
    overlap: true,
    verticalAlign: 'top',
    horizontalAlign: 'right',
    type: NotificationType.Info,
    timeout: 5000,
    closeOnClick: true,
    showClose: true
  },
  removeNotification
} as NotificationStoreType;

const store = reactive(NotificationStore)

function setOptions(options: NotificationSettings) {
  store.settings = Object.assign(store.settings, options);
}

function removeNotification(timestamp: number) {
  const indexToDelete = store.state.findIndex(n => n?.timestamp === timestamp);
  if (indexToDelete !== -1) {
    store.state.splice(indexToDelete, 1);
  }
}

function addNotification(notification: Notification | string) {
  if (typeof notification === 'string') {
    notification = { message: notification };
  }
  notification.timestamp = new Date();
  notification.timestamp.setMilliseconds(
    notification.timestamp.getMilliseconds() + store.state.length
  );
  notification = Object.assign({}, store.settings, notification);
  store.state.push(notification);
}

function notify(notification: Notification) {
  if (Array.isArray(notification)) {
    notification.forEach(notificationInstance => {
      addNotification(notificationInstance);
    });
  } else {
    addNotification(notification);
  }
}

let methods: any = {
  notify,
  error(notification: Notification | string) {
    if (notification !== 'object') {
      notification = {
        message: notification,
      }
    }
    notify({
      type: NotificationType.Error,
      ...notification as Notification,
    })
  },
  warning(notification: Notification | string) {
    if (notification !== 'object') {
      notification = {
        message: notification,
      }
    }
    notify({
      type: NotificationType.Warning,
      ...notification as Notification,
    })
  },
  success(notification: Notification | string) {
    if (notification !== 'object') {
      notification = {
        message: notification,
      }
    }
    notify({
      type: NotificationType.Success,
      ...notification as Notification,
    })
  }
}


const NotificationsPlugin = {
  install(Vue: App, options: NotificationSettings) {
    Object.keys(methods).forEach(method => {
      Vue.config.globalProperties[`$${method}`] = methods[method]
    })
    Vue.config.globalProperties.$notifications = store

    Vue.component('Notifications', Notifications);
    if (options) {
      setOptions(options);
    }
  }
};

export const error = methods.error
export const success = methods.success
export const info = methods.info
export const warning = methods.warning

export default NotificationsPlugin;