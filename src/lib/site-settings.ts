import connectDB from './db'
import { SiteSettings, Profile } from '@/models' // adjust path to your models file

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

export async function getProfile() {
  await connectDB()

  try {
    const profile = await Profile.findOne().lean()
    return profile
  } catch (error) {
    console.error('Failed to load profile:', error)
    return null
  }
}
