import connectDB from './db'

async function migrate() {
  try {
    console.log('Connecting to database for dropping timelines...')
    const conn = await connectDB()
    console.log('Database connected.')

    // Drop the collection
    const db = conn.connection.db
    if (db) {
      const collections = await db.listCollections({ name: 'timelines' }).toArray()
      if (collections.length > 0) {
        await db.dropCollection('timelines')
        console.log("Collection 'timelines' dropped successfully.")
      } else {
        console.log("Collection 'timelines' does not exist or has already been dropped.")
      }
    }

    console.log('Migration completed successfully!')
    process.exit(0)
  } catch (error) {
    console.error('Migration failed:', error)
    process.exit(1)
  }
}

migrate()
