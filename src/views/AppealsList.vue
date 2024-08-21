<template>
  <div class="appeals">
    <div class="appeals__title">Список заявок</div>
    <div class="appeals__content">
      <div class="appeals__button__container">
        <button class="appeals__button" @click="openCreateModal">Создать</button>
      </div>
      <div class="appeals__filters">
        <div class="appeals__field">
          <div class="appeals__input-group">
            <input
                id="search"
                v-model="searchQuery"
                class="appeals__input"
                placeholder="Поиск (№ заявки, название)"
                type="text"
                @input="fetchAppeals"
            />
            <span class="appeals__input-icon">
                <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg">
                  <path
                      d="m19.6 21l-6.3-6.3q-.75.6-1.725.95T9.5 16q-2.725 0-4.612-1.888T3 9.5t1.888-4.612T9.5 3t4.613 1.888T16 9.5q0 1.1-.35 2.075T14.7 13.3l6.3 6.3zM9.5 14q1.875 0 3.188-1.312T14 9.5t-1.312-3.187T9.5 5T6.313 6.313T5 9.5t1.313 3.188T9.5 14"
                      fill="currentColor"
                  />
                </svg>
              </span>
          </div>
        </div>
        <div class="appeals__field">
          <div class="appeals__input-group">
            <select
                v-model="selectedPremise"
                class="appeals__input"
                @change="fetchAppeals"
            >
              <option value="">Выберите дом</option>
              <option v-for="premise in premises" :key="premise.id" :value="premise.id">
                {{ premise.short_address }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <table class="appeals__table">
        <thead class="appeals__table-head">
        <tr class="appeals__table-row appeals__table-row--header">
          <th class="appeals__table-cell">№</th>
          <th class="appeals__table-cell">Создана</th>
          <th class="appeals__table-cell">Адрес</th>
          <th class="appeals__table-cell">Заявитель</th>
          <th class="appeals__table-cell">Описание</th>
          <th class="appeals__table-cell">Срок</th>
          <th class="appeals__table-cell">Статус</th>
        </tr>
        </thead>
        <tbody class="appeals__table-body">
        <tr v-for="appeal in appeals" :key="appeal.number" class="appeals__table-row">
          <td class="appeals__table-cell" @click="openModal(appeal)">
            <button class="appeals__table-button">{{ appeal.number }}</button>
          </td>
          <td class="appeals__table-cell">{{ appeal.created_at }}</td>
          <td class="appeals__table-cell">{{ appeal.premise }}, кв. {{ appeal.apartment }}</td>
          <td class="appeals__table-cell">{{ appeal.firstName }} {{ appeal.lastName }}</td>
          <td class="appeals__table-cell">{{ appeal.description }}</td>
          <td class="appeals__table-cell">{{ formatDate(appeal.due_date) }}</td>
          <td class="appeals__table-cell">{{ appeal.status }}</td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
          <span>
            {{ startRecord }} - {{ endRecord }} из {{ totalRecords }} записей
            <select v-model="selectedPageSize" class="pagination__select" @change="updatePageSize">
              <option v-for="size in pageSizes" :key="size" :value="size">{{ size }}</option>
            </select>
          </span>
        <button :disabled="currentPage === 1" class="pagination__button" @click="changePage(1)">««</button>
        <button :disabled="currentPage === 1" class="pagination__button" @click="changePage(currentPage - 1)">«
        </button>
        <button
            :class="['pagination__button', { active: currentPage === 1 }]"
            @click="changePage(1)"
        >
          1
        </button>
        <button
            v-for="page in visiblePages"
            :key="page"
            :class="['pagination__button', { active: page === currentPage }]"
            @click="changePage(page)"
        >
          {{ page }}
        </button>
        <button
            v-if="showRightEllipsis"
            class="pagination__button"
            @click="changePage(visiblePages[visiblePages.length - 1] + 1)"
        >
          ...
        </button>
        <button
            v-if="totalPages > 1"
            :class="['pagination__button', { active: currentPage === totalPages }]"
            @click="changePage(totalPages)"
        >
          {{ totalPages }}
        </button>
        <button :disabled="currentPage >= totalPages" class="pagination__button" @click="changePage(currentPage + 1)">
          »
        </button>
        <button :disabled="currentPage >= totalPages" class="pagination__button" @click="changePage(totalPages)">»»
        </button>
      </div>
    </div>
    <AppealModal v-if="selectedAppeal" :appeal="selectedAppeal" @close="closeModal"/>
    <AppealModal v-if="!selectedAppeal && isCreating" @close="closeModal"/>
  </div>
</template>

<script>
import AppealModal from "@/components/AppealModal.vue";

export default {
  components: {AppealModal},
  data() {
    return {
      selectedAppeal: null,
      isCreating: false,
      pageSizes: [10, 25, 50, 100],
      selectedPageSize: 10,
      searchQuery: '',
      selectedPremise: '',
    };
  },
  computed: {
    appeals() {
      return this.$store.getters.appeals;
    },
    premises() {
      return this.$store.getters.premises;
    },
    currentPage() {
      return this.$store.state.currentPage;
    },
    pageSize() {
      return this.selectedPageSize;
    },
    totalRecords() {
      return this.$store.state.appealCount;
    },
    totalPages() {
      return Math.ceil(this.totalRecords / this.pageSize);
    },
    visiblePages() {
      const range = 4;
      const startPage = Math.max(2, this.currentPage - Math.floor(range / 2));
      const endPage = Math.min(startPage + range - 1, this.totalPages - 1);
      return Array.from({length: endPage - startPage + 1}, (_, i) => i + startPage);
    },
    showRightEllipsis() {
      return this.visiblePages.length && this.visiblePages[this.visiblePages.length - 1] < this.totalPages - 1;
    },
    startRecord() {
      return (this.currentPage - 1) * this.pageSize + 1;
    },
    endRecord() {
      return Math.min(this.currentPage * this.pageSize, this.totalRecords);
    },
  },
  methods: {
    fetchAppeals() {
      this.$store.dispatch('fetchAppeals', {
        page: this.currentPage,
        page_size: this.pageSize,
        search: this.searchQuery,
        premise_id: this.selectedPremise
      });
    },
    updatePageSize() {
      this.$store.commit('SET_PAGE_SIZE', this.selectedPageSize);
      this.fetchAppeals();
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.$store.dispatch('fetchAppeals', {
          page,
          page_size: this.pageSize,
          search: this.searchQuery,
          premise_id: this.selectedPremise
        });
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}`;
    },
    openModal(appeal) {
      this.selectedAppeal = appeal;
      this.isCreating = false;
    },
    openCreateModal() {
      this.selectedAppeal = null;
      this.isCreating = true;
    },
    closeModal() {
      this.selectedAppeal = null;
      this.isCreating = false;
      this.fetchAppeals();
    },
  },
  mounted() {
    this.fetchAppeals();
    this.$store.dispatch('fetchPremises');
  },
};
</script>

<style lang="scss" scoped>
.appeals {
  padding-bottom: 20px;
  background: #EEEEEE;

  &__title {
    font-size: 24px;
    display: flex;
    font-weight: 400;
    margin-bottom: 20px;
    height: 73px;
    padding: 0 32px;
    justify-content: space-between;
    align-items: center;
  }

  &__content {
    padding: 10px 20px;
    border-radius: 8px;
    margin: 27px 15px;
    background-color: #FFFFFF;
  }

  &__button__container {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-bottom: 32px;
  }

  &__button {
    background-color: #4CAF50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 110px;
    display: block;

    &:hover {
      background-color: #45a049;
    }
  }

  &__filters {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    margin: 32px 0;
  }

  &__field {
    width: 100%;
    text-align: left;
  }

  &__input-group {
    display: flex;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px #CCCCCC solid;
  }

  &__input-icon {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__input {
    border: none;
    padding: 10px;
    flex: 1;
    font-size: 16px;
    color: #333;
    background-color: transparent;
    outline: none;
  }

  &__search {
    width: 100%;
    padding: 10px;
    margin-bottom: 20px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 16px;
  }

  &__table {
    width: 100%;
    border-collapse: collapse;
    padding: 26px 15px;
    table-layout: fixed;

    &-row {
      &--header {
        font-weight: bold;
        text-align: left;
        color: #50B053;
      }
    }

    &-cell {
      padding: 10px;
      text-align: left;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border-bottom: 1px #CCCCCC solid;
      cursor: default;

      &:nth-child(1) {
        width: 100px;
      }

      &:nth-child(2) {
        width: 150px;
      }

      &:nth-child(3) {
        width: 200px;
      }

      &:nth-child(4) {
        width: 200px;
      }

      &:nth-child(5) {
        width: 260px;
      }

      &:nth-child(6) {
        width: 150px;
      }

      &:nth-child(7) {
        width: 150px;
      }
    }

    &-button {
      background-color: #4CAF50;
      color: #fff;
      padding: 10px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      width: 56px;
      display: block;

      &:hover {
        background-color: #45a049;
      }
    }
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32px;
  font-size: 14px;
  color: #333;

  span {
    flex: 1;
  }

  .pagination__select {
    margin-left: 10px;
    padding: 5px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 4px;
    outline: none;

    &:focus {
      border-color: #999;
    }
  }

  .pagination__button {
    margin: 0 5px;
    padding: 8px 12px;
    font-size: 14px;
    border: none;
    border-radius: 28px;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    outline: none;
    transition: background-color 0.3s, border-color 0.3s;

    &:hover {
      background-color: #f0f0f0;
    }

    &:disabled {
      cursor: not-allowed;
      color: #999;
    }

    &.active {
      background-color: #4CAF50;
      color: #fff;
      border-color: #4CAF50;
    }
  }
}
</style>