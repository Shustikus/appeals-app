<template>
  <div class="auth">
    <div class="auth__box">
      <div class="auth__title">
        <span class="auth__title-text">Авторизация</span>
      </div>
      <form class="auth__form" @submit.prevent="login">
        <div class="auth__field">
          <label class="auth__label" for="phone">Логин или Телефон</label>
          <div class="auth__input-group">
            <span class="auth__input-icon">
        <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><path
            d="M18.93 20q-2.528 0-5.184-1.266t-4.944-3.555q-2.27-2.288-3.536-4.935T4 5.07q0-.45.3-.76T5.05 4h2.473q.408 0 .712.257t.411.659L9.142 7.3q.07.42-.025.733t-.333.513L6.59 10.592q.616 1.117 1.361 2.076t1.59 1.817q.87.87 1.874 1.62q1.004.749 2.204 1.414l2.139-2.177q.244-.263.549-.347q.304-.083.674-.033l2.103.43q.408.1.662.411t.254.712v2.435q0 .45-.31.75t-.76.3"
            fill="currentColor"/>
        </svg>
    </span>
            <input id="phone" v-model="username" class="auth__input" placeholder="+7" type="text">
          </div>
        </div>
        <div class="auth__field" style="margin-bottom: 28px;">
          <div class="auth__input-group">
            <span class="auth__input-icon">
              <svg height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><path
                  d="M6.616 21q-.667 0-1.141-.475T5 19.386v-8.77q0-.666.475-1.14T6.615 9H8V7q0-1.671 1.165-2.835Q10.329 3 12 3t2.836 1.165T16 7v2h1.385q.666 0 1.14.475t.475 1.14v8.77q0 .666-.475 1.14t-1.14.475zM12 16.5q.633 0 1.066-.434q.434-.433.434-1.066t-.434-1.066T12 13.5t-1.066.434Q10.5 14.367 10.5 15t.434 1.066q.433.434 1.066.434M9 9h6V7q0-1.25-.875-2.125T12 4t-2.125.875T9 7z"
                  fill="currentColor"/>
              </svg>
            </span>
            <input id="password" v-model="password" :type="passwordVisible ? 'text' : 'password'" class="auth__input"
                   placeholder="Пароль">
            <button class="auth__toggle-password" type="button" @click="togglePasswordVisibility">
              <span class="auth__input-icon">
                <svg v-if="!passwordVisible" height="1em" viewBox="0 0 24 24" width="1em"
                     xmlns="http://www.w3.org/2000/svg"><path
                    d="M11.83 9L15 12.16V12a3 3 0 0 0-3-3zm-4.3.8l1.55 1.55c-.05.21-.08.42-.08.65a3 3 0 0 0 3 3c.22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53a5 5 0 0 1-5-5c0-.79.2-1.53.53-2.2M2 4.27l2.28 2.28l.45.45C3.08 8.3 1.78 10 1 12c1.73 4.39 6 7.5 11 7.5c1.55 0 3.03-.3 4.38-.84l.43.42L19.73 22L21 20.73L3.27 3M12 7a5 5 0 0 1 5 5c0 .64-.13 1.26-.36 1.82l2.93 2.93c1.5-1.25 2.7-2.89 3.43-4.75c-1.73-4.39-6-7.5-11-7.5c-1.4 0-2.74.25-4 .7l2.17 2.15C10.74 7.13 11.35 7 12 7"
                    fill="currentColor"/>
                 </svg>
	<svg v-if="passwordVisible" height="1em" viewBox="0 0 24 24" width="1em" xmlns="http://www.w3.org/2000/svg"><path
      d="M12 9a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3m0 8a5 5 0 0 1-5-5a5 5 0 0 1 5-5a5 5 0 0 1 5 5a5 5 0 0 1-5 5m0-12.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5"
      fill="currentColor"/>
  </svg>
              </span>
            </button>
          </div>
        </div>
        <button class="auth__submit" type="submit">Войти</button>
      </form>
      <p v-if="error" class="auth__error">{{ error }}</p>
    </div>
  </div>

</template>
<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      error: null,
      passwordVisible: false,
    };
  },
  methods: {
    async login() {
      await this.$store.dispatch('login', {
        username: this.username,
        password: this.password,
      })
          .then(() => {
            this.$router.push('/');
          })
          .catch(() => {
            this.error = 'Неправильные данные';
          });
    },
    togglePasswordVisibility() {
      this.passwordVisible = !this.passwordVisible;
    },
  },
};
</script>

<style lang="scss" scoped>
.auth {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: url('../assets/image.jpg') no-repeat center center;
  background-size: cover;

  &__box {
    position: relative;
    background: #fff;
    padding: 52px 20px 20px 20px;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
    text-align: center;
    width: 340px;
  }

  &__title {
    position: absolute;
    top: -19px;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    background-color: #4CAF50;
    padding: 10px;
    border-radius: 5px;
    width: 308px;
    height: 56px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__title-text {
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: white;
  }

  &__form {
    display: flex;
    flex-direction: column;
    padding-top: 34px;
    gap: 8px;
  }

  &__field {
    text-align: left;
  }

  &__label {
    font-size: 12px;
    display: block;
    margin-left: 45px;
    color: #50B053;
  }

  &__input-group {
    display: flex;
    align-items: center;
    overflow: hidden;
    border-bottom: 1px solid #CCCCCC;

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

  &__toggle-password {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
  }

  &__submit {
    background-color: #4CAF50;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    width: 110px;
    margin: 0 auto;
    display: block;

    &:hover {
      background-color: #45a049;
    }
  }

  &__error {
    color: #d32f2f;
    font-size: 14px;
    margin-top: 10px;
    text-align: center;
  }
}
</style>