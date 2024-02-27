import { writable } from 'svelte/store';
import { supabase } from './supabase';

export const user = writable();

async function loadUser() {
    try {
        const { data, error } = await supabase.auth.getUser();
        if (error) throw error;
        user.set(data.user);
    } catch (error) {
        console.error('Erreur lors du chargement de l’utilisateur:', error);
    }
}

loadUser();
