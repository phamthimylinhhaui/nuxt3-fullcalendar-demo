<template>
  <div class="app" style="display: flex">
    <!-- Bảng hiển thị thông tin bên trái -->
    <div style="padding-top: 66px; width: 450px">
      <table class="resource-table" style="width: 100%">
        <thead>
        <tr class="resource-table-th">
          <th>ID</th>
          <th>text</th>
          <th>start_date</th>
          <th>end_date</th>
          <th>start_child</th>
          <th>end_child</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="resource in resources" :key="resource.id">
          <td>{{ resource.id }}</td>
          <td>{{ resource.title }}</td>
          <td>
            {{ resource.extendedProps.start_date }}
          </td>
          <td>
            {{resource.extendedProps.end_date}}
          </td>
          <td>
            {{ resource.extendedProps2.start_date }}
          </td>
          <td>
            {{resource.extendedProps2.end_date}}
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <!-- FullCalendar ở bên phải -->
    <div style="flex: 4">
      <FullCalendar :options="calendarOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import FullCalendar from '@fullcalendar/vue3'
import interactionPlugin from '@fullcalendar/interaction'
import resourceTimelinePlugin from '@fullcalendar/resource-timeline'

const fakeEvents = [
  {
    id: '1',
    resourceId: '1',
    start: '2024-10-03T09:00:00',
    end: '2024-10-15T18:00:00',
    title: 'DEV',
    backgroundColor: '#3788d8'
  },
  {
    id: '2',
    resourceId: '1',
    start: '2024-10-05T10:00:00',
    end: '2024-10-10T12:00:00',
    title: 'DEV',
    backgroundColor: '#34c38f'
  },
  {
    id: '3',
    resourceId: '3',
    start: '2024-10-05T12:00:00',
    end: '2024-10-07T14:00:00',
    title: 'UAT',
    backgroundColor: '#f39c12'
  },
  {
    id: '4',
    resourceId: '3',
    start: '2024-10-03T09:30:00',
    end: '2024-10-07T11:30:00',
    title: 'UAT',
    backgroundColor: '#3498db'
  },
  {
    id: '5',
    resourceId: '2',
    start: '2024-10-03T07:30:00',
    end: '2024-10-10T10:00:00',
    title: 'TEST',
    backgroundColor: '#e74c3c'
  }
]

const resources = ref([
  {
    id: '1',
    title: 'DEV',
    extendedProps: {
      start_date: '2024-10-03',
      end_date: '2024-10-15'
    },
    extendedProps2: {
      start_date: '2024-10-03',
      end_date: '2024-10-15'
    }
  },
  {
    id: '2',
    title: 'TEST',
    extendedProps: {
      start_date: '2024-10-03',
      end_date: '2024-10-10'
    },
    extendedProps2: {
      start_date: '',
      end_date: ''
    }
  },
  {
    id: '3',
    title: 'UAT',
    extendedProps: {
      start_date: '2024-10-03',
      end_date: '2024-10-07'
    },
    extendedProps2: {
      start_date: '2024-10-05',
      end_date: '2024-10-07'
    }
  }
])

const events = ref(fakeEvents)

const calendarOptions = ref({
  plugins: [interactionPlugin, resourceTimelinePlugin],
  initialView: 'resourceTimelineMonth', // Bắt đầu với timelineMonth view
  editable: false,
  locale: 'ja',
  resourceAreaWidth: '0px', // Cấu hình chiều rộng của cột resources
  resourceLabelText: 'Resources', // Nhãn của cột resource
  headerToolbar: {
    left: 'prev,next today',
    center: 'title',
  },
  resources: resources.value,
  events: events.value, // Sử dụng dữ liệu sự kiện giả lập
  views: {
    resourceTimelineDay: {
      slotDuration: '01:00:00', // Chia thời gian thành các slot 1 giờ
      slotLabelFormat: [
        {hour: 'numeric', meridiem: 'short'} // Hiển thị thời gian dạng 6am, 7am,...
      ]
    },
    resourceTimelineWeek: {
      slotDuration: '12:00:00', // Slot mỗi nửa ngày khi ở chế độ tuần
      buttonText: 'week'
    },
    resourceTimelineMonth: {
      type: 'resourceTimelineMonth', // Đảm bảo sử dụng đúng view timelineMonth
      buttonText: 'month',
      slotLabelFormat: [
        {weekday: 'short'}, // Hiển thị các ngày trong tuần
        {day: 'numeric'} // Hiển thị ngày dưới dạng số
      ]
    }
  }
})
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.fc-timeline-events.fc-scrollgrid-sync-inner {
  position: relative;
}

.fc-timeline-event-harness {
  position: absolute!important;
  top: 0 !important;
}

td.fc-timeline-lane.fc-resource {
  max-height: 46px !important;
}

.fc-timeline-lane-frame {
  height: 46px !important;
}

.resource-table tr {
  height: 46px !important;
  border-bottom: 1px solid black;
  text-align: center;
  font-size: 14px;
}

.resource-table .resource-table-th {
  height: 60px !important;
}

.resource-table th {
  background-color: #f4f4f4;
  text-align: left;
  font-weight: bold;
}

.resource-table tbody tr:nth-child(even) {
  background-color: #f9f9f9;
}

.fc-col-resizer {
  display: none !important; /* Ẩn thanh kéo để không thể resize */
}
</style>
