import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        appeals: [],
        appealCount: 0,
        currentPage: 1,
        pageSize: 10,
        token: localStorage.getItem('token') || '',
        premises: [],
        apartments: [],
    },
    mutations: {
        SET_APPEALS(state, {appeals, count, page, pageSize}) {
            Object.assign(state, {appeals, appealCount: count, currentPage: page, pageSize});
        },
        SET_PAGE_SIZE(state, pageSize) {
            state.pageSize = pageSize;
            state.currentPage = 1;
        },
        SET_TOKEN(state, token) {
            state.token = token;
            localStorage.setItem('token', token);
        },
        SET_PREMISES(state, premises) {
            state.premises = premises;
        },
        SET_APARTMENTS(state, apartments) {
            state.apartments = apartments;
        },
    },
    actions: {
        async login({commit}, credentials) {
            const {data} = await axios.post('https://dev.moydomonline.ru/api/auth/login/', credentials);
            commit('SET_TOKEN', data.key);
        },
        async fetchAppeals({commit, state}, {page = 1, page_size = state.pageSize, search = '', premise_id = ''} = {}) {
            try {
                const {data} = await axios.get('https://dev.moydomonline.ru/api/appeals/v1.0/appeals/', {
                    params: {page, page_size, search, premise_id},
                    headers: {Authorization: `Token ${state.token}`},
                });
                const appeals = data.results.map(({
                                                      id,
                                                      number,
                                                      created_at,
                                                      premise,
                                                      apartment,
                                                      applicant,
                                                      description,
                                                      due_date,
                                                      status
                                                  }) => ({
                    id,
                    number,
                    created_at: new Date(created_at).toLocaleDateString(),
                    premise: premise ? premise.short_address : 'N/A',
                    premise_id: premise?.id,
                    apartment_id: apartment?.id,
                    apartment: apartment?.number || '',
                    firstName: applicant.first_name,
                    lastName: applicant.last_name,
                    patronymicName: applicant.patronymic_name,
                    username: applicant.username,
                    description,
                    due_date,
                    status: status?.name || 'Unknown',
                }));
                commit('SET_APPEALS', {appeals, count: data.count, page, page_size});
            } catch (error) {
                console.error('Error fetching appeals:', error);
            }
        },
        async fetchPremises({commit, state}) {
            try {
                const {data} = await axios.get('https://dev.moydomonline.ru/api/geo/v2.0/user-premises/', {
                    headers: {Authorization: `Token ${state.token}`},
                });
                commit('SET_PREMISES', data.results);
            } catch (error) {
                console.error('Error fetching premises:', error);
            }
        },
        async fetchApartments({commit, state}, premiseId) {
            if (!premiseId) return;
            try {
                const {data} = await axios.get('https://dev.moydomonline.ru/api/geo/v1.0/apartments/', {
                    params: {premise_id: premiseId},
                    headers: {Authorization: `Token ${state.token}`},
                });
                commit('SET_APARTMENTS', data.results);
            } catch (error) {
                console.error('Ошибка при загрузке квартир:', error);
            }
        },
    },
    getters: {
        isAuthenticated: state => !!state.token,
        appeals: state => state.appeals,
        premises: state => state.premises,
        apartments: state => state.apartments,
    },
});