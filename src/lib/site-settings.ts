import connectDB from './db'
import { SiteSettings } from '@/models' // adjust path to your models file

export async function getSiteSettings() {
  await connectDB() // ensure DB connection

  try {
    const settings = await SiteSettings.findOne() // Mongoose query
    return settings
  } catch (error) {
    console.error('Failed to load site settings:', error)
    return null
  }
}
