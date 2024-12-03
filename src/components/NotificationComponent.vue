<template>
  <div class="notification-container">
    <div v-for="notification in notifications"
         :key="notification.id"
         :class="['alert', alertClass(notification.type)]"
         role="alert"
    >
      {{ notification.message }}
      <button type="button" class="btn-close"
              @click="removeNotification(notification.id)"
              aria-label="Close"></button>
    </div>
  </div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import {useNotificationStore} from "@/stores/notification.store";

export default defineComponent({
  name: "NotificationComponent",
  setup() {
    return { notificationStore: useNotificationStore() };
  },
  computed: {
    notifications() {
      return this.notificationStore.notifications;
    }
  },
  methods: {
    removeNotification(id: number) {
      this.notificationStore.removeNotification(id);
    },
    alertClass(type: string) {
      return {
        'alert-success': type === 'success',
        'alert-danger': type === 'error',
        'alert-warning': type === 'warning',
        'alert-info': type === 'info',
      }
    },
  }
})
</script>

<style scoped>
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
}
.alert {
  display: flex;
  align-items: center;
  padding-right: 1.5rem;
}
.btn-close {
  margin-left: auto;
}
</style>
