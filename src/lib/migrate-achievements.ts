import connectDB from './db'
import { Achievement, AchievementSettings } from '../models'

async function migrate() {
  try {
    console.log('Connecting to database for migration...')
    await connectDB()
    console.log('Database connected.')

    console.log('Unsetting deprecated fields on achievements...')
    const resultAch = await Achievement.updateMany(
      {},
      { $unset: { featured: "", showInTimeline: "" } }
    )
    console.log(`Achievements migration complete: matched ${resultAch.matchedCount}, modified ${resultAch.modifiedCount}`)

    console.log('Unsetting deprecated fields on achievement settings...')
    const resultSettings = await AchievementSettings.updateMany(
      {},
      { $unset: { showFeaturedHero: "", showTimeline: "" } }
    )
    console.log(`Settings migration complete: matched ${resultSettings.matchedCount}, modified ${resultSettings.modifiedCount}`)

    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
