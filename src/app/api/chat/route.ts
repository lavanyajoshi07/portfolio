import { NextRequest } from 'next/server'
import connectDB from '@/lib/db'
import { ChatConversation, Profile } from '@/models'
import { successResponse, errorResponse, getClientIp } from '@/lib/api'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId, messages: previousMessages = [] } = await req.json()

    if (!message || !sessionId) {
      return errorResponse('Message and sessionId are required', 400)
    }

    if (message.length > 5000) {
      return errorResponse('Message too long', 400)
    }

    await connectDB()

    // Get portfolio context
    const profile = await Profile.findOne().lean()

    // Build system prompt with portfolio context
    const systemPrompt = `You are a helpful AI assistant for ${profile?.name || 'a portfolio owner'}'s portfolio website.

Portfolio Context:
- Name: ${profile?.name || 'Not specified'}
- Title: ${profile?.title || 'Not specified'}
- About: ${profile?.bio || 'Not specified'}
- Skills: ${profile ? 'Multiple technical skills in various domains' : 'Not specified'}
- Location: ${profile?.location || 'Not specified'}

Your role:
1. Answer questions about the portfolio owner's background, skills, and projects
2. Provide information about their experience and expertise
3. Help visitors understand their qualifications
4. Guide visitors to relevant sections of the website
5. Be friendly, professional, and engaging

Keep responses concise (1-2 paragraphs max) and conversational. Always stay in character as a portfolio assistant.`

    // Call Claude API with conversation history
    const response = await client.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages: [
        ...previousMessages.map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        })),
        { role: 'user', content: message },
      ],
    })

    const assistantMessage =
      response.content[0].type === 'text' ? response.content[0].text : 'I encountered an error processing your request.'

    // Save to database
    try {
      let conversation = await ChatConversation.findOne({ sessionId })

      if (!conversation) {
        conversation = await ChatConversation.create({
          sessionId,
          messages: [],
        })
      }

      // Add messages to conversation
      conversation.messages.push({ role: 'user', content: message, timestamp: new Date() })
      conversation.messages.push({ role: 'assistant', content: assistantMessage, timestamp: new Date() })
      await conversation.save()
    } catch (dbError) {
      console.error('Error saving conversation:', dbError)
      // Continue even if DB save fails
    }

    return successResponse(
      { response: assistantMessage, sessionId },
      'Message processed successfully'
    )
  } catch (error) {
    console.error('Chat error:', error)

    if (error instanceof Error && error.message.includes('API')) {
      return errorResponse('AI service temporarily unavailable', 503)
    }

    return errorResponse('Failed to process chat message', 500)
  }
}