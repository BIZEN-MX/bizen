
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('Testing connection to Supabase:', supabaseUrl)
  
  // Try to fetch topics
  const { data: topics, error: topicsError } = await supabase
    .from('topics')
    .select('*')
    .limit(5)

  if (topicsError) {
    console.error('Error fetching topics from Supabase:', topicsError.message)
  } else {
    console.log('Successfully fetched topics from Supabase:', topics?.length || 0)
    if (topics && topics.length > 0) {
      console.log('Sample topics:', topics.map(t => t.title))
    }
  }

  // Try to fetch courses
  const { data: courses, error: coursesError } = await supabase
    .from('courses')
    .select('*')
    .limit(5)

  if (coursesError) {
    console.error('Error fetching courses from Supabase:', coursesError.message)
  } else {
    console.log('Successfully fetched courses from Supabase:', courses?.length || 0)
  }
}

testConnection()
