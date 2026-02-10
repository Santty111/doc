/**
 * Ejecutar una vez para crear las empresas iniciales en MongoDB.
 * npx tsx scripts/seed-companies.ts
 * (o con ts-node según tu entorno)
 */
import mongoose from 'mongoose'
import { Company } from '../lib/models'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/medicontrol'

const companies = [
  { name: 'Ribel', code: 'RIB' },
  { name: 'Hiltexpoy', code: 'HIL' },
  { name: 'Interfibra', code: 'INT' },
  { name: 'Jaltextiles', code: 'JAL' },
]

async function seed() {
  await mongoose.connect(MONGODB_URI)
  for (const c of companies) {
    await Company.findOneAndUpdate(
      { name: c.name },
      { $setOnInsert: c },
      { upsert: true }
    )
  }
  console.log('Empresas creadas/actualizadas:', companies.length)
  await mongoose.disconnect()
}

seed().catch((e) => {
  console.error(e)
  process.exit(1)
})
