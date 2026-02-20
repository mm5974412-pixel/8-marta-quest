import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase credentials not configured');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function createPostcard(data: any) {
  const { data: postcard, error } = await supabase
    .from('postcards')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return postcard;
}

export async function getPostcard(id: string) {
  const { data, error } = await supabase
    .from('postcards')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Открытка не найдена');
    }
    throw error;
  }
  return data;
}

export async function incrementViewCount(id: string) {
  const { error } = await supabase.rpc('increment_view_count', { postcard_id: id });
  if (error) console.error('Error incrementing view count:', error);
}

// Alternative if RPC not available
export async function updatePostcardViews(id: string) {
  const postcard = await getPostcard(id);
  const { error } = await supabase
    .from('postcards')
    .update({ view_count: (postcard.view_count || 0) + 1 })
    .eq('id', id);
  
  if (error) console.error('Error updating views:', error);
}
