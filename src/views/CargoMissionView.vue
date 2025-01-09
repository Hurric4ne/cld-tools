<template>
  <div class="cargo-mission-list">
    <h1>Cargo Mission List</h1>
    <div class="filters">
      <label for="reputationRankFilter">Reputation Rank:</label>
      <select id="reputationRankFilter" v-model="filters.reputationRank">
        <option value="">All</option>
        <option v-for="rank in reputationRanks" :key="rank" :value="rank">{{ rank }}</option>
      </select>

      <label for="maxSCUSizeFilter">Max SCU Size:</label>
      <select id="maxSCUSizeFilter" v-model="filters.maxSCUSize">
        <option value="">All</option>
        <option v-for="size in maxSCUSizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <label for="cargoRouteFilter">Cargo Route:</label>
      <select id="cargoRouteFilter" v-model="filters.cargoRoute">
        <option value="">All</option>
        <option v-for="route in cargoRoutes" :key="route" :value="route">{{ route }}</option>
      </select>

      <label for="cargoGradeFilter">Cargo Grade:</label>
      <select id="cargoGradeFilter" v-model="filters.cargoGrade">
        <option value="">All</option>
        <option v-for="grade in cargoGrades" :key="grade" :value="grade">{{ grade }}</option>
      </select>

      <label for="locationFilter">Location:</label>
      <select id="locationFilter" v-model="filters.location">
        <option value="">All</option>
        <option v-for="location in locations" :key="location" :value="location">{{ location }}</option>
      </select>

      <label for="rewardFilter">Reward:</label>
      <input type="number" id="rewardFilter" v-model.number="filters.reward" placeholder="Enter reward value" />

      <label for="directRouteFilter">Only direct Routes:</label>
      <input type="checkbox" id="directRouteFilter" v-model="filters.isDirectRoute" />
    </div>

    <h2>{{ filteredMissions.length }} items found</h2>

    <div class="mission-list">
      <div v-for="mission in filteredMissions" :key="mission.internalName" class="mission-item">
        <h3>{{ mission.displayTitle }}</h3>
        <p><strong>Reward:</strong> {{ mission.reward.toLocaleString() }}</p>
        <p><strong>Cargo Amount:</strong> {{ mission.cargoAmount }} (max. {{ mission.maxSCUSize }} Boxes)</p>
        <p><strong>Location:</strong> {{ mission.location }}</p>
        <p><strong>Reputation Rank:</strong> {{ mission.reputationRank }}</p>
        <p><strong>Reputation:</strong></p>
        <ul class="reputation-list">
          <li v-for="rep in mission.reputation" :key="Object.keys(rep)[0]">
            {{ Object.keys(rep)[0] }}: {{ Object.values(rep)[0].toLocaleString() }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import cargoMissions from "@/assets/json/cargo_missions.json";

export default {
  name: "CargoMissionView",
  setup() {
    const filters = reactive({
      reputationRank: "",
      maxSCUSize: "",
      cargoRoute: "",
      cargoGrade: "",
      location: "",
      reward: 0,
      isDirectRoute: false,
    });

    const reputationRanks = ["Trainee", "Rookie", "Junior", "Member", "Experienced", "Senior", "Master"];
    const maxSCUSizes = ["1 SCU", "4 SCU", "8 SCU", "16 SCU", "32 SCU"];
    const cargoRoutes = ["Local", "Planetary", "Solar", "Interstellar"];
    const cargoGrades = ["Extra Small", "Small", "Medium", "Large"];
    const locations = [...new Set(cargoMissions.map(mission => mission.location))];

    const filteredMissions = computed(() => {
      return cargoMissions.filter(mission => {
        const matchReputationRank = !filters.reputationRank || mission.reputationRank === filters.reputationRank;
        const matchMaxSCUSize = !filters.maxSCUSize || mission.maxSCUSize === filters.maxSCUSize;
        const matchCargoRoute = !filters.cargoRoute || mission.cargoRoute === filters.cargoRoute;
        const matchCargoGrade = !filters.cargoGrade || mission.cargoGrade === filters.cargoGrade;
        const matchLocation = !filters.location || mission.location === filters.location;
        const matchReward = !filters.reward || mission.reward >= filters.reward;
        const matchDirectRoute = !filters.isDirectRoute || mission.isDirectRoute === filters.isDirectRoute;

        return matchReputationRank && matchMaxSCUSize && matchCargoRoute && matchCargoGrade && matchLocation && matchReward && matchDirectRoute;
      });
    });

    return {
      filters,
      reputationRanks,
      maxSCUSizes,
      cargoRoutes,
      cargoGrades,
      locations,
      filteredMissions,
    };
  },
};
</script>

<style scoped>
.cargo-mission-list {
  width: 100%;
  max-width: 1000px;
  margin: 20px auto;
  padding: 10px;

  h1,h2 {
    text-align: center;
  }
}

.filters {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px 20px;
  margin-bottom: 20px;
}

.mission-list {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.mission-item {
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
}

.reputation-list li {
  margin: 7px 0;
}
</style>
