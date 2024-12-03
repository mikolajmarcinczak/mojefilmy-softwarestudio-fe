import {defineStore} from "pinia";

export interface Notification {
  message: string;
  type: 'success' | 'error' | 'info';
  id: number;
}

export const useNotificationStore = defineStore('notification',{
  state: () => ({
    notifications: [] as Notification[],
    nextId: 0
  }),
  actions: {
    addNotification(notification: Omit<Notification, 'id'>) {
      this.notifications.push({ ...notification, id: this.nextId++ });
    },
    removeNotification(id: number) {
      this.notifications = this.notifications.filter((notification) => notification.id !== id);
    },
  }
});
