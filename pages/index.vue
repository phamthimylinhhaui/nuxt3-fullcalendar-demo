<template>
  <div class="app">
    <v-btn color="primary" @click="openModal">
      Add Event
    </v-btn>

    <div v-if="showModal" class="modal">
      <h2>Thêm sự kiện mới</h2>
      <form @submit.prevent="saveEvent">

        <v-text-field
            v-model="newEvent.title"
            label="Title"
            required
        ></v-text-field>

        <v-text-field
            v-model="newEvent.start"
            label="Start Date"
            required
            type="date"
        ></v-text-field>

        <v-text-field
            v-model="newEvent.end"
            label="End Date"
            required
            type="date"
        ></v-text-field>

        <label for="backgroundColor">Background Color</label>
        <input v-model="newEvent.backgroundColor" type="color" id="backgroundColor" />

        <v-btn type="submit" block>Save</v-btn>
        <v-btn color="error" type="button" @click="closeModal">Cancel</v-btn>
      </form>
    </div>

    <FullCalendar :options="calendarOptions" />
    <FullCalendar :options="calendarOptions2" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'

const showModal = ref(false)
const newEvent = ref({
  title: '',
  start: '',
  end: '',
  backgroundColor: '#3788d8'
})

// get events from localStorage
const loadEventsFromStorage = () => {
  if (process.client) { // only run in client-side
    const storedEvents = localStorage.getItem('events');
    return storedEvents ? JSON.parse(storedEvents) : [];
  }
  return []; //if server-side return []
}

const events = ref(loadEventsFromStorage())

// Config FullCalendar
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  // initialView: 'dayGridMonth',
  initialView: 'customFourWeeks',
  editable: true,
  eventOverlap: true,
  locale: 'ja',
  allDayText: 'Time line 1',
  dayHeaderFormat: {
    weekday: 'short',
    day: 'numeric',
  },
  // dayHeaders: false,
  // headerToolbar: {
  //   left: 'prev,next today',
  //   center: 'title',
  //   // right: 'timeGridWeek,timeGridDay,dayGridMonth,customFourWeeks'
  // },
  views: {
    customFourWeeks: {
      type: 'timeGrid',        // Sử dụng timeGrid cho chế độ xem tuần
      duration: { days: 30 },  // Tùy chỉnh duration để hiển thị 14 ngày (2 tuần)
      buttonText: '4 tuần',    // Tùy chỉnh tên hiển thị trên nút
    }
  },
  slotLabelFormat: null,
  slotMinTime: '00:00:00',
  slotMaxTime: '00:00:00',
  events: events.value
})
const calendarOptions2 = ref({
  plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
  // initialView: 'dayGridMonth',
  initialView: 'customFourWeeks',
  editable: true,
  eventOverlap: true,
  locale: 'ja',
  allDayText: 'Time line 2',
  dayHeaderFormat: {
    weekday: 'short',
    day: 'numeric',
  },
  dayHeaders: false,
  // headerToolbar: false,  // Tùy chọn để ẩn hoàn toàn phần header
  // headerToolbar: {
  //   left: 'prev,next today',
  //   center: 'title',
  //   right: 'timeGridWeek,timeGridDay,dayGridMonth,customFourWeeks'
  // },
  views: {
    customFourWeeks: {
      type: 'timeGrid',        // Sử dụng timeGrid cho chế độ xem tuần
      duration: { days: 30 },  // Tùy chỉnh duration để hiển thị 14 ngày (2 tuần)
      buttonText: '4 tuần',    // Tùy chỉnh tên hiển thị trên nút
    }
  },
  slotLabelFormat: null,
  slotMinTime: '00:00:00',
  slotMaxTime: '00:00:00',
  events: events.value
})

const openModal = () => {
  newEvent.value = {
    title: '',
    start: '',
    end: '',
    backgroundColor: '#3788d8'
  }
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

// save localStorage + update FullCalendar
const saveEvent = () => {
  const eventToAdd = { ...newEvent.value }
  events.value.push(eventToAdd)

  // update FullCalendar
  calendarOptions.value.events = events.value

  // save event to localStorage
  if (process.client) {
    localStorage.setItem('events', JSON.stringify(events.value))
  }

  closeModal()
}

// load events from localStorage when start app
onMounted(() => {
  if (process.client) {
    const storedEvents = localStorage.getItem('events')
    if (storedEvents) {
      try {
        events.value = JSON.parse(storedEvents) || []
        calendarOptions.value.events = events.value
      } catch (error) {
        console.error('Err parse JSON from localStorage:', error)
      }
    }
  }
})
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  margin: 20px;
}

button {
  margin-bottom: 10px;
  padding: 5px 10px;
}

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 30px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 10px;
  z-index: 99999;
  min-width: 400px;
}

.modal form {
  display: flex;
  flex-direction: column;
}

.modal input {
  margin-bottom: 10px;
  padding: 5px;
}

.modal button {
  margin-top: 10px;
}

/* CSS để ẩn phần giờ */
.fc-timegrid-slot {
  display: none !important; /* Ẩn khung giờ */
}

.fc-timegrid-now-indicator-container {
  display: none !important; /* Ẩn đường chỉ báo thời gian hiện tại */
}

.fc .fc-scrollgrid-liquid {
  height: unset !important;
}

td.fc-timegrid-divider.fc-cell-shaded {
  display: none;
}

tr.fc-scrollgrid-section.fc-scrollgrid-section-body > td:first-child {
  border-bottom: none;
}

.fc-view-harness.fc-view-harness-active {
  height: auto !important;
  min-height: 100px;
}

.fc-daygrid-event-harness.fc-daygrid-event-harness-abs {
  top: 0 !important;
}
</style>
