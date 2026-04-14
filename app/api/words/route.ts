import { NextResponse } from "next/server";
import { generateLearningPack } from "@/lib/learning-pack";
import { prisma } from "@/lib/prisma";
import { normalizeWordPayload } from "@/lib/validators";

export async function GET() {
  try {
    const words = await prisma.word.findMany({
      include: {
        examples: {
          orderBy: {
            createdAt: "asc"
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(words);
  } catch (error) {
    console.error("Failed to fetch words", error);
    return NextResponse.json({ error: "Failed to fetch words." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const payload = normalizeWordPayload(body);

    if (!payload) {
      return NextResponse.json({ error: "Word is required." }, { status: 400 });
    }

    const learningPack = await generateLearningPack(payload.word);

    const word = await prisma.word.create({
      data: {
        word: payload.word,
        meaning: payload.meaning || learningPack.koreanMeaning,
        koreanMeaning: learningPack.koreanMeaning,
        englishDefinition: learningPack.englishDefinition,
        notes: payload.notes
      }
    });

    await prisma.example.createMany({
      data: learningPack.examples.map((example) => ({
        wordId: word.id,
        sentence: example.sentence,
        koreanTranslation: example.koreanTranslation,
        type: example.type
      }))
    });

    return NextResponse.json(word, { status: 201 });
  } catch (error) {
    console.error("Failed to create word", error);
    return NextResponse.json({ error: "Failed to create word." }, { status: 500 });
  }
}
