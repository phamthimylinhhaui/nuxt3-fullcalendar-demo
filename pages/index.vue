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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
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
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: 'dayGridMonth',
  editable: true,
  eventOverlap: true,
  locale: 'ja',
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

<style scoped>
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
</style>
