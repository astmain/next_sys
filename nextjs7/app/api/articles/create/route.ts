import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { title, content, author_id } = await request.json()
    
    if (!title || !content || !author_id) {
      return NextResponse.json({ success: false, message: '标题、内容和作者ID不能为空' })
    }

    const article = await prisma.tb_article.create({
      data: {
        title,
        content,
        author_id: parseInt(author_id)
      },
      include: {
        author: true
      }
    })

    return NextResponse.json({
      success: true,
      data: article
    })
  } catch (error) {
    console.error('Article create error:', error)
    return NextResponse.json({ success: false, message: '服务器错误' })
  }
} 