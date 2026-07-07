// js/supabase.js
const SUPABASE_URL = 'https://gxwdlxlxbpnqfraiippl.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd4d2RseGx4YnBucWZyYWlpcHBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1MTE0OTMsImV4cCI6MjA5ODA4NzQ5M30.AaEd2JSf3CMDaaLJRtOrQWBIpcKe0GlnznJ1rXMUmfg'


import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)


export async function isAdmin(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', userId)
    .single()
  
  if (error) return false
  return data?.role === 'admin'
}