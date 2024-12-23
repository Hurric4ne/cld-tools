<template>
  <div class="cargo-list">
    <!-- Title -->
    <h1>Cargo-Mission List</h1>

    <div class="filters">
      <label for="reputationFilter">Reputation Requirement:</label>
      <select id="reputationFilter" v-model="filters.reputation">
        <option value="">All</option>
        <option
          v-for="(displayInfo, key) in rankDisplayInfos"
          :key="key"
          :value="key"
        >
          {{ displayInfo[0] }}
        </option>
      </select>

      <label for="rewardFilter">Mission Reward:</label>
      <input
        type="number"
        id="rewardFilter"
        v-model.number="filters.reward"
        placeholder="Enter reward value"
      />

      <label for="cargoAmountFilter">Cargo Amount:</label>
      <select id="cargoAmountFilter" v-model="filters.cargoAmount">
        <option value="">All</option>
        <option v-for="option in cargoAmountOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <label for="cargoRouteFilter">Cargo Route:</label>
      <select id="cargoRouteFilter" v-model="filters.cargoRoute">
        <option value="">All</option>
        <option v-for="option in cargoRouteOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <label for="maxSCUSizeFilter">Max Container Size (SCU):</label>
      <select id="maxSCUSizeFilter" v-model="filters.maxSCUSize">
        <option value="">All</option>
        <option v-for="size in sortedMaxSCUSizes" :key="size" :value="size">
          {{ size }}
        </option>
      </select>
    </div>

    <div class="mission-list">
      <div
        v-for="mission in filteredMissions"
        :key="mission.missionKey"
        class="mission-item"
      >
        <h3>{{ mission.missionKey }}</h3>
        <p><strong>Reward:</strong> {{ mission.missionReward ? mission.missionReward.toLocaleString() : "N/A" }} aUEC</p>
        <p><strong>Rank:</strong> {{ rankDisplayInfos[mission.reputationRequirements][0] }}</p>
        <p><strong>Max SCU Size:</strong> {{ mission.maxSCUSize }}</p>
        <p><strong>Cargo Amount:</strong> {{ mission.cargoAmount }}</p>
        <p><strong>Cargo Route:</strong> {{ mission.cargoRoute }}</p>
        <p>
          <strong>Deadline:</strong>
          {{ mission.missionDeadline.slice(0, -2) }} minutes
        </p>
        <p>
          <strong>Failure:</strong>
          {{ mission.missionResultReputationRewards["outcome 2"] ? mission.missionResultReputationRewards["outcome 2"].toLocaleString() : 'N/A' }} Reputation
        </p>
        <p>
          <strong>Abandon:</strong>
          {{ mission.missionResultReputationRewards["outcome 3"] ? mission.missionResultReputationRewards["outcome 3"].toLocaleString() : 'N/A' }} Reputation
        </p>
        <p class="success">
          <strong>Success:</strong>
          {{ mission.missionResultReputationRewards["outcome 1"] ? mission.missionResultReputationRewards["outcome 1"].toLocaleString() : 'N/A' }} Reputation
          ({{ rankDisplayInfos[mission.reputationRequirements][1] }} to the next higher Rank)
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, computed } from "vue";
import cargoData from "@/assets/json/finalAggregatedData.json";

export default {
  name: "CargoMissions",
  setup() {
    const filters = reactive({
      reputation: "",
      reward: 0,
      cargoAmount: "",
      cargoRoute: "",
      maxSCUSize: "",
    });

    const rankDisplayInfos = {
      Delivery_Rank0: ["Trainee (0)", "100%"],
      Delivery_Rank1: ["Rookie (1)", "25%"],
      Delivery_Rank2: ["Junior (2)", "10%"],
      Delivery_Rank3: ["Member (3)", "~4.5"],
      Delivery_Rank4: ["Experienced (4)", "4"],
      Delivery_Rank5: ["Senior (5)", "2.5%"],
      Delivery_Rank6: ["Master (6)", "6.15%"],
    };

    const cargoAmountOptions = ["ExtraSmall", "Small", "Supply", "Bulk"];
    const cargoRouteOptions = ["Local", "Planetary", "Solar", "Interstellar"];

    const sortedMaxSCUSizes = computed(() => {
      const uniqueSizes = new Set(cargoData.map((m) => m.maxSCUSize));
      let sizes = [...uniqueSizes].filter((size) => size !== "32SCU");
      sizes.push("32SCU");
      return sizes;
    });

    const filteredMissions = computed(() => {
      return cargoData.filter((mission) => {
        const matchReputation =
          !filters.reputation || mission.reputationRequirements === filters.reputation;
        const matchReward = !filters.reward || mission.missionReward >= filters.reward;
        const matchCargoAmount =
          !filters.cargoAmount || mission.cargoAmount === filters.cargoAmount;
        const matchCargoRoute =
          !filters.cargoRoute || mission.cargoRoute === filters.cargoRoute;
        const matchMaxSCUSize =
          !filters.maxSCUSize || mission.maxSCUSize === filters.maxSCUSize;

        return (
          matchReputation &&
          matchReward &&
          matchCargoAmount &&
          matchCargoRoute &&
          matchMaxSCUSize
        );
      });
    });

    return {
      cargoData,
      filters,
      rankDisplayInfos,
      cargoAmountOptions,
      cargoRouteOptions,
      sortedMaxSCUSizes,
      filteredMissions,
    };
  },
};
</script>

<style scoped lang="scss">
.cargo-list {
  width: 100%;
  max-width: 840px;
  margin: 40px auto;
  border: 1px solid var(--color-red);
  padding: 20px;

  h1 {
    color: var(--color-white);
    font-weight: bold;
    text-align: center;
    margin-top: 0;
    margin-bottom: 25px;
  }

  .filters {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px 50px;
    text-align: right;
    margin: 0 50px 50px 0;
  }

  .mission-item {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    row-gap: 10px;
    border: 1px solid var(--color-lightgray);
    margin-bottom: 20px;
    padding: 20px;

    .success,
    h3 {
      grid-column: 1/span 2;
    }

    p {
      margin: 0;
    }
  }
}
</style>
