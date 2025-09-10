<template>
  <div>
    <h1 class="section-title">Profit Calculator</h1>
    <div class="profit-input">
      <label for="totalProfit">Total Profit:</label>
      <input
        id="totalProfit"
        type="text"
        v-model="formattedTotalProfit"
        placeholder="Enter total profit"
        @input="updateTotalProfit"
      />
    </div>
    <div class="service-fee">
      <input
        id="includeFee"
        type="checkbox"
        v-model="includeServiceFee"
      />
      <label for="includeFee" title="deducts the service you pay per transaction"> Include Service Fee (0.5%)</label>
    </div>
    <div class="even-split">
      <input
        id="splitEvenly"
        type="checkbox"
        v-model="splitEvenly"
      />
      <label for="splitEvenly"> Split Profits Evenly</label>
    </div>
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Time (hh:mm:ss)</th>
          <th>Profit</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(person, index) in participants" :key="index">
          <td>
            <input
              type="text"
              v-model="person.name"
              placeholder="Enter name"
            />
          </td>
          <td>
            <input
              type="text"
              v-model="person.time"
              placeholder="hh:mm:ss"
              @input="validateTime(index)"
              :disabled="splitEvenly"
            />
          </td>
          <td>
            <span>{{ formatProfit(person.profit) }}</span>
          </td>
          <td>
            <button @click="removeParticipant(index)">Remove</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="buttons">
      <button @click="addParticipant">Add Participant</button>
      <button @click="calculateProfit">Calculate Profit</button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';

const totalProfit = ref(0);
const formattedTotalProfit = ref('');
const includeServiceFee = ref(false); // Checkbox state for service fee
const splitEvenly = ref(false); // Checkbox state for splitting profits evenly

const participants = reactive([]);

const addParticipant = () => {
  participants.push({ name: '', time: '00:00:00', profit: 0 });
};

const removeParticipant = (index) => {
  participants.splice(index, 1); // Remove the participant at the specified index
};

const validateTime = (index) => {
  const time = participants[index].time;
  const timeRegex = /^(\d{1,2}):([0-5]?\d):([0-5]?\d)$/; // Validate hh:mm:ss format
  if (!timeRegex.test(time)) {
    participants[index].time = '00:00:00';
  }
};

const calculateProfit = () => {
  if (splitEvenly.value) {
    // Split profits evenly among all participants
    const evenProfit = Math.floor(totalProfit.value / participants.length);
    participants.forEach((person) => {
      let profit = evenProfit;

      // Adjust for service fee if checkbox is checked
      if (includeServiceFee.value) {
        profit = Math.floor(profit / 1.005); // Adjust for 0.5% fee
      }

      person.profit = profit;
    });
  } else {
    let totalSeconds = 0;

    // Calculate total seconds attended by all participants
    participants.forEach((person) => {
      const [hours, minutes, seconds] = person.time.split(':').map(Number);
      const totalTime = hours * 3600 + minutes * 60 + seconds;
      person.totalSeconds = totalTime;
      totalSeconds += totalTime;
    });

    // Distribute profit based on attendance time
    participants.forEach((person) => {
      const share = person.totalSeconds / totalSeconds;
      let profit = Math.floor(totalProfit.value * share);

      // Adjust for service fee if checkbox is checked
      if (includeServiceFee.value) {
        profit = Math.floor(profit / 1.005); // Adjust for 0.5% fee
      }

      person.profit = profit;
    });
  }
};

const formatProfit = (profit) => {
  return profit.toLocaleString('de-DE'); // Format with dot as thousand separator
};

const updateTotalProfit = (event) => {
  const rawValue = event.target.value.replace(/\./g, ''); // Remove dots for parsing
  const numericValue = parseInt(rawValue, 10) || 0;
  totalProfit.value = numericValue;
  formattedTotalProfit.value = numericValue.toLocaleString('de-DE'); // Format with thousand separator
};
</script>

<style scoped>
.profit-input {
  margin: 20px 0;
  text-align: center;
}

.profit-input input {
  padding: 5px;
  font-size: 1rem;
}

.service-fee,
.even-split {
  margin: 10px 0;
  text-align: center;
}

table {
  width: 100%;
  margin: 20px 0;
  border-collapse: collapse;
}

th,
td {
  border: 1px solid var(--color-lightgray);
  padding: 10px;
  text-align: center;
}

th {
  background-color: var(--color-darkgray);
  color: var(--color-white);
}

td input {
  width: 80%;
  padding: 5px;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

button {
  padding: 10px 20px;
  background-color: var(--color-lightgray);
  color: var(--color-black);
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: var(--color-red);
  color: var(--color-white);
}

.input-area {
  margin: 20px 0;
  text-align: center;
}

textarea {
  display: block;
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  padding: 5px;
  font-size: 1rem;
}
</style>
