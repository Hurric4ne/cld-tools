<template>
  <div>
    <h1 class="section-title">global.ini generator</h1>
    <div>If you don't know how to implement this <strong>global.ini</strong>, here are some How-To's by CIG or MrKraken:<br/>
      <ul>
        <li>
          <a class="info-link" href="https://robertsspaceindustries.com/spectrum/community/SC/forum/1/thread/star-citizen-community-localization-update" target="_blank">Spectrum Post by CIG</a><br/>
        </li>
        <li>
          <a class="info-link" href="https://www.youtube.com/watch?v=N6tz4wi9Meg" target="_blank">Youtube Video from MrKraken</a>
        </li>
      </ul>
    </div>

    <!-- Content (only shown after data is loaded) -->
    <div class="globalini-container">
      <!-- Multiselect with checkboxes -->
      <div class="multiselect">
        <h3>Select Options:</h3>
        <div class="checkbox-wrapper">
          <label v-for="(name, value) in options" :key="name" class="checkbox-label">
            <input type="checkbox" :checked="selected.includes(value)" @change="handleSelectionChange(value)">
            <span v-html="name" class="checkbox-example"></span>
          </label>
        </div>

        <p class="loading-note">Note: depending on your selection, this may take a moment to generate.</p>
        <div class="actions-wrapper">
          <button
            class="generate-btn"
            @click="generateGlobalIni"
            :class="{ 'is-active': selected.length > 0 }"
          >
            Generate global.ini
          </button>
          <a class="download-link" :class="{ 'is-active': downloadUrl && selected.length > 0 }" href="#" download="global.ini">Download</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

import globalIni from '../assets/globalini_base/global.ini?raw';

import prefixedArmaments from '../assets/globalini_base/prefixed_armaments.json';
import prefixedComponentsFull from '../assets/globalini_base/prefixed_components_full.json';
import prefixedComponentsMinimal from '../assets/globalini_base/prefixed_components_minimal.json';
import prefixedItemsBp from '../assets/globalini_base/prefixed_items_bp.json';
import shortenedNames from '../assets/globalini_base/shortened_names.json';


export default {
  name: 'LootablesPricesView',
    props: {},
    watch: {
      selected() {
        this.downloadUrl = '';
      }
    },
    setup() {
      const options = {
        'prefixed_components_minimal': 'Minimal Components prefixed (Military + Stealth, Size 1-3, Grade A+B) <br/>&nbsp;&nbsp;&nbsp;=> <strong>[M1A]</strong> VK-00',
        'prefixed_components_full': 'All Components prefixed (by joeydee1986/BeltaKoda on GitHub) <br/>&nbsp;&nbsp;&nbsp;=> <strong>R2A</strong> LuxCore',
        'prefixed_armaments': 'prefixed Missiles, Torpedoes and Bombs (by joeydee1986/BeltaKoda on GitHub) <br/>&nbsp;&nbsp;&nbsp;=> <strong>EM</strong> Seeker IX Torpedo, <strong>B10</strong> Colossus',
        'prefixed_items_bp': 'prefixed Items with a Blueprint (Item can be dismantled)<br/>&nbsp;&nbsp;&nbsp;=> P4-AR Rifle <strong>(BP)</strong>',
        'shortened_names': 'shortened "Hephaestanite (Raw) to prevent overlapping Quality" <br/>&nbsp;&nbsp;&nbsp;=> <strong>"Hephae. (Raw)"</strong>'
      };

      const selected = ref([]);
      const downloadUrl = ref('');

      const handleSelectionChange = (value) => {
        const isCurrentlySelected = selected.value.includes(value);

        if (isCurrentlySelected) {
          // Remove the item if it's currently selected
          selected.value = selected.value.filter(item => item !== value);
        } else {
          // Add the item if it's not selected
          if (value === 'prefixed_components_full') {
            // If selecting full, remove minimal
            selected.value = selected.value.filter(item => item !== 'prefixed_components_minimal');
          } else if (value === 'prefixed_components_minimal') {
            // If selecting minimal, remove full
            selected.value = selected.value.filter(item => item !== 'prefixed_components_full');
          }
          selected.value.push(value);
        }
      };

      const generateGlobalIni = () => {
        let selectedModifications = [];
        selected.value.forEach((modification) => {
          selectedModifications = selectedModifications.concat(
            modification === 'prefixed_components_minimal' ? prefixedComponentsMinimal :
            modification === 'prefixed_components_full' ? prefixedComponentsFull :
            modification === 'prefixed_armaments' ? prefixedArmaments :
            modification === 'prefixed_items_bp' ? prefixedItemsBp :
            modification === 'shortened_names' ? shortenedNames : []
          );
        });


        let modifiedGlobalIni = globalIni;
        selectedModifications.forEach((modification) => {
          for (const [key, value] of Object.entries(modification)) {
            const regex = new RegExp(`^${key}=.*$`, 'gm');
            modifiedGlobalIni = modifiedGlobalIni.replace(regex, `${key}=${value}`);
          }
        });

        // Create a blob and trigger download
        const blob = new Blob([modifiedGlobalIni], { type: 'text/plain' });
        downloadUrl.value = URL.createObjectURL(blob);
        const downloadLink = document.querySelector('.download-link');
        downloadLink.href = downloadUrl.value;
      };

      return {
        options,
        selected,
        downloadUrl,
        handleSelectionChange,
        generateGlobalIni
      };
    }
  };
</script>

<style scoped lang="scss">
.info-link {
  color: var(--color-red);

  &:hover {
    text-decoration: underline;
  }
}

.multiselect {
  margin-bottom: 20px;
}

.checkbox-wrapper{
  display: flex;
  flex-direction: column;
  row-gap: 5px;

  input[type="checkbox"] {
    width: 20px;
    height: 20px;
    transform: translateY(10px);
  }
}

.checkbox-label {
  display: block;
  margin-bottom: 10px;
}

.checkbox-example {
  line-height: 1.2;
  cursor: pointer;
}

.checkbox-label input {
  margin-right: 10px;
}

.loading-note {
  margin-top: 15px;
  font-weight: bold;
}

.actions-wrapper {
  display: flex;;
  flex-direction: row;
  column-gap: 10px;
  align-items: center;
}

.generate-btn,
.download-link {
  outline: none;
  display: inline-flex;
  background-color: #fff;
  color: #000;
  line-height: 1.2;
  padding: 5px 10px;
  text-decoration: none;
  border: none;

  opacity: 0.5;
  pointer-events: none;

  &.is-active {
    cursor: pointer;
    opacity: 1;
    pointer-events: auto;
  }
}
</style>
