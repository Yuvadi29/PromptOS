import dotenv from 'dotenv';
dotenv.config();
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@supabase/supabase-js'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!)

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function backfillEmbeddings() {
  console.log('🚀 Starting backfill with Gemini embeddings...')

  const { data: prompts, error } = await supabase
    .from('prompts')
    .select('id, prompt_value')
    .is('embedding', null)

  if (error) throw error
  if (!prompts?.length) return console.log('✅ Nothing to update!')

  console.log(`Found ${prompts.length} prompts to update.`)

  const embeddingModel = genAI.getGenerativeModel({ model: 'text-embedding-004' })

  for (const p of prompts) {
    try {
      const result = await embeddingModel.embedContent(p.prompt_value)
      const embedding = result.embedding.values

      await supabase.from('prompts').update({ embedding }).eq('id', p.id)
      console.log(`✅ Updated prompt ${p.id}`)
    } catch (err: any) {
      console.error(`❌ Failed for prompt ${p.id}:`, err.message)
    }
  }

  console.log('🎉 Backfill complete!')
}

backfillEmbeddings().catch(console.error)
