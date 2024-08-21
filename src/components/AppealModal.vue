<template>
  <div class="modal" @click="handleOutsideClick">
    <div class="modal__content">
      <div class="modal__header">
        <div class="modal__title">
          {{ isEditMode ? `Заявка № ${appealData.number} от (${appealData.created_at})` : 'Создание заявки' }}
        </div>
        <div class="modal__status">
          {{ isEditMode ? appealData.status : 'Новая' }}
        </div>
      </div>
      <form @submit.prevent="saveAppeal">
        <div class="modal__form-group">
          <div class="modal__form-row">
            <div class="modal__form-field">
              <label class="modal__label" for="house">Дом</label>
              <select id="house" v-model="appealData.premise_id" class="modal__input">
                <option v-for="premise in premises" :key="premise.id" :value="premise.id">
                  {{ premise.short_address }}
                </option>
              </select>
            </div>
            <div class="modal__form-field">
              <label class="modal__label" for="apartment">Квартира</label>
              <select id="apartment" v-model="appealData.apartment_id" class="modal__input">
                <option v-for="apartment in apartments" :key="apartment.id" :value="apartment.id">
                  {{ apartment.number }}
                </option>
              </select>
            </div>
            <div class="modal__form-field">
              <label class="modal__label" for="date">Срок</label>
              <input
                  id="date"
                  :value="formatDate(appealData.due_date)"
                  class="modal__input"
                  type="datetime-local"
                  @input="updateDueDate($event.target.value)"
              />
            </div>
          </div>

          <div class="modal__form-row">
            <div class="modal__form-field">
              <label class="modal__label" for="lastName">Фамилия</label>
              <input id="lastName" v-model="appealData.lastName" class="modal__input" type="text">
            </div>
            <div class="modal__form-field">
              <label class="modal__label" for="firstName">Имя</label>
              <input id="firstName" v-model="appealData.firstName" class="modal__input" type="text">
            </div>
            <div class="modal__form-field">
              <label class="modal__label" for="middleName">Отчество</label>
              <input id="middleName" v-model="appealData.patronymicName" class="modal__input" type="text">
            </div>
            <div class="modal__form-field">
              <label class="modal__label" for="phone">Телефон</label>
              <input id="phone" v-model="appealData.username" class="modal__input" type="tel">
            </div>
          </div>

          <div class="modal__form-row">
            <div class="modal__form-field modal__form-field--fullwidth">
              <label class="modal__label" for="description">Описание заявки</label>
              <textarea id="description" v-model="appealData.description" class="modal__textarea"></textarea>
            </div>
          </div>
        </div>
        <div class="modal__button-container">
          <button class="modal__button" type="submit">{{ isEditMode ? 'Сохранить' : 'Создать' }}</button>
        </div>
        <div v-if="error" class="modal__error">
          {{ error }}
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['appeal'],
  data() {
    return {
      appealData: this.appeal || {},
      isEditMode: !!this.appeal,
      error: '',
    };
  },
  computed: {
    premises() {
      return this.$store.getters.premises;
    },
    apartments() {
      return this.$store.getters.apartments;
    },
  },
  async created() {
    await this.$store.dispatch('fetchPremises');
    if (this.isEditMode && this.appealData.premise_id) {
      await this.$store.dispatch('fetchApartments', this.appealData.premise_id);
    }
  },
  methods: {
    async saveAppeal() {
      const url = this.isEditMode
          ? `https://dev.moydomonline.ru/api/appeals/v1.0/appeals/${this.appealData.id}/`
          : `https://dev.moydomonline.ru/api/appeals/v1.0/appeals/`;

      const method = this.isEditMode ? 'patch' : 'post';
      const headers = {
        Authorization: `Token ${this.$store.state.token}`,
        'Content-Type': 'application/json',
      };

      try {
        await axios({method, url, data: this.prepareData(), headers});
        this.$emit('close');
      } catch (error) {
        this.error = error.response?.data?.detail || 'Произошла ошибка. Попробуйте еще раз.';
        console.error('Ошибка:', error.response?.data);
      }
    },
    prepareData() {
      return {
        premise_id: this.appealData.premise_id,
        apartment_id: this.appealData.apartment_id,
        applicant: {
          first_name: this.appealData.firstName,
          last_name: this.appealData.lastName,
          patronymic_name: this.appealData.patronymicName,
          username: this.appealData.username,
        },
        description: this.appealData.description,
        due_date: this.appealData.due_date,
        status_id: this.isEditMode ? undefined : 1,
      };
    },
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      const datePart = date.toISOString().slice(0, 10);
      const timePart = date.toTimeString().slice(0, 5);
      return `${datePart}T${timePart}`;
    },
    updateDueDate(value) {
      this.appealData.due_date = new Date(value).toISOString();
    },
    handleOutsideClick(event) {
      if (!this.$el.querySelector('.modal__content').contains(event.target)) {
        this.$emit('close');
      }
    },
  },
};
</script>

<style lang="scss" scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000033;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;

  &__content {
    background-color: #fff;
    padding: 24px 32px;
    border-radius: 8px;
    width: 738px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    height: 40px;
  }

  &__title {
    font-size: 20px;
    font-weight: 500;
    color: #333333;
    cursor: default;
    line-height: 24px;
  }

  &__status {
    font-size: 18px;
    font-weight: 400;
    color: #333333;
    cursor: default;
    line-height: 20px;
  }

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #aaa;
    cursor: pointer;
    transition: color 0.3s;

    &:hover {
      color: #333;
    }
  }

  &__form-group {
    margin-bottom: 15px;

    &:last-of-type {
      margin-bottom: 24px;
    }
  }

  &__label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #666;
  }

  &__button-container {
    margin-top: auto; // Pushes the button to the bottom of the modal content
    display: flex;
    justify-content: flex-end; // Aligns the button to the right
  }

  &__button {
    padding: 10px 20px;
    font-size: 16px;
    color: #fff;
    background-color: #4CAF50;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #45a049;
    }
  }

  &__form-group {
    margin-bottom: 20px;
  }

  &__form-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 16px;

    &:last-of-type {
      margin-bottom: 0;
    }
  }

  &__form-field {
    flex: 1;

    &:last-of-type {
      margin-right: 0;
    }

    &--fullwidth {
      flex: 100%;
    }
  }

  &__label {
    display: block;
    margin-bottom: 5px;
    font-size: 14px;
    color: #50B053;
  }

  &__input,
  &__textarea {
    width: 100%;
    padding: 0 0 10px 0;
    font-size: 16px;
    border: 0;
    border-bottom: 1px solid #CCCCCC;
    outline: none;
    box-sizing: border-box;
  }

  &__textarea {
    resize: vertical;
    height: 131px;
  }

  &__error {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }
}
</style>