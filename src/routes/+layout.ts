import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { env } from '$env/dynamic/public';

export const load = async ({ depends, data, fetch }) => {
    depends('supabase:auth');

    const supabase = createSupabaseLoadClient({
        supabaseUrl: env.PUBLIC_SUPABASE_URL,
        supabaseKey: env.PUBLIC_SUPABASE_ANON_KEY,
        event: { fetch },
        serverSession: data?.session,
    });

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const userInfo = session?.user;
    const id = session?.user.id;

    return {
        supabase,
        session,
        user: userInfo,
    };
};